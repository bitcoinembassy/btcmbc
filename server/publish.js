Meteor.publish("prices", function () {
  return Prices.find({}, {sort: {createdAt: -1}, limit: 40});
});

Meteor.publish("messages", function () {
  return Messages.find();
});
