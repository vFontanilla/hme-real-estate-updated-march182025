jQuery(document).ready(function ($) {

    //initialization
    var apiUrl = 'https://api.madecomfy.com.au/api/v4/properties';
    var apiParams = {
        // 'partnerId': "66d1080aa56e4",
        'page[size]': 20,
        'page[number]': 1
    };

    // Function to load properties based on page and view type
    function loadProperties(pageNumber, viewType) {
        $('#loading-spinner').show();
        apiParams['page[number]'] = pageNumber;

        $.ajax({
            url: apiUrl,
            method: 'GET',
            data: apiParams,
            success: function (response) {
                console.log("Raw API Response:", response);

                // Store response in a variable
                var apiResponse = response;

                // Convert response to JSON and store in localStorage
                localStorage.setItem('apiResponse', JSON.stringify(apiResponse));

                // console.log("JSON Format:", localStorage);

                var totalcount = response.count || 0;
                var totalPages = Math.ceil(totalcount / apiParams['page[size]']); // Calculate total pages
                // console.log("Total Count:", totalcount);

                $('#property-count').text(`${totalcount} properties`);

                if (response.properties && Array.isArray(response.properties) && response.properties.length > 0) {

                    // Render properties after bounding box is applied
                    renderProperties(response, viewType);

                    // Update pagination
                    updatePagination(pageNumber, totalPages);
                } else {
                    // console.log("Properties array is missing or empty in the response.");
                    $('.property-cards-container').html('<p>No properties found or there was an error fetching data. Please try again later.</p>');
                }
            },
            error: function (xhr, status, error) {
                // console.error('API Error:', error, "Response:", xhr.responseText);
    
                let errorMsg = "There was an error fetching the properties.";
                
                if (xhr.status === 500) {
                    errorMsg = "Server error. Please try again later.";
                } else if (xhr.status === 404) {
                    errorMsg = "No properties found for this search.";
                }

                $('.property-cards-container').html(`<p>${errorMsg}</p>`);
            },
            complete: function () {
                // Hide spinner after the request completes
                $('#loading-spinner').hide();
            }
        });
    }

    function renderGridCard(property, url) {
        const { name, propertyType, segment, location, minimumNightlyRate, guests, bedrooms, bathrooms} = property;
        const Amenity1 = (property.amenities && property.amenities.length > 0) ? property.amenities[0].name : 'No amenity available';
        const Amenity2 = (property.amenities && property.amenities.length > 1) ? property.amenities[1].name : 'No amenity available';
        const Amenity3 = (property.amenities && property.amenities.length > 2) ? property.amenities[2].name : 'No amenity available';
        const imageUrl = property.photos?.[0]?.url || 'default_image_path.jpg';

        const imageOpt = imageUrl;
        const webpUrl = imageOpt.replace(".jpg", ".webp");

        const segmentBadge = segment ? `<span class="segment-badge">${segment}</span>` : '';

        return `
            <a id="property-link" href="${url}" class="property-tag" target="_blank" data-property-id="${property.id}">
                <div class="property-card">
                    <div class="card">
                        <picture>
                            <source data-srcset="${webpUrl}" type="image/webp">
                            <img class="card-img-top lazyload" data-src="${imageOpt}" alt="${name}">
                        </picture>
                        <div class="card-body">
                            <div>
                                <h5 class="card-title">
                                    ${propertyType}
                                    ${segmentBadge}
                                </h5>
                            </div>
                            <div class="card-text">
                                <h4>${name}</h4>
                            </div>
                            <div>
                                <p class="location-pin-text">${location}</p>
                            </div>
                            <div class="price-info">From A$${(minimumNightlyRate / 100)} <span>/night</span></div>
                            <div class="card-footer">
                                <ul class="details">
                                    <li>${guests} Guests</li>
                                    <li>${bedrooms} Bedrooms</li>
                                    <li>${bathrooms} Bathroom</li>
                                </ul>
                                <ul class="amenities">
                                    <li>${Amenity1}</li>
                                    <li>${Amenity2}</li>
                                    <li>${Amenity3}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        `;
    }

    function renderMapCard(property, url) {
        const { name, propertyType, segment, location, minimumNightlyRate, guests, bedrooms, bathrooms } = property;
        const Amenity1 = (property.amenities && property.amenities.length > 0) ? property.amenities[0].name : 'No amenity available';
        const Amenity2 = (property.amenities && property.amenities.length > 1) ? property.amenities[1].name : 'No amenity available';
        const Amenity3 = (property.amenities && property.amenities.length > 2) ? property.amenities[2].name : 'No amenity available';
        const imageCarousel = property.photos && property.photos.length > 0
            ? property.photos.map((photo, index) => `
                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                    <img class="d-flex w-100" src="${photo.url}" alt="Property Image ${index + 1}">
                </div>
            `).join('')
            : '';

        const segmentBadge = segment ? `<span class="segment-badge">${segment}</span>` : '';

        return `
            <a id="property-link" href="${url}" class="property-tag" target="_blank" data-property-id="${property.id}">
                <div class="property-cardss">
                    <div class="card d-flex flex-column flex-md-row flex-sm-column">
                        <div id="carousel-${property.id}" class="carousel slide property-carousel flex-shrink-0" data-bs-ride="carousel">
                            <div class="carousel-inner">${imageCarousel}</div>
                            
                            
                        </div>
                        <div class="card-body property-details flex-grow-1">
                            <div>
                                <h5 class="card-title">
                                    ${propertyType}
                                    ${segmentBadge}
                                </h5>
                            </div>
                            <div class="card-text">
                                <h4>${name}</h4>
                            </div>
                            <div>
                                <p class="location-pin-text">${location}</p>
                            </div>
                            <div class="price-info">From A$${(minimumNightlyRate / 100)} <span>/night</span></div>
                            <div class="card-footer">
                                <ul class="details">
                                    <li>${guests} Guests</li>
                                    <li>${bedrooms} Bedrooms</li>
                                    <li>${bathrooms} Bathroom</li>
                                </ul>
                                <ul class="amenities">
                                    <li>${Amenity1}</li>
                                    <li>${Amenity2}</li>
                                    <li>${Amenity3}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        `;
    }

    // Function to render properties in grid or map view
    function renderProperties(response, viewType) {
        let resultsHtml = '';
        $('.property-tag').off("mouseenter mouseleave");
        markers.forEach(markerObj => markerObj.marker.setMap(null));
        markers = []; 

        response.properties.forEach(property => {

            let url = `/property-detail?property_id=${property.id}`;

            let price = (property.minimumNightlyRate / 100) || 'N/A';
            
            if(viewType === 'grid') {
                console.log('Clicked Grid');
                // Build the HTML for each property
                resultsHtml += renderGridCard(property, url);

                $('.property-cards-container').html(resultsHtml).removeClass('hidden').addClass('visible');
            } else if (viewType === 'map') {
                console.log('Clicked Map');
                // Build the HTML for each property
                resultsHtml += renderMapCard(property, url);

                const priceTag = document.createElement("div");
                      priceTag.className = "price-tag";
                      priceTag.textContent = `A$${price}`;

                if (typeof AdvancedMarkerElement !== "undefined") {
                    const marker = new AdvancedMarkerElement({
                        map,
                        position: { lat: property.latitude, lng: property.longitude },
                        content: priceTag, 
                    });
    
                    markers.push({ marker: marker, propertyId: property.id, price: price });
                } else {
                    console.error("AdvancedMarkerElement is not available. Check if the 'marker' library is loaded.");
                }

                $('.property-cards-container2').html(resultsHtml).removeClass('hidden').addClass('visible');
            }
        });

        setTimeout(() => initializeLazyLoading(), 500);
        setTimeout(() => addHoverEffects(), 1000);
    }

    function addHoverEffects() {
        $(".property-tag").off("mouseenter mouseleave").on("mouseenter", function () { 
            const propertyId = $(this).data("property-id");
            const markerObj = markers.find(m => m.propertyId === propertyId);
            if (markerObj) {
                markerObj.marker.content.style.backgroundColor = "#FF5733"; // 🔹 Fix: Change color on hover
                markerObj.marker.content.style.color = "#FFFFFF";
                markerObj.marker.zIndex = 999;
            }
        }).on("mouseleave", function () {
            const propertyId = $(this).data("property-id");
            const markerObj = markers.find(m => m.propertyId === propertyId);
            if (markerObj) {
                markerObj.marker.content.style.backgroundColor = ""; // 🔹 Fix: Reset color on leave
                markerObj.marker.content.style.color = "";
                markerObj.marker.zIndex = 1;
            }
        });
    }

    // Function to update the pagination dynamically
    function updatePagination(currentPage, totalPages) {
        let paginationHtml = '';
        let maxPagesToShow = 3;

        paginationHtml += currentPage > 1 
            ? `<li class="page-item"><a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a></li>` 
            : `<li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>`;

        let startPage = Math.max(1, currentPage - 1);
        let endPage = Math.min(totalPages, currentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
            paginationHtml += currentPage === i 
                ? `<li class="page-item active"><a class="page-link" href="#">${i}</a></li>` 
                : `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        }

        paginationHtml += currentPage < totalPages 
            ? `<li class="page-item"><a class="page-link" href="#" data-page="${currentPage + 1}">Next</a></li>` 
            : `<li class="page-item disabled"><a class="page-link" href="#">Next</a></li>`;

        $('.pagination').html(paginationHtml);
    }

    function initializeLazyLoading() {
        let lazyImages = [].slice.call(document.querySelectorAll("img.lazyload"));
    
        if ("IntersectionObserver" in window) {
            let lazyImageObserver = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        let lazyImage = entry.target;
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.classList.remove("lazyload");
                        lazyImageObserver.unobserve(lazyImage);
                    }
                });
            });
            lazyImages.forEach(function (lazyImage) {
                lazyImageObserver.observe(lazyImage);
            });
        } else {
            lazyImages.forEach(function (lazyImage) {
                lazyImage.src = lazyImage.dataset.src;
            });
        }
    }

    // Trigger loading properties when grid button is clicked
    $('#grid-view-btn').click(function() {
        var viewType = 'grid';
        setActiveButton(this);
        
        // Hide map view and show grid view with smooth transition
        $('.map-view-containerz').removeClass('visible').addClass('hidden');
        $('.property-cards-container').removeClass('hidden').addClass('visible');
        
        // Load properties for the grid view
        loadProperties(apiParams['page[number]'], viewType);
    });

    // Trigger loading properties when map button is clicked
    $('#map-view-btn').click(function() {
        var viewType = 'map';
        setActiveButton(this);
        
        // Hide grid view and show map view with smooth transition
        $('.property-cards-container').removeClass('visible').addClass('hidden');
        $('.map-view-containerz').removeClass('hidden').addClass('visible');
        loadProperties(apiParams['page[number]'], viewType);
    });

    $('#grid-view-btn, #map-view-btn').click(function() {
        if ($(this).hasClass('disabled')) return;
        $(this).addClass('disabled');
    
        let viewType = $(this).attr('id') === 'grid-view-btn' ? 'grid' : 'map';
        loadProperties(apiParams['page[number]'], viewType);
    
        setTimeout(() => $(this).removeClass('disabled'), 1000);
    });

    let map;
    let markers = [];
    let AdvancedMarkerElement;

    window.initMap = async function() {
        console.log("Google Maps Initialized");
        // Ensure the #map element exists BEFORE using it
        let mapElement = document.getElementById("map");
        if (!mapElement) {
            console.error("Map container not found! Check your HTML.");
            return;
        }

        // ✅ Check if Google Maps & Marker Library are loaded
        if (typeof google === "undefined" || !google.maps || !google.maps.marker) {
            console.error("Google Maps API or Marker Library not loaded.");
            return;
        }

        // ✅ Define Key Locations
        const brisbane = { lat: -27.46778, lng: 153.02806 }; // Center
        const sunshineCoast = { lat: -26.6500, lng: 153.0667 };
        const goldCoast = { lat: -28.0167, lng: 153.4000 };

        // ✅ Initialize Google Map
        map = new google.maps.Map(mapElement, {
            center: brisbane,
            zoom: 9,
            mapId: "4504f8b37365c3d0", // Optional
        });

        console.log("Google Maps Loaded:", map);

        try {
            // ✅ Store AdvancedMarkerElement globally
            const markerLib = await google.maps.importLibrary("marker");
            AdvancedMarkerElement = markerLib.AdvancedMarkerElement;
    
            console.log("AdvancedMarkerElement Loaded:", AdvancedMarkerElement);
        } catch (error) {
            console.error("Error loading AdvancedMarkerElement:", error);
        }

        // ✅ Adjust Map Bounds to Fit All Three Locations
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(sunshineCoast);
        bounds.extend(goldCoast);
        bounds.extend(brisbane);
        map.fitBounds(bounds);

        // ✅ Optional: Ensure Zoom is not too far
        google.maps.event.addListenerOnce(map, "bounds_changed", function () {
            if (map.getZoom() > 10) {
                map.setZoom(10); // Prevents excessive zooming in
            }
        });

        // ✅ Initialize Autocomplete (if needed)
        if (typeof initAutocomplete === "function") {
            initAutocomplete();
        } else {
            console.warn("initAutocomplete function not found.");
        }
    };

    $(document).on('click', '.pagination .page-link', function (e) {
        e.preventDefault();
        var pageNumber = $(this).data('page');
        if (pageNumber) {
            var viewType = $('#grid-view-btn').hasClass('active') ? 'grid' : 'map';
            loadProperties(pageNumber, viewType);
        }
    });

    // Function to handle the active button effect
    function setActiveButton(button) {
        // Remove 'active' class from both buttons
        $('#grid-view-btn').removeClass('active');
        $('#map-view-btn').removeClass('active');
        // Add 'active' class to the clicked button
        $(button).addClass('active');
    }   

    $('#grid-view-btn').addClass('active');
    loadProperties(apiParams['page[number]'], 'grid');
    
    initMap();
    console.log("Init map na agyan gd ya");
});