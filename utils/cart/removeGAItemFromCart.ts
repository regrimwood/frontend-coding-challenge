import { CartErrorEnum } from "utils/models/CartErrorEnum";
import { GACartModel, TicketInputModel } from "../../components/CartContext";

export default function RemoveGAItemFromCart(
  item: TicketInputModel,
  cartItems: GACartModel[]
) {
  const eventInCart = cartItems.find(
    (cartItem) => cartItem.eventId === item.eventId
  );

  const gAAreaInCart = eventInCart?.gaAreas.find(
    (gaArea) => gaArea.gaAreaId === item.gaAreaId
  );

  const itemInCart = gAAreaInCart?.tickets.find(
    (ticket) => ticket.id === item.priceId
  );

  if (eventInCart && gAAreaInCart && itemInCart) {
    if (eventInCart.gaAreas.length > 1) {
      if (gAAreaInCart.tickets.length > 1) {
        return cartItems.map((cartItem) =>
          cartItem.eventId === item.eventId
            ? {
                ...cartItem,
                gaAreas: cartItem.gaAreas.map((gaArea) =>
                  gaArea.gaAreaId === item.gaAreaId
                    ? {
                        ...gaArea,
                        tickets: gaArea.tickets.filter(
                          (ticket) => ticket.id !== item.priceId
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
                gaAreas: cartItem.gaAreas.filter(
                  (gaArea) => gaArea.gaAreaId !== item.gaAreaId
                ),
              }
            : cartItem
        );
      }
    } else {
      return cartItems.filter((cartItem) => cartItem.eventId !== item.eventId);
    }
  } else {
    throw new Error(CartErrorEnum.ITEM_NOT_FOUND);
  }
}
