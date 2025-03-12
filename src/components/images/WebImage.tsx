"use client";

export default function WebImage({
  src,
  className,
  width,
  height,
}: {
  src: string;
  className?: string;
  width?: number;
  height?: number;
}) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} className={className} width={width} height={height} alt={`Included-IMG-${src}`} />
    </>
  );
}
