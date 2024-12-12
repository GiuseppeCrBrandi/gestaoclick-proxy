const fetch = require('node-fetch');

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/proxy', async (req, res) => {
    try {
        const apiUrl = 'https://api.beteltecnologia.com/clientes';
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'access-token': 'aad8e68cc48aff6eda60b2ac2f36a73b5a9666c5',
                'secret-access-token': '4b5955397169bb81ae75b464cb05aec9b71a3312'
            }
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
