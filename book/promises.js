const ticket = new Promise(function(resolve, reject){
    const isBoarded = true;
    if(isBoarded){
        resolve("you are eligible to onboard");       
    }else{
        reject("you are not eligible to onboard");        
    }
})
ticket.then((data) => {
    console.log("good", data);
}).catch((data) => {
    console.log("sorry", data);
}).finally(() => {
    console.log("this will be executed all time");
})