import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { UserAuthForm } from "@/components/shared/user-auth-form";

const HomePage = async () => {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-slate-950">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_closest-side,rgba(99,102,241,0.15),transparent)]" />
      </div>

      <section className="flex w-full max-w-6xl flex-col gap-12 px-6 py-8 lg:flex-row lg:items-center lg:gap-20">
        <div className="space-y-10 lg:flex-1 lg:min-w-0">
          <div className="flex items-center gap-3">
            <Image
              src="/icon-axisdev.png"
              alt="AxisDev"
              width={48}
              height={48}
              priority
              className="h-12 w-12 rounded-xl"
            />
            <span className="text-2xl font-bold text-white">AxisDev</span>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-emerald-400">
                Google Workspace Hub
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white lg:text-5xl">
                Tu Google Workspace,
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  unificado
                </span>
                <span className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl text-zinc-600">
                  +
                </span>
                <span className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  accionable
                </span>
              </div>
            </div>

            <p className="max-w-md text-base text-zinc-400 leading-relaxed">
              Centraliza Drive, Calendar, Tasks y Gmail con una vista clara del
              trabajo y el contexto. Menos ruido, más foco.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500" />
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  axisdev.auth
                </p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                OAuth 2.0
              </span>
            </div>
            <UserAuthForm />
            <p className="mt-3 text-xs text-zinc-500">
              Acceso seguro con tu cuenta de Google
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { icon: "⚡", label: "Sincronizacion" },
              { icon: "👁", label: "Visibilidad" },
              { icon: "🎯", label: "Control" },
            ].map((item) => (
              <span
                key={item.label}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-400"
              >
                <span>{item.icon}</span>
                <span className="text-xs">{item.label}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="relative lg:flex-1">
          <div className="absolute -left-3 -top-3 h-full w-full rounded-[32px] border border-white/10 bg-white/5" />
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.02] shadow-2xl backdrop-blur-sm">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/image-1.jpeg"
                alt="Vista previa AxisDev"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover opacity-70"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/10 bg-black/50 px-4 py-3 backdrop-blur">
                <p className="text-sm font-medium text-white">Workspace preview</p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Visibilidad en tiempo real
                </p>
              </div>

              <div className="absolute right-4 top-4 flex gap-2">
                <div className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 backdrop-blur">
                  <p className="text-xs font-medium text-white">Drive</p>
                  <p className="text-[10px] text-zinc-400">12 archivos</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 backdrop-blur">
                  <p className="text-xs font-medium text-white">Tasks</p>
                  <p className="text-[10px] text-zinc-400">5 pendientes</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 px-5 py-4">
              {[
                { icon: "📁", label: "Drive" },
                { icon: "📅", label: "Calendar" },
                { icon: "📧", label: "Gmail" },
                { icon: "✅", label: "Tasks" },
                { icon: "☁️", label: "Storage" },
                { icon: "👥", label: "Contacts" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                >
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-xs font-medium text-zinc-300">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;