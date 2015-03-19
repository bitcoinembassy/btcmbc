Template.admin.helpers({
  prices: function() {
    return Prices.find({}, {sort: {createdAt: -1}, limit: 100});
  },
  admin: function() {
    if (Meteor.user().emails[0].verified) {
      return true;
    } else {
      return false;
    }
  }
});

Template.admin.events({
  "submit .editBrokerageFee": function (event) {
    var brokerageFee = event.target.brokerageFee.value;
    Meteor.call("editBrokerageFee", brokerageFee);
    return false;
  }
});
