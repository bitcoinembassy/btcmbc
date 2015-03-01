Meteor.startup(function () {
  if (Tickers.find().count() === 0) {
    HTTP.get("https://bitpay.com/api/rates", function(err, resp) {
      var rates = JSON.parse(resp.content);
      var cadExchangeRate = rates[5]['rate'];
      var usdExchangeRate = rates[1]['rate'];
      var bitpayUSDCAD = cadExchangeRate / usdExchangeRate;
      var openexchangerates = HTTP.get("https://openexchangerates.org/api/latest.json?app_id=ae60fc40b931474cb23db0f695d6f12a");
      var openexchangeratesUSDCAD = JSON.parse(openexchangerates.content)['rates']['CAD'];
      var difference = bitpayUSDCAD - openexchangeratesUSDCAD;
      var percentageFee = 1.05;
      var btcmbc = cadExchangeRate * percentageFee;
      var btcmbcExchangeRate = btcmbc.toFixed(2);
      Tickers.insert({
        percentageFee: 5,
        btcmbcExchangeRate: btcmbcExchangeRate,
        cadExchangeRate: cadExchangeRate,
        usdExchangeRate: usdExchangeRate,
        bitpayUSDCAD: bitpayUSDCAD,
        openexchangeratesUSDCAD: openexchangeratesUSDCAD,
        difference: difference
      });
    });
  }
});
