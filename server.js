import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express()

// 设置API密钥
const API_KEY = 'kid' // 修改为你的密钥

// 修改CORS设置，只允许特定来源
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'] // 添加你允许的域名
}))
app.use(express.json())

// 修改验证中间件
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey  // 同时支持 header 和 query 参数
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: '未授权访问' })
  }
  next()
}

let currentHighlight = null
let clients = []

// 添加验证到API端点
app.get('/api/highlight-status', validateApiKey, (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  
  clients.push(res)
  
  req.on('close', () => {
    clients = clients.filter(client => client !== res)
  })
})

app.post('/api/highlight', validateApiKey, (req, res) => {
  const { rowIndex } = req.body
  currentHighlight = rowIndex
  
  clients.forEach(client => {
    client.write(`data: ${JSON.stringify({ currentHighlight })}\n\n`)
  })
  
  res.json({ success: true })
})

// 服务静态文件
app.use(express.static(path.join(__dirname, 'dist')))

// 所有其他请求返回index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// 启动服务器
const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
}) 