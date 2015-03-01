Meteor.setInterval(function() {
  HTTP.get("https://bitpay.com/api/rates", function(err, resp) {
    var rates = JSON.parse(resp.content);
    var cadExchangeRate = rates[5]['rate'];
    var usdExchangeRate = rates[1]['rate'];
    var bitpayUSDCAD = cadExchangeRate / usdExchangeRate;
    var difference = bitpayUSDCAD - Tickers.findOne().openexchangeratesUSDCAD;
    var percentageFee = 1 + (Tickers.findOne().percentageFee / 100);
    var btcmbc = cadExchangeRate * percentageFee;
    var btcmbcExchangeRate = btcmbc.toFixed(2);
    if (Tickers.find().count() === 1) {
      Tickers.update(Tickers.findOne()._id, {
        $set: {
          btcmbcExchangeRate: btcmbcExchangeRate,
          cadExchangeRate: cadExchangeRate,
          usdExchangeRate: usdExchangeRate,
          bitpayUSDCAD: bitpayUSDCAD,
          difference: difference
        }
      });
    }
  });
}, 60000);

Meteor.setInterval(function() {
  var openexchangerates = HTTP.get("https://openexchangerates.org/api/latest.json?app_id=ae60fc40b931474cb23db0f695d6f12a");
  var openexchangeratesUSDCAD = JSON.parse(openexchangerates.content)['rates']['CAD'];
  if (Tickers.find().count() === 1) {
    Tickers.update(Tickers.findOne()._id, {
      $set: {
        openexchangeratesUSDCAD: openexchangeratesUSDCAD,
      }
    });
  }
}, 3600000);
