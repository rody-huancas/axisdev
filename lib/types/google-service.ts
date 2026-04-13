export type ServiceResult<T> = | { ok: true; data: T } | { ok: false; error: string };

export type ArchivoReciente = {
  id         : string;
  nombre     : string;
  tipo       : string;
  mimeType   : string;
  sizeBytes  : number;
  actualizado: string;
};

export type EventoCalendario = {
  id          : string;
  titulo      : string;
  inicio      : string;
  fin         : string;
  inicioIso   : string;
  organizador?: string;
};

export type StorageInfo = {
  usadoGb   : number;
  limiteGb  : number;
  porcentaje: number;
};

export type TareaPendiente = {
  id          : string;
  titulo      : string;
  estado      : "completada" | "pendiente";
  vence      ?: string;
  descripcion?: string;
  parent     ?: string;
  tasklist   ?: string;
};

export type GmailMensaje = {
  id       : string;
  asunto   : string;
  remitente: string;
  snippet  : string;
};

export type DriveFile = {
  id            : string;
  nombre        : string;
  mimeType      : string;
  actualizado   : string;
  sizeBytes     : number;
  iconLink     ?: string;
  webViewLink  ?: string;
  thumbnailLink?: string;
};