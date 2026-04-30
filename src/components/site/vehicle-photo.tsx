import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  seed: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
};

/**
 * Sample-data vehicle photo. Picsum returns a stable image per `seed`, so
 * the same VIN gets the same photo across reloads. Real VDP photos will
 * come from Supabase storage in Phase 1 and the fal.ai pipeline in Phase 2.
 */
export function VehiclePhoto({
  seed,
  alt,
  className,
  priority,
  sizes,
  width = 1200,
  height = 800,
}: Props) {
  const src = `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes ?? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
