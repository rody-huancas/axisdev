import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LandingLogo, LandingBadge, LandingHeadline, LandingDescription, LandingPreview, LandingTags, LandingFooter, LandingAuthCard } from "@/components/landing";

const HomePage = async () => {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <main
      className="relative isolate flex h-dvh flex-col overflow-x-hidden overflow-y-auto"
      style={{
        background:
          "radial-gradient(900px 520px at 18% 8%, rgba(191, 239, 56, 0.35), transparent 60%), radial-gradient(900px 520px at 88% 22%, rgba(17, 17, 17, 0.06), transparent 55%), #EEEDE7",
      }}
    >
      <section className="flex flex-1 min-h-0 items-center py-10 md:py-14">
        <div className="mx-auto grid w-full max-w-310 grid-cols-1 items-center gap-14 px-5 md:px-14 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6 axis-fade-up">
            <LandingLogo />

            <LandingBadge />

            <LandingHeadline />

            <LandingDescription />

            <LandingAuthCard />

            <LandingTags />
          </div>

          <div className="axis-fade-up" style={{ animationDelay: "120ms" }}>
            <LandingPreview />
          </div>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
};

export default HomePage;
