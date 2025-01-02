// - - Popup Tabbed Display - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Function to open a tab and show the corresponding container
function openTab(containerId) {
    // Get all elements with class "tab-content" and hide them
    const tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";
    }

    // Get all elements with class "tab-button" and remove the class "active"
    const tabButtons = document.getElementsByClassName("tab-button");
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].className = tabButtons[i].className.replace(" active", "");
    }

    // Show the current tab content and add an "active" class to the button that opened the tab
    document.getElementById(containerId).style.display = "block";
    const activeButton = document.querySelector(`button[id="${containerId.replace('container', 'tab')}"]`);
    if (activeButton) {
        activeButton.classList.add("active");
    }
}

// Set up event listeners for the tab buttons
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('tab1').addEventListener('click', () => openTab('container1'));
    document.getElementById('tab2').addEventListener('click', () => openTab('container2'));
    document.getElementById('tab3').addEventListener('click', () => openTab('container3'));
    document.getElementById('tab4').addEventListener('click', () => openTab('container4'));
    // Open the first tab by default
    openTab('container1');
});

// - - Session Display - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

document.addEventListener('DOMContentLoaded', function() {
  // Load session data and display the last 5 sessions
  chrome.storage.local.get('sessionData', function(data) {
      const sessionData = data.sessionData || [];
      displayLastSessions(sessionData);
  });

  // Export button functionality
  document.getElementById('exportButton').addEventListener('click', function() {
      chrome.storage.local.get('sessionData', function(data) {
          const jsonData = data.sessionData || [];

          // Convert to JSON string
          const jsonStr = JSON.stringify(jsonData, null, 2);

          // Create a downloadable file
          const blob = new Blob([jsonStr], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'instagram_sessions.json';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
      });
  });
});

function displayLastSessions(sessionData) {
  const tableBody = document.getElementById('sessionTableBody');
  tableBody.innerHTML = ''; // Clear previous rows

  const lastSessions = sessionData.slice(-5).reverse(); // Get last 5 sessions, most recent first

  lastSessions.forEach((session, index) => {
      const row = document.createElement('tr');

      const sessionNumberCell = document.createElement('td');
      sessionNumberCell.textContent = sessionData.length - index; // Session number
      row.appendChild(sessionNumberCell);

      const startTimeCell = document.createElement('td');
      startTimeCell.textContent = new Date(session.startTime).toLocaleString(); // Start time
      row.appendChild(startTimeCell);

      const endTimeCell = document.createElement('td');
      endTimeCell.textContent = session.endTime ? new Date(session.endTime).toLocaleString() : 'Ongoing'; // End time
      row.appendChild(endTimeCell);

      const durationCell = document.createElement('td');
      if (session.endTime) {
          const duration = new Date(session.endTime) - new Date(session.startTime);
          const durationSeconds = Math.floor(duration / 1000);
          const hours = Math.floor(durationSeconds / 3600);
          const minutes = Math.floor((durationSeconds % 3600) / 60);
          const seconds = durationSeconds % 60;
          durationCell.textContent = `${hours}h ${minutes}m ${seconds}s`;
      } else {
          durationCell.textContent = 'Ongoing';
      }
      row.appendChild(durationCell);

      tableBody.appendChild(row);
  });
}

// - - Ranking Display - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

import { getActiveTabURL } from "./utils.js";

let rankingResult = null;
let foundCategory = '';

document.getElementById('uploadButton').addEventListener('click', function() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const result = JSON.parse(e.target.result);
        console.log("Uploaded JSON:", result); // Log the content of the JSON file
        rankingResult = result;
        // Save the data to chrome storage
        chrome.storage.local.set({ analysisData: result }, function() {
          console.log("Data saved to storage.");
        });
        displayResult(result);
      } catch (error) {
        // console.error("Error parsing JSON:", error);
        console.log("Error parsing JSON:", error);
      }
    };
    reader.readAsText(file);
  } else {
    alert('Please select a file.');
  }
});

function displayResult(result) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';

  if (result && result.a_b_cForUser) {
    ['a', 'b', 'c'].forEach(category => {
      const categoryDiv = document.createElement('div');
      const title = document.createElement('h3');
      title.textContent = `Category ${category.toUpperCase()}`;
      categoryDiv.appendChild(title);

      result.a_b_cForUser[category].forEach(item => {
        const p = document.createElement('p');
        p.textContent = `Name: ${item.name}, Count: ${item.count}`;
        categoryDiv.appendChild(p);
      });

      resultDiv.appendChild(categoryDiv);
    });
  } else {
    // console.error("Expected a valid structure in the JSON");
    console.log("Expected a valid structure in the JSON");

  }
}

document.getElementById('getCategoryButton').addEventListener('click', function() {
  const username = document.getElementById('usernameInput').value.trim();
  const searchResultDiv = document.getElementById('searchResult');
  searchResultDiv.innerHTML = '';

  if (rankingResult && rankingResult.a_b_cForUser) {
    let found = false;
    ['a', 'b', 'c'].forEach(category => {
      rankingResult.a_b_cForUser[category].forEach(item => {
        if (item.name.toLowerCase() === username.toLowerCase()) {
          found = true;
          foundCategory = `Category: ${category.toUpperCase()}`;
          searchResultDiv.textContent = foundCategory;
        }
      });
    });
    if (!found) {
      searchResultDiv.textContent = "Username not found in any category.";
    }
  } else {
    searchResultDiv.textContent = "No data available.";
  }
});

// Inject the addRatingButton function into the Instagram page
document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();
  if (!activeTab.url.includes("instagram.com")) {
    const container = document.getElementsByClassName("container")[0];
    container.innerHTML = '<div class="title">This is not an Instagram page.</div>';
    return;
  }

  chrome.storage.local.get("analysisData", function(data) {
    if (data.analysisData) {
      console.log("Data loaded from storage:", data.analysisData);
      rankingResult = data.analysisData;
      displayResult(data.analysisData);

      // Inject the addRatingButton function
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: (rankingResult) => {
          function addRatingButton() {
            const articles = document.getElementsByTagName('article');

            for (let i = 0; i < articles.length; i++) {
              const targetElement = articles[i].firstChild.firstChild.firstChild.childNodes[1].firstChild.firstChild;

              if (!targetElement.querySelector('.rating-button')) {
                const button = document.createElement('button');
                button.textContent = 'Rating';
                button.className = 'rating-button';

                // Get the username for the current post
                const username = targetElement.firstChild.firstChild.firstChild.textContent.trim();
                console.log(`Username for post ${i}: ${username}`);

                // Append the button and the username text
                targetElement.appendChild(button);

                const usernameSpan = document.createElement('span');
                usernameSpan.textContent = ` (${username})`;
                // targetElement.appendChild(usernameSpan);

                // Find and log the category of the username
                if (rankingResult) {
                  const category = findCategory(username, rankingResult);
                  console.log(`Category for ${username}: ${category}`);
                  targetElement.appendChild(document.createTextNode(category));
                                } else {
                  console.log("Global result is not available.");
                //   console.error("Global result is not available.");

                }
              }
            }
          }

          function findCategory(username, result) {
            for (let category of ['a', 'b', 'c']) {
              if (result.a_b_cForUser && result.a_b_cForUser[category]) {
                for (let item of result.a_b_cForUser[category]) {
                  if (item.name.toLowerCase() === username.toLowerCase()) {
                    return category.toUpperCase();
                  }
                }
              }
            }
            return 'Not Found';
          }

          addRatingButton();

          const observer = new MutationObserver(addRatingButton);
          observer.observe(document.body, { childList: true, subtree: true });
        },
        args: [rankingResult]
      });
    }
  });
});

// === TAB 4 - urlSessions ===========================================

document.addEventListener("DOMContentLoaded", () => {
  // Load URL session data when the tab is opened
  document.getElementById('tab4').addEventListener('click', () => {
      chrome.storage.local.get("urlSessions", (data) => {
          const urlSessions = data.urlSessions || [];
          displayURLSessions(urlSessions);
      });
  });
});

function displayURLSessions(urlSessions) {
  const tableBody = document.getElementById("urlSessionTableBody");
  tableBody.innerHTML = ""; // Clear previous rows

  urlSessions.slice(-10).reverse().forEach((session) => {
      const row = document.createElement("tr");

      const urlCell = document.createElement("td");
      urlCell.textContent = session.url || "Unknown";
      row.appendChild(urlCell);

      const startTimeCell = document.createElement("td");
      startTimeCell.textContent = new Date(session.startTime).toLocaleString();
      row.appendChild(startTimeCell);

      const endTimeCell = document.createElement("td");
      endTimeCell.textContent = new Date(session.endTime).toLocaleString();
      row.appendChild(endTimeCell);

      const durationCell = document.createElement("td");
      const duration = (new Date(session.endTime) - new Date(session.startTime)) / 1000;
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      durationCell.textContent = `${minutes}m ${seconds}s`;
      row.appendChild(durationCell);

      tableBody.appendChild(row);
  });
}

//////////////////////////////////////////////////////////////////////////////////

// import { Chart } from 'chart.js';

// function displaySessionChart(sessionData) {
//     const ctx = document.getElementById('sessionChart').getContext('2d');
//     const durations = sessionData.map(session => {
//         const duration = new Date(session.endTime) - new Date(session.startTime);
//         return Math.floor(duration / 1000); // Convert to seconds
//     });

//     new Chart(ctx, {
//         type: 'bar',
//         data: {
//             labels: ['Session 1', 'Session 2', 'Session 3', '...'],
//             datasets: [{
//                 label: 'Session Duration (s)',
//                 data: durations,
//                 backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                 borderColor: 'rgba(75, 192, 192, 1)',
//                 borderWidth: 1
//             }]
//         },
//         options: {
//             responsive: true,
//             plugins: { legend: { position: 'top' } }
//         }
//     });
// }
