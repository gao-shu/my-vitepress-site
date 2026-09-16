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
        { text: 'Vue 面试基础：高频 8 题', link: '/resume/vue-interview' }
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
    },
    {
      text: 'DevOps',
      collapsed: true,
      items: [
        { text: 'DevOps 总览', link: '/guide/devops/' },
        { text: 'Docker 实战与面试', link: '/guide/devops/docker-interview' },
        { text: 'CI/CD 实战与面试', link: '/guide/devops/cicd-interview' },
        { text: '监控排查实战与面试', link: '/guide/devops/monitoring-interview' }
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

function aiDevSidebar() {
  return [
    {
      text: '基础认知',
      collapsed: true,
      items: [
        { text: '我怎么选模型', link: '/ai/dev/basics/how-i-choose-models' },
        { text: '主流大模型厂商一览', link: '/ai/dev/basics/model-landscape' },
        { text: '主流 Agent 厂商一览', link: '/ai/dev/basics/agent-landscape' },
        { text: 'Prompt 怎么写才像工程', link: '/ai/dev/basics/prompt-engineering' },
        { text: 'RAG / Agent / 微调对照', link: '/ai/dev/basics/rag-agent-finetune' },
        { text: 'AI 应用最小链路', link: '/ai/dev/basics/ai-app-min-loop' },
        { text: 'RAG 是什么', link: '/ai/dev/basics/what-is-rag' }
      ]
    },
    {
      text: 'AI Coding',
      collapsed: true,
      items: [
        { text: '工作流', link: '/ai/dev/coding/cursor-workflow' },
        { text: 'Context & Rules', link: '/ai/dev/coding/context-and-rules' },
        { text: 'Prompt Pattern', link: '/ai/dev/coding/prompt-pattern' },
        { text: 'Code Review', link: '/ai/dev/coding/ai-code-review' },
        {
          text: '实战',
          collapsed: true,
          items: [
            { text: 'Cursor 老项目实战', link: '/ai/ai-programming/cursor-legacy-project' },
            { text: 'Cursor 新项目实战', link: '/ai/ai-programming/cursor-new-project' }
          ]
        }
      ]
    },
    {
      text: 'Agent',
      collapsed: true,
      items: [
        { text: 'Agent 是什么', link: '/ai/dev/agent/agent-overview' },
        { text: 'Tool Calling 最小例子', link: '/ai/dev/agent/tool-calling' },
        { text: 'Agent 不是聊天框', link: '/ai/dev/agent/not-just-chat' }
      ]
    }
  ]
}

function aiAppSidebar() {
  return [
    {
      text: 'AI 应用',
      collapsed: true,
      items: [
        { text: '业务系统里的 AI 切口', link: '/ai/app/enterprise/biz-entry' },
        { text: 'MES 里的 AI 切口', link: '/ai/app/manufacturing/mes-assistant' },
        { text: '内容生产流水线', link: '/ai/app/content/content-pipeline' }
      ]
    },
    {
      text: 'Agent 应用',
      collapsed: true,
      items: [
        { text: '开发', link: '/ai/app/agent/development' },
        { text: '问题', link: '/ai/app/agent/problems' },
        { text: '场景', link: '/ai/app/agent/scenarios' }
      ]
    },
    {
      text: 'AI 产品',
      collapsed: true,
      items: [
        { text: 'AI 产品最小闭环', link: '/ai/app/product/mvp-loop' }
      ]
    }
  ]
}

function aiOpportunitySidebar() {
  return [
    {
      text: '机会',
      collapsed: true,
      items: [
        { text: '岗位需求在变什么', link: '/ai/intel/opportunity/job-signal' },
        { text: '岗位名在变', link: '/ai/intel/opportunity/job-titles' },
        { text: '商业模式观察', link: '/ai/intel/opportunity/model-notes' },
        { text: 'ROI 比模型名更重要', link: '/ai/intel/opportunity/roi-first' },
        { text: '个人可执行机会', link: '/ai/intel/opportunity/personal-bets' },
        { text: '个人可做的小切口', link: '/ai/intel/opportunity/small-cut' }
      ]
    }
  ]
}

function aiIntelSidebar() {
  return [
    {
      text: '情报摘录',
      collapsed: true,
      items: [
        { text: '技术', link: '/ai/intel/technology/' },
        { text: '应用', link: '/ai/intel/application/' },
        { text: '机会', link: '/ai/intel/opportunity/' }
      ]
    }
  ]
}

function aiLegacySidebar() {
  return [
    {
      text: '旧内容 · 待归档',
      collapsed: true,
      items: [
        { text: 'AI 总览（旧入口）', link: '/ai/' },
        { text: '热门软件与开源项目地图', link: '/ai/explore/' },
        { text: 'AI 选型概览', link: '/ai/explore/ai-selection/' },
        { text: 'Java 开发者稳定项目优先版', link: '/ai/explore/java-stable-learning-path' },
        { text: 'AI 漫剧平台深度解析', link: '/ai/explore/ai-drama-platform-analysis' },
        { text: '7 天快速入门', link: '/ai/quickstart' },
        { text: 'LLM 入门与 Prompt 规划', link: '/ai/llm-basics' },
        { text: 'Agent / 工具型 AI 规划', link: '/ai/agent-basics' },
        { text: 'MVP Server / 数据中台规划', link: '/ai/mvp-server' },
        { text: '多模态 & 知识图谱规划', link: '/ai/multimodal-kg' },
        { text: '部署 & MLOps 规划', link: '/ai/mlops-platform' }
      ]
    },
    {
      text: '阶段一：LLM & Prompt',
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
      text: '阶段二：Agent & Tools',
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
      text: '阶段三：MVP Server',
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
  ]
}

export default defineConfig({
  title: "一口三个馍",
  description: "个人技术学习站 · 就业指南 · 技术体系 · AI",
  base: '/my-vitepress-site/',
  ignoreDeadLinks: true,
  
  // Head 配置 - 用于设置 favicon 等 meta 标签
  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }]
  ],
  
  themeConfig: {
    // Logo 配置
    logo: '/logo.svg',
    
    // https://vitepress.dev/reference/default-theme-config
    // 注意：下拉父级不要同时写 link + items，否则子项不显示
    nav: [
      { text: '首页', link: '/' },
      {
        text: '就业指南',
        link: '/guide/',
        activeMatch: '^\\/(guide|java|database|redis|framework|mq|network-linux|design-patterns|scenarios|resume|springboot)(\\/|$)'
      },
      {
        text: '技术体系',
        activeMatch: '^\\/(english-speaking)(\\/|$)|^\\/tech-system(\\/|$)',
        items: [
          { text: '后端', link: '/tech-system/backend/' },
          { text: '前端', link: '/tech-system/frontend/vue-stack' },
          { text: '工业数字化', link: '/tech-system/industrial-digitalization/' },
          { text: '英语口语', link: '/english-speaking/' }
        ]
      },
      {
        text: '开源拆解',
        link: '/open-source/',
        activeMatch: '^\\/open-source(\\/|$)'
      },
      {
        text: 'AI',
        activeMatch: '^\\/ai(\\/|$)',
        items: [
          { text: '技术', link: '/ai/dev/' },
          { text: '应用', link: '/ai/app/' },
          { text: '探索', link: '/ai/intel/opportunity/' }
        ]
      },
      { text: '关于我', link: '/about/' }
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
      '/guide/': guideSidebar(),
      '/guide/devops/': guideSidebar(),
      '/guide/agent/': guideSidebar(),
      '/guide/english-interview/': guideSidebar(),
      '/guide/python/': guideSidebar(),
      '/guide/nodejs/': guideSidebar(),
      '/java/': guideSidebar(),
      '/database/': guideSidebar(),
      '/redis/': guideSidebar(),
      '/framework/': guideSidebar(),
      '/mq/': guideSidebar(),
      '/network-linux/': guideSidebar(),
      '/design-patterns/': guideSidebar(),
      '/scenarios/': guideSidebar(),
      '/resume/': guideSidebar(),
      '/english-speaking/': englishSpeakingSidebar(),
      // 技术体系：更具体的路径写在前面，避免被 /tech-system/ 笼统匹配
      '/tech-system/industrial-digitalization/': industrialSidebar(),
      '/tech-system/plc/': industrialSidebar(),
      '/tech-system/integration/': industrialSidebar(),
      '/tech-system/backend/iot-project': industrialSidebar(),
      '/tech-system/backend/': techSystemBackendSidebar(),
      '/tech-system/python/': techSystemBackendSidebar(),
      '/tech-system/frontend/': techSystemFrontendSidebar(),
      '/tech-system/database/': techSystemDatabaseSidebar(),
      '/tech-system/devops/': guideSidebar(),
      '/tech-system/': techSystemOverviewSidebar(),
      // AI：更具体路径在前，避免被 /ai/ 笼统匹配
      '/ai/dev/': aiDevSidebar(),
      '/ai/ai-programming/': aiDevSidebar(),
      '/ai/app/': aiAppSidebar(),
      '/ai/intel/opportunity/': aiOpportunitySidebar(),
      '/ai/intel/': aiIntelSidebar(),
      '/ai/': aiLegacySidebar(),
      '/open-source/': [
        {
          text: '我的开源',
          collapsed: true,
          items: [
            { text: 'OpenBiz', link: '/open-source/mine/openbiz' },
            { text: '本地漫创（local-creator）', link: '/open-source/mine/local-creator' },
            { text: 'ModelDesk', link: '/open-source/mine/modeldesk' }
          ]
        }
      ],
      '/about/': [
        {
          text: '关于我',
          collapsed: true,
          items: [
            { text: '个人介绍', link: '/about/' }
          ]
        }
      ],
      '/resources/': resourceAndDevtoolsSidebar(),
      '/devtools/': resourceAndDevtoolsSidebar(),
      '/springboot/': [
        {
          text: 'Spring Boot 概述',
          collapsed: true,
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
