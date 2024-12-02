chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, rankingResult } = obj;
    if (type === "NEW_PAGE") {
      addCategoryToUsername(rankingResult);
    }
  });
  
  function addCategoryToUsername(rankingResult) {
    function findCategory(username, result) {
      for (let category of ['a', 'b', 'c']) {
        for (let item of result.a_b_cForUser[category]) {
          if (item.name.toLowerCase() === username.toLowerCase()) {
            return category.toUpperCase();
          }
        }
      }
      return null;
    }
  
    const articles = document.querySelectorAll('article');
    articles.forEach((article, index) => {
      const targetElement = article.querySelector('header div span a');
      if (targetElement) {
        let username = targetElement.textContent.trim();
        console.log(`Found username: ${username}`);
  
        // Strip verified badge from the username
        if (username.includes('Verified')) {
          username = username.replace('Verified', '').trim();
        }
  
        if (!targetElement.nextElementSibling || !targetElement.nextElementSibling.classList.contains('category-text')) {
          const category = findCategory(username, rankingResult);
          if (category) {
            console.log(`Found category for ${username}: ${category}`);
            const categorySpan = document.createElement('span');
            categorySpan.textContent = ` (${category})`;
            categorySpan.className = 'category-text';
            categorySpan.style.color = 'blue';
            targetElement.parentNode.insertBefore(categorySpan, targetElement.nextSibling);
          } else {
            console.log(`No category found for ${username}`);
          }
        }
      }
    });
  }
  
  chrome.storage.local.get("analysisData", function(data) {
    if (data.analysisData) {
      addCategoryToUsername(data.analysisData);
    }
  });


  
  