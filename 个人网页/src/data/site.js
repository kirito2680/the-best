// ============================================================
// 站点全部文案与数据。后续替换作品、联系方式、社交链接都在这里改。
// ============================================================

export const profile = {
  name: 'OUMASHU',
  nameEn: 'FANG YU',
  role: '视觉设计师 / AI 设计师 / 品牌设计师',
  roleEn: 'Visual × AI × Brand Designer',
  tagline: '以视觉语言连接人与技术',
  location: '南昌 · 中国',
  status: '在读 · 可接项目',
  school: '南昌工学院 · 智能装备与系统',
  period: '2026 – 2030',
  phone: '158 8896 8003',
  phoneRaw: '15888968003',
  qq: '3128189242',
  // TODO: 替换为真实邮箱
  email: 'hello@fangyu.design',
  bio: [
    '你好，我是方昱，一名视觉设计师、AI 设计师与品牌设计师。我相信好的设计不是炫技，而是把复杂的技术翻译成清晰、克制、有温度的语言。',
    '我的工作横跨视觉设计、品牌系统与 AI 辅助创作：用生成式工具探索新的视觉可能，再以设计判断力收敛到可落地、可传播的结果。目前就读于南昌工学院智能装备与系统专业，持续在设计与技术的交汇处积累作品。',
  ],
  stats: [
    { value: '06+', label: '精选项目（占位）' },
    { value: '15+', label: 'AI × 设计工具' },
    { value: '2026', label: '入学年份' },
  ],
};

export const navLinks = [
  { id: 'about', label: '经历' },
  { id: 'works', label: '项目' },
  { id: 'strengths', label: '优势' },
  { id: 'contact', label: '联系' },
];

// 首屏设计方向选择器
export const roles = [
  {
    zh: '视觉设计',
    en: 'Visual Design',
    desc: '以清晰、克制、有记忆点的视觉语言，构建层次分明的高品质表达。',
  },
  {
    zh: 'AI 设计',
    en: 'AI Design',
    desc: '把生成式工具编入设计流程，用 AI 加速探索，用设计判断力收敛结果。',
  },
  {
    zh: '品牌设计',
    en: 'Brand Design',
    desc: '从洞察到落地，打造有逻辑、可延展、能触动人心的品牌系统。',
  },
];

// 项目为占位示例，后续替换为真实作品与截图
export const works = [
  {
    title: 'AI 视觉系统实验',
    category: 'AI 设计',
    year: '2026',
    tags: ['生成式视觉', '工具链'],
    desc: '用生成式工具与程序化手段搭建的品牌视觉实验，探索人机协作下的图像语言。',
    variant: 'aurora',
  },
  {
    title: '智能装备品牌重塑',
    category: '品牌设计',
    year: '2026',
    tags: ['VI 系统', '品牌策略'],
    desc: '面向智能装备方向的品牌形象方案：从命名、标识到延展物料的一体化系统。',
    variant: 'mesh',
  },
  {
    title: '未来界面概念设计',
    category: '视觉设计',
    year: '2026',
    tags: ['UI 概念', '动效'],
    desc: '以暗色科技语境为前提的界面概念，关注信息层级、呼吸感与克制的动效节奏。',
    variant: 'prism',
  },
];

export const strengths = [
  {
    title: '视觉设计',
    desc: '从信息层级、网格系统到细节打磨，建立清晰而有记忆点的视觉表达。',
    tags: ['排版', '色彩', '图形', '动效'],
    icon: 'visual',
  },
  {
    title: 'AI 设计',
    desc: '熟练编排生成式工具与设计流程，把 AI 当作创意伙伴而非黑箱。',
    tags: ['Stable Diffusion', 'Midjourney', '工作流'],
    icon: 'ai',
  },
  {
    title: '品牌设计',
    desc: '从洞察到落地，构建有逻辑、可延展、能触动人心的品牌系统。',
    tags: ['VI', 'Logo', '策略', '物料'],
    icon: 'brand',
  },
  {
    title: '技术协同',
    desc: '懂一点代码，能与工程师高效对话，让设计在真实产品里保持完整。',
    tags: ['React', 'Figma', '交付出'], 
    icon: 'tech',
  },
];

export const socials = [
  { label: '微信', note: '待补充' },
  { label: '小红书', note: '待补充' },
  { label: '站酷', note: '待补充' },
  { label: 'Behance', note: '待补充' },
];

export const marqueeItems = [
  '视觉设计',
  'AI 设计',
  '品牌设计',
  '生成艺术',
  '界面设计',
  '设计系统',
];
