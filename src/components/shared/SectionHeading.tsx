import { cn } from "@/lib/utils";
import React from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}) => {
  const alignment =
    align === "left" ? "items-start text-left" : "items-center text-center";

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-4xl flex-col gap-3 px-4 sm:px-6 lg:px-8",
        alignment,
        className,
      )}
    >
      <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-violet-700 ring-1 ring-violet-200">
        {eyebrow}
      </span>
      <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">{title}</h2>
      {description ? (
        <p className="max-w-3xl text-base text-slate-600 sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
};

export default SectionHeading;
