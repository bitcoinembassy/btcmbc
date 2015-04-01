Router.configure({
  layoutTemplate: 'appLayout'
});

Router.route('/', {
  name: 'ticker'
});

Router.route('/settings');

Router.route('/prices');
