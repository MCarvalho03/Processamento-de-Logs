import * as fs from 'fs';
import * as path from 'path';

const dirFile = path.join(process.cwd(), "./data.json"); 
const data = fs.readFileSync(dirFile, 'utf8');
const timesheetLogs = JSON.parse(data);

let validsLogs = [];
let invalidLogs = [];
let top3WorkedPercentage = [];
let totalMinutesOffAllTasks: number = 0;
let EmployessTop3;
let mostTaskPerFunc;

for (let i = 0; i < timesheetLogs.length; i++){

    if(timesheetLogs[i].minutes <= 0){

        invalidLogs.push(timesheetLogs[i]);

    }else if(timesheetLogs[i].minutes > 0){

        validsLogs.push(timesheetLogs[i]);
    }
}


let timeSLogsbyTaskId: Record<number, {taskName:string, totalMinutes:number}> = {}

for(const validsLog of validsLogs){
    let {taskId, taskName, minutes} = validsLog;
    if(!timeSLogsbyTaskId[taskId]){
        timeSLogsbyTaskId[taskId]={taskName:taskName, totalMinutes: minutes}
    }else{
        timeSLogsbyTaskId[taskId].totalMinutes += minutes;
    }
}



let  arrayTimeSLogsbyTaskId = Object.entries(timeSLogsbyTaskId)
.map(([taskId, values])=>{
    return{
        taskId: Number(taskId),
        taskName: values.taskName,
        totalMinutes: values.totalMinutes
    }
});

for(let i = 0; i < arrayTimeSLogsbyTaskId.length; i++){
    totalMinutesOffAllTasks += arrayTimeSLogsbyTaskId[i]!.totalMinutes;
}


arrayTimeSLogsbyTaskId.sort((a, b)=> {
    if(b.totalMinutes !== a.totalMinutes)
    {
        return b.totalMinutes - a.totalMinutes;
    }
    return a.totalMinutes - b.totalMinutes
} );


let mostWorkedTask = arrayTimeSLogsbyTaskId[0];


top3WorkedPercentage = arrayTimeSLogsbyTaskId.slice(0, 3)
.map(arrayT =>({
    taskId: arrayT.taskId,
    taskName: arrayT.taskName,
    percentage: ((arrayT.totalMinutes * 100)/ totalMinutesOffAllTasks).toFixed(2)+"%"
}));


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


for (const valids of validsLogs){
    let{userId, userName, minutes} = valids;
    
    if(!employeesTop3[userId]){
        employeesTop3[userId]={userName: userName, totalMinutes: minutes}
    }else{
        employeesTop3[userId].totalMinutes += minutes;
    }
}


let mostDistinctTaskPerFunc: Record <number,{userName: string, task:number [] }> = {}

for (const valids of validsLogs){
    let{userId, userName, taskId} = valids;
    
    if(!mostDistinctTaskPerFunc[userId]){
        mostDistinctTaskPerFunc[userId]={userName: userName, task: [taskId]}
    }else{
        if(!mostDistinctTaskPerFunc[userId].task.includes(taskId))
            mostDistinctTaskPerFunc[userId].task.push(taskId);
    }
}

let arrayMosDistTask = Object.entries(mostDistinctTaskPerFunc)
.map(([userId, values]) =>{
    return{
        userId: Number(userId),
        username: values.userName,
        tasksIds: values.task
    }
} )

arrayMosDistTask.sort((a, b)=>{
    if(b.tasksIds.length !== a.tasksIds.length){
        return b.tasksIds.length - a.tasksIds.length;
    }
    return a.userId -  b.userId
})

mostTaskPerFunc = arrayMosDistTask.slice(0)
.map(arrMost =>({
    userId: arrMost.userId,
    userName: arrMost.username,
    distinctTasks: arrMost.tasksIds.length,
    taskIds: [...arrMost.tasksIds].sort((a, b)=> a- b)
}))

const result ={
    totalMinutes: totalMinutesOffAllTasks,
    tasks: arrayTimeSLogsbyTaskId,
    mostWorkedTask: mostWorkedTask,
    top3TasksPercentage: top3WorkedPercentage,
    top3Employess: EmployessTop3,
    mostDistinctTaskPerFunc: mostTaskPerFunc[0],
    ignoredRecords: invalidLogs.length 
}

fs.writeFileSync("result.json", JSON.stringify(result, null, 2));