# 网页金句导出插件 (Web Quote Exporter)

一个简单的 Chrome 浏览器扩展，可以将网页中的文字内容转换为精美的图片卡片。

## 功能特性

### 基础功能 (v1.0)
1. 文字输入
   - 用户可以通过插件的输入框手动粘贴网页中选中的文字内容
   - 支持多行文本输入，自动换行
   - 最大字符限制: 200字
   - 实时字数统计显示
   - 支持文本格式清理（自动删除多余空格和换行）

2. 图片生成
   - 默认生成竖版图片 (宽度固定为 800px，高度自适应文字内容)
   - 最小高度: 400px
   - 最大高度: 1200px
   - 支持以下预设样式:
     * 简约白 (白底黑字，#FFFFFF 底色，#333333 文字)
     * 暗夜黑 (黑底白字，#222222 底色，#FFFFFF 文字)
     * 淡雅灰 (浅灰底深灰字，#F5F5F5 底色，#666666 文字)

3. 基础样式设置
   - 字体大小调节 (默认24px，范围12px-48px)
   - 文字对齐方式 (左对齐/居中/右对齐)
   - 图片内边距调节 (默认40px，范围20px-80px)
   - 字体选项：
     * 系统默认字体
     * 思源黑体
     * 思源宋体

4. 导出功能
   - 一键保存为PNG格式图片
   - 自动生成默认文件名(前20个字符)
   - 图片质量：96dpi
   - 支持预览功能

### 使用流程
1. 在网页中选中并复制想要保存的文字内容
2. 点击 Chrome 工具栏中的插件图标，打开插件面板
3. 将文字粘贴到插件的输入框中（支持 Ctrl+V / Command+V）
4. 选择喜欢的样式预设
5. 调整文字样式（可选）：
   - 调整字体大小
   - 选择对齐方式
   - 调整内边距
   - 选择字体
6. 在预览区查看效果
7. 点击"生成图片"按钮
8. 确认效果后点击"保存"按钮下载图片

## 后续规划
[保持原有内容不变]

## 技术实现
- 使用 Manifest V3 开发
- 使用 Canvas API 进行图片生成
- 使用 Chrome Storage API 存储用户配置
- 响应式设计，适配不同分辨率
- 使用 Web Font Loader 加载自定义字体
- 使用 HTML5 Clipboard API 处理复制粘贴操作

## 注意事项
- 插件仅支持文字内容转换为图片
- 建议输入文字不超过200字，以确保最佳显示效果
- 生成的图片分辨率固定为800px宽度
- 插件会自动清理粘贴文本中的特殊格式
- 某些网页可能会限制复制功能，此时需要手动输入文字
- 建议使用 Chrome 88 或更高版本运行此插件