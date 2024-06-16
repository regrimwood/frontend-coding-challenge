export enum CartErrorEnum {
  DATA_NOT_FOUND = "Something went wrong! Please try again",
  BOOKING_LIMIT_EXCEEDED = "Booking limit reached! You can't add any more tickets for this event.",
  GA_LIMIT_EXCEEDED = "Ticket limit reached! You can't add any more tickets of this type.",
  CAPACITY_EXCEEDED = "Not enough tickets available!",
  ITEM_NOT_FOUND = "Item not found in cart!",
  SEAT_ALREADY_IN_CART = "Seat already in cart",
  SEAT_NOT_AVAILABLE = "Seat not available",
  QUANTITY_EXCEEDED = "You can only add one ticket at a time",
  QUANTITY_INVALID = "Invalid quantity",
}
