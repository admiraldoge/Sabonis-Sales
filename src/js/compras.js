//EJECUTADORES
identificar(); //Match the user with the user registered in COOKIE
window.onload = function(){
    console.log("Window loaded");
    document.getElementById("logout").addEventListener("click",delCookies);
    addParameterToLink();
    setActiveNavs();
}

//FIN_EJECUTADORES

//--------------------------------COOKIES---------------------------------------
function delCookies(){
    console.log("Deleting cookies");
    deleteCookie("JWT");
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            var sol=c.substring(name.length, c.length);
            console.log("Cookie Returned: ",sol);
            return sol;
        }
    }
    return "NULL";
}
function deleteCookie(cname) {
    console.log("Cookie a borrar: ",cname);
    var d = new Date(); //Create an date object
    d.setTime(d.getTime() - (1000*60*60*24)); //Set the time to the past. 1000 milliseonds = 1 second
    var expires = "expires=" + d.toGMTString(); //Compose the expirartion date
    console.log("Expires now in: ",expires);
    window.document.cookie = cname+"="+"; "+expires;//Set the cookie with name and the expiration date
}
//--------------------------------END COOKIES---------------------------------------
//--------------------------------JWT AND URL DE LA PAGINA---------------------------------------
function parseJwt (token) {
    var array = token.split('.')[1];
    var base64 = array.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}

function getPageUser(){
   var url_string = window.location.href;
   var url = new URL(url_string);
   var page_user = url.searchParams.get("user");
   return page_user;
}
function identificar(){
   var url_string = window.location.href;
   var url = new URL(url_string);
   var page_user = url.searchParams.get("user");
   console.log("Page user: ",page_user);
   var cookie=getCookie("JWT");
   console.log("Cokkie got: ",cookie);
   var jwt=parseJwt(cookie);
   console.log("JWT: ",jwt);
   var jwt_user=jwt["sub"];
   console.log(jwt_user);
   if(page_user!=jwt_user){
    window.location.replace("http://localhost:3000/403.html");
   }else{
       console.log("Estas en la pagina correcta!")
   }
}

//--------------------------------END JWT AND URL DE LA PAGINA---------------------------------------
//-------------------------------------SIDE BAR MODIFICATIONS ---------------------------------------

function addUser(e){
    var url=e.getAttribute("href");
    url=url+"?user="+getPageUser();
    console.log("New URL",url);
    e.href=url;
}

function addParameterToLink(){
    var a=document.getElementById("sb0.1");
    addUser(a);
    a=document.getElementById("sb1.1");
    addUser(a);
    a=document.getElementById("sb1.2");
    addUser(a);
    a=document.getElementById("sb1.3");
    addUser(a);
    a=document.getElementById("sb2.1");
    addUser(a);
    a=document.getElementById("sb3.1");
    addUser(a);
    a=document.getElementById("sb3.2");
    addUser(a);
}

function setActiveNavs(){
    //let link = value;
    console.log("Activado el nav de la pagina :V");
    let cUrl = String(window.location).split('?')[0];
    console.log("Curl: ",cUrl);
    var navs = document.getElementsByClassName("nav-link");
    console.log(navs);
    console.log("INIT FOR");
    for(var i = 0; i < navs.length; i++)
    {
        var x=navs[i];
        console.log("Nav[",i,"] = ",x.href.split("?")[0]);
        if(x.href.split("?")[0]==cUrl){
            var parent=x.parentElement.parentElement.parentElement;
            parent.classList.add("open");
            x.classList.add("active");
            console.log("Activo: ",x.href);
            console.log("Its parent is ",parent);
        }
    }
    console.log("END FOR");

}
//-------------------------------------END SIDE BAR---------------------------------------