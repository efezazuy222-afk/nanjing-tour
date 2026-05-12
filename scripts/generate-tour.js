// 自动生成南京旅游线路 .mdx 文件
// 用法：node scripts/generate-tour.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 🎯 南京旅游景点库
const nanjingSpots = [
  {
    name: "明孝陵",
    category: "文化古迹",
    location: "玄武区",
    duration: "半天",
    price: 70,
    description: "世界文化遗产，明朝开国皇帝朱元璋与马皇后的合葬陵墓"
  },
  {
    name: "中山陵",
    category: "近代历史",
    location: "玄武区",
    duration: "半天",
    price: 0,
    description: "孙中山先生陵寝，中国近代建筑史上第一陵"
  },
  {
    name: "夫子庙秦淮河",
    category: "民俗风情",
    location: "秦淮区",
    duration: "半天",
    price: 0,
    description: "中国四大文庙之一，十里秦淮风光带核心区"
  },
  {
    name: "总统府",
    category: "近代历史",
    location: "玄武区",
    duration: "半天",
    price: 40,
    description: "中国近代历史重要遗址，曾为太平天国天王府"
  },
  {
    name: "牛首山",
    category: "佛教文化",
    location: "江宁区",
    duration: "全天",
    price: 98,
    description: "佛教牛头禅宗发源地，佛顶宫供奉释迦牟尼佛顶骨舍利"
  },
  {
    name: "栖霞山",
    category: "自然风光",
    location: "栖霞区",
    duration: "全天",
    price: 40,
    description: "中国四大赏枫胜地之一，秋季红叶闻名遐迩"
  },
  {
    name: "玄武湖",
    category: "自然风光",
    location: "玄武区",
    duration: "半天",
    price: 0,
    description: "中国最大的皇家园林湖泊，金陵明珠"
  },
  {
    name: "南京博物院",
    category: "文博展览",
    location: "玄武区",
    duration: "半天",
    price: 0,
    description: "中国三大博物馆之一，馆藏文物丰富"
  }
];

function generateTourMDX(spot) {
  const slug = spot.name.toLowerCase().replace(/\s+/g, '-');
  const date = new Date().toISOString().split('T')[0];
  
  return `---
title: "${spot.name}深度游"
category: "${spot.category}"
description: "${spot.description}"
cover: "/img/nanjing-${slug}.jpg"

gallery:
  - "/img/nanjing-${slug}-1.jpg"
  - "/img/nanjing-${slug}-2.jpg"
  - "/img/nanjing-${slug}-3.jpg"

duration: "${spot.duration}"
location: "南京·${spot.location}"
price: ${spot.price}

pricing:
  - label: "标准散客拼团"
    price: ${spot.price}
    multiplier: 1
  - label: "精品小团"
    price: ${Math.round(spot.price * 1.6)}
    multiplier: 1.6
  - label: "VIP深度体验"
    price: ${Math.round(spot.price * 2.5)}
    multiplier: 2.5

rating: ${(4.5 + Math.random() * 0.4).toFixed(1)}
reviews: ${Math.floor(Math.random() * 200) + 50}

facilities:
  - 景区门票
  - 中文导游讲解
  - 交通接送
  - 保险
  - 饮用水

date: ${date}
---

${spot.name}是南京最具代表性的${spot.category}景点之一。${spot.description}。

本线路由专业中文导游陪同，带您深入了解${spot.name}的历史文化背景，感受六朝古都的独特魅力。

## 行程安排

**上午**
- 8:30 市区指定地点集合出发
- 9:00 抵达${spot.name}景区
- 专业导游全程陪同讲解

**中午**
- 12:00 景区附近用餐（可自理或升级VIP含午餐）

**下午**
- 继续深度游览
- 16:00 返回市区

## 线路亮点

- 深度游览${spot.name}，不走马观花
- 专业导游讲解历史典故
- 小众打卡点探秘
- 充足拍照时间

## 温馨提示

请穿着舒适运动鞋，部分景点需步行游览。夏季注意防晒，冬季注意保暖。
`;
}

// 生成一个随机景点
const randomSpot = nanjingSpots[Math.floor(Math.random() * nanjingSpots.length)];
const mdxContent = generateTourMDX(randomSpot);
const fileName = `${randomSpot.name.toLowerCase().replace(/\s+/g, '-')}.mdx`;

// 写入正确的内容文件夹
const toursDir = path.join(__dirname, '..', 'src', 'content', 'tours');
if (!fs.existsSync(toursDir)) {
  fs.mkdirSync(toursDir, { recursive: true });
}

fs.writeFileSync(path.join(toursDir, fileName), mdxContent, 'utf-8');
console.log(`✅ 已生成旅游线路：${fileName}`);
console.log(`📍 景点：${randomSpot.name}`);
console.log(`📂 路径：src/content/tours/${fileName}`);