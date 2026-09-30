import {
  AssetAutoArchive,
  CognitionHomePayload,
  DemoChatMessage,
  KnowledgeNodeDetail,
  KnowledgeNodeTreeItem,
  SuggestedNode
} from "@/lib/cognition-types";

export const knowledgeTree: KnowledgeNodeTreeItem[] = [
  {
    id: "theme-001",
    name: "合作关系判断",
    type: "母题",
    summary: "当对方态度积极、话说得满，但实际投入很少时，怎么判断要不要继续合作。",
    sourceLayer: "现代聊天",
    futureHooks: ["经典母题卡", "古今映射"],
    children: [
      {
        id: "problem-001",
        name: "合作方想拿资源但不承担责任",
        type: "问题",
        summary: "对方想要资源、曝光和支持，但不愿意承担对等责任。",
        sourceLayer: "现代聊天",
        futureHooks: ["古今映射"]
      },
      {
        id: "principle-001",
        name: "权责不对等",
        type: "原则",
        summary: "如果一方持续拿好处却不承担责任，关系很容易失衡。",
        sourceLayer: "个人经验",
        futureHooks: ["古籍原则卡", "古今映射"]
      },
      {
        id: "method-001",
        name: "试探性合作",
        type: "方法",
        summary: "先给小范围合作机会，用真实投入验证对方，而不是一次性押大。",
        sourceLayer: "个人经验",
        futureHooks: ["古今映射"]
      }
    ]
  },
  {
    id: "theme-002",
    name: "产品取舍判断",
    type: "母题",
    summary: "需求很多、机会很多时，怎么做取舍，避免被短期热闹带偏。",
    sourceLayer: "现代聊天",
    futureHooks: ["经典母题卡", "古今映射"],
    children: [
      {
        id: "principle-002",
        name: "高频回查价值",
        type: "原则",
        summary: "优先做用户会反复回来用的能力，而不是只带来短暂兴奋的功能。",
        sourceLayer: "个人经验",
        futureHooks: ["古籍原则卡", "古今映射"]
      },
      {
        id: "case-001",
        name: "短期机会 vs 长期稳定",
        type: "案例",
        summary: "一个看起来很热的机会，可能会打断长期节奏，未必值得立刻押注。",
        sourceLayer: "历史案例",
        futureHooks: ["历史案例卡"]
      },
      {
        id: "source-001",
        name: "近期合作与需求讨论记录",
        type: "来源",
        summary: "过去几轮关于合作试探、需求优先级和长期稳定的聊天记录。",
        sourceLayer: "现代聊天",
        futureHooks: []
      }
    ]
  }
];

export const nodeDetails: KnowledgeNodeDetail[] = [
  {
    id: "principle-001",
    name: "权责不对等",
    type: "原则",
    description:
      "这项认知资产处理的是一种常见局面：对方态度很积极，想拿资源、关系和结果，但真正需要承担责任时却不断后退。表面上是合作推进慢，实际核心是权责长期不对等。",
    importance: "高",
    sourceLayer: "个人经验",
    structuralRole: "遇到合作关系时，先看对方到底承担了什么，而不是只听对方怎么表态。",
    futureHooks: ["古籍原则卡", "古今映射"],
    classicalAnchor: "未来可以接“名实相副”“责权相称”这类古籍表达。",
    historicalMirror: "很多结盟失败的根源，不是利益不够，而是有人想享受联盟好处，却不愿承担同等风险。",
    modernMapping: "今天会映射到合作方要资源、要优先级、要支持，但不给人、不出钱、不承担交付。",
    relatedNodes: [
      { id: "problem-001", name: "合作方想拿资源但不承担责任", type: "问题", relation: "这是这个判断最常出现的现实触发场景。" },
      { id: "method-001", name: "试探性合作", type: "方法", relation: "发现失衡后，不要立刻翻脸，先用小规模合作验证。"}
    ],
    evidence: [
      {
        id: "evi-001",
        title: "合作推进记录",
        excerpt: "对方一直表达合作意愿，但涉及具体投入时，总是把责任重新推回到我这边。",
        sourceType: "聊天片段"
      },
      {
        id: "evi-002",
        title: "过去经验",
        excerpt: "凡是早期资源给得太满、边界又不清的合作，后面往往都会演变成单边消耗。",
        sourceType: "经验记录"
      }
    ],
    chatSnippets: [
      {
        id: "chat-001",
        role: "user",
        content: "对方态度特别积极，但真到要给人、给时间、担责任的时候，就开始含糊。",
        timestampLabel: "09:14"
      },
      {
        id: "chat-002",
        role: "assistant",
        content: "这不是沟通热情不够的问题，而是权责开始失衡了。先别继续加码，先看对方到底愿意承担什么。",
        timestampLabel: "09:15"
      }
    ]
  },
  {
    id: "method-001",
    name: "试探性合作",
    type: "方法",
    description:
      "这项认知资产讲的不是要不要合作，而是怎么先小范围试，先验证对方真实投入，再决定要不要进一步绑定。它适合处理对方口头积极、实际投入模糊的局面。",
    importance: "高",
    sourceLayer: "个人经验",
    structuralRole: "先让合作进入可验证的小闭环，而不是一开始就把资源和信任一次性放出去。",
    futureHooks: ["古今映射"],
    classicalAnchor: "未来可以接“先观其行、后信其言”这类判断框架。",
    historicalMirror: "很多稳健的联盟都不是一步到位，而是先做局部协同，再逐步加深绑定。",
    modernMapping: "今天可以对应试点合作、短期项目、阶段性交付、可撤回承诺。",
    relatedNodes: [
      { id: "problem-001", name: "合作方想拿资源但不承担责任", type: "问题", relation: "这是这套做法最典型的使用场景。" },
      { id: "principle-001", name: "权责不对等", type: "原则", relation: "看清失衡后，用这套做法保护自己。"}
    ],
    evidence: [
      {
        id: "evi-003",
        title: "合作试点记录",
        excerpt: "先只给一个很小的协作窗口，对方如果连这个都接不住，就不用继续扩合作了。",
        sourceType: "经验记录"
      }
    ],
    chatSnippets: [
      {
        id: "chat-003",
        role: "assistant",
        content: "不要一下子答应整包合作。先给一个很小、可验证、可撤回的合作动作，看对方是不是真的接得住。",
        timestampLabel: "09:18"
      }
    ]
  },
  {
    id: "case-001",
    name: "短期机会 vs 长期稳定",
    type: "案例",
    description:
      "这项认知资产对应一种常见产品局面：某个机会看起来很热、很快能带来声量，但会打断原本长期节奏。真正要判断的不是机会大不大，而是它是否值得牺牲长期稳定。",
    importance: "高",
    sourceLayer: "历史案例",
    structuralRole: "当眼前收益很诱人时，提醒自己先看长期秩序会不会被破坏。",
    futureHooks: ["历史案例卡"],
    historicalMirror: "很多历史上的失误都不是因为看不到机会，而是为了短期利益打乱了长期秩序。",
    modernMapping: "今天会映射到热门需求插队、短期合作机会、临时资源倾斜和产品节奏被打断。",
    relatedNodes: [
      { id: "principle-002", name: "高频回查价值", type: "原则", relation: "用长期复利来对抗短期诱惑。" },
      { id: "source-001", name: "近期合作与需求讨论记录", type: "来源", relation: "这个案例来自最近几轮真实判断讨论。"}
    ],
    evidence: [
      {
        id: "evi-004",
        title: "需求讨论记录",
        excerpt: "这个需求短期看起来会很热，但如果打断现有节奏，后面可能什么都沉淀不下来。",
        sourceType: "聊天片段"
      }
    ],
    chatSnippets: [
      {
        id: "chat-004",
        role: "user",
        content: "这个机会现在看起来很大，但我担心一旦进去，原来的长期节奏就乱了。",
        timestampLabel: "20:41"
      },
      {
        id: "chat-005",
        role: "assistant",
        content: "先别只看眼前收益。更要看它会不会打断你的长期稳定结构，如果会，代价可能比收益更大。",
        timestampLabel: "20:42"
      }
    ]
  }
];

export const chatMessages: DemoChatMessage[] = [
  {
    id: "msg-001",
    role: "user",
    content: "有个合作方一直想拿我们的资源和支持，但每次谈到具体谁来推进、谁承担结果，他们就开始回避。"
  },
  {
    id: "msg-002",
    role: "assistant",
    content: "这更像是权责已经开始失衡了。问题不在于对方态度热不热，而在于他们到底承担了什么。"
  },
  {
    id: "msg-003",
    role: "user",
    content: "对，但我又不想直接拒绝，因为这个合作机会表面上看起来还挺大。"
  },
  {
    id: "msg-004",
    role: "assistant",
    content: "那就别一次性答应。先试探性合作，只给一个小范围、可验证的动作，看对方是否真的投入，再决定要不要继续。"
  }
];

export const suggestedNodes: SuggestedNode[] = [
  {
    id: "sug-001",
    name: "权责不对等",
    type: "原则",
    reason: "系统判断这段对话的核心，不是对方热情不够，而是合作关系开始失衡。"
  },
  {
    id: "sug-002",
    name: "试探性合作",
    type: "方法",
    reason: "与其立刻答应或拒绝，更适合先做小范围试探，验证对方真实投入。"
  },
  {
    id: "sug-003",
    name: "合作与防备",
    type: "案例",
    reason: "这段对话可以归入“合作关系里如何开放但不失防备”这类长期局面。"
  }
];

export const latestArchive: AssetAutoArchive = {
  assets: ["权责不对等", "试探性合作", "合作与防备"],
  themes: ["合作边界", "责任承担", "资源交换"],
  newInsight: "系统发现一个值得继续沉淀的新判断：当对方持续表达积极，但始终不愿承担具体责任时，最稳的做法不是继续解释，而是缩小合作范围，先验证真实投入。"
};

export const homePayload: CognitionHomePayload = {
  nodeCount: 9,
  typeCounts: {
    问题: 1,
    母题: 2,
    原则: 2,
    方法: 1,
    案例: 1,
    来源: 1
  },
  featuredNodes: nodeDetails,
  graphNodes: [
    {
      id: "g-001",
      name: "产品判断",
      summary: "需求很多时，先看什么真正值得做，什么只是短期热闹。",
      detailId: "case-001",
      color: "#67e8f9",
      glowColor: "rgba(103,232,249,0.45)",
      tags: ["需求", "优先级", "长期稳定"],
      x: 48,
      y: 18,
      size: "lg"
    },
    {
      id: "g-002",
      name: "高频回查价值",
      summary: "优先做用户会反复回来用的东西。",
      detailId: "case-001",
      color: "#f9a8d4",
      glowColor: "rgba(249,168,212,0.42)",
      tags: ["高频", "复利", "回查"],
      x: 25,
      y: 44,
      size: "lg"
    },
    {
      id: "g-003",
      name: "需求优先级",
      summary: "需求很多时，怎么判断先做什么。",
      detailId: "case-001",
      color: "#86efac",
      glowColor: "rgba(134,239,172,0.38)",
      tags: ["取舍", "优先级", "资源"],
      x: 70,
      y: 34,
      size: "md"
    },
    {
      id: "g-004",
      name: "短期利益 vs 长期稳定",
      summary: "眼前机会很大时，要不要为它打断长期节奏。",
      detailId: "case-001",
      color: "#c4b5fd",
      glowColor: "rgba(196,181,253,0.38)",
      tags: ["长期稳定", "短期机会", "节奏"],
      x: 66,
      y: 68,
      size: "md"
    },
    {
      id: "g-005",
      name: "合作与防备",
      summary: "对方态度积极时，怎样保持开放又不失防备。",
      detailId: "principle-001",
      color: "#fdba74",
      glowColor: "rgba(253,186,116,0.4)",
      tags: ["合作", "边界", "防备"],
      x: 22,
      y: 72,
      size: "md"
    },
    {
      id: "g-006",
      name: "试探性合作",
      summary: "先小范围试，再决定要不要深度绑定。",
      detailId: "method-001",
      color: "#7dd3fc",
      glowColor: "rgba(125,211,252,0.36)",
      tags: ["试探", "验证", "合作"],
      x: 83,
      y: 54,
      size: "sm"
    },
    {
      id: "g-007",
      name: "权责不对等",
      summary: "对方想拿结果，但不愿承担对等责任。",
      detailId: "principle-001",
      color: "#fca5a5",
      glowColor: "rgba(252,165,165,0.4)",
      tags: ["责任", "权责", "失衡"],
      x: 38,
      y: 58,
      size: "md"
    }
  ],
  graphLinks: [
    { from: "g-001", to: "g-002" },
    { from: "g-001", to: "g-003" },
    { from: "g-003", to: "g-004" },
    { from: "g-005", to: "g-006" },
    { from: "g-005", to: "g-007" },
    { from: "g-007", to: "g-006" }
  ],
  searchHints: ["权责不对等", "试探性合作", "需求优先级", "短期利益 vs 长期稳定", "高频回查价值"],
  quickPrompt: "对方一直很积极，但真正需要承担责任时就后退。我该继续给资源，还是先拉开距离？",
  latestArchive,
  futureDirections: [
    {
      title: "古籍原则卡",
      description: "把今天的判断继续接到古籍里的权责、联盟和取舍表达。"
    },
    {
      title: "经典母题卡",
      description: "把反复出现的合作局面和产品取舍局面沉淀成长期母题。"
    },
    {
      title: "历史案例卡",
      description: "把历史上的联盟、失衡、短期诱惑与今天的局面对照起来。"
    },
    {
      title: "古今映射",
      description: "把今天的具体问题和历史结构做更稳定的对应。"
    }
  ]
};
