const { app, BrowserWindow, ipcMain, Notification } = require('electron')
const path = require('path')
const https = require('https')
const fs = require('fs')
const os = require('os')
const { exec } = require('child_process')

let mainWindow

function getEnv() {
  try {
    const envFile = fs.readFileSync(os.homedir() + '/.hermes/.env', 'utf8')
    return Object.fromEntries(
      envFile.split('\n')
        .filter(l => l.includes('='))
        .map(l => [l.split('=')[0].trim(), l.split('=').slice(1).join('=').trim()])
    )
  } catch(e) {
    console.error('Could not read .env file:', e.message)
    return {}
  }
}

function oandaRequest(urlPath, method, body) {
  return new Promise((resolve, reject) => {
    const env = getEnv()
    const apiKey = env['OANDA_API_KEY'] || ''
    console.log('API Key found:', apiKey ? 'YES (' + apiKey.length + ' chars)' : 'NO - check ~/.hermes/.env')
    const options = {
      hostname: 'api-fxpractice.oanda.com',
      path: urlPath,
      method: method || 'GET',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
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
    if (body) req.write(JSON.stringify(body))
    req.end()
  })
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#eeeee9',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    title: 'Unequal Trade'
  })
  mainWindow.loadFile(path.join(__dirname, 'dashboard.html'))
  mainWindow.on('closed', () => { mainWindow = null })
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('fetch-account', async () => {
  try {
    const env = getEnv()
    const accountId = env['OANDA_ACCOUNT_ID'] || ''
    console.log('Account ID:', accountId)
    const data = await oandaRequest('/v3/accounts/' + accountId + '/summary')
    console.log('Response:', JSON.stringify(data).slice(0, 200))
    return { success: true, data }
  } catch (e) {
    console.error('fetch-account error:', e.message)
    return { success: false, error: e.message }
  }
})

ipcMain.handle('fetch-prices', async () => {
  try {
    const env = getEnv()
    const accountId = env['OANDA_ACCOUNT_ID'] || ''
    const instruments = 'EUR_USD,GBP_USD,USD_CAD,USD_JPY,XAU_USD'
    const data = await oandaRequest('/v3/accounts/' + accountId + '/pricing?instruments=' + instruments)
    return { success: true, data }
  } catch (e) {
    console.error('fetch-prices error:', e.message)
    return { success: false, error: e.message }
  }
})

ipcMain.handle('fetch-trades', async () => {
  try {
    const env = getEnv()
    const accountId = env['OANDA_ACCOUNT_ID'] || ''
    const data = await oandaRequest('/v3/accounts/' + accountId + '/openTrades')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: e.message }
  }
})

ipcMain.handle('fetch-transactions', async () => {
  try {
    const env = getEnv()
    const accountId = env['OANDA_ACCOUNT_ID'] || ''
    const data = await oandaRequest('/v3/accounts/' + accountId + '/transactions?count=20')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: e.message }
  }
})

ipcMain.handle('read-memory', async () => {
  try {
    const memPath = path.join(os.homedir(), '.hermes', 'memories', 'MEMORY.md')
    if (fs.existsSync(memPath)) {
      return { success: true, data: fs.readFileSync(memPath, 'utf8') }
    }
    return { success: true, data: 'No memory file found yet.' }
  } catch (e) {
    return { success: false, error: e.message }
  }
})

ipcMain.handle('notify', async (event, { title, body }) => {
  new Notification({ title, body }).show()
  return true
})

ipcMain.handle('run-cycle', async () => {
  return new Promise((resolve) => {
    const hermes = path.join(os.homedir(), '.local', 'bin', 'hermes')
    exec(`"${hermes}" cron run 47e83ba514da`, { timeout: 10000 }, (err, stdout, stderr) => {
      if (err) {
        console.error('run-cycle error:', err.message)
        resolve({ success: false, error: err.message })
      } else {
        console.log('run-cycle stdout:', stdout)
        resolve({ success: true })
      }
    })
  })
})
