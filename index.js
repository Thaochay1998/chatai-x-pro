const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('ChatAI X Pro Server is running successfully!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
