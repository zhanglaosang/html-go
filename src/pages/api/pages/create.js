import { createPage } from '../../../lib/db.js';
import MD5 from 'crypto-js/md5';

export async function post({ request, locals }) {
  try {
    const data = await request.json();
    const { htmlContent } = data;
    
    if (!htmlContent) {
      return new Response(
        JSON.stringify({ success: false, error: '缺少 HTML 内容' }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // 生成随机 URL ID
    const timestamp = new Date().getTime().toString();
    // 使用更短的 ID 格式：6-8位字母数字组合
    const hash = MD5(htmlContent + timestamp).toString();
    const urlId = hash.substring(0, 7); // 取前7位作为短ID
    
    // 创建页面
    await createPage(urlId, htmlContent);
    
    return new Response(
      JSON.stringify({ success: true, urlId }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('创建页面错误:', error);
    console.error('错误详情:', error.stack);
    
    return new Response(
      JSON.stringify({ success: false, error: '服务器错误', details: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}
