import { Package, FAQ } from '../types';

export const packages: Package[] = [
  {
    id: 'argentea',
    name: 'Argentea 型',
    originalPrice: 35,
    salePrice: 30,
    savings: 5,
    features: [
      '基础神经连接权限',
      '标准岩浆能源供应', 
      '月度50次出击任务',
      '基础战术分析',
      '新人驾驶员培训'
    ],
    description: '量产型FRANXX，适合新手驾驶员训练',
    popular: false,
    franxx: {
      model: 'Argentea',
      name: '银莲花',
      code: 'FXX-056',
      color: '#9CA3AF',
      accentColor: '#E5E7EB',
      tier: 'standard',
      pilot: 'Code-666',
      plantation: 'Plantation 13',
      magmaOutput: '65%',
      stock: 47,
      totalUnits: 100
    }
  },
  {
    id: 'delphinium', 
    name: 'Delphinium 型',
    originalPrice: 220,
    salePrice: 199,
    savings: 21,
    features: [
      '高级神经连接系统',
      '增强岩浆能源核心',
      '无限制出击权限',
      '高级战术AI辅助',
      'DALL-E 图像侦察',
      '优先作战调度'
    ],
    description: '特装型FRANXX，经验丰富驾驶员的首选',
    popular: true,
    franxx: {
      model: 'Delphinium',
      name: '飞燕草',
      code: 'FXX-015',
      color: '#3B82F6',
      accentColor: '#DBEAFE',
      tier: 'advanced',
      pilot: 'Code-015',
      plantation: 'Plantation 13',
      magmaOutput: '85%',
      stock: 12,
      totalUnits: 25
    }
  },
  {
    id: 'strelizia',
    name: 'Strelizia 型',
    originalPrice: 450,
    salePrice: 399,
    savings: 51,
    features: [
      '传奇级神经连接',
      '红色叫龙岩浆核心',
      '无限制o1-pro权限',
      '最高级战术推理',
      '专业级图像生成',
      'APE直属技术支持',
      '叫龙姬模式解锁',
      '特殊作战权限'
    ],
    description: '传说中的红色FRANXX，只有特殊驾驶员才能驾驭',
    popular: false,
    franxx: {
      model: 'Strelizia',
      name: '鹤望兰',
      code: 'FXX-002',
      color: '#DC2626',
      accentColor: '#FEE2E2',
      tier: 'legendary',
      pilot: 'Code-002',
      plantation: 'Plantation 13',
      magmaOutput: '150%',
      stock: 0,
      totalUnits: 1
    }
  }
];

export const faqs: FAQ[] = [
  {
    id: '1',
    question: '什么是FRANXX驾驶系统？',
    answer: 'FRANXX是APE开发的对叫龙专用兵器，需要Stamen（雄蕊）和Pistil（雌蕊）两名驾驶员进行神经连接操控。我们通过优化的plantation连接系统，为驾驶员提供更经济的岩浆能源供应。',
    category: '驾驶说明'
  },
  {
    id: '2',
    question: '驾驶员账号安全吗？',
    answer: '每个FRANXX都配备APE军用级神经连接加密系统。每台机体仅供认证驾驶员使用，采用plantation级别的安全协议，绝对不会出现多人共用的情况。',
    category: '账号安全'
  },
  {
    id: '3',
    question: '多长时间能开始驾驶？',
    answer: '完成驾驶员适性检查后，plantation管制中心会在5-30分钟内完成FRANXX岩浆核心激活。驾驶凭证将通过plantation内部通信网络发送给您。',
    category: '激活时间'
  },
  {
    id: '4',
    question: '支持哪些支付方式？',
    answer: '目前支持支付宝和微信支付，所有交易都经过APE总部的plantation安全认证，确保驾驶员权益。',
    category: '支付方式'
  },
  {
    id: '5',
    question: 'FRANXX使用期限是多长？',
    answer: '根据您选择的驾驶计划，一般为30天作战周期。到期前plantation管制中心会通过神经连接提醒您续费岩浆能源。',
    category: '使用期限'
  },
  {
    id: '6',
    question: '如果FRANXX出现故障怎么办？',
    answer: '如果在作战过程中遇到机体故障，请立即联系plantation技术维护部门。我们承诺24小时内完成维修或调配备用机体投入战斗。',
    category: '技术支持'
  },
  {
    id: '7',
    question: '什么是双人驾驶模式？',
    answer: '双人驾驶是FRANXX的标准操控模式，由Stamen（雄蕊）负责武器系统，Pistil（雌蕊）负责机动控制。两名驾驶员通过神经连接共享岩浆能源，实现50%的成本节约。',
    category: '驾驶模式'
  },
  {
    id: '8',
    question: '如何组建FRANXX小队？',
    answer: '3台FRANXX可以组成plantation小队，享受85折团队优惠。每台机体保持独立的岩浆核心和驾驶权限，支持单人或双人驾驶模式混搭配置。',
    category: '小队作战'
  },
  {
    id: '9',
    question: '岩浆能源是如何供应的？',
    answer: '我们的plantation系统直接从APE总部获取岩浆能源，确保每台FRANXX都有充足的能源供应。不同型号的机体对能源的需求和输出效率不同。',
    category: '能源系统'
  },
  {
    id: '10',
    question: '叫龙姬模式是什么？',
    answer: '叫龙姬模式是Strelizia型独有的特殊战斗形态，只有特殊的驾驶员组合才能激活。该模式下机体性能将获得巨大提升，但对驾驶员要求极高。',
    category: '特殊功能'
  }
];