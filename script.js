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
            $(".biking-option").addClass('biking-unselected');
            $(".hiking-option").addClass('hiking-selected');
            $("body").css('background-image', 'url("jonathon-reed-XF1pu2ZoaXI-unsplash.jpg")')
        } else if (this.id == 'biking') {
            activeTrailsUrl = bikingUrl;
            $(".biking-option").addClass('biking-selected');
            $(".hiking-option").addClass('hiking-unselected');
            $("body").css('background-image', 'url("daniel-frank-UwvGAmVeQ1I-unsplash.jpg")')
        }
        showMainContent();
    });
}

function showMainContent() {
    $("header").addClass('hidden');
    $(".nav-bar-container").removeClass('hidden');
    $(".main-search-container").removeClass('hidden');
    $(".main-content").removeClass('hidden');
}

$(function handleSubmit() {
    $(".search-form").on('submit', function(event) {
        event.preventDefault();
        $(".miles-options").addClass('hidden');
        showResultsPage();
        getLocationInfo();
    });
})

function showResultsPage() {
    $(".main-search-container").addClass('hidden');
    $(".results-container").removeClass('hidden');
}

function getLocationInfo() {
    let miles = getRadiusInput();
    let city = getCity();
    let cat = getCatigory();
    $(".search-location").html(`<h3>${cat} trails found within <span class="location-name">${miles} miles of ${city}</span></h3>`);
    callGeoCode(city, miles);
}

function getCity() {
    let city = '';
    if ($(".results-location").val() === '') {
       city = $(".main-location").val();;
    } else {
        city = $(".results-location").val();
    }
    return city;
}

function getRadiusInput() {
    let miles = '';
    if ($(".results-miles")[0].selectedIndex <= 0) {
       miles = $(".main-miles").val();
     } else {
        miles = $(".results-miles").val();
     }
     return miles;
}

function getCatigory() {
    let cat = '';
    if ( activeTrailsUrl === hikingUrl) {
        cat = 'Hiking';
    } else {
        cat = 'Biking';
    }
    return cat;
}

function callGeoCode(city, miles) {
    let url = geoCodeUrl + '?' +  geoCodeQueryString(city);
    fetch(url)
    .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => returnGeoCodeResults(responseJson, miles))
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });
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

function returnGeoCodeResults(responseJson, miles) {
    let resultsObj = {};
    let coordinates = {};
    if (responseJson.results.length > 0) {
    resultsObj = responseJson.results[0];
    coordinates.lat = resultsObj.geometry.lat;
    coordinates.lon = resultsObj.geometry.lng;
    lat = resultsObj.geometry.lat;
    lng = resultsObj.geometry.lng;
    getTrails(coordinates, miles);
    } else {
        $(".search-location").empty();
        $(".results-list").html(`<h3 class="allert">! nothing to display, <span>invalid city or state !</span></h3>`);       
    }

    $(".map-container").empty();

}

function getMap(responseJson, miles) {
    let radius = getRadius(miles);
    let zoomNum = getZoom(miles);
    var maptypes = platform.createDefaultLayers();
    var map = new H.Map(
        document.getElementById('mapContainer'),
        maptypes.vector.normal.map,
        {
          zoom: zoomNum,
          center: { lng: lng, lat: lat  }
        });
        let styles = {
            fillColor: 'rgba(211, 211, 211, 0.4)'
        };
        var circle = new H.map.Circle({lng: lng, lat: lat}, radius, {style: styles});
    map.addObject(circle);
    mapMarker = new H.map.Marker({lng: lng, lat: lat});
    map.addObject(mapMarker);
    showListContent(map, responseJson, mapMarker);
    window.addEventListener('resize', function () {
        map.getViewPort().resize(); 
    });
}

function getRadius(miles) {
    let radius = '';
    if (miles == 5) {
        radius = 8046.72;
    } else if (miles == 10) {
        radius = 16093.4;
    } else if (miles == 15) {
        radius = 24140.2;
    } else if (miles == 20) {
        radius = 32186.9;
    } else if (miles == 25) {
        radius = 40233.6;
    } else if (miles == 30) {
        radius = 48280.3;
    }
    return radius;
}

function getZoom(miles) {
    let zoomNum = '';
    if (miles == 5) {
        zoomNum = 11;
    } else if (miles == 10) {
        zoomNum = 10;
    } else if (miles == 15) {
        zoomNum = 9.4;
    } else if (miles == 20) {
        zoomNum = 9;
    } else if (miles == 25) {
        zoomNum = 8.7;
    } else if (miles == 30) {
        zoomNum = 8.4;
    }
    return zoomNum;
}

function getTrails(coordinates, miles) {
    let url = activeTrailsUrl + '?' +  trailsString(coordinates, miles);
    fetch(url)
    .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => displayTrails(responseJson, miles))
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });
}

function trailsString(coordinates, miles) {
    let params = {
        key: trailKey,
        lat: coordinates.lat,
        lon: coordinates.lon,
        maxDistance: miles,
        maxResults: 60
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

function displayTrails(responseJson, miles) {
    let trails = '';
    let name = '';
    let location = '';
    let cords = {};
    let length = '';
    let difficulty = '';
    let checkedCondition = '';
    let checkedSummary = '';
    if (responseJson.trails.length > 0) {
        for (let i = 0; i < responseJson.trails.length; i++) {
            cords.lat = responseJson.trails[i].latitude;
            cords.lng = responseJson.trails[i].longitude;
            id = responseJson.trails.indexOf(responseJson.trails[i]);
            name = responseJson.trails[i].name;
            let summary = responseJson.trails[i].summary;
            checkedSummary = checkSummary(summary);
            let condition = responseJson.trails[i].conditionDetails;
            checkedCondition = checkCondition(condition);
            location = responseJson.trails[i].location;
            length = responseJson.trails[i].length;
            difficulty = responseJson.trails[i].difficulty;
            trails += getListItem(name, checkedSummary, checkedCondition, cords, length, difficulty, id);

        }
    } else {
        $('.results-list').html(`<h3>nothing to display</h3>
       <p>invaled city</p>`);
    }
    $(".results-list").html(trails);
    getMap(responseJson, miles);
} 

function getListItem(name, summary, condition, cords, length, difficulty, id) {
    let listItem = `<li class="results-list-item">
    <div class="trail-header">
    <button><h2 class="trail-name" id="${id}">${name}<span class="difficulty">${difficulty}</span></h2></button>
    <h3 class="length">${length} miles</h3>
    </div>
    <div class="list-item-content">
    <div class="trail-content hidden">
        <p>Summary: <span class="description">${summary}</span></p>
        <p>Condition: <span class="description">${condition}</span></p>
        <p>Location: <span class="description"><a href="http://www.google.com/maps/place/${cords.lat},${cords.lng}" target="_blank">See trail location in Google Maps</a></span></p>
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
        mapMarker.setVisibility(false);
        $('.results-list-container').animate({
            scrollTop: $(this).offset().top-370
        }, 500);
    

        let trailObj = {}
        let thisId = $(this).find(".trail-name").attr('id');
            trailObj = responseJson.trails[thisId];
        mapMarker = new H.map.Marker({lng: trailObj.longitude, lat: trailObj.latitude});
        map.addObject(mapMarker); 
        classChange($(this));
    });
}
function classChange(trail) {

    trail.find(".list-item-content").toggleClass('display');
    trail.find(".trail-content").toggleClass('hidden');
    trail.find(".trail-content").toggleClass('fade');


    /*$(".list-item-content").removeClass('display');
    $(".trail-content").addClass('hidden');
    trail.find(".list-item-content").addClass('display');
    trail.find(".trail-content").removeClass('hidden');
    trail.find(".trail-content").addClass('fade');*/
}

$(function navigateHike() {
    $(".hiking-option").on('click', function(event) {
        changeToHike();
        event.preventDefault();
        activeTrailsUrl = hikingUrl;
        getLocationInfo();
    });
})

$(function navigateBike() {
    $(".biking-option").on('click', function(event) {
        event.preventDefault();
        changeToBike();
        activeTrailsUrl = bikingUrl;
        getLocationInfo();
    });
})

function changeToHike() {
    $("body").css('background-image', 'url("jonathon-reed-XF1pu2ZoaXI-unsplash.jpg")');
    $(".biking-option").removeClass('biking-selected');
    $(".hiking-option").removeClass('hiking-unselected');
    $(".biking-option").addClass('biking-unselected');
    $(".hiking-option").addClass('hiking-selected');
}

function changeToBike() {
    $("body").css('background-image', 'url("daniel-frank-UwvGAmVeQ1I-unsplash.jpg")');
    $(".hiking-option").removeClass('hiking-selected');
    $(".biking-option").removeClass('biking-unselected');
    $(".hiking-option").addClass('hiking-unselected');
    $(".biking-option").addClass('biking-selected');
}

function getTrailMarker(map, trailObj) {
        mapMarker = new H.map.Marker({lng: trailObj.longitude, lat: trailObj.latitude});
        map.addObject(mapMarker); 
        showListContent(mapMarker);
}

$(function begin() {
    choose();
})

$(function bla() {

    $(".distance").on('click', function(e) {
        e.preventDefault();
        $(".distance").val('');
    })
})

$('.distance').keydown(function(e) {
    e.preventDefault();
    return false;
 });
 
 
$(function showMilesList() {
    $(".miles").on('click', function(e) {
        e.preventDefault();
        $(".miles-options").toggleClass('hidden');
    })
}) 
