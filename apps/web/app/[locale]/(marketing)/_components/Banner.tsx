import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const Banner = () => {
  return (
    <div className="relative isolate flex items-center gap-x-6 overflow-hidden px-6 py-2.5 sm:px-3.5 justify-center bg-gradient-to-br from-red-600 to-red-600 z-50">
      <Link
        href={"https://github.com/kuluruvineeth/openstudio"}
        target="_blank"
        className="group p-1 pl-4 gap-2 flex justify-center items-center transition-all duration-300 ease-in-out"
      >
        <p className="inlne-block text-white text-sm">
          <strong>Attention:</strong> Open Studio is currently in the
          development phase. The product may contain several known issues. For
          more information, visit our GitHub.
        </p>
        <ArrowUpRight className="text-white h-3 w-3" />
      </Link>
    </div>
  );
};

export default Banner;
