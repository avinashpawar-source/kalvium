// Get the elements from the HTML
const form = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const results = document.getElementById("results");
const resultCount = document.getElementById("result-count");


// Wikimedia Commons API
const API = "https://commons.wikimedia.org/w/api.php";


// Listen for the Search form
form.addEventListener("submit", async function (event) {

  // Stop the page from refreshing
  event.preventDefault();

  // Get what the user typed
  const query = searchInput.value.trim();

  // Ignore empty searches
  if (query === "") {
    return;
  }


  // Remove old results
  results.innerHTML = "";


  // Build the API URL
  const url =
    API +
    "?action=query" +
    "&generator=search" +
    "&gsrsearch=" + encodeURIComponent(query) +
    "&gsrnamespace=6" +
    "&gsrlimit=12" +
    "&prop=imageinfo" +
    "&iiprop=url" +
    "&iiurlwidth=400" +
    "&format=json" +
    "&origin=*";


  try {

    // Fetch data from the API
    const response = await fetch(url);

    // Check if the request was successful
    if (!response.ok) {
      throw new Error("Request failed");
    }

    // Convert response into JSON
    const data = await response.json();


    // Get the pages from the API response
    const pages = data.query?.pages || {};

    const items = Object.values(pages);


    // Show result count
    resultCount.textContent =
      `Showing ${items.length} results for "${query}"`;


    // Create a card for every result
    items.forEach(function (item) {

      // Create the card
      const card = document.createElement("article");

      card.className = "card";


      // Create image
      const image = document.createElement("img");

      image.src = item.imageinfo?.[0]?.thumburl ||
                  item.imageinfo?.[0]?.url;

      image.alt = item.title.replace("File:", "");


      // Create title
      const title = document.createElement("h3");

      title.textContent =
        item.title.replace("File:", "");


      // Add image and title to card
      card.appendChild(image);
      card.appendChild(title);


      // Add card to results grid
      results.appendChild(card);

    });

  } catch (error) {

    console.error(error);

    resultCount.textContent = "Unable to load results.";

  }

});


// Quick-pick buttons
const chips = document.querySelectorAll(".chip");


chips.forEach(function (chip) {

  chip.addEventListener("click", function () {

    // Put chip text into search box
    searchInput.value = chip.textContent;

    // Run the search
    form.requestSubmit();

  });

});