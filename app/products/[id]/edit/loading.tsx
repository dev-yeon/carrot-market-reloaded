
import { PhotoIcon } from "@heroicons/react/24/solid";
import React from "react";

const Loading = () => {
  return (
    <div className="animate-pulse p-5 flex flex-col gap-5">
      <div className="aspect-square border-neutral-700 rounded-md border-dashed flex items-center justify-center text-neutral-700">
        <PhotoIcon className="h-28" /> 
      </div>
      <div className="flex flex-col gap-3 *:w-full *:h-8 *:bg-neutral-700 *:rounded-md">
        <div />
        <div />
        <div />
      </div>
      <div className="flex flex-col gap-3 *:w-full *:h-9 *:bg-neutral-700 *:rounded-md">
        <div />
        <div />

      </div>
    </div>
  );
};

export default Loading;