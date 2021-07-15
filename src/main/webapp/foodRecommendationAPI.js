// TODO: Add more dessert options and breakfast options
var MealDB = {};

// var recommedations needs to be outside
var recommendations = [];

async function initDB() {
    const categories = ["Beef", "Chicken", "Goat", "Lamb", "Pasta", "Pork", "Seafood", "Vegetarian", "Dessert", "Breakfast", "Miscellaneous", "Vegan"];
    const temp = {}

    for (var c of categories) {
        const response = await fetch('https://themealdb.com/api/json/v1/1/filter.php?c=' + c)
        const foods = await response.json()

        for (let i = 0; i < foods.meals.length; i++) {
            if (c in temp === false) {
                temp[c] = [foods.meals[i]]
            } else {
                temp[c].push(foods.meals[i])
            }
        }
    }

    return temp
}

(async() => {
    MealDB = await initDB()
})();

function generateRecommendation() {
    var options = [];
    var tags = "";
    var temp = [];
    var list = {};

    // Step 1: Get Meal Type and store chosen categories in an array        
    if (document.getElementById('breakfastMeal').checked) {
        temp.push("Breakfast");
    }
    if (document.getElementById('lunchDinnerMeal').checked) {
        temp.push(getPreferences())
    }
    if (document.getElementById('dessertMeal').checked) {
        temp.push("Dessert");
    }

    // Creates a 1D array
    for (let i = 0; i < temp.length; i++) {
        options = options.concat(temp[i]);
    }
    console.log(options)

    // Step 2: Get Allergies and Filter out the allergies
    $("#allergy-select")
        .change(function() {
            tags = "";
            $("select option:selected").each(function() {
                tags += "&health=" + $(this).val();
            });
        })
        .trigger("change");

    // Step 3: Convert all foods in array to an Edamam Object
    MealDB != {} ? convertToEdamamObjects(options, tags) : null
}

function getPreferences() {
    var pref_list = [];

    if (document.getElementById('prefMeat').checked) {
        // TODO: Separate all meats
        insert(pref_list, "Beef", "Chicken", "Goat", "Lamb", "Pork");
    }
    if (document.getElementById('prefSeafood').checked) {
        pref_list.push("Seafood");
    }
    if (document.getElementById('prefPasta').checked) {
        pref_list.push("Pasta");
    }
    if (document.getElementById('prefVeggie').checked) {
        // TODO: Separate Vegetarian and Vegan items
        pref_list.push.apply(pref_list, ["Vegetarian", "Vegan"]);
    }

    return pref_list;
}

// FIXME: Edamam API confuses words like 'and' and 'with' when converting the MealDB API objects
async function convertToEdamamObjects(options, tags) {
    const temp = {}

    for (var c of options) {
        for (let i = 0; i < MealDB[c].length; i++) {
            const foodName = MealDB[c][i].strMeal;
            const query = foodName.replace(' ', "%20")
            var response = null;

            // TODO: Add Postal and Long and Lat fields to fetch request to better the search          
            if ("Vegan" in options || "Vegetarian" in options) {
                response = await fetch("https://api.edamam.com/api/menu-items/v2/search?app_id=2ba0ec45&app_key=ac665ae3e41a33e09736700ec5a0c738&q=" + foodName + "&health=vegan&health=vegetarian" + tags)
            } else {
                response = await fetch("https://api.edamam.com/api/menu-items/v2/search?app_id=2ba0ec45&app_key=ac665ae3e41a33e09736700ec5a0c738&q=" + foodName + tags)
            }

            const results = await response.json();

            for (let i = 0; i < results.hints.length; i++) {
                if (foodName in temp === false) {
                    temp[foodName] = [results.hints[i]]
                } else {
                    temp[foodName].push(results.hints[i])
                }
            }
        }
    }
    recommendations = randomRec(temp, 3);
    postRecommendations(options, recommendations);
}

// Step 4: Randomly pick 3 food options and display to recommendation cards
// TODO: Add timer delay to make transition smoother when random item suggestion is clicked again
function postRecommendations(options, recommendations) {
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
            if (isFound === true)
                break;
        }

        $("#rec-card-" + i + " img").attr("src", recMealThumb)
        $("#rec-card-" + i + " div h5").text(recMeal)
        $("#rec-card-" + i + " a").attr("href", `./result.html?food=${recMeal}`)
    }
}

function randomRec(dict, iter) {
    var temp = [];

    while (temp.length < iter) {
        const index = Math.floor(Math.random() * Object.keys(dict).length)
        const key = Object.keys(dict)[index]

        temp.push({
            key: key,
            value: dict[key]
        })

        delete dict[key]
    }
    return temp;
}

function insert(arr, ...items) {
    arr.push(...items);
}