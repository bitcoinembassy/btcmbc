Meteor.startup(function () {
  Meteor.setInterval(function() {
    var coinbase = HTTP.get("https://api.coinbase.com/v1/currencies/exchange_rates").data;

    var coinbase_cad = coinbase['btc_to_cad'];
    var coinbase_usd = coinbase['btc_to_usd'];
    var coinbase_usd_to_cad = coinbase['usd_to_cad'];

    var bitpay = HTTP.get("https://bitpay.com/api/rates").data;

    var bitpay_cad = bitpay[5]['rate'];
    var bitpay_usd = bitpay[1]['rate'];
    var bitpay_usd_to_cad = bitpay_cad / bitpay_usd;

    var previous_price = Prices.findOne({}, {sort: {createdAt: -1}});

    var percentage_above_bitcoin_price = previous_price.percentage_above_bitcoin_price;
    var buy_price = Math.max(coinbase_cad, bitpay_cad) * (1 + percentage_above_bitcoin_price / 100);
    var flat_fee_for_buyers = previous_price.flat_fee_for_buyers;

    var percentage_below_bitcoin_price = previous_price.percentage_below_bitcoin_price;
    var sell_price = Math.min(coinbase_cad, bitpay_cad) * (1 - percentage_below_bitcoin_price / 100);
    var flat_fee_for_sellers = previous_price.flat_fee_for_sellers;

    Prices.insert({
      coinbase_cad: coinbase_cad,
      coinbase_usd: coinbase_usd,
      coinbase_usd_to_cad: coinbase_usd_to_cad,

      bitpay_cad: bitpay_cad,
      bitpay_usd: bitpay_usd,
      bitpay_usd_to_cad: bitpay_usd_to_cad,

      percentage_above_bitcoin_price: percentage_above_bitcoin_price,
      buy_price: buy_price,
      flat_fee_for_buyers: flat_fee_for_buyers,

      percentage_below_bitcoin_price: percentage_below_bitcoin_price,
      sell_price: sell_price,
      flat_fee_for_sellers: flat_fee_for_sellers
    });
  }, 60000);

  if (Prices.find().count() === 0) {
    var coinbase = HTTP.get("https://api.coinbase.com/v1/currencies/exchange_rates").data;

    var coinbase_cad = coinbase['btc_to_cad'];
    var coinbase_usd = coinbase['btc_to_usd'];
    var coinbase_usd_to_cad = coinbase['usd_to_cad'];

    var bitpay = HTTP.get("https://bitpay.com/api/rates").data;

    var bitpay_cad = bitpay[5]['rate'];
    var bitpay_usd = bitpay[1]['rate'];
    var bitpay_usd_to_cad = bitpay_cad / bitpay_usd;

    var percentage_above_bitcoin_price = 5;
    var buy_price = Math.max(coinbase_cad, bitpay_cad) * (1 + percentage_above_bitcoin_price / 100);
    var flat_fee_for_buyers = 5;

    var percentage_below_bitcoin_price = 6;
    var sell_price = Math.min(coinbase_cad, bitpay_cad) * (1 - percentage_below_bitcoin_price / 100);
    var flat_fee_for_sellers = 7;

    Prices.insert({
      coinbase_cad: coinbase_cad,
      coinbase_usd: coinbase_usd,
      coinbase_usd_to_cad: coinbase_usd_to_cad,

      bitpay_cad: bitpay_cad,
      bitpay_usd: bitpay_usd,
      bitpay_usd_to_cad: bitpay_usd_to_cad,

      percentage_above_bitcoin_price: percentage_above_bitcoin_price,
      buy_price: buy_price,
      flat_fee_for_buyers: flat_fee_for_buyers,

      percentage_below_bitcoin_price: percentage_below_bitcoin_price,
      sell_price: sell_price,
      flat_fee_for_sellers: flat_fee_for_sellers
    });
  }
});
