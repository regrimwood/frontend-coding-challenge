import { AllocatedSeatModel } from "utils/models/AllocatedSeatModel";
import {
  AllocatedCartModel,
  TicketInputModel,
} from "../../components/CartContext";
import { CartErrorEnum } from "../models/CartErrorEnum";
import { EventModel } from "../models/EventModel";
import { EventTypeEnum } from "../models/EventTypeEnum";
import { PriceModel } from "../models/PriceModel";

export default function addAllocatedItemToCart(
  item: TicketInputModel,
  cartItems: AllocatedCartModel[],
  event: EventModel,
  seat: AllocatedSeatModel,
  price: PriceModel
): AllocatedCartModel[] {
  const eventInCart = cartItems.find(
    (cartItem) => cartItem.eventId === item.eventId
  );

  if (eventInCart) {
    if (eventInCart.seats.find((v) => v.seatId === seat.id)) {
      throw new Error(CartErrorEnum.SEAT_ALREADY_IN_CART);
    }

    const totalTicketsForEvent = eventInCart.seats.length;

    if (totalTicketsForEvent + item.quantity > event.bookingLimit) {
      throw new Error(CartErrorEnum.BOOKING_LIMIT_EXCEEDED);
    }

    return cartItems.map((cartItem) =>
      cartItem.eventId === item.eventId
        ? {
            ...cartItem,
            seats: [
              ...eventInCart.seats,
              {
                ...price,
                seatColumn: seat.seatColumn,
                seatRow: seat.seatRow,
                seatId: seat.id,
              },
            ],
          }
        : cartItem
    );
  } else {
    return [
      ...cartItems,
      {
        eventId: item.eventId,
        eventName: event.name,
        eventType: EventTypeEnum.ALLOCATED,
        seats: [
          {
            ...price,
            seatColumn: seat.seatColumn,
            seatRow: seat.seatRow,
            seatId: seat.id,
          },
        ],
      },
    ];
  }
}
