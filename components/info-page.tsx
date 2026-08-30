import Link from "next/link";
import type { ReactNode } from "react";

export function InfoPage({
  marker,
  title,
  intro,
  children,
}: {
  marker: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="py-10 sm:py-14">
      <article className="max-w-3xl mx-auto px-4">
        <Link
          href="/"
          className="font-mono text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          ← Back to the open world
        </Link>
        <div className="font-mono text-xs tracking-[0.3em] text-muted-foreground mt-9 mb-4">
          ::: {marker} :::
        </div>
        <h1 className="font-semibold text-3xl sm:text-5xl leading-[1.05] tracking-tight mb-5">
          {title}
        </h1>
        <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-10">
          {intro}
        </p>
        <div className="space-y-8 text-sm sm:text-base text-foreground/75 leading-7 [&_h2]:font-mono [&_h2]:text-sm [&_h2]:uppercase [&_h2]:tracking-[0.18em] [&_h2]:text-foreground [&_h2]:mb-3 [&_p+p]:mt-3 [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-pv-cyan [&_ul]:space-y-2 [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>
      </article>
    </div>
  );
}
