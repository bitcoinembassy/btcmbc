Accounts.validateNewUser(function (user) {
  if (Meteor.users.find().count() === 0)
    return true;
  throw new Meteor.Error(403, "There is already an admin account");
});
