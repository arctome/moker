import { handleEvent } from 'flareact'
import WorkerScaffold, { rewrite, robotsTxt, faviconByBase64 } from '@arctome/worker-scaffold'
import User from './server/entity/User'

/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return an error message on exception in your Response rather
 *    than the default 404.html page.
 */
const DEBUG = true

addEventListener('fetch', event => {
  const app = new WorkerScaffold(event, DEBUG)
  app.use(faviconByBase64('ignored'))
  // app.use(cors(true))
  // all path should not be crawled by search engine
  app.use(robotsTxt({
    rules: [
      {
        userAgent: '*',
        disallow: ['/']
      }
    ]
  }))
  app.use('/login', async event => {
    const checkRes = await User.checkCookie(event)
    if (checkRes) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: '/admin'
        }
      })
    }
  })
  app.use('/admin/(.*)', async event => {
    const checkRes = await User.checkCookie(event)
    if (!checkRes) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: '/login'
        }
      })
    }
  })
  app.use('/api/admin/(.*)', async event => {
    const checkRes = await User.checkCookie(event)
    if (!checkRes) return new Response(null, { status: 401 })
  })

  app.use('/mock/:recordid', rewrite('/api/mock'))

  app.use(event =>
    handleEvent(
      event,
      require.context('./pages/', true, /\.(js|jsx|ts|tsx)$/),
      DEBUG
    )
  )

  try {
    event.respondWith(app.run())
  } catch (e) {
    if (DEBUG) {
      event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500
        })
      )
      return
    }
    event.respondWith(new Response('Internal Error', { status: 500 }))
  }
})
