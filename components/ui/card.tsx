import * as React from "react";

export function Card({
  className = "",
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={`rounded-[3px] border border-border bg-surface overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className = "",
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={`p-6 pb-0 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className = "",
  children,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      className={`font-sans font-bold text-text-strong ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className = "",
  children,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p className={`text-sm text-muted leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className = "",
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={`p-6 pt-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = "",
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={`px-6 py-4 border-t border-border ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
