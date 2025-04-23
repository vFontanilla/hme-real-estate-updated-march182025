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
                .map(day => {
                    let adjustedDate = new Date(day.date);
                    adjustedDate.setDate(adjustedDate.getDate() - 1); // Shift back by 1 day
                    return formatDate(adjustedDate);
                })
        );

        if (availableDates.length === 0) {
            console.warn("⚠️ No available dates found!");
            return;
        }

        console.log("✅ Available Dates for Check-In/Check-Out:", availableDates);

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
    // Determine number of months based on screen width
    const isMobile = window.innerWidth <= 768;
    const monthCount = isMobile ? 1 : 2;

    flatpickr("#multiMonthPicker", {
        dateFormat: "Y-m-d",
        showMonths: monthCount,
        minDate: "today",
        enable: availableDates,
        inline: true,
        onDayCreate: function (dObj, dStr, fp, dayElem) {
            const date = formatDate(dayElem.dateObj);
            
            if (availableDates.includes(date)) {
                console.log(`✅ Highlighting ${date}`);
                dayElem.classList.add("available-highlight");
            } else {
                dayElem.classList.add("unavailable-highlight");
            }
        },
        onReady: function () {
            // Remove fixed width to allow responsiveness
            document.getElementById("div-availability").style.width = "100%";
            document.getElementById("div-availability").style.maxWidth = "739.2px"; // Maintain max-width for desktop
        },
    });
}

// CSS Styling
const availabilityStyle = document.createElement("style");
availabilityStyle.textContent = `
    #div-availability {
        width: 100%;
        max-width: 739.2px;
        margin: 0 auto;
    }

    #div-availability .flatpickr-calendar {
        width: 100% !important;
        height: auto !important;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    #div-availability .flatpickr-innerContainer {
        display: flex;
        align-items: center;
        width: 100% !important;
        overflow: hidden;
        justify-content: space-around;
    }

    #div-availability .flatpickr-days {
        min-width: 100%;
    }

    #div-availability .flatpickr-day {
        font-size: 12px !important;
        padding: 2px !important;
        margin: 0 !important;
        text-align: center;
        pointer-events: none;
        user-select: none;
    }

    /* Available Dates - Black */
    #div-availability .flatpickr-day.available-highlight {
        color: #000000 !important;
        font-weight: bold;
        opacity: 1;
    }

    /* Unavailable Dates - Red */
    #div-availability .flatpickr-day.unavailable-highlight {
        color: #FA5E50 !important;
        opacity: 0.6;
    }

    #div-availability .flatpickr-month {
        width: 50% !important;
    }

    #div-availability .flatpickr-months .flatpickr-month {
        font-size: 14px !important;
        text-align: center;
        padding-bottom: 5px;
        color: #FA5E50;
    }

    #div-availability .flatpickr-weekdays .flatpickr-weekday {
        color: #FA5E50;
    }

    #div-availability .flatpickr-current-month .flatpickr-prev-month,
    #div-availability .flatpickr-current-month .flatpickr-next-month {
        color: #FA5E50;
    }

    /* Mobile Responsive Styles */
    @media (max-width: 768px) {
        #div-availability {
            padding: 0 12px;
        }

        #div-availability .flatpickr-calendar {
            transform: none; /* Remove scaling for mobile */
        }

        #div-availability .flatpickr-innerContainer {
            flex-direction: column; /* Stack months vertically */
            justify-content: center;
        }

        #div-availability .flatpickr-month {
            width: 100% !important; /* Full width for single month */
            margin-bottom: 10px;
        }

        #div-availability .flatpickr-day {
            font-size: 14px !important; /* Larger font for readability */
            padding: 4px !important; /* More spacing */
        }

        #div-availability .flatpickr-months .flatpickr-month {
            font-size: 16px !important; /* Larger month title */
        }

        #div-availability .flatpickr-weekdays .flatpickr-weekday {
            font-size: 14px !important; /* Larger weekday labels */
        }
    }

    @media (max-width: 576px) {
        #div-availability {
            padding: 0 8px;
        }

        #div-availability .flatpickr-day {
            font-size: 13px !important; /* Slightly smaller for very small screens */
            padding: 3px !important;
        }

        #div-availability .flatpickr-months .flatpickr-month {
            font-size: 15px !important;
        }
    }
`;

document.head.appendChild(availabilityStyle);

fetchAvailability();