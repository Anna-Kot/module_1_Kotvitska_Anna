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
        searchData = document.getElementById('start').value.replace(/-/g, "");
    }
    else {
        searchData = currentDate;
    }
    console.log(searchData);
    let year = searchData.slice(0, 4);
    let month = searchData.slice(4,6);
    let day = searchData.slice(6, 8);
    // console.log(year, month, day);
    document.getElementById('start').value = year + '-' + month + '-' + day;

    // let rate = document.querySelector('form select').value;
    // console.log(rate);
    
    fetchExchangeData(searchData);
})()
// (() => {
//     let rate = document.querySelector('select').value;
//     fetchExchangeData(searchData);
// })()
let mySelectOption = getValue; // - полученное из функции значение прсвоим в переменную и используем где нужно))

function getValue(){
let selectedValue = document.querySelector('form select').value;
// const result = words.filter(word => word.length > 6);
console.log(selectedValue);
return selectedValue;
}
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


document.getElementById('start').oninput = e => {
    const searchData = e.currentTarget.value.replace(/-/g, "");
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
            }));
            let mappedCountryRateNeed = data.filter (currency => currency.value);
            console.log(mappedCountryRate);
            console.log(mappedCountryRateNeed);
            // let rate = document.querySelector('form select').value;
            // console.log(rate);
            getValue(mappedCountryRateNeed)
            getValue(mappedCountryRate)
            store.setData(mappedExchangeRate);
            renderExchangeRate(mappedExchangeRate);
            renderCountryRate(mappedCountryRate);
        });
}
