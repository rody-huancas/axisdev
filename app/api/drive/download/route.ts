import { auth } from "@/auth";
import archiver from "archiver";
import { PassThrough, Readable } from "stream";

export const runtime = "nodejs";

type DriveItem = {
  id              : string;
  name            : string;
  mimeType        : string;
  shortcutDetails?: {
    targetId      : string;
    targetMimeType: string;
  };
};

type FileEntry = {
  id      : string;
  name    : string;
  mimeType: string;
  path    : string;
};

const driveBase = "https://www.googleapis.com/drive/v3/files";

const getResponseTextSafe = async (response: Response) => {
  try {
    return await response.text();
  } catch {
    return "";
  }
};

const formatGoogleError = async (response: Response) => {
  const text = await getResponseTextSafe(response);
  if (!text) {
    return `Google API error ${response.status}`;
  }
  try {
    const parsed = JSON.parse(text) as { error?: { message?: string } };
    const message = parsed?.error?.message;
    if (message) {
      return `Google API ${response.status}: ${message}`;
    }
  } catch {
    // ignore
  }
  return `Google API ${response.status}: ${text.slice(0, 300)}`;
};

const exportMap: Record<string, { mime: string; ext: string }> = {
  "application/vnd.google-apps.document": {
    mime: "application/pdf",
    ext: ".pdf",
  },
  "application/vnd.google-apps.spreadsheet": {
    mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ext: ".xlsx",
  },
  "application/vnd.google-apps.presentation": {
    mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ext: ".pptx",
  },
  "application/vnd.google-apps.drawing": {
    mime: "image/png",
    ext: ".png",
  },
};

const isFolder = (mimeType: string) => mimeType === "application/vnd.google-apps.folder";
const isShortcut = (mimeType: string) => mimeType === "application/vnd.google-apps.shortcut";
const isGoogleWorkspaceFile = (mimeType: string) => mimeType.startsWith("application/vnd.google-apps.") && !isFolder(mimeType) && !isShortcut(mimeType);

const sanitizeName = (name: string) => name.replaceAll("/", "-");

const normalizeItem = (item: DriveItem): DriveItem => {
  const name = sanitizeName(item.name);

  if (isShortcut(item.mimeType) && item.shortcutDetails?.targetId) {
    return {
      id: item.shortcutDetails.targetId,
      name,
      mimeType: item.shortcutDetails.targetMimeType,
    };
  }

  return {
    ...item,
    name,
  };
};

const getItem = async (id: string, token: string): Promise<DriveItem> => {
  const response = await fetch(
    `${driveBase}/${id}?fields=id,name,mimeType,shortcutDetails(targetId,targetMimeType)&supportsAllDrives=true`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!response.ok) {
    throw new Error(await formatGoogleError(response));
  }

  const data = (await response.json()) as DriveItem;
  return normalizeItem(data);
};

const listChildren = async (folderId: string, token: string) => {
  const items: DriveItem[] = [];
  let pageToken: string | undefined;

  do {
    const url = new URL(driveBase);
    url.searchParams.set("q", `'${folderId}' in parents and trashed = false`);
    url.searchParams.set("fields", "nextPageToken, files(id,name,mimeType,shortcutDetails(targetId,targetMimeType))");
    url.searchParams.set("pageSize", "1000");
    url.searchParams.set("supportsAllDrives", "true");
    url.searchParams.set("includeItemsFromAllDrives", "true");
    url.searchParams.set("corpora", "allDrives");
    url.searchParams.set("spaces", "drive");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(await formatGoogleError(response));
    }

    const data = (await response.json()) as {
      files?: DriveItem[];
      nextPageToken?: string;
    };

    const batch = (data.files ?? []).map((item) => normalizeItem(item));
    items.push(...batch);
    pageToken = data.nextPageToken ?? undefined;
  } while (pageToken);

  return items;
};

const collectEntries = async (
  item: DriveItem,
  token: string,
  prefix: string,
  entries: FileEntry[],
  emptyDirs: string[],
) => {
  if (!isFolder(item.mimeType)) {
    entries.push({
      id: item.id,
      name: item.name,
      mimeType: item.mimeType,
      path: `${prefix}${item.name}`,
    });
    return;
  }

  const children = await listChildren(item.id, token);
  if (!children.length) {
    emptyDirs.push(`${prefix}${item.name}/`);
    return;
  }

  const nextPrefix = `${prefix}${item.name}/`;
  for (const child of children) {
    await collectEntries(child, token, nextPrefix, entries, emptyDirs);
  }
};

const downloadFileStream = async (item: DriveItem, token: string) => {
  const exportInfo = exportMap[item.mimeType] ?? (isGoogleWorkspaceFile(item.mimeType) ? { mime: "application/pdf", ext: ".pdf" } : undefined);
  const url = exportInfo
    ? `${driveBase}/${item.id}/export?mimeType=${encodeURIComponent(exportInfo.mime)}&supportsAllDrives=true`
    : `${driveBase}/${item.id}?alt=media&supportsAllDrives=true`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(await formatGoogleError(response));
  }

  const extension   = exportInfo?.ext ?? "";
  const filename    = exportInfo ? `${item.name}${extension}` : item.name;
  const contentType = exportInfo?.mime ?? response.headers.get("content-type") ?? "application/octet-stream";
  const body        = response.body as unknown as ReadableStream<Uint8Array> | null;

  if (!body) {
    throw new Error("Missing drive response body");
  }

  return { body, filename, contentType };
};

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = (await request.json()) as { ids?: string[] };
    const ids = body.ids?.filter(Boolean) ?? [];

    if (!ids.length) {
      return new Response("Missing ids", { status: 400 });
    }

    const token = session.accessToken;
    const items = await Promise.all(ids.map((id) => getItem(id, token)));

    if (items.length === 1 && !isFolder(items[0].mimeType)) {
      const file = items[0];
      const { body, filename, contentType } = await downloadFileStream(file, token);

      return new Response(body, {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    const entries: FileEntry[] = [];
    const emptyDirs: string[] = [];

    for (const item of items) {
      await collectEntries(item, token, "", entries, emptyDirs);
    }

    const archive = archiver("zip", { zlib: { level: 9 } });
    const stream = new PassThrough();

    archive.on("error", (error) => {
      stream.destroy(error);
    });

    archive.pipe(stream);

    emptyDirs.forEach((dir) => {
      archive.append("", { name: dir });
    });

    const skipped: Array<{ path: string; reason: string }> = [];

    for (const entry of entries) {
      try {
        const { body, filename } = await downloadFileStream(
          { id: entry.id, name: entry.name, mimeType: entry.mimeType },
          token,
        );
        const filePath = `${entry.path.slice(0, -entry.name.length)}${filename}`;

        const nodeStream = Readable.fromWeb(body as unknown as any);
        archive.append(nodeStream, { name: filePath });
      } catch (error) {
        skipped.push({
          path: entry.path,
          reason: error instanceof Error ? error.message : "download_failed",
        });
      }
    }

    if (skipped.length) {
      const report = skipped
        .map((item) => `- ${item.path}\n  ${item.reason}`)
        .join("\n\n");
      archive.append(report + "\n", { name: "__skipped__.txt" });
    }

    await archive.finalize();

    const webStream = Readable.toWeb(stream) as unknown as globalThis.ReadableStream;

    return new Response(webStream, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=drive-download.zip",
      },
    });
  } catch (error) {
    console.error("/api/drive/download failed", error);
    const message = error instanceof Error ? error.message : "Failed to generate download";
    return new Response(message, { status: 500 });
  }
}
