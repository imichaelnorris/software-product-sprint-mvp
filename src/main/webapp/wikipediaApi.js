async function wiki() {
  await fetch(
    `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exchars=1000&titles=Pizza`
  )
    .then((response) => response.json())
    .then((data) =>
      addData(data.query.pages[Object.keys(data.query.pages)[0]].extract)
    );
}

function addData(data) {
  const element = document.getElementById("foodhistory");
  var node = document.createElement("p"); 
  node.innerHTML = data;
  element.appendChild(node);
}

