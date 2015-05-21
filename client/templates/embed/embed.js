Session.setDefault("buyAmountCAD", NaN);
Session.setDefault("buyAmountBTC", NaN);

Session.setDefault("sellAmountBTC", NaN);
Session.setDefault("sellAmountCAD", NaN);

Template.embed.helpers({
  buyPrice: function() {
    var price = Prices.findOne({}, {sort: {createdAt: -1}});
    if (price) {
      return price.buy_price;
    }
  },
  flatFeeForBuying: function() {
    var price = Prices.findOne({}, {sort: {createdAt: -1}});
    if (price) {
      return price.flat_fee_for_buyers;
    }
  },
  placeholderBuyAmountCAD: function() {
    if (isNaN(Session.get("buyAmountCAD"))) {
      return 100;
    }
  },
  placeholderBuyAmountBTC: function() {
    if (isNaN(Session.get("buyAmountBTC"))) {
      var current_price = Prices.findOne({}, {sort: {createdAt: -1}});
      if (current_price) {
        return accounting.toFixed((100 - current_price.flat_fee_for_buyers) / current_price.buy_price, 4);
      }
    }
  },
  buyAmountCAD: function() {
    return Session.get("buyAmountCAD");
  },
  buyAmountBTC: function() {
    return Session.get("buyAmountBTC");
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
  sellPrice: function() {
    var price = Prices.findOne({}, {sort: {createdAt: -1}});
    if (price) {
      return price.sell_price;
    }
  },
  flatFeeForSelling: function() {
    var price = Prices.findOne({}, {sort: {createdAt: -1}});
    if (price) {
      return price.flat_fee_for_sellers;
    }
  },
  placeholderSellAmountBTC: function() {
    if (isNaN(Session.get("sellAmountBTC"))) {
      return 0.5;
    }
  },
  placeholderSellAmountCAD: function() {
    if (isNaN(Session.get("sellAmountCAD"))) {
      var current_price = Prices.findOne({}, {sort: {createdAt: -1}});
      if (current_price) {
        return accounting.toFixed(0.5  * current_price.sell_price - current_price.flat_fee_for_sellers, 2);
      }
    }
  },
  sellAmountBTC: function() {
    return Session.get("sellAmountBTC");
  },
  sellAmountCAD: function() {
    return Session.get("sellAmountCAD");
  }
});

Template.embed.events({
  "click input": function (event) {
    $(event.target).select();
  },
  "input #buyAmountCAD": function (event) {
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
  "input #buyAmountBTC": function (event) {
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
  },
  "input #sellAmountBTC": function (event) {
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
  "input #sellAmountCAD": function (event) {
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
