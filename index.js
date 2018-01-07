import * as functions from 'firebase-functions'
import React from 'react'
import { renderToString } from 'react-dom/server'
import express from 'express'
import fs from 'fs'

import App from './src/App'
import getFacts from './src/facts'

const app = express()

app.get('**', (req, res)  => {
  getFacts().then(facts => {
    const index = fs.readFileSync(`${__dirname}/index.html`, 'utf8')
    const reactHtml = renderToString(<App facts={facts} />)
    const html = index.replace('<!-- ::APP:: -->', reactHtml)
    res.set('Cache-Control', 'public, max-age=600, s-maxage=1200')
    res.send(html)
  })
})

export let ssrapp = functions.https.onRequest(app);