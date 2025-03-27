import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import crypto from 'crypto';
import { handler as ssrHandler } from './dist/server/entry.mjs';
import { createPage, getPage, getAllPages, deletePage } from './src/lib/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3001;

// 中间件
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist/client')));

// API 路由
app.post('/api/pages/create', async (req, res) => {
  try {
    const { htmlContent } = req.body;
    
    if (!htmlContent) {
      return res.status(400).json({ success: false, error: '缺少 HTML 内容' });
    }
    
    // 生成随机 URL ID
    const timestamp = new Date().getTime().toString();
    const urlId = crypto.createHash('md5').update(htmlContent + timestamp).digest('hex');
    
    // 创建页面
    await createPage(urlId, htmlContent);
    
    return res.json({ success: true, urlId });
  } catch (error) {
    console.error('创建页面错误:', error);
    return res.status(500).json({ success: false, error: '服务器错误', details: error.message });
  }
});

app.get('/api/pages/:id', async (req, res) => {
  try {
    const urlId = req.params.id;
    
    if (!urlId) {
      return res.status(400).json({ success: false, error: '缺少页面 ID' });
    }
    
    // 获取页面
    const page = await getPage(urlId);
    
    if (!page) {
      return res.status(404).json({ success: false, error: '页面不存在' });
    }
    
    return res.json({ success: true, page });
  } catch (error) {
    console.error('获取页面错误:', error);
    return res.status(500).json({ success: false, error: '服务器错误', details: error.message });
  }
});

// Astro SSR 处理
app.use(ssrHandler);

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
