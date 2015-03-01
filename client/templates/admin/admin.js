Template.admin.helpers({
  ticker: function() {
    return Tickers.findOne();
  },
  admin: function() {
    if (Meteor.userId() && Meteor.user().emails[0].verified) {
      return true;
    } else {
      return false;
    }
  }
});

Template.admin.events({
  "submit .edit-percentage-fee": function (event) {
    var percentageFee = event.target.percentageFee.value;

    if (Tickers.find().count() === 1) {
      Meteor.call("editPercentageFee", percentageFee);
    }

    return false;
  }
});
