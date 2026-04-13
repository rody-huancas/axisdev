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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0f0f12] px-6 py-12">
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#6366f1]/30 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[#06b6d4]/20 blur-[100px]" />
      <div className="pointer-events-none absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-[#8b5cf6]/20 blur-[80px]" />

      <section className="mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-10">
          <div className="flex items-center gap-3">
            <Image
              src="/icon-axisdev.png"
              alt="AxisDev"
              width={56}
              height={56}
              priority
              className="h-14 w-14 rounded-2xl"
            />
            <span className="text-xl font-bold text-white">AxisDev</span>
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

            <h1 className="text-5xl font-bold leading-tight text-white lg:text-6xl">
              Tu Google Workspace,
              <span className="block mt-2 bg-linear-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                unificado y accionable.
              </span>
            </h1>

            <p className="max-w-lg text-base text-zinc-400">
              Centraliza Drive, Calendar, Tasks y Gmail con una vista clara del
              trabajo y el contexto. Menos ruido, más foco.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500" />
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                  axisdev.auth
                </p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                OAuth 2.0
              </span>
            </div>
            <UserAuthForm />
            <p className="mt-4 text-xs text-zinc-500">
              Acceso seguro con tu cuenta de Google.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { icon: "⚡", label: "Sincronizacion rapida" },
              { icon: "👁", label: "Visibilidad total" },
              { icon: "🎯", label: "Control centralizado" },
            ].map((item) => (
              <span
                key={item.label}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-400"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-4 -top-4 h-full w-full rounded-[40px] border border-white/10 bg-white/5" />
          <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.02] shadow-2xl backdrop-blur">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/image-1.jpeg"
                alt="Vista previa AxisDev"
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover opacity-80"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0f0f12] via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-black/60 px-5 py-4 backdrop-blur">
                <p className="text-sm font-semibold text-white">Workspace preview</p>
                <p className="text-xs text-zinc-400 mt-1">
                  Visibilidad en tiempo real de tu stack de Google
                </p>
              </div>

              <div className="absolute right-6 top-6 flex gap-2">
                <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 backdrop-blur">
                  <p className="text-xs font-medium text-white">Drive</p>
                  <p className="text-[10px] text-zinc-400">12 archivos</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 backdrop-blur">
                  <p className="text-xs font-medium text-white">Tasks</p>
                  <p className="text-[10px] text-zinc-400">5 pendientes</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 px-6 py-5">
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
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <span className="text-lg">{item.icon}</span>
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