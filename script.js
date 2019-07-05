const trailKey = '200507765-d555489db7aa873777c05ace340f460d';
const appId = 'OnsRRoCMl2ZmKhSIWQ8a';
const appCode = '96rL5FNqiCEvWqWaoS4QUw';
let trailsUrl = '';

/* choosing to look for hiking trails at the beginning */
function chooseHiking() {
    trailsUrl = 'https://www.hikingproject.com/data/get-trails';
    event.preventDefault();
    $("header").addClass('hidden');
    $(".nav-bar-container").removeClass('hidden');
    $(".main-search-container").removeClass('hidden');
    handleSubmit();
    console.log(trailsUrl);
}
/* choosing to look for biking trails at the beginning */
function chooseBiking() {
    trailsUrl = 'https://www.mtbproject.com/data/get-trails';
    event.preventDefault();
    $("header").addClass('hidden');
    $(".nav-bar-container").removeClass('hidden');
    $(".main-search-container").removeClass('hidden');
    handleSubmit();
    console.log(trailsUrl);
}

function getFormValues() {
    let city = '';
    let radius = '';
    event.preventDefault();
    city = $('.location').val();
    radius = $('.distance').val();
    console.log(city);
    console.log(radius);
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

function handleSubmit() {
    $(".search-form").on('submit', function(event) {
        event.preventDefault();
        getFormValues()
    });
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

