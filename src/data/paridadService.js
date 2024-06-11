const { connectToDatabase } = require('../config/database');
const moment = require('moment');
const sql = require('mssql');


async function updateParidad(empresa, moneda, fecha, valor) {
    try {
        const pool = await connectToDatabase();
        const transaction = await pool.transaction();

        try {
            await transaction.begin();

            const request = new sql.Request(transaction);
            request.input('valor', sql.Decimal(18, 8), valor);
            request.input('empresa', sql.VarChar, empresa);
            request.input('moneda', sql.VarChar, moneda);
            request.input('fecha', sql.VarChar, fecha);

            const result = await request.query(`UPDATE Paridad SET Paridad = @valor WHERE Empresa = @empresa AND Moneda = @moneda AND Fecha = @fecha`);
            
            if (result.rowsAffected[0] > 0) {
                // Si al menos una fila fue afectada por la actualización
                await transaction.commit();
                
                return resExito ={
                    "message" : "Las Paridades fueron actualizadas",
                    "status": 200
                };
            } else {
                // Si no se encontraron datos para actualizar
                await transaction.rollback();
                
                return resError = {
                    "message" : "No se encontraron datos para actualizar, debe cargar el periodo",
                    "status": 404
                };
            }
        
        } catch (error) {
            await transaction.rollback();
            throw error;
        } finally {
            await pool.close();
        }
    } catch (error) {
        const responseError = {
            "descripcionUsuario": "Error en la operación de base de datos",
            "descripcionTecnica": error.message,
            "status": 500
        };
        return responseError;
    }
}

module.exports = {
    updateParidad
};