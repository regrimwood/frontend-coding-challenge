import { CartErrorEnum } from "utils/models/CartErrorEnum";
import {
  AllocatedCartModel,
  TicketInputModel,
} from "../../components/CartContext";

export default function removeAllocatedItemFromCart(
  item: TicketInputModel,
  cartItems: AllocatedCartModel[]
) {
  const eventInCart = cartItems.find(
    (cartItem) => cartItem.eventId === item.eventId
  );

  const itemInCart = eventInCart?.seats.find(
    (ticket) => ticket.seatId === item.seatId
  );

  if (!eventInCart || !itemInCart) {
    throw new Error(CartErrorEnum.ITEM_NOT_FOUND);
  }

  if (eventInCart.seats.length > 1) {
    return cartItems.map((cartItem) =>
      cartItem.eventId === item.eventId
        ? {
            ...cartItem,
            seats: cartItem.seats.filter(
              (ticket) => ticket.seatId !== item.seatId
            ),
          }
        : cartItem
    );
  } else {
    return cartItems.filter((cartItem) => cartItem.eventId !== item.eventId);
  }
}
