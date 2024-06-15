import addGAItemToCart from "../utils/cart/addGAItemToCart";
import { GACartModel, TicketInputModel } from "../components/CartContext";
import { EventModel } from "../utils/models/EventModel";
import { GeneralAdmissionAreaModel } from "../utils/models/GeneralAdmissionAreaModel";
import { PriceModel } from "../utils/models/PriceModel";
import { CartErrorEnum } from "../utils/models/CartErrorEnum";
import { EventTypeEnum } from "../utils/models/EventTypeEnum";
import { GA_TICKET_LIMIT } from "../utils/globals";

describe("addGAItemToCart", () => {
  const cartItems: GACartModel[] = [
    {
      eventId: 1,
      eventName: "Event 1",
      eventType: EventTypeEnum.GA,
      gaAreas: [
        {
          gaAreaId: 1,
          gaAreaName: "GA Area 1",
          tickets: [
            { id: 1, price: 10, priceName: "Price 1", quantity: 1 },
            { id: 2, price: 20, priceName: "Price 2", quantity: 1 },
          ],
        },
        {
          gaAreaId: 2,
          gaAreaName: "GA Area 2",
          tickets: [{ id: 3, price: 30, priceName: "Price 3", quantity: 1 }],
        },
      ],
    },
    {
      eventId: 2,
      eventName: "Event 2",
      eventType: EventTypeEnum.GA,
      gaAreas: [
        {
          gaAreaId: 3,
          gaAreaName: "GA Area 3",
          tickets: [{ id: 5, price: 50, priceName: "Price 5", quantity: 1 }],
        },
      ],
    },
  ];

  it("should add a new event to the cart", () => {
    const item: TicketInputModel = {
      eventId: 3,
      gaAreaId: 1,
      priceId: 1,
      quantity: 1,
    };

    const event: EventModel = {
      id: 3,
      name: "Event 3",
      bookingLimit: 15,
      imageUrl: "",
      type: EventTypeEnum.GA,
      gaAreaIds: [1, 2],
      allocatedSeatIds: [],
    };

    const gaArea: GeneralAdmissionAreaModel = {
      id: 1,
      name: "GA Area 1",
      capacity: 10,
      priceIds: [1, 2],
    };

    const price: PriceModel = {
      id: 1,
      price: 10,
      priceName: "Price 1",
    };

    const updatedCartItems = addGAItemToCart(
      item,
      cartItems,
      event,
      gaArea,
      price
    );

    expect(updatedCartItems).toEqual([
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
    ]);
  });

  it("should add a new GA area to the cart", () => {
    const item: TicketInputModel = {
      eventId: 1,
      gaAreaId: 3,
      priceId: 1,
      quantity: 1,
    };

    const event: EventModel = {
      id: 1,
      name: "Event 1",
      bookingLimit: 15,
      imageUrl: "",
      type: EventTypeEnum.GA,
      gaAreaIds: [1, 2, 3],
      allocatedSeatIds: [],
    };

    const gaArea: GeneralAdmissionAreaModel = {
      id: 3,
      name: "GA Area 3",
      capacity: 10,
      priceIds: [1, 2],
    };

    const price: PriceModel = {
      id: 1,
      price: 10,
      priceName: "Price 1",
    };

    const updatedCartItems = addGAItemToCart(
      item,
      cartItems,
      event,
      gaArea,
      price
    );

    expect(updatedCartItems).toEqual([
      {
        eventId: 1,
        eventName: "Event 1",
        eventType: EventTypeEnum.GA,
        gaAreas: [
          {
            gaAreaId: 1,
            gaAreaName: "GA Area 1",
            tickets: [
              { id: 1, price: 10, priceName: "Price 1", quantity: 1 },
              { id: 2, price: 20, priceName: "Price 2", quantity: 1 },
            ],
          },
          {
            gaAreaId: 2,
            gaAreaName: "GA Area 2",
            tickets: [{ id: 3, price: 30, priceName: "Price 3", quantity: 1 }],
          },
          {
            gaAreaId: gaArea.id,
            gaAreaName: gaArea.name,
            tickets: [{ ...price, quantity: item.quantity }],
          },
        ],
      },
      {
        eventId: 2,
        eventName: "Event 2",
        eventType: EventTypeEnum.GA,
        gaAreas: [
          {
            gaAreaId: 3,
            gaAreaName: "GA Area 3",
            tickets: [{ id: 5, price: 50, priceName: "Price 5", quantity: 1 }],
          },
        ],
      },
    ]);
  });

  it("should add a new ticket to an existing GA area in the cart", () => {
    const item: TicketInputModel = {
      eventId: 1,
      gaAreaId: 1,
      priceId: 3,
      quantity: 1,
    };

    const event: EventModel = {
      id: 1,
      name: "Event 1",
      bookingLimit: 15,
      imageUrl: "",
      type: EventTypeEnum.GA,
      gaAreaIds: [1, 2],
      allocatedSeatIds: [],
    };

    const gaArea: GeneralAdmissionAreaModel = {
      id: 1,
      name: "GA Area 1",
      capacity: 10,
      priceIds: [1, 2, 3],
    };

    const price: PriceModel = {
      id: 3,
      price: 10,
      priceName: "Price 3",
    };

    const updatedCartItems = addGAItemToCart(
      item,
      cartItems,
      event,
      gaArea,
      price
    );

    expect(updatedCartItems).toEqual([
      {
        eventId: 1,
        eventName: "Event 1",
        eventType: EventTypeEnum.GA,
        gaAreas: [
          {
            gaAreaId: 1,
            gaAreaName: "GA Area 1",
            tickets: [
              { id: 1, price: 10, priceName: "Price 1", quantity: 1 },
              { id: 2, price: 20, priceName: "Price 2", quantity: 1 },
              { ...price, quantity: item.quantity },
            ],
          },
          {
            gaAreaId: 2,
            gaAreaName: "GA Area 2",
            tickets: [{ id: 3, price: 30, priceName: "Price 3", quantity: 1 }],
          },
        ],
      },
      {
        eventId: 2,
        eventName: "Event 2",
        eventType: EventTypeEnum.GA,
        gaAreas: [
          {
            gaAreaId: 3,
            gaAreaName: "GA Area 3",
            tickets: [{ id: 5, price: 50, priceName: "Price 5", quantity: 1 }],
          },
        ],
      },
    ]);
  });

  it("should throw an error if the booking limit is exceeded for the event", () => {
    const item: TicketInputModel = {
      eventId: 1,
      gaAreaId: 1,
      priceId: 1,
      quantity: 3,
    };

    const event: EventModel = {
      id: 1,
      name: "Event 1",
      bookingLimit: 5,
      imageUrl: "",
      type: EventTypeEnum.GA,
      gaAreaIds: [1, 2],
      allocatedSeatIds: [],
    };

    const gaArea: GeneralAdmissionAreaModel = {
      id: 1,
      name: "GA Area 1",
      capacity: 10,
      priceIds: [1, 2, 3],
    };

    const price: PriceModel = {
      id: 1,
      price: 10,
      priceName: "Price 1",
    };

    expect(() =>
      addGAItemToCart(item, cartItems, event, gaArea, price)
    ).toThrow(CartErrorEnum.BOOKING_LIMIT_EXCEEDED);
  });

  it("should throw an error if the capacity is exceeded for the GA area", () => {
    const item: TicketInputModel = {
      eventId: 1,
      gaAreaId: 1,
      priceId: 1,
      quantity: 5,
    };

    const event: EventModel = {
      id: 1,
      name: "Event 1",
      bookingLimit: 15,
      imageUrl: "",
      type: EventTypeEnum.GA,
      gaAreaIds: [1, 2],
      allocatedSeatIds: [],
    };

    const gaArea: GeneralAdmissionAreaModel = {
      id: 1,
      name: "GA Area 1",
      capacity: 5,
      priceIds: [1, 2, 3],
    };

    const price: PriceModel = {
      id: 1,
      price: 10,
      priceName: "Price 1",
    };

    expect(() =>
      addGAItemToCart(item, cartItems, event, gaArea, price)
    ).toThrow(CartErrorEnum.CAPACITY_EXCEEDED);
  });

  it("should throw an error if the GA ticket limit is exceeded", () => {
    const item: TicketInputModel = {
      eventId: 1,
      gaAreaId: 1,
      priceId: 1,
      quantity: GA_TICKET_LIMIT + 1,
    };

    const event: EventModel = {
      id: 1,
      name: "Event 1",
      bookingLimit: 15,
      imageUrl: "",
      type: EventTypeEnum.GA,
      gaAreaIds: [1, 2],
      allocatedSeatIds: [],
    };

    const gaArea: GeneralAdmissionAreaModel = {
      id: 1,
      name: "GA Area 1",
      capacity: 15,
      priceIds: [1, 2, 3],
    };

    const price: PriceModel = {
      id: 1,
      price: 10,
      priceName: "Price 1",
    };

    expect(() =>
      addGAItemToCart(item, cartItems, event, gaArea, price)
    ).toThrow(CartErrorEnum.GA_LIMIT_EXCEEDED);
  });
});
