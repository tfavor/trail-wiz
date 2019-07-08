const trailKey = '200507765-d555489db7aa873777c05ace340f460d';
const geoCodeApi = '122b0842140d449c8ba12fa2fbc35be5';
const geoCodeUrl = 'https://api.opencagedata.com/geocode/v1/json';
let trailsUrl = '';

/* choosing to look for hiking trails at the beginning */
function chooseHiking() {
    trailsUrl = 'https://www.hikingproject.com/data/get-trails';
    $("header").addClass('hidden');
    $(".nav-bar-container").removeClass('hidden');
    $(".main-search-container").removeClass('hidden');
    handleMainSubmit();
    console.log(trailsUrl);
}
/* choosing to look for biking trails at the beginning */
function chooseBiking() {
    trailsUrl = 'https://www.mtbproject.com/data/get-trails';
    $("header").addClass('hidden');
    $(".nav-bar-container").removeClass('hidden');
    $(".main-search-container").removeClass('hidden');
   handleMainSubmit();
    console.log(trailsUrl);
}

function choose() {
    $(".hike, .bike").on('click', function(event) {
        event.preventDefault();
        if (this.id == 'hiking') {
            chooseHiking();
        } else if (this.id == 'biking') {
            chooseBiking();
        }
    });
}

function handleMainSubmit() {
    $(".main-search-form").on('submit', function(event) {
        event.preventDefault();
        $(".main-search-container").addClass('hidden');
        $(".results-container").removeClass('hidden');
        let city = $('.main-location').val();
        callGeoCode(city);
    });
}
function change() {
}
function callGeoCode(city) {
    let url = geoCodeUrl + '?' +  geoCodeQueryString(city);
    console.log(url);
    fetch(url)
    .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => returnGeoCodeResults(responseJson))
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });
      console.log();
}

function geoCodeQueryString(city) {
    
    let params = {
        key: geoCodeApi,
        q: city
    };
    let paramsArr = Object.entries(params);
    let newParamsArr = [];
    for (let i = 0; i < paramsArr.length; i++) {
        let subArr = paramsArr[i].join('=')
        newParamsArr.push(subArr);
    }
    let queryString = newParamsArr.join('&');
    return queryString;
}

function returnGeoCodeResults (responseJson) {
    let resultsObj = {};
    let coordinates = {};
    if (responseJson.results.length > 0) {
    resultsObj = responseJson.results[0];
    coordinates.lat = resultsObj.geometry.lat;
    coordinates.lon = resultsObj.geometry.lng;
    } else {
        console.log('wriong');
       $('.results-list').html(`<h3>nothing to display</h3>
       <p>invaled city</p>`);
    }
    getTrails(coordinates);
}

function getTrails(coordinates) {
    let url = trailsUrl + '?' +  trailsString(coordinates);
    fetch(url)
    .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => displayTrails(responseJson))
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });
}

function trailsString(coordinates) {
    let radius = $('.distance').val();
    let params = {
        key: trailKey,
        lat: coordinates.lat,
        lon: coordinates.lon,
        maxDistance: radius,
        maxResults: 500
    }
    let paramsArr = Object.entries(params);
    let newParamsArr = [];
    for (let i = 0; i < paramsArr.length; i++) {
        let subArr = paramsArr[i].join('=');
        newParamsArr.push(subArr);
    }
    let trailQueryString = newParamsArr.join('&');
    return trailQueryString;
}

function displayTrails(responseJson) {
    let trails = '';
    for (let i = 0; i < responseJson.trails.length; i++) {
        trails += `<li class="results-list-item" id="trail-1">
        <div class="list-item-content">
        <h4 class="trail-name">${responseJson.trails[i].name}</h4>
        <div class="trail-content hidden">
            <p>Summary: <span class="description">${responseJson.trails[i].summary}</span></p>
            <p>Condition: <span class="description">${responseJson.trails[i].conditionDetails}</span></p>
            <p>Location: <span class="description">${responseJson.trails[i].location}</span></p>
        </div>
        </div> 
    </li>`;
    }
    console.log(trails);
    $(".results-list").html(trails);
    showListContent();
} 
function showListContent() {
    $("li").on('click', function(event) {
        $(this).find(".trail-content").toggleClass('hidden');
    })
}

$(function handleResultsSearch() {
    $(".results-search-form").on('submit', function(event) {
        event.preventDefault();
        $(".main-search-form").empty();
        let city = $(".results-location").val();
        callGeoCode(city);
    });
})

$(function navigateHike() {
    $(".hiking-option").on('click', function(event) {
        event.preventDefault();
        trailsUrl = 'https://www.hikingproject.com/data/get-trails';
        ifEmpty();
        /*let city = $(".search-form, .result-input-values").find('.location').val();*/
    });
})
$(function navigateBike() {
    $(".biking-option").on('click', function(event) {
        event.preventDefault();
        trailsUrl = 'https://www.mtbproject.com/data/get-trails';
        ifEmpty();
        /*let city = $(".search-form, result-input-values").find('.location').val();*/
    });
})

function ifEmpty() {
    let city = '';
    if ($(".results-location").val() === "") {
       city = $(".main-location").val();
    } else {
        city = $(".results-location").val();
    }
    console.log(city);
    callGeoCode(city);
}

$(function begin() {
    console.log("app loaded, choose option");
    choose();
})
/*
$(function changeHike() {
    $(".hike").on('click', function(event) {
        event.preventDefault();
        $("header").addClass('hidden');
        $(".nav-bar-container").removeClass('hidden');
        $(".main-search-container").removeClass('hidden');
    })
})

$(function changebike() {
    $(".bike").on('click', function(event) {
        event.preventDefault();
        $("header").addClass('hidden');
        $(".nav-bar-container").removeClass('hidden');
        $(".main-search-container").removeClass('hidden');
    })
})

$(function navigateHike() {
    $(".hiking-option").on('click', function(event) {
        event.preventDefault();
        $(".main-search-container").removeClass('hidden');
        $(".results-container").addClass('hidden');
    });
})

$(function navigateBike() {
    $(".biking-option").on('click', function(event) {
        event.preventDefault();
        $(".main-search-container").removeClass('hidden');
        $(".results-container").addClass('hidden');
    });
})

$(function getResults() {
    $(".main-search-form").on('submit', function(event) {
        event.preventDefault();
        $(".main-search-container").addClass('hidden');
        $(".results-container").removeClass('hidden');
    });
})

$(function getNewResults() {
    $(".results-search-form").on('submit', function(event) {
        event.preventDefault();
        $(".main-search-container").addClass('hidden');
        $(".results-container").removeClass('hidden');
    })
})

$(function showListContent() {
    $("li").on('click', function(event) {
        $(this).find(".trail-content").toggleClass('hidden');
    })
}) 
*/

