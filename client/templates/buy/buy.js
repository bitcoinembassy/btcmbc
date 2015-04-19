Session.setDefault("buyAmountCAD", NaN);
Session.setDefault("buyAmountBTC", NaN);

Template.buy.helpers({
  price: function() {
    var price = Prices.findOne({}, {sort: {createdAt: -1}});
    if (price) {
      return price.buy_price;
    }
  },
  flatFee: function() {
    var price = Prices.findOne({}, {sort: {createdAt: -1}});
    if (price) {
      return price.flat_fee_for_buyers;
    }
  },
  placeholderAmountCAD: function() {
    if (isNaN(Session.get("buyAmountCAD"))) {
      return 100;
    }
  },
  placeholderAmountBTC: function() {
    if (isNaN(Session.get("buyAmountBTC"))) {
      var current_price = Prices.findOne({}, {sort: {createdAt: -1}});
      if (current_price) {
        return accounting.toFixed((100 - current_price.flat_fee_for_buyers) / current_price.buy_price, 4);
      }
    }
  },
  buyAmountCAD: function() {
    if (Session.get("buyAmountCAD") > 0) {
      return Session.get("buyAmountCAD");
    }
  },
  buyAmountBTC: function() {
    if (Session.get("buyAmountBTC") > 0) {
      return Session.get("buyAmountBTC");
    }
  },
  bitcoinValue: function() {
    var current_price = Prices.findOne({}, {sort: {createdAt: -1}});
    if (current_price) {
      if (current_price.coinbase_cad > current_price.bitpay_cad) {
        return "Coinbase";
      } else {
        return "BitPay";
      }
    }
  },
  buyAmountValueCAD: function() {
    var current_price = Prices.findOne({}, {sort: {createdAt: -1}});
    var bitcoin_price = current_price.coinbase_cad;
    if (current_price) {
      if (current_price.coinbase_cad < current_price.bitpay_cad) {
        bitcoin_price = current_price.bitpay_cad;
      }
      return Session.get("buyAmountBTC") * bitcoin_price;
    }
  },
  buyAmountValueUSD: function() {
    var current_price = Prices.findOne({}, {sort: {createdAt: -1}});
    var bitcoin_price = current_price.coinbase_usd;
    if (current_price) {
      if (current_price.coinbase_cad < current_price.bitpay_cad) {
        bitcoin_price = current_price.bitpay_usd;
      }
      return Session.get("buyAmountBTC") * bitcoin_price;
    }
  },
  currentTime: function() {
    return moment(Session.get('time') || new Date()).format("dddd, MMMM Do, h:mm A");
  }
});

Template.buy.events({
  "click input": function (event) {
    $(event.target).select();
  },
  "input #cad": function (event) {
    var buyAmountCAD = event.target.value;
    if ($.isNumeric(buyAmountCAD)) {
      Session.set("buyAmountCAD", buyAmountCAD);
      var current_price = Prices.findOne({}, {sort: {createdAt: -1}});
      if (Session.get("buyAmountCAD") > current_price.flat_fee_for_buyers) {
        var buyAmountBTC = (Session.get("buyAmountCAD") - current_price.flat_fee_for_buyers) / current_price.buy_price;
        Session.set("buyAmountBTC", accounting.toFixed(buyAmountBTC, 4));
      } else {
        Session.set("buyAmountBTC", 0);
      }
    } else {
      Session.set("buyAmountCAD", NaN);
      Session.set("buyAmountBTC", NaN);
    }
  },
  "input #btc": function (event) {
    var buyAmountBTC = event.target.value;
    if ($.isNumeric(buyAmountBTC)) {
      Session.set("buyAmountBTC", buyAmountBTC);
      var current_price = Prices.findOne({}, {sort: {createdAt: -1}});
      var buyAmountCAD = Session.get("buyAmountBTC") * current_price.buy_price + current_price.flat_fee_for_buyers;
      if (buyAmountCAD > current_price.flat_fee_for_buyers) {
        Session.set("buyAmountCAD", accounting.toFixed(buyAmountCAD, 2));
      } else {
        Session.set("buyAmountCAD", 0);
      }
    } else {
      Session.set("buyAmountCAD", NaN);
      Session.set("buyAmountBTC", NaN);
    }
  }
});

Meteor.setInterval(function () {
  Session.set('time', new Date());
}, 30000);
