Meteor.startup(function () {
  Meteor.setInterval(function() {
    HTTP.get("https://bitpay.com/api/rates", function(err, resp) {
      var bitpay = JSON.parse(resp.content);
      var bitpay_btc_to_cad = bitpay[5]['rate'];
      var bitpay_btc_to_usd = bitpay[1]['rate'];
      var bitpay_usd_to_cad = bitpay_btc_to_cad / bitpay_btc_to_usd;

      var previous_price = Prices.findOne({}, {sort: {createdAt: -1}});

      var percentage_fee_for_buyers = previous_price.percentage_fee_for_buyers;
      var flat_fee_for_buyers = previous_price.flat_fee_for_buyers;
      var buy_price = bitpay_btc_to_cad * (1 + percentage_fee_for_buyers / 100);

      var percentage_fee_for_sellers = previous_price.percentage_fee_for_sellers;
      var flat_fee_for_sellers = previous_price.flat_fee_for_sellers;
      var sell_price = bitpay_btc_to_cad * (1 + percentage_fee_for_sellers / 100);

      Prices.insert({
        bitpay_btc_to_usd: bitpay_btc_to_usd,
        bitpay_usd_to_cad: bitpay_usd_to_cad,
        bitpay_btc_to_cad: bitpay_btc_to_cad,

        percentage_fee_for_buyers: percentage_fee_for_buyers,
        flat_fee_for_buyers: flat_fee_for_buyers,
        buy_price: buy_price,

        percentage_fee_for_sellers: percentage_fee_for_sellers,
        flat_fee_for_sellers: flat_fee_for_sellers,
        sell_price: sell_price
      });
    });
  }, 60000);

  if (Messages.find().count() === 0) {
    Messages.insert({
      body: 'Frais de 5$ par transaction / 5$ fee per transactions'
    });
  }

  if (Prices.find().count() === 0) {
    HTTP.get("https://bitpay.com/api/rates", function(err, resp) {
      var bitpay = JSON.parse(resp.content);
      var bitpay_cad_price = bitpay[5]['rate'];
      var bitpay_usd_price = bitpay[1]['rate'];
      var bitpay_usd_to_cad = bitpay_cad_price / bitpay_usd_price;

      var percentage_above_bitpay_price = 5;
      var buy_price = bitpay_btc_to_cad * (1 + percentage_above_bitpay_price / 100);
      var flat_fee_for_buyers = 5;


      var percentage_below_bitpay_price = 6;
      var sell_price = bitpay_btc_to_cad * (1 + percentage_below_bitpay_price / 100);
      var flat_fee_for_sellers = 7;

      Prices.insert({
        bitpay_btc_to_usd: bitpay_btc_to_usd,
        bitpay_usd_to_cad: bitpay_usd_to_cad,
        bitpay_btc_to_cad: bitpay_btc_to_cad,

        percentage_fee_for_buyers: percentage_fee_for_buyers,
        flat_fee_for_buyers: flat_fee_for_buyers,
        buy_price: buy_price,

        percentage_fee_for_sellers: percentage_fee_for_sellers,
        flat_fee_for_sellers: flat_fee_for_sellers,
        sell_price: sell_price
      });
    });
  }
});
