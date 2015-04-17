Router.configure({
  layoutTemplate: 'appLayout'
});

Router.route('/', function() {
  this.redirect('/buy');
});

Router.route('/buy');
Router.route('/sell');

Router.route('/prices');
Router.route('/settings');
