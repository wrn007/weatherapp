let city = document.getElementById("citytext");
let searchBtn = document.getElementById("searchbtn");
let apiKey = "412c294f475f2927ec8a04b5412df1e6";
let cityChosen = city.value.trim();

function preSearch() {
    cityChosen = city.value.trim();

    if (cityChosen === "") {
        window.alert('Please choose a valid city');
    } else {
        searchCity(cityChosen);
        addItem(cityChosen);
    }
}

function addItem(cityName) {
    var items = JSON.parse(localStorage.getItem('items')) || [];

    if (typeof cityName === 'string') {
        items.push(cityName);
        localStorage.setItem('items', JSON.stringify(items));
        updateList();
    } else {
        console.error('Error :(');
    }
}

function updateList() {
    var itemList = document.getElementById('history');
    itemList.innerHTML = '';

    var items = JSON.parse(localStorage.getItem('items')) || [];

    items.forEach(function (item) {
        var button = document.createElement('button');
        button.textContent = item;
        button.onclick = function () {
            searchCity(item);
        };

        var li = document.createElement('li');
        li.appendChild(button);
        itemList.appendChild(li);
    });
}

updateList();

function searchCity(cityToSearch) {
    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + cityToSearch + '&limit=1&appid=' + apiKey)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.length > 0) {
                longitude = data[0].lon;
                latitude = data[0].lat;
                displayDataCur(latitude, longitude);
                display5day(latitude, longitude);
            } else {
                console.error('City not found');
            }
        });
}

function displayDataCur(latitude, longitude) {
    fetch('https://api.openweathermap.org/data/2.5/weather?units=metric&lat=' + latitude + "&lon=" + longitude + "&appid=" + apiKey)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let dayjsDate = dayjs().format('MMM-D-YYYY');
            let cityName = document.getElementById('cityName');
            let curDate = document.getElementById('curDate');
            let curTemp = document.getElementById('curTemp');
            let curWind = document.getElementById('curWind');
            let curHum = document.getElementById('curHum');
            let curIcon = document.getElementById('curIcon');
            cityName.textContent = data.name;
            curDate.textContent = dayjsDate;
            curTemp.textContent = "Temperature: " + data.main.temp + "°C";
            curWind.textContent = "Wind: " + data.wind.speed + "M/S";
            curHum.textContent = "Humidity: " + data.main.humidity + "%";
            curIcon.src = 'https://openweathermap.org/img/w/' + data.weather[0].icon + '.png';
        });
}

function display5day(latitude, longitude) {
    fetch('https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=' + latitude + "&lon=" + longitude + "&appid=" + apiKey)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let daysList = data.list;
            for (let i = 0; i < daysList.length; i += 8) {
                let j = i / 8;
                let dateOnly = daysList[i].dt_txt;
                dateOnly = dateOnly.split(" ");
                dateOnly = dateOnly[0];
                let date = document.getElementById('date' + j);
                date.textContent = dateOnly;
                let temperature = document.getElementById('temp' + j);
                temperature.textContent = 'Temp: ' + daysList[i].main.temp;
                let wind = document.getElementById('wind' + j);
                wind.textContent = 'Wind Speed: ' + daysList[i].wind.speed;
                let humidity = document.getElementById('hum' + j);
                humidity.textContent = 'Humidity: ' + daysList[i].main.humidity + "%";
                let icon = document.getElementById('icon' + j);
                icon.src = 'https://openweathermap.org/img/w/' + daysList[i].weather[0].icon + '.png';
            }
        });
}

searchBtn.addEventListener("click", preSearch);
