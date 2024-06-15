import { motion } from "framer-motion";

const variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { ease: "easeInOut", duration: 0.5, staggerChildren: 0.1 },
  },
  exit: { opacity: 0, y: 0 },
};

export default function Transition({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{ ease: "easeInOut", duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
