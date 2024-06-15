import { CartErrorEnum } from "utils/models/CartErrorEnum";
import { GACartModel, TicketInputModel } from "../../components/CartContext";

export default function RemoveGAItemFromCart(
  item: TicketInputModel,
  cartItems: GACartModel[]
) {
  const isEventInCart = cartItems.find(
    (cartItem) => cartItem.eventId === item.eventId
  );

  const isGAAreaInCart = isEventInCart?.gaAreas.find(
    (gaArea) => gaArea.gaAreaId === item.gaAreaId
  );

  const isItemInCart = isGAAreaInCart?.tickets.find(
    (ticket) => ticket.id === item.priceId
  );

  if (isItemInCart) {
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
    throw new Error(CartErrorEnum.ITEM_NOT_FOUND);
  }
}
