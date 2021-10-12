const compra = new Carrito();
const listaCompra = document.querySelector("#lista-compra tbody");
const listaCompra2 = document.querySelector("#lista-compra2 tbody");
const carrito = document.getElementById('carrito');
const carrito2 = document.getElementById('carrito2');
const procesarCompraBtn = document.getElementById('procesar-compra');
//const procesarReservaBtn = document.getElementById('procesar-reserva');

const cliente = document.getElementById('cliente');
const correo = document.getElementById('correo');

//const nombre = document.getElementById('nombre');
//const email = document.getElementById('email');

cargarEventos();

function cargarEventos() {
    document.addEventListener('DOMContentLoaded', compra.leerLocalStorageCompra());

    //Eliminar productos del carrito
    carrito.addEventListener('click', (e) => { compra.eliminarProducto(e) });
    carrito2.addEventListener('click', (e) => { compra.eliminarProducto(e) });

    compra.calcularTotal();

    //cuando se selecciona procesar Compra
    procesarCompraBtn.addEventListener('click', procesarCompra);
    //procesarReservaBtn.addEventListener('click', procesarReserva );

    carrito.addEventListener('change', (e) => { compra.obtenerEvento(e) });
    carrito.addEventListener('keyup', (e) => { compra.obtenerEvento(e) });

    carrito2.addEventListener('change', (e) => { compra.obtenerEvento(e) });
    carrito2.addEventListener('keyup', (e) => { compra.obtenerEvento(e) });

}



function calcularTotalPrecio() {
    // Limpiamos precio anterior
    total = 0;
    // Recorremos el array del carrito
    carrito.forEach((item) => {
        // De cada elemento obtenemos su precio
        const miItem = baseDeDatos.filter((itemBaseDatos) => {
            return itemBaseDatos.id === parseInt(item);
        });
        total = total + miItem[0].precio;
    });
    // Renderizamos el precio en el HTML
    DOMtotal.textContent = total.toFixed(2);
}

function procesarCompra() {
    // e.preventDefault();
    if (compra.obtenerProductosLocalStorage().length === 0) {
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'No hay productos, selecciona alguno',
            showConfirmButton: false,
            timer: 2000
        }).then(function () {
            window.location = "haztupedido.html";
        })
    }
    else if (cliente.value === '' || correo.value === '') {
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Ingrese todos los campos requeridos',
            showConfirmButton: false,
            timer: 2000
        })
    }
    else {


        emailjs.init('user_Z9pPFcm5vpPXu2RWMEFby')


        /* AGREGAR DATOS DETALLE DEL PEDIDO A UN TEXT AREA */
        const textArea = document.createElement('textarea');
        textArea.id = "detalleCompra";
        textArea.name = "detalleCompra";
        textArea.cols = 60;
        textArea.rows = 10;
        textArea.hidden = true;
        productosLS = compra.obtenerProductosLocalStorage();
        productosLS.forEach(function (producto) {
            textArea.innerHTML += `
                 Producto : ${producto.titulo} <br>
                 Precio : ${producto.precio} <br>
                 Cantidad: ${producto.cantidad} <br>
                --------------------------------------------- <br>
                `;
        });

        carrito2.appendChild(textArea);
       // document.getElementById('detalleCompra').innerHTML = cadena;
        /* --------------------------------------------------------- */

        const btn = document.getElementById('procesar-compra');

        document.getElementById('procesar-pago')
            .addEventListener('submit', function (event) {
                event.preventDefault();

                btn.value = 'Sending...';



                const cargandoGif = document.querySelector('#cargando');
                cargandoGif.style.display = 'block';

                const enviado = document.createElement('img');
                enviado.src = 'insumos/mail.gif';
                enviado.style.display = 'block';
                enviado.width = '150';

                const serviceID = 'default_service';
                const templateID = 'template_ezzg2wi';


                emailjs.sendForm(serviceID, templateID, this)
                    .then(() => {
                        cargandoGif.style.display = 'none';
                        document.querySelector('#loaders').appendChild(enviado);

                        setTimeout(() => {
                            compra.vaciarLocalStorage();
                            enviado.remove();
                            window.location = "haztupedido.html";
                        }, 5000);


                    }, (err) => {
                        cargandoGif.style.display = 'none';
                        alert("Error al enviar el email\r\n Response:\n " + JSON.stringify(err));
                    });
            });

    }
}

/* function procesarReserva() {
    // e.preventDefault();
   
   if (nombre.value === '' || email.value === '') {
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Ingrese todos los campos requeridos',
            showConfirmButton: false,
            timer: 2000
        })
    }
    else {

        emailjs.init('user_Z9pPFcm5vpPXu2RWMEFby')


        

        document.getElementById('pedir-servicio')
            .addEventListener('submit', function (event) {
                event.preventDefault();

                



                const cargandoGif = document.querySelector('#cargando');
                cargandoGif.style.display = 'block';

                const enviado = document.createElement('img');
                enviado.src = 'insumos/mail.gif';
                enviado.style.display = 'block';
                enviado.width = '150';

                const serviceID = 'default_service';
                const templateID = 'template_o1j6o4h';


                emailjs.sendForm(serviceID, templateID, this)
                    .then(() => {
                        cargandoGif.style.display = 'none';
                        document.querySelector('#loaders').appendChild(enviado);

                        setTimeout(() => {
                            compra.vaciarLocalStorage();
                            enviado.remove();
                            window.location = "index.html";
                        }, 5000);


                    }, (err) => {
                        cargandoGif.style.display = 'none';
                        alert("Error al enviar el email\r\n Response:\n " + JSON.stringify(err));
                    });
            });

    }
} */
