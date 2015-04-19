Session.setDefault("buyAmountCAD", 100);

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
  buyAmountCAD: function() {
    return Session.get("buyAmountCAD");
  },
  buyAmountBTC: function() {
    var buyAmountBTC = Session.get("buyAmountBTC");
    if (buyAmountBTC) {
      return buyAmountBTC;
    } else {
      var current_price = Prices.findOne({}, {sort: {createdAt: -1}});
      if (current_price) {
        buyAmountBTC = (Session.get("buyAmountCAD") - current_price.flat_fee_for_buyers) / current_price.buy_price;
        Session.set("buyAmountBTC", accounting.toFixed(buyAmountBTC, 4));
      }
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
  "input #cad": function (event) {
    Session.set("buyAmountCAD", event.target.value);
    var current_price = Prices.findOne({}, {sort: {createdAt: -1}});
    var buyAmountBTC = (Session.get("buyAmountCAD") - current_price.flat_fee_for_buyers) / current_price.buy_price;
    Session.set("buyAmountBTC", accounting.toFixed(buyAmountBTC, 4));
  },
  "input #btc": function (event) {
    Session.set("buyAmountBTC", event.target.value);
    var current_price = Prices.findOne({}, {sort: {createdAt: -1}});
    var buyAmountCAD = Session.get("buyAmountBTC") * current_price.buy_price + current_price.flat_fee_for_buyers;
    Session.set("buyAmountCAD", accounting.toFixed(buyAmountCAD, 2));
  }
});

Meteor.setInterval(function () {
  Session.set('time', new Date());
}, 30000);
