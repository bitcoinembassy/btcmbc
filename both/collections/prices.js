Prices = new Mongo.Collection("prices");

Prices.attachBehaviour('timestampable', {
  createdBy: false
});
