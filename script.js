// Define time zones with cities and UTC offsets
const timeZones = [
    { city: 'New York', timezone: 'America/New_York', offset: 'UTC-5 / UTC-4' },
    { city: 'Los Angeles', timezone: 'America/Los_Angeles', offset: 'UTC-8 / UTC-7' },
    { city: 'Toronto', timezone: 'America/Toronto', offset: 'UTC-5 / UTC-4' },
    { city: 'São Paulo', timezone: 'America/Sao_Paulo', offset: 'UTC-3' },
    { city: 'London', timezone: 'Europe/London', offset: 'UTC+0 / UTC+1' },
    { city: 'Paris', timezone: 'Europe/Paris', offset: 'UTC+1 / UTC+2' },
    { city: 'Dubai', timezone: 'Asia/Dubai', offset: 'UTC+4' },
    { city: 'Mumbai', timezone: 'Asia/Kolkata', offset: 'UTC+5:30' },
    { city: 'Singapore', timezone: 'Asia/Singapore', offset: 'UTC+8' },
    { city: 'Hong Kong', timezone: 'Asia/Hong_Kong', offset: 'UTC+8' },
    { city: 'Tokyo', timezone: 'Asia/Tokyo', offset: 'UTC+9' },
    { city: 'Sydney', timezone: 'Australia/Sydney', offset: 'UTC+10 / UTC+11' }
];

/**
 * Format time for a specific timezone
 * @param {string} timezone - IANA timezone string
 * @returns {object} Object containing time, date, and hour info
 */
function getTimeInTimezone(timezone) {
    const now = new Date();
    
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    });
    
    const timeParts = formatter.formatToParts(now);
    const dateParts = dateFormatter.formatToParts(now);
    
    return {
        time: formatter.format(now),
        date: dateFormatter.format(now),
        parts: timeParts,
        dateParts: dateParts
    };
}

/**
 * Create a clock card for a specific timezone
 * @param {object} tzData - Timezone data object
 * @returns {HTMLElement} Clock card element
 */
function createClockCard(tzData) {
    const card = document.createElement('div');
    card.className = 'clock-card';
    card.innerHTML = `
        <div class="city-name">${tzData.city}</div>
        <div class="time-display" data-timezone="${tzData.timezone}">--:--:--</div>
        <div class="date-display" data-timezone="${tzData.timezone}">Loading...</div>
        <div class="timezone-offset">${tzData.offset}</div>
    `;
    return card;
}

/**
 * Initialize all clock cards in the grid
 */
function initializeClocks() {
    const grid = document.getElementById('clockGrid');
    grid.innerHTML = ''; // Clear existing cards
    
    timeZones.forEach(tz => {
        const card = createClockCard(tz);
        grid.appendChild(card);
    });
    
    updateAllClocks(); // Initial update
}

/**
 * Update all clock displays
 */
function updateAllClocks() {
    const timeElements = document.querySelectorAll('[data-timezone]');
    
    timeElements.forEach(element => {
        const timezone = element.getAttribute('data-timezone');
        const timeInfo = getTimeInTimezone(timezone);
        
        if (element.classList.contains('time-display')) {
            element.textContent = timeInfo.time;
        } else if (element.classList.contains('date-display')) {
            element.textContent = timeInfo.date;
        }
    });
}

/**
 * Add a custom timezone to the grid
 * @param {string} city - City name
 * @param {string} timezone - IANA timezone string
 * @param {string} offset - UTC offset (for display)
 */
function addCustomTimeZone(city, timezone, offset) {
    const newTz = { city, timezone, offset };
    timeZones.push(newTz);
    
    const grid = document.getElementById('clockGrid');
    const card = createClockCard(newTz);
    grid.appendChild(card);
    
    updateAllClocks();
}

/**
 * Remove a timezone from the grid
 * @param {string} city - City name to remove
 */
function removeTimeZone(city) {
    const index = timeZones.findIndex(tz => tz.city === city);
    if (index > -1) {
        timeZones.splice(index, 1);
        initializeClocks();
    }
}

/**
 * Get all configured timezones
 * @returns {array} Array of timezone objects
 */
function getConfiguredTimeZones() {
    return timeZones;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeClocks();
    
    // Update every second
    setInterval(updateAllClocks, 1000);
});

// Ensure clocks update every second
setInterval(updateAllClocks, 1000);