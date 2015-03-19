Template.ticker.helpers({
  ticker: function () {
    return Prices.findOne({}, {sort: {createdAt: -1}});
  }
});

Template.ticker.rendered = function() {
  $('h1').fitText();
};
