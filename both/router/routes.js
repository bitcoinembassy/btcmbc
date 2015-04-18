Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function() {
  this.redirect('/buy');
});

Router.route('/buy');
Router.route('/sell');
Router.route('/price');

Router.route('/settings');
