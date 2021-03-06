Meteor.methods({
  editPercentageAboveBitcoinPrice: function (percentage, price) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Prices.update(price._id, {$set: {percentage_above_bitcoin_price: percentage}});

    var buy_price = Math.max(price.coinbase_cad, price.bitpay_cad) * (1 + percentage / 100);

    Prices.update(price._id, {$set: {buy_price: buy_price}});
  },

  editFlatFeeForBuyers: function (flat_fee, price) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Prices.update(price._id, {$set: {flat_fee_for_buyers: flat_fee}});
  },
  editPercentageBelowBitcoinPrice: function (percentage, price) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Prices.update(price._id, {$set: {percentage_below_bitcoin_price: percentage}});

    var sell_price = Math.min(price.coinbase_cad, price.bitpay_cad) * (1 - percentage / 100);

    Prices.update(price._id, {$set: {sell_price: sell_price}});
  },

  editFlatFeeForSellers: function (flat_fee, price) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Prices.update(price._id, {$set: {flat_fee_for_sellers: flat_fee}});
  }
});
