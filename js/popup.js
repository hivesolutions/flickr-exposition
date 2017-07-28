// Hive Chrome Extensions
// Copyright (c) 2008-2017 Hive Solutions Lda.
//
// This file is part of Hive Chrome Extensions.
//
// Hive Chrome Extensions is free software: you can redistribute it and/or modify
// it under the terms of the Apache License as published by the Apache
// Foundation, either version 2.0 of the License, or (at your option) any
// later version.
//
// Hive Chrome Extensions is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// Apache License for more details.
//
// You should have received a copy of the Apache License along with
// Hive Chrome Extensions. If not, see <http://www.apache.org/licenses/>.

// __author__    = João Magalhães <joamag@hive.pt>
// __version__   = 1.0.0
// __revision__  = $LastChangedRevision$
// __date__      = $LastChangedDate$
// __copyright__ = Copyright (c) 2008-2017 Hive Solutions Lda.
// __license__   = Apache License, Version 2.0

var API_KEY = "bb5cf5d605030d0d2114bfe59ff692db";

function onLoad() {
    // retrieves the seach box element
    var searchBox = document.getElementById("search-box");

    // registers the key press handler
    searchBox.onkeypress = function(event) {
        // in case the key it's enter
        if (event.keyCode === "13") {
            // creates a request with the search box value
            createRequest(searchBox.value);
        }
    }
}

function createRequest(keyword) {
    // retrieves the loading mask and shows it by setting the
    // visibility property of it
    var loadingMask = document.getElementById("loading-mask");
    loadingMask.style.visibility = "visible";

    // creates the request url, that is going to be used to
    // request public photos from flickr (as expected)
    var url = "https://api.flickr.com/services/rest/?" + "method=flickr.photos.search&api_key=" + API_KEY + "&text=" +
        keyword + "&safe_search=1&content_type=1&sort=relevance&per_page=20";

    // creates the request and opens it as a get request
    // to the remote api endpoint
    var request = new XMLHttpRequest();
    request.open("GET", url, true);

    // sets the onload event handler
    request.onload = function() {
        // retrieves all the photos from the request as a list
        // of elements and then shows the photos
        var photos = request.responseXML.getElementsByTagName("photo");
        showPhotos(photos);

        // hides the loading mask as the search operation has been
        // completed with success
        loadingMask.style.visibility = "hidden";
    }

    // sends the request
    request.send(null);
}

function showPhotos(photos) {
    // retrieves the contents element
    var contents = document.getElementById("contents");

    while (contents.hasChildNodes()) {
        contents.removeChild(contents.firstChild);
    }

    // iterates over all the photos to generate the photos
    for (var i = 0, photo; photo = photos[i]; i++) {
        // generates the photo
        generatePhoto(photo);
    }
}

function generatePhoto(photo) {
    // creates the image element
    var image = document.createElement("img");

    // constructs the image show url for the photo
    var imageShowUrl = constructImageShowUrl(photo);

    image.onclick = function() {
        // creates the tab with the url
        chrome.tabs.create({
            url: imageShowUrl
        });
    };

    // sets the image source attribute and then sets
    // the image thumbnail attribute
    image.src = constructImageUrl(photo);
    image.setAttribute("class", "thumbnail");

    // retrieves the contents element
    var contents = document.getElementById("contents");

    // adds the image to the document contents
    contents.appendChild(image);
}

function constructImageShowUrl(photo) {
    return "http://www.flickr.com/photos/" + photo.getAttribute("owner") + "/" + photo.getAttribute("id");
}

/**
 * Constructs the image url from the photo.
 *
 * @param {Map}
 *            photo The photo map value.
 * @return {String} The image constructed image url.
 */
function constructImageUrl(photo) {
    return "http://farm" + photo.getAttribute("farm") + ".static.flickr.com/" + photo.getAttribute("server") + "/" +
        photo.getAttribute("id") + "_" + photo.getAttribute("secret") + "_s.jpg";
}

window.onload = onLoad;
