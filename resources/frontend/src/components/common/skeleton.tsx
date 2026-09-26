import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ShimmerType {
  className?: string;
  children?: React.ReactNode;
  width?: string;
  height?: string;
  rounded?: string;
}

export const Skeleton = ({
  className = "",
  children,
  width,
  height,
  rounded,
}: ShimmerType) => {
  const style: React.CSSProperties = {};
  const classes: string[] = ["relative overflow-hidden bg-gray-100"];

  if (width) {
    style.width = width;
  } else {
    classes.push("w-full");
  }

  if (height) {
    style.height = height;
  } else {
    classes.push("h-full");
  }

  if (rounded) {
    classes.push(rounded);
  } else {
    classes.push("rounded-md");
  }

  return (
    <div className={cn(classes.join(" "), className)} style={style}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
          ease: "linear",
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
      {children && children}
    </div>
  );
};
