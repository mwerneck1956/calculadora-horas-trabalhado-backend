const express = require("express");

let porta = process.env.PORT || 3333;
const app = express();
const cors = require("cors");

//Converter body das requisições para json
app.use(express.json());
app.use(cors({ origin: true, credentials: false }));

app.post("/calcularHorario", (request, response) => {
  //Fazer tratamento quando horas forem iguais ou excederem 24horas
  const { arrivalTime, departureTime, date } = request.body;

  let arrivalHour = parseInt(arrivalTime.substring(0, 2));
  let arrivalMinute = parseInt(arrivalTime.substring(3, 5));

  let departureHour = parseInt(departureTime.substring(0, 2));
  let departureMinute = parseInt(departureTime.substring(3, 5));
  let dayTime,
    nightTime,
    //Vou transformar os dados em minutos para facilitar os calculos
    arrivalTimeMinutes = arrivalHour * 60 + arrivalMinute;
  departureTimeMinutes = departureHour * 60 + departureMinute;

  //Calculo quando a pessoa so trabalhou horas noturnas
  if (arrivalHour >= 22 && departureHour <= 5) {
    dayTime = 00;
    nightTime =
      Math.abs(arrivalTimeMinutes - 24 * 60) + Math.abs(departureTimeMinutes);

  } else if (
    (arrivalHour >= 22 && departureHour >= 22) ||
    (departureHour > arrivalHour && arrivalHour <= 5 && departureTimeMinutes <= 301 )
  ) {
    
    dayTime = 00;
    nightTime = Math.abs(arrivalTimeMinutes - departureTimeMinutes);
  } else if (
  /*--------------------------------------------------------------------------------------------*/

  /* Calculo quando funcionario trabalhou somente horas diurnas*/
    departureHour > arrivalHour &&
    arrivalHour >= 5 &&
    arrivalHour <= 21 &&
    departureTimeMinutes <= 1320
  ) {
    nightTime = 00;
    dayTime = Math.abs(arrivalTimeMinutes - departureTimeMinutes);
  } else if (arrivalHour >= 22 && departureHour > 5) {
  /* -------------------------------------------------------------------------------------------*/


  /*Calculos em que funcionario trabalha tanto no horario diurno quanto noturno*/
    nightTime = Math.abs(arrivalTimeMinutes - 24 * 60) + 300;
    dayTime = Math.abs(departureTimeMinutes - 5 * 60);
  } else if (
    arrivalHour > departureHour &&
    arrivalHour < 22 &&
    departureHour > 5
  ) {
    nightTime = 420;
    dayTime =
      Math.abs(arrivalTimeMinutes - 1320) +
      Math.abs(departureTimeMinutes - 300);
  } else if (
    arrivalHour < 5 &&
    departureHour < 5 &&
    arrivalHour > departureHour
  ) {

    nightTime =
      Math.abs(300 - arrivalTimeMinutes) + Math.abs(120 + departureTimeMinutes);
    dayTime = 1020;
  } else if (departureHour > 22 && arrivalHour < 22) {
    if (arrivalHour < 5) {

      nightTime =
        departureHour <= 22
          ? Math.abs(300 - arrivalTimeMinutes) +
            Math.abs(1440 - departureTimeMinutes)
          : Math.abs(300 - arrivalTimeMinutes) +
            Math.abs(1320 - departureTimeMinutes);

      dayTime = 1020;
    }
    if (arrivalHour >= 5) {
      dayTime = Math.abs(arrivalTimeMinutes - 22 * 60);
      nightTime = Math.abs(departureTimeMinutes - 22 * 60);
    }
  }else if(arrivalHour >= 5 && arrivalHour < 22 && departureHour <= 5  ){
      if(departureHour === 5){
        dayTime = Math.abs(arrivalTimeMinutes - 1320) + Math.abs((300 - departureTimeMinutes));
        nightTime = 7*60;
      }else{

        nightTime =Math.abs(120)  +  departureTimeMinutes;
        dayTime = Math.abs(arrivalTimeMinutes) - 22*60;

      }

  }else if(departureHour>= 5 && departureHour <= 22 ){
    
    if(arrivalHour < 5){
      nightTime = Math.abs(300 - arrivalTimeMinutes);
      dayTime =  Math.abs(300 - departureTimeMinutes);
      /*nightTime =  120 + Math.abs(300 - arrivalTimeMinutes)*/
    }else{
        nightTime = departureHour === 22 ? Math.abs(22*60 - departureTimeMinutes) : 00;
        dayTime = departureHour === 22 ?  Math.abs(22*60 - arrivalTimeMinutes)  : departureTimeMinutes - arrivalTimeMinutes;

    }

  }
  //caso horario de saida === horario entrada mando uma mensagem de erro pois o
  //tempo de trabalho não pode ultrapassar 24 horas

  if (arrivalHour == departureHour) {
    return response
      .status(400)
      .json({ message: "Horas de trabalho excederam 24 horas!" });
  }

  dayTime = Math.abs(dayTime)
  nightTime = Math.abs(nightTime)

  return response.status(201).json({
    date: date,
    arrivalHour: arrivalTime,
    departureHour: departureTime,
    dayTimeHours: `${
      Math.floor(dayTime / 60) >= 10
        ? Math.floor(dayTime / 60)
        : `0${Math.floor(dayTime / 60)}`
    } : ${dayTime % 60 >= 10 ? dayTime % 60 : `0${dayTime % 60}`}`,
    nightTimeHours: `${
      Math.floor(nightTime / 60) >= 10
        ? Math.floor(nightTime / 60)
        : `0${Math.floor(nightTime / 60)}`
    } : ${nightTime % 60 >= 10 ? nightTime % 60 : `0${nightTime % 60}`}`,

    //workHours: `${workHours}:${workMinutes}`,
  });
});
app.listen(porta, () => console.log("server started on port 3333 !"));
