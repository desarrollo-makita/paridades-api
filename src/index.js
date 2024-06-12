const express = require('express');
const { fetchData } = require('./data/dataService');
const routes = require('./routes/routes');
const { connectToDatabase } = require('./config/database');

const app = express();
const PORT = 3001;
const SERVER_URL = `${PORT}/paridades`;

// Middleware para habilitar CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permite cualquier origen
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


app.use('/', routes);


// Iniciar el servidor después de la conexión a la base de datos
connectToDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en ${SERVER_URL}`);
    });
    try {
        setInterval(async () => {
            try {
                const seriesData = await fetchData();
                if(seriesData.status === 200){
                    console.log('Data fetched successfully:', seriesData);
                }else{
                    console.log('Error fetching data:', seriesData);
                }
                
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        }, 10000); // 10000 milisegundos = 10 segundos
       
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}).catch(error => {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1); // Termina el proceso con un código de error
});


