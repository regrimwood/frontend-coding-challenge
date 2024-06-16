import { motion } from "framer-motion";
import Link from "next/link";
import tailwindConfig from "tailwind.config";
import alpha from "utils/alpha";

export default function Button({
  children,
  onClick,
  className,
  selected,
  href,
  reverse,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  selected?: boolean;
  href?: string;
  reverse?: boolean;
}) {
  const { neonBlue, white } = tailwindConfig.theme.extend.colors;

  const variants = {
    unselected: {
      backgroundColor: reverse ? neonBlue : alpha(neonBlue, 0),
      color: reverse ? white : neonBlue,
    },
    selected: {
      backgroundColor: reverse ? alpha(neonBlue, 0) : neonBlue,
      color: reverse ? neonBlue : white,
    },
  };

  const button = (
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

  return href ? (
    <Link href={href} className={className}>
      {button}
    </Link>
  ) : (
    button
  );
}
