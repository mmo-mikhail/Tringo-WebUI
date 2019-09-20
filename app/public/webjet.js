$(function () {
    if (Webjet.Shared.isMobileDevice()) {
        $("body").addClass("mobile");
    }

    // TODO: Check wether we need this
    // Initilize modal to disable the touchmove event when modal shown
    $('.modal').on('shown.bs.modal', function () {
        $('body').bind("touchmove", {}, function (event) {
            event.preventDefault();
        });
    }).on('hidden.bs.modal', function () {
        $('body').unbind("touchmove");
    });

    var slideSpeed = 200;
    var mainNav = $("#main-nav");
    var serviceNav = $("#service-nav>ul");
    var serviceNavItems = serviceNav.children("li");
    var subNav = serviceNav.find(".sub-nav");

    //// common functions
    var enableFlexMenu = function() {
        mainNav.find("ul").flexMenu();
    };

    var disableFlexMenu = function() {
        mainNav.find("ul").flexMenu({ undo: true });
    };

    var closeFlexMenu = function () {
        mainNav.find(".flexMenu-popup:visible").hide();
        mainNav.find(".flexMenu-viewMore").removeClass("active");
    };

    var closeServiceNavMenu = function () {
        subNav.filter(":visible").slideUp(slideSpeed, function () {
            serviceNavItems.removeClass("active");
        });
    };

    //// render service navigation menu
    serviceNavItems.on("click", ".sub-nav-link", function () {
        serviceNavItems.removeClass("active");

        var activeLink = $(this);
        var activeSubNav = activeLink.next();
        var activeListItem = activeLink.closest("li");
        activeListItem.addClass("active");

        // if selected sub-nav is opened then close it
        if ((activeSubNav.is("ul")) && (activeSubNav.is(":visible"))) {
            activeSubNav.slideUp(slideSpeed, function () {
                activeListItem.removeClass("active");
            });
        }

        // if selected sub-nav is not opened then close all other before open it
        if ((activeSubNav.is("ul")) && (!activeSubNav.is(":visible"))) {
            subNav.filter(":visible").slideUp(slideSpeed);
            activeSubNav.slideDown(slideSpeed);
        }

        closeFlexMenu();
        return false;
    });

    serviceNav.on("focus", ">li", function () {
        var menuItem = $(this);
        setTimeout(function () {
            if (!menuItem.hasClass("active")) {
                closeServiceNavMenu();
            }
        }, 150);
    });

    //// render primary menu
    setTimeout(enableFlexMenu, 100);

    mainNav.on("click", ".flexMenu-viewMore", function (e) {
        closeServiceNavMenu();
        e.stopPropagation();
    }).on("blur", ".flexMenu-viewMore", function () {
        var menuItem = $(this);
        setTimeout(function () {
            if (menuItem.has(":focus").length < 1) {
                closeFlexMenu();
            }
        }, 150);
    });
    

    $(document).on("click", function () {
        closeFlexMenu();
        closeServiceNavMenu();
    }).on("click", "a[href=#]", function (e) {
        e.preventDefault();
    });

    //// render footer 
    var footer = $("#footer");
    var footerHeader = footer.find(".footer-header");
    var footerList = footer.find(".footer-list");
    footer.on("click", ".footer-header", function () {
        if (Webjet.Shared.isMobileSize()) {
            var activeFooterHeader = $(this);
            var activeFooterList = $(this).next();
            footerHeader.not(activeFooterHeader).find(".wj-icon").addClass("wj-s-caret-right").removeClass("wj-s-caret-down");
            footerList.not(activeFooterList).addClass("col-s-0");
            activeFooterList.toggleClass("col-s-0");
            activeFooterHeader.find(".wj-icon").toggleClass("wj-s-caret-right wj-s-caret-down");
        }

        return false;
    });

    //// render mobile menu
    var contentWrapper = $("#content-wrapper");
    var toggleNavigation = function () {
        contentWrapper.toggleClass("navigation-active");
        disableFlexMenu();
    };
    contentWrapper.on("click", ".nav-toggle", toggleNavigation);

    // close the mobile menu when users go to desktop size
    $(window).resize(function () {
        if (contentWrapper.hasClass("navigation-active") && !Webjet.Shared.isMobileSize()) {
            toggleNavigation();
            enableFlexMenu();
        }
    });

    //// handle for button loader 
    $("#content").on("click", "a[data-type=loader], button[data-type=loader]", function () {
        Webjet.Shared.addButtonLoader(this);
        return false;
    });

    // UI Widget init
    $("input.standard").wjTextField();
    $("select.option-select").selectmenu();
    $(".multilevel-accordion").wjMultilevelAccordion({
        multiple: true
    });
})
