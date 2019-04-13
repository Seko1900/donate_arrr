/*
 * @dogracer pulled this code together with much trial and error
 *
 * modified from danielquinn/bitcoin-donate project which is licensed under the
 * GNU General Public License v3.0
 * https://github.com/danielquinn/bitcoin-donate/blob/master/src/btcdonate.js
 */
/*global document*/
/*global window*/
/*global setTimeout*/
/*global clearTimeout*/
/*global $*/
"use strict";
(function () {
    var ARRRDonateButton = function () {
        var qr = {
            fill: "black",
            radius: 0.0
        };

        // Wrap all links containing href="piratechain:..." so that we can operate on them
        $("a[href^=piratechain],a[data-arrraddress]")
            .addClass("arrrdonate-trigger")
            .wrap('<span class="arrrdonate"></span>');

        // Append the bubble and attach the hide/show effects for it
        $('.arrrdonate').each(function () {
            // Options
            var distance = 10;
            var time = 250;
            var hideDelay = 500;
            var hideDelayTimer = null;

            // Tracker
            var beingShown = false;
            var shown = false;

            var trigger = $('.arrrdonate-trigger', this).get(0);
            var address = $(trigger).attr("data-arrraddress") || $(trigger).attr("href");
            if (address.indexOf("piratechain:")) {
                address = "piratechain:" + address;
            }

            var $qr = $('<div class="arrrdonate-qr"></div>').qrcode({
                size: 128,
                fill: qr.fill,
                radius: qr.radius,
                text: address.replace("piratechain:", ""),
                render: "image"
            });

            var $bubble = $('<div class="arrrdonate-bubble"></div>')
                .css("opacity", 0)
                .append($qr)
                .append('<div class="arrrdonate-address">' + address.replace("piratechain:", "").replace(/\?.*/, "") + '</div>');

            $(this).append($bubble);

            // Set the mouseover and mouseout on both elements
            $([trigger, $bubble.get(0)]).mouseover(function () {
                var bubble_offset_vertical = ($bubble.height() + 25) * -1;
                var bubble_offset_horizontal = (($bubble.width() - $(trigger).width()) / 2) * -1;

                // Stops the hide event if we move from the trigger to the popup element
                if (hideDelayTimer) {
                    clearTimeout(hideDelayTimer);
                }

                // Don't trigger the animation again if we're being shown, or already visible
                if (!beingShown && !shown) {

                    beingShown = true;

                    // reset position of popup box
                    $bubble
                        .css({
                            top: bubble_offset_vertical,
                            left: bubble_offset_horizontal,
                            display: "block",
                            position: "absolute"
                        })
                        .animate({
                            top: '-=' + distance + 'px',
                            opacity: 1
                        }, time, 'swing', function () {
                            beingShown = false;
                            shown = true;
                        });
                }

            }).mouseout(function () {

                // Reset the timer if we get fired again - avoids double animations
                if (hideDelayTimer) {
                    clearTimeout(hideDelayTimer);
                }

                // Store the timer so that it can be cleared in the mouseover if required
                hideDelayTimer = setTimeout(function () {
                    hideDelayTimer = null;
                    $bubble.animate({
                        top: '-=' + distance + 'px',
                        opacity: 0
                    }, time, 'swing', function () {
                        // Once the animate is complete, set the tracker variables
                        shown = false;
                        // Hide the popup entirely after the effect (opacity alone doesn't do the job)
                        $bubble.css('display', 'none');
                    });
                }, hideDelay);
            });
        });
    };

    window.addEventListener("load", function () {
        var donateButton = new ARRRDonateButton();
        return donateButton;
    }, false);
}());
