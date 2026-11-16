import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  showLabel?: boolean;
  reviewCount?: number;
  className?: string;
}

function Star({ type, size }: { type: "full" | "half" | "empty"; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
    >
      {type === "full" && (
        <path
          fill="#FFC633"
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        />
      )}
      {type === "half" && (
        <>
          <defs>
            <clipPath id={`half-${size}`}>
              <rect x="0" y="0" width="12" height="24" />
            </clipPath>
          </defs>
          <path
            fill="#E0E0E0"
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
          <path
            fill="#FFC633"
            clipPath={`url(#half-${size})`}
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </>
      )}
      {type === "empty" && (
        <path
          fill="#E0E0E0"
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        />
      )}
    </svg>
  );
}

export function StarRating({
  rating,
  max = 5,
  size = 16,
  showLabel = true,
  reviewCount,
  className,
}: StarRatingProps) {
  const stars = Array.from({ length: max }, (_, i) => {
    const diff = rating - i;
    if (diff >= 1) return "full" as const;
    if (diff >= 0.5) return "half" as const;
    return "empty" as const;
  });

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {stars.map((type, i) => (
          <Star key={i} type={type} size={size} />
        ))}
      </div>
      {showLabel && (
        <span className="text-sm text-gray-700 font-medium">
          {rating.toFixed(1)}/5
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-sm text-gray-500">({reviewCount.toLocaleString()})</span>
      )}
    </div>
  );
}
