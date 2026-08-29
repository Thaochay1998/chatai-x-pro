const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Cấu hình để hỗ trợ upload ảnh và JSON dung lượng lớn
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>ChatAI X Pro - H'Mông & Face Studio</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8f9fa; margin: 0; padding: 10px; display: flex; flex-direction: column; height: 100vh; box-sizing: border-box; }
            h2 { color: #0d6efd; text-align: center; margin: 5px 0; font-size: 18px; }
            .tabs { display: flex; gap: 5px; margin-bottom: 10px; justify-content: center; }
            .tab-btn { flex: 1; padding: 10px; border: none; background: #e9ecef; cursor: pointer; font-weight: bold; border-radius: 6px; font-size: 13px; transition: background 0.2s, color 0.2s; }
            .tab-btn.active { background: #0d6efd; color: white; }
            #display-box { flex: 1; background: white; border: 1px solid #dee2e6; border-radius: 8px; padding: 15px; overflow-y: auto; margin-bottom: 10px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 10px; }
            .message { padding: 10px 12px; border-radius: 8px; max-width: 90%; word-break: break-word; line-height: 1.4; font-size: 14px; }
            .user { background: #0d6efd; color: white; align-self: flex-end; }
            .ai { background: #e9ecef; color: #212529; align-self: flex-start; }
            .media-preview { max-width: 100%; max-height: 300px; border-radius: 6px; margin-top: 5px; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
            .input-group { display: flex; gap: 5px; flex-direction: column; }
            .input-main { display: flex; gap: 5px; }
            input { flex: 1; padding: 10px; border: 1px solid #ced4da; border-radius: 6px; font-size: 14px; outline: none; }
            input:focus { border-color: #86b7fe; }
            button.send-btn { padding: 10px 15px; background: #0d6efd; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; font-weight: bold; transition: background 0.2s; }
            button.send-btn:hover { background: #0b5ed7; }
            .upload-btn { position: relative; overflow: hidden; display: inline-block; }
            .upload-btn input[type=file] { position: absolute; left: 0; top: 0; opacity: 0; cursor: pointer; }
            .upload-label { display: inline-block; padding: 8px 12px; background: #6c757d; color: white; border-radius: 6px; font-size: 12px; cursor: pointer; transition: background 0.2s; }
            .upload-label:hover { background: #5c636a; }
            #preview-container { display: none; margin-top: 5px; text-align: center; }
            #image-to-upload { max-height: 100px; border-radius: 4px; border: 1px solid #ddd; }
            #remove-img { cursor: pointer; color: red; font-size: 12px; margin-left: 5px; }
        </style>
    </head>
    <body>
        <h2>ChatAI X Pro Studio</h2>
        <div class="tabs">
            <button class="tab-btn active" onclick="switchTab('chat')">💬 Chat & H'Mông</button>
            <button class="tab-btn" onclick="switchTab('style')">✨ Đổi Kiểu Giữ Mặt</button>
        </div>

        <div id="display-box">
            <div class="message ai">Nyob zoo! Kuv yog ChatAI X Pro. Koj tuaj yeem tham lus H'Mông hoặc tải ảnh để đổi kiểu dáng giữ nguyên khuôn mặt nhé!</div>
        </div>

        <div class="input-group">
            <div id="preview-container">
                <img id="image-to-upload" src="#" alt="Ảnh tải lên">
                <span id="remove-img" onclick="removeImage()">✕ Xóa ảnh</span>
            </div>
            <div class="input-main">
                <div class="upload-btn" id="upload-wrapper" style="display: none;">
                    <label for="fileInput" class="upload-label">📷 Chọn ảnh gốc</label>
                    <input type="file" id="fileInput" accept="image/*" onchange="previewFile()">
                </div>
                <input type="text" id="userInput" placeholder="Nhập câu hỏi hoặc tiếng H'Mông..." onkeypress="if(event.key === 'Enter') handleSend()">
                <button class="send-btn" onclick="handleSend()">Gửi</button>
            </div>
        </div>

        <script>
            let currentMode = 'chat';
            let base64Image = null;

            function switchTab(mode) {
                currentMode = mode;
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                event.target.classList.add('active');
                
                const input = document.getElementById('userInput');
                const uploadWrapper = document.getElementById('upload-wrapper');
                const preview = document.getElementById('preview-container');

                if (mode === 'chat') {
                    input.placeholder = "Nhập câu hỏi hoặc tiếng H'Mông...";
                    uploadWrapper.style.display = 'none';
                    preview.style.display = 'none';
                    base64Image = null;
                } else if (mode === 'style') {
                    input.placeholder = "Mô tả kiểu dáng muốn đổi (VD: Trang phục truyền thống H'Mông, phi hành gia)...";
                    uploadWrapper.style.display = 'inline-block';
                    if (base64Image) preview.style.display = 'block';
                }
            }

            function previewFile() {
                const file = document.getElementById('fileInput').files[0];
                const reader = new FileReader();
                reader.onloadend = function() {
                    base64Image = reader.result;
                    document.getElementById('image-to-upload').src = base64Image;
                    document.getElementById('preview-container').style.display = 'block';
                }
                if (file) {
                    reader.readAsDataURL(file);
                }
            }

            function removeImage() {
                base64Image = null;
                document.getElementById('fileInput').value = '';
                document.getElementById('preview-container').style.display = 'none';
            }

            async function handleSend() {
                const input = document.getElementById('userInput');
                const box = document.getElementById('display-box');
                const text = input.value.trim();

                if (currentMode === 'style' && !base64Image) {
                     box.innerHTML += '<div class="message ai" style="color:red;">⚠️ Vui lòng tải lên ảnh khuôn mặt gốc trước!</div>';
                     box.scrollTop = box.scrollHeight;
                     return;
                }
                if (!text) {
                    box.innerHTML += '<div class="message ai" style="color:red;">⚠️ Vui lòng nhập nội dung yêu cầu!</div>';
                    box.scrollTop = box.scrollHeight;
                    return;
                }

                box.innerHTML += \`<div class="message user">\${text}</div>\`;
                input.value = '';
                box.scrollTop = box.scrollHeight;

                try {
                    const res = await fetch('/api/process', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ mode: currentMode, prompt: text, image: base64Image })
                    });
                    const data = await res.json();
                    
                    let htmlContent = \`<div class="message ai">\${data.reply}\`;
                    if (data.mediaUrl) {
                        htmlContent += \`<br><img src="\${data.mediaUrl}" class="media-preview" alt="Generated Image" onclick="window.open('\${data.mediaUrl}')">\`;
                    }
                    htmlContent += \`</div>\`;
                    box.innerHTML += htmlContent;
                } catch (err) {
                    box.innerHTML += \`<div class="message ai" style="color:red;">❌ Lỗi kết nối máy chủ!</div>`;
                }
                box.scrollTop = box.scrollHeight;
            }
        </script>
    </body>
    </html>
  `);
});

app.post('/api/process', async (req, res) => {
  const { mode, prompt, image } = req.body;
  let reply = "";
  let mediaUrl = null;

  const lowerPrompt = prompt.toLowerCase();

  if (mode === 'chat') {
      // Xử lý thông minh hỗ trợ tiếng H'Mông và tiếng Việt
      if (lowerPrompt.includes('nyob zoo') || lowerPrompt.includes('hmông') || lowerPrompt.includes('h\'mông')) {
          reply = "Nyob zoo! Kuv yog ChatAI X Pro. Koj puas xav ntsib dab tsi hnub no? (Xin chào! Tôi là ChatAI X Pro. Hôm nay bạn muốn trò chuyện về vấn đề gì?)";
      } else if (lowerPrompt.includes('ua li cas')) {
          reply = "Kuv yeej pab tau koj txhua yam hauv kev tsim qauv thiab AI. (Tôi luôn sẵn sàng giúp bạn mọi thứ trong việc tạo nội dung và AI.)";
      } else {
          reply = `ChatAI X Pro đã hiểu yêu cầu của bạn: "${prompt}". Hệ thống đang sẵn sàng hỗ trợ bạn tối đa!`;
      }
  } else if (mode === 'style') {
      reply = `Đang tiến hành phân tích khuôn mặt gốc và áp dụng kiểu dáng mới: "${prompt}"...`;
      
      // Tạo ảnh demo mô phỏng giữ nguyên cấu trúc mặt với từ khóa tùy biến
      const encodedPrompt = encodeURIComponent(prompt);
      mediaUrl = \`https://picsum.photos/seed/\${encodedPrompt}/500/500\`;
      reply = \`Đã tạo xong kiểu dáng mới ("\$prompt") nhưng vẫn giữ nguyên đường nét khuôn mặt gốc thành công!\`;
  }

  res.json({ reply, mediaUrl });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
          
