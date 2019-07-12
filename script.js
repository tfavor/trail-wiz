const trailKey = '200507765-d555489db7aa873777c05ace340f460d';
const geoCodeApi = '122b0842140d449c8ba12fa2fbc35be5';
const geoCodeUrl = 'https://api.opencagedata.com/geocode/v1/json';
const hikingUrl = 'https://www.hikingproject.com/data/get-trails';
const bikingUrl = 'https://www.mtbproject.com/data/get-trails';
let activeTrailsUrl = '';
const platform = new H.service.Platform({
    apikey: 'pr5RtcsszDg-Oa9CzOcUrbeq2WcSSa3Uhp299390XA8'
    });

function choose() {
    $(".hike, .bike").on('click', function(event) {
        event.preventDefault();
        if (this.id == 'hiking') {
            activeTrailsUrl = hikingUrl;
        } else if (this.id == 'biking') {
            activeTrailsUrl = bikingUrl;
        }
        $("header").addClass('hidden');
        $(".nav-bar-container").removeClass('hidden');
        $(".main-search-container").removeClass('hidden');
        $(".main-content").removeClass('hidden');
        console.log(activeTrailsUrl);
    });
}

$(function handleSubmit() {
    $(".search-form").on('submit', function(event) {
        event.preventDefault();
        $(".main-search-container").addClass('hidden');
        $(".results-container").removeClass('hidden');
        getCity();
    });
})

function getCity() {
    let city = '';
    if ($(".results-location").val() === "") {
       city = $(".main-location").val();
    } else {
        city = $(".results-location").val();
    }
    console.log(city);
    callGeoCode(city);
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
    console.log(queryString);
}

function returnGeoCodeResults(responseJson) {
    let resultsObj = {};
    let coordinates = {};
    if (responseJson.results.length > 0) {
    resultsObj = responseJson.results[0];
    coordinates.lat = resultsObj.geometry.lat;
    coordinates.lon = resultsObj.geometry.lng;
    } else {
       $('.results-list').html(`<h3>nothing to display</h3>
       <p>invaled city or state</p>`);
    }
    getTrails(coordinates);
}

function getTrails(coordinates) {
    let url = activeTrailsUrl + '?' +  trailsString(coordinates);
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
    let radius = getDistance();
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

function getDistance() {
    let distance = '';
    if ($(".results-distance").val() === "") {
       distance = $(".main-distance").val();
    } else {
        distance = $(".results-distance").val();
    }
    console.log(distance);
    return distance;
}

function displayTrails(responseJson) {
    let id = '';
    let trails = '';
    let name = '';
    let location = '';
    let checkedCondition = '';
    let checkedSummary = '';
    if (responseJson.trails.length > 0) {
        for (let i = 0; i < responseJson.trails.length; i++) {
            id = "mapContainer" + responseJson.trails.indexOf(responseJson.trails[i]);
            name = responseJson.trails[i].name;
            let summary = responseJson.trails[i].summary;
            checkedSummary = checkSummary(summary);
            let condition = responseJson.trails[i].conditionDetails;
            checkedCondition = checkCondition(condition);
            location = responseJson.trails[i].location;
            trails += getListItem(name, checkedSummary, checkedCondition, location, id);
        }
    } else {
        $('.results-list').html(`<h3>nothing to display</h3>
       <p>invaled city</p>`);
    }
    $(".results-list").html(trails);
    getMapArr(responseJson);
} 

function getListItem(name, summary, condition, location, id) {
    let listItem = `<li class="results-list-item">
    <h3 class="trail-name">${name}</h3>
    <div class="list-item-content">
    <div class="map-container" id="${id}"></div>
    <div class="trail-content hidden">
        <p>Location: <span class="description">${location}</span></p>
        <p>Summary: <span class="description">${summary}</span></p>
        <p>Condition: <span class="description">${condition}</span></p>
    </div>
    </div> 
</li>`;
return listItem;
}

function getMapArr(responseJson) {
    console.log(responseJson);
    let idArr = [];
    let mapObjArr = [];
    for (let i = 0; i < responseJson.trails.length; i++) {

        let mapObj = {
            id:  "mapContainer" + responseJson.trails.indexOf(responseJson.trails[i]),
            lat: responseJson.trails[i].latitude,
            lng: responseJson.trails[i].longitude
        };
        mapObjArr.push(mapObj);
    }
    console.log(mapObjArr);
    getMap(mapObjArr);
}

function getMap(mapObjArr) {
    for (let i = 0; i < mapObjArr.length; i++) {
        var maptypes = platform.createDefaultLayers();
        var map = new H.Map(
        document.getElementById(mapObjArr[i].id),
        maptypes.vector.normal.map,
        {
          zoom: 10,
          center: { lng: mapObjArr[i].lng, lat: mapObjArr[i].lat  }
        });
    }
    $(".map-container").addClass('hidden');
    showListContent();
}

function checkCondition(condition) {
    if (condition === null || "") {
        condition = "Unknown";
    } else {
        condition = condition;
    }
    return condition;
}

function checkSummary(summary) {
    if (summary === "") {
        summary = "No information available.";
    } else {
        summary = summary;
    }
    return summary;
}

function showListContent() {
    $("li").on('click', function(event) {
        $(this).find(".trail-content").toggleClass('hidden');
        $(this).find(".map-container").toggleClass('hidden');
    });
}

$(function navigateHike() {
    $(".hiking-option").on('click', function(event) {
        event.preventDefault();
        activeTrailsUrl = hikingUrl;
        getCity();
    });
})
$(function navigateBike() {
    $(".biking-option").on('click', function(event) {
        event.preventDefault();
        activeTrailsUrl = bikingUrl;
        getCity();
    });
})

$(function begin() {
    console.log("app loaded, choose option");
    choose();
})
