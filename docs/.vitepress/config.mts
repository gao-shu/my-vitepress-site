import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config

function guideSidebar() {
  return [
    {
      text: 'Java 基础',
      collapsed: false,
      items: [
        { text: 'Java 基础概述', link: '/java/base-overview' },
        { text: '面向对象编程', link: '/java/oop' },
        { text: '集合框架', link: '/java/collections' },
        { text: '多线程与并发', link: '/java/concurrency' },
        { text: 'JVM 内存模型', link: '/java/jvm' },
        { text: 'Java 8 新特性', link: '/java/java8-features' },
        { text: '异常处理与 IO 流', link: '/java/exception-io' },
        { text: '反射与注解机制', link: '/java/reflection-annotation' },
        { text: '场景实战：并发问题调优', link: '/java/concurrency-scenario' }
      ]
    },
    {
      text: '数据库',
      collapsed: true,
      items: [
        { text: '数据库面试总览：高频 8 题', link: '/database/overview' },
        { text: 'MySQL 基础速览（低频，可选）', link: '/database/mysql-basics' },
        { text: 'SQL 高频题（会写会讲即可，可选）', link: '/database/sql-interview' },
        { text: 'JOIN 查询与子查询详解', link: '/database/join-subquery' },
        { text: '常用函数与分组聚合', link: '/database/sql-functions' },
        { text: 'MySQL 索引底层原理', link: '/database/mysql-index' },
        { text: 'MySQL 事务与锁机制', link: '/database/mysql-transaction-lock' },
        { text: 'SQL 优化与执行计划', link: '/database/sql-optimization' },
        { text: '数据库连接池调优', link: '/database/connection-pool' },
        { text: '场景实战：慢查询排查', link: '/database/slow-query-scenario' },
        { text: '主从架构与读写分离【中级】', link: '/database/master-slave-arch' },
        { text: '分库分表与全局 ID【中级】', link: '/database/sharding' }
      ]
    },
    {
      text: 'Redis',
      collapsed: true,
      items: [
        { text: 'Redis 面试总览：高频 8 题', link: '/redis/overview' },
        { text: '数据类型与使用场景', link: '/redis/data-types' },
        { text: '常用命令与过期策略', link: '/redis/commands-expire' },
        { text: '持久化机制', link: '/redis/persistence' },
        { text: '事务与发布订阅', link: '/redis/transaction-pubsub' },
        { text: '缓存常见问题', link: '/redis/cache-issues' },
        { text: '分布式锁', link: '/redis/distributed-lock' },
        { text: '集群与高可用', link: '/redis/cluster-ha' },
        { text: '场景实战：缓存设计', link: '/redis/cache-scenario' }
      ]
    },
    {
      text: '框架',
      collapsed: true,
      items: [
        { text: '框架面试总览：Spring / SpringBoot / MyBatis', link: '/framework/overview' },
        { text: 'Spring 核心', link: '/framework/spring-core' },
        { text: 'Bean 生命周期与循环依赖', link: '/framework/bean-lifecycle' },
        { text: '事务传播机制详解', link: '/framework/transaction-propagation' },
        { text: 'Spring 中的多线程与高并发实战', link: '/framework/concurrency-spring' },
        { text: '本地缓存技术：Caffeine/Guava/Ehcache', link: '/framework/local-cache' },
        { text: 'SpringBoot 原理', link: '/framework/springboot-principle' },
        { text: 'SpringCloud 微服务', link: '/framework/springcloud-microservice' },
        { text: 'MyBatis/MyBatis-Plus', link: '/framework/mybatis' },
        { text: 'Spring 常见问题', link: '/framework/spring-faq' },
        { text: 'SpringBoot 常见问题', link: '/framework/springboot-faq' },
        { text: '微服务常见问题', link: '/framework/microservice-faq' },
        { text: '场景实战：事务失效分析', link: '/framework/transaction-scenario' }
      ]
    },
    {
      text: '消息队列 (MQ)',
      collapsed: true,
      items: [
        { text: 'MQ 基础与选型', link: '/mq/overview' },
        { text: 'MQ 选型对比与常见问题', link: '/mq/mq-comparison' },
        { text: '消息丢失与可靠性保证【中级】', link: '/mq/message-loss' },
        { text: '重复消费与幂等性【中级】', link: '/mq/message-duplicate' },
        { text: '消息顺序性保证【中级】', link: '/mq/message-order' },
        { text: '消息积压与死信队列【中级】', link: '/mq/message-accumulation' }
      ]
    },
    {
      text: '计算机网络与 Linux',
      collapsed: true,
      items: [
        { text: 'TCP/IP 与网络传输', link: '/network-linux/tcp-ip' },
        { text: 'HTTP 与 HTTPS 协议', link: '/network-linux/http' },
        { text: 'Session、Cookie 与跨域问题', link: '/network-linux/session-cors' },
        { text: '常用 Linux 命令', link: '/network-linux/linux-cmd' },
        { text: '线上排查实战【中级】', link: '/network-linux/linux-troubleshooting' }
      ]
    },
    {
      text: '设计模式',
      collapsed: true,
      items: [
        { text: '单例模式与线程安全', link: '/design-patterns/singleton' },
        { text: '工厂与策略模式实战', link: '/design-patterns/factory' },
        { text: '观察者与装饰器模式', link: '/design-patterns/observer-decorator' },
        { text: '代理与模板方法【中级】', link: '/design-patterns/proxy-template' },
        { text: '实战：重构烂代码【中高级】', link: '/design-patterns/scenario' }
      ]
    },
    {
      text: '经典业务场景设计',
      collapsed: true,
      items: [
        { text: '秒杀系统抗高并发设计【中高级】', link: '/scenarios/seckill' },
        { text: '单点登录与 OAuth2 授权', link: '/scenarios/sso' },
        { text: '接口幂等性设计实战【中级】', link: '/scenarios/api-idempotent' },
        { text: '大文件分片与断点续传【中高级】', link: '/scenarios/large-file' }
      ]
    },
    {
      text: '简历与面试技巧',
      collapsed: true,
      items: [
        { text: '简历排版与编写避坑', link: '/resume/resume-guide' },
        { text: '技术面试：自我介绍与项目讲述', link: '/resume/interview-skills' },
        { text: '专业技能面试准备（问题与回答）', link: '/resume/skills-interview-prep' },
        { text: '简历分析与面试准备', link: '/resume/resume-analysis' },
        { text: '投递平台与投递策略', link: '/resume/job-platform-strategy' }
      ]
    },
    {
      text: 'Vue 面试基础',
      collapsed: true,
      items: [
        { text: 'Vue 面试基础：高频 8 题', link: '/resume/vue-interview' }
      ]
    }
  ]
}

/** 资源库 + 开发工具：左侧两个平级分组，/resources 与 /devtools 共用，避免环境专题「藏」在折叠里找不到 */
function resourceAndDevtoolsSidebar() {
  return [
    {
      text: '热门资源',
      collapsed: false,
      items: [
        { text: '资源库首页', link: '/resources/' },
        { text: '学习教程', link: '/resources/learning' },
        { text: '工具推荐', link: '/resources/tools' },
        { text: '书籍推荐', link: '/resources/books' },
        { text: '视频资源', link: '/resources/videos' }
      ]
    },
    {
      text: '开发工具与环境配置',
      collapsed: false,
      items: [
        { text: '总览', link: '/devtools/' },
        { text: 'JDK 安装与多版本管理', link: '/devtools/jdk' },
        { text: 'IntelliJ IDEA 配置', link: '/devtools/intellij-idea' },
        { text: 'Maven 配置与最佳实践', link: '/devtools/maven' },
        { text: 'Git 版本控制实战', link: '/devtools/git' },
        { text: 'Docker 快速上手', link: '/devtools/docker' },
        { text: '数据库客户端工具', link: '/devtools/database-tools' },
        { text: 'API 测试工具', link: '/devtools/api-testing' },
        { text: '其他实用工具', link: '/devtools/misc-tools' },
        { text: '一键配置脚本', link: '/devtools/setup-scripts' },
        { text: '环境常见问题排查', link: '/devtools/troubleshooting' },
        { text: '工具选型建议', link: '/devtools/tool-selection' },
        { text: '持续学习资源', link: '/devtools/learning-resources' }
      ]
    }
  ]
}

export default defineConfig({
  title: "Java 面试指南",
  description: "专注 Java 后端面试辅导",
  ignoreDeadLinks: true,  // 添加这行
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '面试指南', link: '/guide/' },
      { text: 'AI 探索', link: '/ai/' },
      { text: '技术体系', link: '/tech-system/' },
      {
        text: '资源库',
        link: '/resources/',
        activeMatch: '^\\/(resources|devtools)(\\/|$)',
        items: [
          { text: '热门资源', link: '/resources/' },
          { text: '开发工具与环境', link: '/devtools/' }
        ]
      },
      { text: '开源项目', link: '/open-source/' },
      { text: '关于我', link: '/about/' }
    ],

    sidebar: {
      '/': [
        {
          text: '关于本站',
          items: [
            { text: '网站介绍', link: '/about/' },
            { text: '更新日志', link: '/about/changelog' },
            { text: '联系我们', link: '/about/contact' }
          ]
        }
      ],
      '/guide/': guideSidebar(),
      '/java/': guideSidebar(),
      '/database/': guideSidebar(),
      '/redis/': guideSidebar(),
      '/framework/': guideSidebar(),
      '/mq/': guideSidebar(),
      '/network-linux/': guideSidebar(),
      '/design-patterns/': guideSidebar(),
      '/scenarios/': guideSidebar(),
      '/resume/': guideSidebar(),
      '/ai/': [
        {
          text: 'AI 热门生态（探索）',
          collapsed: false,
          items: [
            { text: '热门软件与开源项目地图', link: '/ai/explore/' }
          ]
        },
        {
          text: 'AI 学习与路线（主路径）',
          collapsed: false,
          items: [
            { text: 'AI 探索总览', link: '/ai/' },
            { text: '阶段一：LLM 入门与 Prompt 规划', link: '/ai/llm-basics' },
            { text: '阶段一进阶：Agent / 工具型 AI 规划', link: '/ai/agent-basics' },
            { text: '阶段二：MVP Server / 数据中台规划', link: '/ai/mvp-server' },
            { text: '阶段三：多模态 & 知识图谱规划', link: '/ai/multimodal-kg' },
            { text: '阶段四：部署 & MLOps 规划', link: '/ai/mlops-platform' }
          ]
        },
        {
          text: '大模型部署及使用',
          collapsed: true,
          items: [
            { text: '模块导航', link: '/ai/model-deploy/' },
            { text: '本地部署', link: '/ai/model-deploy/01-local-deploy' },
            { text: '云端部署', link: '/ai/model-deploy/02-cloud-deploy' },
            { text: '模型选择指南（按环境/场景）', link: '/ai/model-deploy/03-model-selection' },
            { text: '推理框架对比与选型（2026）', link: '/ai/model-deploy/04-runtime-compare' }
          ]
        },
        {
          text: '阶段一模块：LLM & Prompt（循序渐进）',
          collapsed: true,
          items: [
            { text: '模块导航', link: '/ai/stage-1-llm/' },
            { text: '01 环境与账号准备', link: '/ai/stage-1-llm/01-setup' },
            { text: '02 Prompt 基础', link: '/ai/stage-1-llm/02-prompt-basics' },
            { text: '03 Prompt 进阶', link: '/ai/stage-1-llm/03-prompt-advanced' },
            { text: '04 API 入门（Python）', link: '/ai/stage-1-llm/04-api-python-minimal' },
            { text: '05 小项目：笔记总结器', link: '/ai/stage-1-llm/05-mini-project-notes-summarizer' },
            { text: 'Checklist', link: '/ai/stage-1-llm/checklist' }
          ]
        },
        {
          text: '阶段二模块：Agent & Tools（循序渐进）',
          collapsed: true,
          items: [
            { text: '模块导航', link: '/ai/stage-2-agent/' },
            { text: '01 Agent 概览', link: '/ai/stage-2-agent/01-agent-overview' },
            { text: '02 Function Calling', link: '/ai/stage-2-agent/02-function-calling' },
            { text: '03 工具：读写 Markdown', link: '/ai/stage-2-agent/03-tool-readwrite-markdown' },
            { text: '04 最小闭环：面试题 Agent', link: '/ai/stage-2-agent/04-mini-agent-interview-qa' },
            { text: '05 可靠性加固', link: '/ai/stage-2-agent/05-reliability' },
            { text: 'Checklist', link: '/ai/stage-2-agent/checklist' }
          ]
        },
        {
          text: '阶段三模块：MVP Server / 数据中台（循序渐进）',
          collapsed: true,
          items: [
            { text: '模块导航', link: '/ai/stage-3-mvp-server/' },
            { text: '01 为什么需要中台', link: '/ai/stage-3-mvp-server/01-why-mvp-server' },
            { text: '02 接口设计', link: '/ai/stage-3-mvp-server/02-api-design' },
            { text: '03 数据接入（docs 扫描）', link: '/ai/stage-3-mvp-server/03-data-ingestion' },
            { text: '04 存储与缓存选型', link: '/ai/stage-3-mvp-server/04-storage-cache' },
            { text: '05 串联 Agent', link: '/ai/stage-3-mvp-server/05-integrate-agent' },
            { text: 'Checklist', link: '/ai/stage-3-mvp-server/checklist' }
          ]
        }
      ],
      '/open-source/': [
        {
          text: '概览',
          collapsed: false,
          items: [{ text: '开源项目总览', link: '/open-source/' }]
        },
        {
          text: '后端项目',
          collapsed: true,
          items: [
            { text: 'Java / Spring 项目', link: '/open-source/java-projects' },
            { text: 'Python 项目', link: '/open-source/python-projects' },
            { text: 'Node.js 项目', link: '/open-source/nodejs-projects' },
            { text: '企业业务套件（CRM/ERP/WMS/IoT）', link: '/open-source/enterprise-suite' }
          ]
        },
        {
          text: '后台管理系统',
          collapsed: true,
          items: [
            { text: 'RuoYi（若依）', link: '/open-source/admin-ruoyi' },
            { text: 'JeecgBoot', link: '/open-source/admin-jeecg' }
          ]
        },
        {
          text: '前端与企业应用',
          collapsed: true,
          items: [
            { text: 'Vue 项目', link: '/open-source/vue-projects' },
            { text: 'React 项目', link: '/open-source/react-projects' },
            { text: '商城系统', link: '/open-source/mall' },
            { text: '中小企业项目', link: '/open-source/sme-projects' }
          ]
        },
        {
          text: '数据库与中间件',
          collapsed: true,
          items: [
            { text: '数据库工具', link: '/open-source/database-tools' },
            { text: '消息队列项目', link: '/open-source/message-queue' }
          ]
        },
        {
          text: 'AI & 大模型',
          collapsed: true,
          items: [
            { text: 'AI 框架与工具', link: '/open-source/ai-projects' },
            { text: 'LLM 应用项目', link: '/open-source/llm-projects' }
          ]
        },
        {
          text: '物联网 / DevOps',
          collapsed: true,
          items: [
            { text: '物联网平台', link: '/open-source/iot' },
            { text: '开发工具', link: '/open-source/dev-tools' },
            { text: '部署与运维', link: '/open-source/deployment-tools' }
          ]
        }
      ],
      '/about/': [
        {
          text: '关于我',
          items: [
            { text: '个人介绍', link: '/about/' },
            { text: '更新日志', link: '/about/changelog' },
            { text: '联系我', link: '/about/contact' }
          ]
        }
      ],
      '/tech-system/': [
        {
          text: '技术体系',
          collapsed: false,
          items: [{ text: '技术体系概览', link: '/tech-system/' }]
        },
        {
          text: '后端',
          collapsed: true,
          items: [
            { text: 'Java & Spring', link: '/tech-system/backend/java-spring' },
            { text: 'Node.js 技术栈', link: '/tech-system/backend/nodejs-stack' },
            { text: 'Python 技术栈', link: '/tech-system/backend/python-stack' },
            { text: 'Golang 技术栈', link: '/tech-system/backend/golang' },
            { text: '物联网项目学习路线', link: '/tech-system/backend/iot-project' }
          ]
        },
        {
          text: '工业自动化（PLC）',
          collapsed: false,
          items: [
            { text: '常见 PLC 品牌与选型', link: '/tech-system/plc/common-brands' },
            { text: '西门子 S7 详解与 Python 采集', link: '/tech-system/plc/s7-python-data-collection' },
            { text: 'S7 速查手册', link: '/tech-system/plc/s7-quick-reference' }
          ]
        },
        {
          text: '前端',
          collapsed: true,
          items: [
            { text: 'Vue 技术栈', link: '/tech-system/frontend/vue-stack' },
            { text: 'React 技术栈', link: '/tech-system/frontend/react-stack' },
            { text: '移动端', link: '/tech-system/frontend/mobile' },
            { text: '跨端', link: '/tech-system/frontend/cross-platform' },
            { text: '工程化', link: '/tech-system/frontend/engineering' }
          ]
        },
        {
          text: '数据库与数据',
          collapsed: true,
          items: [
            { text: '数据库体系与选型', link: '/tech-system/database/database-stack' },
            { text: '关系型数据库', link: '/tech-system/database/relational' },
            { text: 'NoSQL', link: '/tech-system/database/nosql' },
            { text: '缓存体系', link: '/tech-system/database/caching' }
          ]
        },
        {
          text: '系统集成与通信',
          collapsed: true,
          items: [
            { text: '跨语言调用（选型）', link: '/tech-system/integration/cross-language-interop' },
            { text: 'HTTP：Node.js ↔ Python', link: '/tech-system/integration/http-node-python' },
            { text: 'Modbus TCP：Node.js ↔ PLC', link: '/tech-system/integration/modbus-tcp-node-plc' }
          ]
        },
        {
          text: 'DevOps',
          collapsed: true,
          items: [
            { text: 'CI/CD 流水线', link: '/tech-system/devops/ci-cd-pipeline' },
            { text: '监控与可观测', link: '/tech-system/devops/monitoring-observability' },
            { text: '监控', link: '/tech-system/devops/monitoring' },
            { text: 'Windows Docker Desktop', link: '/tech-system/devops/docker-desktop-windows' }
          ]
        },
        {
          text: '安全',
          collapsed: true,
          items: [
            { text: '安全技术栈', link: '/tech-system/security/security-stack' },
            { text: 'Web 安全', link: '/tech-system/security/web-security' }
          ]
        },
        {
          text: '工程实践',
          collapsed: true,
          items: [
            { text: '研发规范', link: '/tech-system/practices/development-practices' },
            { text: '代码质量', link: '/tech-system/practices/code-quality' }
          ]
        },
        {
          text: '趋势',
          collapsed: true,
          items: [
            { text: '行业趋势', link: '/tech-system/trends/industry-trends' }
          ]
        },
        {
          text: '后端-python',
          collapsed: true,
          items: [
            { text: '技能储备', link: '/tech-system/python/python-skill' }
          ]
        },
        // 资源/工具统一放在“资源库”模块，这里不再单独展示
      ],
      '/resources/': resourceAndDevtoolsSidebar(),
      '/devtools/': resourceAndDevtoolsSidebar(),
      '/springboot/': [
        {
          text: 'Spring Boot 概述',
          collapsed: false,
          items: [
            { text: 'Spring Boot 概述', link: '/springboot/overview' },
            { text: '前后台管理系统技术栈', link: '/springboot/tech-stack' }
          ]
        },
        {
          text: '核心特性',
          collapsed: true,
          items: [
            { text: '自动配置原理', link: '/springboot/auto-configuration' },
            { text: '注解详解', link: '/springboot/annotations' }
          ]
        },
        {
          text: '数据访问',
          collapsed: true,
          items: [
            { text: '数据访问基础', link: '/springboot/data-access' }
          ]
        },
        {
          text: 'Web 开发',
          collapsed: true,
          items: [
            { text: 'RESTful API 设计', link: '/springboot/restful-api' }
          ]
        },
        {
          text: '安全与认证',
          collapsed: true,
          items: [
            { text: 'Spring Security', link: '/springboot/security' }
          ]
        }
      ]
    },

    // 启用本地搜索 - 显示永久搜索框
    // search: {
    //   provider: 'local',
    //   options: {
    //     showSearchButton: true,
    //     locales: {
    //       root: {
    //         translations: {
    //           button: {
    //             buttonText: '🔍 搜索文档',
    //             buttonAriaLabel: '搜索文档'
    //           },
    //           modal: {
    //             noResultsText: '无法找到相关结果',
    //             resetButtonTitle: '清除查询条件',
    //             footer: {
    //               selectText: '选择',
    //               navigateText: '切换'
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    // },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    outline: {
      level: 'deep',
      label: '目录'
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    outlineTitle: '目录',
    lastUpdatedText: '最后更新',
    
    editLink: {
      pattern: 'https://github.com/yourname/yourrepo/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面'
    }
  },

  markdown: {
    lineNumbers: true,
    image: {
      lazyLoading: true
    },
    // 不要配置 markdown.languages 白名单，除非你能覆盖全站用到的所有语言；
    // 误写（例如把反引号当成语言 id）会导致 Shiki 启动失败。
  },

  vite: {
    server: {
      host: '0.0.0.0',  // 监听所有网络接口，允许外部访问（用于端口转发）
      port: 6173,       // 本地开发服务器端口
      strictPort: false, // 如果端口被占用，自动尝试下一个可用端口
      hmr: {
        host: '0.0.0.0',  // HMR 也监听所有接口
        protocol: 'ws'    // WebSocket 协议
      },
      cors: true,  // 启用 CORS，允许跨域访问
      // 允许所有来源访问（用于端口转发场景）
      origin: '*',
      allowedHosts: ['learncom.cn', 'localhost', '.local', '192.168.31.171']
    }
  }
})
