//EJECUTADORES
identificar(); //Match the user with the user registered in COOKIE
window.onload = function(){
    console.log("Window loaded");
    document.getElementById("logout").addEventListener("click",delCookies);
    addParameterToLink();
    setActiveNavs();
    getData();
    setSearch();
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
    var navLink=document.getElementsByClassName("nav-link");
    //console.log("Navlinks: ",navLink);
    for(var i=0;i<navLink.length;i++){
        var aux=navLink[i];
        //console.log("Adding link user to: ",aux);
        addUser(aux);
    }
}

function setActiveNavs(){
    //let link = value;
    //console.log("Activado el nav de la pagina :V");
    let cUrl = String(window.location).split('?')[0];
    //console.log("Curl: ",cUrl);
    var navs = document.getElementsByClassName("nav-link");
    //console.log(navs);
    //console.log("INIT FOR");
    for(var i = 0; i < navs.length; i++)
    {
        var x=navs[i];
        //console.log("Nav[",i,"] = ",x.href.split("?")[0]);
        if(x.href.split("?")[0]==cUrl){
            var parent=x.parentElement.parentElement.parentElement;
            parent.classList.add("open");
            x.classList.add("active");
            //console.log("Activo: ",x.href);
            //console.log("Its parent is ",parent);
        }
    }
    //console.log("END FOR");

}
//-------------------------------------END SIDE BAR--------------------------------------
//-------------------------------------TABLE---------------------------------------------
function getData(){
    var headers={
        "Content-Type":"application/json; charset=utf-8",
        "Authorization":getCookie("JWT")
    };
    var url="http://localhost:8080/AppUser/all"
    var tableData;
    fetch(url,{
      method:"GET",
      headers:headers,
    }).then(response=>response.json())
    .then(function(data){
        tableData=JSON.parse(JSON.stringify(data));
        console.log("COPIA in fetch: ",tableData);
        var table=document.getElementById("table");
        var flag=true;
        for(var i in tableData){
            flag=true;
            var row=document.createElement("TR");
            var m=0;
            for(var j in tableData[i]){
                var cell;
                if(flag){
                    cell=document.createElement("TH");
                }else{
                    cell=document.createElement("TD");
                }
                flag=false;
                cell.innerHTML=tableData[i][j];
                //console.log("cell: ",tableData[i][j]);
                row.appendChild(cell);
                m++;
            }
            table.appendChild(row);
        }
    });
}
function filterData(){
    var dataFilter=this.value;
    var regex = new RegExp(dataFilter, "i");
    console.log("Value to filter: ",dataFilter);
    var table=document.getElementById("products");
    for (var i = 1, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        var found=false;
        for (var j = 0, col; col = row.cells[j]; j++) {
            //console.log("j : ",col.innerHTML);
            var matters=col.innerHTML.match(regex);
            if(matters!=null){
                found=true;
                console.log("Value that matchs: ",col.innerHTML);
                console.log("matters: ",matters)
            }
          //iterate through columns
          //columns would be accessed using the "col" variable assigned in the for loop
        }
        //console.log("row: ",row)
        if(found==false){
            row.style.display = "none";
        }else{
            row.style.display = "";
        }
     }
}
function setSearch(){
    document.getElementById("search").addEventListener("keyup",filterData);
}
//-------------------------------------END TABLE--------------------------------------