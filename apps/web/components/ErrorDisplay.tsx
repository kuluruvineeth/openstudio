"use client";

import { logOut } from "@/utils/user";
import { Button } from "@openstudio/ui/components/ui/button";
import Image from "next/image";

//TODO: fix issue here, it should be vice versa
export const NotLoggedIn = (props: {}) => {
  return (
    <div className="flex flex-col items-center justify-center sm:p-20 md:p-32">
      <div className="text-lg text-gray-700">You are not signed in 😞</div>
      <Button variant={"outline"} className="mt-2" onClick={() => logOut()}>
        Sign In
      </Button>
      <div className="mt-8">
        <Image
          src={"/images/falling.svg"}
          alt=""
          width={400}
          height={400}
          unoptimized
        />
      </div>
    </div>
  );
};
