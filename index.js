const express = require('express');
const axios = require('axios');
const app = express();
const multer = require('multer'); // Thư viện để upload ảnh
const upload = multer({ dest: 'uploads/' }); // Lưu tạm ảnh tải lên
app.use(express.static('public'));

// Địa chỉ API của VPS GPU đang chạy ComfyUI
const AI_GPU_SERVER_URL = 'http://IP_CUA_VPS_GPU:8188'; // Thay bằng IP thực tế

// Giao diện upload ảnh (HTML đơn giản)
app.get('/', (req, res) => {
  res.send(`
    <form action="/process-image" method="post" enctype="multipart/form-data">
        <input type="file" name="faceImage" accept="image/*"> <br>
        <input type="text" name="prompt" placeholder="Mô tả bối cảnh, trang phục, thay đổi..."> <br>
        <button type="submit">Xử lý Ảnh</button>
    </form>
  `);
});

// Xử lý yêu cầu từ người dùng
app.post('/process-image', upload.single('faceImage'), async (req, res) => {
    try {
        const faceImage = req.file; // Ảnh khuôn mặt tải lên
        const prompt = req.body.prompt;

        // Bước 1: Upload ảnh khuôn mặt lên VPS GPU hoặc pollinations.ai để có URL công khai
        // (Trong thực tế bạn cần tự host một server lưu trữ ảnh tạm thời)
        const faceImageUrl = "https://url_cong_khai_cua_anh_da_tai_len.jpg";

        // Bước 2: Gửi yêu cầu API tới ComfyUI (trên VPS GPU)
        // Dữ liệu này chứa URL ảnh khuôn mặt và Prompt mô tả bối cảnh
        const payload = {
            "client_id": "unique_id",
            "prompt": {
                // Cấu trúc JSON phức tạp của Workflow ComfyUI
                "1": { "inputs": { "image": faceImageUrl }, "class_type": "LoadImage" },
                "2": { "inputs": { "model_name": "Realistic_Vision_v5.0.safetensors" }, "class_type": "CheckpointLoaderSimple" },
                // ... các node khác để thực hiện FaceID, Inpainting, FaceSwap ...
                // Cần truyền prompt người dùng vào đây
                "3": { "inputs": { "text": prompt, "clip": ["2", 1] }, "class_type": "CLIPTextEncode" }
            }
        };

        // Gọi API ComfyUI trên VPS GPU
        const response = await axios.post(`${AI_GPU_SERVER_URL}/prompt`, payload);
        const promptId = response.data.prompt_id;

        // Bước 3: Lắng nghe kết quả từ VPS GPU (WebSocket)
        // ComfyUI sẽ gửi thông báo khi ảnh được tạo xong, sau đó gửi URL ảnh về
        // ... code xử lý WebSocket để lấy URL ảnh kết quả ...
        const finalImageUrl = await getComfyResult(promptId);

        // Hiển thị ảnh kết quả cho người dùng
        res.send(`<img src="${finalImageUrl}">`);

    } catch (error) {
        res.status(500).send('Lỗi xử lý AI phức tạp.');
    }
});

// Hàm giả lập chờ kết quả từ ComfyUI qua WebSocket
async function getComfyResult(promptId) {
    return new Promise(resolve => {
        // ... logic kết nối WebSocket tới ws://IP_CUA_VPS_GPU:8188/ws ...
        // ... khi nhận được thông báo 'executing' hoàn tất, trả về URL ...
        setTimeout(() => resolve('https://url_anh_ket_qua_ai.jpg'), 10000); // Giả lập mất 10 giây
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server trung gian đang chạy...'));
