// Get the elements from the HTML
const form = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const results = document.getElementById("results");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");

// Wikimedia Commons API
const API = "https://commons.wikimedia.org/w/api.php";

// Listen for the Search form
form.addEventListener("submit", async function (event) {
  // Stop the page from refreshing
  event.preventDefault();

  // Get the search text
  const query = searchInput.value.trim();

  // Ignore blank searches
  if (query === "") {
    return;
  }

  // Clear old results
  results.innerHTML = "";

  // Hide the old empty state
  emptyState.style.display = "none";

  // Show loading message
  resultCount.textContent = "Searching...";
  results.innerHTML = `
    <div class="status-message">
      🔎 Searching for "${query}"...
    </div>
  `;

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
    // Ask the API for images
    const response = await fetch(url);

    // Check if the request was successful
    if (!response.ok) {
      throw new Error("Request failed");
    }

    // Convert the response into JavaScript data
    const data = await response.json();

    // Get the results
    const pages = data.query?.pages || {};
    const items = Object.values(pages);

    // Clear the loading message
    results.innerHTML = "";

    // Check if there are no results
    if (items.length === 0) {
      resultCount.textContent = "No results";

      results.innerHTML = `
        <div class="status-message">
          <h3>No results found 😕</h3>
          <p>
            No images were found for "${query}".
            Try another search word.
          </p>
        </div>
      `;

      return;
    }

    // Show result count
    resultCount.textContent =
      `Showing ${items.length} results for "${query}"`;

    // Create a card for every image
    items.forEach(function (item) {
      const imageInfo = item.imageinfo?.[0];

      // Skip items without image information
      if (!imageInfo) {
        return;
      }

      // Create card
      const card = document.createElement("article");
      card.className = "card";

      // Create image
      const image = document.createElement("img");

      image.src = imageInfo.thumburl || imageInfo.url;

      image.alt = item.title.replace("File:", "");

      // Create title
      const title = document.createElement("h3");

      title.textContent = item.title.replace("File:", "");

      // Put image and title inside card
      card.appendChild(image);
      card.appendChild(title);

      // Put card inside results
      results.appendChild(card);
    });
  } catch (error) {
    // Show error in console for developers
    console.error(error);

    // Clear loading message
    results.innerHTML = "";

    // Show friendly error message
    resultCount.textContent = "Search failed";

    results.innerHTML = `
      <div class="status-message">
        <h3>Something went wrong 😕</h3>
        <p>
          We couldn't load the images.
          Please check your internet connection and try again.
        </p>
      </div>
    `;
  }
});

// Quick-pick buttons
const chips = document.querySelectorAll(".chip");

chips.forEach(function (chip) {
  chip.addEventListener("click", function () {
    searchInput.value = chip.textContent;

    // Submit the form
    form.requestSubmit();
  });
});