const express = require('express');
const cors = require('cors');
const app = express();

// CORS für alle Anfragen erlauben
app.use(cors());

// Alternativ: CORS nur für Anfragen von localhost:3000 erlauben
app.use(cors({
    origin: 'http://localhost:3000'
}));

// Deine API-Routen hier
app.get('/api', function (req, res, next) {
    res.json({msg: 'Dies ist CORS-fähig für alle Ursprünge!'})
});

app.listen(8080, function () {
    console.log('CORS-fähiges Webserver läuft auf Port 8080');
});