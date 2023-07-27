//Переменные
const BASIC_URL = 'http://api.weatherstack.com/current?access_key=ccacbdcc060eb9ddf319fab04d0a8bc4'
const root = document.querySelector('.root');
const app = document.querySelector('.app');
const background = document.querySelector('.background')
const form = document.querySelector('.form');
const input = form.querySelector('.form__input');
const submitButton = form.querySelector('.form__submit');
const error = form.querySelector('.form__error');
let template = document.querySelector('#template').content.cloneNode(true);
let newForecast = template.querySelector('.weather');
let time = newForecast.querySelector('.weather__time');
let temperature = newForecast.querySelector('.weather__temperature');
let city = newForecast.querySelector('.weather__title');
let image = newForecast.querySelector('.weather__image');
let wind = newForecast.querySelector('.weather__wind');
let feelslike = newForecast.querySelector('.weather__feelslike');
let description = newForecast.querySelector('.weather__description');
let pressure = newForecast.querySelector('.weather__pressure');
let humidity = newForecast.querySelector('.weather__humidity');
let cloudcover = newForecast.querySelector('.weather__cloudcover');

//Создаем начальный объект для данных прогноза погоды
let obj = {
    city: localStorage.getItem('city') || obj.city,
    feelslike: 0,
    cloudcover: 0,
    temperature: 0,
    humidity: 0,
    weatherIcons: '',
    windSpeed: 1,
    pressure: 0,
    isDay: 0,
    description: '',
    localTime: '00:00',
    cloudcover: 0,
}


//Функция создание нового компонента на странице браузера
function createNewComponent() {
    app.append(newForecast)
    getData()
    getForecast(obj)

}
createNewComponent();

//Функция добавления первичных данных в разметку html
function getForecast(obj) {
    temperature.textContent = `${obj.temperature}°`;
    time.textContent = obj.localTime;
    city.textContent = obj.city;
    image.src = obj.weatherIcons;
    wind.textContent = `${obj.windSpeed} m/s`;
    feelslike.textContent = `Feels like ${obj.feelslike}°`;
    description.textContent = obj.descriptions;
    pressure.textContent = `${obj.pressure} mm`;
    humidity.textContent = `${obj.humidity}%`;
    cloudcover.textContent = `${obj.cloudcover}%`;
}

//Функция получения данных с сервера
async function getData() {
    document.getElementById('loader').style.display = 'flex';
    await fetch(`${BASIC_URL}&query=${obj.city}`)
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
            if (data.error) {
                // Отображение сообщения об ошибке пользователю
                console.log(`Ошибка: ${data.error.info}`);
            } else {
                let { location: {
                    name: city,
                    localtime: localTime
                },
                    current: {
                        feelslike,
                        cloudcover,
                        temperature,
                        humidity,
                        weather_icons: weatherIcons,
                        wind_speed: windSpeed,
                        pressure,
                        is_day: isDay,
                        weather_descriptions: descriptions,
                    }
                } = data
                obj = {
                    ...obj,
                    localTime,
                    feelslike,
                    cloudcover,
                    temperature,
                    humidity,
                    weatherIcons,
                    windSpeed,
                    pressure,
                    isDay,
                    descriptions: descriptions[0],
                    city
                }

                checkDayTime(obj)
            }
            document.getElementById('loader').style.display = 'none';
        })
        .catch(err => console.log(err))
        .finally(() => console.log('Сессия завершена'))
    getForecast(obj)
}

//Функция проверки времени суток
function checkDayTime(obj) {
    if (obj.isDay == 'no') {
        background.classList.add('background_night')
        submitButton.classList.add('form__submit_type_dark')
    } else {
        submitButton.classList.remove('form__submit_type_dark')
        background.classList.remove('background_night')
    }
}

//Функция валидации формы
function validateForm() {
    if (!input.validity.valid || input.value == null) {
        error.textContent = input.validationMessage;
        console.log(input.validationMessage)
        submitButton.disabled = true;
        submitButton.classList.add('form__submit_type_disabled')
        error.classList.add('form__error_visible')
    } else {
        submitButton.disabled = false;
        error.classList.remove('form__error_visible')
        submitButton.classList.remove('form__submit_type_disabled')
    }
}

//Функция сабмита формы
function submitForm(e) {
    e.preventDefault();
    validateForm()
    if (submitButton.disabled) {
        return
    }
    obj.city = input.value
    localStorage.setItem('city', obj.city);
    getData()
    getForecast(obj)
    resetForm(form)
}

//Функция сброса поля формы
function resetForm(form) {
    form.reset()
}

//Слушутели событий
input.addEventListener('input', () => {
    validateForm();
});
form.addEventListener('submit', submitForm);