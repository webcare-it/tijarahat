import React from "react";
import { motion, type MotionProps } from "framer-motion";

type AnimationWrapperProps = {
  children: React.ReactNode;
} & MotionProps;

export const AnimationWrapper = ({
  children,
  ...motionProps
}: AnimationWrapperProps) => {
  return <motion.div {...motionProps}>{children}</motion.div>;
};
