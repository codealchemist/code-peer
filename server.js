const express = require('express')
const next = require('next')
const nconf = require('nconf')

const config = nconf.argv().env()
const serverUrl = config.get('server') || 'http://localhost:7331'
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
.then(() => {
  const server = express()

  server.get('/document/:documentId', (req, res) => {
    const documentId = req.params.documentId
    console.log(`-- rendering /document/${documentId}`)
    return app.render(req, res, '/index', {serverUrl})
  })

  server.get('/', (req, res) => {
    return app.render(req, res, '/index', {serverUrl})
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:3000 | server: ${serverUrl}`)
  })
})
