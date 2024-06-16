import { GACartModel } from "@/components/CartContext";
import removeGAItemFromCart from "../utils/cart/removeGAItemFromCart";
import { EventTypeEnum } from "utils/models/EventTypeEnum";
import { CartErrorEnum } from "utils/models/CartErrorEnum";

describe("RemoveGAItemFromCart", () => {
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

  it("should remove an item from the cart", () => {
    const item = {
      eventId: 1,
      gaAreaId: 1,
      priceId: 2,
      quantity: 1,
    };

    const updatedCartItems = removeGAItemFromCart(item, cartItems);

    expect(updatedCartItems).toEqual([
      {
        eventId: 1,
        eventName: "Event 1",
        eventType: EventTypeEnum.GA,
        gaAreas: [
          {
            gaAreaId: 1,
            gaAreaName: "GA Area 1",
            tickets: [{ id: 1, price: 10, priceName: "Price 1", quantity: 1 }],
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

  it("should remove a GA area from the cart", () => {
    const item = {
      eventId: 1,
      gaAreaId: 2,
      priceId: 3,
      quantity: 1,
    };

    const updatedCartItems = removeGAItemFromCart(item, cartItems);

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

  it("should remove a GA event from the cart", () => {
    const item = {
      eventId: 2,
      gaAreaId: 3,
      priceId: 5,
      quantity: 1,
    };

    const updatedCartItems = removeGAItemFromCart(item, cartItems);

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
        ],
      },
    ]);
  });

  it("should throw an error if the item is not found in the cart", () => {
    const item1 = {
      eventId: 5,
      gaAreaId: 1,
      priceId: 3,
      quantity: 1,
    };
    const item2 = {
      eventId: 1,
      gaAreaId: 1,
      priceId: 3,
      quantity: 1,
    };
    const item3 = {
      eventId: 1,
      gaAreaId: 2,
      priceId: 4,
      quantity: 1,
    };

    expect(() => removeGAItemFromCart(item1, cartItems)).toThrow(
      CartErrorEnum.ITEM_NOT_FOUND
    );
    expect(() => removeGAItemFromCart(item2, cartItems)).toThrow(
      CartErrorEnum.ITEM_NOT_FOUND
    );
    expect(() => removeGAItemFromCart(item3, cartItems)).toThrow(
      CartErrorEnum.ITEM_NOT_FOUND
    );
  });
});
