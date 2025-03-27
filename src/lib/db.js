import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// 获取当前文件的目录
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 数据库文件路径
const dbPath = path.join(__dirname, '../../database.sqlite');

// 确保数据库目录存在
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('数据库连接错误:', err.message);
    return;
  }
  console.log('成功连接到 SQLite 数据库');
  
  // 创建页面表
  db.run(`
    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url_id TEXT UNIQUE NOT NULL,
      html_content TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('创建表错误:', err.message);
      return;
    }
    console.log('表创建成功'); // 新增日志
  });
});

// 将回调风格转换为 Promise 风格
function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });
}

function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

// 页面操作函数
export async function createPage(urlId, htmlContent) {
  try {
    const result = await runAsync(
      'INSERT INTO pages (url_id, html_content, created_at) VALUES (?, ?, ?)',
      [urlId, htmlContent, new Date().toISOString()]
    );
    return { success: true, id: result.lastID };
  } catch (error) {
    console.error('创建页面错误:', error);
    throw error;
  }
}

export async function getPage(urlId) {
  try {
    return await getAsync('SELECT * FROM pages WHERE url_id = ?', [urlId]);
  } catch (error) {
    console.error('获取页面错误:', error);
    throw error;
  }
}

export async function getAllPages() {
  try {
    return await allAsync('SELECT url_id, created_at FROM pages ORDER BY created_at DESC');
  } catch (error) {
    console.error('获取所有页面错误:', error);
    throw error;
  }
}

export async function deletePage(urlId) {
  try {
    const result = await runAsync('DELETE FROM pages WHERE url_id = ?', [urlId]);
    return { success: true, deleted: result.changes > 0 };
  } catch (error) {
    console.error('删除页面错误:', error);
    throw error;
  }
}