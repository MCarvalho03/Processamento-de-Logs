import * as fs from 'fs';
import * as path from 'path';

const dirFile = path.join(process.cwd(), "./data.json"); //process.cwd() para que eu não precise digitar todo o caminho da pasta, que não funcionaria bem no docker
const data = fs.readFileSync(dirFile, 'utf8');
const timesheetLogs = JSON.parse(data);

//console.log(timesheetLogs.taskName);
//se minute => 0 add in notValid[]
//else add in vali
let validsLogs = [];
let invalidLogs = [];
let top3WorkedPercentage = [];
let totalMinutesOffAllTasks: number = 0;
let EmployessTop3;

for (let i = 0; i < timesheetLogs.length; i++){

    if(timesheetLogs[i].minutes <= 0){

        invalidLogs.push(timesheetLogs[i]);

    }else if(timesheetLogs[i].minutes > 0){

        validsLogs.push(timesheetLogs[i]);
    }
}

// console.log(validsLogs.length)
// console.log(invalidLogs.length)


let timeSLogsbyTaskId: Record<number, {taskName:string, totalMinutes:number}> = {}

for(const validsLog of validsLogs){
    let {taskId, taskName, minutes} = validsLog;
    if(!timeSLogsbyTaskId[taskId]){// caso a task ainda nao exista, cria a task com o id, nome e minutos
        timeSLogsbyTaskId[taskId]={taskName:taskName, totalMinutes: minutes}
    }else{//caso ja exista, soma os minutos
        timeSLogsbyTaskId[taskId].totalMinutes += minutes;
    }
}
//console.log("tasks:",timeSLogsbyTaskId);


let  arrayTimeSLogsbyTaskId = Object.entries(timeSLogsbyTaskId)
.map(([taskId, values])=>{
    return{
        taskId: Number(taskId),
        taskName: values.taskName,
        totalMinutes: values.totalMinutes
    }
});

for(let i = 0; i < arrayTimeSLogsbyTaskId.length; i++){
    totalMinutesOffAllTasks += arrayTimeSLogsbyTaskId[i]!.totalMinutes;//! para garantir ao typescritp que o vetor existe 
}


arrayTimeSLogsbyTaskId.sort((a, b)=> {
    if(b.totalMinutes !== a.totalMinutes)
    {
        return b.totalMinutes - a.totalMinutes;
    }
    return a.totalMinutes - b.totalMinutes
} );

// console.log("total minutes:", totalMinutesOffAllTasks);
// console.log("tasks", arrayTimeSLogsbyTaskId);

let mostWorkedTask = arrayTimeSLogsbyTaskId[0];

//console.log("mostWorkedTask:", mostWorkedTask);

// percentage = totalMinutes * 100 / totalMinutesOffAllTasks
// percentage.toFixed(2)

top3WorkedPercentage = arrayTimeSLogsbyTaskId.slice(0, 3) //slice para pegar primeiros n numeros de um vetor
.map(arrayT =>({
    taskId: arrayT.taskId,
    taskName: arrayT.taskName,
    percentage: ((arrayT.totalMinutes * 100)/ totalMinutesOffAllTasks).toFixed(2)+"%"
}));

//console.log("top3TasksPercentage:", top3WorkedPercentage);

let employeesTop3: Record <number, {userName: string, totalMinutes: number} > = {}

for (const valids of validsLogs){
    let{userId, userName, minutes} = valids;
    
    if(!employeesTop3[userId]){
        employeesTop3[userId]={userName: userName, totalMinutes: minutes}
    }else{
        employeesTop3[userId].totalMinutes += minutes;
    }
}

let arrayEmployessTop3 = Object.entries(employeesTop3)
.map(([userId, values])=>{
    return{
        userId: Number(userId),
        userName: values.userName,
        totalMinutes: values.totalMinutes
    }
})


arrayEmployessTop3.sort((a, b)=>{
    if(b.totalMinutes !== a.totalMinutes)
    {
        return b.totalMinutes - a.totalMinutes;
    }
    return a.totalMinutes - b.totalMinutes
});

EmployessTop3 = arrayEmployessTop3.slice(0, 3)
.map(arrayEmp=>({
    userId: arrayEmp.userId,
    userName: arrayEmp.userName,
    totalMinutes: arrayEmp.totalMinutes
}));

console.log("top3Employees", EmployessTop3);

