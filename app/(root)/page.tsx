import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { UserAuthForm } from "@/components/shared/user-auth-form";
import { LandingLogo, LandingBadge, LandingHeadline, LandingDescription, LandingPreview, LandingTags, LandingFooter } from "@/components/landing";

const HomePage = async () => {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <main className="flex h-dvh flex-col overflow-hidden" style={{ background: "#EEEDE7" }}>
      <section className="flex flex-1 min-h-0 items-center">
        <div className="mx-auto grid w-full max-w-275 grid-cols-1 items-center gap-14 px-5 md:px-14 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6">
            <LandingLogo />

            <LandingBadge />

            <LandingHeadline />

            <LandingDescription />

            <div className="max-w-95 rounded-2xl border border-[#DDDBD3] bg-white p-4.5 flex flex-col gap-3">
              <span className="text-[9px] uppercase tracking-[0.2em] text-gray-700 font-medium" style={{ fontFamily: "var(--font-geist-mono)" }}>
                Acceso seguro
              </span>

              <UserAuthForm />

              <p className="text-center text-[9px] text-gray-600 tracking-[0.08em]" style={{ fontFamily: "var(--font-geist-mono)" }}>
                Sin contraseña · Acceso con tu cuenta de Google
              </p>
            </div>

            <LandingTags />
          </div>

          <LandingPreview />
        </div>
      </section>

      <LandingFooter />
    </main>
  );
};

export default HomePage;