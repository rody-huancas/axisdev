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
    <main className="relative flex min-h-screen items-center overflow-hidden bg-[#f7f8fb] px-6 py-12">
      <div className="pointer-events-none absolute left-0 top-0 h-105 w-105 -translate-x-1/3 -translate-y-1/3 rounded-full bg-[#e6ecff] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-105 w-105 translate-x-1/3 translate-y-1/3 rounded-full bg-[#eaf7ff] blur-3xl" />

      <section className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="space-y-8">
          <div className="flex items-center">
            <Image
              src="/axisdev.webp"
              alt="AxisDev"
              width={190}
              height={56}
              priority
              className="h-14 w-auto"
            />
          </div>

          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
              AxisDev Workspace Hub
            </p>
            <h1 className="text-6xl font-black text-slate-900">
              Tu Google Workspace,
              <span className="block text-slate-900">
                <span className="bg-linear-to-r from-sky-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  unificado y accionable.
                </span>
              </span>
            </h1>
            <p className="text-base text-slate-500">
              Centraliza Drive, Calendar, Tasks y Gmail con una vista clara del
              trabajo y el contexto. Menos ruido, mas foco.
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                axisdev.auth
              </p>
              <span className="rounded-full border border-slate-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                OAuth
              </span>
            </div>
            <UserAuthForm />
            <p className="mt-4 text-xs text-slate-400">
              Acceso seguro con Google OAuth 2.0.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            {[
              "Sincronizacion rapida",
              "Visibilidad total",
              "Control centralizado",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-white px-3 py-1"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-6 -top-6 h-full w-full rounded-[40px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.06)]" />
          <div className="relative overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-[0_22px_48px_rgba(15,23,42,0.14)]">
            <div className="relative aspect-4/3 w-full">
              <Image
                src="/image-1.jpeg"
                alt="Vista previa AxisDev"
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-white/80 via-white/10 to-transparent" />
              <div className="absolute bottom-6 left-6 rounded-2xl border border-white/70 bg-white/85 px-4 py-3 backdrop-blur">
                <p className="text-xs font-semibold text-slate-700">Workspace preview</p>
                <p className="text-[11px] text-slate-500">
                  Visibilidad en tiempo real del stack
                </p>
              </div>
            </div>
            <div className="grid gap-3 px-6 py-5 md:grid-cols-3">
              {[
                "Drive + Calendar",
                "Tasks + Gmail",
                "Vista unificada",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500"
                >
                  {item}
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
