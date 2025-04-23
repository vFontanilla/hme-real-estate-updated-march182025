jQuery(document).ready(function ($) {
    console.log("✅ phase-2.js is running!");
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('property_id');

    window.myApps = window.myApps || {
        latitude: -27.4851278,
        longitude: 152.9997188
    };

    let map;
    let AdvancedMarkerElement;

    window.phase2InitMap = async function() {
        console.log("phase-2.js Map Initialized");

        if (typeof google === "undefined" || !google.maps || !google.maps.marker) {
            console.log("Google Maps API not loaded yet, retrying...");
            setTimeout(window.phase2InitMap, 100); // Retry with correct function
            return;
        }

        let mapElement = document.getElementById("maps");
        if (!mapElement) {
            console.error("Map container not found in phase 2! Check your HTML.");
            return;
        }

        const latitude = window.myApps.latitude;
        const longitude = window.myApps.longitude;

        map = new google.maps.Map(mapElement, {
            center: { lat: latitude, lng: longitude },
            zoom: 15,
            mapId: "4504f8b37365c3d0",
        });

        console.log("Google Maps Loaded:", map);

        try {
            const markerLib = await google.maps.importLibrary("marker");
            AdvancedMarkerElement = markerLib.AdvancedMarkerElement;
            const marker = new AdvancedMarkerElement({
                map: map,
                position: { lat: latitude, lng: longitude },
                title: "Property Location"
            });
            console.log("Marker added at:", marker.position);
        } catch (error) {
            console.error("Error loading AdvancedMarkerElement:", error);
        }
    };

    // Trigger map initialization after data is fetched
    window.phase2InitMap();

    if (propertyId) {
        fetch(`https://api.madecomfy.com.au/api/v4/properties/${propertyId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {

                var guests = data.guests;
                window.guests = guests;

                if (data && data.photos && data.photos.length > 0) {
                    const photos = data.photos;

                    document.querySelector('.div1').innerHTML = `<img src="${photos[0].url}" class="grid-image" alt="Property Image 1">`;
                    if (photos.length > 1) {
                        document.querySelector('.div2').innerHTML = `<img src="${photos[1].url}" class="grid-image" alt="Property Image 2">`;
                    }
                    if (photos.length > 2) {
                        const remainingImagesCount = photos.length - 3;
                        const moreButton = remainingImagesCount > 0 ? `<button class="more-images-button">+${remainingImagesCount} more</button>` : '';
                        document.querySelector('.div3').innerHTML = `
                            <img src="${photos[2].url}" class="grid-image3" alt="Property Image 3">
                            ${moreButton}
                        `;
                        const moreImagesButton = document.querySelector('.more-images-button');
                        if (moreImagesButton) {
                            moreImagesButton.addEventListener('click', function () {
                                openImageGallery(photos);
                            });
                        }
                    }
                } else {
                    document.querySelector('.parent').innerHTML = "<p>No images available.</p>";
                }

                // Ensure data object has necessary properties
                if (data && data.id && data.name && data.location && data.propertyType && (data.segment === null || data.segment) && data.guests && data.bedrooms && data.bathrooms && data.descriptions) {
                    // Initializations
                    const propertyId = data.id;
                    const propertyName = data.name;
                    const propertyLocation = data.location;
                    const propertyType = data.propertyType;

                    // const propertySegment = data.segment;
                    const propertySegment = data.segment ? data.segment : "";
                    const spanSegment = document.getElementById("span-segment");

                    const propertyGuests = data.guests;
                    const propertyBedrooms = data.bedrooms;
                    const propertyBathrooms = data.bathrooms;
                
                    const propertySummary = data.descriptions.summary;
                    const propertySpace = data.descriptions.space;
                    const propertyGuestAccess = data.descriptions.access;
                    const propertyLocalArea = data.descriptions.localArea;
                    const propertyGettingAround = data.descriptions.gettingAround;
                    const propertyNotes = data.descriptions.notes;
                    const sleepingArrangements = data.rooms;
                    const houseRules = data.descriptions.houseRules;
                
                    // First part
                    document.getElementById("h3-name").innerText = propertyName;
                    document.getElementById("p-location").innerText = propertyLocation;
                    document.getElementById("h5-type").childNodes[0].nodeValue = propertyType;

                    if (propertySegment !== "") {
                        spanSegment.innerText = propertySegment;
                        spanSegment.style.display = "inline"; // Ensure it's visible
                    } else {
                        spanSegment.style.display = "none"; // Hide if empty
                    }

                    document.getElementById("h5-gbb").innerHTML = `
                        <span class="segment-badge-gbb">${propertyGuests} Guests</span>
                        <span class="segment-badge-gbb">${propertyBedrooms} Bedrooms</span>
                        <span class="segment-badge-gbb">${propertyBathrooms} Bathrooms</span>
                    `;
                
                    //Main
                    if (propertySummary && propertySpace && propertyGuestAccess && propertyLocalArea && propertyGettingAround && propertyNotes) {
                        // Define breakpoints
                        const propertyBreakpoints = new Map([
                            // 1
                            ["67a5a20c64db4", [
                                "meal prep.",
                                "and dryer.",
                                "and convenience.",
                                "(guests to use their own credentials)",
                                "area seats 2",
                                "hairdryer provided",
                                "short trip away.",
                                "hygienic sleep experience.",
                                "shoes inside the property",
                                "Council Rangers or Police.",
                                "fee of $200.",
                                "unintentional items left behind."
                            ]],
                            // 2
                            ["67a42c36ca3b7", [
                                "casual work sessions.",
                                "added convenience.",
                                "top attractions.",
                                "(guests to use their own credentials)",
                                "area seats 4",
                                "hairdryer provided",
                                "Gold Coast’s key attractions.",
                                "hygienic sleep experience."
                            ]],
                            // 3
                            ["679ac4ff06e28", [
                                "coastal escape.",
                                "(guests to use own credentials)",
                                "countertop seats 2",
                                "hairdryer provided",
                                "Caloundra, and Noosa.",
                                "hygienic sleep experience."
                            ]],
                            // 4
                            ["6799bd52ef9e9", [
                                "business travellers.",
                                "(guests to use their own credentials)",
                                "countertop seats 2",
                                "hairdryer provided",
                                "and Brisbane Airport.",
                                "hygienic sleep experience."
                            ]],
                            // 5
                            ["679874e2e2715", [
                                "and accessibility.",
                                "(guests to use their own credentials)",
                                "area seats 2",
                                "hairdryer provided",
                                "shopping centres and parks.",
                                "hygienic sleep experience."
                            ]],
                            // 6
                            ["6785eda8415d2", [
                                "at the countertop.",
                                "elegance and practicality.",
                                "(guests to use their own credentials)",
                                "countertop seats 3",
                                "hairdryer provided",
                                "and Sunshine Plaza.",
                                "hygienic sleep experience."
                            ]],
                            // 7
                            ["6785e404b27d6", [
                                "internet throughout.",
                                "(guests to use own credentials)",
                                "seats 8 people",
                                "hairdryer provided",
                                "surrounding areas.",
                                "hygienic sleep experience."
                            ]],
                            // 8
                            ["674d2d98c7be2", [
                                "close to VIC Park.",
                                "conditioning available.",
                                "seats 4",
                                "and hairdryer provided",
                                "and surrounding areas.",
                                "hygienic sleep experience."
                            ]],
                            // 9 removed from the lists
                            ["674d0218b6b03", [
                                "Paradise just steps away.",
                                "(guests to use their own credentials)",
                                "area seats 4",
                                "hairdryer provided",
                                "Gold Coast attractions.",
                                "or rangehood"
                            ]],
                            // 10
                            ["67452363f1242", [
                                "comprehensive laundry facilities.",
                                "lounge area with TV",
                                "seats 12 people",
                                "hairdryer provided",
                                "and suburban areas.",
                                "hygienic sleep experience."
                            ]],
                            // 11
                            ["6743ffdd5dc66", [
                                "secure underground parking.",
                                "(guests to use their own credentials)",
                                "seats 4 + countertop seats 2",
                                "with washer and dryer",
                                "Gold Coast attractions.",
                                "hygienic sleep experience."
                            ]],
                            // 12
                            ["673d2915dd5c8", [
                                "moments surrounded by nature.",
                                "(guests to use their own credentials)",
                                "Kitchenette",
                                "seats 4 and countertop seats 3",
                                "hairdryer provided",
                                "Gold Coast city centre.",
                                "not the ocean."
                            ]],
                            // 13
                            ["673ac6d99f76c", [
                                "apartment? Book today.",
                                "(guests to use their own credentials)",
                                "countertop area sits 2 people",
                                "hairdryer provided",
                                "for more information.",
                                "hygienic sleep experience."
                            ]],
                            // 14
                            ["672ae817d30e8", [
                                "airflow throughout.",
                                "Gold Coast’s highlights.",
                                "(guests to use their own credentials)",
                                "area sits 2 people",
                                "hairdryer provided",
                                "website for more information.",
                                "There is no dryer"
                            ]],
                            // 15
                            ["672ae5f6a82fc", [
                                "and comfortable holiday.",
                                "free-to-air channels",
                                "countertop area seats 2 people",
                                "hairdryer provided",
                                "more information.",
                                "hygienic sleep experience."
                            ]],
                            // 16
                            ["67198cff520b4", [
                                "comfort, style, and convenience.",
                                "(guests to use their own credentials)",
                                "and the countertop area seats 1",
                                "and towels provided",
                                "for more information.",
                                "no hair dryer"
                            ]],
                            // 17
                            ["6710609c3fe6f", [
                                "memorable bayside escape.",
                                "(guests need to use their own credentials)",
                                "countertop area sits 5 people",
                                "hairdryer provided",
                                "more information.",
                                "decorative only"
                            ]],
                            // 18
                            ["66d8f80816e01", [
                                "Gold Coast from this lovely home.",
                                "(guests to use their own credentials)",
                                "sits 4 people",
                                "hairdryer provided",
                                "more information.",
                                "hygienic sleep experience."
                            ]],
                            // 19
                            ["66c6b39cbecea", [
                                "perfect Gold Coast escape.",
                                "(guests to use their own credentials)",
                                "area sits 4 people",
                                "hairdryer provided",
                                "more information.",
                                "hygienic sleep experience."
                            ]],
                            // 20
                            ["6646de20e30b8", [
                                "This is the place for you.",
                                "and streaming apps available",
                                "countertop area sits 3 people",
                                "hairdryer provided",
                                "more information.",
                                "hygienic sleep experience."
                            ]],
                            // 21
                            ["67b570571b049", [
                                "cafes, shops, and coastal charm.",
                                "with an electric stovetop and oven.",
                                "amenities provided.",
                                "parking in the driveway.",
                                "and the best of the Sunshine Coast.",
                                "free-to-air and streaming services (guests to use their own credentials)",
                                "area seats 6",
                                "towels, and hairdryer provided",
                                "Wi-Fi available",
                                "provides routes to Brisbane.",
                                "additional fees apply.",
                                "fresh and hygienic sleep experience.",
                                "do not wear any shoes inside the property",
                                "Council Rangers or Police.",
                                "additional cleaning fee of $200.",
                                "unintentional items left behind."
                            ]],
                            // 22
                            ["67bbb8380fb35", [
                                "this beautiful beachside retreat is ready to welcome you.",
                                "Smart TV with streaming services (guests to use their own credentials)",
                                "Countertop seats 2",
                                "essentials, towels, and hairdryer provided",
                                "allowed (additional cleaning fees apply)",
                                "Surfers Paradise, Southport, and Robina.",
                                "and hygienic sleep experience.",
                                "do not wear any shoes inside the property",
                                "Council Rangers or Police.",
                                "cleaning fee of $200.",
                                "unintentional items left behind."
                            ]],
                            // 23
                            ["67b822cfaef52", [
                                "and hassle-free stay.",
                                "(guests to use their own credentials)",
                                "area seats 12 and the countertop seats 2",
                                "essentials, towels, and hairdryer provided",
                                "friendly (additional costs apply)",
                                "services to Brisbane and the Gold Coast.",
                                "and hygienic sleep experience.",
                                "any shoes inside the property",
                                "Council Rangers or Police.",
                                "cleaning fee of $200.",
                                "unintentional items left behind."
                            ]],
                            //24
                            ["67d1084aac477",[
                                "families and travellers alike.",
                                "(guests to use their own credentials)",
                                "area seats 3",
                                "towels and hairdryer provided",
                                "outdoor seating area",
                                "and Gold Coast Airport.",
                                "the property from the street entrance.",
                                "ensuring a fresh and hygienic sleep experience.",
                                "your surrounding neighbours.",
                                "Council Rangers or Police.",
                            ]],
                            //25
                            ["67c7cc4ccc7c5",[
                                "dining table and additional countertop seating.",
                                "private laundry with a washer and dryer for convenience.",
                                "this home is as practical as it is stylish.",
                                "(guests to use their own credentials)",
                                "area seats 14 and countertop seats 4",
                                "towels, and hairdryer provided",
                                "direct routes to Brisbane CBD, South Bank, and Fortitude Valley.",
                                "Any violations will result in immediate eviction",
                                "ensuring a fresh and hygienic sleep experience.",
                                "ask you to respect the community and your surrounding neighbours.",
                                "the Building Manager, Council Rangers or Police.",
                            ]],
                            //26
                            ["67e3a5e9c3887",[
                                "and split system A/C for restful nights.",
                                "This Hamilton home offers everything for a stylish yet functional stay.",
                                "Free-to-Air and streaming access (guests to use their own credentials)",
                                "Dining area seats 6",
                                "Travel essentials, towels and hairdryer provided",
                                "The fireplace is for decoration purposes only",
                                "Nearby Doomben Station offers regular train services.",
                                "Other things",
                                "Stairs inside and outside the property",
                                "ensuring a fresh and hygienic sleep experience.",
                                "do not wear any shoes inside the property",
                                "the Building Manager, Council Rangers or Police.",
                                "Any stays with pets will incur an additional cleaning fee of $200.",
                                "before departing to avoid any unintentional items left behind.",
                            ]],
                            //27
                            ["67eb633ecdca7",[
                                "this seaside escape offers both comfort and convenience.",
                                "Dining area seats 4",
                                "and hairdryer provided",
                                "is Landsborough Station (approx. 20 min drive).",
                                "and hygienic sleep experience.",
                                "surrounding neighbours.",
                                "Council Rangers or Police.",
                            ]],
                            //28
                            ["67e0d0919a686",[
                                "The apartment also offers access to a private outdoor space with seating, perfect for unwinding.",
                                "TV with Free-to-Air and streaming (guests to use their own credentials)",
                                "Dining area seats 4",
                                "Travel essentials, towels, and hairdryer provided",
                                "The South Brisbane railway station is a short 10-minute walk away.",
                                "and hygienic sleep experience.",
                                "we kindly ask you to respect the community and your surrounding neighbours.",
                                "Council Rangers or Police.",
                            ]],
                            //29
                            ["67dcd077aea9e",[
                                "this unique apartment is perfect for travellers seeking an architectural gem in a lively neighbourhood.",
                                "TV with Free-to-Air and streaming access (guests to use their own credentials)",
                                "Dining area seats 4 and countertop seats 4",
                                "Travel essentials, towels and hairdryer provided",
                                "Teneriffe Ferry Terminal is a 5-min walk away.",
                                "we kindly ask you to respect the community and your surrounding neighbours.",
                                "the Building Manager, Council Rangers or Police.",
                            ]],
                        ]);
                
                        let formattedSpace = propertySpace;
                        let formattedGettingAround = propertyGettingAround;
                        let formattedNotes = propertyNotes;
                        let formattedhouseRules = houseRules;
                
                        // Apply line breaks for specific property breakpoints
                        if (propertyId && propertyBreakpoints.has(propertyId)) {
                            const breakpoints = propertyBreakpoints.get(propertyId);
                
                            breakpoints.forEach(breakpoint => {
                                const escapedBreakpoint = breakpoint.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
                
                                // Use regex to replace all occurrences safely
                                const regex = new RegExp(escapedBreakpoint, "g");
                                formattedSpace = formattedSpace.replace(regex, `${breakpoint}<br><br>`);
                                formattedGettingAround = formattedGettingAround.replace(regex, `${breakpoint}<br><br>`);
                                formattedNotes = formattedNotes.replace(regex, `${breakpoint}<br><br>`);
                                formattedhouseRules = formattedhouseRules.replace(regex, `${breakpoint}<br><br>`);
                            });
                        }
                
                        // Exclude certain compound words from hyphen logic
                        const exceptions = ["free-to-air", "in-unit", "well-rounded", "Wi-Fi", "well-appointed", "1-bedroom", "open-plan", "2-seater", "4-bedroom", "2.5-bathroom", "en-suite", "Free-to-Air", "2-bedroom", "2-bathroom", "4-seater", "hassle-free", "home-cooked", "queen-sized", "wind-down", "On-street", "single-level", "flat-screen", "six-seater", "high-speed", "on-site", "six-seat", "set-up", "3-bathroom", "5-seater", "streaming-enabled", "air-conditioning", "Walk-in", "3-bed", "2-bath", "walk-in", "year-round", "2-bed", "1-bath", "well-located", "budget-friendly", "medium-sized", "4-bed", "3-bath", "cottage-style", "king-sized", "1-bed", "well-equipped", "5-bed", "Brand-new", "private-balcony", "5-min", "spa-like", "wall-mounted", "well-maintained"];
                
                        //formattedSpace
                        formattedSpace = formattedSpace.replace(/\b([^\s]+)-([^\s]+)\b/g, (match, part1, part2) => {
                            const fullWord = `${part1}-${part2}`;
                            
                            // If it's in the exceptions list, keep it unchanged
                            if (exceptions.includes(fullWord)) {
                                return fullWord;
                            }
                        });
                        
                        // 1️⃣ Case: Space before the hyphen → Add line break before
                        formattedSpace = formattedSpace.replace(/(\s)-([^\s]+)/g, (match, spaceBefore, part2) => {
                            return `${spaceBefore}<br>- ${part2}`;
                        });

                        // 2️⃣ Case: Space after the hyphen → Move hyphen to a new line before it
                        formattedSpace = formattedSpace.replace(/([^\s]+) -(\s?)/g, (match, part1, spaceAfter) => {
                            return `${part1} <br>- ${spaceAfter}`;
                        });

                        // 3️⃣ Case: Space before AND after the hyphen → Add line break before the hyphen only
                        formattedSpace = formattedSpace.replace(/(\s)- (\s)/g, (match, spaceBefore, spaceAfter) => {
                            return `${spaceBefore}<br>- ${spaceAfter}`;
                        });

                        // 4️⃣ **NEW FIX**: Hyphens at the start of a new line → Force `<br>` before them
                        formattedSpace = formattedSpace.replace(/\n\s*-\s*/g, "<br>- ");

                        // formattedNotes
                        formattedNotes = formattedNotes.replace(/\b([^\s]+)-([^\s]+)\b/g, (match, part1, part2) => {
                            const fullWord = `${part1}-${part2}`;
                            
                            // If it's in the exceptions list, keep it unchanged
                            if (exceptions.includes(fullWord)) {
                                return fullWord;
                            }
                        });
                        
                        // 1️⃣ Case: Space before the hyphen → Add line break before
                        formattedNotes = formattedNotes.replace(/(\s)-([^\s]+)/g, (match, spaceBefore, part2) => {
                            return `${spaceBefore}<br>- ${part2}`;
                        });

                        // 2️⃣ Case: Space after the hyphen → Move hyphen to a new line before it
                        formattedNotes = formattedNotes.replace(/([^\s]+) -(\s?)/g, (match, part1, spaceAfter) => {
                            return `${part1} <br>- ${spaceAfter}`;
                        });

                        // 3️⃣ Case: Space before AND after the hyphen → Add line break before the hyphen only
                        formattedNotes = formattedNotes.replace(/(\s)- (\s)/g, (match, spaceBefore, spaceAfter) => {
                            return `${spaceBefore}<br>- ${spaceAfter}`;
                        });

                        // 4️⃣ **NEW FIX**: Hyphens at the start of a new line → Force `<br>` before them
                        formattedNotes = formattedNotes.replace(/\n\s*-\s*/g, "<br>- ");

                        //formattedhouseRules
                        formattedhouseRules = formattedhouseRules.replace(/\b([^\s]+)-([^\s]+)\b/g, (match, part1, part2) => {
                            const fullWord = `${part1}-${part2}`;
                            
                            // If it's in the exceptions list, keep it unchanged
                            if (exceptions.includes(fullWord)) {
                                return fullWord;
                            }
                        });
                        
                        // 1️⃣ Case: Space before the hyphen → Add line break before
                        formattedhouseRules = formattedhouseRules.replace(/(\s)-([^\s]+)/g, (match, spaceBefore, part2) => {
                            return `${spaceBefore}<br>- ${part2}`;
                        });

                        // 2️⃣ Case: Space after the hyphen → Move hyphen to a new line before it
                        formattedhouseRules = formattedhouseRules.replace(/([^\s]+) -(\s?)/g, (match, part1, spaceAfter) => {
                            return `${part1} <br>- ${spaceAfter}`;
                        });

                        // 3️⃣ Case: Space before AND after the hyphen → Add line break before the hyphen only
                        formattedhouseRules = formattedhouseRules.replace(/(\s)- (\s)/g, (match, spaceBefore, spaceAfter) => {
                            return `${spaceBefore}<br>- ${spaceAfter}`;
                        });

                        // 4️⃣ **NEW FIX**: Hyphens at the start of a new line → Force `<br>` before them
                        formattedhouseRules = formattedhouseRules.replace(/\n\s*-\s*/g, "<br>- ");
                
                        document.getElementById("div-description").innerHTML = `
                            <p>${propertySummary}</p>
                        `;

                        document.getElementById("div-the-space").innerHTML = `
                            <h5 class="space-heading">The Space</h5>
                            <p id="space-short">${formattedSpace.substring(0, 200)}...</p>
                            <p id="space-full" style="display: none;">${formattedSpace}</p>
                            <button id="toggle-space" class="read-more">Read More about the space &#x25BC;</button>
                        `;

                        document.getElementById("div-guestAccess").innerHTML = `
                            <h5 class="guest-access">Guest Access</h5>
                            <p>${propertyGuestAccess}</p>
                        `;

                        document.getElementById("div-localArea").innerHTML = `
                            <h5 class="local-area">Local area description</h5>
                            <p>${propertyLocalArea}</p>
                        `;

                        document.getElementById("div-getting-around").innerHTML = `
                            <h5 class="getting-around">Getting around</h5>
                            <p>${formattedGettingAround}</p>
                        `;

                        document.getElementById("div-notes").innerHTML = `
                            <h5 class="notes">Other things</h5>
                            <p>${formattedNotes}</p>
                        `;

                        document.getElementById("div-house-rules").innerHTML = `
                            <h5 class="house-rules-heading">House Rules</h5>
                            <p id="house-rules-short">${formattedhouseRules.substring(0, 200)}...</p>
                            <p id="house-rules-full" style="display: none;">${formattedhouseRules}</p>
                            <button id="toggle-house-rules" class="read-more-house-rules">Read More about the house rules &#x25BC;</button>
                        `;

                        document.getElementById("div-cancellation").innerHTML = `
                            <div class="accordion-container">
                                <h5 class="cancellation-heading">Cancellation Policy</h5>
                                <h5 class="cancellation-heading">Free cancellation up to 48 hours before check-in (conditions apply)</h5>
                                
                                <div class="accordion-item">
                                    <button class="accordion-header" id="toggle-cancellation-rules">
                                        View cancellation and refund policy 
                                        <span class="accordion-icon">▼</span>
                                    </button>
                                    
                                    <div class="accordion-content" id="cancellation-full" style="display: none;">
                                        <ul>
                                            <li class="ul-cancellation">Cancellation up to 48 hours before check-in will receive a refund of 100% minus 3% card processing fee</li>
                                            <li class="ul-cancellation">Cancellation within 48 hours of check-in will receive a refund of 50% minus 10% service fee of the total booking value</li>
                                        </ul>
                                        
                                        <h5 class="cancellation-heading">For any booking of 30 days or more</h5>
                                        <ul>
                                            <li class="ul-cancellation">Cancellation up to 14 days before check-in date will receive a refund of 100% minus 3% card processing fee</li>
                                            <li class="ul-cancellation">Cancellation within 14 days of check-in will receive a full refund minus one week of rent and 10% service fee</li>
                                            <li class="ul-cancellation">If you cancel after your stay has started or you alter your booking midway through, the remaining nights in the reservation are non-refundable. If you have more than 30 nights left in your reservation, only the next 30 nights are non-refundable (the refund of the remaining nights will be subject to 10% service fee deduction)</li>
                                        </ul>
                                    </div>
                                </div>

                                <br>

                                <h5 class="cancellation-heading">Safety of our Guests</h5>
                                <p>When you stay at a MadeComfy, you'll have the convenience of self check-in and space to relax in an entire house or apartment with amenities such as fast wi-fi to stay productive, a kitchen and private laundry facilities. The health and safety of our guests is our paramount priority, which is why our housekeeping teams undertake stringent cleaning to ensure all surfaces are thoroughly disinfected between each stay.</p>
                            </div>
                        `;

                        // ✅ Attach event listener space
                        document.getElementById("toggle-space").addEventListener("click", function () {
                            const shortText = document.getElementById("space-short");
                            const fullText = document.getElementById("space-full");
                            const toggleButton = document.getElementById("toggle-space");

                            if (fullText.style.display === "none") {
                                fullText.style.display = "block";
                                shortText.style.display = "none";
                                toggleButton.innerHTML = 'Read Less about the space &#x25B2;';
                            } else {
                                fullText.style.display = "none";
                                shortText.style.display = "block";
                                toggleButton.innerHTML = 'Read More about the space &#x25BC;';
                            }
                        });

                        // ✅ Attach event listener house rules
                        document.getElementById("toggle-house-rules").addEventListener("click", function () {
                            const shortText = document.getElementById("house-rules-short");
                            const fullText = document.getElementById("house-rules-full");
                            const toggleButton = document.getElementById("toggle-house-rules");

                            if (fullText.style.display === "none") {
                                fullText.style.display = "block";
                                shortText.style.display = "none";
                                toggleButton.innerHTML = 'Read Less about the house rules &#x25B2;';
                            } else {
                                fullText.style.display = "none";
                                shortText.style.display = "block";
                                toggleButton.innerHTML = 'Read More about the house rules &#x25BC;';
                            }
                        });

                        // ✅ Attach event listener cancellation rules
                        document.getElementById("toggle-cancellation-rules").addEventListener("click", function() {
                            const content = document.getElementById("cancellation-full");
                            const icon = this.querySelector(".accordion-icon");
                            
                            if (content.style.display === "none" || content.style.display === "") {
                                content.style.display = "block";
                                icon.textContent = "▲";
                                this.classList.add("active");
                            } else {
                                content.style.display = "none";
                                icon.textContent = "▼";
                                this.classList.remove("active");
                            }
                        });
                    }
                
                    //amenities
                    if (data && data.amenities) {
                        const amenityNames = data.amenities.map(amenity => amenity.name);
                        // console.log("Amenity Names:", amenityNames);
                    
                        const maxVisible = 8;
                        let isExpanded = false; // Track the state of amenities display
                    
                        // Function to generate amenity items
                        const generateAmenitiesHTML = () => {
                            const displayedAmenities = isExpanded ? amenityNames : amenityNames.slice(0, maxVisible);
                            return `
                                <h5 class="amenities-title">Amenities</h5>
                                <div class="amenities-grid">
                                    ${displayedAmenities.map(name => `<div class="amenity-item">${name}</div>`).join('')}
                                </div>
                                ${amenityNames.length > maxVisible ? `<button id="toggle-amenities" class="show-more-btn">${isExpanded ? 'Show Less Amenities ▲' : 'Show More Amenities ▼'}</button>` : ''}
                            `;
                        };
                    
                        // Function to update the amenities section
                        const updateAmenities = () => {
                            document.getElementById("div-amenities").innerHTML = generateAmenitiesHTML();
                            document.getElementById("toggle-amenities")?.addEventListener("click", () => {
                                isExpanded = !isExpanded; // Toggle the state
                                updateAmenities(); // Re-render
                            });
                        };
                    
                        // Initial rendering
                        updateAmenities();
                    }   
                    
                    //sleeping arrangements and availability
                    if (data && sleepingArrangements) {
                        // console.log("Sleeping Arrangements:", sleepingArrangements);
                    
                        const roomsContainer = document.getElementById("div-sleeping-arrangement");
                    
                        if (!roomsContainer) {
                            // console.error("Error: #div-sleeping-arrangement not found in the DOM.");
                            return;
                        }
                    
                        let html = `<h5 class="sleeping-header">Sleeping arrangements</h5><div class="room-grid">`;
                    
                        sleepingArrangements.forEach((room, index) => {
                            let roomTitle = `${room.roomType.charAt(0).toUpperCase() + room.roomType.slice(1)} ${index + 1}`;
                    
                            // Group beds by type and count them
                            let bedCount = {};
                            room.beds.forEach(bed => {
                                bedCount[bed.bedType] = (bedCount[bed.bedType] || 0) + 1;
                            });
                    
                            // Convert grouped beds to readable format (e.g., "2 single, 1 queen")
                            let bedInfo = Object.entries(bedCount)
                                .map(([bedType, count]) => `${count} ${bedType}`)
                                .join(", ");
                    
                            html += `
                                <div class="room-card">
                                    <h6 class="sleeping-title">${roomTitle}</h6>
                                    <p class="sleeping-info">${bedInfo}</p>
                                </div>
                            `;
                        });
                    
                        html += `</div>`;
                        roomsContainer.innerHTML = html;
                    }

                    //maps section
                    // Store coordinates globally after fetching
                    if (data && data.latitude && data.longitude) {
                        window.myApps.latitude = data.latitude || window.myApps.latitude; // Fallback
                        window.myApps.longitude = data.longitude || window.myApps.longitude; //Fallback
    
                        console.log("Updated coords - Lat:", data.latitude, "Lng:", data.longitude);
                        window.phase2InitMap(); // Re-render map with new coords
                    }
                } else {
                    // Clear the page content
                    document.body.innerHTML = '';

                    // Display error message
                    document.body.innerHTML = `
                        <div style="text-align: center; padding: 50px;">
                            <h2 style="color: red;">Error: Unable to load property details</h2>
                            <p>Please try again later or contact support.</p>
                        </div>
                    `;
                }
            })
            .catch(error => {
                // console.error('Error fetching property details:', error);
                document.querySelector('.parent').innerHTML = "<p>Failed to load property images.</p>";
                // Trigger with fallback coords
                window.phase2InitMap();
            });
    }
    
    function openImageGallery(photos) {
        const overlay = document.createElement('div');
        overlay.classList.add('image-gallery-overlay');
    
        const modal = document.createElement('div');
        modal.classList.add('image-gallery-modal');
    
        const closeButton = document.createElement('span');
        closeButton.classList.add('gallery-close-button');
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', closeImageGallery);
    
        let currentImageIndex = 0;
        const image = document.createElement('img');
        image.classList.add('gallery-image');
        image.src = photos[currentImageIndex].url;
        image.alt = `Property Image ${currentImageIndex + 1}`;
    
        const arrowLeft = document.createElement('button');
        arrowLeft.classList.add('gallery-arrow', 'gallery-arrow-left');
        arrowLeft.innerHTML = '&#10094;';
        arrowLeft.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + photos.length) % photos.length;
            updateGallery();
        });
    
        const arrowRight = document.createElement('button');
        arrowRight.classList.add('gallery-arrow', 'gallery-arrow-right');
        arrowRight.innerHTML = '&#10095;';
        arrowRight.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % photos.length;
            updateGallery();
        });
    
        const dotsContainer = document.createElement('div');
        dotsContainer.classList.add('gallery-dots');
        const dots = [];
    
        for (let i = 0; i < photos.length; i++) {
            const dot = document.createElement('div');
            dot.classList.add('gallery-dot');
            dot.addEventListener('click', () => goToImage(i));
            dotsContainer.appendChild(dot);
            dots.push(dot);
        }
    
        function updateGallery() {
            image.src = photos[currentImageIndex].url;
            image.alt = `Property Image ${currentImageIndex + 1}`;
            dots.forEach((dot, index) => dot.classList.toggle('active', index === currentImageIndex));
        }
    
        function goToImage(index) {
            currentImageIndex = index;
            updateGallery();
        }
    
        modal.appendChild(closeButton);
        modal.appendChild(image);
        modal.appendChild(arrowLeft);
        modal.appendChild(arrowRight);
        modal.appendChild(dotsContainer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        updateGallery();
        overlay.style.display = 'flex';
    }
    
    function closeImageGallery() {
        const overlay = document.querySelector('.image-gallery-overlay');
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }

    window.phase2InitMap();
});

