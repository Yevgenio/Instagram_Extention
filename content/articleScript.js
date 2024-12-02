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