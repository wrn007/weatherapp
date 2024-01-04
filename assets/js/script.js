let city = document.getElementById("citytext");
let searchBtn = document.getElementById("searchbtn");
let apiKey = "412c294f475f2927ec8a04b5412df1e6";
let cityChosen = city.value.trim();

function preSearch() {
    cityChosen = city.value.trim();

    if (cityChosen === "") {
        window.alert('Please choose a valid city');
    } else {
        console.log("Button works");
        searchCity(cityChosen);
        addItem(cityChosen);
    }
}

function addItem(cityName) {
    // Get existing items from local storage or initialize an empty array
    var items = JSON.parse(localStorage.getItem('items')) || [];

    // Add the new item (city name) to the array if it's a string
    if (typeof cityName === 'string') {
        items.push(cityName);

        // Save the updated array back to local storage
        localStorage.setItem('items', JSON.stringify(items));

        // Update the displayed list
        updateList();
    } else {
        console.error('Error :(');
    }
}

function updateList() {
    var itemList = document.getElementById('history');
    itemList.innerHTML = ''; // Clear the current list

    // Get the items from local storage
    var items = JSON.parse(localStorage.getItem('items')) || [];

    // Populate the list with items, each as a button triggering the weather script
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

// Initial update of the list when the page loads
updateList();

function searchCity(cityToSearch) {
    console.log(cityToSearch + "2");
    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + cityToSearch + '&limit=1&appid=' + apiKey)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.length > 0) {
                longitude = data[0].lon;
                latitude = data[0].lat;
                console.log(longitude);
                console.log(latitude);
                displayDataCur(latitude, longitude);
                display5day(latitude, longitude);
            } else {
                console.error('City not found');
            }
        });
}

function displayDataCur(latitude, longitude) {
    console.log(cityChosen + "3");
    fetch('https://api.openweathermap.org/data/2.5/weather?units=metric&lat=' + latitude + "&lon=" + longitude + "&appid=" + apiKey)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            let dayjsDate = dayjs().format('MMM-D-YYYY');
            let cityName = document.getElementById('cityName');
            let curDate = document.getElementById('curDate');
            let curTemp = document.getElementById('curTemp');
            let curWind = document.getElementById('curWind');
            let curHum = document.getElementById('curHum');
            cityName.textContent = cityChosen;
            curDate.textContent = dayjsDate;
            console.log(dayjsDate);
            curTemp.textContent = "Temperature: " + data.main.temp + "°C";
            console.log(data.main.temp);
            curWind.textContent = "Wind: " + data.wind.speed + "M/S";
            console.log(data.wind.speed);
            curHum.textContent = "Humidity: " + data.main.humidity + "%";
            console.log(data.main.humidity);
        });
}

function display5day(latitude, longitude) {
    console.log(cityChosen + "4");
    fetch('https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=' + latitude + "&lon=" + longitude + "&appid=" + apiKey)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
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
            }
        });
}

searchBtn.addEventListener("click", preSearch);

