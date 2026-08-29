const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Giao diện chat trực quan trên web
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ChatAI X Pro</title>
        <style>
            body { font-family: Arial, sans-serif; background: #f4f6f9; margin: 0; padding: 20px; display: flex; flex-direction: column; height: 90vh; }
            h2 { color: #333; text-align: center; }
            #chat-box { flex: 1; background: white; border: 1px solid #ddd; border-radius: 8px; padding: 15px; overflow-y: auto; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
            .message { margin-bottom: 10px; padding: 10px; border-radius: 6px; max-width: 80%; }
            .user { background: #007bff; color: white; margin-left: auto; text-align: right; }
            .ai { background: #e9ecef; color: #333; }
            .input-group { display: flex; gap: 10px; }
            input { flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px; }
            button { padding: 12px 20px; background: #007bff; color: white; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; }
            button:hover { background: #0056b3; }
        </style>
    </head>
    <body>
        <h2>ChatAI X Pro - AI Chat & H'Mông</h2>
        <div id="chat-box">
            <div class="message ai">Xin chào! Tôi là ChatAI X Pro. Tôi có thể giúp gì cho bạn hôm nay?</div>
        </div>
        <div class="input-group">
            <input type="text" id="userInput" placeholder="Nhập câu hỏi hoặc tiếng H'Mông..." onkeypress="if(event.key === 'Enter') sendMessage()">
            <button onclick="sendMessage()">Gửi</button>
        </div>

        <script>
            async function sendMessage() {
                const inputField = document.getElementById('userInput');
                const chatBox = document.getElementById('chat-box');
                const text = inputField.value.trim();
                if (!text) return;

                // Hiển thị tin nhắn người dùng
                chatBox.innerHTML += \`<div class="message user">\${text}</div>\`;
                inputField.value = '';
                chatBox.scrollTop = chatBox.scrollHeight;

                // Gửi request lên server
                try {
                    const response = await fetch('/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message: text })
                    });
                    const data = await response.json();
                    chatBox.innerHTML += \`<div class="message ai">\${data.reply}</div>\`;
                } catch (error) {
                    chatBox.innerHTML += \`<div class="message ai" style="color:red;">Lỗi kết nối máy chủ!</div>\`;
                }
                chatBox.scrollTop = chatBox.scrollHeight;
            }
        </script>
    </body>
    </html>
  `);
});

// Xử lý logic chat API tạm thời
app.post('/api/chat', (req, res) => {
  const userMessage = req.body.message || '';
  let reply = "Tôi đã nhận được câu hỏi của bạn: '" + userMessage + "'. (Hệ thống AI cốt lõi sẽ kết nối API chính thức ở các bước sau).";
  
  if (userMessage.toLowerCase().includes('h\'mông') || userMessage.toLowerCase().includes('hmong')) {
    reply = "Nyob zoo! Kuv yog ChatAI X Pro. Koj puas xav tham txog dab tsi?";
  }

  res.json({ reply });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
