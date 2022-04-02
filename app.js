const store = function() {
    let exchangeRate = [];
    return {
        setData: newData => exchangeRate = newData,
        getData: () => exchangeRate
    }
}();

(() => {
    const currentDate = localStorage.getItem('currentDate');
    let searchData;
    if (!currentDate) {
        document.getElementById('start').valueAsDate = new Date();
        let dateValue = document.getElementById('start').value;
        searchData = dateValue.split("-").join("");
    }
    else {
        searchData = currentDate;
    }
    console.log(searchData);
    document.getElementById('start').value = searchData.slice(0, 4) + '-' + searchData.slice(4,6) + '-' + searchData.slice(6, 8);
    
    fetchExchangeData(searchData);
})()

function renderExchangeRate(exchangeRate) {
    let htmlStr = '';
    for(let currency of exchangeRate) {
        htmlStr += `<tr>
                <td>${currency.name}</td>
                <td>${currency.capital}</td>
                <td>${currency.rate}</td>
                <td>${currency.exchangedate}</td>
            </tr>`
    }
    document.querySelector('.table tbody').innerHTML = htmlStr;
}
function renderCountryRate(countryRate) {
    let htmlStr = '';
    for(let currency of countryRate) {
        htmlStr += `<tr>
                <option>${currency.capital}</option>
            </tr>`
    }
    document.querySelector('form select').innerHTML = htmlStr;
    
}
function setListeners(mappedExchangeRate) {
    document.getElementById('convert').onclick = () => {
        let selectedNumber = document.getElementById('inputNumber').value;
        if (selectedNumber < 1 ) {
            alert('Введіть додатнє число');
            document.getElementById('inputNumber').value = 1;
            selectedNumber = 1;
        }
        let selectedValue = document.querySelector('form select').value;
        console.log(selectedValue);
        let filteredCurrencies = mappedExchangeRate.filter(currency => {
            return currency.capital === selectedValue;
        });
        let valute = filteredCurrencies[0].rate;
        let result = selectedNumber*valute;
        result = result.toFixed(2);
        console.log(selectedNumber + "*" + filteredCurrencies[0].rate + "=" + result);
        let htmlH3 = 'Result:   ' + result;
        document.querySelector('h3').innerHTML = htmlH3;
    }
}

document.getElementById('start').oninput = event => {
    let dateValue = event.currentTarget.value;
    dateValue = dateValue.split("-").join("");
    let now = new Date().toLocaleDateString();
    var arr = now.split(".").reverse();
    console.log(now);
    console.log(arr);
    let searchData = dateValue.split("-").join("");
    if (dateValue > arr.join("")) {
        document.getElementById('start').value = arr.join("-");
        searchData = arr.join("");
        alert("Курс валют відображаться тільки за дати, які вже були або за сьогодні. Виберіть дату, яка підходить!")
    }
    console.log(dateValue, searchData);
    localStorage.setItem('currentDate', searchData);
    fetchExchangeData(searchData);
}

function fetchExchangeData(searchData) {
    fetch(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${searchData}&json`)
        .then(res => res.json())
        .then(data => {
            let mappedExchangeRate = data.map(currency => ({
                name: currency.cc,
                capital: currency.txt,
                rate: currency.rate,
                exchangedate: currency.exchangedate,
            }));
            store.setData(mappedExchangeRate);
            // console.log(mappedExchangeRate);
            renderExchangeRate(mappedExchangeRate);
            renderCountryRate(mappedExchangeRate);
            setListeners(mappedExchangeRate);
        });
}
