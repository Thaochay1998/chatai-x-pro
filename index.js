const express = require('express');
const Replicate = require('replicate');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// Khởi tạo kết nối Replicate bằng API Token của bạn
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || 'DÁN_API_TOKEN_CỦA_BẠN_VÀO_ĐÂY',
});

// (Phần giao diện HTML giữ nguyên như trước, khi gửi ảnh và prompt lên server sẽ gọi đoạn dưới đây)

app.post('/api/process', async (req, res) => {
  const { mode, prompt, image } = req.body;
  let reply = "";
  let mediaUrl = null;

  try {
    if (mode === 'style' || mode === 'swap') {
      reply = `Đang dùng AI quét khuôn mặt và tạo kiểu '${prompt}'...`;
      
      // Gọi mô hình AI thực tế trên Replicate (Ví dụ: PhotoMaker giữ nguyên khuôn mặt gốc)
      const output = await replicate.run(
        "tencentarc/photomaker:v2",
        {
          input: {
            input_image: image, // Ảnh gốc người dùng tải lên
            prompt: prompt,     // Kiểu dáng muốn đổi (VD: cyberpunk man, suit...)
            num_outputs: 1
          }
        }
      );
      
      mediaUrl = Array.isArray(output) ? output[0] : output;
      reply = `Đã tạo thành công kiểu dáng mới giữ nguyên khuôn mặt!`;
    }
  } catch (err) {
    reply = "Lỗi xử lý AI: " + err.message;
  }

  res.json({ reply, mediaUrl });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
