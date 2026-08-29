const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ChatAI X Pro</title>
        <style>
            body { font-family: Arial, sans-serif; background: #f4f6f9; margin: 0; padding: 15px; display: flex; flex-direction: column; height: 90vh; box-sizing: border-box; }
            h2 { color: #007bff; text-align: center; margin-bottom: 10px; }
            #chat-box { flex: 1; background: white; border: 1px solid #ddd; border-radius: 8px; padding: 15px; overflow-y: auto; margin-bottom: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 8px; }
            .message { padding: 10px 14px; border-radius: 6px; max-width: 85%; word-break: break-word; line-height: 1.4; }
            .user { background: #007bff; color: white; align-self: flex-end; }
            .ai { background: #e9ecef; color: #333; align-self: flex-start; }
            .input-group { display: flex; gap: 8px; }
            input { flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 15px; outline: none; }
            button { padding: 12px 20px; background: #007bff; color: white; border: none; border-radius: 6px; font-size: 15px; cursor: pointer; font-weight: bold; }
            button:hover { background: #0056b3; }
        </style>
    </head>
    <body>
        <h2>ChatAI X Pro & H'Mông AI</h2>
        <div id="chat-box">
            <div class="message ai">Nyob zoo! Kuv yog ChatAI X Pro. Koj tuaj yeem tham lus H'Mông hoặc hỏi bất cứ điều gì!</div>
        </div>
        <div class="input-group">
            <input type="text" id="userInput" placeholder="Nhập câu hỏi hoặc tiếng H'Mông..." onkeypress="if(event.key === 'Enter') sendMessage()">
            <button onclick="sendMessage()">Gửi</button>
        </div>

        <script>
            async function sendMessage() {
                const input = document.getElementById('userInput');
                const chatBox = document.getElementById('chat-box');
                const text = input.value.trim();
                if (!text) return;

                chatBox.innerHTML += '<div class="message user">' + text + '</div>';
                input.value = '';
                chatBox.scrollTop = chatBox.scrollHeight;

                try {
                    const response = await fetch('/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message: text })
                    });
                    const data = await response.json();
                    chatBox.innerHTML += '<div class="message ai">' + data.reply + '</div>';
                } catch (error) {
                    chatBox.innerHTML += '<div class="message ai" style="color:red;">Lỗi kết nối máy chủ!</div>';
                }
                chatBox.scrollTop = chatBox.scrollHeight;
            }
        </script>
    </body>
    </html>
  `);
});

app.post('/api/chat', (req, res) => {
  const msg = (req.body.message || '').toLowerCase();
  let reply = "ChatAI X Pro đã nhận được câu hỏi: '" + req.body.message + "'";

  if (msg.includes('nyob zoo') || msg.includes('hmông') || msg.includes('h\'mông')) {
    reply = "Nyob zoo! Kuv yog ChatAI X Pro. Ua li cas thiaj pab tau koj hnub no?";
  } else if (msg.includes('chào') || msg.includes('hello')) {
    reply = "Xin chào! Tôi là ChatAI X Pro, tôi có thể hỗ trợ bạn mọi thông tin và trò chuyện bằng tiếng H'Mông.";
  }

  res.json({ reply });
});

app.listen(port, () => {
  console.log('Server is running on port ' + port);
});
