

document.addEventListener("DOMContentLoaded", () => {
  const keyRuleList = getKeyRuleList(); // Rules for each dataset
  const uploadedData = {}; // Store raw uploaded JSON data
  const unpackedData = {}; // Store unpacked data
  const processButton = document.getElementById("process-data");
  const logDataButton = document.getElementById("log-data");

  // Dynamically create upload inputs for each rule
  const uploadContainer = document.getElementById("upload-container");
  keyRuleList.forEach((rule) => {
    const uploadRow = document.createElement("div");
    uploadRow.className = "upload-row";
    uploadRow.innerHTML = `
      <label for="${rule.key}">${rule.key.replace(/([A-Z])/g, " $1")}:</label>
      <input type="file" id="${rule.key}" data-key="${rule.key}" />
    `;
    uploadContainer.appendChild(uploadRow);
  });

  // Handle file uploads
  uploadContainer.addEventListener("change", (event) => {
    const input = event.target;
    if (input.type === "file") {
      const key = input.dataset.key;
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            uploadedData[key] = JSON.parse(reader.result);
            console.log(`Uploaded ${key}:`, uploadedData[key]);

            // Find the rule for this key and unpack the data
            const rule = keyRuleList.find((rule) => rule.key === key);
            if (rule) {
              unpackedData[key] = rule.unpack(uploadedData[key]);
              console.log(`Unpacked ${key}:`, unpackedData[key]);
            }
          } catch (err) {
            console.error(`Error parsing ${key}:`, err);
            alert(`Error uploading ${key}: Invalid JSON`);
          }
        };
        reader.readAsText(file);
      }
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

      // Sort the results
      followingByImportance.sort((a, b) => b.count - a.count);

      // Store the results in Chrome storage
      chrome.storage.local.set({ followingByImportance }, () => {
        console.log("Data stored in Chrome storage:", followingByImportance);
        alert("Data processing complete and stored in Chrome storage.");
      });
    } catch (err) {
      console.error("Error processing data:", err);
    }
  });

  // Log current data in storage as a JSON file
  logDataButton.addEventListener("click", () => {
    chrome.storage.local.get("followingByImportance", (data) => {
      if (data.followingByImportance) {
        downloadJSONFile(data.followingByImportance, "followingByImportance.json");
      } else {
        alert("No data found for 'followingByImportance'.");
      }
    });
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

function unpackDirectArray(data) {
  return data.map((item) => ({
    name: item,
  })).filter(Boolean);
}

function getKeyRuleList() {
  return [
    {
      key: "likesForPosts",
      unpack: (data) => unpackStringList(data, "likes_media_likes"),
      match: (f, item) => f.name === item.name,
      update: (target, item) => {
        if (item.timestamp) {
          const year = new Date(item.timestamp * 1000).getFullYear();
          if (year === 2024) target.count += 3;
          if (year === 2023) target.count += 3;
          if (year === 2022) target.count += 2;
          if (year === 2021) target.count += 1;
        }
      },
    },
    {
      key: "likesForStories",
      unpack: (data) => unpackStringList(data, "story_activities_story_likes"),
      match: (f, item) => f.name === item.name,
      update: (target, item) => {
        if (item.timestamp) {
          const year = new Date(item.timestamp * 1000).getFullYear();
          if (year === 2024) target.count += 3;
          if (year === 2023) target.count += 3;
          if (year === 2022) target.count += 2;
          if (year === 2021) target.count += 1;
        }
      },
    },
    {
      key: "comments",
      unpack: unpackStringMap, // Uses a different unpack logic
      match: (f, item) => f.name === item.name,
      update: (target, item) => {
        if (item.timestamp) {
          const year = new Date(item.timestamp * 1000).getFullYear();
          if (year === 2024) target.count += 6;
          if (year === 2023) target.count += 6;
          if (year === 2022) target.count += 4;
          if (year === 2021) target.count += 2;
        }
      },
    },
    {
      key: "followers",
      unpack: (data) => unpackStringList(data, "relationships_followers"),
      match: (f, item) => f.name === item.name,
      update: (target) => {
        target.count++;
      },
    },
    {
      key: "closeFriends",
      unpack: (data) => unpackStringList(data, "relationships_close_friends"),
      match: (f, item) => f.name === item.name,
      update: (target) => {
        target.count += 15;
      },
    },
    {
      key: "likedComments",
      unpack: (data) => unpackStringList(data, "likes_comment_likes"),
      match: (f, item) => f.name === item.name,
      update: (target, item) => {
        if (item.timestamp) {
          const year = new Date(item.timestamp * 1000).getFullYear();
          if (year === 2024) target.count += 3;
          if (year === 2023) target.count += 3;
          if (year === 2022) target.count += 2;
          if (year === 2021) target.count += 1;
        }
      },
    },
    {
      key: "polls",
      unpack: (data) => unpackStringList(data, "poll_activities"),
      match: (f, item) => f.name === item.name,
      update: (target, item) => {
        if (item.timestamp) {
          const year = new Date(item.timestamp * 1000).getFullYear();
          if (year === 2024) target.count += 3;
          if (year === 2023) target.count += 3;
          if (year === 2022) target.count += 2;
          if (year === 2021) target.count += 1;
        }
      },
    },
    {
      key: "emojiSliders",
      unpack: (data) => unpackStringList(data, "emoji_slider_activities"),
      match: (f, item) => f.name === item.name,
      update: (target, item) => {
        if (item.timestamp) {
          const year = new Date(item.timestamp * 1000).getFullYear();
          if (year === 2024) target.count += 3;
          if (year === 2023) target.count += 3;
          if (year === 2022) target.count += 2;
          if (year === 2021) target.count += 1;
        }
      },
    },
  ]
};