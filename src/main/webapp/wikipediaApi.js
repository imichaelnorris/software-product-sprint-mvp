var test = ["1", "2", "3", "4"] 
function searchTerms(terms, iter, temp = []) {
    if(iter > 0) {
        var termCount = iter;
        for(let i = 0; i < (terms.length - termCount) + 1; i++) {
            var searchTerm = "";
            var index = i;
            var currCount = 0;
            while(currCount < termCount) {
                if(currCount === 0)
                    searchTerm += terms[index];
                else
                    searchTerm += "%20" + terms[index];
                index++;
                currCount++;
            }
            temp.push(searchTerm)
        }
        searchTerms(terms, iter - 1, temp)
    }
    return temp
}

async function wiki(food) {
    //try getting wiki data with exactly the name passed
    let url = generateUrl(food)
    let response = await apiCall(url)
    console.log(response)
    if (response && response.substr(0, 3) != '<!--' &&
        response.search('limit') == -1) {
        addData(response)
        return
    }


    let foodItems = removeItemAll(food.split('%20'), "and", "the", "with")
    console.log(foodItems)

    let allQueries = searchTerms(foodItems, foodItems.length);
    console.log(allQueries)
    
    for(var term of allQueries) {
        // get wiki value using the first element before space character
        let newUrl = generateUrl(term)
        let newresponse = await apiCall(newUrl)

        console.log(newresponse)

        if (newresponse && newresponse.substr(0, 3) != '<!--' &&
            newresponse.search('limit') == -1) {
            addData(newresponse)
        }
    }
    
    return
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

function removeItemAll(arr, ...values) {
    var i = 0;
    for(var value of values) {
        while (i < arr.length) {
            if (arr[i] === value) {
            arr.splice(i, 1);
            } else {
            ++i;
            }
        }
    }
    return arr;
}