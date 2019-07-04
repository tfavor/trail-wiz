
$(function changeHike() {
    $(".hike").on('click', function(event) {
        event.preventDefault();
        $("header").addClass('hidden');
        $(".main-content").removeClass('hidden');
    })
})

$(function changebike() {
    $(".bike").on('click', function(event) {
        event.preventDefault();
        $("header").addClass('hidden');
        $(".main-content").removeClass('hidden');
    })
})