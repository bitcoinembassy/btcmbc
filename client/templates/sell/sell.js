Session.setDefault("sellAmountBTC", NaN);
Session.setDefault("sellAmountCAD", NaN);

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
  placeholderAmountBTC: function() {
    if (isNaN(Session.get("sellAmountBTC"))) {
      return 0.5;
    }
  },
  placeholderAmountCAD: function() {
    if (isNaN(Session.get("sellAmountCAD"))) {
      var current_price = Prices.findOne({}, {sort: {createdAt: -1}});
      if (current_price) {
        return accounting.toFixed(0.5  * current_price.buy_price - current_price.flat_fee_for_buyers, 2);
      }
    }
  },

  sellAmountBTC: function() {
    if (Session.get("sellAmountBTC") > 0) {
      return Session.get("sellAmountBTC");
    }
  },
  sellAmountCAD: function() {
    if (Session.get("sellAmountCAD") > 0) {
      return Session.get("sellAmountCAD");
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
    var sellAmountBTC = event.target.value;
    if ($.isNumeric(sellAmountBTC)) {
      Session.set("sellAmountBTC", sellAmountBTC);
      var current_price = Prices.findOne({}, {sort: {createdAt: -1}});
      var sellAmountCAD = event.target.value * current_price.sell_price - current_price.flat_fee_for_sellers;
      if (sellAmountCAD > current_price.flat_fee_for_sellers) {
        Session.set("sellAmountCAD", accounting.toFixed(sellAmountCAD, 2));
      } else {
        Session.set("sellAmountCAD", 0);
      }
    } else {
      Session.set("sellAmountCAD", NaN);
      Session.set("sellAmountBTC", NaN);
    }
  },
  "input #cad": function (event) {
    var sellAmountCAD = event.target.value;
    if ($.isNumeric(sellAmountCAD)) {
      Session.set("sellAmountCAD", sellAmountCAD);
      var current_price = Prices.findOne({}, {sort: {createdAt: -1}});
      if (sellAmountCAD > current_price.flat_fee_for_sellers) {
        var sellAmountBTC = (parseFloat(sellAmountCAD) + current_price.flat_fee_for_sellers) / current_price.sell_price;
        Session.set("sellAmountBTC", accounting.toFixed(sellAmountBTC, 4));
      } else {
        Session.set("sellAmountBTC", 0);
      }
    } else {
      Session.set("sellAmountCAD", NaN);
      Session.set("sellAmountBTC", NaN);
    }
  }
});

Meteor.setInterval(function () {
  Session.set('time', new Date());
}, 30000);
