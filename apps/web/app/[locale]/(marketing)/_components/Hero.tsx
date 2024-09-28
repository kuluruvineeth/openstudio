"use client";

import { useRouter } from "next/navigation";
import { m } from "framer-motion";
import ShimmerButton from "@openstudio/ui/components/ShimmerButton";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import HeroVideoDialog from "./HeroVideoDialog";
import { Suspense } from "react";

const Hero = () => {
  const router = useRouter();

  return (
    <m.section
      id="hero"
      initial="show"
      whileInView={"show"}
      animate="show"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.02,
          },
        },
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className={`relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff0000] to-[#a50000]  sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] transition-opacity duration-500 ${"opacity-80 dark:opacity-60 "}`}
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-36 "
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className={`relative left-[calc(50%+13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[135deg] bg-gradient-to-tr from-[#ff0000] to-[#a50000] sm:left-[calc(50%+30rem)] sm:w-[80rem]  transition-opacity duration-500 ${"opacity-80 dark:opacity-60 "}`}
        />
      </div>
      <div className="py-20 min-h-screen">
        <div className="max-w-screen flex flex-col items-center py-20 gap-6">
          <Image
            alt="logo"
            loading="lazy"
            width={63}
            height={55}
            decoding="async"
            data-nimg="1"
            className="w-[40px] h-[35px] sm:w-[58.36px] sm:h-[50.61px]"
            src="/images/logo.svg"
          />
          <p className="text-[18px] leading-[19.8px] sm:text-[24px] sm:leading-[26.4px] font-jakarta font-[700] text-center bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
            One-stop platform
          </p>
          <m.h1
            className="flex flex-col md:flex-row text-5xl md:text-7xl font-bold justify-center text-center md:h-max"
            variants={{
              hidden: { opacity: 0, y: -10 },
              show: { opacity: 1, y: 0, transition: { type: "spring" } },
            }}
          >
            <span className="text-primary-50 leading-none tracking-tight">
              <span className="bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
                Your ultimate AI assistant
                <br /> for your youtube channel
              </span>
            </span>
          </m.h1>
          <m.p
            className="text-gray-500 leading-relaxed text-xl"
            variants={{
              hidden: { opacity: 0, y: -10 },
              show: { opacity: 1, y: 0, transition: { type: "spring" } },
            }}
          >
            Grow your audience, capture insights, and scale your channel.
          </m.p>
          <m.div
            className="flex md:flex-col items-center justify-center w-[500px]"
            variants={{
              hidden: { opacity: 0, y: -10 },
              show: { opacity: 1, y: 0, transition: { type: "spring" } },
            }}
          >
            <div className="grid md:grid-cols-1 place-items-center">
              <ShimmerButton
                className="shadow-2xl transition-all duration-300 hover:shadow-[0_0_40px_8px_rgba(185,28,28,0.5)]"
                background="radial-gradient(ellipse 80% 70% at 50% 120%, #f59e0b, #B91C1C)"
                onClick={() => {
                  router.push("/login");
                }}
              >
                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-2xl">
                  Open Studio
                </span>
                <ChevronRight className="h-5 w-5 duration-300 ease-in-out transform group-hover:translate-x-1 m-auto" />
              </ShimmerButton>
            </div>
          </m.div>
        </div>
        <m.div
          className="mx-auto max-w-[1200px]"
          variants={{
            hidden: { opacity: 0, y: -10 },
            show: { opacity: 1, y: 0, transition: { type: "spring" } },
          }}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <HeroVideoDialog
              videoSrc="https://www.youtube.com/embed/WDNwUIBpsNk?autoplay=1"
              className="block rounded-xl border shadow-2xl"
              animationStyle="top-in-bottom-out"
            />
          </Suspense>
        </m.div>
      </div>
    </m.section>
  );
};

export default Hero;
