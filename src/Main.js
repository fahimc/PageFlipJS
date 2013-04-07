(function(window) {
  function Main() {
    if(window.addEventListener) {
        window.addEventListener("load", onLoad);
    } else {
        window.attachEvent("onload", onLoad);
    }

}
  function onLoad() {
    // the body has loaded. 
    // start coding here!
    
    Book.init();
  }

Main();
}
)(window);