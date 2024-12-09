function mapArticle(article) {
    const container = article.firstChild;

        const header = container.children[0].firstChild;
            const avatar = header.children[0];
            const title = header.children[1].firstChild;
                const title_top = title.children[0];
                    const author = title_top.children[0];
                    //const time = title_top.children[1];
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
        avatar: avatar,
        hasVideo: hasVideo,
        like_button: like_button,
        menu_button: menu_button,
    }

    return mappedArticle;
}


// Utility function to create an element with properties
function buildElement(tag, props = {}) {
    const elem = document.createElement(tag);
    Object.assign(elem, props);  // Assign properties
    return elem;
}

document.addEventListener('scroll', () => {
    handleScroll();
    fetchArticles();
});

// Cache for shortcut container and buttons
let trackingContainer = null;
// Fetch or create the references to the articles
function setupTrackingContainer() {
    // Cache shortcut container if not already cached
    if (!trackingContainer) {
        trackingContainer = document.getElementById("trackingContainer");
        if (!trackingContainer) { //if doesent exist
            calculateAndDisplayAverageDailySessionTime();

            const mainContainer = document.body.getElementsByTagName("main")[0];
            const rightColumnContainer = mainContainer?.firstChild?.lastChild;
            if(!rightColumnContainer) return;
            trackingContainer = buildElement('div',{id: 'trackingContainer'});
            trackingContainer.innerHTML = "<h1>LOG CONTAINER:</h1>"
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

function logLike(articleLog) {
    articleLog.style.backgroundColor = "lightcoral";
}

// Track articles already logged and listeners
const loggedArticles = new Map();
const articleScrollListeners = new Map();

const timeSpentMap = new Map(); // Tracks time spent on each article
const authorTimeMap = new Map(); // Tracks total time per author across all sessions
const activeTimers = new Map(); // Tracks active intervals for articles in view


function fetchArticles() {
    const articles = document.body.getElementsByTagName("article");

    Array.from(articles).forEach((article) => {
        const mappedArticle = mapArticle(article);
        if (!mappedArticle) return;

        const author = mappedArticle.author;
        const like_button = mappedArticle.like_button;
        const inView = isArticleInView(article);

        // Add abc-rating if not already added
        if (!author.parentElement.querySelector('.abc-rating')) {
            const abc_rating = buildElement('div', {
                classList: "abc-rating",
                innerHTML: "<h1>Rating: A</h1>", // Example content for the rating
            });
            author.after(abc_rating); // Add the abc-rating right after the author's element
        }
        

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

                trackingContainer.appendChild(articleLog);
                loggedArticles.set(article, articleLog);

                // Store initial time for the article
                if (!timeSpentMap.has(article)) {
                    timeSpentMap.set(article, 0);
                }

                // Add like button listener
                like_button.addEventListener('click', () => {
                    logLike(articleLog);
                });
            }

            // Start or continue the timer for the article
            if (!activeTimers.has(article)) {
                const interval = setInterval(() => {
                    let timeSpent = timeSpentMap.get(article) || 0;
                    timeSpent += 1; // Increment time by 1 second
                    timeSpentMap.set(article, timeSpent);

                    // Update the timer in the UI
                    const timerElement = loggedArticles.get(article).querySelector(`.timer`);
                    if (timerElement) {
                        timerElement.innerText = `${timeSpent}s`;
                    }

                    // Update cumulative author time
                    const authorName = author.innerText;
                    const totalAuthorTime = authorTimeMap.get(authorName) || 0;
                    authorTimeMap.set(authorName, totalAuthorTime + 1);
                }, 1000);
                activeTimers.set(article, interval);
            }
        } else {
            // Stop the timer if the article is out of view
            if (activeTimers.has(article)) {
                clearInterval(activeTimers.get(article));
                activeTimers.delete(article);
            }
        }
    });
}

// Cleanup timers when the article is no longer tracked
function cleanupTimers() {
    activeTimers.forEach((interval, article) => {
        clearInterval(interval);
        activeTimers.delete(article);
    });
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

// Function to calculate and display the average total session time per day
function calculateAndDisplayAverageDailySessionTime() {
    chrome.storage.local.get('sessionData', (data) => {
        const sessionData = data.sessionData || [];
        const sessionMapByDay = new Map(); 

        console.log(sessionData);

        // Group sessions by date and sum the durations
        sessionData.forEach(session => {
            const startDate = new Date(session.startTime).toISOString().split('T')[0];
            console.log(startDate);
            const duration = session.endTime 
                ? (new Date(session.endTime) - new Date(session.startTime)) / 1000 // Duration in seconds
                : 0;

            if(!sessionMapByDay.has(startDate)) {
                sessionMapByDay.set(startDate, 0)
            }
            
            const previousTime = sessionMapByDay.get(startDate);
            sessionMapByDay.set(startDate, previousTime + duration);
        });

        // Display the data in the trackingContainer
        let statsContainer = document.getElementById('sessionStats');

        if (!statsContainer) {
            statsContainer = buildElement('div', {id: 'sessionStats'})
            document.createElement('div');
            statsContainer.id = 'sessionStats';
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


        // Format the additional session times
        const formatDuration = (duration) => {
            const hours = Math.floor(duration / 3600);
            const minutes = Math.floor((duration % 3600) / 60);
            const seconds = Math.floor(duration % 60);
            
            let formatDuration = "";
            if(hours > 0)
                formatDuration = `${hours} hours and ${minutes} minutes`
            else 
                formatDuration = `${minutes} minutes`; 

            //return `${hours}h ${minutes}m ${seconds}s`;
            return formatDuration
        };

        const intervalStart = Date.now();

        setInterval(() => {
            const elapsedSeconds = Math.floor((Date.now() - intervalStart) / 1000);

            const averageDuration = totalDuration / daysBetweenDates;
            const averageFormatted = formatDuration(averageDuration);

            const todaysDuration = todaysSession.duration + elapsedSeconds;
            const todaysFormatted = formatDuration(todaysDuration);

            const deltaDuration = Math.abs(averageDuration - todaysDuration);
            const deltaFotmatted = formatDuration(deltaDuration);

            let over_under = "";
            if(averageFormatted < todaysFormatted) {
                over_under = "deviation";
            }
            else {
                over_under = "reduction";
            }

            // Add all elements to the container
            statsContainer.innerHTML = `
                <h1>USAGE STATISTICS:</h1>
                <p class="today">Time spent today: ${todaysFormatted}</p>
                <p class="average">Your average time: ${averageFormatted}</p>
                <p class="status ${over_under}">Status: ${over_under} by ${deltaFotmatted}</p>
            `;
        }, 60 * 1000); 

        
        const longestSessionDuration = longestSessionDay.duration;
        const longestSessionFormatted = `${longestSessionDay.date}: ${formatDuration(longestSessionDuration)}`;

        const shortestSessionDuration = shortestSessionDay.duration;
        const shortestSessionFormatted = `${shortestSessionDay.date}: ${formatDuration(shortestSessionDuration)}`;

        console.log(`Longest Time: ${longestSessionFormatted}`);
        console.log(`Shortest Time: ${shortestSessionFormatted}`);
    });
}

function calculateSessionStatistics(sessionMapByDay) {
    // Extract dates from the map and sort them
    const dates = Array.from(sessionMapByDay.keys()).sort((a, b) => new Date(a) - new Date(b));

    if (dates.length === 0) {
        console.log("The map is empty.");
        return {};
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
