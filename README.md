# HTML-Go

一个简单的网页生成器，可以让用户粘贴 HTML 代码或上传 HTML 文件，然后生成一个可分享的网页链接。

## 功能特点

- 简洁的用户界面
- 支持粘贴 HTML 代码
- 支持上传 HTML 文件
- 生成随机安全的 URL
- 无需注册即可使用
- 完全免费，可部署在 Cloudflare Pages

## 技术栈

- Astro 框架
- Cloudflare Pages 托管
- Cloudflare D1 数据库 (SQLite)
- 现代 CSS 和响应式设计

## 本地开发

1. 安装依赖：
   ```bash
   npm install
   ```

2. 启动开发服务器：
   ```bash
   npm run dev
   ```

3. 构建项目：
   ```bash
   npm run build
   ```

## 部署到 Cloudflare

1. 登录 Cloudflare：
   ```bash
   npx wrangler login
   ```

2. 创建 D1 数据库：
   ```bash
   npx wrangler d1 create html-go-db
   ```

3. 用创建的数据库 ID 更新 `wrangler.toml` 文件中的 `database_id` 字段

4. 应用数据库架构：
   ```bash
   npx wrangler d1 execute html-go-db --file=schema.sql
   ```

5. 部署到 Cloudflare Pages：
   ```bash
   npm run build
   npx wrangler pages deploy dist
   ```

6. 在 Cloudflare Dashboard 中绑定 D1 数据库到你的 Pages 项目

## 使用方法

1. 访问网站首页
2. 粘贴 HTML 代码或上传 HTML 文件
3. 点击"生成链接"按钮
4. 复制生成的 URL 并分享给他人

## 注意事项

- 生成的 URL 是随机的，无法被猜测
- 页面内容存储在 Cloudflare D1 数据库中
- 本地开发时会使用内存存储作为备用
