// //usin setTimeout function => this will print anything on as given certain time

// setTimeout(function(){
//     console.log("this will print after 3 second");
    
// }, 3000)

function getCandies(callback1){
    setTimeout(() => {
        const candies = "🍬"
        console.log("this is my candy", candies);
        callback1(candies)
    }, 3000);
}

getCandies((candies) => {
    console.log("there is our candy", candies);
})