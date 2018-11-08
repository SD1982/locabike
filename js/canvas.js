//definition des deux variables nécessaire au fonctionnement du canvas
var canvas = document.querySelector("#canvas");
var context = canvas.getContext('2d');
//definition de l'objet canvas
var canvas = {

    //methode qui permet d'appeler plusieurs methode en 1 fois au chargement de la page
    init: function () {
        canvas.affichageCanvas();
        canvas.signature();
        canvas.traceLigne();
        canvas.stopDessin();
        canvas.effacer();
        canvas.touchEventListener();
        canvas.stopScrollOnSignature();
    },

    //methode qui empeche le scrolling lors de la signature en version tactile
    stopScrollOnSignature: function () {
        $('#canvas').on('touchstart', function () {
            $('body').css('overflow', 'hidden');
        });
        $('#canvas').on('touchend', function () {
            $('body').css('overflow', 'auto');
        });
    },

    //methode qui recupere les evenement tactile
    touchEventListener: function () {
        document.addEventListener("touchstart", canvas.touchHandler, true);
        document.addEventListener("touchmove", canvas.touchHandler, true);
        document.addEventListener("touchend", canvas.touchHandler, true);
        document.addEventListener("touchcancel", canvas.touchHandler, true);
    },

    //methode qui convertit un evenement tactile en evenement souris
    touchHandler: function (event) {
        var touch = event.changedTouches[0];
        var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent({
                touchstart: "mousedown",
                touchmove: "mousemove",
                touchend: "mouseup"
            }[event.type], true, true, window, 1,
            touch.screenX, touch.screenY,
            touch.clientX, touch.clientY, false,
            false, false, false, 0, null);
        touch.target.dispatchEvent(simulatedEvent);
        return false;
    },

    //methode qui fait apparaitre le canvas et ses boutons au clic sur le bouton "reserver"
    affichageCanvas: function () {
        $('#boutonReservation').click(function () {
            $('#canvaSignature').fadeIn();
        });
    },

    //methode qui defini certaines donnée du canvas au mousedown
    signature: function () {
        $("#canvas").on('mousedown', function (e) {
            var canvasId = $("#canvas");
            posCanvas = canvasId.offset();
            var x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - posCanvas.left;
            var y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop - posCanvas.top;
            sessionStorage.setItem("Xbefore", x);
            sessionStorage.setItem("Ybefore", y);
            context.strockeStyle = "black";
            context.lineWidth = "3";
            context.beginPath();
            context.moveTo(x, y);
            canvas.stopDessin();
            canvas.traceLigne(posCanvas.left, posCanvas.top);
        });
    },

    //methode qui recueille la position de la souris a chaque mouvement 
    traceLigne: function (posTop, posLeft) {
        $("#canvas").on("mousemove", function (e) {
            var x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - posTop;
            var y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop - posLeft;
            sessionStorage.setItem("Xafter", x);
            sessionStorage.setItem("Yafter", y);
            context.lineTo(x, y);
            context.stroke();
            canvas.controlCanvas();
        });
    },

    //methode qui declare l'arret du remplissage du canvas au mouseup ou ou mouseout 
    stopDessin: function () {
        $("#canvas").on("mouseup", function (e) {
            $("#canvas").off("mousemove"); //stop l'event mousemove au relachement du click
        });
        $("canvas").on("mouseout", function (e) {
            $("#canvas").off("mousemove"); //stop l'event mousemove  si la souris sort canvas
        });
    },

    //methode qui permet de verifier que la signature a ete faite pour permettre la validation de la reservation
    controlCanvas: function () {
        if ((sessionStorage.getItem("Xbefore") !== sessionStorage.getItem("Xafter")) && (sessionStorage.getItem("Xafter") !== "NaN") || (sessionStorage.getItem("Ybefore") !== sessionStorage.getItem("Yafter")) && (sessionStorage.getItem("Yafter") !== "NaN")) {
            $("#boutonValider").delay(600).show();
            $("#boutonEffacer").delay(600).show();
        }
    },

    //methode qui reinitialise les données stockées 
    clearCanvasStorage: function () {
        $("#boutonValider").hide();
        $("#boutonEffacer").hide();
        sessionStorage.removeItem("Xbefore");
        sessionStorage.removeItem("Xafter");
        sessionStorage.removeItem("Ybefore");
        sessionStorage.removeItem("Yafter");
    },

    //methode qui permet d'effacer le canvas
    effacer: function () {
        $("#boutonEffacer").on("click", function () {
            context.clearRect(0, 0, 300, 200);
            canvas.clearCanvasStorage();
        });
        $("#map").on('click', function () {
            context.clearRect(0, 0, 300, 200);
            canvas.clearCanvasStorage();
        });
        $("#boutonValider").on('click', function () {
            context.clearRect(0, 0, 300, 200);
            canvas.clearCanvasStorage();
        });
    },
}

//au chargement de la page on fait appel a la méthode init qui permet de faire appel a d'autre méthodes
$(function () {
    canvas.init();
})
