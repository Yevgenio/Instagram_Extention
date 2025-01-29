// Function to open a tab and show the corresponding container
function openTab(containerId) {
  const tabContents = document.getElementsByClassName("tab-content");
  for (let i = 0; i < tabContents.length; i++) {
      tabContents[i].style.display = "none";
      tabContents[i].classList.remove("active");
  }

  const tabButtons = document.getElementsByClassName("tab-button");
  for (let i = 0; i < tabButtons.length; i++) {
      tabButtons[i].classList.remove("active");
  }

  const currentContainer = document.getElementById(containerId);
  currentContainer.style.display = "block";
  currentContainer.classList.add("active");
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
    // Open the first tab by default
    openTab('container1');
});

// === TAB 1 - A_B_C Ranking ===========================================
document.addEventListener("DOMContentLoaded", () => {
  const keyRuleList = getKeyRuleList(); // Rules for each dataset
  const uploadedData = {}; // Store raw uploaded JSON data
  const unpackedData = {}; // Store unpacked data
  const processButton = document.getElementById("process-data");
  const logDataButton = document.getElementById("log-data");

  // Add a single directory input
  const uploadContainer = document.getElementById("upload-container");
  const uploadRow = document.createElement("div");
  uploadRow.className = "upload-row";
  uploadRow.innerHTML = `
    <label for="folder-upload">Upload Folder:</label>
    <input type="file" id="folder-upload" webkitdirectory directory />
  `;
  uploadContainer.appendChild(uploadRow);

  // Handle folder upload
  document.getElementById("folder-upload").addEventListener("change", (event) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const fileName = file.name; // Get the final file name

        // Match files based on their file name
        const rule = keyRuleList.find((rule) => rule.key === fileName);

        if (rule) {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              uploadedData[rule.key] = JSON.parse(reader.result);
              console.log(`Uploaded ${rule.key}:`, uploadedData[rule.key]);

              // Unpack the data based on the matching rule
              unpackedData[rule.key] = rule.unpack(uploadedData[rule.key]);
              console.log(`Unpacked ${rule.key}:`, unpackedData[rule.key]);
            } catch (err) {
              console.error(`Error parsing ${rule.key}:`, err);
            }
          };
          reader.readAsText(file);
        }
      });
    }
  });

  // Handle data processing
  processButton.addEventListener("click", () => {
    try {
      const followingByImportance = [];

      // Initialize followingByImportance with all unique names
      Object.keys(unpackedData).forEach((key) => {
        const data = unpackedData[key];
        data.forEach((item) => {
          if (item.name && !followingByImportance.some((f) => f.name === item.name)) {
            followingByImportance.push({ name: item.name, count: 0 });
          }
        });
      });

      // Process the data using analyzeAll
      Object.keys(unpackedData).forEach((key) => {
        const data = unpackedData[key];
        const rule = keyRuleList.find((rule) => rule.key === key);
        if (rule) {
          analyzeAll(followingByImportance, { [key]: data }, [rule]);
        }
      });

      // Sort the results in descending order by count
      followingByImportance.sort((a, b) => b.count - a.count);

      // Determine category boundaries
      const total = followingByImportance.length;
      const categoryAEnd = Math.ceil(total * 0.2); // Top 20%
      const categoryBEnd = Math.ceil(total * 0.7); // Next 50% (20% + 50%)

      // Categorize users into A, B, and C
      followingByImportance.forEach((user, index) => {
        if (index < categoryAEnd) {
          user.category = 'A';
        } else if (index < categoryBEnd) {
          user.category = 'B';
        } else {
          user.category = 'C';
        }
      });

      // Store the categorized data in Chrome storage
      chrome.storage.local.set({ categorizedData: followingByImportance }, () => {
        console.log("Categorized data stored in Chrome storage:", followingByImportance);
        alert("Data processing complete and stored in Chrome storage.");
      });
    } catch (err) {
      console.error("Error processing data:", err);
    }
  });

  // Log current data in storage as a JSON file
  logDataButton.addEventListener("click", () => {
    chrome.storage.local.get("categorizedData", (data) => {
      if (data.categorizedData) {
        downloadJSONFile(data.categorizedData, "followingByImportanceWithCategories.json");
      } else {
        alert("No categorized data found.");
      }
    });
  });

  chrome.storage.local.get("categorizedData", (data) => {
    const currentDataContainer = document.getElementById("currentData");
  
    // Clear previous content
    currentDataContainer.innerHTML = "";
  
    if (data && data.categorizedData) {
      const categorizedData = data.categorizedData;
      const a = categorizedData.filter(user => user.category === 'A');
      const b = categorizedData.filter(user => user.category === 'B');
      const c = categorizedData.filter(user => user.category === 'C');
      // Create a summary title
      const title = document.createElement("h3");
      title.textContent = "Categorized Data Summary";
      currentDataContainer.appendChild(title);
  
      // Helper function to create and append a category section
      function createCategorySection(categoryName, categoryData) {
        const section = document.createElement("div");
        section.className = "data-section";
  
        const categoryTitle = document.createElement("h4");
        categoryTitle.textContent = `Category ${categoryName.toUpperCase()}`;
        section.appendChild(categoryTitle);
  
        const itemList = document.createElement("ul");
        categoryData.slice(0, 5).forEach((item) => {
          const listItem = document.createElement("li");
          listItem.textContent = `${item.name} (${item.count})`;
          itemList.appendChild(listItem);
        });
  
        section.appendChild(itemList);
        currentDataContainer.appendChild(section);

        if (categoryData.length > 5) {
          const moreText = document.createElement("p");
          moreText.textContent = `...and ${categoryData.length - 5} more items.`;
          section.appendChild(moreText);
        }
      }
  
      // Add sections for each category
      createCategorySection("A", a);
      createCategorySection("B", b);
      createCategorySection("C", c);
    } else {
      // If no data is found, display a message
      const noDataMessage = document.createElement("p");
      noDataMessage.textContent = "No categorized data found.";
      currentDataContainer.appendChild(noDataMessage);
    }
  });

});

/**
 * Analyze all data based on the provided rules.
 * @param {Array} followingByImportance - The array of users to update with importance scores.
 * @param {Object} dataOnUser - The uploaded data object containing the datasets to analyze.
 * @param {Array} keyRuleList - List of {key, match, update} rules for processing datasets.
 */
function analyzeAll(followingByImportance, dataOnUser, keyRuleList) {
  keyRuleList.forEach(({ key, match, update }) => {
    try {
      const data = dataOnUser[key];
      if (!Array.isArray(data)) {
        console.warn(`Data for key "${key}" is not an array.`);
        return;
      }

      data.forEach((item) => {
        const target = followingByImportance.find((f) => match(f, item));
        if (target) {
          update(target, item);
        }
      });
    } catch (err) {
      console.error(`Error in analyzeAll for key ${key}:`, err);
    }
  });
}

/**
 * Utility function to download a JSON object as a file.
 * @param {Object} jsonData - The JSON data to download.
 * @param {string} fileName - The name of the downloaded file.
 */
function downloadJSONFile(jsonData, fileName) {
  const jsonString = JSON.stringify(jsonData, null, 2); // Pretty-print JSON
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Create a temporary download link
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();

  // Clean up the temporary link
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Define the list of rules to match files and process them.
 */
function getKeyRuleList() {
  return [
    {
      key: "liked_posts.json",
      unpack: (data) => unpackStringList(data, "likes_media_likes"),
      match: (f, item) => f.name === item.name,
      update: (target, item) => {
        if (item.timestamp) {
          const year = new Date(item.timestamp * 1000).getFullYear();
          target.count += year === 2024 ? 3 : year === 2023 ? 3 : year === 2022 ? 2 : 1;
        }
      },
    },
    {
      key: "story_likes.json",
      unpack: (data) => unpackStringList(data, "story_activities_story_likes"),
      match: (f, item) => f.name === item.name,
      update: (target, item) => {
        if (item.timestamp) {
          const year = new Date(item.timestamp * 1000).getFullYear();
          target.count += year === 2024 ? 3 : year === 2023 ? 3 : year === 2022 ? 2 : 1;
        }
      },
    },
    {
      key: "post_comments_1.json",
      unpack: unpackStringMap,
      match: (f, item) => f.name === item.name,
      update: (target, item) => {
        if (item.timestamp) {
          const year = new Date(item.timestamp * 1000).getFullYear();
          target.count += year === 2024 ? 6 : year === 2023 ? 6 : year === 2022 ? 4 : 2;
        }
      },
    },
    {
      key: "followers_1.json",
      unpack: (data) => unpackStringList(data, "relationships_followers"),
      match: (f, item) => f.name === item.name,
      update: (target) => {
        target.count++;
      },
    },
    {
      key: "close_friends.json",
      unpack: (data) => unpackStringList(data, "relationships_close_friends"),
      match: (f, item) => f.name === item.name,
      update: (target) => {
        target.count += 15;
      },
    },
    {
      key: "liked_comments.json",
      unpack: (data) => unpackStringList(data, "likes_comment_likes"),
      match: (f, item) => f.name === item.name,
      update: (target, item) => {
        if (item.timestamp) {
          const year = new Date(item.timestamp * 1000).getFullYear();
          target.count += year === 2024 ? 3 : year === 2023 ? 3 : year === 2022 ? 2 : 1;
        }
      },
    },
  ];
}

function unpackStringList(data, key) {
  return (data[key] || []).map((item) => {
    const entry = item.string_list_data?.[0];
    return {
      name: item.title || entry?.value,
      timestamp: entry?.timestamp,
    };
  }).filter(Boolean); // Remove null/undefined entries
}

function unpackStringMap(data) {
  return data.map((item) => {
    const owner = item.string_map_data?.["Media Owner"]?.value;
    const timestamp = item.string_map_data?.["Time"]?.timestamp;
    return {
      name: owner,
      timestamp,
    };
  }).filter(Boolean);
}

// == TAB 2 - User Activity ===========================================

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

// === TAB 3 - urlSessions ===========================================

document.addEventListener("DOMContentLoaded", () => {
  // Load URL session data when the tab is opened
  document.getElementById('tab3').addEventListener('click', () => {
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

      // const durationCell = document.createElement("td");
      // const duration = (new Date(session.endTime) - new Date(session.startTime)) / 1000;
      // const minutes = Math.floor(duration / 60);
      // const seconds = duration % 60;
      // durationCell.textContent = `${minutes}m ${seconds}s`;
      // row.appendChild(durationCell);

      tableBody.appendChild(row);
  });
}