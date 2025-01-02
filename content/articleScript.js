function mapArticle(article) {
    try {
        const container = article.getElementsByClassName('x78zum5 xdt5ytf x5yr21d xa1mljc xh8yej3 x1bs97v6 x1q0q8m5 xso031l x11aubdm xnc8uc2')[0];
//.getElementsByClassName('');
//.getElementsByClassName('');
//.getElementsByClassName('');
//.getElementsByClassName('');
//.getElementsByClassName('');
//.getElementsByClassName('');
//.getElementsByClassName('');
//.getElementsByClassName('');
//.getElementsByClassName('');
//.getElementsByClassName('');

            const header = container.getElementsByClassName('xsag5q8 x1e558r4')[0];
                //const avatar = header.xq8finb
                const title = header.getElementsByClassName('x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh x1uhb9sk x1plvlek xryxfnj x1iyjqo2 x2lwn1j xeuugli x1q0g3np xqjyukv x6s0dn4 x1oa3qoh x1nhvcw1')[0];
                    const title_top = title.getElementsByClassName('x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh x1uhb9sk x1plvlek xryxfnj x1c4vz4f x2lah0s x1q0g3np xqjyukv x6s0dn4 x1oa3qoh x1nhvcw1')[0];
                        const author = title_top.getElementsByClassName('x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh x1uhb9sk x1plvlek xryxfnj x1c4vz4f x2lah0s x1q0g3np xqjyukv x6s0dn4 x1oa3qoh x1nhvcw1')[0];
                        const time = title_top.getElementsByTagName("time")[0];
                        const post_id = time.parentElement.parentElement;
                    //const title_bot = author.children[1];
                const menu_button = header.getElementsByClassName('x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh x1uhb9sk x1plvlek xryxfnj x1c4vz4f x2lah0s x1q0g3np xqjyukv x6s0dn4 x1oa3qoh x1nhvcw1')[0];

            const content = container.getElementsByClassName('x6s0dn4 xyzq4qe x78zum5 xdt5ytf x2lah0s xl56j7k x6ikm8r x10wlt62 x1n2onr6 x5ur3kl xopu45v x1bs97v6 xmo9t06 x1lcm9me x1yr5g0i xrt01vj x10y3i5r x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x178xt8z xm81vs4 xso031l xy80clv')[0];
                const hasVideo = content.getElementsByTagName("video")[0] ? true : false;
    //x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh x1uhb9sk x1plvlek xryxfnj x1c4vz4f x2lah0s xdt5ytf xqjyukv x6s0dn4 x1oa3qoh x1nhvcw1
    //x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh x1uhb9sk x1plvlek xryxfnj x1c4vz4f x2lah0s xdt5ytf xqjyukv x1qjc9v5 x1oa3qoh x1nhvcw1
            const footer = container.getElementsByClassName('x1lliihq x1n2onr6')[0];
                const dashbord = footer.getElementsByClassName('x6s0dn4 xrvj5dj x1o61qjw x12nagc x1gslohp')[0];
                    const like_button = dashbord;//.getElementsByClassName('x1i10hfl x972fbf xcfux6l x1qhh985 xm0m39n x9f619 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz x6s0dn4 xjbqb8w x1ejq31n xd10rxx x1sy0etr x17r0tee x1ypdohk x78zum5 xl56j7k x1y1aw1k x1sxyh0 xwib8y2 xurb0ha xcdnw81')[0];
                    //const comment_button = dashbord.children[1];
                    //const share_button = dashbord.children[2];

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
    catch (e) { 
        console.log('mapping error: ', e);
        return null; }
}

function mapArticle2(article) {
    try {
        const container = article.firstChild;

            const header = container.children[0].firstChild;
                const avatar = header.children[0];
                const title = header.children[1].firstChild;
                    const title_top = title.children[0];
                        const author = title_top.children[0];
                        const time = title_top.getElementsByTagName("time")[0];
                        const post_id = time.parentElement.parentElement;
                    //const title_bot = author.children[1];
                const menu_button = header.children[2].firstChild;

            const content = container.children[1];
                const hasVideo = content.getElementsByTagName("video")[0] ? true : false;
    //x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh x1uhb9sk x1plvlek xryxfnj x1c4vz4f x2lah0s xdt5ytf xqjyukv x6s0dn4 x1oa3qoh x1nhvcw1
    //x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh x1uhb9sk x1plvlek xryxfnj x1c4vz4f x2lah0s xdt5ytf xqjyukv x1qjc9v5 x1oa3qoh x1nhvcw1
            const footer = container.children[2];
                const dashbord = footer.firstChild.firstChild.firstChild.firstChild;
                    const like_button = dashbord.children[0];
                    //const comment_button = dashbord.children[1];
                    //const share_button = dashbord.children[2];

        const mappedArticle = {
            title: title,
            author: author,
            post_id: post_id,
            avatar: avatar,
            hasVideo: hasVideo,
            like_button: like_button,
            menu_button: menu_button,
        }
        
        return mappedArticle;
    }
    catch { return null; }
}


// Utility function to create an element with properties
function buildElement(tag, props = {}) {
    const elem = document.createElement(tag);
    Object.assign(elem, props);  // Assign properties
    return elem;
}

document.addEventListener('scroll', () => {

    // console.log('111');
    // const aaa = document.body.getElementsByClassName('x78zum5 xdt5ytf x5yr21d xa1mljc xh8yej3 x1bs97v6 x1q0q8m5 xso031l x11aubdm xnc8uc2');
    // console.log(aaa);

   handleScroll();
    fetchArticles();


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
    // console.log(JSON.stringify(trackingData));
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
            // trackingContainer.innerHTML = "<h1>LOG CONTAINER:</h1>"
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
    console.log("liked!");
    // Update is_liked in the stored data
    if (trackingData[post_id]) {
        trackingData[post_id].is_liked = true;
        saveTrackingData();
    }
}

// Track articles already logged and listeners
const loggedArticles = new Map();
const activeTimers = new Map(); // Tracks active intervals for articles in view
// We'll keep an in-memory map of the current post_id associated with each article element
const articleIdMap = new Map();

const authorTimeMap = new Map(); // Tracks total time per author

function fetchArticles() {


    const articles = document.body.getElementsByTagName("article");
    console.log(articles);

    Array.from(articles).forEach((article) => {
        const mappedArticle = mapArticle(article); //turn article into object
        if (!mappedArticle) return;

        const { post_id, author, like_button } = mappedArticle;
        //const inView = isArticleInView(article);

        // Add abc-rating if not already added
        if (!author.parentElement.parentElement.querySelector('.abc-rating')) {
            const abc_rating = buildElement('div', {
                classList: "abc-rating",
                innerHTML: "<h1>Rating: A</h1>", // Example content for the rating
            });
            post_id.parentElement.parentElement.after(abc_rating); // Add the abc-rating right after the author's element
        }
        // Store the post_id associated with this article element
        articleIdMap.set(article, post_id);
        // console.log(articleIdMap);
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
    // Structure will be:
    // authorData = {
    //   "Author Name": {
    //       totalTimeToday: number,
    //       totalLikes: number
    //   },
    //   ...
    // }

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
        // Assuming 'totalLikes' means number of liked posts by that author.
        if (post.is_liked) {
            // If you only want to count each liked post once, just increment by 1.
            // If you wanted to sum likes (or other metric), adjust accordingly.
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
    const topAuthors = authorArray.slice(0, 10);

    if(!topAuthorsContainer || !document.body.contains(topAuthorsContainer)) {
        // Create a container for the top authors list
        topAuthorsContainer = document.createElement('div');
        topAuthorsContainer.id = "topAuthorsToday";
    }
    
    topAuthorsContainer.innerHTML = "<h2>Top 10 Authors Today</h2>";

    // Create a table or list to display the data
    const table = document.createElement('table');
    table.innerHTML = `
      <tr>
        <th>Author</th>
        <th>View Time</th>
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
    // Make sure trackingContainer exists by calling setupTrackingContainer()
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


// Save cumulative author time in memory (example)
function saveAuthorTimeData() {
    console.log("Author Time Data:", Array.from(authorTimeMap.entries()));
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
            const deltaFormatted = formatDuration(deltaDuration);

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

        console.log(`Longest Time: ${longestSessionFormatted}`);
        console.log(`Shortest Time: ${shortestSessionFormatted}`);
    });
}


function calculateSessionStatistics(sessionMapByDay) {
    // Extract dates from the map and sort them
    const dates = Array.from(sessionMapByDay.keys()).sort((a, b) => new Date(a) - new Date(b));

    if (dates.length === 0) {
        console.log("Session storage is empty.");
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

function displayCategoryBreakdown(breakdown) {
    const trackingContainer = setupTrackingContainer();

    // Check if the breakdown container already exists
    let breakdownContainer = document.getElementById("categoryBreakdown");
    if (!breakdownContainer) {
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

// Call the function to update the breakdown
updateCategoryBreakdown();

// Optionally, you can observe changes in `urlSessions` and re-update
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "local" && changes.urlSessions) {
        updateCategoryBreakdown();
    }
});

