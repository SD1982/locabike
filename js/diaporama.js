// Objet diaporama
var diapo = {

    slideIndex: 0, // Attribut qui permet de parcourir les slides

    // Méthode qui permetra d'initialiser toutes les fonction en une seule fois
    init: function () {
        diapo.controlDiapo();
        diapo.suivant();
        diapo.precedent();
        diapo.playStop();
        diapo.autoPlay();
    },

    // Méthode qui fait fonctionner le diaporama en avant
    suivant: function () {
        $('.slide').eq(diapo.slideIndex).hide(); // Fait disparaître la slide active
        if (diapo.slideIndex === $('.slide').length - 1) { // Si le diaporama est à la dernière slide
            diapo.slideIndex = 0; // On repasse l'attribut à 0 pour faire réapparaître la première  slide
        } else { // Sinon on passe à la slide suivante
            diapo.slideIndex++; // En augmentant de 1 l'attribut
        }
        $('.slide').eq(diapo.slideIndex).show(); // Fait apparaître la slide suivante
    },

    // Méthode qui fait fonctionner le diaporama en arrière
    precedent: function () {
        $('.slide').eq(diapo.slideIndex).hide(); // Fait disparaître la slide active
        if (diapo.slideIndex === 0) { // Si le diaporama est à la première slide
            diapo.slideIndex = $('.slide').length - 1; // On passe l'attribut à 4 pour faire réapparaître la slide précédente
        } else { // Sinon on passe à la slide précédente
            diapo.slideIndex--; // En diminuant de 1 la valeur de l'attribut
        }
        $('.slide').eq(diapo.slideIndex).show(); // Fait apparaître la slide précédente
    },

    // Méthode qui permet le controle du diaporama avec les bouton play et stop
    playStop: function () {
        $('#play').click(function () {
            var timer = setInterval(function () {
                diapo.suivant();
            }, 5000);
            $('#stop').click(function () {
                clearInterval(timer);
            });
        });

    },

    // Méthode qui lancera le diaporama au chargement de la page
    autoPlay: function () {
        $('#play').trigger('click'); //la Méthode "trigger" simule un click sur le bouton play
    },

    // Méthode qui permet de changer de slide au click ou avec les touches de clavier
    controlDiapo: function () {
        $('#next').click(function () {
            diapo.suivant();
        });
        $('#prev').click(function () {
            diapo.precedent();
        });
        $(document).keydown(function (e) {
            var touche = e.which || e.keyCode; // la condition 'ou' permet d'etre compatible sur tout navigateur
            if (touche === 39) {
                diapo.suivant();
            } else if (touche === 37) {
                diapo.precedent();
            }
        });
    }
}

//au chargement de la page on fait appel a la méthode init qui permet de faire appel a d'autre méthodes
$(function () {
    diapo.init();
})
