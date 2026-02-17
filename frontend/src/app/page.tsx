import React from "react";
import Link from "next/link";
import { RetroGrid } from "@/components/ui/retrobg"
import SignIn from '@/components/ui/SignIn'

const page = () => {
  return (
    <div className=" flex flex-col justify-center relative items-center">
      {/* Background Layer: Absolute positioning puts it behind everything */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <RetroGrid />
      </div>

      {/* Content Layer: Relative positioning + z-index puts it on top */}
      <div className="relative z-10 w-full h-full">
        <SignIn />
      </div>
    </div>
  );
};

export default page;

