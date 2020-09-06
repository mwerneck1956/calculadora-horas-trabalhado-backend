const express = require("express");

const app = express();

//Converter body das requisições para json
app.use(express.json());


function calcularHorario(request,response){
  
    const {arrivalTime , departureTime } = request.body
}

app.post("/calcularHorario", (request, response) => {
  //Fazer tratamento quando horas forem iguais
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
    nightTimeMinutes;

  //Verifico se hora de chegada é maior que hora de saida, se sim tenho que alte
  //rar o calculo
  /*
  if (arrivalHour > departureHour) {
    workHours = Math.abs(arrivalHour - departureHour - 24);
  } else {
    workHours = Math.abs(arrivalHour - departureHour);
  }
  */

  /**
   * Horario das 18:20 as 6:59
   * horarioDiruno = mod(horarioComeço - horarioDiurnoMax)240 + mod(horarioNoturnoMax - horarioSaida)
   * primeiro horario : 18:20 as 22
   * segunda horario : 5 as 6 :59 */ 
  if (arrivalHour >= departureHour) {
    if (departureHour <= 5) {
      nightTimeHours = Math.abs(22 - departureHour - 24);
      dayTimeHours = Math.abs(arrivalHour - 22);
    } else {
      nightTimeHours = 7;
      dayTimeHours = Math.abs(22 - arrivalHour + departureHour - 5);
    }
  } else if (departureHour > arrivalHour) {
    dayTimeHours = Math.abs(arrivalHour - 22);
    nightTimeHours = departureHour - 22;
  }
  
  workMinutes = Math.abs(arrivalMinute - departureMinute);

  return response.status(201).json({
    workHours: `${workHours}:${workMinutes}`,
    dayTimeHours: `${dayTimeHours}:${Math.abs(arrivalMinute)}`,
    nightTimeHours: nightTimeHours,
  });
});

app.listen(3333, () => console.log("server started on port 3033!"));

360 / 60;
