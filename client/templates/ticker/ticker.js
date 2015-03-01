Template.ticker.helpers({
  ticker: function () {
    return Tickers.findOne();
  }
});

Template.ticker.rendered = function() {
  $('h1').fitText();
};
