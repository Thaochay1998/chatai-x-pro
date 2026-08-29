const http = require('http');
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ChatAI X Pro</title>
        <style>
            body { font-family: Arial, sans-serif; background: #f4f6f9; margin: 0; padding: 20px; display: flex; flex-direction: column; height: 85vh; }
            h2 { color: #007bff; text-align: center; }
            #chat { flex: 1; background: white; border: 1px solid #ccc; border-radius: 8px; padding: 15px; overflow-y: auto; margin-bottom: 10px; }
            .msg { margin-bottom: 10px; padding: 8px 12px; border-radius: 6px; max-width: 80%; }
            .user { background: #007bff; color: white; margin-left: auto; text-align: right; }
            .ai { background: #e9ecef; color: #333; }
            .box { display: flex; gap: 8px; }
            input { flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 6px; outline: none; }
            button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }
        </style>
    </head>
    <body>
        <h2>ChatAI X Pro & H'Mông AI</h2>
        <div id="chat">
            <div class="msg ai">Nyob zoo! Kuv yog ChatAI X Pro. Koj tuaj yeem tham lus H'Mông hoặc nhắn bất cứ gì!</div>
        </div>
        <div class="box">
            <input type="text" id="txt" placeholder="Nhập tin nhắn..." onkeypress="if(event.key==='Enter')send()">
            <button onclick="send()">Gửi</button>
        </div>
        <script>
            function send() {
                const t = document.getElementById('txt');
                const c = document.getElementById('chat');
                if(!t.value.trim()) return;
                c.innerHTML += '<div class="msg user">' + t.value + '</div>';
                let val = t.value;
                t.value = '';
                c.scrollTop = c.scrollHeight;
                setTimeout(() => {
                    let reply = "ChatAI X Pro đã nhận: " + val;
                    if(val.toLowerCase().includes('nyob zoo') || val.toLowerCase().includes('hmông')) {
                        reply = "Nyob zoo! Kuv yog ChatAI X Pro. Ua li cas thiaj pab tau koj?";
                    }
                    c.innerHTML += '<div class="msg ai">' + reply + '</div>';
                    c.scrollTop = c.scrollHeight;
                }, 500);
            }
        </script>
    </body>
    </html>
  `);
});

server.listen(port, () => {
  console.log('Server running on port ' + port);
});
