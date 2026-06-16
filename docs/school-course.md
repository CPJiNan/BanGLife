# 学校与课程系统

## 一、概述

在角色创建阶段选择学校（花咲川 / 羽丘 / 月之森），绑定角色。在校时，工作日（周一～五）的特定时间窗口内可点击上课行动，获得属性加成。

## 二、涉及文件

| 文件 | 改动 |
|------|------|
| `packages/mod-types/src/index.ts` | `PlayerState` 新增 `school: string` |
| `src/stores/player.ts` | 初始状态新增 `school: 'school.haneoka'` |
| `src/core/constants.ts` | `ACTION_TAG_LABELS` 新增 `school: '课程'` |
| `src/content/core/school.ts` | **新建** — 课程 actions/passages |
| `src/content/core/index.ts` | 导入注册 schoolActions/schoolPassages；新增 `wisdom` 属性 |
| `src/ui/views/HomeView.vue` | 开始 tab 增加学校选择三选一，默认羽丘 |
| `src/ui/views/GameView.vue` | 面板容器 `overflow-hidden` → `overflow-y-auto`（修复滚动） |
| `docs/school-course.md` | 本文件 |

## 三、学校选择

- 时机：HomeView 开始 tab，角色创建阶段
- 选项：花咲川 / 羽丘 / 月之森（三按钮卡片）
- 存储：`player.state.school`
- 默认：羽丘女子学园
- 绑定角色，开档后不可更换

## 四、课程表

### 时间安排（0=周日 1=周一 ... 5=周五 6=周六）

| 节次 | 类型 | 行动可见窗口 | duration | action id |
|------|------|-------------|----------|-----------|
| 1 | 学科课 | 8:30–8:50 | 50 min | `school.lesson.1` |
| 2 | 学科课 | 9:30–9:50 | 50 min | `school.lesson.2` |
| 3 | 学科课 | 13:00–13:20 | 50 min | `school.lesson.3` |
| 4 | 轮换课 | 14:00–14:20 | 50 min | `school.lesson.4_music` 或 `school.lesson.4_sports` |

第 4 节轮换：周一/三/五 → 音乐课，周二/四 → 体育课。周末无课。

### 每日完成标记

通过 `flags['school:lesson:<period>']` 存储当天 `day` 编号，`available` 中比较 `!== ctx.time.day` 判断当日是否已完成，无需显式重置。

## 五、属性加成

| 课型 | effects |
|------|---------|
| 学科课 | 智慧 +3，压力 -5 |
| 体育课 | 疲劳 +10，压力 -10 |
| 音乐课 | 随机一项乐器技能 +3（vocal/keyboard/guitar/bass/drum） |

## 六、新增属性

`wisdom`（智慧）— category: mental, color: #66DDFF, min: 0, max: 100

## 七、passage 文案

| passage id | 文案 |
|------------|------|
| `school.lesson.academic` | 你在教室里认真听讲，完成了本节课的学习内容。智慧 +3，压力 -5。 |
| `school.lesson.sports` | 你在体育馆挥洒汗水，完成了体能训练。疲劳 +10，压力 -10。 |
| `school.lesson.music` | 你在音乐教室里练习乐器，乐感得到了提升。乐器技能 +3。 |

## 八、实现细节

- 所有课程 action 的 `locationId` 为三所学校数组 `['school.hanasakigawa', 'school.haneoka', 'school.tsukinomori']`
- 图标使用 `school.svg`
- 标签 `tag: 'school'` 显示为「课程」
- weekday 映射：`0=周日 1=周一 2=周二 3=周三 4=周四 5=周五 6=周六`
- 当天标记用 `flags['school:lesson:<period>'] = ctx.time.day`，无需跨天清理

## 九、附带修复

- GameView 面板容器 `overflow-hidden` → `overflow-y-auto`，修复属性面板等所有面板无法滚动的问题（desktop + mobile）
