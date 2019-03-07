'use strict';

function view(imgsrc) {
    let viewin = window.open(imgsrc, 'viewin', 'width=1000,height=600');
}

const nappi = document.getElementById('nappi');
let vari = 0;
nappi.addEventListener('click', function(evt) {
    vari++;
});
nappi.addEventListener('mouseenter', function(evt) {
    if(vari%2 === 0) {
        document.body.style.backgroundColor = 'black';
        nappi.innerText = 'vaalea teema';
    } else {
        document.body.style.backgroundColor = 'white';
        nappi.innerText = 'tumma teema';
    }
    vari++;
});
nappi.addEventListener('mouseleave', function(evt) {
    if(vari%2 === 0) {
        document.body.style.backgroundColor = 'black';
        nappi.innerText = 'vaalea teema';
    } else {
        document.body.style.backgroundColor = 'white';
        nappi.innerText = 'tumma teema';
    }
    vari++;
});