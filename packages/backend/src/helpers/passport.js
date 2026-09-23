import passport from 'passport';

export default function configurePassport(app) {
  app.use(
    passport.initialize({
      userProperty: 'currentUser',
    })
  );
}
