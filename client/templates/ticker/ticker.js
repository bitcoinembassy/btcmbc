var bitpay = function(resp) {
  rates = JSON.parse(resp.content);
  cad = rates[5]['rate'];
  usd = rates[0]['rate'];
  bitpay_rate = cad / usd;
  HTTP.get("https://openexchangerates.org/api/latest.json?app_id=a5512fe9c98849d18bc5bbcc7074f408", function(err, resp) {
    real_rate = JSON.parse(resp.content)['rates']['CAD'];
    difference = bitpay_rate - real_rate;
    console.log(cad + " CAD | " + usd + " USD | " + bitpay_rate + " | " + real_rate + " | " + difference);
  });
  btcmbc = cad * 1.04;
  Session.set('rate', btcmbc.toFixed(2));
}

Meteor.startup(function() {
  HTTP.get("https://bitpay.com/api/rates", function(err, resp) {
    bitpay(resp);
  });
});

Meteor.setInterval(function() {
  HTTP.get("https://bitpay.com/api/rates", function(err, resp) {
    bitpay(resp);
  });
}, 60000);


Template.ticker.helpers({
  rate: function () {
    return Session.get("rate");
  }
});
Template.ticker.rendered = function() {
  $('h1').fitText();
};
