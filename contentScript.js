// // Function to add category information to usernames
// function addCategoryToUsername(rankingResult) {
//   console.log("category to usernames:", rankingResult);
  
//   function findCategory(username, result) {
//     for (let category of ['a', 'b', 'c']) {
//       for (let item of result[category]) {
//         if (item.name.toLowerCase() === username.toLowerCase()) {
//           return category.toUpperCase();
//         }
//       }
//     }
//     return null;
//   }

//   const articles = document.querySelectorAll('article');
//   articles.forEach((article) => {
    
//     const targetElement = article.getElementsByClassName('_ap3a _aaco _aacw _aacx _aad7 _aade')[0];
//     console.log(`Found targetElement:`, targetElement);
//     if (targetElement) {
//       let username = targetElement.textContent.trim();
//       console.log(`Found username: ${username}`);

//       // Strip verified badge from the username
//       if (username.includes('Verified')) {
//         username = username.replace('Verified', '').trim();
//       }

//       // Avoid adding duplicate category spans
//       if (
//         !targetElement.nextElementSibling ||
//         !targetElement.nextElementSibling.classList.contains('category-text')
//       ) {
//         const category = findCategory(username, rankingResult);
//         console.log(`Found category for ${username}: ${category}`);
//         if (category) {
//           console.log(`Found category for ${username}: ${category}`);
//           const categorySpan = document.createElement('span');
//           categorySpan.textContent = ` (${category})`;
//           categorySpan.className = 'category-text';
//           categorySpan.style.color = 'blue';
//           targetElement.parentNode.insertBefore(categorySpan, targetElement.nextSibling);
//         } else {
//           console.log(`No category found for ${username}`);
//         }
//       }
//     }
//   });
// }

// let categorizedDataLoaded = false;
// let categorizedData = null;

// // Check if categorized data exists in local storage on load
// chrome.storage.local.get("categorizedData", (data) => {
//   if (data.categorizedData) {
//     console.log("Using stored categorizedData:", data.categorizedData);
//     categorizedDataLoaded = true;
//     categorizedData = data.categorizedData;
//     addCategoryToUsername(data.categorizedData);
//   } else {
//     console.log("No categorizedData found in local storage.");
//   }
// });

// // //Retain the message listener for dynamic updates
// // chrome.runtime.onMessage.addListener((obj, sender, response) => {
// //   const { type, rankingResult } = obj;
// //   if (type === "NEW_PAGE") {
// //     console.log("Received NEW_PAGE message with rankingResult:", rankingResult);
// //     categorizedDataLoaded = true;
// //       categorizedData = data.categorizedData;
// //     addCategoryToUsername(rankingResult);
// //   }
// // });

// // Check on scroll if categorizedData is loaded, if not read from storage
// window.addEventListener('scroll', () => {
//   if (!categorizedDataLoaded) {
//     chrome.storage.local.get("categorizedData", (data) => {
//       if (data.categorizedData) {
//         console.log("Using stored categorizedData on scroll:", data.categorizedData);
//         categorizedDataLoaded = true;
//         categorizedData = data.categorizedData;
//         addCategoryToUsername(data.categorizedData);
//       } else {
//         console.log("No categorizedData found in local storage on scroll.");
//       }
//       return;
//     });
//   }
//   console.log("categorizedData:", categorizedData);
//   addCategoryToUsername(categorizedData);
// });
