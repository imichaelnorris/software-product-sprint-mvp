async function wiki(food) {
    //try getting wiki data with exactly the name passed
    let url = generateUrl(food)
    let response = await apiCall(url)
    if (response && response.substr(0, 3) != '<!--' &&
        response.search('limit') == -1) {
        console.log('hi')
        addData(response)
        return
    }

    // get wiki value using the first element before space character
    let newUrl = generateUrl(food.split('%20')[0])
    let newresponse = await apiCall(newUrl)
    if (newresponse && newresponse.substr(0, 3) != '<!--' &&
        response.search('limit') == -1) {
        console.log('hello')
        addData(newresponse)
        return
    }

    addData("couldn't get an accurate description about the food item selected.")
}


function removeUnwantedNode() {
    var h2_list = document.getElementsByTagName("h2");
    if (h2_list.length > 0) {
        for (var i = h2_list.length - 1; i >= 0; i--) {
            var h2 = h2_list[i];
            if (h2.className != "Ingredients") {
                h2.parentNode.removeChild(h2);
            }
        }
    }
    var paragraph = document.getElementsByTagName("p");
    console.log(paragraph)
    if (paragraph.length > 0) {
        if (document.getElementsByTagName("p")[-1]) {
            target = document.getElementsByTagName("p")[-1];
            target.parentNode.removeChild(p)
        }

    }

}


function generateUrl(food) {
    return `https://api.codetabs.com/v1/proxy/?quest=https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exchars=2000&titles=${food}`
}

async function apiCall(url) {
    let returnValue
    await fetch(url)
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            returnValue = data.query.pages[Object.keys(data.query.pages)[0]].extract
        });
    if (returnValue) { return returnValue }
}

function addData(data) {
    const element = document.getElementById("foodhistory");
    var node = document.createElement("p");
    node.innerHTML = data;
    element.appendChild(node);
    removeUnwantedNode()
}