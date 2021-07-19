// TODO: Add more dessert options and breakfast options
var MealDB = {};

// var recommedations needs to be outside
var recommendations = [];
var options = []
var locationData;

async function initDB() {
    const categories = [
        "beef",
        "chicken",
        "goat",
        "lamb",
        "pasta",
        "pork",
        "seafood",
        "vegetarian",
        "dessert",
        "breakfast",
        "vegan",
    ];
    const temp = {};

    for (var c of categories) {
        const response = await fetch(
            "https://themealdb.com/api/json/v1/1/filter.php?c=" + c
        )
        const foods = await response.json();

        for (let i = 0; i < foods.meals.length; i++) {
            if (c in temp === false) {
                temp[c] = [foods.meals[i]];
            } else {
                temp[c].push(foods.meals[i]);
            }
        }
    }

    return temp;
}

(async() => {
    MealDB = await initDB();
})();

function genRecommendationUpdate() {
    options = []
    var tags = "";
    var list = {};

    $(".selected:not('.alg')").each(function() { 
        var option = $(this).children().attr('id').replace('Opt','')
        console.log(option)
        if(option !== 'lunchDinner')
            options.push(option)
    })

    $(".selected.alg").each(function() { 
        var allergy = $(this).children().attr('id').replace('Alrgy','-free')
        tags += "&health=" + allergy;
        console.log(tags)
    })
    
    console.log("this gets done first")
    getLocation(options, tags)
    
}

async function getLocation(options, tags) {
    if (window.navigator.geolocation) {
        await window.navigator.geolocation.getCurrentPosition((response) => {
            convertToEdamamObjects(options, tags, response)
        }, console.log);
    }

}

function getPreferences() {
    var pref_list = [];

    if (document.getElementById("prefMeat").checked) {
        // TODO: Separate all meats
        insert(pref_list, "Beef", "Chicken", "Goat", "Lamb", "Pork");
    }
    if (document.getElementById("prefSeafood").checked) {
        pref_list.push("Seafood");
    }
    if (document.getElementById("prefPasta").checked) {
        pref_list.push("Pasta");
    }
    if (document.getElementById("prefVeggie").checked) {
        // TODO: Separate Vegetarian and Vegan items
        pref_list.push.apply(pref_list, ["Vegetarian", "Vegan"]);
    }

    return pref_list;
}

// FIXME: Edamam API confuses words like 'and' and 'with' when converting the MealDB API objects
async function convertToEdamamObjects(options, tags, response) {
    locationData = response
    const foodList = randomRec(options, 3);
    var temp = {}
    console.log("in convertToEdamamObjects")

    for (var foodName of foodList) {
        var response = null;

        if ("Vegan" in options || "Vegetarian" in options) {
            response = await fetch(
                `https://api.edamam.com/api/menu-items/v2/search?app_id=2ba0ec45&app_key=ac665ae3e41a33e09736700ec5a0c738&q=${foodName}&lat=${locationData.coords.latitude}&lon=${locationData.coords.longitude}&health=vegan&health=vegetarian`
            );
        } else {
            response = await fetch(
                `https://api.edamam.com/api/menu-items/v2/search?app_id=2ba0ec45&app_key=ac665ae3e41a33e09736700ec5a0c738&q=${foodName}&lat=${locationData.coords.latitude}&lon=${locationData.coords.longitude}${tags}`
            );
        }
        const results = await response.json();

        for (let i = 0; i < results.hints.length; i++) {
            if (!temp[foodName]) {
                temp[foodName] = [results.hints[i]]
            } else {
                temp[foodName].push(results.hints[i])
            }
        }
    }

    recommendations = convertToArray(temp);
    if (locationData) {
        postRecommendations(
            options,
            recommendations,
            locationData.coords.latitude,
            locationData.coords.longitude
        );
    } else {
        postRecommendations(options, recommendations);
    }

}

// Step 4: Randomly pick 3 food options and display to recommendation cards
// TODO: Add timer delay to make transition smoother when random item suggestion is clicked again
function postRecommendations(options, recommendations, lat = "", lon = "") {

    // TODO: Clean up Recommendation loops; too slow
    for (let i = 0; i < recommendations.length; i++) {
        var recMeal = recommendations[i].key;
        var recMealThumb = "";
        var isFound = false;

        for (var e of options) {
            for (let i = 0; i < MealDB[e].length; i++) {
                if (MealDB[e][i].strMeal === recMeal) {
                    recMealThumb = MealDB[e][i].strMealThumb;
                    isFound = true;
                    break;
                }
            }
            if (isFound === true) break;
        }

        $("#rec-card-" + i + " img").attr("src", recMealThumb);
        $("#rec-card-" + i + " div h5").text(recMeal);
        $("#rec-card-" + i + " a").attr("href", `./result.html?food=${recMeal}&lat=${lat ? lat : ``}&lon=${lon ? lon : ``}&img=${recMealThumb}`);
    }
}

function convertToArray(dict) {
    var temp = [];

    for(let i = 0; i < Object.keys(dict).length; i++) {
        const key = Object.keys(dict)[i]
    


        temp.push({
            key: key,
            value: dict[key]
        })
    }

    
    return temp;
}

function randomRec(categories, numItems) {
    const availItems = []
    const temp = []       
    for(var c of categories) {
        for(let i = 0; i < MealDB[c].length; i++) {
            availItems.push(MealDB[c][i].strMeal)
            console.log(availItems)
        }
    }

    for(let i = 0; i < numItems; i++) {
        var index = Math.floor(Math.random() * availItems.length)
        temp.push(availItems[index])
        availItems.splice(index, 1)
    }

    console.log(temp)

    return temp;
}


function insert(arr, ...items) {
    arr.push(...items);
}