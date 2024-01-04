// Get references to HTML elements
let city = document.getElementById("citytext");
let searchBtn = document.getElementById("searchbtn");
let apiKey = "412c294f475f2927ec8a04b5412df1e6";
let cityChosen = city.value.trim();

// on button click
function preSearch() {
    cityChosen = city.value.trim();

    // Check if the city input is empty
    if (cityChosen === "") {
        window.alert('Please choose a valid city');
    } else {
        // Trigger the weather search and update history
        searchCity(cityChosen);
        addItem(cityChosen);
    }
}

// add a city to the search history
function addItem(cityName) {
    // Get existing items from local storage
    var items = JSON.parse(localStorage.getItem('items')) || [];

    // Add the new item to the array
    if (typeof cityName === 'string') {
        items.push(cityName);

        // Save
        localStorage.setItem('items', JSON.stringify(items));

        // Update the displayed list
        updateList();
    } else {
        console.error('Error :(');
    }
}

// update the displayed search history list
function updateList() {
    var itemList = document.getElementById('history');
    itemList.innerHTML = ''; // Clear the current list

    // Get the items from local storage
    var items = JSON.parse(localStorage.getItem('items')) || [];

    // Populate the list with items
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

// search for weather data of a city
function searchCity(cityToSearch) {
    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + cityToSearch + '&limit=1&appid=' + apiKey)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.length > 0) {
                longitude = data[0].lon;
                latitude = data[0].lat;
                // Display current weather and 5-day forecast
                displayDataCur(latitude, longitude);
                display5day(latitude, longitude);
            } else {
                console.error('City not found');
            }
        });
}

// display current weather data
function displayDataCur(latitude, longitude) {
    fetch('https://api.openweathermap.org/data/2.5/weather?units=metric&lat=' + latitude + "&lon=" + longitude + "&appid=" + apiKey)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Format the current date
            let dayjsDate = dayjs().format('MMM-D-YYYY');
            // Get references
            let cityName = document.getElementById('cityName');
            let curDate = document.getElementById('curDate');
            let curTemp = document.getElementById('curTemp');
            let curWind = document.getElementById('curWind');
            let curHum = document.getElementById('curHum');
            let curIcon = document.getElementById('curIcon');

            // Update HTML elements with received weather data
            cityName.textContent = data.name;
            curDate.textContent = dayjsDate;
            curTemp.textContent = "Temperature: " + data.main.temp + "°C";
            curWind.textContent = "Wind: " + data.wind.speed + "M/S";
            curHum.textContent = "Humidity: " + data.main.humidity + "%";
            curIcon.src = 'https://openweathermap.org/img/w/' + data.weather[0].icon + '.png';
        });
}

// display 5-day forecast data
function display5day(latitude, longitude) {
    fetch('https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=' + latitude + "&lon=" + longitude + "&appid=" + apiKey)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Get the list
            let daysList = data.list;

            // Loop through the forecast data
            for (let i = 0; i < daysList.length; i += 8) {
                let j = i / 8;
                let dateOnly = daysList[i].dt_txt;
                dateOnly = dateOnly.split(" ");
                dateOnly = dateOnly[0];

                // Get references
                let date = document.getElementById('date' + j);
                let temperature = document.getElementById('temp' + j);
                let wind = document.getElementById('wind' + j);
                let humidity = document.getElementById('hum' + j);
                let icon = document.getElementById('icon' + j);

                // Update HTML elements
                date.textContent = dateOnly;
                temperature.textContent = 'Temp: ' + daysList[i].main.temp;
                wind.textContent = 'Wind Speed: ' + daysList[i].wind.speed;
                humidity.textContent = 'Humidity: ' + daysList[i].main.humidity + "%";
                icon.src = 'https://openweathermap.org/img/w/' + daysList[i].weather[0].icon + '.png';
            }
        });
}

// search button
searchBtn.addEventListener("click", preSearch);
