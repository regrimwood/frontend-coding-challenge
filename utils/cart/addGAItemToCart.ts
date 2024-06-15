import { GACartModel, TicketInputModel } from "../../components/CartContext";
import { GA_TICKET_LIMIT } from "../globals";
import { CartErrorEnum } from "../models/CartErrorEnum";
import { EventModel } from "../models/EventModel";
import { EventTypeEnum } from "../models/EventTypeEnum";
import { GeneralAdmissionAreaModel } from "../models/GeneralAdmissionAreaModel";
import { PriceModel } from "../models/PriceModel";

export default function addGAItemToCart(
  item: TicketInputModel,
  cartItems: GACartModel[],
  event: EventModel,
  gaArea: GeneralAdmissionAreaModel,
  price: PriceModel
): GACartModel[] {
  const eventInCart = cartItems.find(
    (cartItem) => cartItem.eventId === item.eventId
  );

  if (eventInCart) {
    const totalTicketsForEvent = eventInCart.gaAreas.reduce(
      (acc, gaArea) =>
        acc + gaArea.tickets.reduce((acc, ticket) => acc + ticket.quantity, 0),
      0
    );

    if (totalTicketsForEvent + item.quantity > event.bookingLimit) {
      throw new Error(CartErrorEnum.BOOKING_LIMIT_EXCEEDED);
    }

    const gaAreaInCart = eventInCart.gaAreas.find(
      (gaArea) => gaArea.gaAreaId === item.gaAreaId
    );

    const ticketInCart = gaAreaInCart?.tickets.find(
      (ticket) => ticket.id === item.priceId
    );

    if (gaAreaInCart) {
      const totalTicketsForArea = gaAreaInCart.tickets.reduce(
        (acc, ticket) => acc + ticket.quantity,
        0
      );

      if (totalTicketsForArea + item.quantity > gaArea.capacity) {
        throw new Error(CartErrorEnum.CAPACITY_EXCEEDED);
      }

      if (ticketInCart) {
        const newQuantity = ticketInCart.quantity + item.quantity;
        if (newQuantity > GA_TICKET_LIMIT) {
          throw new Error(CartErrorEnum.GA_LIMIT_EXCEEDED);
        }

        return cartItems.map((cartItem) =>
          cartItem.eventId === item.eventId
            ? {
                ...cartItem,
                gaAreas: eventInCart.gaAreas.map((gaArea) =>
                  gaArea.gaAreaId === item.gaAreaId
                    ? {
                        ...gaArea,
                        tickets: gaArea.tickets.map((ticket) =>
                          ticket.id === item.priceId
                            ? {
                                ...ticket,
                                quantity: ticket.quantity + item.quantity,
                              }
                            : ticket
                        ),
                      }
                    : gaArea
                ),
              }
            : cartItem
        );
      } else {
        return cartItems.map((cartItem) =>
          cartItem.eventId === item.eventId
            ? {
                ...cartItem,
                gaAreas: eventInCart.gaAreas.map((gaArea) =>
                  gaArea.gaAreaId === item.gaAreaId
                    ? {
                        ...gaArea,
                        tickets: [
                          ...gaArea.tickets,
                          { ...price, quantity: item.quantity },
                        ],
                      }
                    : gaArea
                ),
              }
            : cartItem
        );
      }
    } else {
      return cartItems.map((cartItem) =>
        cartItem.eventId === item.eventId
          ? {
              ...eventInCart,
              gaAreas: [
                ...eventInCart.gaAreas,
                {
                  gaAreaId: gaArea.id,
                  gaAreaName: gaArea.name,
                  tickets: [{ ...price, quantity: item.quantity }],
                },
              ],
            }
          : cartItem
      );
    }
  } else {
    return [
      ...cartItems,
      {
        eventId: item.eventId,
        eventName: event.name,
        eventType: EventTypeEnum.GA,
        gaAreas: [
          {
            gaAreaId: gaArea.id,
            gaAreaName: gaArea.name,
            tickets: [{ ...price, quantity: item.quantity }],
          },
        ],
      },
    ];
  }
}
