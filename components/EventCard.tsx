import Image from "next/image";
import { EventBriefModel } from "../utils/models/EventModel";
import { useState } from "react";
import Typography from "./Typography";
import Link from "next/link";

export default function EventCard({ event }: { event: EventBriefModel }) {
  const { name, imageUrl } = event;

  const [imageError, setImageError] = useState<boolean>(false);

  return (
    <li className="block bg-white shadow-lg rounded-lg overflow-hidden">
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
            />
          </div>
          <div className="p-4">
            <Typography className="text-black" variant="h3">
              {name}
            </Typography>
          </div>
        </div>
      </Link>
    </li>
  );
}
