const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Habilitar compresión gzip
app.use(compression());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '124')));

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});