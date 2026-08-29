const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ChatAI X Pro</title>
        <style>
            :root { --primary: #007bff; --bg: #f4f6f9; --card: #ffffff; --text: #333; }
            body { font-family: Arial, sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: 0; display: flex; height: 100vh; overflow: hidden; }
            sidebar { width: 220px; background: #1e293b; color: white; display: flex; flex-direction: column; padding: 15px; box-sizing: border-box; }
            sidebar h1 { font-size: 18px; margin-bottom: 20px; color: #38bdf8; }
            .menu-item { padding: 10px 12px; border-radius: 6px; cursor: pointer; margin-bottom: 6px; font-size: 14px; color: #cbd5e1; }
            .menu-item:hover, .menu-item.active { background: #334155; color: white; }
            main { flex: 1; display: flex; flex-direction: column; height: 100vh; }
            header { background: white; padding: 12px 20px; border-bottom: 1px solid #e2e8f0; font-weight: bold; font-size: 16px; color: #1e293b; }
            .content-panel { flex: 1; padding: 20px; overflow-y: auto; display: none; flex-direction: column; }
            .content-panel.active { display: flex; }
            #chat-box { flex: 1; background: var(--card); border: 1px solid #e2e8f0; border-radius: 10px; padding: 15px; overflow-y: auto; margin-bottom: 12px; display: flex; flex-direction: column; gap: 10px; }
            .message { padding: 10px 14px; border-radius: 8px; max-width: 85%; word-break: break-word; line-height: 1.5; font-size: 14px; white-space: pre-wrap; }
            .user { background: var(--primary); color: white; align-self: flex-end; }
            .ai { background: #f1f5f9; color: #1e293b; align-self: flex-start; border: 1px solid #e2e8f0; }
            .input-group { display: flex; gap: 8px; background: white; padding: 8px; border-radius: 10px; border: 1px solid #e2e8f0; }
            input[type="text"] { flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; outline: none; }
            button.send-btn { padding: 10px 20px; background: var(--primary); color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; font-weight: bold; }
        </style>
    </head>
    <body>
        <sidebar>
            <h1>⚡ ChatAI X Pro</h1>
            <div class="menu-item active" onclick="switchTab('chat', this)">💬 Chat AI</div>
            <div class="menu-item" onclick="switchTab('admin', this)">🛠️ Admin</div>
        </sidebar>
        <main>
            <header id="header-title">Trò chuyện thông minh (Tiếng Việt & Tiếng H'Mông)</header>
            
            <div id="tab-chat" class="content-panel active">
                <div id="chat-box">
                    <div class="message ai">Nyob zoo! Kuv yog ChatAI X Pro. Koj tuaj yeem tham lus H'Mông, hỏi đáp tiếng Việt thoải mái nhé!</div>
                </div>
                <div class="input-group">
                    <input type="text" id="userInput" placeholder="Nhập tin nhắn..." onkeypress="if(event.key==='Enter') window.guiTinNhan()" />
                    <button class="send-btn" onclick="window.guiTinNhan()">Gửi</button>
                </div>
            </div>

            <div id="tab-admin" class="content-panel">
                <div style="background:white; padding:20px; border-radius:10px;">
                    <h3>Trạng thái hệ thống</h3>
                    <p>🟢 Hoạt động hoàn hảo (Online)</p>
                </div>
            </div>
        </main>

        <script>
            function switchTab(tabName, element) {
                document.querySelectorAll('.content-panel').forEach(p => p.classList.remove('active'));
                document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
                document.getElementById('tab-' + tabName).classList.add('active');
                element.classList.add('active');
            }

            window.guiTinNhan = async function() {
                const input = document.getElementById('userInput');
                const chatBox = document.getElementById('chat-box');
                if (!input) return;
                const text = input.value.trim();
                if (!text) return;

                chatBox.innerHTML += '<div class="message user">' + text + '</div>';
                input.value = '';
                chatBox.scrollTop = chatBox.scrollHeight;

                const loadingId = 'loading_' + Date.now();
                chatBox.innerHTML += '<div id="' + loadingId + '" class="message ai">Đang suy nghĩ...</div>';
                chatBox.scrollTop = chatBox.scrollHeight;

                try {
                    const response = await fetch('/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message: text })
                    });
                    const data = await response.json();
                    const loadingEl = document.getElementById(loadingId);
                    if (loadingEl) loadingEl.remove();
                    chatBox.innerHTML += '<div class="message ai">' + (data.reply || 'Lỗi phản hồi') + '</div>';
                } catch (error) {
                    const loadingEl = document.getElementById(loadingId);
                    if (loadingEl) loadingEl.remove();
                    chatBox.innerHTML += '<div class="message ai" style="color:red;">Lỗi kết nối!</div>';
                }
                chatBox.scrollTop = chatBox.scrollHeight;
            };
        </script>
    </body>
    </html>
  `);
});

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.json({ reply: "Lỗi: Chưa cấu hình GEMINI_API_KEY trên Render!" });
  }
  try {
    const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: "Bạn là ChatAI X Pro, trợ lý AI thông minh, giao tiếp thành thạo Tiếng Việt và Tiếng H'Mông. Hãy trả lời câu hỏi sau: " + userMessage }]
        }]
      })
    });
    const data = await apiResponse.json();
    let reply = "Xin lỗi, hệ thống chưa nhận được phản hồi từ AI.";
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      reply = data.candidates[0].content.parts[0].text;
    } else if (data.error) {
      reply = "Lỗi API Gemini: " + data.error.message;
    }
    res.json({ reply });
  } catch (error) {
    res.json({ reply: "Lỗi kết nối máy chủ: " + error.message });
  }
});

app.listen(port, () => {
  console.log('Server is running on port ' + port);
});
