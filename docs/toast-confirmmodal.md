# Toast 美化 & ConfirmModal

## 一、Toast 美化

### 改动文件

`src/ui/components/Toast.vue`

### 改动内容

| 项目 | 修改前 | 修改后 |
|------|--------|--------|
| 图标 | 文本字符 `✓ ✕ ! ℹ` | Tabler SVG 轮廓图标 (circle-check / circle-x / alert-triangle / info-circle) |
| 边框 | 无 | 左侧 4px 彩色条（绿/红/黄/蓝） |
| 背景 | 纯白 | 白色 95% + backdrop-blur 毛玻璃 |
| 阴影 | `shadow-lg` | `shadow-lg` + `ring-1 ring-black/5` |
| 进度条 | 无 | 底部细线随时间从左缩到右 |
| 关闭按钮 | 方形文字 `✕` | 圆形按钮，hover 变红 |

### 使用方式

```ts
ui.showToast('消息内容', 'success' | 'error' | 'warning' | 'info', durationMs)
```

## 二、ConfirmModal

### 新增文件

| 文件 | 说明 |
|------|------|
| `src/ui/components/ConfirmModal.vue` | 确认模态框组件 |
| `src/stores/ui.ts` | 新增 `ConfirmState` 类型、`confirm` 状态、`showConfirm`/`dismissConfirm` 方法 |
| `src/App.vue` | 注册 `<ConfirmModal/>` |

### 组件特性

- 居中弹出，半透明遮罩背景，点击遮罩取消
- 白色圆角卡片，标题 + 描述 + 双按钮
- 支持 `variant: 'default'`（粉紫渐变确认按钮）和 `variant: 'danger'`（红色确认按钮）
- 过渡动画：fade + scale

### 使用方式

```ts
ui.showConfirm({
  title: '确认放弃任务？',
  description: '放弃后已打工时长将被清空。',
  variant: 'default',        // 或 'danger'
  onConfirm: () => { /* 执行确认操作 */ },
  onCancel: () => { /* 可选回调 */ },
})
```
