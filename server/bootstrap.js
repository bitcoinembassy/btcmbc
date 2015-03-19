Meteor.startup(function () {
  Meteor.setInterval(function() {
    HTTP.get("https://bitpay.com/api/rates", function(err, resp) {
      var bitpay = JSON.parse(resp.content);
      var bitpayCAD = bitpay[5]['rate'];
      var brokerageFee = Prices.findOne({}, {sort: {createdAt: -1}}).brokerageFee;
      var btcmbcCAD = (bitpayCAD * (1 + (brokerageFee / 100))).toFixed(2);
      var bitpayUSD = bitpay[1]['rate'];
      var bitpayUSD_CAD = bitpayCAD / bitpayUSD;

      Prices.insert({
        bitpayCAD: bitpayCAD,
        brokerageFee: brokerageFee,
        btcmbcCAD: btcmbcCAD,
        bitpayUSD: bitpayUSD,
        bitpayUSD_CAD: bitpayUSD_CAD
      });
    });
  }, 60000);

  if (Prices.find().count() === 0) {
    HTTP.get("https://bitpay.com/api/rates", function(err, resp) {
      var bitpay = JSON.parse(resp.content);
      var bitpayCAD = bitpay[5]['rate'];
      var brokerageFee = 5;
      var btcmbcCAD = (bitpayCAD * (1 + (brokerageFee / 100))).toFixed(2);
      var bitpayUSD = bitpay[1]['rate'];
      var bitpayUSD_CAD = bitpayCAD / bitpayUSD;

      Prices.insert({
        bitpayCAD: bitpayCAD,
        brokerageFee: brokerageFee,
        btcmbcCAD: btcmbcCAD,
        bitpayUSD: bitpayUSD,
        bitpayUSD_CAD: bitpayUSD_CAD
      });
    });
  }
});
