//Ensures the doument is correctly intialized
$(document).ready(function () {

    //Calls preloadImages so the background can always be statically changed
    preloadImages(['space.jpg', 'space2.jpg']);

    //Calls apiSearch on the click of the search button
    $("#searchButton").click(function () {
        apiSearch();
    });

    //Calls getCurrentTime on the click of the time button
    $("#timeButton").click(function () {
        const currentTime = getCurrentTime();
        $("#currentTime").text(currentTime);
        $("#time").dialog({
            modal: true,
            width: 300,
            close: function () {
                $(this).dialog("close");
            }
        });
    });

    //Defines background images and index to cycle through the images
    const backgroundImages = ['space.jpg', 'space2.jpg'];
    let currentIndex = 0;

    //Changes the background image on the click of the page title
    $("#pageTitle").click(function () {
        currentIndex = (currentIndex + 1) % backgroundImages.length; // Increment index and wrap around
        $('body').css('background-image', `url(${backgroundImages[currentIndex]})`); // Set new background
    });

    //Calls apiSearchLucky when the button is clicked
    $("#imFeelingLuckyButton").click(function () {
        const searchTerm = $('#query').val();
        if (searchTerm) {
            apiSearchLucky(searchTerm);
        } else {
            alert("Please enter a search term.");
        }
    });

    //Clears the page on click
    $("#clearPageButton").click(function () {
        $('#searchResults').css('display', 'none');
        $('#query').val("");
    });
});

//Uses BingAPI to perfrom a search engine query
function apiSearch() {
    var params = {
        'q': $('#query').val(), // Get the value from the textbox with ID "query"
        'count': 50,
        'offset': 0,
        'mkt': 'en-us'
    };

    $.ajax({
        url: 'https://api.bing.microsoft.com/v7.0/search?' + $.param(params), // Correct URL
        type: 'GET',
        headers: {
            'Ocp-Apim-Subscription-Key': 'da5bcc76890741abab9c47abba29e8ea'
        }
    })
        .done(function (data) {
            var len = data.webPages.value.length;
            var results = '';
            for (var i = 0; i < len; i++) {
                results += `<p><a href="${data.webPages.value[i].url}">${data.webPages.value[i].name}</a>: ${data.webPages.value[i].snippet}</p>`;
            }

            $('#searchResults').html(results);
            $('#searchResults').show();
            
        })
        .fail(function () {
            alert('error');
        });
}

//Returns the current time in HH:MM format
const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}


//Selects the first result of the api query
const apiSearchLucky = (query) => {
    var params = {
        'q': query,
        'count': 1,
        'offset': 0,
        'mkt': 'en-us'
    };
    $.ajax({
        url: 'https://api.bing.microsoft.com/v7.0/search?' + $.param(params), // Correct URL
        type: 'GET',
        headers: {
            'Ocp-Apim-Subscription-Key': 'da5bcc76890741abab9c47abba29e8ea'
        }
    })
        .done(function (data) {
            if (data.webPages.value.length > 0) {
                const firstUrl = data.webPages.value[0].url;
                window.location.href = firstUrl;
            } else {
                alert('Error retrieving results');
            }
        });
}

//Loads the images as the page is visited
const preloadImages = (images) => {
    $(images).each(function () {
        $('<img/>')[0].src = this;
    });
}


