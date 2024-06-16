const formatToNZD = (price: number) => {
  const NZDCurrency = new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
  });

  return NZDCurrency.format(price);
};

export default formatToNZD;
