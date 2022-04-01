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
        searchData = document.getElementById('start').value.slice(0, 4) + document.getElementById('start').value.slice(5, 7) + document.getElementById('start').value.slice(8);
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
function setListeners(mappedCountryRate) {
    document.getElementById('convert').onclick = () => {
        let selectedNumber = document.getElementById('inputNumber').value;
        console.log(selectedNumber);
        let selectedValue = document.querySelector('form select').value;
        console.log(selectedValue);
        console.log(mappedCountryRate);
        let filteredCurrencies = mappedCountryRate.filter(currency => {
            return currency.capital === selectedValue;
        });
        console.log(filteredCurrencies[0].rate);
        let valute = filteredCurrencies[0].rate;
        let result = selectedNumber*valute;
        result = result.toFixed(2);
        console.log(result);
        let htmlH3 = 'Result:   ' + result;
        document.querySelector('h3').innerHTML = htmlH3;
    }
}

document.getElementById('start').oninput = event => {
    const searchData = event.currentTarget.value.slice(0, 4) + event.currentTarget.value.slice(5, 7) + event.currentTarget.value.slice(8);
    console.log(searchData);
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
            let mappedCountryRate = data.map (currency => ({
                capital: currency.txt,
                rate: currency.rate,
            }))
            store.setData(mappedExchangeRate);
            console.log(mappedCountryRate);
            renderExchangeRate(mappedExchangeRate);
            renderCountryRate(mappedCountryRate);
            setListeners(mappedCountryRate);
        });
}
