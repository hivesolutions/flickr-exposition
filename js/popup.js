// Hive Chrome Extensions
// Copyright (C) 2008-2012 Hive Solutions Lda.
//
// This file is part of Hive Chrome Extensions.
//
// Hive Chrome Extensions is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Hive Chrome Extensions is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Hive Chrome Extensions. If not, see <http://www.gnu.org/licenses/>.

// __author__    = João Magalhães <joamag@hive.pt>
// __version__   = 1.0.0
// __revision__  = $LastChangedRevision$
// __date__      = $LastChangedDate$
// __copyright__ = Copyright (c) 2008-2012 Hive Solutions Lda.
// __license__   = GNU General Public License (GPL), Version 3

function onLoad() {
    // retrieves the seach box element
    var searchBox = document.getElementById("search-box");

    // registers the key press handler
    searchBox.onkeypress = function(event) {
        // in case the key it's enter
        if (event.keyCode == "13") {
            // creates a request with the search box value
            createRequest(searchBox.value);
        }
    }
}

function createRequest(keyword) {
    // creates the request url
    var url = "https://secure.flickr.com/services/rest/?"
            + "method=flickr.photos.search&api_key=90485e931f687a9b9c2a66bf58a3861a&text="
            + keyword
            + "&safe_search=1&content_type=1&sort=relevance&per_page=20";

    // creates the request and opens it as a get request
    // to the remote api endpoint
    var request = new XMLHttpRequest();
    request.open("GET", url, true);

    console.info("cenas 1")

    // sets the onload event handler
    request.onload = function() {
        console.info("cenas 2")

        // retrieves all the photos from the request as a list
        // of elements and then shows the photos
        var photos = request.responseXML.getElementsByTagName("photo");
        showPhotos(photos);
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
                    url : imageShowUrl
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
    return "http://www.flickr.com/photos/" + photo.getAttribute("owner") + "/"
            + photo.getAttribute("id");
}

/**
 * Constructs the image url from the photo.
 *
 * @param {Map}
 *            photo The photo map value.
 * @return {String} The image constructed image url.
 */
function constructImageUrl(photo) {
    return "http://farm" + photo.getAttribute("farm") + ".static.flickr.com/"
            + photo.getAttribute("server") + "/" + photo.getAttribute("id")
            + "_" + photo.getAttribute("secret") + "_s.jpg";
}

window.onload = onLoad;
