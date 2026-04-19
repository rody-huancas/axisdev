import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LandingLogo, LandingBadge, LandingHeadline, LandingDescription, LandingPreview, LandingTags, LandingFooter, LandingAuthCard } from "@/components/landing";

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

            <LandingAuthCard />

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
