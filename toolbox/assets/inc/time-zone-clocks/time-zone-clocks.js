// Add event listener for page load
window.addEventListener('load', () => {
    determineAZBadgePosition();
    updateAZTimeAndTimezone(); // Update Arizona time and timezone on page load
});

// Add event listener for page refresh
window.addEventListener('beforeunload', () => {
    // Save the current scroll position
    localStorage.setItem('scrollPosition', window.scrollY);
});

// Function to determine AZ badge position on page load/refresh
function determineAZBadgePosition() {
    // Get the saved scroll position
    const savedScrollPosition = localStorage.getItem('scrollPosition');
    
    // Scroll to the saved position
    if (savedScrollPosition) {
        window.scrollTo(0, parseInt(savedScrollPosition, 10));
    }

    // Update the time and AZ badge
    updateTime();
    updateAZTimeAndTimezone();
}

// Function to update the clocks and AZ badge based on DST
function updateTime() {
    // Get the current time in UTC
    const currentTime = new Date();

    // Determine if Daylight Saving Time (DST) is in effect for Arizona
    const isDSTInEffect = isDSTArizona(currentTime);

    // Get the local time in different timezones
    const ptTime = getCurrentTime('America/Los_Angeles', 'Pacific Time (PT)', 'Los Angeles');
    const mtTime = getCurrentTime('America/Denver', 'Mountain Time (MT)', 'Denver');
    const ctTime = getCurrentTime('America/Chicago', 'Central Time (CT)', 'Chicago');
    const etTime = getCurrentTime('America/New_York', 'Eastern Time (ET)', 'New York');

    // Get the user's local timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Update the clock elements with the local time and timezone
    // Update the clock elements with the local time and timezone
        updateClock('pt-time', ptTime, isDSTInEffect, 'Los Angeles');
        updateClock('mt-time', mtTime, isDSTInEffect, 'Denver');
        updateClock('ct-time', ctTime, isDSTInEffect, 'Chicago');
        updateClock('et-time', etTime, false, 'New York');

}
// Function to update Arizona Time and Timezone
function updateAZTimeAndTimezone() {
    const azClockElement = document.getElementById('az-time');
    const azTimezoneElement = document.getElementById('az-timezone');

    // Get the current time in Arizona
    const azTime = getCurrentTime('America/Phoenix', 'Arizona Time', '');

    // Determine if Daylight Saving Time (DST) is in effect for Arizona
    const isDSTInEffect = isDSTArizona(new Date());

    // Determine the AZ timezone abbreviation based on DST
    const azTimezoneAbbreviation = isDSTInEffect ? 'PST' : 'MST';

    // Update Arizona time element
    azClockElement.textContent = `${azTime}`;

    // Check if azTimezoneElement exists before updating its textContent
    if (azTimezoneElement) {
        azTimezoneElement.textContent = azTimezoneAbbreviation;
    }
}


// Function to update a clock's time and AZ badge based on DST
function updateClock(clockId, time, isDST, location) {
    const clockElement = document.getElementById(clockId);
    const azBadge = clockElement.querySelector('.az-badge');

    clockElement.textContent = time + (location ? ` ${location}` : '');

    // Toggle between .active and .inactive classes based on DST
    if (azBadge) {
        if (isDST) {
            // DST is in effect, add .active class and remove .inactive class
            azBadge.classList.remove('inactive');
            azBadge.classList.add('active');
        } else {
            // DST is not in effect, add .inactive class and remove .active class
            azBadge.classList.remove('active');
            azBadge.classList.add('inactive');
        }
    }
}


// Function to check if DST is in effect for Arizona
function isDSTArizona(date) {
    const year = date.getFullYear();
    const dstStart = new Date(`03/14/${year} 02:00:00`);
    const dstEnd = new Date(`11/07/${year} 02:00:00`);

    return date >= dstStart && date < dstEnd;
}

// Function to get the current time in a specified timezone with location info
function getCurrentTime(timezone, timezoneName, locationName) {
    const options = {
        timeZone: timezone,
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric', // Include seconds
    };

    return `${new Date().toLocaleString('en-US', options)} ${locationName ? `${locationName}, ` : ''}${timezoneName}`;
}

// Function to update the local time and timezone
function updateLocalTime() {
    const localTimeElement = document.getElementById('local-time');

    // Get the current time in the user's timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const userTime = getCurrentTime(userTimezone, '', '');

    localTimeElement.textContent = userTime + (userTimezone ? ` ${userTimezone}` : '');
}


// Update the time every second
setInterval(updateTime, 1000);

// Initial update
updateTime();
updateAZTimeAndTimezone(); // Update Arizona time and timezone on page load
// Update the local time and timezone for additional information
updateLocalTime();
