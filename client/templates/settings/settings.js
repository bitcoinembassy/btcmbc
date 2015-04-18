Template.settings.helpers({
  price: function() {
    return Prices.findOne({}, {sort: {createdAt: -1}});
  }
});

Template.settings.events({
  "input #percentage-above-bitcoin-price": function (event) {
    var percentage = parseFloat(event.target.value);
    if ($.isNumeric(percentage)) {
      var current_price = Prices.findOne({}, {sort: {createdAt: -1}});
      Meteor.call("editPercentageAboveBitcoinPrice", percentage, current_price);
    }
  },
  "input #flat-fee-for-buyers": function (event) {
    var flat_fee = parseFloat(event.target.value);
    if ($.isNumeric(flat_fee)) {
      var current_price = Prices.findOne({}, {sort: {createdAt: -1}});
      Meteor.call("editFlatFeeForBuyers", flat_fee, current_price);
    }
  }
});
