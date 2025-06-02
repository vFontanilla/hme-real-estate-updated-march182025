<?php
/*
Plugin Name: Real Estate Listings
Description: A simple plugin to add a styled search box via shortcode for Elementor or other pages.
Version: 3.0
Author: Wingman Group
*/

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Enqueue Bootstrap and other assets
function csb_enqueue_assets() {
    // Define styles and scripts in arrays
    $styles = [
        'bootstrap-css'   => 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
        'archivo-font'    => 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;600&display=swap',
        'flatpickr-css'   => 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css',
        'ajax-search'     => plugin_dir_url(__FILE__) . 'assets/css/ajax-search.css',
        'phase-2'         => plugin_dir_url(__FILE__) . 'assets/css/phase-2.css',
    ];

    $scripts = [
        'bootstrap-js'     => ['https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min.js', ['jquery']],
        'flatpickr-js'     => ['https://cdn.jsdelivr.net/npm/flatpickr', ['jquery']],
        'custom-datepicker'=> [plugin_dir_url(__FILE__) . 'components/custom-date-picker.js', ['flatpickr-js']],
        'ajax-search'      => [plugin_dir_url(__FILE__) . 'assets/js/ajax-search.js', ['jquery']],
        'phase-2'          => [plugin_dir_url(__FILE__) . 'assets/js/phase-2.js', ['jquery']],
        'guest-dropdown'   => [plugin_dir_url(__FILE__) . 'assets/js/guest-dropdown.js', ['jquery']],
    ];

    // Enqueue Styles
    foreach ($styles as $handle => $src) {
        wp_enqueue_style($handle, $src, [], null, 'all');
    }

    // Enqueue Scripts
    foreach ($scripts as $handle => [$src, $deps]) {
        wp_enqueue_script($handle, $src, $deps, null, true);
    }

    // Localize script for AJAX
    wp_localize_script('ajax-search', 'ajaxSearch', ['ajax_url' => admin_url('admin-ajax.php')]);
}
add_action('wp_enqueue_scripts', 'csb_enqueue_assets');

// Register the shortcode
function csb_search_box_shortcode() {
    ob_start();
    ?>
    <!--Search bar-->
    <!--Body-->
    <div class="container-fluid">
        <!-- Search Result Section -->
        <div class="row mb-3" style="border-bottom: 1px solid #ddd;">
            <div class="col">
                <h2 id="property-count">Loading properties...</h2>
            </div>
        </div>

        <!-- Filter and Split Button Section -->
        <div class="d-flex justify-content-end">
            <!-- Split Button -->
            <div class="split-button-container">
                <div class="split-button d-flex">
                    <div class="left d-flex align-items-center justify-content-center" style="border-right: 1px solid #ddd; padding: 10px;" id="map-view-btn" data-target="#mapviews">
                        <img src="<?php echo plugins_url('public/icons8-location-50.png', __FILE__); ?>" alt="Location Icon" />
                    </div>
                    <div class="right d-flex align-items-center justify-content-center" style="padding: 10px;" id="grid-view-btn">
                        <img src="<?php echo plugins_url('public/icons8-grid-16.png', __FILE__); ?>" alt="Grid Icon" />
                    </div>
                </div>
            </div>
        </div>  

        <!-- Display Properties Section -->
        <div id="loading-spinner" style="display: none;">
            <i class="spinner-border"></i>
        </div>

        <!-- <a><div class="property-cards-container" id="content-section">
        </div></a> -->

        
        <div class="property-cards-container" id="content-section" style="cursor: pointer;">
        </div>

        <div class="map-view-containerz hidden" id="map-view-container" style="margin-top:10px;">
            <div class="row">
                <div class="col-md-7" style="border-right: 1px solid #ddd; height: 100vh; display: flex; flex-direction: column;">
                    <div class="property-cards-container2" id="content-section" style="overflow-y: auto; height: 100%; width: 100%;">
                        <!-- Add your content here -->
                    </div>
                </div>
                <div class="col-md-5" style="display: flex; height: 100vh;">
                    <div class="property-maps-container2" id="map" style="height: 100vh; width: 100%;"></div>
                </div>
            </div>
        </div>

        <div>
            <nav aria-label="...">
                <ul class="pagination pagination-sm justify-content-center">
                    <li class="page-item disabled">
                    <a class="page-link" href="#!" tabindex="-1" aria-label="Previous">Previous</a>
                    </li>
                    <li class="page-item"><a class="page-link" href="#!">1</a></li>
                    <li class="page-item"><a class="page-link" href="#!">2</a></li>
                    <li class="page-item"><a class="page-link" href="#!">3</a></li>
                    <li class="page-item">
                    <a class="page-link" href="#!" aria-label="Next">Next</a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('custom_search_box', 'csb_search_box_shortcode');

function property_detail_shortcode() {
    ob_start();
    ?>    
    <div class="parent">
        <div class="div1"></div>
        <div class="div2"></div>
        <div class="div3"></div>
    </div>

    <div class="parent-content">
        <div class="parent-inner">
            <div class="div1-content">
                <div>
                    <h3 id="h3-name">Retrieving...</h3>
                </div>
                <div>
                    <p id="p-location" class="location-pin-text-phase2">...</p>
                </div>
                <div>
                    <h5 id="h5-type" class="h5-type">
                        <span class="segment-badge-content" id="span-segment"></span>
                    </h5>
                </div>
                <div>
                    <h5 id="h5-gbb" class="h5-gbb">
                        Retrieving...
                    </h5>
                </div>

                <div class="div-spacer-border"></div>

                <div id="div-description" class="div-description">
                    Retrieving...
                </div>

                <div class="div-spacer-border"></div>

                <div id="div-the-space" class="div-the-space">
                    Retrieving...
                </div>

                <div class="div-spacer-border"></div>

                <div id="div-guestAccess" class="div-guestAccess">
                    Retrieving...
                </div>

                <div class="div-spacer-border"></div>

                <div id="div-localArea" class="div-localArea">
                    Retrieving...
                </div>

                <div class="div-spacer-border"></div>

                <div class="div-getting-around" id="div-getting-around">
                    Retrieving...
                </div>

                <div class="div-spacer-border"></div>

                <div class="div-notes" id="div-notes">
                    Retrieving...
                </div>

                <div class="div-spacer-border"></div>

                <div class="div-amenities" id="div-amenities">
                    Retrieving...
                </div>

                <div class="div-spacer-border"></div>

                <div class="div-sleeping-arrangement" id="div-sleeping-arrangement">
                    Retrieving...
                </div>
                <div class="div-spacer-border-none"></div>
                <div class="div-availability" id="div-availability">
                    Retrieving...
                </div>

                <div class="div-spacer-border"></div>

                <div class="div-map-section" id="div-map-section">
                    <div id="maps" style="height: 300px; width: 100%;"></div>
                </div>
                <div class="div-spacer-border-none"></div>
                <div class="div-house-rules" id="div-house-rules">
                    Retrieving...
                </div>
                <div class="div-spacer-border-none"></div>
                <div class="div-cancellation" id="div-cancellation">
                    Retrieving...
                </div>
            </div>

            <div class="div2-content">

            </div>
        </div>
    </div>
    
    <?php
    return ob_get_clean();
}
add_shortcode('property_detail', 'property_detail_shortcode');

function dequeue_other_google_maps() {
    global $wp_scripts;

    foreach ($wp_scripts->registered as $handle => $script) {
        if (!empty($script->src) && strpos($script->src, 'maps.googleapis.com') !== false) {
            wp_dequeue_script($handle);
            wp_deregister_script($handle);
        }
    }
}
add_action('wp_enqueue_scripts', 'dequeue_other_google_maps', 5);

function enqueue_google_maps_api() {

    $google_maps_url = "https://maps.googleapis.com/maps/api/js?key=&libraries=places,marker&callback=initMap";

    wp_enqueue_script('google-maps', $google_maps_url, array(), null, true);

    // Add 'async' and 'defer' attributes to the script
    add_filter('script_loader_tag', function ($tag, $handle) {
        if ($handle !== 'google-maps') {
            return $tag;
        }
        return str_replace(' src', ' async defer src', $tag);
    }, 10, 2);
}
add_action('wp_enqueue_scripts', 'enqueue_google_maps_api');
?>
