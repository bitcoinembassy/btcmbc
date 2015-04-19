Meteor.publish("prices", function () {
  return Prices.find({}, {sort: {createdAt: -1}, limit: 40});
});
