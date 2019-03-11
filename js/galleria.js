'use strict';

function view(imgsrc) {
    let viewin = window.open(imgsrc, 'viewin', 'width=1000,height=600');
}

const nappi = document.getElementById('nappi');
const ylapalkki = document.getElementById('ylapalkki');
let vari = 0;

nappi.addEventListener('click', function(evt) {
    vari++;
});

nappi.addEventListener('mouseenter', teemanVaihto);
nappi.addEventListener('mouseleave', teemanVaihto);

function teemanVaihto() {
    if(vari%2 === 0) {
        vari = 0;
        document.body.style.backgroundColor = 'black';
        ylapalkki.style.backgroundColor = 'black';
        nappi.innerText = 'vaalea teema';
    } else {
        document.body.style.backgroundColor = 'white';
        nappi.innerText = 'tumma teema';
        ylapalkki.style.backgroundColor = 'white';
    }
    vari++;
}

teemanVaihto();
teemanVaihto();