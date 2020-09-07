const express = require("express");

const app = express();

//Converter body das requisições para json
app.use(express.json());

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

  if (arrivalHour > departureHour) {
    //Valida de 5:01 a 4:59
    if (departureHour <= 5 && arrivalHour < 22) {
      //Como tenho a certeza que a hora de chegada esta entre 5 e 22 basta so di
      //minuir a hora de chegada por 22

      dayTimeHours = Math.abs(arrivalHour - 22);
      nightTimeHours = Math.abs(24 + departureHour - 22);

      //Nesse caso o tempo em minutos sempre sera acrescentado
      nightTimeMinutes = departureMinute;
      dayTimeMinutes = arrivalMinute;

      //Se o horario de chegada for quebrado diminuo um das horas e acrescento
      //os minutos
      if (arrivalMinute > 0) {
        dayTimeHours--;
        dayTimeMinutes = arrivalMinute - 60;
      }
      if (departureMinute > 0) {
        nightTimeMinutes = departureMinute;
      }
    } else if(departureHour > 5) {
      
    }
  }else{

  }
  //Calculo de horas diurnas
  /*
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
*/
  return response.status(201).json({
    workHours: `${workHours}:${workMinutes}`,
    dayTimeHours: `${dayTimeHours}:${Math.abs(dayTimeMinutes)}`,
    nightTimeHours: `${nightTimeHours}:${nightTimeMinutes}`,
  });
});

app.listen(3333, () => console.log("server started on port 3033!"));

//Verifico se hora de chegada é maior que hora de saida, se sim tenho que alte
//rar o calculo
/*
  if (arrivalHour > departureHour) {
    workHours = Math.abs(arrivalHour - departureHour - 24);
  } else {
    workHours = Math.abs(arrivalHour - departureHour);
  }
  */
