Session.setDefault("fiatQuantity", 100);
Session.setDefault("btcQuantity", 0);

Meteor.subscribe("messages");

Template.sell.helpers({
  messages: function() {
    return Messages.find();
  },
  fiatQuantity: function() {
    return accounting.toFixed(Session.get("fiatQuantity"), 2);
  },
  btcQuantity: function() {
    var btcQuantity = Session.get("btcQuantity");
    if (btcQuantity) {
      return accounting.toFixed(btcQuantity, 4);
    } else {
      var current_price = Prices.findOne({}, {sort: {createdAt: -1}});
      if (current_price) {
        btcQuantity = (100 - current_price.flat_fee_for_buyers) / current_price.buy_price;
      }
      return accounting.toFixed(btcQuantity, 4);
    }
  },
  price: function() {
    var price = Prices.findOne({}, {sort: {createdAt: -1}});
    if (price) {
      return price.sell_price;
    }
  },
  currentTime: function() {
    return moment(Session.get('time') || new Date()).format("dddd, MMMM Do, h:mm A");
  }
});

Template.sell.events({
  "input #fiat": function (event) {
    var current_price = Prices.findOne({}, {sort: {createdAt: -1}});
    Session.set("btcQuantity", (event.target.value - current_price.flat_fee_for_buyers) / current_price.buy_price);
  },
  "input #btc": function (event) {
    var current_price = Prices.findOne({}, {sort: {createdAt: -1}});
    Session.set("fiatQuantity", (event.target.value * current_price.buy_price) + current_price.flat_fee_for_buyers);
  }
});

Meteor.setInterval(function () {
  Session.set('time', new Date());
}, 30000);
