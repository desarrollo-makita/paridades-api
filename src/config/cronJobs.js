const cron = require('node-cron');
const { paridades } = require('./../controllers/paridadesControllers.js'); // Ajusta la ruta según tu estructura
const logger = require("../config/logger.js");

// Configurar el cron job para que se ejecute todos los días a las 3:00 AM
cron.schedule('0 9 * * *', async () => {
    logger.info('Iniciando tarea programada: paridades');
    try {
        // Simula la solicitud que haría el cliente
        const req = {}; // Si necesitas datos en el req, ajusta esto
        const res = {
            status: (code) => ({
                json: (data) => logger.info(`Respuesta del cron: ${JSON.stringify(data)}`)
            }),
        };

        await paridades(req, res);
        logger.info('Tarea programada completada con éxito');
    } catch (error) {
        logger.error(`Error en la tarea programada: ${error.message}`);
    }
}, {
    timezone: 'America/Santiago' // Configura la zona horaria
});



module.exports = {
    startCronJobs: () => logger.info('Tareas programadas iniciadas')
};

