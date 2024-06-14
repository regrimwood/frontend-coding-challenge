import Image from "next/image";
import Link from "next/link";
import { EventBriefModel } from "../utils/models/EventModel";
import { useState } from "react";
import tailwindConfig from "../tailwind.config";
import Typography from "./Typography";

export default function EventCard({ event }: { event: EventBriefModel }) {
  const { name, imageUrl } = event;

  const [imageError, setImageError] = useState<boolean>(false);

  const { md, lg, xl } = tailwindConfig.theme.screens;

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      <Link href="#" className="cursor-pointer">
        <div className="h-full cursor-pointer">
          <div className="relative aspect-[4/5] w-full">
            <Image
              className="absolute"
              src={imageError ? "/iTICKET.svg" : imageUrl}
              alt={name}
              layout="fill"
              objectFit={imageError ? "contain" : "cover"}
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
    </div>
  );
}
