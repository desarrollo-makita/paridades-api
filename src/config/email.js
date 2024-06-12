const sql = require('mssql');
const { connectToDatabase , closeDatabaseConnection} = require('../config/database.js');

async function sendEmailWithDB(error) {
    try {
         let body;
         await connectToDatabase('BdQMakita');
       
        const request = new sql.Request(); // Nueva instancia de request en cada iteración
        let currentDate = new Date();
        let formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

        let subject = `Error en el API Orden Servicio :  ${formattedDate}`;
        
        body = `Ha ocurrido un error al cargar las paridades. \n\nFecha del error:\n ${formattedDate}.\n\nDetalles del error:\n${error.message} \n\nAtte.:\nAdministrador - Sistemas\nMCL`;
        
        await request
            .input('profile_name', sql.VarChar, 'Sistemas')
            .input('recipients', sql.VarChar, 'soporte@makita.cl')
            .input('copy_recipients', sql.VarChar, 'jherrera@makita.cl;nmorales@makita.cl')
            .input('subject', sql.VarChar, subject)
            .input('body', sql.VarChar, body)
            .input('importance', sql.VarChar, 'High')
            .input('body_format', sql.VarChar, 'TEXT')
            .execute('msdb.dbo.sp_send_dbmail');
            
            
    } catch (error) {
       
        throw error;
    } finally {
        await closeDatabaseConnection();
    }
}

module.exports = {
    sendEmailWithDB
};