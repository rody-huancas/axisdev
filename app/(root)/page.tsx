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
    <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#09090b]">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(0,0,0,0))]" />
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#26262620_1px,transparent_1px),linear-gradient(to_bottom,#26262620_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-violet-600/20 blur-[100px]" />
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-cyan-600/15 blur-[100px]" />
      </div>

      <div className="flex w-full max-w-5xl flex-col items-center gap-12 px-6 lg:flex-row lg:justify-between lg:gap-16">
        <div className="w-full max-w-lg space-y-8">
          <div className="flex items-center gap-3">
            <Image src="/icon-axisdev.png" alt="AxisDev" width={48} height={48} priority className="h-12 w-12 rounded-xl" />
            <span className="text-2xl font-bold text-white">AxisDev</span>
          </div>

          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-emerald-400">Google Workspace Hub</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-5xl font-extrabold leading-[1.1] text-white tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Tu Google Workspace,
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-5xl font-extrabold leading-[1.1] tracking-tight bg-gradient-to-r from-white to-white bg-clip-text text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)', color: 'transparent' }}>
                  unificado
                </span>
                <span className="text-4xl font-bold text-zinc-700">+</span>
                <span className="text-5xl font-extrabold leading-[1.1] tracking-tight text-white">
                  accionable
                </span>
              </div>
            </div>

            <p className="text-base text-zinc-400 leading-relaxed">
              Centraliza Drive, Calendar, Tasks y Gmail con una vista clara del trabajo y el contexto.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500" />
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">axisdev.auth</p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-zinc-500">OAuth 2.0</span>
            </div>
            <UserAuthForm />
            <p className="mt-2 text-xs text-zinc-500">Acceso seguro con tu cuenta de Google</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["⚡ Sincronizacion", "👁 Visibilidad", "🎯 Control"].map((item) => (
              <span key={item} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-400">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="hidden lg:block w-full max-w-md">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-2xl">
            <div className="relative aspect-[4/3] w-full">
              <Image src="/image-1.jpeg" alt="Preview" fill sizes="400px" className="object-cover opacity-70" priority />
              <div className="absolute inset-0 bg-linear-to-t from-[#09090b] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-white/10 bg-black/50 px-3 py-2 backdrop-blur">
                <p className="text-sm font-medium text-white">Workspace preview</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 p-3">
              {["📁 Drive", "📅 Calendar", "📧 Gmail", "✅ Tasks", "☁️ Storage", "👥 Contacts"].map((item) => (
                <div key={item} className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-zinc-300">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;