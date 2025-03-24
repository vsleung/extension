const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors({
  origin: '*',
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// 添加根路由处理
app.get('/', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.post('/api/summarize', async (req, res) => {
  try {
    const { text } = req.body;
    console.log('收到请求，文本内容:', text);
    
    const response = await axios({
      method: 'post',
      url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 06c02369-517d-4c0a-9772-53f18a1906e5'
      },
      data: {
        model: "deepseek-r1-250120",
        messages: [
          {
            role: "system",
            content: "使用一个金句总结全文最核心的内容"
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.6,
        stream: false,
        max_tokens: 1000
      },
      timeout: 60000,
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      }
    });

    if (response.status !== 200) {
      throw new Error(`API请求失败: ${response.status} ${JSON.stringify(response.data)}`);
    }

    if (!response.data || !response.data.choices || !response.data.choices[0]) {
      throw new Error('API返回数据格式错误');
    }

    const summary = response.data.choices[0].message.content;
    console.log('生成的总结:', summary);
    res.json({
      success: true,
      summary: summary
    });

  } catch (error) {
    console.error('错误详情:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    res.status(500).json({ 
      success: false, 
      error: '总结生成失败：' + (error.response?.data?.error || error.message)
    });
  }
});

const port = 3001;  // 使用新端口
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});