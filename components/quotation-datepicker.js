document.getElementById("div-quotation").innerHTML = `
    <div class="price-info">From A$${(minimumNightlyRate / 100)} <span>/night</span></div>
    <div id="multiMonthPickerquotation"></div>
`;

function initializeFlatpickr(availableDates) {
    flatpickr("#multiMonthPickerquotation", {
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
    });
}