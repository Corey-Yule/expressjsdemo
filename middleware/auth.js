const supabase = require("./supabase.js");
//Supabase Docs

async function getSelf(req) {
  const accessToken = req.cookies['sb-access-token']

  if (!accessToken) { return null }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    return user.user_metadata.username ? user.user_metadata.username : null
  } catch (error) {
    console.error("middleware issue")

    return 
  }
}

async function authenticateUser(req, res, next) {
  const accessToken = req.cookies['sb-access-token'];
  const refreshToken = req.cookies['sb-refresh-token'];
  
  // Check if tokens exist
  if (!accessToken) {
    return res.redirect('/login'); // Redirect to login if not authenticated
  }
  
  try {
    // Verify the access token and get user
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
    if (!error) { req.user = user }
    if (error && !refreshToken) { return res.redirect('/login') }
    if (error && refreshToken) {
      const { data, error: refreshError } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      });
      
      if (refreshError) {
        // Refresh failed, redirect to login
        res.clearCookie('sb-access-token');
        res.clearCookie('sb-refresh-token');
        return res.redirect('/login');
      }
      
      // Update cookies with new tokens
      res.cookie('sb-access-token', data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });
      
      res.cookie('sb-refresh-token', data.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });
      
      req.user = data.user;
    }
    
    next(); // Continue to the route
    
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.clearCookie('sb-access-token');
    res.clearCookie('sb-refresh-token');
    return res.redirect('/login');
  }
}

async function redirectIfAuthenticated(req, res, next) {
  const accessToken = req.cookies['sb-access-token'];
  
  if (!accessToken) { return next(); } // Not authenticated, continue to login page
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (user && !error) { return res.redirect('/'); } // User is authenticated, redirect away from login page
  } catch (error) {
    console.log("error redirecting, continuing to login page")
  }

  next(); // Token invalid or error, continue to login
}

async function checkAuth(req) {
  const accessToken = req.cookies['sb-access-token'];
  const refreshToken = req.cookies['sb-refresh-token'];
  
  if (!accessToken) {
    return { authenticated: false, user: null };
  }
  
  try {
    let { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    // If token expired but refresh token exists, try refreshing
    if (error && refreshToken) {
      const { data, error: refreshError } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      });
      
      if (!refreshError && data.session) {
        return { 
          authenticated: true, 
          user: data.user,
          newTokens: data.session // Return new tokens so route can update cookies
        };
      }
    }
    
    if (user && !error) { return { authenticated: true, user: user }; }
  } catch (error) {
    console.log("error with middleware unable to authenticate")
  }

  return { authenticated: false, user: null };
}

module.exports = { getSelf, authenticateUser, redirectIfAuthenticated, checkAuth }; //These three functions are pretty self explanitory grabbed from supabase's express.js docs
