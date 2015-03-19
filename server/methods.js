Meteor.methods({
  editBrokerageFee: function (brokerageFee) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var latestPrice = Prices.findOne({}, {sort: {createdAt: -1}});

    Prices.update(latestPrice._id, {$set: {brokerageFee: brokerageFee}});

    var btcmbcCAD = (latestPrice.bitpayCAD * (1 + (brokerageFee / 100)));

    Prices.update(latestPrice._id, {$set: {btcmbcCAD: btcmbcCAD}});
  }
});
