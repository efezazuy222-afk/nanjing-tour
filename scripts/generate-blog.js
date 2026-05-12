// 自动生成南京旅游博客 - DeepSeek AI + Unsplash 图片
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';

if (!DEEPSEEK_API_KEY) {
  console.error('❌ 缺少 DEEPSEEK_API_KEY 环境变量');
  process.exit(1);
}

if (!UNSPLASH_ACCESS_KEY) {
  console.error('❌ 缺少 UNSPLASH_ACCESS_KEY 环境变量');
  process.exit(1);
}

async function fetchCoverImage(query) {
  try {
    const response = await fetch(
      `${UNSPLASH_API_URL}?query=${encodeURIComponent(query + ' nanjing china tourism')}&per_page=1&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
  } catch (error) {
    console.warn('⚠️ Unsplash 获取失败，使用默认图片');
  }
  return '/img/blog-nanjing-default.jpg';
}

function fixAuthorField(content) {
  // 修复 author 字段格式：确保是对象格式
  // 如果 author 是字符串 "澜青旅行社"，转为对象格式
  content = content.replace(
    /author:\s*"澜青旅行社"/,
    `author:
  name: "澜青旅行社"
  job: "南京旅游规划师"
  avatar: "/img/female3.jpg"`
  );
  
  // 如果 author 已经是对象但格式不对，尝试修复
  if (!content.includes('author:')) {
    // 在 readTime 后面插入 author
    content = content.replace(
      /(readTime:\s*\d+)/,
      `$1

author:
  name: "澜青旅行社"
  job: "南京旅游规划师"
  avatar: "/img/female3.jpg"`
    );
  }
  
  return content;
}

async function generateBlogContent() {
  const topics = [
    '南京三日游攻略', '南京必吃美食', '南京赏秋地点推荐', 
    '南京地铁沿线景点', '南京民国建筑漫步', '南京周边一日游',
    '南京亲子游推荐', '南京免费景点汇总', '南京赏樱攻略',
    '南京温泉推荐', '南京小众打卡地', '南京夜游指南'
  ];
  
  const topic = topics[Math.floor(Math.random() * topics.length)];

  const prompt = `你是一个南京旅游博主。请生成一篇关于"${topic}"的博客文章 .mdx 文件。

⚠️ 严格要求：直接返回 .mdx 内容，不要任何额外说明或代码块标记。

frontmatter 必须严格按以下格式（直接复制这个模板，替换内容）：

---
title: "${topic}"
cover: "COVER_PLACEHOLDER"
date: "${new Date().toISOString().split('T')[0]}"
category: "分类名"
description: "简短描述"
tags:
  - 标签1
  - 标签2
  - 标签3
  - 标签4
  - 标签5
readTime: 数字

author:
  name: "澜青旅行社"
  job: "南京旅游规划师"
  avatar: "/img/female3.jpg"
---

正文用Markdown格式，至少4个二级标题，内容丰富实用，全部用中文。`;

  try {
    // 1. 调用 DeepSeek 生成文字内容
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是一个专业的南京旅游博主。只返回.mdx格式的内容，严格遵循frontmatter格式要求，不要任何额外说明。author字段必须是对象格式包含name、job、avatar三个子字段。' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 2500
      })
    });

    const data = await response.json();
    let content = data.choices[0].message.content;
    
    // 2. 修复 author 字段格式
    content = fixAuthorField(content);
    
    // 3. 从 Unsplash 获取封面图
    console.log(`🖼️ 正在获取"${topic}"的封面图...`);
    const coverImage = await fetchCoverImage(topic);
    
    // 4. 替换封面图
    content = content.replace(/COVER_PLACEHOLDER/, coverImage);
    content = content.replace(/cover:\s*"\/img\/blog-nanjing-default\.jpg"/, `cover: "${coverImage}"`);
    
    // 5. 生成文件名并写入
    const titleMatch = content.match(/title:\s*"(.+?)"/);
    const slug = titleMatch 
      ? titleMatch[1].replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')
      : `blog-${Date.now()}`;
    const fileName = `${slug}.mdx`;
    
    const blogsDirs = [
      path.join(__dirname, '..', 'src', 'content', 'blog'),
      path.join(__dirname, '..', 'src', 'pages', 'blogs')
    ];
    
    blogsDirs.forEach(dir => {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, fileName), content, 'utf-8');
    });
    
    console.log(`✅ AI已生成博客文章：${fileName}（含真实封面图）`);
    return true;
  } catch (error) {
    console.error('❌ 生成失败:', error.message);
    return false;
  }
}

generateBlogContent();