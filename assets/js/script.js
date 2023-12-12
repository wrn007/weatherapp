let city = document.getElementById("citytext");
let searchBtn = document.getElementById("searchbtn");
let apiKey="412c294f475f2927ec8a04b5412df1e6";

function search() {
   
    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + apiKey)
   
   let longitude = data.lon
   let latitude = data.lat
   fetch('api.openweathermap.org/data/2.5/forecast?lat=' + latitude + "&lon=" + longitude + "&appid=" + apiKey)
    .then(function (response) {
        return response.json();
    })
    .then(function(data){
        for (let i=0; i<data.length)
        let x=i+1;
    let temp = document.getElementById('temp' + x)
    let wind = document.getElementById('wind' + x)
    let hum = document.getElementById('hum' + x)
    temp.textContent = "Temp:" + main.temp + "C"
    }
    
    
    
    )
    
    
    for (var i = 0; i < data.length; i++) {
    textContent=data[i].
   }
}