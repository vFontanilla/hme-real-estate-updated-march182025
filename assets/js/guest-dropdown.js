jQuery(document).ready(function ($) {
    let adultCount = 1;
    let childCount = 0;

    function adjustDropdownWidth() {
        let inputWidth = $(".wrapperlocation2").outerWidth();
        $(".guest-dropdown").css("width", inputWidth + "px");
    }

    // Run width adjustment on load
    adjustDropdownWidth();

    // Show dropdown on input click
    $("#guests").on("click touchstart", function (event) {
        $(".guest-dropdown").slideToggle(200);
        adjustDropdownWidth();
        event.stopPropagation();
    });

    // Close dropdown when clicking outside
    $(document).click(function (event) {
        if (!$(event.target).closest(".guest-dropdown, #guests").length) {
            $(".guest-dropdown").slideUp(200);
        }
    });

    // Adjust dropdown width on window resize
    $(window).resize(adjustDropdownWidth);

    // Increase or decrease count
    $(".counter button").click(function () {
        let type = $(this).data("type");
    
        if (type === "adults") {
            if ($(this).hasClass("plus")) adultCount++;
            if ($(this).hasClass("minus") && adultCount > 1) adultCount--;
            $("#adult-count").text(adultCount);
        }
    
        if (type === "children") {
            if ($(this).hasClass("plus")) childCount++;
            if ($(this).hasClass("minus") && childCount > 0) childCount--;
            $("#child-count").text(childCount);
        }
    
        // ✅ Update input value and remove "Guests"
        let totalGuests = adultCount + childCount;
        $("#guests").val(`${totalGuests} Guests`).data("numeric-value", totalGuests).attr("value", totalGuests); 
    });
});
