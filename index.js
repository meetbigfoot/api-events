const functions = require('@google-cloud/functions-framework')
const Typesense = require('typesense')
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const typesense = new Typesense.Client({
  nodes: [
    {
      host: 'sk89jvyb4o0c5d67p.a1.typesense.net',
      port: '443',
      protocol: 'https',
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY,
})

const today = dayjs().startOf('day').unix()
const twoWeeksFromToday = dayjs().add(14, 'days').startOf('day').unix()

functions.http('events', async (req, res) => {
  const { city, query } = req.body
  //cloud.google.com/functions/docs/samples/functions-http-cors#functions_http_cors-nodejs
  res.set('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.set('Access-Control-Max-Age', '3600')
    res.status(204).send('')
  } else {
    try {
      const results = await typesense
        .collections('experiences')
        .documents()
        .search({
          filter_by: `city:${city} && date_start:>=${today} && date_end:<${twoWeeksFromToday}`,
          per_page: 100,
          sort_by: 'date_start:asc',
          q: query || '',
          query_by: 'title,description',
        })
      res.status(200).send(results)
    } catch (error) {
      res.status(500).send(error)
    }
  }
})
