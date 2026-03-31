const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5500;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));
app.use('/images', express.static(path.join(publicPath, 'images')));

const apiPath = path.join(__dirname, 'routes', 'api.js');
if (fs.existsSync(apiPath)) {
    const apiRoutes = require('./routes/api');
    app.use('/api', apiRoutes);
}

app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`
=============================================
🚀 Server is running!
🔗 Open: http://localhost:${PORT}
📁 Serving From: ${publicPath}
=============================================
`);
});