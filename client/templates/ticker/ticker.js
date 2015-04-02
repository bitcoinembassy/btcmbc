Session.setDefault("fiatQuantity", 100);
Session.setDefault("btcQuantity", 0);

Template.ticker.helpers({
  price: function() {
    return Prices.findOne({}, {sort: {createdAt: -1}});
  },
  fiatQuantity: function() {
    return accounting.toFixed(Session.get("fiatQuantity"), 2);
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
