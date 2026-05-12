// 自动生成南京旅游博客 .mdx 文件
// 用法：node scripts/generate-blog.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const blogTopics = [
  {
    title: "南京三日游完美攻略",
    category: "行程规划",
    description: "三天时间如何玩转南京？这篇攻略告诉你最佳路线",
    tags: ["南京攻略", "三日游", "行程规划", "金陵", "自由行"]
  },
  {
    title: "南京必吃美食清单",
    category: "美食推荐",
    description: "鸭血粉丝汤、盐水鸭、小笼包...南京美食一网打尽",
    tags: ["南京美食", "小吃", "金陵菜", "美食攻略", "吃货必看"]
  },
  {
    title: "南京赏秋最佳地点推荐",
    category: "季节推荐",
    description: "栖霞山红叶、灵谷寺桂花，南京秋天美不胜收",
    tags: ["南京秋天", "赏枫", "栖霞山", "季节游", "秋色"]
  },
  {
    title: "南京地铁沿线景点大全",
    category: "交通攻略",
    description: "乘坐地铁玩转南京，沿线景点一票通",
    tags: ["南京地铁", "交通攻略", "景点", "出行", "自由行"]
  },
  {
    title: "南京民国建筑漫步指南",
    category: "文化历史",
    description: "颐和路、1912街区...感受南京独特的民国风情",
    tags: ["民国建筑", "南京历史", "颐和路", "文化游", "citywalk"]
  },
  {
    title: "南京周边一日游推荐",
    category: "周边游",
    description: "汤山温泉、溧水天生桥，南京周边也好玩",
    tags: ["周边游", "一日游", "汤山", "溧水", "周末游"]
  }
];

function generateBlogMDX(topic) {
  const date = new Date().toISOString().split('T')[0];
  
  return `---
title: "${topic.title}"
cover: "/img/blog-nanjing-default.jpg"
date: "${date}"
category: "${topic.category}"
description: "${topic.description}"
tags:
  - ${topic.tags.join('\n  - ')}
readTime: ${Math.floor(Math.random() * 5) + 4}

author:
  name: "金陵文旅"
  job: "南京旅游规划师"
  avatar: "/img/female3.jpg"
---

${topic.description}

南京作为六朝古都，拥有丰富的历史文化遗产和自然风光。本文将为您详细介绍${topic.title.split('攻略')[0] || topic.title}的方方面面。

## 一、为什么选择南京

南京是中国四大古都之一，有"六朝古都"、"十朝都会"之称。这里既有深厚的历史底蕴，又有现代化的都市风貌。

## 二、交通指南

南京禄口国际机场、南京南站、南京站三大交通枢纽，地铁网络覆盖主要景区，出行便利。

## 三、住宿推荐

建议选择新街口、夫子庙、玄武湖附近，交通便利，美食众多。

## 四、注意事项

- 提前查看天气预报
- 部分景点需预约购票
- 春秋季节最美，但也是旺季

## 结语

${topic.description.split('。')[0]}。希望这篇攻略能为您的南京之旅提供帮助，祝旅途愉快！
`;
}

const randomTopic = blogTopics[Math.floor(Math.random() * blogTopics.length)];
const mdxContent = generateBlogMDX(randomTopic);
const slug = randomTopic.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\u4e00-\u9fa5-]/g, '');
const fileName = `${slug}.mdx`;

// 写入两个位置：pages/blogs/ 和 content/blog/
const blogsDirs = [
  path.join(__dirname, '..', 'src', 'pages', 'blogs'),
  path.join(__dirname, '..', 'src', 'content', 'blog')
];

blogsDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(path.join(dir, fileName), mdxContent, 'utf-8');
});

console.log(`✅ 已生成博客文章：${fileName}`);
console.log(`📝 标题：${randomTopic.title}`);
console.log(`📂 已同步到 pages/blogs/ 和 content/blog/`);