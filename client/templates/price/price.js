Meteor.subscribe("prices");

Template.price.helpers({
  coinbase: function() {
    var price = Prices.findOne({}, {sort: {createdAt: -1}});
    if (price) {
      return price.coinbase_cad;
    }
  },
  bitpay: function() {
    var price = Prices.findOne({}, {sort: {createdAt: -1}});
    if (price) {
      return price.bitpay_cad;
    }
  },
  prices: function() {
    return Prices.find({}, {sort: {createdAt: -1}});
  }
});

Template.registerHelper('formatPrice', function(price) {
  return accounting.formatMoney(price);
});

Template.registerHelper('formatAmount', function(price) {
  return accounting.toFixed(price, 2);
});

Template.registerHelper('formatUSDCAD', function(price) {
  return accounting.formatMoney(price, "$", 4);
});
