import { AllocatedSeatStatusEnum } from "./AllocatedSeatStatusEnum";

export interface AllocatedSeatModel {
  id: number;
  seatRow: string;
  seatColumn: number;
  seatX: number;
  seatY: number;
  priceIds: number[];
  status: AllocatedSeatStatusEnum;
}
