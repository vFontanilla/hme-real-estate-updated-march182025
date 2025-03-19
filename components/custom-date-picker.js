document.getElementById("div-availability").innerHTML = `
    <h5 class="h5-availability-header">Availability</h5>
    <div id="multiMonthPicker"></div>
`;

function formatDate(date) {
    return date.toISOString().split("T")[0];
}

async function fetchAvailability() {
    try {
        const propertyId = getPropertyIdFromURL();
        if (!propertyId) {
            console.error("❌ No propertyId found in URL");
            return;
        }

        const today = new Date();
        const twelveMonthsLater = new Date(today);
        twelveMonthsLater.setFullYear(today.getFullYear() + 1);
        twelveMonthsLater.setDate(today.getDate());

        const fromDate = formatDate(today);
        const toDate = formatDate(twelveMonthsLater);

        const apiUrl = `https://api.madecomfy.com.au/api/v4/properties/${propertyId}/availability?from=${fromDate}&to=${toDate}`;
        console.log(`📡 Fetching availability data: ${apiUrl}`);

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data || !data.months) {
            console.error("❌ Invalid API response format");
            return;
        }

        const availableDates = data.months.flatMap(month =>
            month.days
                .filter(day => day.availableForCheckIn === true || day.availableForCheckOut === true)
                .map(day => formatDate(new Date(day.date)))
        );

        if (availableDates.length === 0) {
            console.warn("⚠️ No available dates found!");
            return;
        }

        console.log("✅ Final Available Dates:", availableDates);

        initializeFlatpickr(availableDates);
    } catch (error) {
        console.error("Error fetching availability:", error);
    }
}

function getPropertyIdFromURL() {
    return new URLSearchParams(window.location.search).get("property_id");
}

function initializeFlatpickr(availableDates) {
    flatpickr("#multiMonthPicker", {
        showMonths: 2,
        inline: true,
        disableMobile: true,
        clickOpens: false,
        disable: [(date) => {
            // Create a new date that's one day earlier
            const previousDay = new Date(date);
            previousDay.setDate(date.getDate() + 1);
            // Check if the previous day is in availableDates
            return !availableDates.includes(formatDate(previousDay));
        }],
        onDayCreate: function (dObj, dStr, fp, dayElem) {
            const date = formatDate(dayElem.dateObj);
            if (availableDates.includes(date)) {
                console.log(`✅ Highlighting ${date}`);
                dayElem.classList.add("available-highlight");
            }
        },
        onReady: function () {
            document.getElementById("div-availability").style.width = "739.2px";
        },
    });
}

fetchAvailability();
