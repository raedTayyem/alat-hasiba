import { Calculator } from './types';

/**
 * Gaming Calculators (5 calculators)
 * Comprehensive gaming, esports, and game statistics tools
 */

const gamingCalculators: Calculator[] = [
  {
    id: 2900,
    nameKey: "calc/gaming:kd-ratio-calculator.title",
    name: 'حاسبة نسبة K/D',
    nameEn: 'KD Ratio Calculator',
    descriptionKey: "calc/gaming:kd-ratio-calculator.description",
    description: 'احسب نسبة القتل إلى الموت في الألعاب',
    descriptionEn: 'Calculate your Kill/Death ratio for FPS games. Track gaming performance, compare K/D stats, and improve gameplay with our free online tool.',
    slug: 'kd-ratio-calculator',
    category: 'gaming',
    icon: '🎮',
    componentName: 'KDRatioCalculator',
    popularity: 92,
    keywords: ['KD', 'قتل', 'موت', 'FPS', 'شوتر']
  },
  {
    id: 2901,
    nameKey: "calc/gaming:win-rate-calculator.title",
    name: 'حاسبة نسبة الفوز',
    nameEn: 'Win Rate Calculator - Gaming Performance Tracker',
    descriptionKey: "calc/gaming:win-rate-calculator.description",
    description: 'احسب نسبة فوزك في الألعاب',
    descriptionEn: 'Calculate your win rate percentage across all games. Track victories, analyze performance trends, and monitor gaming success online for free.',
    slug: 'win-rate-calculator',
    category: 'gaming',
    icon: '🏆',
    componentName: 'WinRateCalculator',
    popularity: 89,
    keywords: ['فوز', 'نسبة', 'إحصائيات', 'ألعاب']
  },
  {
    id: 2902,
    nameKey: "calc/gaming:kda-calculator.title",
    name: 'حاسبة KDA',
    nameEn: 'KDA Calculator - Kill Death Assist Ratio Tool',
    descriptionKey: "calc/gaming:kda-calculator.description",
    description: 'احسب نسبة القتل/الموت/المساعدة',
    descriptionEn: 'Calculate KDA ratio for MOBA games. Track kills, deaths, and assists to measure performance in League of Legends, Dota 2, and more.',
    slug: 'kda-calculator',
    category: 'gaming',
    icon: '⚔️',
    componentName: 'KDACalculator',
    popularity: 88,
    keywords: ['KDA', 'قتل', 'موت', 'مساعدة', 'MOBA']
  },
  {
    id: 2903,
    nameKey: "calc/gaming:xp-calculator.title",
    name: 'حاسبة نقاط الخبرة',
    nameEn: 'XP Calculator - Experience Points & Level Calculator',
    descriptionKey: "calc/gaming:xp-calculator.description",
    description: 'احسب نقاط الخبرة المطلوبة للمستوى التالي',
    descriptionEn: 'Calculate experience points needed for next level in RPG games. Plan your gaming progression and track XP requirements online free.',
    slug: 'xp-calculator',
    category: 'gaming',
    icon: '⭐',
    componentName: 'XPCalculator',
    popularity: 90,
    keywords: ['XP', 'خبرة', 'مستوى', 'ليفل']
  },
  {
    id: 2904,
    nameKey: "calc/gaming:level-up-calculator.title",
    name: 'حاسبة الارتقاء بالمستوى',
    nameEn: 'Level Up Calculator - Gaming Time & XP Planner',
    descriptionKey: "calc/gaming:level-up-calculator.description",
    description: 'احسب الوقت المطلوب للوصول للمستوى المطلوب',
    descriptionEn: 'Calculate time required to reach target level in games. Plan grinding sessions, estimate leveling time, and optimize your gaming progress.',
    slug: 'level-up-calculator',
    category: 'gaming',
    icon: '📈',
    componentName: 'LevelUpCalculator',
    popularity: 86,
    keywords: ['مستوى', 'ارتقاء', 'وقت', 'grinding']
  },
  {
    id: 2905,
    nameKey: "calc/gaming:dps-calculator.title",
    name: 'حاسبة DPS',
    nameEn: 'DPS Calculator - Damage Per Second Tool',
    descriptionKey: "calc/gaming:dps-calculator.description",
    description: 'احسب الضرر في الثانية (DPS) لتعظيم كفاءتك القتالية',
    descriptionEn: 'Calculate Damage Per Second (DPS) to maximize your combat efficiency. Perfect for RPG games and combat optimization.',
    slug: 'dps-calculator',
    category: 'gaming',
    icon: '⚔️',
    componentName: 'DPSCalculator',
    popularity: 87,
    keywords: ['DPS', 'ضرر', 'قتال', 'RPG', 'MMO']
  },
  {
    id: 2906,
    nameKey: "calc/gaming:fov-calculator.title",
    name: 'حاسبة FOV',
    nameEn: 'FOV Calculator - Field of View Tool',
    descriptionKey: "calc/gaming:fov-calculator.description",
    description: 'حدد مجال الرؤية الأمثل (FOV) بناءً على حجم شاشتك والمسافة',
    descriptionEn: 'Determine the optimal Field of View (FOV) based on your monitor size and distance. Convert FOV between different aspect ratios.',
    slug: 'fov-calculator',
    category: 'gaming',
    icon: '👁️',
    componentName: 'FOVCalculator',
    popularity: 85,
    keywords: ['FOV', 'مجال رؤية', 'شاشة', 'FPS', 'racing']
  },
  {
    id: 2907,
    nameKey: "calc/gaming:fps-calculator.title",
    name: 'حاسبة FPS',
    nameEn: 'FPS Calculator - Frames Per Second Estimator',
    descriptionKey: "calc/gaming:fps-calculator.description",
    description: 'قدّر عدد الإطارات في الثانية (FPS) المتوقع لجهازك في ألعاب مختلفة',
    descriptionEn: 'Estimate the expected frames per second (FPS) for your hardware in different games. Optimize gaming performance.',
    slug: 'fps-calculator',
    category: 'gaming',
    icon: '🎮',
    componentName: 'FPSCalculator',
    popularity: 88,
    keywords: ['FPS', 'إطارات', 'أداء', 'hardware', 'gaming']
  },
  {
    id: 2908,
    nameKey: "calc/gaming:loot-drop-calculator.title",
    name: 'حاسبة احتمالية الغنائم',
    nameEn: 'Loot Drop Calculator - Drop Rate Tool',
    descriptionKey: "calc/gaming:loot-drop-calculator.description",
    description: 'احسب احتمالية الحصول على غنائم نادرة بناءً على معدلات السقوط',
    descriptionEn: 'Calculate the probability of obtaining rare loot based on stated drop rates. Perfect for MMO and RPG games.',
    slug: 'loot-drop-calculator',
    category: 'gaming',
    icon: '🎁',
    componentName: 'LootDropCalculator',
    popularity: 84,
    keywords: ['loot', 'drop rate', 'غنائم', 'احتمالية', 'MMO']
  },
  {
    id: 2909,
    nameKey: "calc/gaming:minecraft-calculator.title",
    name: 'حاسبة ماينكرافت',
    nameEn: 'Minecraft Calculator - Resource & Recipe Tool',
    descriptionKey: "calc/gaming:minecraft-calculator.description",
    description: 'أداة لمساعدتك في حساب الموارد والوصفات المعقدة في عالم ماينكرافت',
    descriptionEn: 'A tool to help you calculate resources and complex recipes in the Minecraft world. Plan your builds efficiently.',
    slug: 'minecraft-calculator',
    category: 'gaming',
    icon: '⛏️',
    componentName: 'MinecraftCalculator',
    popularity: 91,
    keywords: ['minecraft', 'ماينكرافت', 'موارد', 'crafting', 'resources']
  }
];

export default gamingCalculators;
