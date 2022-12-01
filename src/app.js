//accessing api server

const dataDisplay = document.querySelector('#root')

/*fetch('http://localhost:3000/region')
    .then(response => response.json())
    .then(data => {
        data.forEach(article => {
            const rname = '<h3>' + article.r_name + '</h3>'
            dataDisplay.insertAdjacentHTML("beforeend", rname)
        })
    })*/

fetch('http://localhost:3000/airline') //example to get names of airlines
    .then(response => response.json())
    .then(data => {
        data.forEach(article => {
            const name = '<h3>' + article.name + '</h3>'
            dataDisplay.insertAdjacentHTML("beforeend", name)
        })
    })

    
    //.catch(err => console.log(err))
