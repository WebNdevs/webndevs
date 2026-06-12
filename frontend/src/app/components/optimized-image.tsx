type OptimizedImageProps = {
  src: string;
  webpSrc?: string;
  alt: string;
  className?: string;
  eager?: boolean;
};

export function OptimizedImage({ src, webpSrc, alt, className, eager = false }: OptimizedImageProps) {
  return (
    <picture>
      {webpSrc ? <source srcSet={webpSrc} type="image/webp" /> : null}
      <img
        src={src}
        alt={alt}
        className={className}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
    </picture>
  );
}
