// isAuthenticated
// ===============
// Route / respond to request
// based on Passport cookie's auth status
// ---------------
export function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    next()
  else if (req.url.includes('/api/'))
    res.status(401).send('Unauthorized')
  else
    res.status(302).redirect('/login')
}