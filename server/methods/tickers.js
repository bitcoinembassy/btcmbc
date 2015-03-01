Meteor.methods({
  editPercentageFee: function (percentageFee) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tickers.update(Tickers.findOne()._id, {$set: {percentageFee: percentageFee}});

    var btcmbc = Tickers.findOne().cadExchangeRate * (1 + (percentageFee / 100));
    var btcmbcExchangeRate = btcmbc.toFixed(2);

    Tickers.update(Tickers.findOne()._id, {$set: {btcmbcExchangeRate: btcmbcExchangeRate}});
  }
});
