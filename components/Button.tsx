import { motion } from "framer-motion";
import tailwindConfig from "tailwind.config";
import alpha from "utils/alpha";

export default function Button({
  children,
  onClick,
  className,
  selected,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  selected?: boolean;
}) {
  const { neonBlue, white } = tailwindConfig.theme.extend.colors;

  const variants = {
    unselected: {
      backgroundColor: alpha(neonBlue, 0),
      color: neonBlue,
    },
    selected: {
      backgroundColor: neonBlue,
      color: white,
    },
  };

  return (
    <motion.button
      onClick={onClick}
      className={`font-medium text-sm md:text-base py-2 px-4 md:px-6 rounded-md border-neonBlue border-[1px] md:border-2 ${className}`}
      initial="unselected"
      whileHover="selected"
      animate={selected ? "selected" : "unselected"}
      variants={variants}
    >
      {children}
    </motion.button>
  );
}
