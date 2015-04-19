Session.setDefault("sellAmountBTC", 1);

Template.sell.helpers({
  price: function() {
    var price = Prices.findOne({}, {sort: {createdAt: -1}});
    if (price) {
      return price.sell_price;
    }
  },
  flatFee: function() {
    var price = Prices.findOne({}, {sort: {createdAt: -1}});
    if (price) {
      return price.flat_fee_for_sellers;
    }
  },
  sellAmountBTC: function() {
    return Session.get("sellAmountBTC");
  },
  sellAmountCAD: function() {
    var sellAmountCAD = Session.get("sellAmountCAD");
    if (sellAmountCAD) {
      return sellAmountCAD;
    } else {
      var current_price = Prices.findOne({}, {sort: {createdAt: -1}});
      if (current_price) {
        sellAmountCAD = Session.get("sellAmountBTC") * current_price.sell_price - current_price.flat_fee_for_sellers;
        Session.set("sellAmountCAD", accounting.toFixed(sellAmountCAD, 2));
      }
    }
  },
  currentTime: function() {
    return moment(Session.get('time') || new Date()).format("dddd, MMMM Do, h:mm A");
  }
});

Template.sell.events({
  "click input": function (event) {
    $(event.target).select();
  },
  "input #btc": function (event) {
    var current_price = Prices.findOne({}, {sort: {createdAt: -1}});
    var sellAmountCAD = parseFloat(event.target.value) * current_price.sell_price - current_price.flat_fee_for_sellers;
    Session.set("sellAmountCAD", accounting.toFixed(sellAmountCAD, 2));
  },
  "input #cad": function (event) {
    var current_price = Prices.findOne({}, {sort: {createdAt: -1}});
    var sellAmountBTC = (parseFloat(event.target.value) + current_price.flat_fee_for_sellers) / current_price.sell_price;
    Session.set("sellAmountBTC", accounting.toFixed(sellAmountBTC, 4));
  }
});

Meteor.setInterval(function () {
  Session.set('time', new Date());
}, 30000);
