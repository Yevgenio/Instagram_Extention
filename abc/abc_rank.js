const fs = require("fs");
const path = require("path");

/**
 * Generic function to fetch and process data from a JSON file and merge it into a target file.
 * @param {string} userName - The username for which data is being processed.
 * @param {string} inputSubDir - Subdirectory path where the input file is located.
 * @param {string} inputFileName - Name of the input JSON file.
 * @param {string} outputFileName - Name of the output JSON file.
 * @param {function} processData - Function to process the input data into the desired format.
 */
function fetchAndMergeData(userName, inputSubDir, inputFileName, outputFileName, processData) {
  try {
    // Paths
    const inputFilePath = path.join(process.cwd(), `data_for_${userName}`, inputSubDir, inputFileName);
    const outputFileDir = path.join(process.cwd(), `data_for_${userName}`);
    const outputFilePath = path.join(outputFileDir, outputFileName);

    // Placeholder for processed data
    let processedData = [];

    // Check if the input file exists
    if (fs.existsSync(inputFilePath)) {
      try {
        const inputData = fs.readFileSync(inputFilePath, "utf8");
        const parsedData = JSON.parse(inputData);

        // Process data using the provided callback
        processedData = processData(parsedData);
      } catch (readError) {
        throw new Error(`Error reading or processing input file: ${readError.message}`);
      }
    } else {
      console.warn(`Input file not found: ${inputFilePath}, proceeding without this data.`);
    }

    // Read and merge with existing output file data
    let existingData = {};
    try {
      if (fs.existsSync(outputFilePath)) {
        const existingDataJson = fs.readFileSync(outputFilePath, "utf8");
        existingData = JSON.parse(existingDataJson);
      }
    } catch (readError) {
      throw new Error(`Error reading output file: ${readError.message}`);
    }

    // Update the output data
    const outputKey = path.basename(inputFileName, ".json"); // Derive a key from the input file name
    existingData[outputKey] = processedData;

    // Write the merged data back to the output file
    try {
      fs.mkdirSync(outputFileDir, { recursive: true });
      fs.writeFileSync(outputFilePath, JSON.stringify(existingData, null, 2));
    } catch (writeError) {
      throw new Error(`Error writing to output file: ${writeError.message}`);
    }
  } catch (err) {
    console.error("Error processing data:", err);
  }
}

/**
 * Example of a data processing function for emoji slider data.
 * @param {Object} rawData - Raw JSON data from the input file.
 * @returns {Array} - Processed data in the desired format.
 */
function processEmojiSliderData(rawData) {
  const emojiSliders = rawData.story_activities_emoji_sliders || [];
  return emojiSliders.map((slider) => {
    if (slider.title && slider.string_list_data[0]?.timestamp) {
      const timestamp = slider.string_list_data[0].timestamp;
      const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
      return {
        name: slider.title,
        time: date.getFullYear(),
      };
    }
    return null; // Ignore invalid entries
  }).filter(Boolean); // Remove null values
}

// Example usage
module.exports = function fetchEmojiSliders(userName) {
  fetchAndMergeData(
    userName,
    "your_instagram_activity/story_sticker_interactions",
    "emoji_sliders.json",
    "final_data.json",
    processEmojiSliderData
  );
};


/**
 * Generalized function to analyze and update `followingByImportance` based on user data.
 * @param {Array} followingByImportance - The array of users to update with importance scores.
 * @param {Object} dataOnUser - The user's data object containing the data to analyze.
 * @param {string} key - The key in `dataOnUser` to analyze (e.g., "emojiSliders", "closeFriends").
 * @param {function} scoringRule - A callback function that defines how to update importance scores.
 */
  
// Wrapper function for analyzeData
const analyzeData = (userName) => {
    try {
        const filePathReadAndWrite = path.join(
        process.cwd(),
        `data_for_${userName}`,
        "final_data.json"
        );

        const followingByImportance = [];
        const dataOnUserString = fs.readFileSync(filePathReadAndWrite, "utf8");
        const dataOnUser = JSON.parse(dataOnUserString);

        // Initialize followingByImportance array
        const arrayOfFollowing = dataOnUser.following;
        arrayOfFollowing.forEach((personYouFollow) => {
        followingByImportance.push({ name: personYouFollow, count: 0 });
        });

        // Apply rules to analyze all data
        analyzeAll(followingByImportance, dataOnUser, keyRuleList);

        // Sort results by count in descending order
        followingByImportance.sort((a, b) => b.count - a.count);

        // Find unfollowed followers
        const unfollowedFollowers = findUnfollowedFollowing(dataOnUser);

        return { followingByImportance, unfollowedFollowers, topics: dataOnUser.topics };
    } catch (err) {
        console.log("Something went wrong in analyzeData:", err);
    }
};

/**
 * Processes all the key-rule pairs for `dataOnUser`.
 * @param {Array} followingByImportance - The array of users to update with importance scores.
 * @param {Object} dataOnUser - The user's data object containing the data to analyze.
 * @param {Array} keyRuleList - List of {key, rule} pairs to process.
 */
  
const analyzeAll = (followingByImportance, dataOnUser, keyRuleList) => {
    keyRuleList.forEach(({ key, match, update }) => {
        try {
        const data = dataOnUser[key];
        if (!data || !Array.isArray(data)) {
            console.warn(`No valid data found for key: ${key}`);
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
};

// Rule list for each key
const keyRuleList = [
    {
      key: "likesForPosts",
      match: (f, item) => f.name === item.name,
      update: (target, item) => {
        if (item.time === 2024) target.count += 3;
        if (item.time === 2023) target.count += 3;
        if (item.time === 2022) target.count += 2;
        if (item.time === 2021) target.count += 1;
      },
    },
    {
      key: "likesForStories",
      match: (f, item) => f.name === item.name,
      update: (target, item) => {
        if (item.time === 2024) target.count += 3;
        if (item.time === 2023) target.count += 3;
        if (item.time === 2022) target.count += 2;
        if (item.time === 2021) target.count += 1;
      },
    },
    {
      key: "comments",
      match: (f, item) => f.name === item.name,
      update: (target, item) => {
        if (item.time === 2024) target.count += 6;
        if (item.time === 2023) target.count += 6;
        if (item.time === 2022) target.count += 4;
        if (item.time === 2021) target.count += 2;
      },
    },
    {
      key: "followers",
      match: (f, item) => f.name === item,
      update: (target) => {
        target.count++;
      },
    },
    {
      key: "quizzes",
      match: (f, item) => f.name === item.name,
      update: (target, item) => {
        if (item.time === 2024) target.count += 3;
        if (item.time === 2023) target.count += 3;
        if (item.time === 2022) target.count += 2;
        if (item.time === 2021) target.count += 1;
      },
    },
    {
      key: "questions",
      match: (f, item) => f.name === item.name,
      update: (target, item) => {
        if (item.time === 2024) target.count += 3;
        if (item.time === 2023) target.count += 3;
        if (item.time === 2022) target.count += 2;
        if (item.time === 2021) target.count += 1;
      },
    },
    {
      key: "polls",
      match: (f, item) => f.name === item.name,
      update: (target, item) => {
        if (item.time === 2024) target.count += 3;
        if (item.time === 2023) target.count += 3;
        if (item.time === 2022) target.count += 2;
        if (item.time === 2021) target.count += 1;
      },
    },
    {
      key: "emojiSliders",
      match: (f, item) => f.name === item.name,
      update: (target, item) => {
        if (item.time === 2024) target.count += 3;
        if (item.time === 2023) target.count += 3;
        if (item.time === 2022) target.count += 2;
        if (item.time === 2021) target.count += 1;
      },
    },
    {
      key: "closeFriends",
      match: (f, item) => f.name === item,
      update: (target) => {
        target.count += 15;
      },
    },
    {
      key: "messagesNames",
      match: (f, item) => f.name === item.name,
      update: (target, item) => {
        target.count += item.count / 5;
      },
    },
];
