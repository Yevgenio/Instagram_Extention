function mapArticle(article) {
   try {
        const container = article.getElementsByClassName('x78zum5 xdt5ytf x5yr21d xa1mljc xh8yej3 x1bs97v6 x1q0q8m5 xso031l x11aubdm xnc8uc2')[0];
            const header = container.getElementsByClassName('xsag5q8 x1e558r4')[0];
                const title = header.getElementsByClassName('x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh x1uhb9sk x1plvlek xryxfnj x1iyjqo2 x2lwn1j xeuugli x1q0g3np xqjyukv x6s0dn4 x1oa3qoh x1nhvcw1')[0];
                    const title_top = title.getElementsByClassName('x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh x1uhb9sk x1plvlek xryxfnj x1c4vz4f x2lah0s x1q0g3np xqjyukv x6s0dn4 x1oa3qoh x1nhvcw1')[0];
                        const author = title_top.getElementsByClassName('x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh x1uhb9sk x1plvlek xryxfnj x1c4vz4f x2lah0s x1q0g3np xqjyukv x6s0dn4 x1oa3qoh x1nhvcw1')[0];
                        const time = title_top.getElementsByTagName("time")[0]; 
                        const post_id = time.parentElement.parentElement;
                const menu_button = header.getElementsByClassName('x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh x1uhb9sk x1plvlek xryxfnj x1c4vz4f x2lah0s x1q0g3np xqjyukv x6s0dn4 x1oa3qoh x1nhvcw1')[0];
            const content = container.getElementsByClassName('x6s0dn4 xyzq4qe x78zum5 xdt5ytf x2lah0s xl56j7k x6ikm8r x10wlt62 x1n2onr6 x5ur3kl xopu45v x1bs97v6 xmo9t06 x1lcm9me x1yr5g0i xrt01vj x10y3i5r x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x178xt8z xm81vs4 xso031l xy80clv')[0];
                const hasVideo = content.getElementsByTagName("video")[0] ? true : false;
            const footer = container.getElementsByClassName('x1lliihq x1n2onr6')[0];
                const dashbord = footer.getElementsByClassName('x6s0dn4 xrvj5dj x1o61qjw x12nagc x1gslohp')[0];
                    const like_button = dashbord;

        const mappedArticle = {
            title: title,
            author: author,
            post_id: post_id,
            //avatar: avatar,
            hasVideo: hasVideo,
            like_button: like_button,
            menu_button: menu_button,
        }
        
        return mappedArticle;
   }
   catch { 
       return null; }
}

// Utility function to create an element with properties
function buildElement(tag, props = {}) {
    const elem = document.createElement(tag);
    Object.assign(elem, props);  // Assign properties
    return elem;
}

function isElementAlive(element) {
    return element != null && document.body.contains(element);
}

document.addEventListener('scroll', () => {
    handleScroll();
    fetchArticles();
    !isElementAlive(breakdownContainer) && updateCategoryBreakdown();
});

// Local storage key
const LS_KEY = 'articleTrackingData';

// Load existing tracking data from localStorage
let trackingData = loadTrackingData();

// Utility to load data
function loadTrackingData() {
    const dataStr = localStorage.getItem(LS_KEY);
    return dataStr ? JSON.parse(dataStr) : {};
}

// Utility to save data
function saveTrackingData() { 
    localStorage.setItem(LS_KEY, JSON.stringify(trackingData));
}

// Cache for shortcut container and buttons
let trackingContainer = null;

// Fetch or create the references to the articles
function setupTrackingContainer() {
    // Cache shortcut container if not already cached
    if (!trackingContainer || !document.body.contains(trackingContainer)) {
        trackingContainer = document.getElementById("trackingContainer");
        if (!trackingContainer) { 
            calculateAndDisplayAverageDailySessionTime();

            const mainContainer = document.body.getElementsByTagName("main")[0];
            const rightColumnContainer = mainContainer?.firstChild?.lastChild;
            if(!rightColumnContainer) return;
            trackingContainer = buildElement('div',{id: 'trackingContainer'});
            rightColumnContainer.appendChild(trackingContainer);
        }
    }
    return trackingContainer;
}

function isArticleInView(article) {
    const windowHeight = window.innerHeight;
    const viewTop = windowHeight * 0.5;
    const viewBottom = windowHeight * 0.5;

    const articleRect = article.getBoundingClientRect();
    const articleInView = !(articleRect.bottom < viewTop || articleRect.top > viewBottom);

    return articleInView;
}

function logLike(articleLog, post_id) {
    articleLog.style.backgroundColor = "lightcoral";
    // Update is_liked in the stored data
    if (trackingData[post_id]) {
        trackingData[post_id].is_liked = true;
        saveTrackingData();
    }
}

const loggedArticles = new Map();
const activeTimers = new Map(); 
const articleIdMap = new Map();
const authorTimeMap = new Map(); 

function fetchArticles() {
    const articles = document.body.getElementsByTagName("article");

    const rankingResult = getCategorizedData();
    Array.from(articles).forEach((article) => {
        //check if the element has an element qith class name "x1fhwpqd x132q4wb x5n08af"
        const articleAd = article.querySelector('.x1fhwpqd.x132q4wb.x5n08af');
        if(articleAd) {
            //article.classList.add('minimized'); // add class ad to the article if it is an ad
            article.style.display = 'none'; // hide the article if it is an ad
        }

        const mappedArticle = mapArticle(article); //turn article into object
        if (!mappedArticle) return;

        const { post_id, author, like_button } = mappedArticle;

        if(rankingResult) {
            addCategoryToArticle(article, author, post_id, rankingResult)
        }
        
        // Store the post_id associated with this article element
        articleIdMap.set(article, post_id);
        // Ensure we have a tracking entry for this post_id
        if (!trackingData[post_id]) {
            trackingData[post_id] = {
                post_id: post_id,
                author: author.innerText || "Unknown Author",
                is_liked: false,
                visits: []
            };
            saveTrackingData();
        }

        logArticle(article, mappedArticle);

        // Add like button listener
      // Add like button listener if not already added
      if (like_button && !like_button.hasListener) {
        like_button.addEventListener('click', () => {
            const articleLog = loggedArticles.get(article);
            logLike(articleLog, post_id);
        });
        like_button.hasListener = true;
    }
    });
}

function logArticle(article, mappedArticle) {

    const { author, post_id } = mappedArticle;
    const inView = isArticleInView(article);

    if (inView) {
        // Add to tracking container if not already logged
        if (!loggedArticles.has(article)) {
            // Clone the author element
            const clonedAuthor = author.cloneNode(true); // Use 'true' to clone the element and its children

            // Create the articleLog container
            const articleLog = buildElement('div', {
                classList: "articleLog",
            });

            // Append the cloned author element and a timer
            articleLog.appendChild(clonedAuthor);

            // Add a span for the timer
            const timerElement = buildElement('span', {
                classList: "timer",
                innerText: "0s",
            });
            clonedAuthor.firstChild.appendChild(timerElement);

            // trackingContainer.appendChild(articleLog);
            loggedArticles.set(article, articleLog);
        }

        // If timer not active, start a new visit if necessary
        if (!activeTimers.has(article)) {
            // Start a new visit: push a new object into visits array
            const postData = trackingData[post_id];
            postData.visits.push({
                start_time: Date.now(),
                end_time: null,
                duration: 0
            });
            saveTrackingData();

            const interval = setInterval(() => {
                // Increment the duration of the latest visit
                const currentVisit = postData.visits[postData.visits.length - 1];
                currentVisit.duration += 1;

                // Update the timer in the UI
                const articleLog = loggedArticles.get(article);
                const timerElement = articleLog.querySelector('.timer');
                if (timerElement) {
                    timerElement.innerText = `${currentVisit.duration}s`;
                }

                // Update cumulative author time
                const authorName = postData.author.split(" and ")[0].trim(); // only first name
                const totalAuthorTime = authorTimeMap.get(authorName) || 0;
                authorTimeMap.set(authorName, totalAuthorTime + 1);

                // Save changes to localStorage periodically
                saveTrackingData();
            }, 1000);
            activeTimers.set(article, interval);
        }

    } else {
        // Stop the timer if the article is out of view
        if (activeTimers.has(article)) {
            clearInterval(activeTimers.get(article));
            activeTimers.delete(article);

            // Record the end_time of the current visit
            const postData = trackingData[post_id];
            const currentVisit = postData.visits[postData.visits.length - 1];
            if (currentVisit && currentVisit.end_time === null) {
                currentVisit.end_time = Date.now();
                saveTrackingData();
                showTopAuthorsToday(trackingData) 
            }
        }
    }

}

let topAuthorsContainer = null
function showTopAuthorsToday(trackingData) {
    // Calculate the start of today (midnight)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayTimestamp = startOfToday.getTime();

    // Aggregate data by author
    const authorData = {}; 

    for (const post_id in trackingData) {
        const post = trackingData[post_id];
        const authorName = post.author;
        if (!authorData[authorName]) {
            authorData[authorName] = {
                totalTimeToday: 0,
                totalLikes: 0
            };
        }

        // Sum today's visits for this post
        let postTimeToday = 0;
        post.visits.forEach(visit => {
            // We consider a visit "today" if its start_time is on or after today's start.
            if (visit.start_time >= todayTimestamp) {
                postTimeToday += visit.duration;
            }
        });

        // Add to author's total time
        authorData[authorName].totalTimeToday += postTimeToday;

        // If post is liked, add it to author's total likes
        if (post.is_liked) {
            authorData[authorName].totalLikes += 1;
        }
    }

    // Convert authorData object to an array for sorting
    const authorArray = Object.keys(authorData).map(authorName => {
        return {
            name: authorName,
            totalTimeToday: authorData[authorName].totalTimeToday,
            totalLikes: authorData[authorName].totalLikes
        };
    });

    // Sort by totalTimeToday descending
    authorArray.sort((a, b) => b.totalTimeToday - a.totalTimeToday);

    // Take top 10
    const topAuthors = authorArray.slice(0, 5);

    if(!topAuthorsContainer || !document.body.contains(topAuthorsContainer)) {
        // Create a container for the top authors list
        topAuthorsContainer = document.createElement('div');
        topAuthorsContainer.id = "topAuthorsToday";
    }
    
    topAuthorsContainer.innerHTML = "<h2>Top 5 Authors Today</h2>";

    // Create a table or list to display the data
    const table = document.createElement('table');
    table.innerHTML = `
      <tr>
        <th>Author</th>
        <th>Time</th>
        <th>Likes</th>
      </tr>
    `;

    topAuthors.forEach(author => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.innerText = author.name;

        const timeCell = document.createElement('td');
        timeCell.innerText = author.totalTimeToday;

        const likesCell = document.createElement('td');
        likesCell.innerText = author.totalLikes;

        row.appendChild(nameCell);
        row.appendChild(timeCell);
        row.appendChild(likesCell);
        table.appendChild(row);
    });

    topAuthorsContainer.appendChild(table);

    // Append this container into trackingContainer
    const container = setupTrackingContainer();
    container.appendChild(topAuthorsContainer);
}


// Cleanup timers when necessary (e.g. on page unload)
function cleanupTimers() {
    activeTimers.forEach((interval, article) => {
        clearInterval(interval);
        activeTimers.delete(article);

        const post_id = articleIdMap.get(article);
        if (post_id && trackingData[post_id]) {
            // finalize end time
            const postData = trackingData[post_id];
            const currentVisit = postData.visits[postData.visits.length - 1];
            if (currentVisit && currentVisit.end_time === null) {
                currentVisit.end_time = Date.now();
            }
        }
    });
    saveTrackingData();
}

let containerInitialTop = null; // Get initial position

function handleScroll() {
    setupTrackingContainer();
    if(!containerInitialTop) {
        containerInitialTop = trackingContainer.offsetTop;
    }
    
    const scrollY = window.scrollY; // Current scroll position

    if (scrollY > containerInitialTop) {
        trackingContainer.style.position = 'fixed'; // Stick to the top
        trackingContainer.style.top = '0'; // Align to the top of the screen
    } else {
        trackingContainer.style.position = 'static'; // Return to normal flow
    }
}

// Format time to a more user friendly display
function formatDuration(duration) {
    if (duration < 60) {
        // Less than 60 seconds: show seconds
        return `${Math.floor(duration)} seconds`;
    }
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    return hours > 0 
        ? `${hours} hours and ${minutes} minutes`
        : `${minutes} minutes`;
};

// Function to calculate and display the average total session time per day
function calculateAndDisplayAverageDailySessionTime() {
    chrome.storage.local.get('sessionData', (storage) => {
        const sessionData = storage.sessionData || [];
        const sessionMapByDay = new Map(); 

        // Group sessions by date and sum the durations
        sessionData.forEach(session => {
            const startDate = new Date(session.startTime).toISOString().split('T')[0];
            const duration = session.endTime 
                ? (new Date(session.endTime) - new Date(session.startTime)) / 1000 // Duration in seconds
                : 0;

            if (!sessionMapByDay.has(startDate)) {
                sessionMapByDay.set(startDate, 0);
            }
            
            const previousTime = sessionMapByDay.get(startDate);
            sessionMapByDay.set(startDate, previousTime + duration);
        });

        // Display the data in the trackingContainer
        let statsContainer = document.getElementById('sessionStats');

        if (!statsContainer) {
            statsContainer = buildElement('div', {id: 'sessionStats'})
            statsContainer.style.marginBottom = '10px';
            trackingContainer.prepend(statsContainer);
        }
        
        const {
            totalEntries,
            totalDuration,
            daysBetweenKeys,
            daysBetweenDates,
            longestSessionDay,
            shortestSessionDay,
            todaysSession,
        } = calculateSessionStatistics(sessionMapByDay);



        const intervalStart = Date.now();

        const updateStats = () => {
            const elapsedSeconds = Math.floor((Date.now() - intervalStart) / 1000);

            const averageDuration = totalDuration / daysBetweenDates;
            const averageFormatted = formatDuration(averageDuration);

            const todaysDuration = todaysSession.duration + elapsedSeconds;
            const todaysFormatted = formatDuration(todaysDuration);

            const deltaDuration = Math.abs(averageDuration - todaysDuration);
            const deltaFormatted = formatDuration(deltaDuration + 1);

            const over_under = averageDuration < todaysDuration ? "deviation" : "reduction";

            // Add all elements to the container
            statsContainer.innerHTML = `
                <h1>USAGE STATISTICS:</h1>
                <p class="today">Time spent today: ${todaysFormatted}</p>
                <p class="average">Your average time: ${averageFormatted}</p>
                <p class="status ${over_under}">Status: ${over_under} by ${deltaFormatted}</p>
            `;
        };

        // Call the function immediately
        updateStats();

        // Then set an interval to call it every minute
        setInterval(updateStats, 60 * 1000);

        const longestSessionFormatted = `${longestSessionDay.date}: ${formatDuration(longestSessionDay.duration)}`;
        const shortestSessionFormatted = `${shortestSessionDay.date}: ${formatDuration(shortestSessionDay.duration)}`;
    });
}


function calculateSessionStatistics(sessionMapByDay) {
    // Extract dates from the map and sort them
    const dates = Array.from(sessionMapByDay.keys()).sort((a, b) => new Date(a) - new Date(b));

    if (dates.length === 0) {
        return {
            totalEntries: 1,
            totalDuration: 0,
            daysBetweenKeys: 1,
            daysBetweenDates: 1,
            longestSessionDay: 0,
            shortestSessionDay: 0,
            todaysSession: 0,
        };
    }

    // Calculate total entries in the map
    const totalEntries = sessionMapByDay.size;

    // Calculate the sum of all durations
    const totalDuration = Array.from(sessionMapByDay.values()).reduce((sum, duration) => sum + duration, 0);

    // Find the first and last dates
    const firstDate = new Date(dates[0]);
    const lastDate = new Date(dates[dates.length - 1]);

    // Calculate days between the first and last keys (inclusive)
    const daysBetweenKeys = Math.floor((lastDate - firstDate) / (1000 * 60 * 60 * 24)) + 1;

    // Calculate days between the earliest and latest dates (inclusive)
    const earliestDate = new Date(Math.min(...dates.map(date => new Date(date))));
    const latestDate = new Date(Math.max(...dates.map(date => new Date(date))));
    const daysBetweenDates = Math.floor((latestDate - earliestDate) / (1000 * 60 * 60 * 24)) + 1;

    // Find the day with the longest session
    const longestSessionDay = Array.from(sessionMapByDay.entries()).reduce((max, entry) =>
        entry[1] > max[1] ? entry : max
    );

    // Find the day with the shortest session
    const shortestSessionDay = Array.from(sessionMapByDay.entries()).reduce((min, entry) =>
        entry[1] < min[1] ? entry : min
    );

    // Get today's date and the duration for today (default to 0 if not found)
    const today = new Date().toISOString().split('T')[0];
    const todaysDuration = sessionMapByDay.get(today) || 0;

    // Return the results as an object
    return {
        totalEntries,
        totalDuration,
        daysBetweenKeys,
        daysBetweenDates,
        longestSessionDay: { date: longestSessionDay[0], duration: longestSessionDay[1] },
        shortestSessionDay: { date: shortestSessionDay[0], duration: shortestSessionDay[1] },
        todaysSession: { date: today, duration: todaysDuration },
    };
}

//// --- --- --- --- --- URL TimeSpent --- --- --- --- --- --- ////

function calculateCategoryBreakdown(urlSessions) {
    const breakdown = {
        reels: 0,
        stories: 0,
        feed: 0,
        direct: 0,
        others: 0,
    };

    urlSessions.forEach((session) => {
        const duration = (new Date(session.endTime) - new Date(session.startTime)) / 1000; // Duration in seconds
        if (session.url === "/") {
            breakdown.feed += duration;
        } else if (session.url.startsWith("/stories")) {
            breakdown.stories += duration;
        } else if (session.url.startsWith("/reels")) {
            breakdown.reels += duration;
        } else if (session.url.startsWith("/direct")) {
            breakdown.direct += duration;
        } else {
            breakdown.others += duration;
        }
    });

    return breakdown;
}

let breakdownContainer = null;

function displayCategoryBreakdown(breakdown) {
    const trackingContainer = setupTrackingContainer();

    // Check if the breakdown container already exists
    breakdownContainer = document.getElementById("categoryBreakdown");
    if (!breakdownContainer || !document.body.contains(breakdownContainer)) {
        breakdownContainer = buildElement("div", { id: "categoryBreakdown" });
        trackingContainer.appendChild(breakdownContainer);
    }

    breakdownContainer.innerHTML = `
        <h2>Breakdown of your usage:</h2>
        <p>Feed: ${formatDuration(breakdown.feed)}</p>
        <p>Stories: ${formatDuration(breakdown.stories)}</p>
        <p>Reels: ${formatDuration(breakdown.reels)}</p>
        <p>Messenger: ${formatDuration(breakdown.direct)}</p>
        <p>Others: ${formatDuration(breakdown.others)}</p>
    `;
}

function updateCategoryBreakdown() {
    chrome.storage.local.get("urlSessions", (data) => {
        const urlSessions = data.urlSessions || [];
        const today = new Date().toISOString().split("T")[0];

        // Filter today's sessions
        const todaysSessions = urlSessions.filter((session) =>
            session.startTime.startsWith(today)
        );

        const breakdown = calculateCategoryBreakdown(todaysSessions);
        displayCategoryBreakdown(breakdown);
    });
}



// Optionally, you can observe changes in `urlSessions` and re-update
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "local" && changes.urlSessions) {
        updateCategoryBreakdown();
    }
});

/// ===== Ranking by ABC =======================================

// Function to add category information to usernames

function addCategoryToArticle(article, author, post_id, rankingResult) {

    function findCategory(username, result) {
        for (let item of result) {
            if (item.name.toLowerCase() === username.toLowerCase()) {
                return item.category;
            }
        }
        return null;
    }

    let username = author.textContent.trim();

    if (username.includes('Verified')) {
        username = username.replace('Verified', '').trim();
    }

    const category = findCategory(username, rankingResult) || '?';

    if (!author.parentElement.parentElement.querySelector('.abc-rating-container')) {
        const abc_rating_container = document.createElement('div');
        abc_rating_container.classList.add('abc-rating-container');

        const abc_rating = document.createElement('div');
        abc_rating.classList.add('abc-rating');
        abc_rating.innerHTML = `<h1>Rating: ${category}</h1>`;

        const edit_icon = document.createElement('span');
        edit_icon.classList.add('edit-rating-icon');
        edit_icon.innerHTML = '🖉'; // Use an edit icon or any symbol

        const dropdown = document.createElement('select');
        dropdown.classList.add('rating-dropdown');
        dropdown.style.display = 'none'; // Hide the dropdown by default
        ['', 'A', 'B', 'C'].forEach(optionText => {
            const option = document.createElement('option');
            option.value = optionText;
            option.textContent = 'Rating: ' + optionText;
            dropdown.appendChild(option);
        });

        abc_rating_container.appendChild(abc_rating);
        abc_rating_container.appendChild(dropdown);
        abc_rating_container.appendChild(edit_icon);

        post_id.parentElement.parentElement.after(abc_rating_container);

        // Minimize feature
        if (category === 'C' || category === '?') {
            //const postContent = article.getElementsByClassName("x6s0dn4 xyzq4qe x78zum5 xdt5ytf x2lah0s xl56j7k x6ikm8r x10wlt62 x1n2onr6 x5ur3kl xopu45v x1bs97v6 xmo9t06 x1lcm9me x1yr5g0i xrt01vj x10y3i5r x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x178xt8z xm81vs4 xso031l xy80clv")[0];
            article.classList.add('minimized');
            const toggleButton = document.createElement('button');
            toggleButton.textContent = 'Expand';
            toggleButton.classList.add('toggle-button');

            toggleButton.addEventListener('click', () => {
                if (article.classList.contains('minimized')) {
                    article.classList.remove('minimized');
                    toggleButton.textContent = 'Minimize';
                } else {
                    article.classList.add('minimized');
                    toggleButton.textContent = 'Expand';
                }
            });

            article.appendChild(toggleButton);
        }

        abc_rating_container.addEventListener('mouseover', () => {
            if (dropdown.style.display === 'none') {
                edit_icon.style.visibility = 'visible';
            } else {
                edit_icon.style.visibility = 'hidden';
            }
        });

        abc_rating_container.addEventListener('mouseout', () => {
            edit_icon.style.visibility = 'hidden';
        });

        abc_rating_container.addEventListener('click', () => {
            abc_rating.style.display = 'none';
            dropdown.style.display = 'block';
            edit_icon.style.visibility = 'hidden';
        });

        dropdown.addEventListener('change', () => {
            const selectedValue = dropdown.value;
            const selectedLabel = 'Rating: ' + selectedValue;

            // Update rating display
            abc_rating.innerHTML = `<h1>${selectedLabel}</h1>`;
            abc_rating.style.display = 'block';
            dropdown.style.display = 'none';

            // Update categorizedData
            if (categorizedData) {
                // Find user in categorizedData
                let user = categorizedData.find(user => user.name.toLowerCase() === username.toLowerCase());
                if (user) {
                    // Update user's category
                    user.category = selectedValue;
                } else {
                    // Add new user to categorizedData
                    user = { name: username, count: 0, category: selectedValue };
                    categorizedData.push(user);
                }

                // Save updated categorizedData to local storage
                chrome.storage.local.set({ categorizedData }, () => {
                    //..
                });
            }
        });
    }
}

  
// Check if categorized data exists in local storage on load
chrome.storage.local.get("categorizedData", (data) => {
if (data.categorizedData) {
    console.log("Using stored categorizedData:", data.categorizedData);
    categorizedDataLoaded = true;
    categorizedData = data.categorizedData;
} else {
    console.log("No categorizedData found in local storage.");
}
});
  
let categorizedDataLoaded = false;
let categorizedData = null;

  // Check on scroll if categorizedData is loaded, if not read from storage
function getCategorizedData() {
    if (!categorizedData) {
      chrome.storage.local.get("categorizedData", (data) => {
        if (data.categorizedData) {
          categorizedData = data.categorizedData;
        } else {
          // ..
        }
        return;
      });
    }
    return categorizedData;
}

// story reshuffle -------------------------------
let isProcessing = false;

let story_hideC = false;
let story_sort = false;


// Create a single persistent listener
document.addEventListener('click', function buttonHandler(event) {
    // Check if clicked element matches either button type
    setTimeout(() => {
        const button = event.target.closest(
            'button._afxv._al46._aahm._akl_._al47, ' +
            'button._afxw._al46._aahm._akl_._al47'
        );
    

    if (button && !isProcessing) {
        isProcessing = true;
        
        // Run your story sort logic
        // Initial check for the "Go Back" button
        isFirstPage = !checkGoBackButton();

        storyRank(sort = (story_sort && isFirstPage));
        
        // Reset after operation completes
        setTimeout(() => {
            isProcessing = false;
        }, 1000);
    }
    }, 1000);
});

// Function to check for the existence of the "Go Back" button
function checkGoBackButton() {
    const goBackButton = document.querySelector('button._afxv._al46._aahm._akl_._al47');

    if (goBackButton) {
        storyRankButton.style.transition = 'left 0.5s ease';
        storyRankButton.style.left = '-270px';
        setTimeout(() => {
            storyRankButton.style.display = 'none';
        }, 500);
        return true;
    } else {
        storyRankButton.style.display = 'block';
        setTimeout(() => {
            storyRankButton.style.transition = 'left 0.5s ease';
            storyRankButton.style.left = '-225px';
        }, 100);
        return false;
    }
}



// Initial sort after page load
setTimeout(() => {
    createSortButton();
    storyRank(sort = false);
}, 2000);

function storyRank(sort) {
    if(sort) story_sort = true;
    const rankedList = categorizedData;

    const storiesList = document.querySelector('ul._acay');
    const items = Array.from(storiesList.querySelectorAll('li._acaz'));

    // Extract names from story items
    items.forEach(item => {
        const nameDiv = item.querySelector('div[dir="auto"] div');
        item.dataset.originalName = nameDiv ? nameDiv.textContent.trim() : '';
    
        const category = rankedList.find(r => r.name === item.dataset.originalName)?.category || '?';
    
        // Apply dimmed style using CSS class
        item.classList.toggle('dimmed', !['A', 'B'].includes(category));
    
        // Add/update category badge
        let badge = item.querySelector('.category-badge');
        if (!badge) {
            badge = document.createElement('div');
            badge.className = 'category-badge';
            item.appendChild(badge);
        }
        badge.textContent = category;
    });

    if(!sort) return;

    // Sort items based on category and ranking list
    const sortedItems = items.sort((a, b) => {
        const aCategory = rankedList.find(r => r.name === a.dataset.originalName)?.category || '?';
        const bCategory = rankedList.find(r => r.name === b.dataset.originalName)?.category || '?';
        const aRank = rankedList.find(r => r.name === a.dataset.originalName)?.rating || 0;
        const bRank = rankedList.find(r => r.name === b.dataset.originalName)?.rating || 0;

        if (aCategory === '?' && bCategory !== '?') {
            return 1; // Place "?" category at the end
        } else if (aCategory !== '?' && bCategory === '?') {
            return -1; // Place "?" category at the end
        } else if (aCategory === bCategory) {
            return bRank - aRank; // Sort by rating within the same category
        } else {
            return aCategory.localeCompare(bCategory); // Sort by category
        }
    });

    // Maintain an array of occupied positions
    const occupiedPositions = []; 
    const positionStep = 80;

    // Add category badges and assign new positions
    sortedItems.forEach(item => {
        
        // Determine the next available position
        let newPosition = 2; // Start from 2px
        while (occupiedPositions.includes(newPosition)) {
            newPosition += positionStep; // Increment by step until an available position is found
        }
        occupiedPositions.push(newPosition); // Mark position as occupied

        // Set new position with transition
        item.style.transition = 'transform 1s ease-in-out';
        item.style.transform = `translateX(${newPosition}px)`;
    });

    // Force DOM reflow to trigger animation
    void storiesList.offsetHeight;

    // Update container scroll position if needed
    storiesList.scrollTo({ left: 0, behavior: 'smooth' });
}

const storyRankButton = document.createElement('button');

function createSortButton() {
    storyRankButton.className = 'sort-button';
    storyRankButton.innerText = 'Sort';
    
    storyRankButton.addEventListener('click', () => storyRank(true));

    const targetDiv = document.querySelector('.xmnaoh6');
    if (targetDiv) {
        targetDiv.appendChild(storyRankButton);
    }

    checkGoBackButton();
}