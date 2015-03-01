Template.admin.helpers({
  ticker: function() {
    return Tickers.findOne();
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
