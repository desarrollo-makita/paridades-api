const axios = require('axios');
const logger = require('../config/logger.js');
const { connectToDatabase, closeDatabaseConnection } = require('../config/database.js');
const sql = require('mssql');
const {fetchData} = require('../data/dataService.js')

/**
 * parodades
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function paridades(req , res){
    try{
      
        logger.info(`Iniciamos la funcion paridades`);
        const seriesData = await fetchData();

        if(seriesData.status != 200 ){
            logger.error(`Error fetching data ${seriesData.mensaje}`);
            return  res.status(404).json({"Error fetching data" : seriesData.mensaje});
        
        }else{
            logger.info(`Data fetched successfully ${seriesData.mensaje}`);
            return  res.status(200).json({'Data fetched successfully' : seriesData});
        }

    }catch (error) {
        
        // Manejamos cualquier error ocurrido durante el proceso
        logger.error(`Error en paridades: ${error.message}`);
        res.status(500).json({ error: `Error en el servidor [paridades-ms] :  ${error.message}`  });
    }
}


module.exports = {
    paridades
};
