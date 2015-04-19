Template.settings.helpers({
  price: function() {
    return Prices.findOne({}, {sort: {createdAt: -1}});
  }
});

Template.settings.events({
  "click input": function (event) {
    $(event.target).select();
  },
  "keypress #percentage-above-bitcoin-price": function (event) {
    var percentage = parseFloat(event.target.value);
    if ($.isNumeric(percentage) && event.which === 13) {
      var current_price = Prices.findOne({}, {sort: {createdAt: -1}});
      Meteor.call("editPercentageAboveBitcoinPrice", percentage, current_price);
    }
  },
  "keypress #flat-fee-for-buyers": function (event) {
    var flat_fee = parseFloat(event.target.value);
    if ($.isNumeric(flat_fee) && event.which === 13) {
      var current_price = Prices.findOne({}, {sort: {createdAt: -1}});
      Meteor.call("editFlatFeeForBuyers", flat_fee, current_price);
    }
  },
  "keypress #percentage-below-bitcoin-price": function (event) {
    var percentage = parseFloat(event.target.value);
    if ($.isNumeric(percentage) && event.which === 13) {
      var current_price = Prices.findOne({}, {sort: {createdAt: -1}});
      Meteor.call("editPercentageBelowBitcoinPrice", percentage, current_price);
    }
  },
  "keypress #flat-fee-for-sellers": function (event) {
    var flat_fee = parseFloat(event.target.value);
    if ($.isNumeric(flat_fee) && event.which === 13) {
      var current_price = Prices.findOne({}, {sort: {createdAt: -1}});
      Meteor.call("editFlatFeeForSellers", flat_fee, current_price);
    }
  }
});
