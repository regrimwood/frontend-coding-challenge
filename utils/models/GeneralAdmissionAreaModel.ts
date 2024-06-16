import { PriceModel } from "./PriceModel";

export interface GeneralAdmissionAreaModel {
  id: number;
  name: string;
  capacity: number;
  priceIds: number[];
}

export interface GeneralAdmissionAreaWithPricesModel
  extends GeneralAdmissionAreaModel {
  prices: PriceModel[];
}
