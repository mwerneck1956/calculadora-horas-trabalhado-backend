const express = require("express");

let porta = process.env.PORT || 3333;
const app = express();
const cors = require("cors");

//Converter body das requisições para json
app.use(express.json());
app.use(cors({ origin: true, credentials: false }));

app.get("/calcularHorario", (request, response) => {
  //Fazer tratamento quando horas forem iguais ou excederem 24horas
  const { arrivalTime, departureTime, date } = request.body;

  let arrivalHour = parseInt(arrivalTime.substring(0, 2));
  let arrivalMinute = parseInt(arrivalTime.substring(3, 5));

  let departureHour = parseInt(departureTime.substring(0, 2));
  let departureMinute = parseInt(departureTime.substring(3, 5));
  let workHours,
    workMinutes,
    dayTimeHours,
    nightTimeHours,
    dayTimeMinutes,
    nightTimeMinutes,
    DepartureTime,
    dayTime,
    nightTime,
    //Vou transformar os dados em minutos para facilitar os calculos
  arrivalTimeMinutes = arrivalHour * 60 + arrivalMinute;
  departureTimeMinutes = departureHour * 60 + departureMinute;

  if (arrivalHour >= 22 && departureHour <= 5) {
    dayTime = 00;
    nightTime =
      Math.abs(arrivalTimeMinutes - 24 * 60) + Math.abs(departureTimeMinutes);
  } else if (
    (arrivalHour >= 22 && departureHour >= 22  ) ||
    (arrivalHour <= 5 && departureHour <= 5)
  ) {
    dayTime = 00;
    nightTime = Math.abs(arrivalTimeMinutes - departureTimeMinutes);
  } else if (
    ( departureHour > arrivalHour && arrivalHour >= 5 && arrivalHour <= 21 && departureHour <=  22)
  ) {
    console.log("entrei aqui");
    nightTime = 00;
    dayTime = Math.abs(arrivalTimeMinutes - departureTimeMinutes);
  }else if(arrivalHour >= 22 && departureHour > 5){
    console.log('to nesse')
    nightTime = Math.abs(arrivalTimeMinutes - (24*60)) + 300;
    dayTime = Math.abs((departureTimeMinutes) - (5*60));
  }else if(arrivalHour < 22 && departureHour > 5){
    console.log('to aqui xx')
    nightTime = 420;
    dayTime = Math.abs(arrivalTimeMinutes - (1320)) + Math.abs(departureTimeMinutes - 300 )
  }
  //caso horario de saida === horario entrada mando uma mensagem de erro pois o
  //tempo de trabalho não pode ultrapassar 24 horas

  if (arrivalHour == departureHour) {
    return response
      .status(400)
      .json({ message: "Horas de trabalho excederam 24 horas!" });
  }

  return response.status(201).json({
    date: date,
    arrivalHour: arrivalTime,
    departureHour: departureTime,
    dayTimeHours: `${Math.floor(dayTime / 60)} : ${dayTime % 60}`,
    nightTimeHours: `${Math.floor(nightTime / 60)} : ${nightTime % 60}`,

    //workHours: `${workHours}:${workMinutes}`,
  });
});
app.listen(porta, () => console.log("server started on port 3333!"));
