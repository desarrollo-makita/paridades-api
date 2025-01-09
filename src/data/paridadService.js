const { connectToDatabase  , closeDatabaseConnection } = require('../config/database');
const { sendEmailWithDB  } = require('../config/email');
const { isEmailSent, setEmailSent } = require('../config/emailStatus');
const moment = require('moment');
const sql = require('mssql');
const logger = require('../config/logger.js');


async function updateParidad(empresa, moneda, fecha, valor) {

    try {
        logger.info(`Iniciamos la funcion updateParidad`);
    
        if (!empresa || !moneda || !fecha || !valor ) {
        
            logger.error(`Error: Problemas con los parametros de entrada`);
            return { "Error fetching data" : `Parámetros faltantes o vacíos. Metodo -  updateParidad(empresa, moneda, fecha, valor)` , status :400 };
        }

        else{

            await connectToDatabase('BdQMakita');

            const request = new sql.Request();
            request.input('empresa', sql.VarChar, empresa);
            request.input('moneda', sql.VarChar, moneda);
            request.input('fecha', sql.Date, fecha);
            request.input('valor',  sql.Decimal(22, 8), valor);

            // Verificar si la fila ya existe
            const checkQuery = `SELECT COUNT(*) as count FROM Paridad WHERE Empresa = @empresa AND Moneda = @moneda AND Fecha = @fecha`;
            const checkResult = await request.query(checkQuery);

            if (checkResult.recordset[0].count > 0) {
                // Si la fila ya existe, actualizarla
                const updateQuery = `UPDATE Paridad SET Paridad = @valor WHERE Empresa = @empresa AND Moneda = @moneda AND Fecha = @fecha`;
                console.log("Consulta SQL de actualización:", updateQuery);
                await request.query(updateQuery);
                logger.info(`Actualización exitosa para empresa: ${empresa}, moneda: ${moneda}, fecha: ${fecha}`);
            } else {
                // Si la fila no existe, insertarla
                const insertQuery = `INSERT INTO Paridad (Empresa, Moneda, Fecha, Paridad) VALUES (@empresa, @moneda, @fecha, @valor)`;
                console.log("Consulta SQL de inserción:", insertQuery);
                await request.query(insertQuery);
                logger.info(`Inserción exitosa para empresa: ${empresa}, moneda: ${moneda}, fecha: ${fecha}`);
            }

            setEmailSent(false);
            return {
                "mensaje": "Las Paridades fueron actualizadas",
                "status": 200
            };
        }
    } catch (error) {
        throw error;
    }finally{
        await closeDatabaseConnection();
    }
    
    
    
}

module.exports = {
    updateParidad
}
