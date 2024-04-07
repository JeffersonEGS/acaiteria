let cart = [];
let modalQt = 1;
let modalKey = 0;


const c = (el)=>document.querySelector(el);                          //retorna o item que ele achou
const cs = (el)=>document.querySelectorAll(el);                     // retorna uma array que ele achou

//Listagem das pizzas

acaiJson.map((item, index)=>{
    let acaiItem = c('.models .acai-item').cloneNode(true);       //preencher as informações em acaiItem


    acaiItem.setAttribute('data-key', index);                              //quando colocamos algum atributo com alguma informação especifica colocar o atributo data
    acaiItem.querySelector('.acai-item--img img').src = item.img;
    acaiItem.querySelector('.acai-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    acaiItem.querySelector('.acai-item--name').innerHTML = item.name;
    acaiItem.querySelector('.acai-item--desc').innerHTML = item.description;
    acaiItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();                                                 //previni a ação padrão

        let key = e.target.closest('.acai-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        c('.acaiBig img').src = acaiJson[key].img;
        c('.acaiInfo h1').innerHTML = acaiJson[key].name;
        c('.acaiInfo--desc').innerHTML = acaiJson[key].description;
        c('.acaiInfo--actualPrice').innerHTML = `RS ${acaiJson[key].price.toFixed(2)}`;
        c('.acaiInfo--size.selected').classList.remove('selected');
        cs('.acaiInfo--size').forEach((size, sizeIndex)=> {                                //Para cada um dos itens ele vai rodar uma função
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = acaiJson[key].sizes[sizeIndex]

        });                                                               

        c('.acaiInfo--qt').innerHTML = modalQt;

        c('.acaiWindowArea').style.opacity = 0
        c('.acaiWindowArea').style.display = 'flex';
        setTimeout(()=> {
            c('.acaiWindowArea').style.opacity = 1
        }, 200);
    });

    

    c('.acai-area').append( acaiItem );          //append - ele pega o conteudo que já tem em acai area e adiciona mais um conteudo
});

//Eventos do MODAL


function closeModal() {
    c('.acaiWindowArea').style.opacity = 0;
    setTimeout(()=> {
        c('.acaiWindowArea').style.display = 'none';
    }, 500);
}
cs('.acaiInfo--cancelButton, .acaiInfo--cancelMobileButton').forEach((item)=> {                            //para cada um deles
    item.addEventListener('click', closeModal);
});

c('.acaiInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1) {
    modalQt--;
    c('.acaiInfo--qt').innerHTML = modalQt;
}
});
c('.acaiInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.acaiInfo--qt').innerHTML = modalQt;
});

cs('.acaiInfo--size').forEach((size, sizeIndex)=> {                                //Para cada um dos itens ele vai rodar uma função
    size.addEventListener('click', (e)=>{
        c('.acaiInfo--size.selected').classList.remove('selected');                        //tira quem está selecionado e seleciona o item clicado
        size.classList.add('selected')
    })
});                                                               

c('.acaiInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.acaiInfo--size.selected').getAttribute('data-key'));

    let identifier = acaiJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item)=>item.identifier == identifier);
  
    if(key > -1) {
        cart[key].qt += modalQt;
    } else {
    
        cart.push({
            identifier,
            id:acaiJson[modalKey].id,
            size,
            qt:modalQt
        });
    }
    updateCart();
    closeModal();
});;

c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0) {
        c('aside').style.left = '0';
    }
});
c('.menu-closer').addEventListener('click', ()=>{
        c('aside').style.left = '100vw'
});

function updateCart() {

    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        c('aside').classList.add('show');                                    //Show significa que ele vai aparecer

        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;
        

        for(let i in cart) {
            
            let acaiItem = acaiJson.find((item)=>item.id == cart[i].id);
            subtotal += acaiItem.price * cart[i].qt;


            let cartItem = c('.models .cart--item').cloneNode(true);


            let acaiSizeName;
            switch  (cart[i].size) {
                case 0:
                    acaiSizeName = 'P';
                    break;
                case 1:
                    acaiSizeName = 'M'
                    break;
                case 2:
                    acaiSizeName = 'G'
                    break;                        
            }
            let acaiName = `${acaiItem.name} (${acaiSizeName})`;

            cartItem.querySelector('img').src = acaiItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = acaiName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }

                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });


            c('.cart').append(cartItem);

        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        c('aside').classList.remove('show');   
        c('aside').style.left = '100vw';
    };
}
