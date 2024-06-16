import addAllocatedItemToCart from "../utils/cart/addAllocatedItemToCart";
import {
  AllocatedCartModel,
  TicketInputModel,
} from "../components/CartContext";
import { CartErrorEnum } from "../utils/models/CartErrorEnum";
import { EventModel } from "../utils/models/EventModel";
import { EventTypeEnum } from "../utils/models/EventTypeEnum";
import { PriceModel } from "../utils/models/PriceModel";
import { AllocatedSeatModel } from "utils/models/AllocatedSeatModel";
import { AllocatedSeatStatusEnum } from "utils/models/AllocatedSeatStatusEnum";

describe("addAllocatedItemToCart", () => {
  const cartItems: AllocatedCartModel[] = [
    {
      eventId: 1,
      eventName: "Event 1",
      eventType: EventTypeEnum.ALLOCATED,
      seats: [
        {
          id: 1,
          price: 10,
          seatColumn: 1,
          seatRow: "A",
          seatId: 1,
          priceName: "Price 1",
        },
        {
          id: 2,
          price: 20,
          seatColumn: 2,
          seatRow: "B",
          seatId: 2,
          priceName: "Price 2",
        },
      ],
    },
    {
      eventId: 2,
      eventName: "Event 2",
      eventType: EventTypeEnum.ALLOCATED,
      seats: [
        {
          id: 3,
          price: 20,
          seatColumn: 2,
          seatRow: "B",
          seatId: 2,
          priceName: "Price 3",
        },
      ],
    },
  ];

  it("should add an allocated item to the cart", () => {
    const item: TicketInputModel = {
      eventId: 1,
      priceId: 1,
      seatId: 3,
      quantity: 1,
    };

    const event: EventModel = {
      type: EventTypeEnum.ALLOCATED,
      id: 1,
      name: "Event 1",
      bookingLimit: 5,
      gaAreaIds: [],
      allocatedSeatIds: [1, 2, 3],
      imageUrl: "",
    };

    const seat: AllocatedSeatModel = {
      id: 3,
      seatColumn: 1,
      seatRow: "C",
      seatX: 1,
      seatY: 3,
      status: AllocatedSeatStatusEnum.AVAILABLE,
      priceIds: [1],
    };

    const price: PriceModel = {
      id: 1,
      price: 10,
      priceName: "Price 1",
    };

    const updatedCartItems = addAllocatedItemToCart(
      item,
      cartItems,
      event,
      seat,
      price
    );

    expect(updatedCartItems).toEqual([
      {
        eventId: 1,
        eventName: "Event 1",
        eventType: EventTypeEnum.ALLOCATED,
        seats: [
          ...cartItems[0].seats,
          {
            id: 1,
            price: 10,
            seatColumn: 1,
            seatRow: "C",
            seatId: 3,
            priceName: "Price 1",
          },
        ],
      },
      cartItems[1],
    ]);
  });

  it("should throw an error if the seat is already in the cart", () => {
    const item: TicketInputModel = {
      eventId: 1,
      priceId: 1,
      seatId: 1,
      quantity: 1,
    };

    const event: EventModel = {
      type: EventTypeEnum.ALLOCATED,
      id: 1,
      name: "Event 1",
      bookingLimit: 5,
      gaAreaIds: [],
      allocatedSeatIds: [1, 2, 3],
      imageUrl: "",
    };

    const seat: AllocatedSeatModel = {
      id: 1,
      seatColumn: 1,
      seatRow: "C",
      seatX: 1,
      seatY: 3,
      status: AllocatedSeatStatusEnum.AVAILABLE,
      priceIds: [1],
    };

    const price: PriceModel = {
      id: 1,
      price: 10,
      priceName: "Price 1",
    };

    expect(() =>
      addAllocatedItemToCart(item, cartItems, event, seat, price)
    ).toThrow(CartErrorEnum.SEAT_ALREADY_IN_CART);
  });

  it("should throw an error if the booking limit is exceeded", () => {
    const item: TicketInputModel = {
      eventId: 1,
      quantity: 1,
      priceId: 1,
      seatId: 3,
    };

    const event: EventModel = {
      type: EventTypeEnum.ALLOCATED,
      id: 1,
      name: "Event 1",
      bookingLimit: 2,
      gaAreaIds: [],
      allocatedSeatIds: [1, 2, 3],
      imageUrl: "",
    };

    const seat: AllocatedSeatModel = {
      id: 3,
      seatColumn: 1,
      seatRow: "C",
      seatX: 1,
      seatY: 3,
      status: AllocatedSeatStatusEnum.AVAILABLE,
      priceIds: [1],
    };

    const price: PriceModel = {
      id: 1,
      price: 10,
      priceName: "Price 1",
    };

    expect(() =>
      addAllocatedItemToCart(item, cartItems, event, seat, price)
    ).toThrow(CartErrorEnum.BOOKING_LIMIT_EXCEEDED);
  });

  it("should throw an error if the seat is not available", () => {
    const item: TicketInputModel = {
      eventId: 1,
      quantity: 1,
      priceId: 1,
      seatId: 3,
    };

    const event: EventModel = {
      type: EventTypeEnum.ALLOCATED,
      id: 1,
      name: "Event 1",
      bookingLimit: 5,
      gaAreaIds: [],
      allocatedSeatIds: [1, 2, 3],
      imageUrl: "",
    };

    const seat: AllocatedSeatModel = {
      id: 3,
      seatColumn: 1,
      seatRow: "C",
      seatX: 1,
      seatY: 3,
      status: AllocatedSeatStatusEnum.SOLD,
      priceIds: [1],
    };

    const price: PriceModel = {
      id: 1,
      price: 10,
      priceName: "Price 1",
    };

    expect(() =>
      addAllocatedItemToCart(item, cartItems, event, seat, price)
    ).toThrow(CartErrorEnum.SEAT_NOT_AVAILABLE);
  });

  it("should throw an error if the quantity is more than 1", () => {
    const item: TicketInputModel = {
      eventId: 1,
      quantity: 2,
      priceId: 1,
      seatId: 3,
    };

    const event: EventModel = {
      type: EventTypeEnum.ALLOCATED,
      id: 1,
      name: "Event 1",
      bookingLimit: 5,
      gaAreaIds: [],
      allocatedSeatIds: [1, 2, 3],
      imageUrl: "",
    };

    const seat: AllocatedSeatModel = {
      id: 3,
      seatColumn: 1,
      seatRow: "C",
      seatX: 1,
      seatY: 3,
      status: AllocatedSeatStatusEnum.AVAILABLE,
      priceIds: [1],
    };

    const price: PriceModel = {
      id: 1,
      price: 10,
      priceName: "Price 1",
    };

    expect(() =>
      addAllocatedItemToCart(item, cartItems, event, seat, price)
    ).toThrow(CartErrorEnum.QUANTITY_EXCEEDED);
  });

  it("should throw an error if the quantity is less than 1", () => {
    const item: TicketInputModel = {
      eventId: 1,
      quantity: 0,
      priceId: 1,
      seatId: 3,
    };

    const event: EventModel = {
      type: EventTypeEnum.ALLOCATED,
      id: 1,
      name: "Event 1",
      bookingLimit: 5,
      gaAreaIds: [],
      allocatedSeatIds: [1, 2, 3],
      imageUrl: "",
    };

    const seat: AllocatedSeatModel = {
      id: 3,
      seatColumn: 1,
      seatRow: "C",
      seatX: 1,
      seatY: 3,
      status: AllocatedSeatStatusEnum.AVAILABLE,
      priceIds: [1],
    };

    const price: PriceModel = {
      id: 1,
      price: 10,
      priceName: "Price 1",
    };

    expect(() =>
      addAllocatedItemToCart(item, cartItems, event, seat, price)
    ).toThrow(CartErrorEnum.QUANTITY_INVALID);
  });
});
