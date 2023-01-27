// https://javascript.plainenglish.io/how-to-build-a-search-bar-7d8a8a3d9d00
const searchInput = document.getElementById("searchTerm");

// store name elements in array-like object
const namesFromDOM = document.getElementsByClassName("name");

// listen for user events
searchInput.addEventListener("keyup", (event) => {
  const { value } = event.target;

  // get user search input converted to lowercase
  const searchQuery = value.toLowerCase();

  for (const nameElement of namesFromDOM) {
    // store name text and convert to lowercase
    let name = nameElement.textContent.toLowerCase();

    // compare current name to search input
    if (name.includes(searchQuery)) {
      // found name matching search, display it
      nameElement.closest(".list-group-item").style.display = "block";
    } else {
      // no match, don't display name
      nameElement.closest(".list-group-item").style.display = "none";
      //nameElement.parentElement.style.display = "none";
      //nameElement.style.display = "none";
    }
  }
});
