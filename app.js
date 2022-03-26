const store = function() {
    let exchangeRate = [];
    return {
        setData: newData => exchangeRate = newData,
        getData: () => exchangeRate
    }
}();

(() => {
    const currentDate = localStorage.getItem('currentDate');
    let searchData = currentDate;
    if (!currentDate) {
        document.getElementById('start').valueAsDate = new Date();
        searchData = document.getElementById('start').value.replace(/-/g, "");
    }
    
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
            store.setData(mappedExchangeRate);
            renderExchangeRate(mappedExchangeRate);
        });
}
