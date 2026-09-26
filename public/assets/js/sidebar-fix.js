/**
 * Sidebar Menu Fix
 * This script fixes the expand/collapse issue with sidebar menus
 */

(function($) {
    'use strict';
    
    $(document).ready(function() {
        // Reinitialize metisMenu to ensure it works properly
        if ($.fn.metisMenu) {
            $('[data-toggle="aiz-side-menu"]').metisMenu();
        }
        
        // Add manual toggle for submenu arrows
        $('.aiz-side-nav-arrow').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            var $parent = $(this).closest('.aiz-side-nav-item');
            var $submenu = $parent.children('.aiz-side-nav-list');
            
            // Toggle active class
            $parent.toggleClass('mm-active');
            
            // Slide toggle submenu
            $submenu.slideToggle(300);
        });
        
        // Ensure submenus are hidden by default if not active
        $('.aiz-side-nav-item:not(.mm-active) > .aiz-side-nav-list').hide();
    });
})(jQuery);
