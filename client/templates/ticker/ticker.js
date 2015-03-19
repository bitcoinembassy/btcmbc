Template.ticker.helpers({
  ticker: function () {
    return Prices.findOne({}, {sort: {createdAt: -1}});
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
