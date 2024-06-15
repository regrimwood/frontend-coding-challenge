import { createContext, useState, useEffect, ReactNode } from "react";
import addGAItemToCart from "utils/cart/addGAItemToCart";
import RemoveGAItemFromCart from "utils/cart/removeGAItemFromCart";
import { CartErrorEnum } from "utils/models/CartErrorEnum";
import { EventTypeEnum } from "utils/models/EventTypeEnum";
import { PriceModel } from "utils/models/PriceModel";
import getEvent from "utils/queries/getEvent";
import getGAArea from "utils/queries/getGAArea";
import getPrice from "utils/queries/getPrice";

export interface TicketInputModel {
  eventId: number;
  gaAreaId?: number;
  priceId: number;
  quantity: number;
}

interface BaseCartModel {
  eventId: number;
  eventName: string;
}

export interface GACartModel extends BaseCartModel {
  eventType: EventTypeEnum.GA;
  gaAreas: GAAreaCartModel[];
}

interface AllocatedCartModel extends BaseCartModel {
  eventType: EventTypeEnum.ALLOCATED;
}

export type CartModel = GACartModel | AllocatedCartModel;

export interface GAAreaCartModel {
  gaAreaId: number;
  gaAreaName: string;
  tickets: TicketModel[];
}

export interface TicketModel extends PriceModel {
  quantity: number;
}

interface ContextModel {
  cartItems: CartModel[];
  addToCart: (item: TicketInputModel) => void;
  removeFromCart: (item: TicketInputModel) => void;
  // getCartTotal: () => number;
  // getNumberOfTickets: () => number;
}

export const CartContext = createContext<ContextModel | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartModel[]>([]);
  const [error, setError] = useState<string | undefined>();

  const addToCart = async (item: TicketInputModel) => {
    setError(undefined);

    try {
      const event = await getEvent({ id: item.eventId.toString() });
      if (!event) {
        throw new Error(CartErrorEnum.DATA_NOT_FOUND);
      }

      if (item.quantity > event.bookingLimit) {
        throw new Error(CartErrorEnum.BOOKING_LIMIT_EXCEEDED);
      }

      if (event.type === EventTypeEnum.GA && item.gaAreaId) {
        const gaArea = await getGAArea({ id: item.gaAreaId });
        if (!gaArea) {
          throw new Error(CartErrorEnum.DATA_NOT_FOUND);
        }
        if (item.quantity > gaArea.capacity) {
          throw new Error(CartErrorEnum.CAPACITY_EXCEEDED);
        }

        const priceId = gaArea.priceIds.find((v) => v === item.priceId);
        if (!priceId) {
          throw new Error(CartErrorEnum.DATA_NOT_FOUND);
        }

        const price = await getPrice({ id: priceId });
        if (!price) {
          throw new Error(CartErrorEnum.DATA_NOT_FOUND);
        }

        const newItems = addGAItemToCart(
          item,
          cartItems as GACartModel[],
          event,
          gaArea,
          price
        );

        setCartItems(newItems);
      }
    } catch (error: any) {
      setError(error?.message ?? "An error occurred");
    }
  };

  const removeFromCart = (item: TicketInputModel) => {
    if (item.gaAreaId) {
      const newItems = RemoveGAItemFromCart(item, cartItems as GACartModel[]);
      setCartItems(newItems);
    }
  };

  // const getCartTotal = () => {
  //   return cartItems.reduce((acc, cartItem) => {
  //     return (
  //       acc +
  //       cartItem.gaAreas.reduce((acc, gaArea) => {
  //         return (
  //           acc +
  //           gaArea.tickets.reduce((acc, ticket) => {
  //             return acc + ticket.price * ticket.quantity;
  //           }, 0)
  //         );
  //       }, 0)
  //     );
  //   }, 0);
  // };

  // const getNumberOfTickets = () => {
  //   return cartItems.reduce((acc, cartItem) => {
  //     return (
  //       acc +
  //       cartItem.gaAreas.reduce((acc, gaArea) => {
  //         return (
  //           acc +
  //           gaArea.tickets.reduce((acc, ticket) => {
  //             return acc + ticket.quantity;
  //           }, 0)
  //         );
  //       }, 0)
  //     );
  //   }, 0);
  // };

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const cartItems = localStorage.getItem("cartItems");
    if (cartItems) {
      setCartItems(JSON.parse(cartItems));
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        // getCartTotal,
        // getNumberOfTickets,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};