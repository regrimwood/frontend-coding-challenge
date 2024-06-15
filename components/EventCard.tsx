import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { EventBriefModel } from "../utils/models/EventModel";
import tailwindConfig from "../tailwind.config";
import Typography from "./Typography";

export default function EventCard({ event }: { event: EventBriefModel }) {
  const { name, imageUrl } = event;

  const [imageError, setImageError] = useState<boolean>(false);

  const { md, lg, xl } = tailwindConfig.theme.screens;

  const variants = {
    initial: {
      scale: 1,
      boxShadow: "0px 5px 10px 2px rgba(0,0,0,0.1)",
    },
    hover: {
      scale: 1.02,
      boxShadow: "0px 10px 15px 0px rgba(0,0,0,0.2)",
      transition: { type: "tween", duration: 0.25 },
    },
  };

  return (
    <motion.div
      className="bg-white  rounded-xl overflow-hidden h-full"
      initial="initial"
      whileHover="hover"
      variants={variants}
      layout
    >
      <Link href="#" className="cursor-pointer">
        <div className="h-full cursor-pointer">
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image
              className="absolute"
              src={imageError ? "/iTICKET.svg" : imageUrl}
              alt={name}
              fill
              style={{ objectFit: imageError ? "contain" : "cover" }}
              onError={() => setImageError(true)}
              sizes={`(max-width: ${md}) 100vw, (max-width: ${lg}) 50vw, (max-width: ${xl}) 33.33vw, 20rem`}
            />
          </div>
          <div className="p-4">
            <Typography className="text-black" variant="h3">
              {name}
            </Typography>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
