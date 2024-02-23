const cinp = cinpBuilder( "http://localhost:8888" );

function setupBackend() {
  cinp.describe( "/api/v1/" ).done( 
    function( resp ) {
      if( resp.version != "1.0" ) {
        alert( "Invalid API version" );
        return;
      }
      login();
    } ).fail( function() { alert( "unable to find backend" ); } );
}

function login() {
  cinp.call("/api/v1/Auth/User(login)", { "username": "ui", "password": "ui" } ).done(
    function( resp ) {
      cinp.setAuth( "ui", resp );
    } ).fail(
    function( resp ) {
      alert( "failed to authencate to the backend" );
    } );
}


function doAlert( msg ) {
  alert( msg );
}

function test() {  
  const product_list = $("#product_list");
  product_list.empty();
  cinp.getFilteredObjects( "/api/v1/Products/Product" ).done(
    function( resp ) {
      for ( const [ uri, product ] of Object.entries( resp ) ) {
        product_list.append( `<div>${product.name}</div>` );
      }
    } ).fail( function() {
      alert( "Unable to get product list" );
    } );
}

function getProductsArr() {
  return new Promise((resolve, reject) => {
    let products = [];
    cinp.getFilteredObjects("/api/v1/Products/Product").done(function(resp) {
      for (const [uri, product] of Object.entries(resp)) {
        let productArray = [
          product.name,
          product.cost,
          product.location,
          product.available,
          product.id
        ];
        products.push(productArray);
      }
      resolve(products);
    }).fail(function() {
      reject("Unable to get product list");
    });
  });
}

async function showPrice(button) {
  try {
    let products = await getProductsArr();
    const productLocation = button.textContent;
    console.log(productLocation + "|" + products.length);
    for (let i = 0; i < products.length; i++) {
      console.log(products[i][2]);
      if (products[i][2] === productLocation) {
        alert("The cost is $" + products[i][1]);
      }
    }
  } catch (error) {
    alert(error);
  }
}

function showAlert(button) {
  alert(button.textContent + " button clicked");
}

setupBackend();

