import { EventTypeEnum } from "./EventTypeEnum";

export interface EventBriefModel {
  id: number;
  name: string;
  imageUrl: string;
  type: EventTypeEnum;
  bookingLimit: number;
}

export interface EventModel extends EventBriefModel {
  gaAreaIds: number[];
  allocatedSeatIds: number[];
}
