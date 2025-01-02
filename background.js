import Timer from './timer.js';

// Target website is Instagram
let target = "instagram.com";

// Variable to store the details of the current session
let currentSession = null;

// session timeout timer 
const sessionTimeout = new Timer(5, () => { sessionTimeoutExpired(); });

// Function to send JSON data to popup.js
// function sendCurrrentSessionToPopup() {
//     chrome.runtime.sendMessage({ action: "sendCurrentSession", data: currentSession }, function(response) {
//         console.log("Response from popup:", response);
//     });
// }



// Callback function for when the session timer expires
function sessionTimeoutExpired() {
    // sendCurrrentSessionToPopup();
    console.log("Session was ended:", currentSession);
    saveSession();
    deleteSession();
}

// Function to start a new session
function startSession() {
    sessionTimeout.stop();
    if (currentSession) {
        updateSession();
    } else {
        createSession();
    }
    // sendCurrrentSessionToPopup();
}

// Function to start a new session
function createSession() {
    const now = new Date();
    currentSession = { 
        startTime: now.toISOString(), 
        endTime: now.toISOString() 
    };
    console.log("New session started:", currentSession.startTime);
}

// Function to update the current session's end time
function updateSession() {
    const now = new Date();
    currentSession.endTime = now.toISOString();
    console.log("Session updated:", currentSession.endTime);
}

// Handle tab changed to a non target website
function endSession() {
    // Check if theres an active session
    if (currentSession) {
        sessionTimeout.start(); // start or restart
        updateSession();
    }
    // sendCurrrentSessionToPopup();
}

// Function to save session data in Chrome's local storage
function saveSession() {
    // Backup current session due to async operations 
    let finishedSession = currentSession;

    // Retrieve existing session data from Chrome's local storage
    chrome.storage.local.get('sessionData', (data) => {
        const sessionData = data.sessionData || [];
        sessionData.push(finishedSession);
        //console.log('Sessions', sessionData);
        chrome.storage.local.set({ sessionData }, () => {
            console.log('Session saved:', finishedSession);
        });
    });
}

// Deletes the current session from working memory
function deleteSession() {
    currentSession = null;
    console.log("Session deleted:", currentSession);
}

function userOnTarget(callback) {
    // Check if the Chrome window is focused and active
    chrome.windows.getLastFocused({ populate: true }, function (window) {
        if (!window.focused) {
            callback(false);
            return;
        }

        // Check if the active tab in the focused window is on Instagram
        const activeTab = window.tabs.find(tab => tab.active);
        if (activeTab && activeTab.url.includes(target)) {
            // The user is active and on an Instagram tab
            callback(true);
        } else {
            // The user is not on an Instagram tab
            callback(false);
        }
    });
}

// Handle tab event
function handleEvent() {
    userOnTarget(function(isActive) {
        if (isActive) {
            startSession();
        } else {
            endSession();
        }
    })
}

// Listen for tab changes (switching tabs, closing tab, etc.)
chrome.tabs.onActivated.addListener(() => {
    handleEvent();
    monitorURLDuringSession();
});

chrome.tabs.onUpdated.addListener(() => {
    handleEvent();
    monitorURLDuringSession();
});

chrome.tabs.onRemoved.addListener(() => {
    handleEvent();
});

// Listen for window events (closing, minimizing, focus change)
chrome.windows.onRemoved.addListener(() => {
    handleEvent();
});

chrome.windows.onFocusChanged.addListener(() => {
    handleEvent();
});

// Listen for idle state changes
chrome.idle.onStateChanged.addListener((newState) => {
    if (newState === 'idle' || newState === 'locked') {
        console.log('User is idle or locked');
        endSession();
    } else if (newState === 'active') {
        console.log('User is active');
        startSession();
    }
});

// // Listen for visibility change (tab becoming visible or hidden)
// document.addEventListener('visibilitychange', () => {
//     if (document.hidden) {
//         endSession();
//     } else {
//         startSession();
//     }
// });

// - - - Load Ranking Result Data - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes("instagram.com")) {
      chrome.storage.local.get("analysisData", function(data) {
        if (data.analysisData) {
          chrome.tabs.sendMessage(tabId, {
            type: "NEW_PAGE",
            rankingResult: data.analysisData
          });
        }
      });
    }
});



let currentURL = null;
let urlStartTime = null;

// Track URL change during an active session
function logURLChange(newURL) {
    const now = new Date();
    if (currentURL) {
        // End the current URL session
        const duration = (now - urlStartTime) / 1000; // Duration in seconds
        console.log(`URL: ${currentURL}, Duration: ${duration}s`);
        saveURLSession(currentURL, urlStartTime, now);
    }

    // Start new URL session
    currentURL = newURL;
    urlStartTime = now;
}

// Save URL session to local storage
function saveURLSession(url, startTime, endTime) {
    const session = { url, startTime: startTime.toISOString(), endTime: endTime.toISOString() };
    chrome.storage.local.get("urlSessions", (data) => {
        const urlSessions = data.urlSessions || [];
        urlSessions.push(session);
        chrome.storage.local.set({ urlSessions }, () => {
            console.log("URL session saved:", session);
        });
    });
}

// Monitor active session and URL changes
function monitorURLDuringSession() {
    userOnTarget((isActive) => {
        if (isActive) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                const activeTab = tabs[0];
                if (activeTab?.url.includes("instagram.com")) {
                    const currentPath = new URL(activeTab.url).pathname;
                    if (currentPath !== currentURL) {
                        logURLChange(currentPath);
                    }
                }
            });
        } else {
            // End the current URL session if the session becomes inactive
            if (currentURL) {
                logURLChange(null);
                currentURL = null;
                urlStartTime = null;
            }
        }
    });
}