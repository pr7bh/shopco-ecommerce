import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  className?: string;
}

export function SectionHeader({ title, className }: SectionHeaderProps) {
  return (
    <h2
      className={cn(
        "text-center text-2xl font-bold uppercase tracking-wide md:text-3xl lg:text-4xl",
        className
      )}
    >
      {title}
    </h2>
  );
}
