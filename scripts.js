// Use for fetch the header and footer file into the page
async function fetchContainer(container, url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to load: " + url);
    }
    const html = await response.text();
    document.getElementById(container).innerHTML = html;
  } catch (e) {
    console.error("Error loading container:", e);
  }
}

// apply the Dark Mode if previously saved it
function applyDarkModeIfSaved() {
  if (localStorage.getItem("dark-mode") === "enabled") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}

// Initialize and handle the dark-mode toggle switch
function setupToggleButton() {
  const toggle = document.getElementById("toggleBtn");
  if (!toggle) return;

  // Set toggle state based on current mode
  toggle.checked = localStorage.getItem("dark-mode") === "enabled";

  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("dark-mode", "enabled");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("dark-mode", "disabled");
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  //load header and footer file dynamically
  await fetchContainer("header-container", "header.html");
  await fetchContainer("footer-container", "footer.html");
  applyDarkModeIfSaved();
  setupToggleButton();

  const newslist = document.getElementById("news-list");
  const newscontainer = document.getElementById("news-container");

  // Fetch and render list of posts
  fetch("posts.json")
    .then((response) => response.json())
    .then((posts) => {
      posts.forEach((post, index) => {
        const postElement = document.createElement("div");
        postElement.className = "cursor-pointer";
        postElement.innerHTML = `
          <div class="bg-white border border-gray-300 rounded-lg p-6 mb-6 hover:shadow-lg transition">
            <h3 class="text-xl font-semibold mb-2">${post.title}</h3>
            <p class="text-sm text-gray-500 mb-4">${post.date}</p>
            <p class="text-gray-700">${post.excerpt}</p>
          </div>`;

        // Show full post content on click
        postElement.addEventListener("click", () => {
          newscontainer.innerHTML = `
            <div class="bg-white rounded-lg p-8 shadow-lg">
              <h2 class="text-3xl font-bold mb-4">${post.title}</h2>
              <p class="text-sm text-gray-500 mb-6">${post.date}</p>
              <div class="text-gray-800 whitespace-pre-line">${post.content}</div>
              <button class="mt-8 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" id="backBtn">
                ← Back to News List
              </button>
            </div>
          `;

          // Go back button
          document.getElementById("backBtn").addEventListener("click", () => {
            location.reload();
          });
        });

        newslist.appendChild(postElement);
      });
    })
    .catch((error) => console.error("Error loading blog posts:", error));
});
