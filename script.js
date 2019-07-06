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

$(function choose() {
    $(".hike, .bike").on('click', function(event) {
        event.preventDefault();
        if (this.id == 'hiking') {
            chooseHiking();
        } else if (this.id == 'biking') {
            chooseBiking();
        }
    });
})

function handleMainSubmit() {
    $(".search-form").on('submit', function(event) {
        event.preventDefault();
        callGeoCode();
    });
}

function callGeoCode() {
    let url = geoCodeUrl + '?' +  geoCodeQueryString();
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

function geoCodeQueryString() {
    let city = $('.location').val();
    let radius = $('.distance').val();
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
       console.log("invaled city or state");
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
      .then(responseJson => console.log(responseJson))
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
        maxResults: 50
    }
    let paramsArr = Object.entries(params);
    let newParamsArr = [];
    for (let i = 0; i < paramsArr.length; i++) {
        let subArr = paramsArr[i].join('=');
        newParamsArr.push(subArr);
    }
    let trailQueryString = newParamsArr.join('&');
    return trailQueryString;
    console.log(trailQueryString);
    console.log(newParamsArr);
    console.log(radius);
    console.log(params);
}



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

