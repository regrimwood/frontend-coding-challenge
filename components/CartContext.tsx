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
import addAllocatedItemToCart from "utils/cart/addAllocatedItemToCart";
import addGAItemToCart from "utils/cart/addGAItemToCart";
import removeAllocatedItemFromCart from "utils/cart/removeAllocatedItemFromCart";
import removeGAItemFromCart from "utils/cart/removeGAItemFromCart";
import { CartErrorEnum } from "utils/models/CartErrorEnum";
import { EventTypeEnum } from "utils/models/EventTypeEnum";
import { PriceModel } from "utils/models/PriceModel";
import getEvent from "utils/queries/getEvent";
import getGAArea from "utils/queries/getGAArea";
import getPrice from "utils/queries/getPrice";
import getSeat from "utils/queries/getSeat";

export interface TicketInputModel {
  eventId: number;
  gaAreaId?: number;
  seatId?: number;
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

export interface AllocatedCartModel extends BaseCartModel {
  eventType: EventTypeEnum.ALLOCATED;
  seats: AllocatedTicketModel[];
}

export type CartModel = GACartModel | AllocatedCartModel;

export interface GAAreaCartModel {
  gaAreaId: number;
  gaAreaName: string;
  tickets: GATicketModel[];
}

export interface GATicketModel extends PriceModel {
  quantity: number;
}

export interface AllocatedTicketModel extends PriceModel {
  seatRow: string;
  seatColumn: number;
  seatId: number;
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
      const gaCartItems = cartItems.filter(
        (v) => v.eventType === EventTypeEnum.GA
      );
      const allocatedCartItems = cartItems.filter(
        (v) => v.eventType === EventTypeEnum.ALLOCATED
      );

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
          gaCartItems as GACartModel[],
          event,
          gaArea,
          price
        );

        const newCart = [...allocatedCartItems, ...newItems];
        setCartItems([...allocatedCartItems, ...newItems]);
        localStorage.setItem("cartItems", JSON.stringify(newCart));
      } else if (item.seatId) {
        const seat = await getSeat({ id: item.seatId });
        if (!seat) {
          throw new Error(CartErrorEnum.DATA_NOT_FOUND);
        }

        const priceId = seat.priceIds.find((v) => v === item.priceId);
        if (!priceId) {
          throw new Error(CartErrorEnum.DATA_NOT_FOUND);
        }

        const price = await getPrice({ id: priceId });
        if (!price) {
          throw new Error(CartErrorEnum.DATA_NOT_FOUND);
        }

        const newItems = addAllocatedItemToCart(
          item,
          allocatedCartItems as AllocatedCartModel[],
          event,
          seat,
          price
        );

        const newCart = [...gaCartItems, ...newItems];
        setCartItems(newCart);
        localStorage.setItem("cartItems", JSON.stringify(newCart));
      }

      setCartOpen(true);
      return true;
    } catch (error: any) {
      throw new Error(error?.message ?? "An error occurred");
    }
  };

  const removeFromCart = (item: TicketInputModel) => {
    try {
      const gaCartItems = cartItems.filter(
        (v) => v.eventType === EventTypeEnum.GA
      );
      const allocatedCartItems = cartItems.filter(
        (v) => v.eventType === EventTypeEnum.ALLOCATED
      );

      if (item.gaAreaId) {
        const newItems = removeGAItemFromCart(
          item,
          gaCartItems as GACartModel[]
        );

        const newCart = [...allocatedCartItems, ...newItems];
        setCartItems(newCart);
        localStorage.setItem("cartItems", JSON.stringify(newCart));
      } else {
        const newItems = removeAllocatedItemFromCart(
          item,
          allocatedCartItems as AllocatedCartModel[]
        );

        const newCart = [...gaCartItems, ...newItems];
        setCartItems(newCart);
        localStorage.setItem("cartItems", JSON.stringify(newCart));
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
          : cartItem.seats.reduce((acc, seat) => {
              return acc + seat.price;
            }, 0))
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
          : cartItem.seats.length)
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
