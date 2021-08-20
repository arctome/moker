import { handleEvent } from 'flareact'
import WorkerScaffold, { basicAuth, cors, rewrite, robotsTxt, faviconByBase64 } from '@arctome/worker-scaffold'

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
  app.use(cors(true))
  // all path should not be crawled by search engine
  app.use(robotsTxt({
    rules: [
      {
        userAgent: '*',
        disallow: ['/']
      }
    ]
  }))
  /* eslint-disable no-undef */
  app.use('/admin/(.*)', basicAuth({
    USER_NAME: MOKER_USERNAME,
    USER_PASS: MOKER_USERPASS
  }))
  app.use('/api/admin/(.*)', basicAuth({
    USER_NAME: MOKER_USERNAME,
    USER_PASS: MOKER_USERPASS
  }))
  /* eslint-enable no-undef */

  app.use('/mock/:recordid', rewrite('/api/mock'))
  app.use('/mock', rewrite('/api/mock'))

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
      return event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500
        })
      )
    }
    event.respondWith(new Response('Internal Error', { status: 500 }))
  }
})
