var reservation = {
    time: "",
    duration: "",

    // methode qui appele toute les methodes en 1 fois au chargement de la page
    initReservation: function () {
        reservation.validationReservation();
        reservation.annulationReservation();
        reservation.displayReservInfosOnLoad();
    },

    //methode qui initialise et active le compte a rebours 
    startTimer: function () {
        var finishDate = new Date().getTime() + 1200000;
        reservation.time = setInterval(function () {
            var now = new Date().getTime();
            var tempsRestant = sessionStorage.getItem("tempsRestant");
            if (sessionStorage.getItem("veloReserved") === "true") {
                reservation.duration = tempsRestant - 1000;
            } else {
                reservation.duration = finishDate - now;
            }
            var minutes = Math.floor((reservation.duration % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((reservation.duration % (1000 * 60)) / 1000);
            sessionStorage.setItem("tempsRestant", reservation.duration);
            reservation.reservationStorage();
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            $('#timer').empty();
            $('#timer').append(minutes + ":" + seconds);
            $('#timer').fadeIn();
            if (reservation.duration < 0) {
                clearInterval(reservation.time);
                $('#messageReservation').empty();
                $('#stationReserver').empty();
                $('#timer').empty();
                $('#messageReservation').append('Votre réservation à expiré');
                $('#boutonAnnuler').hide();
                $('#messageReservation').fadeIn();
                sessionStorage.clear();
            }
        }, 1000);
    },

    //methode qui réaffiche les infos et le temps de reservation au chargement de la page
    displayReservInfosOnLoad: function () {
        if (sessionStorage.getItem("veloReserved") === "true") {
            $('#reservation-Infos').fadeIn();
            $('#stationReserver').append("Vous avez une réservation en cours à la station suivante : " + sessionStorage.getItem("station"));
            $('#messageReservation').append("Votre réservation expire dans : ");
            $('#boutonAnnuler').fadeIn();
            reservation.startTimer();
        }
    },

    //methode qui supprime les infos de la barre de reservation
    clearReservationInfos: function () {
        $('#stationReserver').empty();
        $('#messageReservation').empty();
    },

    //methode qui insere les infos de la station reservée dans la barre de reservation
    displayReservationInfos: function () {
        reservation.clearReservationInfos();
        $('#reservation').fadeOut();
        $('#reservation-Infos').fadeIn();
        $('#stationReserver').append("Vous venez de réserver un Vélo'V à la station suivante : " + $('#nomStation').text());
        $('#messageReservation').append("Votre réservation expire dans : ");
        $('#boutonAnnuler').fadeIn();
        sessionStorage.setItem('dateReservation', Date.now());
        reservation.startTimer();

    },

    // cette metkode sert a afficher les infos de reservation quand une reservation est confirmée
    validationReservation: function () {
        $('#boutonValider').click(function () {
            reservation.displayReservationInfos();
        });
    },

    //methode qui annule la reservation en cours 
    annulationReservation: function () {
        $('#boutonAnnuler').click(function () {
            reservation.clearReservationInfos();
            sessionStorage.clear();
            clearInterval(reservation.time);
            $('#reservation').fadeOut();
            $('#messageReservation').empty();
            $('#timer').empty();
            $('#boutonAnnuler').hide();
            $('#messageReservation').append("Votre réservation à été annulée");
            $('#messageReservation').fadeIn();
            $('#reservation-Infos').delay(5000).fadeOut();
        });
    },

    //methode qui met en memoire la reservation d'un velo
    reservationStorage: function () {
        sessionStorage.setItem("veloReserved", "true");
    },
}

$(function () {
    reservation.initReservation();
})
