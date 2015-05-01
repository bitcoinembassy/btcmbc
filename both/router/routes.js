Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function() {
  this.redirect('/buy');
});

Router.route('/buy');
Router.route('/sell');
Router.route('/price');

Router.route('/settings');

Router.route('/embed', function () {
  this.layout('WidgetLayout');
  this.render('embed');
});
