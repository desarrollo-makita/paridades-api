const axios = require('axios');
const moment = require('moment');
const logger = require('../config/logger.js');
const { updateParidad } = require('./paridadService');

const series = [
    'F072.CLP.CAD.N.O.D',
    'F073.TCO.PRE.Z.D',
    'F072.CLP.CHF.N.O.D',
    'F072.CLP.GBP.N.O.D',
    'F072.CLP.EUR.N.O.D',
    'F072.CLP.AUD.N.O.D',
    'F072.CLP.CNY.N.O.D',
    'F072.CLP.NZD.N.O.D'
];

const glosaMapping = {
    "canadiense": "CAD",
    "australiano": "AUD",
    "usd": "US$",
    "franco": "CHF",
    "libra": "LI",
    "euro": "EU",
    "yuan": "CNY",
    "neozelandés": "NZD"
};

function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDate(date) {
    const fechaMoment = moment(date, "DD-MM-YYYY");
    const fechaFormateada = fechaMoment.format("YYYY-MM-DD");
    return fechaFormateada;
}

async function fetchData() {
    try {
        logger.info(`Iniciamos funcion fetchData-Banco-Central`);
        const currentDate = getCurrentDate();
       
        const apiUrl = `https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx?user=soporte@makita.cl&pass=Makita2024&firstdate=${currentDate}&lastdate=${currentDate}&timeseries=`;
       
        const requests = series.map(serie => axios.get(`${apiUrl}${serie}&function=GetSeries`));
        const responses = await Promise.all(requests);
        const todayData = responses.map(response => response.data).filter(data => data.Series.Obs.length > 0);
        // Variable para almacenar la respuesta de updateParidad
        let responseUpdate;

        if(todayData.length > 0){
            // Iterar sobre los datos de hoy
            for (const item of todayData) {
               
                const descripcion = item.Series.descripEsp.toLowerCase();
               
                for (const keyword in glosaMapping) {
                  
                    if (descripcion.includes(keyword)) {
                        item.Series.Obs[0].glosa = glosaMapping[keyword];
                       
                        break;
                    }
                }
                
                if (item.Series.Obs[0].glosa && item.Series.Obs[0].value) {
                    const formattedDate = formatDate(item.Series.Obs[0].indexDateString);
                    
                    // Llamar a updateParidad y almacenar la respuesta
                    responseUpdate = await updateParidad('Makita', item.Series.Obs[0].glosa, formattedDate, parseFloat(item.Series.Obs[0].value));
                    
                }
            }
        }else{
            return {mensaje : 'Findesemana no se carga data'}
        }
        logger.info(`Fin de la funcion fetchData-Banco-Central`);
        
        return responseUpdate;
    
    } catch (error) {
        console.error('Error al realizar la solicitud:', error.message);
        throw error;
    }
}

module.exports = {
    fetchData
};
