Template.settings.helpers({
  price: function() {
    return Prices.findOne({}, {sort: {createdAt: -1}});
  }
});

Template.settings.events({
  "input #percentageFee": function (event) {
    var percentageFee = parseFloat(event.target.value);
    if ($.isNumeric(percentageFee)) {
      var price = Prices.findOne({}, {sort: {createdAt: -1}});
      Meteor.call("editPercentageFee", percentageFee, price);
    }
  },
  "input #flatFee": function (event) {
    var flatFee = parseFloat(event.target.value);
    if ($.isNumeric(flatFee)) {
      Meteor.users.update({_id: Meteor.user()._id}, { $set: {"profile.flatFee": flatFee}});
    }
  },
  "click #buy": function (event) {
    var latestPrice = Prices.findOne({}, {sort: {createdAt: -1}});
    $('#price').text(latestPrice.btcmbcCAD);
    $('#buy').toggleClass('btn-default btn-primary').addClass('disabled');
    $('#sell').toggleClass('btn-primary btn-default').removeClass('disabled');
  },
  "click #sell": function (event) {
    $('#price').text('sellprice');
    $('#sell').toggleClass('btn-default btn-primary').addClass('disabled');
    $('#buy').toggleClass('btn-primary btn-default').removeClass('disabled');
  }
});

Template.settings.onRendered(function() {
  $('#price').fitText(0.75);
});
