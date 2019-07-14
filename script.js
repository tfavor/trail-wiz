const trailKey = '200507765-d555489db7aa873777c05ace340f460d';
const geoCodeApi = '122b0842140d449c8ba12fa2fbc35be5';
const geoCodeUrl = 'https://api.opencagedata.com/geocode/v1/json';
const hikingUrl = 'https://www.hikingproject.com/data/get-trails';
const bikingUrl = 'https://www.mtbproject.com/data/get-trails';
let activeTrailsUrl = '';
const platform = new H.service.Platform({
    apikey: 'pr5RtcsszDg-Oa9CzOcUrbeq2WcSSa3Uhp299390XA8'
    });
let lat = '';
let lng = '';
let mapMarker = '';

function choose() {
    $(".hike, .bike").on('click', function(event) {
        event.preventDefault();
        if (this.id == 'hiking') {
            activeTrailsUrl = hikingUrl;
            changeNavHike();
            $("body").css('background-image', 'url("jonathon-reed-XF1pu2ZoaXI-unsplash.jpg")')
        } else if (this.id == 'biking') {
            activeTrailsUrl = bikingUrl;
            changeNavBike();
            $("body").css('background-image', 'url("daniel-frank-UwvGAmVeQ1I-unsplash.jpg")')
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
    $(".search-location").html(`<h3>trails found in ${city}</h3>`);
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
    lat = resultsObj.geometry.lat;
    lng = resultsObj.geometry.lng;
    getTrails(coordinates);
    } else {
        $(".search-location").empty();
        $(".results-list").html(`<h3 class="allert">! nothing to display, <span>invalid city or state !</span></h3>`);       
    }

    $(".map-container").empty();
    console.log(lng);
    console.log(lat);
}

function getMap(responseJson) {
    var maptypes = platform.createDefaultLayers();
    var map = new H.Map(
        document.getElementById('mapContainer'),
        maptypes.vector.normal.map,
        {
          zoom: 8.4,
          center: { lng: lng, lat: lat  }
        });

        var circle = new H.map.Circle({lng: lng, lat: lat}, 48280.3);
    map.addObject(circle);
    mapMarker = new H.map.Marker({lng: lng, lat: lat});
    map.addObject(mapMarker);
    /*getMapMarkers(map);
    map.addObject(parisMarker);*/
    showListContent(map, responseJson, mapMarker);
    
}

function getMapMarkers (map, responseJson) {
    var parisMarker = new H.map.Marker({lng: lng, lat: lat});
    map.addObject(parisMarker);
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
    let params = {
        key: trailKey,
        lat: coordinates.lat,
        lon: coordinates.lon,
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
    let name = '';
    let location = '';
    let length = '';
    let difficulty = '';
    let checkedCondition = '';
    let checkedSummary = '';
    if (responseJson.trails.length > 0) {
        for (let i = 0; i < responseJson.trails.length; i++) {

            id = responseJson.trails.indexOf(responseJson.trails[i]);
            name = responseJson.trails[i].name;
            let summary = responseJson.trails[i].summary;
            checkedSummary = checkSummary(summary);
            let condition = responseJson.trails[i].conditionDetails;
            checkedCondition = checkCondition(condition);
            location = responseJson.trails[i].location;
            length = responseJson.trails[i].length;
            difficulty = responseJson.trails[i].difficulty;
            trails += getListItem(name, checkedSummary, checkedCondition, location, length, difficulty, id);

        }
    } else {
        $('.results-list').html(`<h3>nothing to display</h3>
       <p>invaled city</p>`);
    }
    $(".results-list").html(trails);
    getMap(responseJson);
} 

function getListItem(name, summary, condition, location, length, difficulty, id) {
    let listItem = `<li class="results-list-item">
    <div class="trail-header">
    <h2 class="trail-name" id="${id}">${name}<span class="difficulty">${difficulty}</span></h2>
    <h3 class="length">${length} miles</h3>
    </div>
    <div class="list-item-content">
    <div class="trail-content hidden">
        <p>Location: <span class="description">${location}</span></p>
        <p>Summary: <span class="description">${summary}</span></p>
        <p>Condition: <span class="description">${condition}</span></p>
    </div>
    </div> 
</li>`;
return listItem;
}


function checkCondition(condition) {
    if (condition === null || condition === "") {
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

function showListContent(map, responseJson, mapMarker) {
   
    $("li").on('click', function(event) {
        $(".trail-content").addClass('hidden')
        map.removeObject(mapMarker);
        let trailObj = {}
        let thisId = $(this).find(".trail-name").attr('id');
            trailObj = responseJson.trails[thisId];
        console.log(trailObj);
        $(this).find(".trail-content").removeClass('hidden');
        mapMarker = new H.map.Marker({lng: trailObj.longitude, lat: trailObj.latitude});
        map.addObject(mapMarker); 
    });
}

$(function navigateHike() {
    $(".hiking-option").on('click', function(event) {
        event.preventDefault();
        changeNavHike();
        $("body").css('background-image', 'url("jonathon-reed-XF1pu2ZoaXI-unsplash.jpg")')
        activeTrailsUrl = hikingUrl;
        getCity();
    });
})
$(function navigateBike() {
    $(".biking-option").on('click', function(event) {
        event.preventDefault();
        changeNavBike();
        $("body").css('background-image', 'url("daniel-frank-UwvGAmVeQ1I-unsplash.jpg")')
        activeTrailsUrl = bikingUrl;
        getCity();
    });
})

$(function begin() {
    console.log("app loaded, choose option");
    choose();
})

function changeNavHike() {
    $(".hiking-option").css({"-webkit-clip-path":"polygon(0 0, 74.5% 0%, 64.5% 100%, 0% 99.5%)", "clip-path":"polygon(0 0, 74.5% 0%, 64.5% 100%, 0% 99.5%)"})
    $(".biking-option").css({"-webkit-clip-path":"polygon(75.5% .5%, 100% 0%, 100% 100%, 65.5% 100%)", "clip-path":"polygon(75.5% .5%, 100% 0%, 100% 100%, 65.5% 100%)"})
}
function changeNavBike() {
    $(".hiking-option").css({"-webkit-clip-path":"polygon(0 0, 24.5% 0%, 34.5% 100%, 0% 99.5%)", "clip-path":"polygon(0 0, 24.5% 0%, 34.5% 100%, 0% 99.5%)"})
    $(".biking-option").css({"-webkit-clip-path":"polygon(25.5% .5%, 100% 0%, 100% 100%, 35.5% 100%)", "clip-path":"polygon(25.5% .5%, 100% 0%, 100% 100%, 35.5% 100%)"})
}

function getTrailMarker(map, trailObj) {
        mapMarker = new H.map.Marker({lng: trailObj.longitude, lat: trailObj.latitude});
        map.addObject(mapMarker); 
        showListContent(mapMarker);
}

