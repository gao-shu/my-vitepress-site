import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config

function guideSidebar() {
  return [
    {
      text: '个人简历',
      collapsed: true,
      items: [
        { text: '个人简历', link: '/guide/my-resume' }
      ]
    },
    {
      text: 'Java 基础',
      collapsed: true,
      items: [
        { text: 'Java 基础概述', link: '/java/base-overview' },
        { text: '面向对象编程', link: '/java/oop' },
        { text: '集合框架', link: '/java/collections' },
        { text: '多线程基础与线程池', link: '/java/thread-basics' },
        { text: '并发编程核心机制', link: '/java/concurrency-core' },
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
        { text: 'Redis 总览', link: '/redis/' },
        { text: '面试高频速查', link: '/redis/overview' },
        { text: '面试连环追问（口述链）', link: '/redis/interview-chain' },
        {
          text: '1. 基础原理',
          collapsed: true,
          items: [
            { text: '是什么 / 为什么快 / 线程与 IO', link: '/redis/01-basics' }
          ]
        },
        {
          text: '2. 数据结构',
          collapsed: true,
          items: [
            { text: 'String ~ Stream 与场景', link: '/redis/data-types' },
            { text: '命令与过期策略', link: '/redis/commands-expire' }
          ]
        },
        {
          text: '3. 缓存',
          collapsed: true,
          items: [
            { text: '穿透 / 击穿 / 雪崩 / 一致性', link: '/redis/cache-issues' }
          ]
        },
        {
          text: '4. 持久化',
          collapsed: true,
          items: [
            { text: 'RDB / AOF / 混合与恢复', link: '/redis/persistence' }
          ]
        },
        {
          text: '5. 高可用',
          collapsed: true,
          items: [
            { text: '主从 / Sentinel / Cluster', link: '/redis/cluster-ha' }
          ]
        },
        {
          text: '6. 分布式',
          collapsed: true,
          items: [
            { text: '分布式锁 / Redisson / 续期误删', link: '/redis/distributed-lock' }
          ]
        },
        {
          text: '7. 并发',
          collapsed: true,
          items: [
            { text: '原子 / Lua / 库存 / 限流', link: '/redis/07-concurrency' }
          ]
        },
        {
          text: '8. 消息',
          collapsed: true,
          items: [
            { text: '事务 / PubSub / Stream / 延迟队列', link: '/redis/transaction-pubsub' }
          ]
        },
        {
          text: '9. 性能',
          collapsed: true,
          items: [
            { text: 'BigKey / HotKey / Pipeline / 淘汰', link: '/redis/09-performance' }
          ]
        },
        {
          text: '10. 实战',
          collapsed: true,
          items: [
            { text: '登录 / 秒杀 / 点赞 / 限流等', link: '/redis/10-practice' },
            { text: '缓存架构设计', link: '/redis/cache-scenario' }
          ]
        }
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
      text: 'DevOps',
      collapsed: true,
      items: [
        { text: 'DevOps 总览', link: '/guide/devops/' },
        { text: 'Docker 实战与面试', link: '/guide/devops/docker-interview' },
        { text: 'Docker Compose 实战与面试', link: '/guide/devops/docker-compose-interview' },
        { text: 'Kubernetes 实战与面试', link: '/guide/devops/k8s-interview' },
        { text: 'CI/CD 实战与面试', link: '/guide/devops/cicd-interview' },
        { text: '线上问题排查实战与面试', link: '/guide/devops/monitoring-interview' }
      ]
    },
    {
      text: '消息队列',
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
        { text: '大文件分片与断点续传【中高级】', link: '/scenarios/large-file' },
        { text: '多租户架构设计与数据隔离【中高级】', link: '/scenarios/multi-tenant' },
        { text: '对外 API 接口开发实战【中高级】', link: '/scenarios/open-api' },
        { text: 'Web 系统架构设计与开发实战【中高级】', link: '/scenarios/web-system-design' }
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
        { text: 'Vue 面试基础：高频题库', link: '/resume/vue-interview' }
      ]
    },
    {
      text: 'Agent 面试',
      collapsed: true,
      items: [
        { text: 'Agent 面试总览', link: '/guide/agent/' },
        { text: '高频快答', link: '/guide/agent/quick-qa' },
        { text: '概念与边界', link: '/guide/agent/concepts-interview' },
        { text: 'Tool Calling', link: '/guide/agent/tool-calling-interview' },
        { text: '可靠性与安全', link: '/guide/agent/reliability-interview' },
        { text: '场景设计题', link: '/guide/agent/scenario-interview' },
        { text: '对比与选型口述', link: '/guide/agent/compare-interview' },
        { text: '项目讲述模板', link: '/guide/agent/project-story' }
      ]
    },
    {
      text: 'Python 面试',
      collapsed: true,
      items: [
        { text: 'Python 面试总览', link: '/guide/python/' },
        { text: '高频快答', link: '/guide/python/quick-qa' },
        { text: '语言基础', link: '/guide/python/basics-interview' },
        { text: '并发与性能', link: '/guide/python/concurrency-interview' },
        { text: '工程与依赖', link: '/guide/python/engineering-interview' },
        { text: '实战场景题', link: '/guide/python/scenario-interview' },
        { text: '项目讲述', link: '/guide/python/project-story' }
      ]
    },
    {
      text: 'Node.js / TS 面试',
      collapsed: true,
      items: [
        { text: 'Node/TS 面试总览', link: '/guide/nodejs/' },
        { text: '高频快答', link: '/guide/nodejs/quick-qa' },
        { text: 'Node 基础与事件循环', link: '/guide/nodejs/basics-interview' },
        { text: 'TypeScript', link: '/guide/nodejs/typescript-interview' },
        { text: '异步与并发', link: '/guide/nodejs/async-interview' },
        { text: 'Electron 与上位机', link: '/guide/nodejs/electron-interview' },
        { text: '实战场景题', link: '/guide/nodejs/scenario-interview' },
        { text: '项目讲述', link: '/guide/nodejs/project-story' }
      ]
    },
    {
      text: '英文技术面试',
      collapsed: true,
      items: [
        { text: '英文技术面试', link: '/guide/english-interview/' },
        { text: '90天计划', link: '/guide/english-interview/90-day-plan' },
        { text: '自我介绍', link: '/guide/english-interview/self-introduction' }
      ]
    }
  ]
}

/** 资源库 + 开发工具：左侧两个平级分组，/resources 与 /devtools 共用，避免环境专题「藏」在折叠里找不到 */
function resourceAndDevtoolsSidebar() {
  return [
    {
      text: '热门资源',
      collapsed: true,
      items: [
        { text: '学习教程（官网）', link: '/resources/learning' },
        { text: '书籍推荐(免费下载)', link: '/resources/books' }
      ]
    },
    {
      text: '开发工具与环境配置',
      collapsed: true,
      items: [
        { text: 'JDK 安装与多版本管理', link: '/devtools/jdk' },
        { text: 'Node.js 安装与版本控制', link: '/devtools/nodejs-install-version' },
        { text: 'Python 安装与版本控制', link: '/devtools/python-install-version' },
        { text: '本地 MySQL 安装配置', link: '/devtools/mysql-local' },
        { text: 'Redis 安装配置', link: '/devtools/redis-local' },
        { text: 'Docker 快速上手', link: '/devtools/docker' },
        { text: '环境常见问题排查', link: '/devtools/troubleshooting' }
      ]
    },
    {
      text: '开发工具',
      collapsed: true,
      items: [
        { text: 'IntelliJ IDEA 配置', link: '/devtools/intellij-idea' },
        { text: 'VS Code 安装与配置', link: '/devtools/vscode' },
        { text: 'Cursor 安装与配置', link: '/devtools/cursor' },
        { text: 'Maven 配置与最佳实践', link: '/devtools/maven' },
        { text: 'Git 版本控制实战', link: '/devtools/git' },
        { text: '数据库客户端工具', link: '/devtools/database-tools' },
        { text: 'API 测试工具', link: '/devtools/api-testing' },
        { text: '其他实用工具', link: '/devtools/misc-tools' },
        { text: '工具选型建议', link: '/devtools/tool-selection' },
        { text: '一键配置脚本', link: '/devtools/setup-scripts' }
      ]
    }
  ]
}

function industrialSidebar() {
  return [
    {
      text: '总览',
      collapsed: true,
      items: [
        { text: '工业数字化实验室', link: '/tech-system/industrial-digitalization/' }
      ]
    },
    {
      text: 'Mini MES',
      collapsed: true,
      items: [
        { text: '项目目标', link: '/tech-system/industrial-digitalization/mini-mes/' },
        { text: '架构演进', link: '/tech-system/industrial-digitalization/mini-mes/architecture' },
        { text: 'Roadmap', link: '/tech-system/industrial-digitalization/mini-mes/roadmap' },
        { text: 'Domain / 问题', link: '/tech-system/industrial-digitalization/mini-mes/domain' }
      ]
    },
    {
      text: '判断记录',
      collapsed: true,
      items: [
        { text: '判断索引', link: '/tech-system/industrial-digitalization/decisions/' },
        { text: 'V0 为何 Gateway → HTTP', link: '/tech-system/industrial-digitalization/decisions/01-v0-gateway-http' },
        { text: '为何暂不用 MQTT / EMQX', link: '/tech-system/industrial-digitalization/decisions/02-no-mqtt-yet' },
        { text: 'Redis 与 MySQL 怎么分', link: '/tech-system/industrial-digitalization/decisions/03-redis-vs-mysql' },
        { text: '为何暂不用 TDengine', link: '/tech-system/industrial-digitalization/decisions/04-no-tdengine' },
        { text: '为何第一版不做微服务', link: '/tech-system/industrial-digitalization/decisions/05-no-microservice' }
      ]
    },
    {
      text: '实验室',
      collapsed: true,
      items: [
        { text: '实验室索引', link: '/tech-system/industrial-digitalization/labs/' },
        { text: 'Lab 001 · 设备采集最小闭环', link: '/tech-system/industrial-digitalization/labs/lab-001' }
      ]
    },
    {
      text: '速查',
      collapsed: true,
      items: [
        { text: '常见 PLC 品牌与选型', link: '/tech-system/plc/common-brands' },
        { text: '西门子 S7 与 Python 采集', link: '/tech-system/plc/s7-python-data-collection' },
        { text: 'S7 速查手册', link: '/tech-system/plc/s7-quick-reference' },
        { text: 'Modbus TCP：Node.js ↔ PLC', link: '/tech-system/integration/modbus-tcp-node-plc' },
        { text: 'Modbus TCP：Python ↔ PLC', link: '/tech-system/integration/modbus-tcp-python-plc' },
        { text: 'Siemens S7：Node.js ↔ PLC', link: '/tech-system/integration/s7-comm-node-plc' },
        { text: 'Siemens S7：Python ↔ PLC', link: '/tech-system/integration/s7-comm-python-plc' },
        { text: '跨语言调用（选型）', link: '/tech-system/integration/cross-language-interop' },
        { text: 'HTTP：Node.js ↔ Python', link: '/tech-system/integration/http-node-python' },
        { text: '物联网项目笔记', link: '/tech-system/backend/iot-project' }
      ]
    },
    {
      text: '底稿（不维护）',
      collapsed: true,
      items: [
        { text: '00-整体架构概览', link: '/tech-system/industrial-digitalization/00-architecture-overview' },
        { text: '01-设备接入与数据采集', link: '/tech-system/industrial-digitalization/01-device-access' },
        { text: '02-数据平台设计', link: '/tech-system/industrial-digitalization/02-data-platform' },
        { text: '03-实时系统设计', link: '/tech-system/industrial-digitalization/03-realtime-system' },
        { text: '04-工业可视化（SCADA）', link: '/tech-system/industrial-digitalization/04-scada-visualization' },
        { text: '05-业务抽象设计', link: '/tech-system/industrial-digitalization/05-business-abstract' },
        { text: '06-轻量MES能力实现', link: '/tech-system/industrial-digitalization/06-mes-lite' },
        { text: '07-完整系统设计与实现', link: '/tech-system/industrial-digitalization/07-full-system' }
      ]
    }
  ]
}

/** 技术体系：原二级升为侧栏一级，文章仍为二级 */
function techSystemOverviewSidebar() {
  return [
    {
      text: '技术体系概览',
      collapsed: true,
      items: [{ text: '技术体系概览', link: '/tech-system/' }]
    }
  ]
}

function languageFiveArticles(base: string, label: string, extraItems: { text: string; link: string }[] = []) {
  return {
    text: label,
    collapsed: true,
    items: [
      { text: `${label} 总览`, link: `${base}/` },
      { text: '01 语言基础', link: `${base}/01-basics` },
      { text: '02 核心能力', link: `${base}/02-core` },
      { text: '03 框架与生态', link: `${base}/03-frameworks` },
      { text: '04 工程实践', link: `${base}/04-engineering` },
      { text: '05 常见问题', link: `${base}/05-faq` },
      ...extraItems
    ]
  }
}

function techSystemBackendSidebar() {
  return [
    {
      text: '后端总览',
      collapsed: true,
      items: [
        { text: '后端技术体系', link: '/tech-system/backend/' }
      ]
    },
    languageFiveArticles('/tech-system/backend/java', 'Java'),
    languageFiveArticles('/tech-system/backend/python', 'Python', [
      { text: 'Python 技能速成', link: '/tech-system/python/python-skill' }
    ]),
    languageFiveArticles('/tech-system/backend/nodejs', 'TypeScript'),
    languageFiveArticles('/tech-system/backend/go', 'Go'),
    languageFiveArticles('/tech-system/backend/csharp', 'C#'),
    {
      text: '后端问题',
      collapsed: true,
      items: [
        { text: '问题总览', link: '/tech-system/backend/problems/' },
        { text: '并发', link: '/tech-system/backend/problems/concurrency' },
        { text: '数据库', link: '/tech-system/backend/problems/database' },
        { text: 'Redis', link: '/tech-system/backend/problems/redis' },
        { text: 'MQ', link: '/tech-system/backend/problems/mq' },
        { text: '分布式', link: '/tech-system/backend/problems/distributed' },
        { text: '网络', link: '/tech-system/backend/problems/network' },
        { text: '性能', link: '/tech-system/backend/problems/performance' },
        { text: '安全', link: '/tech-system/backend/problems/security' }
      ]
    }
  ]
}

function techSystemFrontendSidebar() {
  return [
    {
      text: 'Vue 技术栈',
      collapsed: true,
      items: [{ text: 'Vue 技术栈', link: '/tech-system/frontend/vue-stack' }]
    },
    {
      text: 'React 技术栈',
      collapsed: true,
      items: [{ text: 'React 技术栈', link: '/tech-system/frontend/react-stack' }]
    },
    {
      text: '移动端',
      collapsed: true,
      items: [{ text: '移动端', link: '/tech-system/frontend/mobile' }]
    },
    {
      text: '跨端',
      collapsed: true,
      items: [{ text: '跨端', link: '/tech-system/frontend/cross-platform' }]
    },
    {
      text: '工程化',
      collapsed: true,
      items: [{ text: '工程化', link: '/tech-system/frontend/engineering' }]
    }
  ]
}

function techSystemDatabaseSidebar() {
  return [
    {
      text: '数据库体系与选型',
      collapsed: true,
      items: [{ text: '数据库体系与选型', link: '/tech-system/database/database-stack' }]
    },
    {
      text: '关系型数据库',
      collapsed: true,
      items: [{ text: '关系型数据库', link: '/tech-system/database/relational' }]
    },
    {
      text: 'NoSQL',
      collapsed: true,
      items: [{ text: 'NoSQL', link: '/tech-system/database/nosql' }]
    },
    {
      text: '缓存体系',
      collapsed: true,
      items: [{ text: '缓存体系', link: '/tech-system/database/caching' }]
    }
  ]
}

function techSystemIntegrationSidebar() {
  return [
    {
      text: '跨语言调用（选型）',
      collapsed: true,
      items: [{ text: '跨语言调用（选型）', link: '/tech-system/integration/cross-language-interop' }]
    },
    {
      text: 'HTTP：Node.js ↔ Python',
      collapsed: true,
      items: [{ text: 'HTTP：Node.js ↔ Python', link: '/tech-system/integration/http-node-python' }]
    }
  ]
}

function techSystemDevopsSidebar() {
  return [
    {
      text: 'CI/CD 流水线',
      collapsed: true,
      items: [{ text: 'CI/CD 流水线', link: '/tech-system/devops/ci-cd-pipeline' }]
    },
    {
      text: '监控与可观测',
      collapsed: true,
      items: [{ text: '监控与可观测', link: '/tech-system/devops/monitoring-observability' }]
    },
    {
      text: '监控',
      collapsed: true,
      items: [{ text: '监控', link: '/tech-system/devops/monitoring' }]
    },
    {
      text: 'Windows Docker Desktop',
      collapsed: true,
      items: [{ text: 'Windows Docker Desktop', link: '/tech-system/devops/docker-desktop-windows' }]
    }
  ]
}

function englishSpeakingSidebar() {
  return [
    {
      text: '英语口语',
      collapsed: true,
      items: [
        { text: '模块总览', link: '/english-speaking/' },
        { text: '学习路线与使用方式', link: '/english-speaking/' }
      ]
    },
    {
      text: '发音基础',
      collapsed: true,
      items: [
        { text: '48 音标与发音入门', link: '/english-speaking/phonetics-48' }
      ]
    },
    {
      text: '句子模板',
      collapsed: true,
      items: [
        { text: '日常通用口语模板', link: '/english-speaking/templates-daily' },
        { text: '工作沟通口语模板', link: '/english-speaking/templates-work' },
        { text: '会议表达口语模板', link: '/english-speaking/templates-meeting' },
        { text: '电话/视频沟通模板', link: '/english-speaking/templates-call' },
        { text: '社交寒暄口语模板', link: '/english-speaking/templates-social' }
      ]
    }
  ]
}

/**
 * @deprecated 死代码，勿再编辑：本数组与 appsSidebar() 无任何挂载（生效的是 APP_GROUPS_5 + appsSidebar5）。
 * 2026-10-23 审计发现：ModelDesk 侧栏入口曾误加入本数组导致项目页长期不在生效侧栏（W1 问题）。
 * 保留仅为留存历史结构，新条目请一律加到 APP_GROUPS_5。
 */
const APP_CATEGORIES = [
  { key: 'ai', title: 'AI 应用', link: '/apps/ai/', items: [
    ['ModelDesk · 本机多模态 AI 配测台', '/apps/ai/modeldesk'],
    ['知识库问答（RAG）搭建实践', '/apps/ai/rag-knowledge-base'],
    ['智能体工作流设计与落地', '/apps/ai/agent-workflow'],
    ['多模型 API 接入与选型', '/apps/ai/multi-model-api'],
    ['Prompt 编排与生成流程自动化', '/apps/ai/prompt-pipeline'],
    ['AI 编程助手在项目中的落地', '/apps/ai/ai-code-assistant']
  ] },
  { key: 'office', title: '办公自动化', link: '/apps/office/', items: [
    ['飞书机器人开发实践', '/apps/office/feishu-bot'],
    ['审批与待办自动化', '/apps/office/approval-automation'],
    ['企微/钉钉消息推送与 Webhook', '/apps/office/im-webhook'],
    ['日报周报自动生成', '/apps/office/report-auto-generation'],
    ['日程与会议自动化', '/apps/office/schedule-sync']
  ] },
  { key: 'business', title: '业务应用', link: '/apps/business/', items: [
    ['管理后台设计与开发', '/apps/business/admin-system'],
    ['CRM 定制改造实践', '/apps/business/crm-custom'],
    ['ERP 流程与单据设计', '/apps/business/erp-workflow'],
    ['微信小程序开发实践', '/apps/business/mini-program'],
    ['多租户 SaaS 架构', '/apps/business/saas-multi-tenant']
  ] },
  { key: 'terminal', title: '终端应用', link: '/apps/terminal/', items: [
    ['PDA 移动端应用开发', '/apps/terminal/pda-app'],
    ['Electron 桌面客户端实践', '/apps/terminal/electron-desktop'],
    ['C# 上位机界面开发', '/apps/terminal/csharp-hmi'],
    ['Web 与 PDA 数据协同', '/apps/terminal/web-pda-sync'],
    ['离线优先的终端应用设计', '/apps/terminal/offline-first']
  ] },
  { key: 'integration', title: '系统集成', link: '/apps/integration/', items: [
    ['对外 API 设计与开放平台', '/apps/integration/open-api'],
    ['Webhook 接入与可靠投递', '/apps/integration/webhook-design'],
    ['系统间数据同步方案', '/apps/integration/data-sync'],
    ['单点登录与授权打通', '/apps/integration/sso-oauth'],
    ['老系统集成改造', '/apps/integration/legacy-integration']
  ] },
  { key: 'industrial', title: '工业与物联网', link: '/apps/industrial/', items: [
    ['轻量 MES 落地实践', '/apps/industrial/mes-lite'],
    ['PLC 数据采集方案', '/apps/industrial/plc-collect'],
    ['设备监控与告警', '/apps/industrial/device-monitor'],
    ['Modbus/S7 等协议对接实践', '/apps/industrial/protocol-bridge'],
    ['物联网数据平台搭建', '/apps/industrial/iot-platform']
  ] },
  { key: 'ops', title: '部署与运维', link: '/apps/ops/', items: [
    ['Docker 容器化部署实践', '/apps/ops/docker-deploy'],
    ['CI/CD 流水线搭建', '/apps/ops/ci-cd'],
    ['NAS 自托管服务', '/apps/ops/nas-selfhost'],
    ['Nginx 反向代理与 HTTPS', '/apps/ops/nginx-ops'],
    ['服务监控与告警', '/apps/ops/monitor-alert']
  ] }
]

function appsSidebar(category?: string) {
  const groups = APP_CATEGORIES.filter(c => !category || c.key === category)
  return [
    {
      text: '功能开发',
      collapsed: false,
      items: [{ text: '模块总览', link: '/apps/' }]
    },
    ...groups.map(c => ({
      text: c.title,
      collapsed: false,
      items: [
        { text: '分类总览', link: c.link },
        ...c.items.map(([text, link]) => ({ text, link }))
      ]
    }))
  ]
}

/** AI 赋能：四个一级目录 + 各自二级分类。category 为 null 时显示全部（仅用于 /ai/ 总览页），否则只显示本模块 */
const AI_MODULES = [
  { key: 'cognition', title: 'AI 认知成长', link: '/ai/cognition/', items: [
    ['主流 AI 工具全景与选择判断', '/ai/cognition/tools-landscape'],
    ['AI 能做什么、不能做什么', '/ai/cognition/tech-boundary'],
    ['AI 学习路径设计', '/ai/cognition/ai-learning-path'],
    ['费曼式输出与实践复盘', '/ai/cognition/learn-by-doing'],
    ['个人信息管道搭建', '/ai/cognition/knowledge-pipeline'],
    ['信息分析与判断框架', '/ai/cognition/info-analysis']
  ] },
  { key: 'productivity', title: 'AI 生产力', link: '/ai/productivity/', items: [
    ['对话式 AI 的高效用法', '/ai/productivity/chat-workflow'],
    ['按任务选 AI 工具', '/ai/productivity/tool-selection'],
    ['AI 辅助编程工作流', '/ai/productivity/ai-coding-workflow'],
    ['文档、周报与沟通提效', '/ai/productivity/docs-and-report'],
    ['用 AI 写自动化脚本', '/ai/productivity/automation-scripts'],
    ['个人智能体搭建入门', '/ai/productivity/agent-basics'],
    ['用 AI 解决一个真实问题', '/ai/productivity/problem-solving'],
    ['提效复盘：哪些真省了时间', '/ai/productivity/efficiency-review']
  ] },
  { key: 'creation', title: 'AI 创作表达', link: '/ai/creation/', items: [
    ['用 AI 辅助写技术文章', '/ai/creation/ai-writing'],
    ['一稿多发与内容复用', '/ai/creation/article-repurpose'],
    ['AI 生图实践', '/ai/creation/ai-image'],
    ['AI 生视频实践', '/ai/creation/ai-video'],
    ['平台选择与个人定位', '/ai/creation/platform-positioning'],
    ['持续更新与涨粉节奏', '/ai/creation/growth-consistency'],
    ['内容生产流水线搭建', '/ai/creation/content-pipeline'],
    ['内容资产管理', '/ai/creation/asset-management']
  ] },
  { key: 'business', title: 'AI 商业探索', link: '/ai/business/', items: [
    ['AI 内容变现案例拆解', '/ai/business/case-ai-content'],
    ['开发者工具与小产品变现案例拆解', '/ai/business/case-dev-tools'],
    ['从身边挖掘真实需求', '/ai/business/demand-mining'],
    ['机会评估框架', '/ai/business/opportunity-scan'],
    ['副业方向选择与设计', '/ai/business/side-business-design'],
    ['变现路径与定价', '/ai/business/monetization-paths'],
    ['低成本 MVP 验证', '/ai/business/mvp-validation'],
    ['项目复盘模板与方法', '/ai/business/retro-notes']
  ] }
]

function aiSidebar(category?: string) {
  const groups = AI_MODULES.filter(m => !category || m.key === category)
  return [
    {
      text: 'AI 赋能',
      collapsed: false,
      items: [{ text: '模块总览', link: '/ai/' }]
    },
    ...groups.map(m => ({
      text: m.title,
      collapsed: false,
      items: [
        { text: '模块总览', link: m.link },
        ...m.items.map(([text, link]) => ({ text, link }))
      ]
    }))
  ]
}

/* ================= 第 1 天改造：五栏目导航与侧栏 ================= */

/** 功能开发：5 个业务分类（ops 归入技术体系「部署与运维」，文件路径不变） */
const APP_GROUPS_5 = [
  {
    title: '企业业务应用',
    link: '/apps/business/',
    items: [
      ['管理后台设计与开发', '/apps/business/admin-system'],
      ['CRM 定制改造实践', '/apps/business/crm-custom'],
      ['ERP 流程与单据设计', '/apps/business/erp-workflow'],
      ['微信小程序开发实践', '/apps/business/mini-program'],
      ['多租户 SaaS 架构', '/apps/business/saas-multi-tenant'],
      ['对外 API 设计与开放平台', '/apps/integration/open-api'],
      ['Webhook 接入与可靠投递', '/apps/integration/webhook-design'],
      ['系统间数据同步方案', '/apps/integration/data-sync'],
      ['单点登录与授权打通', '/apps/integration/sso-oauth'],
      ['老系统集成改造', '/apps/integration/legacy-integration']
    ]
  },
  {
    title: '工业数字化应用',
    link: '/apps/industrial/',
    items: [
      ['轻量 MES 落地实践', '/apps/industrial/mes-lite'],
      ['PLC 数据采集方案', '/apps/industrial/plc-collect'],
      ['设备监控与告警', '/apps/industrial/device-monitor'],
      ['Modbus/S7 协议对接', '/apps/industrial/protocol-bridge'],
      ['物联网数据平台搭建', '/apps/industrial/iot-platform']
    ]
  },
  {
    title: 'AI 应用',
    link: '/apps/ai/',
    items: [
      ['ModelDesk · 本机多模态 AI 配测台', '/apps/ai/modeldesk'],
      ['知识库问答（RAG）', '/apps/ai/rag-knowledge-base'],
      ['智能体工作流设计与落地', '/apps/ai/agent-workflow'],
      ['多模型 API 接入与选型', '/apps/ai/multi-model-api'],
      ['Prompt 编排与流程自动化', '/apps/ai/prompt-pipeline'],
      ['AI 编程助手在项目落地', '/apps/ai/ai-code-assistant']
    ]
  },
  {
    title: '办公自动化',
    link: '/apps/office/',
    items: [
      ['飞书机器人开发实践', '/apps/office/feishu-bot'],
      ['审批与待办自动化', '/apps/office/approval-automation'],
      ['企微/钉钉消息推送', '/apps/office/im-webhook'],
      ['日报周报自动生成', '/apps/office/report-auto-generation'],
      ['日程与会议自动化', '/apps/office/schedule-sync']
    ]
  },
  {
    title: '个人工具',
    link: '/apps/terminal/',
    items: [
      ['PDA 移动端应用开发', '/apps/terminal/pda-app'],
      ['Electron 桌面客户端', '/apps/terminal/electron-desktop'],
      ['C# 上位机界面开发', '/apps/terminal/csharp-hmi'],
      ['Web 与 PDA 数据协同', '/apps/terminal/web-pda-sync'],
      ['离线优先的终端应用设计', '/apps/terminal/offline-first']
    ]
  },
  {
    title: 'OpenBiz 实战（试水实证）',
    link: '/apps/openbiz/',
    items: [
      ['OpenBiz 试水总览', '/apps/openbiz/'],
      ['工单系统（首个 consumer）', '/apps/openbiz/workorder'],
      ['MES 生产执行（基于 OpenBiz）', '/apps/openbiz/mes'],
      ['项目管理系统（第三个 consumer）', '/apps/openbiz/pms'],
      ['CRM 客户关系管理（第四个 consumer）', '/apps/openbiz/crm'],
      ['ERP 企业资源计划（第五个 consumer）', '/apps/openbiz/erp'],
      ['EAM 企业资产管理（第六个 consumer）', '/apps/openbiz/eam'],
      ['OA 办公自动化（第七个 consumer）', '/apps/openbiz/oa'],
      ['BPM 业务流程管理（第八个 consumer）', '/apps/openbiz/bpm'],
      ['IIoT 工业物联网（第九个 consumer）', '/apps/openbiz/iiot'],
      ['脚手架与坑位', '/apps/openbiz/scaffold']
    ]
  }
    ]

function appsSidebar5() {
  return [
    { text: '功能开发', collapsed: false, items: [{ text: '模块总览', link: '/apps/' }] },
    ...APP_GROUPS_5.map(g => ({
      text: g.title,
      collapsed: false,
      items: [
        { text: '分类总览', link: g.link },
        ...g.items.map(([text, link]) => ({ text, link }))
      ]
    }))
  ]
}

/** 应用实例：5 大模块 × 3 个项目。每个项目均有独立规划页（如实标注状态），
 *  侧栏直接链接到项目页。 */
const INSTANCE_GROUPS = [
  {
    title: '01 企业业务应用',
    link: '/instances/business/',
    projects: [
      { name: 'CRM 客户关系管理系统', link: '/instances/business/crm' },
      { name: 'ERP 企业资源管理系统', link: '/instances/business/erp' },
      { name: '项目管理系统', link: '/instances/business/pms' }
    ]
  },
  {
    title: '02 工业数字化应用',
    link: '/instances/industrial/',
    projects: [
      { name: '设备资产管理系统 EAM', link: '/instances/industrial/eam' },
      { name: '生产执行管理系统 MES', link: '/instances/industrial/mes' },
      { name: '工业物联网监控系统', link: '/instances/industrial/iiot' }
    ]
  },
  {
    title: '03 AI 应用',
    link: '/instances/ai/',
    projects: [
      { name: 'AI 智能助手', link: '/instances/ai/assistant' },
      { name: 'AI 知识库系统', link: '/instances/ai/kb' },
      { name: 'AI 工作流与智能体平台', link: '/instances/ai/agent-platform' }
    ]
  },
  {
    title: '04 办公自动化',
    link: '/instances/office/',
    projects: [
      { name: 'OA 办公自动化系统', link: '/instances/office/oa' },
      { name: 'BPM 业务流程管理系统', link: '/instances/office/bpm' },
      { name: '在线表单与数据收集系统', link: '/instances/office/form' }
    ]
  },
  {
    title: '05 个人工具',
    link: '/instances/tools/',
    projects: [
      { name: '个人任务与时间管理系统', link: '/instances/tools/task-time' },
      { name: '个人知识库与笔记系统', link: '/instances/tools/notes' },
      { name: '开发者工具箱', link: '/instances/tools/devtools' }
    ]
  }
]

function instancesSidebar() {
  return [
    { text: '应用实例', collapsed: false, items: [{ text: '实例总览', link: '/instances/' }] },
    ...INSTANCE_GROUPS.map(g => ({
      text: g.title,
      collapsed: false,
      items: [
        { text: '模块总览', link: g.link },
        ...g.projects.map(p => ({ text: p.name, link: p.link }))
      ]
    }))
  ]
}

/** 技术体系：6 个分类，覆盖 tech-system 与 java/database/redis/framework/mq 等原独立目录 */
function techSidebar5() {
  return [
    {
      text: '技术体系概览',
      collapsed: false,
      items: [
        { text: '技术体系概览', link: '/tech-system/' },
        { text: '后端技术体系', link: '/tech-system/backend/' },
        { text: 'Java + Spring 路线', link: '/tech-system/backend/java-spring' },
        { text: 'TypeScript 后端栈', link: '/tech-system/backend/nodejs-stack' },
        { text: 'Python 后端栈', link: '/tech-system/backend/python-stack' },
        { text: 'Go 后端栈', link: '/tech-system/backend/golang' }
      ]
    },
    {
      text: 'Java 后端',
      collapsed: false,
      items: [
        { text: 'Java 基础总览', link: '/java/base-overview' },
        { text: '面向对象编程', link: '/java/oop' },
        { text: '集合框架', link: '/java/collections' },
        { text: '多线程基础与线程池', link: '/java/thread-basics' },
        { text: '并发编程核心机制', link: '/java/concurrency-core' },
        { text: 'JVM 内存模型', link: '/java/jvm' },
        { text: 'Java 8 新特性', link: '/java/java8-features' },
        { text: '异常处理与 IO 流', link: '/java/exception-io' },
        { text: '反射与注解机制', link: '/java/reflection-annotation' },
        { text: '场景实战：并发调优', link: '/java/concurrency-scenario' },
        { text: '框架总览', link: '/framework/overview' },
        { text: 'Spring 核心', link: '/framework/spring-core' },
        { text: 'Spring MVC', link: '/framework/spring-mvc' },
        { text: 'Bean 生命周期与循环依赖', link: '/framework/bean-lifecycle' },
        { text: '事务传播机制', link: '/framework/transaction-propagation' },
        { text: '事务失效分析', link: '/framework/transaction-scenario' },
        { text: 'Spring 多线程与高并发', link: '/framework/concurrency-spring' },
        { text: '本地缓存 Caffeine/Guava', link: '/framework/local-cache' },
        { text: 'SpringBoot 原理', link: '/framework/springboot-principle' },
        { text: 'SpringCloud 微服务', link: '/framework/springcloud-microservice' },
        { text: 'MyBatis / MyBatis-Plus', link: '/framework/mybatis' },
        { text: 'Flowable 工作流', link: '/framework/flowable-bpmn' },
        { text: 'Spring 常见问题', link: '/framework/spring-faq' },
        { text: 'SpringBoot 常见问题', link: '/framework/springboot-faq' },
        { text: '微服务常见问题', link: '/framework/microservice-faq' },
        { text: 'SpringBoot 概述', link: '/springboot/overview' },
        { text: '自动配置原理', link: '/springboot/auto-configuration' },
        { text: '注解详解', link: '/springboot/annotations' },
        { text: '数据访问基础', link: '/springboot/data-access' },
        { text: 'RESTful API 设计', link: '/springboot/restful-api' },
        { text: 'Spring Security', link: '/springboot/security' },
        { text: '前后台管理系统技术栈', link: '/springboot/tech-stack' },
        { text: '单例模式与线程安全', link: '/design-patterns/singleton' },
        { text: '工厂与策略模式', link: '/design-patterns/factory' },
        { text: '观察者与装饰器模式', link: '/design-patterns/observer-decorator' },
        { text: '代理与模板方法', link: '/design-patterns/proxy-template' },
        { text: '重构烂代码实战', link: '/design-patterns/scenario' },
        { text: '后端问题总览', link: '/tech-system/backend/problems/' },
        { text: '并发', link: '/tech-system/backend/problems/concurrency' },
        { text: '数据库', link: '/tech-system/backend/problems/database' },
        { text: 'Redis', link: '/tech-system/backend/problems/redis' },
        { text: 'MQ', link: '/tech-system/backend/problems/mq' },
        { text: '分布式', link: '/tech-system/backend/problems/distributed' },
        { text: '网络', link: '/tech-system/backend/problems/network' },
        { text: '性能', link: '/tech-system/backend/problems/performance' },
        { text: '安全', link: '/tech-system/backend/problems/security' }
      ]
    },
    {
      text: '前端工程',
      collapsed: true,
      items: [
        { text: 'Vue 技术栈', link: '/tech-system/frontend/vue-stack' },
        { text: 'React 技术栈', link: '/tech-system/frontend/react-stack' },
        { text: '移动端', link: '/tech-system/frontend/mobile' },
        { text: '跨端', link: '/tech-system/frontend/cross-platform' },
        { text: '工程化', link: '/tech-system/frontend/engineering' },
        { text: '站点重构与求职作品集', link: '/tech-system/frontend/site-refactor-job-portfolio' }
      ]
    },
    {
      text: '数据库与中间件',
      collapsed: true,
      items: [
        { text: '数据库面试总览', link: '/database/overview' },
        { text: 'MySQL 基础', link: '/database/mysql-basics' },
        { text: 'SQL 高频题', link: '/database/sql-interview' },
        { text: 'JOIN 与子查询', link: '/database/join-subquery' },
        { text: '常用函数与聚合', link: '/database/sql-functions' },
        { text: 'MySQL 索引原理', link: '/database/mysql-index' },
        { text: '事务与锁机制', link: '/database/mysql-transaction-lock' },
        { text: 'SQL 优化与执行计划', link: '/database/sql-optimization' },
        { text: '连接池调优', link: '/database/connection-pool' },
        { text: '慢查询排查', link: '/database/slow-query-scenario' },
        { text: '主从架构与读写分离', link: '/database/master-slave-arch' },
        { text: '分库分表与全局 ID', link: '/database/sharding' },
        { text: '本地缓存技术', link: '/database/local-cache' },
        { text: 'Redis 总览', link: '/redis/' },
        { text: 'Redis 高频速查', link: '/redis/overview' },
        { text: 'Redis 面试连环追问', link: '/redis/interview-chain' },
        { text: '基础原理', link: '/redis/01-basics' },
        { text: '数据结构', link: '/redis/data-types' },
        { text: '命令与过期策略', link: '/redis/commands-expire' },
        { text: '穿透/击穿/雪崩', link: '/redis/cache-issues' },
        { text: '持久化', link: '/redis/persistence' },
        { text: '主从/Sentinel/Cluster', link: '/redis/cluster-ha' },
        { text: '分布式锁', link: '/redis/distributed-lock' },
        { text: '并发与限流', link: '/redis/07-concurrency' },
        { text: '消息与延迟队列', link: '/redis/transaction-pubsub' },
        { text: 'BigKey/HotKey/淘汰', link: '/redis/09-performance' },
        { text: '实战场景', link: '/redis/10-practice' },
        { text: '缓存架构设计', link: '/redis/cache-scenario' },
        { text: 'MQ 基础与选型', link: '/mq/overview' },
        { text: 'MQ 选型对比', link: '/mq/mq-comparison' },
        { text: '消息丢失与可靠性', link: '/mq/message-loss' },
        { text: '重复消费与幂等', link: '/mq/message-duplicate' },
        { text: '消息顺序性', link: '/mq/message-order' },
        { text: '消息积压与死信', link: '/mq/message-accumulation' },
        { text: '数据库体系与选型', link: '/tech-system/database/database-stack' },
        { text: '关系型数据库', link: '/tech-system/database/relational' },
        { text: 'NoSQL', link: '/tech-system/database/nosql' },
        { text: '缓存体系', link: '/tech-system/database/caching' }
      ]
    },
    {
      text: '系统集成',
      collapsed: true,
      items: [
        { text: '秒杀系统设计', link: '/scenarios/seckill' },
        { text: '单点登录与 OAuth2', link: '/scenarios/sso' },
        { text: '接口幂等性设计', link: '/scenarios/api-idempotent' },
        { text: '大文件分片与断点续传', link: '/scenarios/large-file' },
        { text: '多租户架构与数据隔离', link: '/scenarios/multi-tenant' },
        { text: '对外 API 接口开发', link: '/scenarios/open-api' },
        { text: 'Web 系统架构设计', link: '/scenarios/web-system-design' },
        { text: '跨语言调用（选型）', link: '/tech-system/integration/cross-language-interop' },
        { text: 'HTTP：Node.js ↔ Python', link: '/tech-system/integration/http-node-python' },
        { text: 'Modbus TCP：Node.js ↔ PLC', link: '/tech-system/integration/modbus-tcp-node-plc' },
        { text: 'Modbus TCP：Python ↔ PLC', link: '/tech-system/integration/modbus-tcp-python-plc' },
        { text: 'S7：Node.js ↔ PLC', link: '/tech-system/integration/s7-comm-node-plc' },
        { text: 'S7：Python ↔ PLC', link: '/tech-system/integration/s7-comm-python-plc' },
        { text: 'Web 安全', link: '/tech-system/security/web-security' },
        { text: '安全体系', link: '/tech-system/security/security-stack' }
      ]
    },
    {
      text: '工业与物联网',
      collapsed: true,
      items: [
        { text: '工业数字化实验室', link: '/tech-system/industrial-digitalization/' },
        { text: 'Mini MES 项目目标', link: '/tech-system/industrial-digitalization/mini-mes/' },
        { text: 'Mini MES 架构演进', link: '/tech-system/industrial-digitalization/mini-mes/architecture' },
        { text: 'Mini MES Roadmap', link: '/tech-system/industrial-digitalization/mini-mes/roadmap' },
        { text: 'Mini MES Domain', link: '/tech-system/industrial-digitalization/mini-mes/domain' },
        { text: '判断索引', link: '/tech-system/industrial-digitalization/decisions/' },
        { text: 'V0 为何 Gateway → HTTP', link: '/tech-system/industrial-digitalization/decisions/01-v0-gateway-http' },
        { text: '为何暂不用 MQTT/EMQX', link: '/tech-system/industrial-digitalization/decisions/02-no-mqtt-yet' },
        { text: 'Redis 与 MySQL 怎么分', link: '/tech-system/industrial-digitalization/decisions/03-redis-vs-mysql' },
        { text: '为何暂不用 TDengine', link: '/tech-system/industrial-digitalization/decisions/04-no-tdengine' },
        { text: '为何第一版不做微服务', link: '/tech-system/industrial-digitalization/decisions/05-no-microservice' },
        { text: '实验室索引', link: '/tech-system/industrial-digitalization/labs/' },
        { text: 'Lab 001 · 设备采集最小闭环', link: '/tech-system/industrial-digitalization/labs/lab-001' },
        { text: '常见 PLC 品牌', link: '/tech-system/plc/common-brands' },
        { text: 'S7 与 Python 采集', link: '/tech-system/plc/s7-python-data-collection' },
        { text: 'S7 速查手册', link: '/tech-system/plc/s7-quick-reference' },
        { text: '物联网项目笔记', link: '/tech-system/backend/iot-project' }
      ]
    },
    {
      text: '部署与运维',
      collapsed: true,
      items: [
        { text: 'DevOps 总览', link: '/guide/devops/' },
        { text: 'Docker 实战与面试', link: '/guide/devops/docker-interview' },
        { text: 'Docker Compose', link: '/guide/devops/docker-compose-interview' },
        { text: 'Kubernetes', link: '/guide/devops/k8s-interview' },
        { text: 'CI/CD', link: '/guide/devops/cicd-interview' },
        { text: '线上问题排查', link: '/guide/devops/monitoring-interview' },
        { text: 'CI/CD 流水线', link: '/tech-system/devops/ci-cd-pipeline' },
        { text: '监控与可观测', link: '/tech-system/devops/monitoring-observability' },
        { text: 'Windows Docker Desktop', link: '/tech-system/devops/docker-desktop-windows' },
        { text: 'TCP/IP 与网络传输', link: '/network-linux/tcp-ip' },
        { text: 'HTTP 与 HTTPS', link: '/network-linux/http' },
        { text: 'Session/Cookie/跨域', link: '/network-linux/session-cors' },
        { text: '常用 Linux 命令', link: '/network-linux/linux-cmd' },
        { text: 'Linux 线上排查', link: '/network-linux/linux-troubleshooting' },
        { text: 'Docker 容器化部署', link: '/apps/ops/docker-deploy' },
        { text: 'CI/CD 流水线搭建', link: '/apps/ops/ci-cd' },
        { text: 'NAS 自托管服务', link: '/apps/ops/nas-selfhost' },
        { text: 'Nginx 反向代理与 HTTPS', link: '/apps/ops/nginx-ops' },
        { text: '服务监控与告警', link: '/apps/ops/monitor-alert' },
        { text: '代码质量', link: '/tech-system/practices/code-quality' },
        { text: '开发实践', link: '/tech-system/practices/development-practices' },
        { text: '开发工具', link: '/tech-system/tools/development-tools' },
        { text: '效率工具', link: '/tech-system/tools/productivity-tools' },
        { text: '资源指南', link: '/tech-system/resources/resource-guide' },
        { text: '行业趋势', link: '/tech-system/trends/industry-trends' }
      ]
    }
  ]
}

/** AI 实践：5 个分类（保留 /ai/* 原路径，business 作为案例子组兜底） */
function aiSidebar5() {
  return [
    { text: 'AI 实践', collapsed: false, items: [{ text: '模块总览', link: '/ai/' }] },
    {
      text: 'AI 辅助编程',
      collapsed: false,
      items: [
        { text: 'AI 认知总览', link: '/ai/cognition/' },
        { text: 'AI 辅助编程工作流', link: '/ai/productivity/ai-coding-workflow' },
        { text: '按任务选 AI 工具', link: '/ai/productivity/tool-selection' },
        { text: '对话式 AI 的高效用法', link: '/ai/productivity/chat-workflow' },
        { text: '主流 AI 工具全景', link: '/ai/cognition/tools-landscape' },
        { text: 'AI 学习路径设计', link: '/ai/cognition/ai-learning-path' },
        { text: '费曼式输出与复盘', link: '/ai/cognition/learn-by-doing' }
      ]
    },
    {
      text: 'Agent 与智能体',
      collapsed: true,
      items: [
        { text: '个人智能体搭建入门', link: '/ai/productivity/agent-basics' },
        { text: 'AI 能做什么、不能做什么', link: '/ai/cognition/tech-boundary' }
      ]
    },
    {
      text: '知识库与 RAG',
      collapsed: true,
      items: [
        { text: '个人信息管道搭建', link: '/ai/cognition/knowledge-pipeline' },
        { text: '信息分析与判断框架', link: '/ai/cognition/info-analysis' },
        { text: '文档、周报与沟通提效', link: '/ai/productivity/docs-and-report' }
      ]
    },
    {
      text: 'AI 工作流与自动化',
      collapsed: true,
      items: [
        { text: '用 AI 写自动化脚本', link: '/ai/productivity/automation-scripts' },
        { text: '用 AI 解决一个真实问题', link: '/ai/productivity/problem-solving' },
        { text: '提效复盘', link: '/ai/productivity/efficiency-review' },
        { text: '内容生产流水线搭建', link: '/ai/creation/content-pipeline' }
      ]
    },
    {
      text: 'AI 应用案例',
      collapsed: true,
      items: [
        { text: '创作表达总览', link: '/ai/creation/' },
        { text: 'ModelDesk 架构与本地网关', link: '/ai/creation/modeldesk-architecture' },
        { text: '用 AI 辅助写技术文章', link: '/ai/creation/ai-writing' },
        { text: '一稿多发与内容复用', link: '/ai/creation/article-repurpose' },
        { text: 'AI 生图实践', link: '/ai/creation/ai-image' },
        { text: 'AI 生视频实践', link: '/ai/creation/ai-video' },
        { text: '平台选择与个人定位', link: '/ai/creation/platform-positioning' },
        { text: '持续更新与涨粉节奏', link: '/ai/creation/growth-consistency' },
        { text: '内容资产管理', link: '/ai/creation/asset-management' }
      ]
    },
    {
      text: 'AI 商业探索（案例）',
      collapsed: true,
      items: [
        { text: '商业探索总览', link: '/ai/business/' },
        { text: 'AI 内容变现案例', link: '/ai/business/case-ai-content' },
        { text: '开发者工具变现案例', link: '/ai/business/case-dev-tools' },
        { text: '从身边挖掘真实需求', link: '/ai/business/demand-mining' },
        { text: '机会评估框架', link: '/ai/business/opportunity-scan' },
        { text: '副业方向选择与设计', link: '/ai/business/side-business-design' },
        { text: '变现路径与定价', link: '/ai/business/monetization-paths' },
        { text: '低成本 MVP 验证', link: '/ai/business/mvp-validation' },
        { text: '项目复盘模板', link: '/ai/business/retro-notes' }
      ]
    }
  ]
}

/** 关于我：4 个分类，全部复用现有页面，不伪造内容 */
function aboutSidebar5() {
  return [
    {
      text: '个人介绍',
      collapsed: false,
      items: [
        { text: '个人介绍', link: '/about/' },
        { text: '我的理念', link: '/about/philosophy' }
      ]
    },
    {
      text: '工作经历',
      collapsed: false,
      items: [{ text: '工作与项目经历（详见简历）', link: '/guide/my-resume' }]
    },
    {
      text: '技术能力',
      collapsed: false,
      items: [
        { text: '技术体系总览', link: '/tech-system/' },
        { text: '应用与项目实践', link: '/apps/' }
      ]
    },
    {
      text: '简历与联系方式',
      collapsed: false,
      items: [
        { text: '个人简历', link: '/guide/my-resume' },
        { text: 'GitHub', link: 'https://github.com/gao-shu' }
      ]
    }
  ]
}

/** 其他内容：暂时未归入五栏目的旧文章，保留原路径并通过低调入口可达 */
function moreSidebar() {
  return [
    {
      text: '其他内容',
      collapsed: false,
      items: [
        { text: '内容索引', link: '/more/' },
        { text: '就业与面试', link: '/guide/' },
        { text: '学习与成长', link: '/growth/' },
        { text: '知识沉淀', link: '/knowledge/' },
        { text: '生活记录', link: '/life/' },
        { text: '开发工具', link: '/devtools/' },
        { text: '资源收藏', link: '/resources/' },
        { text: '英语口语', link: '/english-speaking/' },
        { text: '我的开源', link: '/open-source/' }
      ]
    }
  ]
}

export default defineConfig({
  title: "一口三个馍",
  description: "Java 全栈开发 · AI 应用工程 · 个人技术作品集",
  base: '/my-vitepress-site/',
  // 本地安全验证：通过 VITEPRESS_OUT_DIR 把产物输出到独立目录，避免清空 dist。
  // 未设置时使用 VitePress 默认 docs/.vitepress/dist，CI 部署行为不变。
  outDir: process.env.VITEPRESS_OUT_DIR || undefined,
  ignoreDeadLinks: true,
  
  // Head 配置 - 用于设置 favicon 等 meta 标签
  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }]
  ],
  
  themeConfig: {
    // Logo 配置
    logo: '/logo.svg',
    
    // 一级栏目：首页 / 应用实例 / 功能开发 / 技术体系 / AI 实践 / 关于我（应用实例为规划项目矩阵，功能开发为技术实践）
    nav: [
      { text: '首页', link: '/' },
      { text: '应用实例', link: '/instances/', activeMatch: '^\\/instances(\\/|$)' },
      { text: '功能开发', link: '/apps/', activeMatch: '^\\/apps(\\/|$)' },
      {
        text: '技术体系',
        link: '/tech-system/',
        activeMatch:
          '^\\/tech-system(\\/|$)|^\\/(java|database|redis|framework|mq|network-linux|design-patterns|scenarios|springboot)(\\/|$)'
      },
      { text: 'AI 实践', link: '/ai/', activeMatch: '^\\/ai(\\/|$)' },
      { text: '关于我', link: '/about/', activeMatch: '^\\/about(\\/|$)' }
    ],

    sidebar: {
      '/': [
        {
          text: '关于本站',
          collapsed: true,
          items: [
            { text: '网站介绍', link: '/about/' }
          ]
        }
      ],
      '/plan/': [
        {
          text: '建设计划',
          collapsed: false,
          items: [
            { text: '30 天建设计划', link: '/plan/' },
            { text: '内容映射表', link: '/plan/mapping' }
          ]
        }
      ],
      // 功能开发（5 类）；ops 归技术体系，单独挂载以保持侧栏一致
      '/apps/ops/': techSidebar5(),
      '/apps/': appsSidebar5(),
      '/instances/': instancesSidebar(),
      // 技术体系（6 类）：合并原 java/database/redis/framework/mq 等独立目录
      '/tech-system/': techSidebar5(),
      '/java/': techSidebar5(),
      '/database/': techSidebar5(),
      '/redis/': techSidebar5(),
      '/framework/': techSidebar5(),
      '/mq/': techSidebar5(),
      '/network-linux/': techSidebar5(),
      '/design-patterns/': techSidebar5(),
      '/scenarios/': techSidebar5(),
      '/springboot/': techSidebar5(),
      // AI 实践（5 类）
      '/ai/': aiSidebar5(),
      // 关于我（4 类）
      '/about/': aboutSidebar5(),
      // 其他内容：未归入五栏目的旧文章，保留原路径与 URL
      '/more/': moreSidebar(),
      '/guide/': moreSidebar(),
      '/resume/': moreSidebar(),
      '/career/': moreSidebar(),
      '/knowledge/': moreSidebar(),
      '/life/': moreSidebar(),
      '/growth/': moreSidebar(),
      '/devtools/': moreSidebar(),
      '/resources/': moreSidebar(),
      '/english-speaking/': moreSidebar(),
      '/open-source/': moreSidebar(),
      '/practices/': moreSidebar()
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
      { icon: 'github', link: 'https://github.com/gao-shu', ariaLabel: 'GitHub' },
      {
        icon: {
          svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Gitee</title><path fill="#C71D23" d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0zm6.09 5.333c.328 0 .593.266.592.593v1.482a.594.594 0 0 1-.593.592H9.777c-.982 0-1.778.796-1.778 1.778v5.63c0 .327.266.592.593.592h5.63c.982 0 1.778-.796 1.778-1.778v-.296a.593.593 0 0 0-.592-.593h-4.15a.592.592 0 0 1-.592-.592v-1.482a.593.593 0 0 1 .593-.592h6.815c.327 0 .593.265.593.592v3.408a4 4 0 0 1-4 4H5.926a.593.593 0 0 1-.593-.593V9.778a4.444 4.444 0 0 1 4.445-4.444h8.296Z"/></svg>'
        },
        link: 'https://gitee.com/gaoshuteacher',
        ariaLabel: 'Gitee'
      }
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
      pattern: 'https://github.com/gao-shu/my-vitepress-site/edit/main/docs/:path',
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
