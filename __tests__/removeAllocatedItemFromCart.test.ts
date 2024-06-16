import { AllocatedCartModel, GACartModel } from "../components/CartContext";
import { EventTypeEnum } from "utils/models/EventTypeEnum";
import { CartErrorEnum } from "utils/models/CartErrorEnum";
import removeAllocatedItemFromCart from "utils/cart/removeAllocatedItemFromCart";

describe("RemoveGAItemFromCart", () => {
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

  it("should remove an item from the cart", () => {
    const item = {
      eventId: 1,
      seatId: 2,
      priceId: 2,
      quantity: 1,
    };

    const updatedCartItems = removeAllocatedItemFromCart(item, cartItems);

    expect(updatedCartItems).toEqual([
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
    ]);
  });

  it("should remove an allocated event from the cart", () => {
    const item = {
      eventId: 2,
      seatId: 2,
      priceId: 3,
      quantity: 1,
    };

    const updatedCartItems = removeAllocatedItemFromCart(item, cartItems);

    expect(updatedCartItems).toEqual([
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
    ]);
  });

  it("should throw an error if the item is not found in the cart", () => {
    const item1 = {
      eventId: 5,
      seatId: 1,
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
      seatId: 3,
      priceId: 4,
      quantity: 1,
    };

    expect(() => removeAllocatedItemFromCart(item1, cartItems)).toThrow(
      CartErrorEnum.ITEM_NOT_FOUND
    );
    expect(() => removeAllocatedItemFromCart(item2, cartItems)).toThrow(
      CartErrorEnum.ITEM_NOT_FOUND
    );
    expect(() => removeAllocatedItemFromCart(item3, cartItems)).toThrow(
      CartErrorEnum.ITEM_NOT_FOUND
    );
  });
});
