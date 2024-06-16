import { AllocatedSeatStatusEnum } from "./AllocatedSeatStatusEnum";
import { PriceModel } from "./PriceModel";

export interface AllocatedSeatModel {
  id: number;
  seatRow: string;
  seatColumn: number;
  seatX: number;
  seatY: number;
  priceIds: number[];
  status: AllocatedSeatStatusEnum;
}

export interface AllocatedSeatWithPricesModel extends AllocatedSeatModel {
  prices: PriceModel[];
}
