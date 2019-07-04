
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