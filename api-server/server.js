const express = require('express')
const cors = require('cors')
const app = express()

// 启用 CORS 和 JSON 解析
app.use(cors())
app.use(express.json())

// 存储当前高亮状态
let currentHighlight = null

// 获取高亮状态
app.get('/api/highlight-status', (req, res) => {
  res.json({ rowIndex: currentHighlight })
})

// 设置高亮状态
app.post('/api/highlight-status', (req, res) => {
  const { rowIndex } = req.body
  currentHighlight = rowIndex
  res.json({ success: true, rowIndex: currentHighlight })
})

// 启动服务器
const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
}) 