// middleware/authContext.js
const { checkAuth } = require();

module.exports = async function authContext(req, res, next) {
  const auth = await checkAuth(req);

  res.locals.authenticated = auth.authenticated;
  res.locals.user = auth.user;

  if (auth.newTokens) {
    res.cookie('sb-access-token', auth.newTokens.access_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });

    res.cookie('sb-refresh-token', auth.newTokens.refresh_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
  }

  next();
};
