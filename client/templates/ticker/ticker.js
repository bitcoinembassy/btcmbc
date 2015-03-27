Meteor.subscribe("prices");

Template.ticker.helpers({
  price: function() {
    return Prices.findOne({}, {sort: {createdAt: -1}});
  },
  btcQuantity: function() {
    var latestPrice = Prices.findOne({}, {sort: {createdAt: -1}});
    if (latestPrice) {
      var btcQuantity = 100 / latestPrice.btcmbcCAD;
      return accounting.toFixed(btcQuantity, 4);
    }
  },
  currentTime: function() {
    return moment(Session.get('time') || new Date()).format("dddd, MMMM Do, h:mm A");
  }
});

Template.ticker.onRendered(function() {
  $('#price').fitText(0.75);
});

Template.ticker.events({
  "click #buy": function (event) {
    var latestPrice = Prices.findOne({}, {sort: {createdAt: -1}});
    $('#price').text(latestPrice.btcmbcCAD);
    $('#buy').toggleClass('btn-default btn-primary').addClass('disabled');
    $('#sell').toggleClass('btn-primary btn-default').removeClass('disabled');
  },
  "click #sell": function (event) {
    $('#price').text('sellprice');
    $('#sell').toggleClass('btn-default btn-primary').addClass('disabled');
    $('#buy').toggleClass('btn-primary btn-default').removeClass('disabled');
  },
  "input #fiat": function (event) {
    var latestPrice = Prices.findOne({}, {sort: {createdAt: -1}});
    var btcQuantity = event.target.value / latestPrice.btcmbcCAD;
    $('#btc').val(accounting.toFixed(btcQuantity, 4));
  },
  "input #btc": function (event) {
    var latestPrice = Prices.findOne({}, {sort: {createdAt: -1}});
    var fiatQuantity = event.target.value * latestPrice.btcmbcCAD;
    $('#fiat').val(accounting.toFixed(fiatQuantity, 2));
  },
  "click #current-time": function (event) {
    Router.go('/admin');
  }
});

Meteor.setInterval(function () {
  Session.set('time', new Date());
}, 30000);
