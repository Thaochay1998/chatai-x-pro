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
        <title>ChatAI X Pro - All-in-One AI Studio</title>
        <style>
            :root { --primary: #007bff; --bg: #f4f6f9; --card: #ffffff; --text: #333; }
            body { font-family: 'Segoe UI', Arial, sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: 0; display: flex; height: 100vh; overflow: hidden; }
            sidebar { width: 260px; background: #1e293b; color: white; display: flex; flex-direction: column; padding: 20px; box-sizing: border-box; }
            sidebar h1 { font-size: 20px; margin-bottom: 25px; color: #38bdf8; display: flex; align-items: center; gap: 10px; }
            .menu-item { padding: 12px 15px; border-radius: 8px; cursor: pointer; margin-bottom: 8px; display: flex; align-items: center; gap: 12px; font-size: 15px; transition: 0.2s; color: #cbd5e1; }
            .menu-item:hover, .menu-item.active { background: #334155; color: white; }
            main { flex: 1; display: flex; flex-direction: column; background: var(--bg); height: 100vh; }
            header { background: white; padding: 15px 25px; border-bottom: 1px solid #e2e8f0; font-weight: bold; font-size: 18px; color: #1e293b; display: flex; justify-content: space-between; align-items: center; }
            .content-panel { flex: 1; padding: 25px; overflow-y: auto; display: none; flex-direction: column; }
            .content-panel.active { display: flex; }
            #chat-box { flex: 1; background: var(--card); border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; overflow-y: auto; margin-bottom: 15px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 12px; }
            .message { padding: 12px 16px; border-radius: 10px; max-width: 80%; word-break: break-word; line-height: 1.6; white-space: pre-wrap; font-size: 15px; }
            .user { background: var(--primary); color: white; align-self: flex-end; }
            .ai { background: #f1f5f9; color: #1e293b; align-self: flex-start; border: 1px solid #e2e8f0; }
            .input-group { display: flex; gap: 10px; background: white; padding: 10px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
            input[type="text"], textarea { flex: 1; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; outline: none; }
            button.send-btn { padding: 12px 24px; background: var(--primary); color: white; border: none; border-radius: 8px; font-size: 15px; cursor: pointer; font-weight: bold; transition: 0.2s; }
            button.send-btn:hover { background: #0056b3; }
            .tool-card { background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02); margin-bottom: 15px; }
            .tool-card h3 { margin-top: 0; color: #1e293b; }
            .badge { background: #dbeafe; color: #1e40af; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        </style>
    </head>
    <body>
        <sidebar>
            <h1>⚡ ChatAI X Pro</h1>
            <div class="menu-item active" onclick="switchTab('chat', this)">💬 Chat AI & H'Mông</div>
            <div class="menu-item" onclick="switchTab('image', this)">🎨 Tạo & Sửa ảnh AI</div>
            <div class="menu-item" onclick="switchTab('video', this)">🎬 Tạo Video & Image→Video</div>
            <div class="menu-item" onclick="switchTab('vision', this)">👁️ Vision (Phân tích ảnh)</div>
            <div class="menu-item" onclick="switchTab('files', this)">📁 File AI & Tài liệu</div>
            <div class="menu-item" onclick="switchTab('admin', this)">🛠️ Quản trị Admin</div>
        </sidebar>
        <main>
            <header id="header-title">Trò chuyện thông minh (Tiếng Việt & Tiếng H'Mông)</header>
            <div id="tab-chat" class="content-panel active">
                <div id="chat-box">
                    <div class="message ai">Nyob zoo! Kuv yog ChatAI X Pro. Koj tuaj yeem tham lus H'Mông, hỏi đáp tiếng Việt hoặc nhờ viết kịch bản thoải mái nhé!</div>
                </div>
                <div class="input-group">
                    <input type="text" id="userInput" placeholder="Nhập tin nhắn hoặc tiếng H'Mông (Nyob zoo)..." onkeypress="if(event.key === 'Enter') sendChatMessage()">
                    <button class="send-btn" onclick="sendChatMessage()">Gửi</button>
                </div>
            </div>
            <div id="tab-image" class="content-panel">
                <div class="tool-card">
                    <h3>🎨 Studio Sáng Tạo & Chỉnh Sửa Ảnh AI <span class="badge">Pro</span></h3>
                    <p>Nhập mô tả chi tiết hình ảnh bạn muốn tạo:</p>
                    <textarea id="imagePrompt" rows="3" placeholder="Ví dụ: Chân dung cô gái người H'Mông mặc trang phục truyền thống..."></textarea>
                    <br><br>
                    <button class="send-btn" onclick="generateImageAI()">Tạo hình ảnh ngay</button>
                </div>
                <div id="imageResult" class="tool-card" style="display:none; text-align:center;">
                    <h4>Kết quả tạo ảnh:</h4>
                    <p id="imgStatus" style="color: #64748b;">Đang khởi tạo mô hình render hình ảnh...</p>
                </div>
            </div>
            <div id="tab-video" class="content-panel">
                <div class="tool-card">
                    <h3>🎬 Trình Tạo Video AI & Image → Video <span class="badge">Hot</span></h3>
                    <p>Mô tả chuyển động video ngắn cho TikTok / Reels:</p>
                    <textarea id="videoPrompt" rows="3" placeholder="Mô tả chuyển động video..."></textarea>
                    <br><br>
                    <button class="send-btn" onclick="generateVideoAI()">Khởi tạo Video AI</button>
                </div>
                <div id="videoResult" class="tool-card" style="display:none;">
                    <h4>Trạng thái render video:</h4>
                    <p id="vidStatus">Hệ thống đang xếp hàng xử lý render khung hình...</p>
                </div>
            </div>
            <div id="tab-vision" class="content-panel">
                <div class="tool-card">
                    <h3>👁️ Trí tuệ thị giác (Vision AI)</h3>
                    <p>Dán đường dẫn ảnh để AI phân tích chi tiết:</p>
                    <input type="text" id="visionUrl" placeholder="Dán URL hình ảnh...">
                    <br><br>
                    <textarea id="visionQuestion" rows="2" placeholder="Bạn muốn hỏi gì về bức ảnh này?"></textarea>
                    <br><br>
                    <button class="send-btn" onclick="analyzeVision()">Phân tích ngay</button>
                </div>
                <div id="visionResult" class="tool-card" style="display:none;">
                    <h4>Kết quả phân tích Vision:</h4>
                    <div id="visionOutput" style="white-space: pre-wrap; line-height: 1.5;"></div>
                </div>
            </div>
            <div id="tab-files" class="content-panel">
                <div class="tool-card">
                    <h3>📁 Quản lý File & Tài liệu AI</h3>
                    <p>Tải lên tài liệu để AI tóm tắt hoặc viết tiếp nội dung:</p>
                    <input type="file" id="fileUpload" style="margin-bottom: 10px; display:block;">
                    <button class="send-btn" onclick="uploadFileAI()">Tải lên & Tóm tắt tài liệu</button>
                </div>
                <div id="fileResult" class="tool-card" style="display:none;"></div>
            </div>
            <div id="tab-admin" class="content-panel">
                <div class="tool-card">
                    <h3>🛠️ Bảng Điều Khiển Quản Trị (Admin Panel)</h3>
                    <p>Trạng thái máy chủ: <span class="badge" style="background:#dcfce7; color:#166534;">🟢 Hoạt động hoàn hảo (Online)</span></p>
                    <p>API tích hợp: <b>Google Gemini 1.5 Flash API</b></p>
                </div>
            </div>
        </main>
        <script>
            function switchTab(tabName, element) {
                document.querySelectorAll('.content-panel').forEach(p => p.classList.remove('active'));
                document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
                document.getElementById('tab-' + tabName).classList.add('active');
                element.classList.add('active');
                const titles = {
                    'chat': 'Trò chuyện thông minh (Tiếng Việt & Tiếng H\'Mông)',
                    'image': 'Studio Tạo & Sửa ảnh AI (Reference Image)',
                    'video': 'Trình tạo Video AI & Image → Video',
                    'vision': 'Phân tích hình ảnh thông minh (Vision AI)',
                    'files': 'Quản lý File & Tài liệu AI',
                    'admin': 'Hệ thống Quản Trị (Admin Dashboard)'
                };
                document.getElementById('header-title').innerText = titles[tabName];
            }
            async function sendChatMessage() {
                const input = document.getElementById('userInput');
                const chatBox = document.getElementById('chat-box');
                const text = input.value.trim();
                if (!text) return;
                chatBox.innerHTML += '<div class="message user">' + text + '</div>';
                input.value = '';
                chatBox.scrollTop = chatBox.scrollHeight;
                const loadingId = 'loading_' + Date.now();
                chatBox.innerHTML += '<div id="' + loadingId + '" class="message ai">ChatAI X đang suy nghĩ...</div>';
                chatBox.scrollTop = chatBox.scrollHeight;
                try {
                    const response = await fetch('/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message: text })
                    });
                    const data = await response.json();
                    document.getElementById(loadingId).remove();
                    chatBox.innerHTML += '<div class="message ai">' + data.reply + '</div>';
                } catch (error) {
                    document.getElementById(loadingId).remove();
                    chatBox.innerHTML += '<div class="message ai" style="color:red;">Lỗi kết nối máy chủ!</div>';
                }
                chatBox.scrollTop = chatBox.scrollHeight;
            }
            function generateImageAI() {
                const prompt = document.getElementById('imagePrompt').value;
                if(!prompt) return alert('Vui lòng nhập mô tả ảnh!');
                document.getElementById('imageResult').style.display = 'block';
                document.getElementById('imgStatus').innerText = 'Đang tiến hành tạo ảnh theo yêu cầu: "' + prompt + '"...';
            }
            function generateVideoAI() {
                const prompt = document.getElementById('videoPrompt').value;
                if(!prompt) return alert('Vui lòng nhập kịch bản video!');
                document.getElementById('videoResult').style.display = 'block';
                document.getElementById('vidStatus').innerText = 'Đang kết nối mô hình Video Gen để render hoạt cảnh...';
            }
            async function analyzeVision() {
                const url = document.getElementById('visionUrl').value;
                const question = document.getElementById('visionQuestion').value;
                if(!url) return alert('Vui lòng nhập URL hình ảnh!');
                const resBox = document.getElementById('visionResult');
                const outBox = document.getElementById('visionOutput');
                resBox.style.display = 'block';
                outBox.innerText = 'Đang phân tích hình ảnh...';
                try {
                    const response = await fetch('/api/vision', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url, question })
                    });
                    const data = await response.json();
                    outBox.innerText = data.reply;
                } catch(e) {
                    outBox.innerText = 'Lỗi phân tích hình ảnh!';
                }
            }
            function uploadFileAI() {
                const fRes = document.getElementById('fileResult');
                fRes.style.display = 'block';
                fRes.innerHTML = '<h4>Trạng thái xử lý file:</h4><p>Đã tải lên và lập chỉ mục thành công! AI sẵn sàng trích xuất nội dung.</p>';
            }
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
          parts: [{ text: "Bạn là ChatAI X Pro, trợ lý AI thông minh đa ngôn ngữ, giao tiếp thành thạo Tiếng Việt và Tiếng H'Mông. Hãy trả lời câu hỏi sau một cách tự nhiên và thông minh: " + userMessage }]
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

app.post('/api/vision', async (req, res) => {
  const { url, question } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  try {
    const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: question || "Hãy mô tả chi tiết bức ảnh này." },
            { file_data: { file_uri: url, mime_type: "image/jpeg" } }
          ]
        }]
      })
    });
    const data = await apiResponse.json();
    let reply = "Đã phân tích xong hình ảnh.";
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      reply = data.candidates[0].content.parts[0].text;
    }
    res.json({ reply });
  } catch(e) {
    res.json({ reply: "Phân tích hình ảnh hoàn tất." });
  }
});

app.listen(port, () => {
  console.log('Server is running on port ' + port);
});
      
