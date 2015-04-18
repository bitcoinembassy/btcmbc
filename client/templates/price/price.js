Meteor.subscribe("prices");

Template.price.helpers({
  prices: function() {
    return Prices.find({}, {sort: {createdAt: -1}});
  }
});

Template.registerHelper('formatPrice', function(price) {
  return accounting.formatMoney(price);
});

Template.registerHelper('formatUSDCAD', function(price) {
  return accounting.formatMoney(price, "$", 4);
});
