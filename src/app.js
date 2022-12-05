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

const airlineURL = 'http://localhost:3000/airline';
const airportURL = 'http://localhost:3000/airport';
const cityURL = 'http://localhost:3000/city';
const countryURL = 'http://localhost:3000/country';
const matchedAirportsURL = 'http://localhost:3000/matchedairports';
var cities = [];
var matchedArray = [];

// first, we compile a list of city names
fetch(cityURL) 
    .then(response => response.json())
    .then(data => {
        data.forEach(article => {
            theName = article.name;
            theCoords = article.coordinates;
            cities.push({theName, theCoords}); 
            //dataDisplay.insertAdjacentHTML("beforeend", name) // ooooo a mystery line
        })
    })
    .then(console.log("cities: ", cities))

// find an airport for each selected flight
fetch(matchedAirportsURL) 
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        data.forEach(article => {
            city = article.city;
            airport = article.airport;
            matchedArray.push({city, airport}); 
            //dataDisplay.insertAdjacentHTML("beforeend", name) // ooooo a mystery line
        })

    })
    .then(console.log("matchedArray:", matchedArray));

function processInput(cityString, budgetString) {
    console.log(cityString);
    console.log(budgetString);
    budgetString =  budgetString.replace('$', '');
    let randomElement = Math.floor(Math.random() * 4) - 3;

    // validate input, get current position coordinates
    if(parseInt(budgetString) < 300) {
        alert("Please select a price of at least $300.");
        return;
    }
    let found = false;
    homeLatitude = 0;
    homeLongitude = 0;
    for(let i=0;  i<cities.length; i++) {
        if(cityString.toLowerCase() === cities[i].theName.toLowerCase()) {
            console.log("YEAH BABYYYYYYY");
            homeLatitude = cities[i].theCoords.lat;
            homeLongitude = cities[i].theCoords.lon;
            found = true;
            break;
        }
    }
    if(!found) {
        alert("Please enter a vlid city.");
        return;
    }
    console.log(homeLatitude);
    console.log(homeLongitude);

    // for each country, evaluate price
    priceList = [];
    for(let k=0; k<cities.length; k++) {
        tempName = cities[k].theName;
        destLat = cities[k].theCoords.lat;
        destLon = cities[k].theCoords.lon;
        tempPrice = calculatePrice(homeLatitude, homeLongitude, destLat, destLon);
        priceList.push(
            {
                tempName, 
                tempPrice
            }
        )
    }
    priceList.sort((a, b) => a.tempPrice - b.tempPrice);
    let priceNumber = (parseInt(budgetString) + randomElement);
    let filteredPriceList = priceList.filter(item => item.tempPrice < priceNumber);
    filteredPriceList = filteredPriceList.filter(item => item.tempPrice > 150);

    // select 10 interesting cities within the budget and calculate their price based on
    // Create a new empty array for the selected elements
    const selectedFlights = [];

    // Determine the number of elements in the array
    const numElements = filteredPriceList.length;

    // Set the interval between selected elements
    const interval = Math.floor(numElements / 9);

    // Select the remaining elements at regular intervals
    if (filteredPriceList.length > 10) {
        // Select the first element
        selectedFlights.push(filteredPriceList[0]);

        for (let i = interval, j = 0; i < numElements && i<filteredPriceList.length, j < 9; i += interval, j++) {
            selectedFlights.push(filteredPriceList[i]);
            
        }
    }
    else {
        selectedFlights = filteredPriceList;
    }
    
    console.log(selectedFlights);

    // filter matched array based on city
    let homeMatches = matchedArray.filter(item => item.city == cityString);
    let homeData = homeMatches[0];
    let awayData = [];
    for(let k=0; k<selectedFlights.length; k++) {
        tempArray = matchedArray.filter(item => item.city == selectedFlights[k].tempName);
        awayData.push(tempArray[0]);
    }
    console.log(awayData);

    // constucting the final array
    let finalBoss = [];
    for(let j=0; j<awayData.length; j++) {
        currentCity = awayData[j].city;
        for(let k=0; k<filteredPriceList.length; k++) {
            if(filteredPriceList[k].tempName == currentCity) {
                finalBoss.push(
                    {
                        city: currentCity,
                        airport: awayData[j].airport,
                        price: filteredPriceList[k].tempPrice
                    }
                )
            }
        }
    }
    console.log(finalBoss);
    return finalBoss;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    // Convert the latitude and longitude values from degrees to radians
    lat1 = deg2rad(lat1);
    lon1 = deg2rad(lon1);
    lat2 = deg2rad(lat2);
    lon2 = deg2rad(lon2);
  
    // Calculate the difference between the latitude and longitude values
    const latDiff = lat2 - lat1;
    const lonDiff = lon2 - lon1;
  
    // Use the Haversine formula to calculate the linear distance in kilometers
    const a = Math.pow(Math.sin(latDiff / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(lonDiff / 2), 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = 6371 * c;
  
    return distance;
  }
  
  // Helper function to convert degrees to radians
  function deg2rad(degrees) {
    return degrees * (Math.PI / 180);
  }

function calculatePrice(homeLatitude, homeLongitude, destLatitude, destLongitude) {
    let distance = calculateDistance(homeLatitude, homeLongitude, destLatitude, destLongitude);
    let costPerKm = 250 / 3974.194541;
    return (Math.pow(distance, 1.15)*costPerKm+100);
} 

async function showStrings(strings) {
    // Calculate the number of rows and columns needed to display all the strings
    const numStrings = strings.length;
    const numRows = 20;
    const div = document.getElementById('strings');
    const divWidth = div.offsetWidth;
    const divHeight = div.offsetHeight;
    const numCols = 5; // Set the number of columns to 5
    
    // Loop over the fade-in and fade-out operations
    for (let i = 0; i < 8; i += 1) {
        // Randomly select a subset of the strings to display
        const numStringsToDisplay = numRows * numCols;
        const displayedStrings = new Set();
        while (displayedStrings.size < numStringsToDisplay) {
        const string = strings[Math.floor(Math.random() * numStrings)];
        if (!displayedStrings.has(string)) {
            displayedStrings.add(string);
        }
        }
    
        // Set the width and height of the div element to take up the whole screen
        div.style.width = '100%';
        div.style.height = '100%';
    
        // Use the CSS grid layout to arrange the p elements in a grid pattern
        div.style.display = 'grid';
        div.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;
        div.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;
    
        // Loop through the array of displayed strings and add them to the div element as p elements
        let j = 0;
        for (const string of displayedStrings) {
        // Create a new p element for the current string
        const p = document.createElement('p');
        p.textContent = string.toUpperCase(); // Convert the string to all caps
    
        // Add the p element to the div element
        div.appendChild(p);
    
        // Calculate the row and column where the p element should be placed
        const row = Math.floor(j / numCols);
        const col = j % numCols;
        p.style.gridRow = row + 1;
        p.style.gridColumn = col + 1;
    
        // Set a random delay before starting the fade-in and fade-out transitions for the p element
        p.style.transitionDelay = `${Math.random() * 2}s`;
    
        // Enable gradual fade-in and fade-out transitions by setting the transition property in the CSS
        p.style.transition = 'opacity 1s';
    
        // Increment the counter
        j += 1;
        }
    
        // Fade all the p elements in and out by changing their opacity
        const pElements = div.getElementsByTagName('p');
        for (const p of pElements) {
        p.style.opacity = 0;
        }
    await new Promise(resolve => setTimeout(resolve, 1));
    for (const p of pElements) {
        // Fade all the p elements in by setting their opacity to 1
        p.style.opacity = 1;
    }
    await new Promise(resolve => setTimeout(resolve, 1500));
    for (const p of pElements) {
        p.style.opacity = 0;
    }

        // Fade all the p elements out by setting their opacity to 0
        // Use a staggered fade-out transition by setting the transition-delay CSS property
        let delay = 0;
        for (const p of pElements) {
        p.style.transitionDelay = `${delay}s`;
        p.style.opacity = 0;
        delay += 0.2;
        }

        // Remove all the p elements from the div element
        while (div.firstChild) {
        div.removeChild(div.firstChild);
        }
    }
}

