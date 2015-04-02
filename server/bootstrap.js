Meteor.startup(function () {
  if (Messages.find().count() === 0) {
    Messages.insert({
      body: 'Click here to edit this message.'
    });
  }

  Meteor.setInterval(function() {
    HTTP.get("https://bitpay.com/api/rates", function(err, resp) {
      var bitpay = JSON.parse(resp.content);
      var bitpayCAD = bitpay[5]['rate'];
      var percentageFee = Prices.findOne({}, {sort: {createdAt: -1}}).percentageFee;
      var btcmbcCAD = bitpayCAD * (1 + (percentageFee / 100));
      var bitpayUSD = bitpay[1]['rate'];
      var bitpayUSD_CAD = bitpayCAD / bitpayUSD;

      Prices.insert({
        bitpayCAD: bitpayCAD,
        percentageFee: percentageFee,
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
      var percentageFee = 5;
      var btcmbcCAD = bitpayCAD * (1 + (percentageFee / 100));
      var bitpayUSD = bitpay[1]['rate'];
      var bitpayUSD_CAD = bitpayCAD / bitpayUSD;

      Prices.insert({
        bitpayCAD: bitpayCAD,
        percentageFee: percentageFee,
        btcmbcCAD: btcmbcCAD,
        bitpayUSD: bitpayUSD,
        bitpayUSD_CAD: bitpayUSD_CAD
      });
    });
  }
});
