//1
// form fields
const form = document.querySelector(".form-data");
const region = document.querySelector(".region-name");
const api = document.querySelector(".api-key");

// results divs
const errors = document.querySelector('.errors');
const loading = document.querySelector('.loading');
const results = document.querySelector('.result-container');
const usage = document.querySelector('.carbon-usage');
const fossilfuel = document.querySelector('.fossil-fuel');
const myregion = document.querySelector('.my-region');
const clearBtn = document.querySelector('.clear-btn');


//6
//call the API
async function displayCarbonUsage(apiKey, regionName) {
    try {
        const carbonIntensityUrl = new URL("https://api.electricitymaps.com/v3/carbon-intensity/latest");
        const electricityMixUrl = new URL("https://api.electricitymaps.com/v3/electricity-mix/latest");
        const params = {
            zone: regionName
        };
        carbonIntensityUrl.search = new URLSearchParams(params).toString();
        electricityMixUrl.search = new URLSearchParams(params).toString();
        const carbonIntensityResponse = await fetch(carbonIntensityUrl, {
            method: 'GET',
            headers: {
                'auth-token': apiKey,
                'Content-Type': 'application/json'
            }
		});

		// Check if the API request was successful
		if (!carbonIntensityResponse.ok) {
			throw new Error(`API request failed: ${carbonIntensityResponse.status}`);
		}

        const carbonIntensityData = await carbonIntensityResponse.json();
        const carbonIntensity = carbonIntensityData.carbonIntensity;
        calculateColor(carbonIntensity);

        const electricityMixResponse = await fetch(electricityMixUrl, {
            method: 'GET',
            headers: {
                'auth-token': apiKey,
                'Content-Type': 'application/json'
            }
		});

		// Check if the API request was successful
		if (!electricityMixResponse.ok) {
			throw new Error(`API request failed: ${electricityMixResponse.status}`);
		}

        const electricityMixData = await electricityMixResponse.json();
        const mix = electricityMixData.data[0].mix;

        const fossilTotal = 
            (mix.coal || 0) + 
            (mix.gas || 0) + 
            (mix.oil || 0) + 
            (mix.unknown || 0); // 'unknown' is usually treated as fossil to be safe

        // 2. Sum up everything to get the total
        const totalPower = Object.values(mix).reduce((a, b) => a + b, 0);

        // 3. Calculate percentage
        const fossilPercentage = (fossilTotal / totalPower) * 100;

        loading.style.display = 'none';
		form.style.display = 'none';
		myregion.textContent = regionName.toUpperCase();
		usage.textContent = `${carbonIntensity} grams (grams CO₂ emitted per kilowatt hour)`;
		fossilfuel.textContent = `${fossilPercentage.toFixed(2)}% (percentage of fossil fuels used to generate electricity)`;
		results.style.display = 'block';
    }
    catch (error) {
		console.error('Error fetching carbon data:', error);
		
		// Show user-friendly error message
		loading.style.display = 'none';
		results.style.display = 'none';
		errors.textContent = 'Sorry, we couldn\'t fetch data for that region. Please check your API key and region code.';
	}
}
//5
//set up user's api key and region
function setUpUser(apiKey, regionName) {
	// Save user credentials for future sessions
	localStorage.setItem('apiKey', apiKey);
	localStorage.setItem('regionName', regionName);
	
	// Update UI to show loading state
	loading.style.display = 'block';
	errors.textContent = '';
	clearBtn.style.display = 'block';
	
	// Fetch carbon usage data with user's credentials
	displayCarbonUsage(apiKey, regionName);
}

//4
// handle form submission
function handleSubmit(e) {
	e.preventDefault();
	setUpUser(api.value, region.value);
}

function calculateColor(value) {
	// Define CO2 intensity scale (grams per kWh)
	const co2Scale = [0, 150, 600, 750, 800];
	// Corresponding colors from green (clean) to dark brown (high carbon)
	const colors = ['#2AA364', '#F5EB4D', '#9E4229', '#381D02', '#381D02'];

	// Find the closest scale value to our input
	const closestNum = co2Scale.reduce((prev, curr) => {
		return (Math.abs(prev - value) < Math.abs(curr - value) ? prev : curr);
	});
	
	console.log(`${value} is closest to ${closestNum}`);
	
	// Find the index for color mapping
	const num = (element) => element > closestNum;
	const scaleIndex = co2Scale.findIndex(num);

	const closestColor = colors[scaleIndex];
	console.log(scaleIndex, closestColor);

	// Send color update message to background script
	chrome.runtime.sendMessage({ action: 'updateIcon', value: { color: closestColor } });
}

//3 initial checks
function init(){
    const storedRegion = localStorage.getItem('regionName');
    const storedApiKey = localStorage.getItem('apiKey');

    if (storedRegion === null || storedApiKey === null) {
        form.style.display = 'block';
		results.style.display = 'none';
		loading.style.display = 'none';
		clearBtn.style.display = 'none';
		errors.textContent = '';
    }
    else {
        displayCarbonUsage(storedApiKey, storedRegion);
        results.style.display = 'none';
		form.style.display = 'none';
		clearBtn.style.display = 'block';
    }

    chrome.runtime.sendMessage({
        action: 'updateIcon',
        value: {
            color: 'green',
        },
    });
}

function reset(e) {
    e.preventDefault();

    localStorage.removeItem("regionName");

    init();
}
//2
// set listeners and start app
form.addEventListener("submit", (e) => handleSubmit(e));
clearBtn.addEventListener("click", (e) => reset(e));
init();