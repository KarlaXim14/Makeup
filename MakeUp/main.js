//Registrar el SW
let newSW;
if ('serviceWorker' in  navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(result =>{
            result.addEventListener('updatefound', () => {
                newSW = result.installing;
                console.log('Hay un nuevo SW', newSW)

                newSW.addEventListener('statechange', () => {
                    if(newSW.state == "installed"){
                        showSnackbar();
                    }
                })
            })
        })
        
    })
}
//Parte para saber si el navegador soporta indexedDB
if (!window.indexedDB) {
    window.alert("Su navegador no soporta una versión estable de indexedDB. Tal y como las características no serán validas");
}
let request = window.indexedDB.open("Base-V1", 3);


function showSnackbar() {
    
    let x = document.getElementById("snackbar");
    x.className = "show";
  
}

let botonActualizar = document.getElementById('launchUpdate')

botonActualizar.addEventListener('click', () => {
    console.log('Hacer el skipwaiting');
    window.location.reload(); 
    newSW.postMessage({action: 'skipWaiting'})
})


let allContainerCart = document.querySelector('.Articulos');
let containerBuyCart = document.querySelector('.card-items');
let priceTotal = document.querySelector('.price-total')
let CantidadArticulo = document.querySelector('.count-articulo');


let buyThings = [];
let totalCard = 0;
let countArticulo = 0;

//functions
loadEventListenrs();
function loadEventListenrs(){
    allContainerCart.addEventListener('click', addArticulo);

    containerBuyCart.addEventListener('click', deleteArticulo);
}

function addArticulo(e){
    e.preventDefault();
    if (e.target.classList.contains('btn-add-cart')) {
        const selectArticulo = e.target.parentElement; 
        readTheContent(selectArticulo);
    }
}

function deleteArticulo(e) {
    if (e.target.classList.contains('delete-Articulo')) {
        const deleteId = e.target.getAttribute('data-id');

        buyThings.forEach(value => {
            if (value.id == deleteId) {
                let priceReduce = parseFloat(value.price) * parseFloat(value.Cantidad);
                totalCard =  totalCard - priceReduce;
                totalCard = totalCard.toFixed(2);
            }
        });
        buyThings = buyThings.filter(articulo => articulo.id !== deleteId);
        
        countArticulo--;
    }
    loadHtml();
}

function readTheContent(articulo){
    const infoArticulo = {
        image: articulo.querySelector('div img').src,
        title: articulo.querySelector('.title').textContent,
        price: articulo.querySelector('div p span').textContent,
        id: articulo.querySelector('a').getAttribute('data-id'),
        Cantidad: 1
    }

    totalCard = parseFloat(totalCard) + parseFloat(infoArticulo.price);
    totalCard = totalCard.toFixed(2);

    const exist = buyThings.some(articulo => articulo.id === infoArticulo.id);
    if (exist) {
        const pro = buyThings.map(articulo => {
            if (articulo.id === infoArticulo.id) {
                articulo.Cantidad++;
                return articulo;
            } else {
                return articulo
            }
        });
        buyThings = [...articulo];
    } else {
        buyThings = [...buyThings, infoArticulo]
        countArticulo++;
    }
    loadHtml();
    
}

function loadHtml(){
    clearHtml();
    buyThings.forEach(articulo => {
        const {image, title, price, Cantidad, id} = articulo;
        const row = document.createElement('div');
        row.classList.add('item');
        row.innerHTML = `
            <img src="${image}" alt="">
            <div class="item-content">
                <h5>${title}</h5>
                <h5 class="cart-price">$${price}</h5>
                <h6>Cantidad: ${Cantidad}</h6>
            </div>
            <span class="delete-Articulo" data-id="${id}">X</span>
        `;

        containerBuyCart.appendChild(row);

        priceTotal.innerHTML = totalCard;

        CantidadArticulo.innerHTML = countArticulo;
    });
}
 function clearHtml(){
    containerBuyCart.innerHTML = '';
 }




