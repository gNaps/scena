import * as React from "react";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary text-[#0B0B0F] hover:bg-accent-hover",
  outline:
    "bg-transparent border border-border-strong text-foreground hover:border-primary",
  ghost: "text-muted hover:text-foreground",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2.5 text-[12px]",
  md: "px-5 py-3 text-[12px]",
  lg: "px-7 py-[15px] text-[13px]",
};

interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-[2px] font-mono font-bold uppercase tracking-[0.06em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
      className: `${classes} ${(children.props as { className?: string }).className ?? ""}`.trim(),
    });
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
