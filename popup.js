document.addEventListener('DOMContentLoaded', function() {
  // 获取DOM元素
  const quoteText = document.getElementById('quote-text');
  const charCounter = document.getElementById('char-counter');
  const presetStyle = document.getElementById('preset-style');
  const fontSize = document.getElementById('font-size');
  const fontSizeValue = document.getElementById('font-size-value');
  const padding = document.getElementById('padding');
  const paddingValue = document.getElementById('padding-value');
  const alignLeft = document.getElementById('align-left');
  const alignCenter = document.getElementById('align-center');
  const alignRight = document.getElementById('align-right');
  const previewContent = document.getElementById('preview-content');
  const generateBtn = document.getElementById('generate-btn');
  const saveBtn = document.getElementById('save-btn');
  const resultCanvas = document.getElementById('result-canvas');
  const resultImage = document.getElementById('result-image');
  const summarizeBtn = document.getElementById('summarize-btn');
  
  // 添加总结功能
  summarizeBtn.addEventListener('click', async function() {
    const text = quoteText.value.trim();
    if (!text) {
      alert('请输入需要总结的文字内容');
      return;
    }
    
    try {
      summarizeBtn.disabled = true;
      summarizeBtn.textContent = '正在总结...';
      
      const response = await fetch('http://localhost:3001/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ text }),
        timeout: 60000
      }).catch(error => {
        throw new Error('无法连接到服务器，请确保本地服务已启动');
      });
      
      if (!response.ok) {
        throw new Error(`服务器响应错误: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.summary) {
        quoteText.value = data.summary;
        charCounter.textContent = data.summary.length;
        updatePreview();
      } else {
        throw new Error(data.error || '总结失败');
      }
      
    } catch (error) {
      alert(error.message || '总结失败，请稍后重试');
    } finally {
      summarizeBtn.disabled = false;
      summarizeBtn.textContent = 'DeepSeek R1总结';
    }
  });
  
  // 预设样式配置
  const presets = {
    'simple-white': {
      background: '#FFFFFF',
      color: '#333333'
    },
    'dark-night': {
      background: '#222222',
      color: '#FFFFFF'
    },
    'light-gray': {
      background: '#F5F5F5',
      color: '#666666'
    }
  };

  // 当前样式设置
  let currentStyle = {
    preset: 'simple-white',
    fontSize: 24,
    padding: 40,
    align: 'left'
  };

  // 更新字符计数
  quoteText.addEventListener('input', function() {
    charCounter.textContent = this.value.length;
    updatePreview();
  });

  // 更新字体大小
  fontSize.addEventListener('input', function() {
    currentStyle.fontSize = this.value;
    fontSizeValue.textContent = `${this.value}px`;
    updatePreview();
  });

  // 更新内边距
  padding.addEventListener('input', function() {
    currentStyle.padding = this.value;
    paddingValue.textContent = `${this.value}px`;
    updatePreview();
  });

  // 更新预设样式
  presetStyle.addEventListener('change', function() {
    currentStyle.preset = this.value;
    updatePreview();
  });

  // 对齐方式按钮点击事件
  alignLeft.addEventListener('click', () => setAlignment('left'));
  alignCenter.addEventListener('click', () => setAlignment('center'));
  alignRight.addEventListener('click', () => setAlignment('right'));

  // 设置对齐方式
  function setAlignment(align) {
    currentStyle.align = align;
    alignLeft.classList.remove('active');
    alignCenter.classList.remove('active');
    alignRight.classList.remove('active');

    if (align === 'left') alignLeft.classList.add('active');
    if (align === 'center') alignCenter.classList.add('active');
    if (align === 'right') alignRight.classList.add('active');

    updatePreview();
  }

  // 更新预览
  function updatePreview() {
    const text = quoteText.value || '预览文本';
    const preset = presets[currentStyle.preset];
    
    previewContent.style.fontSize = `${currentStyle.fontSize}px`;
    previewContent.style.padding = `${currentStyle.padding}px`;
    previewContent.style.textAlign = currentStyle.align;
    previewContent.style.backgroundColor = preset.background;
    previewContent.style.color = preset.color;
    previewContent.style.borderRadius = '8px';  // 添加圆角
    previewContent.style.lineHeight = '1.5';    // 添加行高
    previewContent.textContent = text;
  }

  // 生成图片
  generateBtn.addEventListener('click', function() {
    const text = quoteText.value.trim();
    if (!text) {
      alert('请输入文字内容');
      return;
    }

    const preset = presets[currentStyle.preset];
    const padding = parseInt(currentStyle.padding);
    const fontSize = parseInt(currentStyle.fontSize);

    // 设置画布尺寸
    resultCanvas.width = 800;
    // 根据预览内容计算实际高度
    const textHeight = previewContent.offsetHeight;
    resultCanvas.height = textHeight * 2; // 因为预览区域宽度是400px，实际生成800px，所以高度需要翻倍

    const ctx = resultCanvas.getContext('2d');

    // 绘制背景
    ctx.fillStyle = preset.background;
    ctx.fillRect(0, 0, resultCanvas.width, resultCanvas.height);

    // 设置文本样式
    ctx.fillStyle = preset.color;
    ctx.font = `${fontSize * 2}px "PingFang SC", "Microsoft YaHei", sans-serif`; // 字体大小翻倍
    ctx.textBaseline = 'top';
    ctx.lineHeight = fontSize * 2 * 1.5; // 设置行高

    // 设置文本对齐
    let x = padding * 2; // 内边距翻倍
    if (currentStyle.align === 'center') {
      ctx.textAlign = 'center';
      x = resultCanvas.width / 2;
    } else if (currentStyle.align === 'right') {
      ctx.textAlign = 'right';
      x = resultCanvas.width - padding * 2;
    }

    // 绘制文本（使用换行处理）
    const maxWidth = resultCanvas.width - padding * 4;
    const lines = getTextLines(ctx, text, maxWidth);
    let y = padding * 2;

    lines.forEach(line => {
      ctx.fillText(line, x, y);
      y += fontSize * 2 * 1.5; // 行高为字体大小的1.5倍
    });

    // 显示生成的图片
    resultImage.src = resultCanvas.toDataURL('image/png');
    resultImage.style.display = 'block';
    saveBtn.disabled = false;
  });

  // 添加辅助函数：处理文本换行
  function getTextLines(ctx, text, maxWidth) {
    const words = text.split('');
    const lines = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine + words[i];
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && i > 0) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  // 保存图片
  saveBtn.addEventListener('click', function() {
    const link = document.createElement('a');
    link.download = `金句-${quoteText.value.substring(0, 20)}.png`;
    link.href = resultCanvas.toDataURL('image/png');
    link.click();
  });

  // 初始化预览
  updatePreview();
});