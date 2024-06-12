const { connectToDatabase  , closeDatabaseConnection } = require('../config/database');
const { sendEmailWithDB  } = require('../config/email');
const { isEmailSent, setEmailSent } = require('../config/emailStatus');
const moment = require('moment');
const sql = require('mssql');
const logger = require('../config/logger.js');


async function updateParidad(empresa, moneda, fecha, valor) {

    try {



        let contador;
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
            
            const consulta = `UPDATE Paridad SET Paridad = @valor WHERE Empresa = @empresa AND Moneda = @moneda AND Fecha = @fecha`;
            
            const result = await request.query(consulta);

            logger.info(`Actualización exitosa para empresa: ${empresa}, moneda: ${moneda}, fecha: ${fecha}`);

            if (result.rowsAffected[0] > 0) {
                // Si al menos una fila fue afectada por la actualización
                setEmailSent(false);
                return resExito ={
                    "mensaje" : "Las Paridades fueron actualizadas",
                    "status": 200
                };
            } else {
                const resError = {
                    "mensaje" : "No se encontraron datos para actualizar, debe cargar el periodo",
                    "status": 404
                };

                if (!isEmailSent()) {
                    await sendEmailWithDB(resError);
                    setEmailSent(true); // Marcamos que el correo ha sido enviado
                }

               // 
                return resError;
            }
            
            
           
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