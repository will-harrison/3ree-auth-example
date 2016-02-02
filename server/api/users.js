import xss from 'xss'
import r from 'rethinkdb'

import config from '../config/rethinkDb/dbConfig'
import { SOFT_DURABILITY } from './util'

export function intoSession(user, done) {
  return done(null, user.id)
}

export function outOfSession(userId, done) {
  return r.connect(config)
  .then(conn => {
    return r
    .table('users')
    .get(userId)
    .run(conn)
    .then(function (user) {
      done(null, user)
    })
  })
}

export function localAuthCallback(email, password, done) {
  return r.connect(config)
  .then(conn => {
    return r
    .table('users')
    .getAll(email, { index: 'email' })
    .run(conn)
    .then(cursor => cursor.toArray())
    .then(user => {
      if (!user[0])
        done(null, false, { message: `Email ${email} not found` })
      else if (user[0]['password'] === password)
        done(null, user[0])
      else
        done(null, false, { message: 'Invalid email or password' })
    })
  })
}

// Create User
// ===========
// Creates existing user if provided
// email doesn't already exist
// -----------
export function createUser(conn, user, fields = {}) {
  user = createUserProperties(user, fields)
  return r
  .table('users')
  .getAll(user.email, { index: 'email' })
  .run(conn)
  .then(cursor => cursor.toArray())
  .then(users => {
    if (users.length === 0) {
      return r
      .table('users')
      .insert(user)
      .run(conn, SOFT_DURABILITY)
      .then(response => {
        return Object.assign({}, user, { id: response.generated_keys[0] })
      })
    } else {
      return Object.assign({}, users[0], { err: 'Email already in use.' })
    }
  })
  .error(err => err)
}

export function createUserProperties(user, fields) {
  user.created = new Date().toString()
  user.email = xss(user.email)
  user.password = xss(user.password)
  user.dashboards = []
  for (let field in fields) {
    user[field] = fields[field]
  }
  return user
}

// Get User
// ========
export function getUser(conn, userId) {
  return r
  .table('users')
  .get(userId)
  .run(conn)
  .error(err => err)
}

export function getUserByEmail(conn, email) {
  return r
  .table('users')
  .getAll(email, { index: 'email' })
  .run(conn)
  .then(cursor => cursor.toArray())
  .then(user => user[0])
  .error(err => {
    console.log('err:', err)
    console.log('============')
    return err})
}

// Create Dashboard to User
// =====================
// Creates data to existing user
// ---------------------
export function addDashboardToUser(conn, dashboardId, userId) {
  return r
  .table('users')
  .get(userId)
  .update({ dashboards: r.row('dashboards').append(dashboardId) })
  .run(conn, SOFT_DURABILITY)
  .error(err => err)
}

// Remove Dashboard
// =====================
export function removeDashboardFromUser(conn, dashboardId, userId) {
  return r
  .table('users')
  .get(userId)
  .update({
    dashboards: r.row('dashboards').difference([ dashboardId ])
  })
  .run(conn)
  .error(err => err)
}
