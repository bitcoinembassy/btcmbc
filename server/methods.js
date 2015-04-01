Meteor.methods({
  editPercentageFee: function (percentageFee, price) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Prices.update(price._id, {$set: {percentageFee: percentageFee}});

    var btcmbcCAD = (price.bitpayCAD * (1 + (percentageFee / 100)));

    Prices.update(price._id, {$set: {btcmbcCAD: btcmbcCAD}});
  }
});
