const express = require('express')
const https = require('https')
const path = require('path')

const app = express()
app.use(express.json())

function oandaRequest(urlPath) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api-fxpractice.oanda.com',
      path: urlPath,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + process.env.OANDA_API_KEY,
        'Content-Type': 'application/json'
      }
    }
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch (e) { reject(e) }
      })
    })
    req.on('error', reject)
    req.end()
  })
}

const accountId = () => process.env.OANDA_ACCOUNT_ID

app.get('/api/account', async (req, res) => {
  try {
    const data = await oandaRequest('/v3/accounts/' + accountId() + '/summary')
    res.json({ success: true, data })
  } catch (e) {
    res.json({ success: false, error: e.message })
  }
})

app.get('/api/prices', async (req, res) => {
  try {
    const instruments = 'EUR_USD,GBP_USD,USD_CAD,USD_JPY,XAU_USD'
    const data = await oandaRequest('/v3/accounts/' + accountId() + '/pricing?instruments=' + instruments)
    res.json({ success: true, data })
  } catch (e) {
    res.json({ success: false, error: e.message })
  }
})

app.get('/api/trades', async (req, res) => {
  try {
    const data = await oandaRequest('/v3/accounts/' + accountId() + '/openTrades')
    res.json({ success: true, data })
  } catch (e) {
    res.json({ success: false, error: e.message })
  }
})

app.get('/api/transactions', async (req, res) => {
  try {
    const data = await oandaRequest('/v3/accounts/' + accountId() + '/transactions?count=20')
    res.json({ success: true, data })
  } catch (e) {
    res.json({ success: false, error: e.message })
  }
})

app.get('/api/memory', (req, res) => {
  res.json({ success: true, data: 'Memory not available in web version.' })
})

app.post('/api/run-cycle', (req, res) => {
  res.json({ success: false, error: 'Run cycle is only available in the desktop app.' })
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'src', 'dashboard.html'))
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log('Unequal Trade web running on port ' + port))
