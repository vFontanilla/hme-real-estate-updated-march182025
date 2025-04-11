document.getElementById("div-quotation").innerHTML = `
    <div class="div-h5-available-header" id="div-h5-available-header">
        <h5 class="h5-availability-header">Enquiry</h5>
    </div>
    <div class="div-h5-available-warning" id="div-h5-available-warning">
        <h5 class="h5-availability-header">Minimum stay of 3 nights per property.</h5>
    </div>
    <div>
        <div>Dates</div>
        <div class="div-dates-container">
            <div>
                <input id="checkInPicker" placeholder="Check In">
            </div>
            <br>
            <div>
                <input id="checkOutPicker" placeholder="Check Out">
            </div>
        </div>
    </div>
    <br>
    <div>
        <div>Guests</div>
        <div class="guest-picker-container">
            <input class="idGuestPicker" id="idGuestPicker" placeholder="Select Guests" readonly>
            <div id="guestDropdown" class="guest-dropdown" style="display: none;">
                <div class="guest-type">
                    <label>Adults</label>
                    <div class="guest-counter">
                        <button class="decrement" data-type="adults">-</button>
                        <span id="adultCount">2</span>
                        <button class="increment" data-type="adults">+</button>
                    </div>
                </div>
                <div class="guest-type">
                    <label>Children</label>
                    <div class="guest-counter">
                        <button class="decrement" data-type="children">-</button>
                        <span id="childrenCount">0</span>
                        <button class="increment" data-type="children">+</button>
                    </div>
                </div>
                <button id="applyGuests">Apply</button>
            </div>
        </div>
    </div>
    <br>
    <div id="quoteDetails">
        <div class="div-details-quote">
            <div>Nothing to show</div>
            <div>Nothing to show</div>
        </div>
        <div class="div-details-quote">
            <div>Cleaning Fee</div>
            <div>Nothing to show</div>
        </div>
        <div class="div-details-quote">
            <div>Total</div>
            <div>Nothing to show</div>
        </div>
    </div>
    <br>
    <div>
        <div class="div-enquire-btn">
            <button class="enquire-btn" id="enquire-btn" disabled>Enquire Now</button>
        </div>
    </div>
`;

function formatDate(date) {
    return date.toISOString().split("T")[0];
}

async function fetchAvailabilityForCheckInOut() {
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
                    adjustedDate.setDate(adjustedDate.getDate());
                    return formatDate(adjustedDate);
                })
        );

        if (availableDates.length === 0) {
            console.warn("⚠️ No available dates found!");
            return;
        }

        console.log("✅ Available Dates for Check-In/Check-Out:", availableDates);

        console.log("✅ Final Available Dates:", availableDates);
        initializeFlatpickrQuotation(availableDates);
    } catch (error) {
        console.error("Error fetching availability:", error);
    }
}

async function fetchQuote(checkIn, checkOut, adults, children) {
    try {
        const propertyId = getPropertyIdFromURL();
        if (!propertyId) {
            console.error("❌ No propertyId found in URL");
            return;
        }

        // Define quote API URL (GET)
        const quoteApiUrl = `https://api.madecomfy.com.au/api/v4/properties/${propertyId}/quote?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}`;
        console.log(`📡 Fetching quote data: ${quoteApiUrl}`);

        // Define bookings API URL with query parameters (POST)
        const bookingsApiUrl = `https://api.madecomfy.com.au/api/v4/properties/${propertyId}/bookings?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}`;
        console.log(`📡 Posting bookings data: ${bookingsApiUrl}`);

        // Fetch both APIs concurrently using Promise.all
        const [quoteResponse, bookingsResponse] = await Promise.all([
            fetch(quoteApiUrl)
                .then(res => {
                    if (!res.ok) throw new Error(`Quote API error: ${res.status} ${res.statusText}`);
                    return res.json();
                })
                .catch(err => {
                    console.error("Quote API failed:", err);
                    return null; // Return null to indicate failure
                }),
            fetch(bookingsApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // No body needed since parameters are in the URL
                // If the API requires a body, we can add it here
                body: JSON.stringify({})
            })
                .then(async res => {
                    if (!res.ok) {
                        const errorText = await res.text();
                        throw new Error(`Bookings API error: ${res.status} ${res.statusText} - ${errorText}`);
                    }
                    return res.json();
                })
                .catch(err => {
                    console.error("Bookings API failed:", err.message);
                    return null; // Return null to indicate failure
                })
        ]);

        // Extract longId and create booking URL
        let bookingUrl = null;
        if (bookingsResponse && bookingsResponse.booking && bookingsResponse.booking.longId) {
            const longId = bookingsResponse.booking.longId;
            bookingUrl = `https://book.madecomfy.com/bookings/?bookingId=${longId}`;
            console.log(`🔹 Extracted longId: ${longId}`);
            console.log(`🔗 Generated booking URL: ${bookingUrl}`);
        } else {
            console.log("🔹 No booking or longId found in bookings response:", bookingsResponse);
        }

        // Update quote display and enquire button with quote data and booking URL
        updateQuoteDisplay(quoteResponse, bookingUrl);

    } catch (error) {
        console.error("Error fetching data:", error);
        // Ensure button is disabled and UI is reset on error
        updateQuoteDisplay(null, null);
    }
}

function updateQuoteDisplay(data, bookingUrl) {
    const quoteDetails = document.getElementById("quoteDetails");
    const quoteHeader = document.getElementById("div-h5-available-header");
    const quoteWarning = document.getElementById("div-h5-available-warning");
    const enquireBtn = document.getElementById("enquire-btn");

    if (data && data.quote && bookingUrl) {
        // Convert cents to dollars and ensure 2 decimal places
        const total = (data.quote.total / 100).toFixed(2) || '1,000.00';

        console.log(`🔹 Updating heading with: $${total} Total`);
        console.log("Di kitaon", quoteWarning);

        quoteDetails.innerHTML = `
            <div class="div-details-quote">
                <div>A$${(data.quote.averageNightlyRate / 100).toFixed(2)} x ${data.quote.nights || '3'} nights</div>
                <div>A$${(data.quote.subTotal / 100).toFixed(2)}</div>
            </div>
            <div class="div-details-quote">
                <div>Cleaning Fee</div>
                <div>A$${(data.quote.extraFees[0].cost / 100).toFixed(2)}</div>
            </div>
            <div class="div-details-quote">
                <div>Total</div>
                <div>A$${total}</div>
            </div>
        `;

        quoteHeader.innerHTML = `
            <h5 class="h5-availability-header">A$${total} total</h5>
        `;

        quoteWarning.innerHTML = `
            <h5 class="h5-availability-header">Are you sure you want to proceed in Booking?</h5>
        `;

        quoteDetails.style.display = 'block';
        quoteHeader.style.display = 'block';

        // Enable button, set text to "View Booking", and open bookingUrl in new tab
        enquireBtn.disabled = false;
        enquireBtn.textContent = "View Booking";
        enquireBtn.onclick = () => {
            window.location.href = bookingUrl;
        };
    } else {
        console.log("🔹 No quote data or booking URL available, resetting UI.");
        console.log("kitaon", quoteWarning);

        quoteDetails.innerHTML = `
            <div class="div-details-quote">
                <div>Nothing to show</div>
                <div>Nothing to show</div>
            </div>
            <div class="div-details-quote">
                <div>Cleaning Fee</div>
                <div>Nothing to show</div>
            </div>
            <div class="div-details-quote">
                <div>Total</div>
                <div>Nothing to show</div>
            </div>
        `;

        quoteHeader.innerHTML = `
            <h5 class="h5-availability-header">Enquiry</h5>
        `;

        quoteWarning.innerHTML = `
            <h5 class="h5-availability-header">Minimum stay of 3 nights per property.</h5>
        `;

        quoteDetails.style.display = 'none';
        enquireBtn.disabled = true;
        enquireBtn.textContent = "Enquire Now";
        enquireBtn.onclick = null; // Clear any previous onclick
    }
}

function getPropertyIdFromURL() {
    return new URLSearchParams(window.location.search).get("property_id");
}

function initializeFlatpickrQuotation(availableDates) {
    const checkInInput = document.getElementById("checkInPicker");
    const checkOutInput = document.getElementById("checkOutPicker");
    const guestPicker = document.getElementById("idGuestPicker");
    const guestDropdown = document.getElementById("guestDropdown");
    const adultCount = document.getElementById("adultCount");
    const childrenCount = document.getElementById("childrenCount");
    const applyGuests = document.getElementById("applyGuests");
    const quoteWarning = document.getElementById("div-h5-available-warning");

    // Debugging: Verify the warning element exists
    console.log("quoteWarning element:", quoteWarning);
    if (!quoteWarning) {
        console.error("❌ div-h5-available-warning element not found in DOM");
    } else {
        console.log("quoteWarning initial display:", quoteWarning.style.display);
    }

    if (!checkInInput || !checkOutInput) {
        console.error("❌ Check-in or Check-out input fields not found.");
        return;
    }

    let maxGuests = window.guests || 6;
    let adults = 2;
    let children = 0;

    function updateGuestPickerDisplay() {
        const totalGuests = adults + children;
        const guestPicker = document.getElementById("idGuestPicker");
        guestPicker.value = `${totalGuests} Guest${totalGuests !== 1 ? 's' : ''}`;
    
        // Get checkIn and checkOut from the date picker inputs
        const checkInPicker = document.getElementById("checkInPicker");
        const checkOutPicker = document.getElementById("checkOutPicker");
        const checkIn = checkInPicker.value; // e.g., "2025-04-26"
        const checkOut = checkOutPicker.value; // e.g., "2025-04-29"
    
        // Validate inputs before calling fetchQuote
        if (!checkIn || !checkOut) {
            console.error("❌ Check-in or check-out date is missing");
            updateQuoteDisplay(null, null); // Reset UI if dates are missing
            return;
        }
    
        // Call fetchQuote with all required parameters
        fetchQuote(checkIn, checkOut, adults, children);
    }

    // Function to check stay duration and update UI
    function checkStayDuration(checkInInstance, checkOutInstance) {
        if (checkInInstance.selectedDates.length > 0 && checkOutInstance.selectedDates.length > 0) {
            const checkInDate = new Date(checkInInstance.selectedDates[0]);
            const checkOutDate = new Date(checkOutInstance.selectedDates[0]);
            const diffTime = checkOutDate - checkInDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            console.log("Stay duration (days):", diffDays); // Debugging

            if (diffDays < 3) {
                console.log("Showing minimum stay warning"); // Debugging
                quoteWarning.style.display = "block"; // Show the warning
                updateQuoteDisplay(null); // Reset quote display
            } else {
                console.log("Hiding warning, fetching quote"); // Debugging
                quoteWarning.style.display = "none"; // Hide the warning
                fetchQuote(
                    checkInInstance.selectedDates[0].toLocaleDateString("en-CA"),
                    checkOutInstance.selectedDates[0].toLocaleDateString("en-CA"),
                    adults,
                    children
                ); // Proceed with quote fetch
            }
        } else {
            console.log("One or both dates not selected, resetting"); // Debugging
            quoteWarning.style.display = "none"; // Hide warning when dates are incomplete
            updateQuoteDisplay(null); // Reset quote display
        }
    }

    const checkIn = flatpickr(checkInInput, {
        dateFormat: "Y-m-d",
        minDate: "today",
        enable: availableDates,
        showMonths: 1,
        yearSelector: true,
        inline: false,
        onReady: function(selectedDates, dateStr, instance) {
            instance.currentYearElement.setAttribute("title", "Select Year");
        },
        onChange: function(selectedDates, dateStr, instance) {
            console.log("Check-in changed to:", dateStr); // Debugging
            if (selectedDates.length > 0) {
                checkOut.set("minDate", dateStr);
            }
            checkStayDuration(instance, checkOut); // Check stay after change
        }
    });

    const checkOut = flatpickr(checkOutInput, {
        dateFormat: "Y-m-d",
        minDate: "today",
        enable: availableDates,
        showMonths: 1,
        yearSelector: true,
        inline: false,
        onReady: function(selectedDates, dateStr, instance) {
            instance.currentYearElement.setAttribute("title", "Select Year");
        },
        onChange: function(selectedDates, dateStr, instance) {
            console.log("Check-out changed to:", dateStr); // Debugging
            checkStayDuration(checkIn, instance); // Check stay after change
        }
    });

    // Guest picker logic remains unchanged
    guestPicker.addEventListener("click", (e) => {
        e.stopPropagation();
        guestDropdown.style.display = "block";
    });

    document.addEventListener("click", (e) => {
        if (!guestPicker.contains(e.target) && !guestDropdown.contains(e.target)) {
            guestDropdown.style.display = "none";
        }
    });

    guestDropdown.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    document.querySelectorAll(".increment").forEach(button => {
        button.addEventListener("click", (e) => {
            e.stopPropagation();
            const type = e.target.dataset.type;
            const totalGuests = adults + children;

            if (totalGuests < maxGuests) {
                if (type === "adults") {
                    adults++;
                    adultCount.textContent = adults;
                } else if (type === "children") {
                    children++;
                    childrenCount.textContent = children;
                }
                updateGuestPickerDisplay();
            } else {
                console.warn(`🚫 Cannot add more guests. Max allowed: ${maxGuests}`);
            }
        });
    });

    document.querySelectorAll(".decrement").forEach(button => {
        button.addEventListener("click", (e) => {
            e.stopPropagation();
            const type = e.target.dataset.type;

            if (type === "adults" && adults > 1) {
                adults--;
                adultCount.textContent = adults;
            } else if (type === "children" && children > 0) {
                children--;
                childrenCount.textContent = children;
            }
            updateGuestPickerDisplay();
        });
    });

    applyGuests.addEventListener("click", (e) => {
        e.stopPropagation();
        guestDropdown.style.display = "none";
        updateGuestPickerDisplay();
    });

    updateGuestPickerDisplay();

    // Initially hide the warning
    quoteWarning.style.display = "none";
}

const quotationStyle = document.createElement("style");
quotationStyle.textContent = `
    #div-h5-available-warning {
        display: none;
        color: red;
        margin-top: 10px;
    }
    #div-quotation .flatpickr-calendar {
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    #div-quotation .flatpickr-innerContainer {
        display: flex;
        overflow: hidden;
        justify-content: space-around;
    }
    .div-dates-container {
        display: flex;
        gap: 10px;
    }
    .idGuestPicker {
        width: 100%;
        box-sizing: border-box;
        height: 45px;
        padding: .5rem 1rem;
    }
    .idGuestPicker: focus {
        outline: none;
    }
    #div-quotation {
        overflow: visible;
        border-radius: 4px;
        border: 2px solid rgb(239, 239, 240);
        min-height: 300px;
        padding: 24px 16px;
        position: relative;
    }
    .div-details-quote {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }
    .guest-picker-container {
        position: relative;
        width: 100%;
    }
    .guest-dropdown {
        position: absolute;
        background: white;
        border: 1px solid #efefef;
        border-radius: 4px;
        padding: 15px;
        z-index: 1000;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .guest-type {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    .guest-counter {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .guest-counter button {
        width: 30px;
        height: 30px;
        border: 1px solid #efefef;
        border-radius: 4px;
        background: white;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        line-height: 1;
        padding: 0;
        transition: background-color 0.2s, border-color 0.2s;
    }
    .guest-counter button:active {
        background-color: #e0e0e0;
        border-color: #c0c0c0;
    }
    .guest-counter button:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.3);
    }
    #applyGuests {
        width: 100%;
        padding: 8px;
        margin-top: 10px;
        background: #FA5E50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    #applyGuests:hover {
        background: #e04e40;
    }
    #quoteDetails {
        display: none;
    }
    .div-enquire-btn {
        display: flex;
        justify-content: center;
    }
    .enquire-btn {
        border-radius: 10px;
        background: #e04e40;
        color: white;
        border: none;
    }
    .enquire-btn:hover{
        background: #e04e40;
        color: white;
        border: none;  
    }
    .enquire-btn:disabled {
        background: #d3d3d3;
        color: #888;
        cursor: not-allowed;
        opacity: 0.6;
    }
`;
document.head.appendChild(quotationStyle);

fetchAvailabilityForCheckInOut();