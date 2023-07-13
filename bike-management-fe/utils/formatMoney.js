const formatMoney = (price) => {
  return new Intl.NumberFormat("en-DE").format(price);
};

export default formatMoney;
