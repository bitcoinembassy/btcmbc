Session.setDefault("fiatQuantity", 100);
Session.setDefault("currency", "CAD");
Session.setDefault("btcQuantity", 0);

Meteor.subscribe("messages");

Template.buy.helpers({
  messages: function() {
    return Messages.find();
  },
  fiatQuantity: function() {
    return accounting.toFixed(Session.get("fiatQuantity"), 2);
  },
  currency: function() {
    return Session.get("currency");
  },
  btcQuantity: function() {
    var btcQuantity = Session.get("btcQuantity");
    if (btcQuantity) {
      return accounting.toFixed(btcQuantity, 4);
    } else {
      var price = Prices.findOne({}, {sort: {createdAt: -1}});
      if (price) {
        if (Meteor.userId()) {
          var flatFee = Meteor.user().profile.flatFee;
          btcQuantity = (100 - flatFee) / price.btcmbcCAD;
        } else {
          btcQuantity = 100 / price.btcmbcCAD;
        }
      }
      return accounting.toFixed(btcQuantity, 4);
    }
  },
  price: function() {
    var price = Prices.findOne({}, {sort: {createdAt: -1}});
    if (Session.equals("currency", "CAD")) {
      if (price) {
        return price.btcmbcCAD;
      }
    } else {
      var btcmbcUSD = price.bitpayUSD * (1 + (price.percentageFee / 100));
      return btcmbcUSD;
    }
  },
  currentTime: function() {
    return moment(Session.get('time') || new Date()).format("dddd, MMMM Do, h:mm A");
  }
});

Template.ticker.events({
  "input #fiat": function (event) {
    var price = Prices.findOne({}, {sort: {createdAt: -1}});
    if (Meteor.userId()) {
      var flatFee = Meteor.user().profile.flatFee;
      Session.set("btcQuantity", (event.target.value - flatFee) / price.btcmbcCAD);
    } else {
      Session.set("btcQuantity", event.target.value / price.btcmbcCAD);
    }
  },
  "click #currency": function (event) {
    var price = Prices.findOne({}, {sort: {createdAt: -1}});
    if (Session.equals("currency", "CAD")) {
      Session.set("currency", "USD");
      Session.set("fiatQuantity", Session.get("fiatQuantity") / price.bitpayUSD_CAD);
    } else {
      Session.set("currency", "CAD");
      Session.set("fiatQuantity", Session.get("fiatQuantity") * price.bitpayUSD_CAD);
    }
  },
  "input #btc": function (event) {
    var price = Prices.findOne({}, {sort: {createdAt: -1}});
    if (Meteor.userId()) {
      var flatFee = Meteor.user().profile.flatFee;
      Session.set("fiatQuantity", (event.target.value * price.btcmbcCAD) + flatFee);
    } else {
      Session.set("fiatQuantity", event.target.value * price.btcmbcCAD);
    }
  }
});

Meteor.setInterval(function () {
  Session.set('time', new Date());
}, 30000);
