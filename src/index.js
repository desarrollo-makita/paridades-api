const express = require('express');
const { fetchData } = require('./data/dataService');

const app = express();
const PORT = 3001;
const SERVER_URL = `/paridades`;

app.get('/', async (req, res) => {
    try {
        const seriesData = await fetchData(SERVER_URL);
        res.status(200).json(seriesData);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ descripcion: 'Error fetching data', status: 500 });
    }
});

// Manejo de rutas no encontradas
app.use((req, res, next) => {
    res.status(404).send('Página no encontrada');
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error interno del servidor');
});

// Iniciar el servidor
app.listen(PORT, async () => {
    console.log(`Server running at ${SERVER_URL}`);
    
    // Llamada inicial a fetchData una vez que el servidor esté iniciado
    try {
        const seriesData = await fetchData(SERVER_URL);
        console.log('Data fetched successfully:', seriesData);
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }

    // Llamada a fetchData cada 15 segundos
    setInterval(async () => {
        try {
            const seriesData = await fetchData(SERVER_URL);
            console.log('Data fetched successfully:', seriesData);
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    }, 15000); // 15000 milisegundos = 15 segundos
});
