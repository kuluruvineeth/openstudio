import { HeroParallaxDemo } from "@/components/marketing/hero-parallax";
import { TextGenerateEffectDemo } from "@/components/marketing/overview-text";
import { SparklesPreview } from "@/components/marketing/sparkles-preview";
import { LampDemo } from "@/components/ui/lamp";
import { SpotlightPreview } from "@/components/ui/spotlight";

export default async function IndexPage() {
  return (
    <>
      <section className="space-y-6 pb-12 pt-16 lg:py-28">
        <HeroParallaxDemo />
        {/* <SparklesPreview /> */}

        {/* <LampDemo />
        <SpotlightPreview /> */}
      </section>
      {/* <section className="text-center -mt-80 flex items-center justify-center">
        <TextGenerateEffectDemo />
      </section> */}
    </>
  );
}
