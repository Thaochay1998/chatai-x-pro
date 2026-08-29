const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Giao diện chat trực quan
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Chat AI Pro</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-100 h-screen flex flex-col justify-between">
        <header class="bg-blue-600 text-white p-4 text-center font-bold text-lg shadow">
            Chat AI Pro (Gemini 3.6 Flash)
        </header>
        <div id="chat-container" class="flex-1 overflow-y-auto p-4 space-y-4 max-w-2xl w-full mx-auto">
            <div class="flex justify-start">
                <div class="bg-white p-3 rounded-2xl shadow max-w-[80%] text-gray-800">
                    Xin chào! Tôi đã sẵn sàng, bạn có thể nhắn tin hoặc trò chuyện thoải mái nhé!
                </div>
            </div>
        </div>
        <div class="bg-white border-t p-4">
            <form id="chat-form" class="max-w-2xl mx-auto flex gap-2">
                <input type="text" id="user-input" placeholder="Nhập tin nhắn..." class="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" required>
                <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">Gửi</button>
            </form>
        </div>
        <script>
            const form = document.getElementById('chat-form');
            const input = document.getElementById('user-input');
            const container = document.getElementById('chat-container');

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const text = input.value.trim();
                if (!text) return;

                container.innerHTML += \`<div class="flex justify-end"><div class="bg-blue-600 text-white p-3 rounded-2xl shadow max-w-[80%]">\${text}</div></div>\`;
                input.value = '';
                container.scrollTop = container.scrollHeight;

                try {
                    const res = await fetch('/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message: text })
                    });
                    const data = await res.json();
                    const reply = data.reply || data.error || 'Đã có lỗi xảy ra.';
                    container.innerHTML += \`<div class="flex justify-start"><div class="bg-white p-3 rounded-2xl shadow max-w-[80%] text-gray-800">\${reply}</div></div>\`;
                } catch (err) {
                    container.innerHTML += \`<div class="flex justify-start"><div class="bg-red-100 text-red-700 p-3 rounded-2xl shadow max-w-[80%]">Lỗi kết nối server.</div></div>\`;
                }
                container.scrollTop = container.scrollHeight;
            });
        </script>
    </body>
    </html>
  `);
});

// Xử lý API chat
app.post('/chat', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({ error: 'Lỗi: Chưa cấu hình GEMINI_API_KEY trên Render!' });
    }

    const { message } = req.body;
    if (!message) {
      return res.json({ error: 'Vui lòng nhập nội dung tin nhắn.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error(error);
    res.json({ error: 'Lỗi API Gemini: ' + error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
