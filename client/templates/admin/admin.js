Template.admin.helpers({
  latestprice: function() {
    return Prices.findOne({}, {sort: {createdAt: -1}});
  },
  prices: function() {
    return Prices.find({}, {sort: {createdAt: -1}, limit: 100});
  }
});

Template.admin.events({
  "submit .editBrokerageFee": function (event) {
    var brokerageFee = event.target.brokerageFee.value;
    Meteor.call("editBrokerageFee", brokerageFee);
    return false;
  }
});
