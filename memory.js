$(function () {
    var joker = "url(joker.jpg)";
    var batman = "url(batman.jpg)";
    var blank = "url(blank.jpg)";
    var cards = [joker, batman, joker, batman, joker, batman, joker, batman,
        joker, batman, joker, batman, joker, joker, joker, joker];
    var cols = 4;

    var onePixelInMM = 0.264583;
    var winMaxX = $(document).width();
    var winMaxY = $(document).height();

    var screenXMax = winMaxX * onePixelInMM;
    var screenYMax = winMaxY * onePixelInMM;

    var controller = new Leap.Controller();

    var flipCards = function (card, removeClass, addClass, image) {
        card.removeClass(removeClass);
        card.addClass(addClass);
        card.css("background-image", image);
    };

    var handleOpenedCards = function (openedCards) {
        var card1Image = $(openedCards[0]).css("background-image");
        var card2Image = $(openedCards[1]).css("background-image");
        if (card1Image === card2Image) {
            openedCards.unbind('click');
            $(openedCards[0]).removeClass("open");
            $(openedCards[1]).removeClass("open");
        } else {
            openedCards.forEach(
                function (card, index) {
                    flipCards($(card), "open", "closed", blank);
                });
        }
    };

    $('.tile').bind('click', function () {
        var tile = $(this);
        var isOpened = tile.hasClass("open");

        var openedCards = $('.open');
        if (openedCards.length == 2) {
            handleOpenedCards(openedCards);
            if (isOpened)
                return;
        }
        var cardNumber = this.id;

        var cardImage = cards[cardNumber];
        var isClosed = tile.hasClass("closed");


        if (isClosed) {
            flipCards(tile, "closed", "open", cardImage);
        }
    });

    var mapImageId = function (leapX, leapY) {
        //console.log("leapX, leapY=" + leapX + "," + leapY);

        var screenX = screenXMax / 2 + leapX;
        var screenY = screenYMax - leapY;
        //console.log("screenX, screenY=" + screenX + "," + screenY);

        var winX = (screenX * winMaxX) / screenXMax;
        var winY = (screenY * winMaxY) / screenYMax;
        //console.log("winX, winY = " + winX + "," + winY);

        var imageWidth = 160;
        var imageHeight = 304;

        var row = Math.ceil(winY / imageWidth) - 1;
        var col = Math.ceil(winX / imageHeight) - 1;

        //console.log("row,col = " + row + "," + col);

        return (row * cols) + (col);
    };

    Leap.loop(function (frame) {
        if (frame.fingers.length == 1 && frame.fingers[0].handId != -1) {
            var finger = frame.fingers[0];
            if ((finger.tipVelocity[0] < 5 && finger.tipVelocity[0] > -5) &&
                (finger.tipVelocity[1] < 5 && finger.tipVelocity[1] > -5)) {

                var x = finger.tipPosition[0];
                var y = finger.tipPosition[1];
                //console.log((screenXMax/2) +","+screenYMax+",x="+x+",y="+y);
                if ((x < screenXMax / 2 && x > -(screenXMax / 2)) && (y < screenYMax && y > 0)) {
                    var imageId = mapImageId(x, y);
                    $('#' + imageId).click();
                }

            }
        }
    });
});