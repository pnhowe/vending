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

function showAlert(button) {
  alert(button.textContent + " button clicked");
}

setupBackend();

