Router.configure({
  layoutTemplate: 'appLayout'
});

Router.route('/', {
  name: 'ticker'
});

Router.route('/sell');

Router.route('/admin');
