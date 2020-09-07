const express = require("express");

const app = express();

//Converter body das requisições para json
app.use(express.json());

app.post("/calcularHorario", (request, response) => {
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
    nightTimeMinutes;
  //caso horario de saida === horario entrada

  if (departureHour > arrivalHour) {
    if (arrivalHour < 5 && departureHour >= 22) {
      nightTimeHours = Math.abs(5 - arrivalHour) + Math.abs(departureHour - 22);
      nightTimeMinutes = departureMinute;

      //Se a soma dos minutos de chegada com minutos de saida forem > 60 dev
      //e acrescentar um as horas noturnas e o resto da divisão dessa somo p
      //or 60 serão os minutos noturno
      dayTimeHours;
      if (arrivalMinute + departureMinute >= 60) {
        nightTimeHours++;
        nightTimeMinutes = (arrivalMinute + departureMinute) % 60;
      }

      //Nesse caso hora diurno sempre vai ser o maximo trabalhado
      dayTimeHours = 18;
      dayTimeMinutes = 00;
    } else if (arrivalHour > 5 && departureHour >= 22) {
      dayTimeHours =
        Math.abs(arrivalHour - departureHour) - Math.abs(departureHour - 22);
      //Se minuto for maior que 0 a hora ira diminuir um
      if (arrivalMinute > 0) {
        dayTimeHours--;
        dayTimeMinutes = Math.abs(arrivalMinute - 60);
      }

      //Como horario de saida sempre sera > 22 e entrada < 5
      nightTimeHours = Math.abs(departureHour - 22);
      nightTimeMinutes = departureMinute;
    } else {
      //Como a hora é < 22 so vai ter horario noturno se a hora de chegada for
      //inferior a 5
      if (arrivalHour > 5) {
        nightTimeHours = 00;
        nightTimeMinutes = 00;
        dayTimeHours = Math.abs(departureHour - arrivalHour);
        //Minutos de dia de trabalho vão sempre ser a diferença dos minutos de
        //saida ate os minutos de chegada
        dayTimeMinutes = Math.abs(arrivalMinute - departureMinute);
      } else {
        nightTimeHours = Math.abs(arrivalHour - 5);
        /*Já se os minutos de trabalho noturno forem maior que 0 tenho que tirar
        1 das horas noturnos e para achar os minutos tenho que fazer 60 - hora
        chegada
        */
        if (arrivalMinute > 0) {
          nightTimeHours--;
          nightTimeMinutes = Math.abs(arrivalMinute - 60);
        }
        //Os minutos diurno sempre serão igual ao minuto de saida
        dayTimeMinutes = departureMinute;
        //
        dayTimeHours =
          Math.abs(departureHour - arrivalHour) - Math.abs(5 - arrivalHour);
      }
    }
  } else if (arrivalHour > departureHour) {
    if (arrivalHour < 22) {
      if (departureHour >= 5) {
        //Se ele saiu depois da 5 e entrou antes das 22 logo ele trabalhou todo
        // o turno da noite
        nightTimeHours = 07;
        nightTimeMinutes = 00;
        dayTimeHours = Math.abs(22 - arrivalHour) + Math.abs(5 - departureHour);

        
        if(arrivalMinute + departureMinute >= 60){
          dayTimeMinutes = arrivalMinute - departureMinute;
          //dayTimeMinutes = (arrivalMinute+departureMinute)%60;
        }else if(arrivalMinute > 0){
            dayTimeHours--;
            dayTimeMinutes = arrivalMinute + departureMinute;
        }
      } else{
        dayTimeHours = Math.abs(22 - arrivalHour);
        dayTimeMinutes = arrivalMinute;
        if (arrivalMinute && departureMinute) {
          dayTimeHours--;
        }
        nightTimeHours = Math.abs(2 + departureHour);
        nightTimeMinutes = departureMinute;
      }
    }else{
      if(departureHour <= 5 ){
        /*Como esse periodo é compreendido entre 22 e 5 horas , o horario diurn
        é nulo */
        dayTimeHours =00;
        dayTimeMinutes =00;
        nightTimeHours = arrivalHour ===  22  ?  Math.abs(arrivalHour -24) + departureHour : Math.abs(arrivalHour - 22) + departureHour;
        nightTimeMinutes = departureMinute + arrivalMinute;

        if(arrivalMinute + departureMinute >=60){
           nightTimeHours++;
           nightTimeMinutes = (departureMinute + arrivalMinute) %60;
        }
      }else{
        /*Se o funcionario chegou apos as 22 e saiu depois das 5 da manhã ela tr
        alhou uma parte no perido da noite e outra no diurno , logo*/
        nightTimeHours =  Math.abs(arrivalHour - 24) + 5;
        nightTimeMinutes = arrivalMinute;


        dayTimeHours =Math.abs(5 - departureHour);
        dayTimeMinutes = departureMinute;
      }

    }
  } /*Caso de horaSaida===horaEntrda */ else {
  }

  return response.status(201).json({
    workHours: `${workHours}:${workMinutes}`,
    dayTimeHours: `${dayTimeHours}:${Math.abs(
      dayTimeMinutes ? dayTimeMinutes : "00"
    )}`,
    nightTimeHours: `${nightTimeHours}:${
      nightTimeMinutes ? nightTimeMinutes : "00"
    }`,
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
