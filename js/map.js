//déclaration de l'objet gMap
var gMap = {
    //déclaration des attributs de l'objet qui pourront etre facilement reutilisé
    map: null,
    apiJcDecaux: "https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=ea5288e88e4bc45d46d9720ac9cf9ad06d4d8806",
    StationStatus: "",
    markerTab: [],
    thisMarker: "",
    path: "images/marqueurs/",

    // cette methode servira a appeler toute les methodes du script en une seule fois au chargement de la page
    init: function () {
        gMap.initMap();
        gMap.displayMarker();
        gMap.markerClustering();
        gMap.clearStationInfos();
        gMap.closeInfoStation();
    },

    //cette methode sert a initialiser la map
    initMap: function () {
        gMap.map = new google.maps.Map(document.getElementById("map"), {
            center: {
                lat: 45.764178,
                lng: 4.835121
            },
            zoom: 13
        });

    },

    //methode qui definie la couleur du marqueur de station en fonction de son statut et du nombre de velo disponible
    colorMarker: function (station) {
        var icon = gMap.path + "default_marqueur.png";
        if (station.status === "OPEN" && station.available_bikes > 0) {
            icon = gMap.path + "pointVert.png";
        } else if (station.status === "OPEN" && station.available_bikes === 0) {
            icon = gMap.path + "pointJaune.png";
        } else if (station.status === "CLOSED") {
            icon = gMap.path + "pointRouge.png";
        }
        return icon;
    },

    //methode qui reinitialise les infos station au clic sur un nouveau marqueur
    clearStationInfos: function () {
        $('#nomStation').empty();
        $('#adresseStation').empty();
        $('#etatStation').empty();
        $('#veloDispo').empty();
        $('#attacheDispo').empty();
        $('#messageErreurReservation').empty();
        $('#boutonReservation').hide();
        $('#messageErreur').hide();
        $('#canvaSignature').hide();
    },

    //methode qui sauvegarde les infos de la station  les infos sont stockées en memoire sur le naviguateur
    initStorage: function (station) {
        if (jQuery.isPlainObject(station)) {
            sessionStorage.setItem("station", station.name);
            sessionStorage.setItem("status", station.status);
            sessionStorage.setItem("adresse", station.address);
            sessionStorage.setItem("veloDispo", station.available_bikes);
            sessionStorage.setItem("lat", station.position.lat);
            sessionStorage.setItem("lng", station.position.lng);
        }
    },

    //methode qui reinitialise les infos station qui sont stockées en memoire sur le naviguateur
    clearStorage: function (station) {
        sessionStorage.removeItem("station");
        sessionStorage.removeItem("status");
        sessionStorage.removeItem("adresse");
        sessionStorage.removeItem("veloDispo");
        sessionStorage.removeItem("lat");
        sessionStorage.removeItem("lng");
    },

    //methode qui color les infos de la station en fonction de son status et du nb de velos dispo
    colorInfoStation: function (station) {
        if (station.status === 'OPEN' && station.available_bikes > 0) {
            gMap.StationStatus = 'ouverte';
            $('#etatStation').css('color', '#5DB95D');
            $('#veloDispo').css('color', '#5DB95D');
            $('#boutonReservation').fadeIn();
        } else if (station.status === "OPEN" && station.available_bikes === 0) {
            gMap.StationStatus = 'ouverte';
            $('#etatStation').css('color', '#5DB95D');
            $('#veloDispo').css('color', '#E3001B');
            $('#messageErreur').fadeIn().css('color', '#FFBD4A');
        } else
        if (station.status === "CLOSED") {
            gMap.StationStatus = 'fermée';
            $('#etatStation').css('color', '#E3001B');
            $('#messageErreur').fadeIn().css('color', '#FFBD4A');
        }
    },

    //methode qui permet de fermer le cadre des infos stations
    closeInfoStation: function () {
        $('#boutonFermer').click(function () {
            $('#reservation').fadeOut();
        })
    },

    //cette methode affiche les infos de la station du marqueur clicker
    displayStationInfos: function (station) {
        // on fait appel a la methode qui reinitialise le session storage
        gMap.clearStorage(station);
        // on fait appel a la methode qui rentre les donnée de la station en session storage
        gMap.initStorage(station);
        // on fait appel a la methode qui reinitialise le cadre reservation
        gMap.clearStationInfos();
        // on fait appel a la methode qui colore les infos stations
        gMap.colorInfoStation(station);
        //insertion des données de la station 
        $('#nomStation').append(station.name);
        $('#adresseStation').append(station.address);
        $('#etatStation').append("Cette station est" + " " + gMap.StationStatus);
        $('#veloDispo').append("Vélo'V disponible : " + " " + station.available_bikes);
        $('#attacheDispo').append("Emplacements Vélo'V libre : " + " " + station.available_bike_stands);
        //apparition du cadre contenant les infos de la station
        $("#reservation").fadeIn();
    },

    //methode qui affiche un message au clic sur une station si un velo est deja reservé dans une autre station
    displayReservationMessage: function (station) {
        gMap.clearStationInfos();
        $('#messageErreurReservation').append("Vous avez déja une réservation en cours à la station suivante : " + sessionStorage.getItem("station") + " situé : " + sessionStorage.getItem("adresse") + " pour effectuer une autre réservation vous devez d'abord l'annuler.");
        $('#reservation').fadeIn();
        $('#messageErreurReservation').fadeIn().css('color', '#FFBD4A');
    },

    //methode qui affiche un message au clic sur une station si un velo est deja reservé dans cette station
    displayReservedStation: function (station) {
        gMap.clearStationInfos();
        gMap.colorInfoStation(station);
        veloDispo = sessionStorage.getItem("veloDispo") - 1;
        if (veloDispo === 0) {
            $('#veloDispo').css('color', '#E3001B');
        }
        $('#boutonReservation').hide();
        $('#messageErreurReservation').append("Vous avez déja une réservation en cours à cette station");
        $('#nomStation').append(station.name);
        $('#etatStation').append("Cette station est" + " " + gMap.StationStatus);
        $('#veloDispo').append("Vélo'V disponible : " + " " + veloDispo);
        $('#attacheDispo').append("Emplacements Vélo'V libre : " + " " + station.available_bike_stands);
        $('#messageErreurReservation').fadeIn().css('color', '#FFBD4A');
        $("#reservation").fadeIn();
    },

    //cette methode va servir a appeler l'api de JcDecaux et a créer un marker pour chaque station
    displayMarker: function () {
        //appel de l'api JcDecaux
        ajaxGet(gMap.apiJcDecaux, function (reponse) {
            //la reponse de la requete est inscrite dans un tableau JavaScript
            var stations = JSON.parse(reponse);
            var marker;
            //pour chaque station du fichier JSON un marqueur est créer 
            stations.forEach(function (station) {
                marker = new google.maps.Marker({
                    map: gMap.map,
                    position: station.position,
                    title: station.name,
                    icon: gMap.colorMarker(station),
                    animation: google.maps.Animation.DROP
                });
                //on integre les marqueurs au markeClusterer
                gMap.markerClusterer.addMarker(marker);
                // au click sur un marqueur les infos de la station sont affiché sur la page
                marker.addListener('click', function () {
                    var veloDispo;
                    var status;
                    var adress = station.address;
                    //si un velo est deja reservé dans une autre station
                    if ((sessionStorage.getItem("adresse") === adress) && (sessionStorage.getItem("veloReserved") === "true")) {
                        //appel de la methode 'displayReservedStation
                        gMap.displayReservedStation(station);
                        //si un velo est deja reservé dans cette station
                    } else if (sessionStorage.getItem("veloReserved") === "true") {
                        //appel de la methode 'displayReservationMessage'
                        gMap.displayReservationMessage(station);
                    } else {
                        //appel de la methode 'displayStationInfos'
                        gMap.displayStationInfos(station);
                    }
                });
            });
        });
    },

    //cette methode sert a regrouper les marqueurs de la meme zone
    markerClustering: function () {
        gMap.markerClusterer = new MarkerClusterer(gMap.map, gMap.markerTab, {
            imagePath: 'images/marqueurs/m'
        });
    },
}

//au chargement de la page on fait appel a la méthode init qui permet de faire appel a d'autre méthodes
$(function () {
    gMap.init();
})
