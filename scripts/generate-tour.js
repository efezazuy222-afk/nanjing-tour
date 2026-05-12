// 自动生成南京旅游线路 - 固定模板 + AI写正文
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

// 景点库
const spots = [
  { name: "中山陵", category: "近代历史", location: "玄武区", duration: "半天", price: 0 },
  { name: "明孝陵", category: "文化古迹", location: "玄武区", duration: "半天", price: 70 },
  { name: "夫子庙秦淮河", category: "民俗风情", location: "秦淮区", duration: "半天", price: 0 },
  { name: "总统府", category: "近代历史", location: "玄武区", duration: "半天", price: 40 },
  { name: "牛首山", category: "佛教文化", location: "江宁区", duration: "全天", price: 98 },
  { name: "栖霞山", category: "自然风光", location: "栖霞区", duration: "全天", price: 40 },
  { name: "玄武湖", category: "自然风光", location: "玄武区", duration: "半天", price: 0 },
  { name: "南京博物院", category: "文博展览", location: "玄武区", duration: "半天", price: 0 },
  { name: "老门东", category: "民俗风情", location: "秦淮区", duration: "半天", price: 0 },
  { name: "阅江楼", category: "文化古迹", location: "鼓楼区", duration: "半天", price: 40 }
];

async function fetchImages(query) {
  try {
    const res = await fetch(
      `${UNSPLASH_API_URL}?query=${encodeURIComponent(query + ' nanjing china')}&per_page=4&orientation=landscape`,
      { headers: { 'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
    );
    const data = await res.json();
    if (data.results?.length) return data.results.map(i => i.urls.regular);
  } catch (e) {}
  return ['/img/tour1.jpg', '/img/tour2.jpg', '/img/tour3.jpg', '/img/tour4.jpg'];
}

async function generateBody(spot) {
  const prompt = `写一篇关于南京${spot.name}的旅游攻略正文，Markdown格式，全部中文。包含：
## 景点介绍
（200字介绍）
## 行程安排
**上午** - 
**中午** - 
**下午** - 
## 线路亮点
- 亮点1
- 亮点2
- 亮点3
- 亮点4
## 温馨提示
出行建议。不要写frontmatter，不要写标题。`;

  try {
    const res = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是南京旅游攻略写手，只写Markdown正文，不写frontmatter和标题。' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8, max_tokens: 1500
      })
    });
    const data = await res.json();
    return data.choices[0].message.content;
  } catch (e) {
    return `${spot.name}是南京最具代表性的景点之一。\n\n## 景点介绍\n详细攻略请咨询澜青旅行社：400-858-0518`;
  }
}

async function main() {
  const spot = spots[Math.floor(Math.random() * spots.length)];
  const slug = spot.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '');
  const date = new Date().toISOString().split('T')[0];
  const rating = (4.5 + Math.random() * 0.5).toFixed(1);
  const reviews = Math.floor(Math.random() * 200) + 50;

  console.log(`🖼️ 获取${spot.name}图片...`);
  const images = await fetchImages(spot.name);

  console.log(`🤖 AI生成${spot.name}攻略正文...`);
  const body = await generateBody(spot);

  // 标准YAML模板（绝对不会有格式错误）
  const mdx = `---
title: "${spot.name}深度游"
category: "${spot.category}"
description: "澜青旅行社精选${spot.name}旅游线路，专业导游带您深度探访${spot.name}。咨询电话：400-858-0518"
cover: "${images[0]}"
gallery:
  - "${images[1]}"
  - "${images[2]}"
  - "${images[3]}"
duration: "${spot.duration}"
location: "南京·${spot.location}"
price: ${spot.price}
pricing:
  - label: "标准散客拼团"
    price: ${spot.price}
    multiplier: 1
  - label: "精品小团"
    price: ${Math.round(spot.price * 1.6) || 99}
    multiplier: 1.6
  - label: "VIP深度体验"
    price: ${Math.round(spot.price * 2.5) || 199}
    multiplier: 2.5
rating: ${rating}
reviews: ${reviews}
facilities:
  - 景区门票
  - 中文导游讲解
  - 交通接送
  - 保险
  - 饮用水
date: ${date}
---

${body}

---

> 📞 **澜青旅行社** · 南京旅游专家 · 咨询热线：**400-858-0518**
`;

  const toursDir = path.join(__dirname, '..', 'src', 'content', 'tours');
  if (!fs.existsSync(toursDir)) fs.mkdirSync(toursDir, { recursive: true });

  fs.writeFileSync(path.join(toursDir, `${slug}.mdx`), mdx, 'utf-8');
  console.log(`✅ 已生成：${slug}.mdx`);
}

main();