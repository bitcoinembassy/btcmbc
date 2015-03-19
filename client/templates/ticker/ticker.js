Template.ticker.helpers({
  price: function () {
    return Prices.findOne({}, {sort: {createdAt: -1}}).btcmbcCAD.toFixed(2);
  },
  currentTime: function() {
    return moment(Session.get('time') || new Date()).format("h:m A");
  }
});

Template.ticker.rendered = function() {
  $('h1').fitText();
};

Template.ticker.events({
  "click h1": function (event) {
    Router.go('/admin');
  }
});

Meteor.setInterval(function () {
  Session.set('time', new Date());
}, 1000);
