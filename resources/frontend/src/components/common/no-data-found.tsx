import { SearchX } from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

interface Props {
  title?: string;
  height?: string;
  description?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export const NoDataFound = ({
  title,
  description,
  height = "min-h-[300px]",
}: Props) => {
  const defaultTitle = title || "No Data Found";
  const defaultDescription =
    description || "Looks like there’s nothing here yet. Try again later.";

  return (
    <motion.div
      className={`flex flex-col w-full items-center justify-center  p-6 bg-card rounded-lg shadow-sm mx-auto text-center ${height}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible">
      <motion.div variants={itemVariants}>
        <SearchX className="w-16 h-16 text-muted-foreground mb-4" />
      </motion.div>
      <motion.h2
        className="text-2xl font-semibold text-foreground mb-2"
        variants={itemVariants}>
        {defaultTitle}
      </motion.h2>
      <motion.p
        className="text-muted-foreground text-sm max-w-xs"
        variants={itemVariants}>
        {defaultDescription}
      </motion.p>
    </motion.div>
  );
};
