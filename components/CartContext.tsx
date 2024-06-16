import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
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
  addToCart: (item: TicketInputModel) => Promise<boolean | Error>;
  removeFromCart: (item: TicketInputModel) => void;
  getCartSubtotal: () => number;
  getNumberOfTickets: () => number;
  cartOpen: boolean;
  setCartOpen: Dispatch<SetStateAction<boolean>>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartContext = createContext<ContextModel | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartModel[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = async (item: TicketInputModel) => {
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
        localStorage.setItem("cartItems", JSON.stringify(newItems));
      }

      setCartOpen(true);
      return true;
    } catch (error: any) {
      throw new Error(error?.message ?? "An error occurred");
    }
  };

  const removeFromCart = (item: TicketInputModel) => {
    try {
      if (item.gaAreaId) {
        const newItems = RemoveGAItemFromCart(item, cartItems as GACartModel[]);
        setCartItems(newItems);
        localStorage.setItem("cartItems", JSON.stringify(newItems));
      }
    } catch (error: any) {
      throw new Error(error?.message ?? "An error occurred");
    }
  };

  const getCartSubtotal = () => {
    return cartItems.reduce((acc, cartItem) => {
      return (
        acc +
        (cartItem.eventType === EventTypeEnum.GA
          ? cartItem.gaAreas.reduce((acc, gaArea) => {
              return (
                acc +
                gaArea.tickets.reduce((acc, ticket) => {
                  return acc + ticket.price * ticket.quantity;
                }, 0)
              );
            }, 0)
          : 0)
      );
    }, 0);
  };

  const getNumberOfTickets = () => {
    return cartItems.reduce((acc, cartItem) => {
      return (
        acc +
        (cartItem.eventType === EventTypeEnum.GA
          ? cartItem.gaAreas.reduce((acc, gaArea) => {
              return (
                acc +
                gaArea.tickets.reduce((acc, ticket) => {
                  return acc + ticket.quantity;
                }, 0)
              );
            }, 0)
          : 0)
      );
    }, 0);
  };

  useEffect(() => {
    const cartItems = localStorage.getItem("cartItems");
    if (cartItems) {
      setCartItems(JSON.parse(cartItems));
    }
  }, []);

  useEffect(() => {
    if (cartOpen && typeof document !== "undefined") {
      document.body.style.overflowY = "hidden";
    } else if (typeof document !== "undefined") {
      document.body.style.overflowY = "auto";
    }
  }, [cartOpen]);

  const cartState = useMemo(
    () => ({ cartOpen, setCartOpen, cartItems }),
    [cartOpen, setCartOpen, cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        addToCart,
        removeFromCart,
        getCartSubtotal,
        getNumberOfTickets,
        ...cartState,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
