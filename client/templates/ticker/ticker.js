Template.ticker.helpers({
  price: function () {
    return Prices.findOne({}, {sort: {createdAt: -1}}).btcmbcCAD.toFixed(2);
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
