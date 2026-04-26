import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

function Container({ children, className }: ContainerProps) {
  return <div className={cn("container-page", className)}>{children}</div>;
}

export default Container;