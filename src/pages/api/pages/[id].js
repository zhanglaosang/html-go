import { getPage } from '../../../lib/db.js';

export async function get({ params, locals }) {
  try {
    const urlId = params.id;
    
    if (!urlId) {
      return new Response(
        JSON.stringify({ success: false, error: '缺少页面 ID' }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // 获取页面
    const page = await getPage(locals.runtime.env, urlId);
    
    if (!page) {
      return new Response(
        JSON.stringify({ success: false, error: '页面不存在' }),
        { headers: { 'Content-Type': 'application/json' }, status: 404 }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true, page }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('获取页面错误:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: '服务器错误', details: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}
