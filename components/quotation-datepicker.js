document.getElementById("div-quotation").innerHTML = `
    <div class="div-h5-available-header" id="div-h5-available-header">
        <h5 class="h5-availability-header">Enquiry</h5>
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
            <button class="eqnuire-btn">Enquire Now</button>
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

        const apiUrl = `https://api.madecomfy.com.au/api/v4/properties/${propertyId}/quote?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}`;
        console.log(`📡 Fetching quote data: ${apiUrl}`);

        const response = await fetch(apiUrl);
        const data = await response.json();

        updateQuoteDisplay(data);

    } catch (error) {
        console.error("Error fetching quote:", error);
    }
}

function updateQuoteDisplay(data) {
    const quoteDetails = document.getElementById("quoteDetails");
    const quoteHeader = document.getElementById("div-h5-available-header");

    if (data && data.quote) {
        // Convert cents to dollars and ensure 2 decimal places
        const total = (data.quote.total / 100).toFixed(2) || '1,000.00';

        console.log(`🔹 Updating heading with: $${total} Total`);

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
            <h5 class="h5-availability-header">$${total} total</h5>
        `;

        quoteDetails.style.display = 'block';
        quoteHeader.style.display = 'block';
    } else {
        console.log("🔹 No quote data available, resetting heading.");

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

        quoteDetails.style.display = 'none';
    }
}

function getPropertyIdFromURL() {
    return new URLSearchParams(window.location.search).get("property_id");
}

function initializeFlatpickrQuotation(availableDates) {
    const checkInInput = document.getElementById("checkInPicker");
    const checkOutInput = document.getElementById("checkOutPicker");

    if (!checkInInput || !checkOutInput) {
        console.error("❌ Check-in or Check-out input fields not found.");
        return;
    }

    let adults = 2;
    let children = 0;

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
            if (selectedDates.length > 0) {
                checkOut.set("minDate", dateStr);
                if (checkOut.selectedDates.length > 0) {
                    console.log("Fetching quote with checkIn from checkIn:", dateStr);
                    fetchQuote(dateStr, checkOut.selectedDates[0].toLocaleDateString("en-CA"), adults, children);
                }
            } else {
                // Reset display when check-in is cleared
                console.log("Check-in cleared, resetting quote display");
                updateQuoteDisplay(null);
            }
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
            if (selectedDates.length > 0 && checkIn.selectedDates.length > 0) {
                console.log("Fetching quote with checkIn from checkOut:", checkIn.selectedDates[0].toLocaleDateString("en-CA"));
                fetchQuote(checkIn.selectedDates[0].toLocaleDateString("en-CA"), dateStr, adults, children);
            } else {
                // Reset display when check-out is cleared
                console.log("Check-out cleared, resetting quote display");
                updateQuoteDisplay(null);
            }
        }
    });

    const guestPicker = document.getElementById("idGuestPicker");
    const guestDropdown = document.getElementById("guestDropdown");
    const adultCount = document.getElementById("adultCount");
    const childrenCount = document.getElementById("childrenCount");
    const applyGuests = document.getElementById("applyGuests");

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
            if (type === "adults") {
                adults++;
                adultCount.textContent = adults;
            } else {
                children++;
                childrenCount.textContent = children;
            }
            updateGuestPickerDisplay();
            if (checkIn.selectedDates.length > 0 && checkOut.selectedDates.length > 0) {
                fetchQuote(checkIn.selectedDates[0].toLocaleDateString("en-CA"), checkOut.selectedDates[0].toLocaleDateString("en-CA"), adults, children);
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
            if (checkIn.selectedDates.length > 0 && checkOut.selectedDates.length > 0) {
                fetchQuote(checkIn.selectedDates[0].toLocaleDateString("en-CA"), checkOut.selectedDates[0].toLocaleDateString("en-CA"), adults, children);
            }
        });
    });

    applyGuests.addEventListener("click", (e) => {
        e.stopPropagation();
        guestDropdown.style.display = "none";
        updateGuestPickerDisplay();
        if (checkIn.selectedDates.length > 0 && checkOut.selectedDates.length > 0) {
            fetchQuote(checkIn.selectedDates[0].toLocaleDateString("en-CA"), checkOut.selectedDates[0].toLocaleDateString("en-CA"), adults, children);
        }
    });

    function updateGuestPickerDisplay() {
        const totalGuests = adults + children;
        guestPicker.value = `${totalGuests} Guest${totalGuests !== 1 ? 's' : ''}`;
    }

    updateGuestPickerDisplay();
}

const quotationStyle = document.createElement("style");
quotationStyle.textContent = `
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
        border: 1px solid rgb(239, 239, 240);
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
`;
document.head.appendChild(quotationStyle);

fetchAvailabilityForCheckInOut();