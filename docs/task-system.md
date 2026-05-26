# 任务系统实现记录

> 经代码审查后已修复：complete() 竞态条件、cancel() 未校验 cancelable、Mod 卸载孤儿状态、面板打开时 target 不响应式更新、claimReward 未 await、entries 类型谓词缺失等问题。详见后文"审查修复记录"。

## 变更清单（12 个文件 + 1 个图标）

| # | 文件 | 操作 | 内容 |
|---|------|------|------|
| 1 | `packages/mod-types/src/index.ts` | 修改 | Effect 加 `'task'`；新增 `Target`/`Task` 类型；ModAPI 加 `registerTask` |
| 2 | `src/core/registry.ts` | 修改 | registries 新增 `tasks` |
| 3 | `src/core/types.ts` | 修改 | 重导出 `Target`、`Task` |
| 4 | `src/core/effects.ts` | 修改 | 新增 `case 'task'` → `useTasksStore().activate(key)` |
| 5 | `src/mod/api.ts` | 修改 | 实现 `registerTask`（reg + undo 回滚） |
| 6 | `src/stores/tasks.ts` | **新建** | 任务状态管理 store（activate / checkAll / complete / cancel / checkExpirations / serialize / deserialize） |
| 7 | `src/core/scheduler.ts` | 修改 | `time:tick` 时调用 `checkExpirations()` |
| 8 | `src/stores/save-types.ts` | 修改 | `SaveFile.state` 新增 `taskStates` |
| 9 | `src/stores/save-storage.ts` | 修改 | `buildSaveFile` 新增 `taskStates` 参数 |
| 10 | `src/stores/save.ts` | 修改 | 存档时写入、读档时恢复 taskStates |
| 11 | `src/ui/views/GameView.vue` | 修改 | 侧边栏插入「任务」按钮（社交后、背包前）+ 红点角标 |
| 12 | `src/ui/panels/TaskPanel.vue` | **新建** | 任务面板 UI（target 列表 + 领取/放弃按钮 + 过期倒计时） |
| — | `public/icons/task.svg` | **新建** | 任务图标 |

---

## 循环依赖处理

`effects.ts ↔ tasks.ts` 和 `player.ts → tasks.ts → mod/api.ts → player.ts` 两条循环通过以下方式断开：

- `tasks.ts` → `effects.ts`：`complete()` 使用 `await import('@/core/effects')` 动态加载
- `scheduler.ts` → `tasks.ts`：过期检查放在 `triggerEvents('time:tick')` 中，避免 `player.ts → tasks.ts` 引入新循环

---

## 数据模型

### Task

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 任务 ID |
| `title` | `string` | 任务标题，在任务面板中显示 |
| `description` | `string` | 任务描述 |
| `targets` | `Target[]` | 任务目标列表 |
| `rewards` | `Effect[]`（可选） | 完成时执行的效果 |
| `cancelable` | `boolean`（可选） | 是否可主动放弃，默认 `false` |
| `expire` | `number`（可选） | 过期时间（相对分钟数），`-1` 或 `undefined` 为永久 |
| `onComplete` | `(ctx) => void`（可选） | 完成回调 |
| `onCancel` | `(ctx) => void`（可选） | 放弃回调 |
| `onExpire` | `(ctx) => void`（可选） | 过期回调，未设则走 `onCancel` |

### Target

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | `string` | 目标标题 |
| `description` | `string` | 目标描述 |
| `onCheck` | `(ctx) => boolean` | 检查函数，返回 `true` 表示完成 |

### Effect 扩展

```ts
{ type: 'task', key: 'taskId' }  // 激活指定任务
```

---

## 任务生命周期

```
registerTask → 存入 Registry（未激活）
     ↓ effect { type: 'task', key: 'taskId' }
激活(active) → 记录 TaskState { startTime, progress[], status: 'active' }
     ↓ 面板打开 → 对未完成 target 调 onCheck(ctx) → true 则勾选
全部 target 完成 → 面板显示「领取奖励」按钮 + 红点
     ↓ 玩家点击领取
status='completed'（防二次领取） → applyEffects(rewards) → onComplete(ctx) → 移除状态
     ↓ task 再次触发（重新激活，progress 重置）
```

取消/过期路径：
```
cancelable=true 时：玩家点「放弃」 → status='cancelled' → onCancel(ctx) → 移除
expire > 0 时：time:tick 检查 currentTime >= startTime + expire
  → status='expired' → onExpire(ctx) || onCancel(ctx) → 移除
```

> 提前标记 status 终端值是为了防止 async `complete()` 中的竞态条件——两次快速点击只会执行一次 rewards。

---

## Mod 使用示例

```js
onLoad(api) {
  api.registerTask({
    id: 'my.quest',
    title: '新手试炼',
    description: '完成乐队首次练习',
    targets: [
      {
        title: '练习吉他 3 次',
        description: '使用吉他练习行动',
        onCheck: (ctx) => (ctx.player.flags['practice:guitar'] || 0) >= 3,
      },
      {
        title: '持有 2000 円',
        description: '攒下一些钱',
        onCheck: (ctx) => ctx.player.money >= 2000,
      },
    ],
    rewards: [
      { type: 'money', value: 5000 },
      { type: 'stat', key: 'guitar', value: 10 },
    ],
    cancelable: true,
    expire: 7 * 24 * 60, // 7 天后过期
    onComplete: (ctx) => { ctx.player.flags['quest:my_quest_done'] = true },
  })
}
```

触发任务：

```js
effects: [
  { type: 'task', key: 'my.quest' },
]
```

---

## 审查修复记录

以下问题在代码审查后发现并已修复：

### Critical
| # | 问题 | 修复 |
|---|------|------|
| 1 | `complete()` 是 async，两次快速点击可领取双倍奖励 | 在 `await` 前设 `state.status = 'completed'`，guard 检查拦截第二次 |
| 2 | `complete()` 与 `cancel()`/`checkExpirations()` 可交错执行 | 同 #1，提前标记 status 阻止并发进入 |

### Important
| # | 问题 | 修复 |
|---|------|------|
| 3 | `cancel()` 未检查 `cancelable` 标志 | 增加 `if (task.cancelable !== true) return` |
| 4 | Mod 卸载后 tasks store 残留孤立状态 | `checkExpirations` 清理已无定义的任务；`serialize` 跳过孤立状态 |
| 5 | 面板打开时 target 进度不响应游戏变化 | 新增 `watch(player.time, tasksStore.checkAll)` |
| 6 | `claimReward` 未 await，异常被静默吞掉 | 改为 `async` + `try/catch` |

### Suggestions
| # | 问题 | 修复 |
|---|------|------|
| 8 | `entries` computed 缺少类型谓词，模板大量 `!` | 改为 `filter((e): e is {id; task: Task; state: TaskState} => ...)` |
| 7 | status 终端值从未被使用 | `'completed'`/`'cancelled'`/`'expired'` 现在在 delete 之前标记 |
