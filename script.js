function goAjout(){
    window.location.href="ajout.html"
}

var produits = JSON.parse(localStorage.getItem("produits")) || [];
var tbody = document.getElementById("produits-body");
var input = document.getElementById("input");
var prix = document.getElementById("prix");
var imageInput = document.getElementById("imageInput");
var button = document.getElementById("button");
var compteur = document.querySelector("h1");
var clear = document.querySelector("#clear");
var sort = document.querySelector("#sort");
var form = document.getElementById("form");
var search = document.getElementById("recherche");

function afficheProduits(liste = produits) {
    tbody.innerHTML = "";

    liste.forEach((el, index) => {

        var tr = document.createElement("tr");
        var tdId = document.createElement("td");
        var tdImage = document.createElement("td");
        var tdAction = document.createElement("td");
        var tdPrix = document.createElement("td");
        var tdVendu = document.createElement("td");
        var tdDate = document.createElement("td");
        var tdActions = document.createElement("td");

        tdId.textContent = el.id.slice(0, 3);
        tdAction.textContent = el.value;
        tdPrix.textContent = el.prix + " DT";
        tdVendu.textContent = el.vendu ? "Oui" : "Non";
        tdDate.textContent = new Date(el.date).toLocaleString();

        if (el.image) {
            var img = document.createElement("img");
            img.src = el.image;
            img.style.width = "60px";
            img.style.borderRadius = "5px";
            tdImage.appendChild(img);
        }

        var imgEdit = document.createElement("img");
        imgEdit.src = "/edit.png";
        imgEdit.style.width = "25px";
        imgEdit.style.marginRight = "10px";
        imgEdit.style.cursor = "pointer";

        imgEdit.onclick = () => { 
            var inputEdit = document.createElement("input"); 
            inputEdit.style.border = "1px solid #ddd";
            inputEdit.style.padding = "5px";
            inputEdit.value = el.value;
            tdAction.innerHTML = "";
            tdAction.appendChild(inputEdit);
            inputEdit.focus();
            inputEdit.addEventListener("keydown", function(e) {
                if (e.key === "Enter") {
                    imgEditFunc(el.id, inputEdit.value);
                }
            });
            inputEdit.addEventListener("blur", function() {
                imgEditFunc(el.id, inputEdit.value);
            });
        };

        var imgSupp = document.createElement("img");
        imgSupp.src = "/trash.png";
        imgSupp.style.width = "25px";
        imgSupp.style.cursor = "pointer";

        imgSupp.onclick = (event) => {
            event.stopPropagation();
            supprimerProduit(index);
        };

        tdActions.append(imgEdit, imgSupp);

        if (el.vendu === true) {
            tdVendu.classList.add('vendu-style');
        }

        tdVendu.style.cursor = "pointer";

        tdVendu.onclick = () => {
            produitVendu(el);
        };

        tr.append(tdId, tdAction, tdPrix, tdVendu, tdDate, tdImage, tdActions);
        tbody.appendChild(tr);
    });

    compteurProduits();
}

if(form){
    form.addEventListener("submit", function(e){
        e.preventDefault(); 

        var file = imageInput.files[0];
        var reader = new FileReader();

        reader.onloadend = function () {

            var produit = {
                id: crypto.randomUUID(),
                value: input.value,
                prix: prix.value,
                image: file ? reader.result : null,
                date: new Date().toISOString(), 
                vendu: false,
            };

            produits.push(produit);
            localStorage.setItem("produits", JSON.stringify(produits));

            input.value = "";
            prix.value = "";
            imageInput.value = "";

            window.location.href="index.html";
        };

        if (file) {
            reader.readAsDataURL(file);
        } else {
            reader.onloadend();
        }
    });
}

function produitVendu(el) {
    el.vendu = !el.vendu;
    localStorage.setItem("produits", JSON.stringify(produits));
    afficheProduits();
}

function supprimerProduit(index) {
    produits.splice(index, 1);
    localStorage.setItem("produits", JSON.stringify(produits));
    afficheProduits();
}

function compteurProduits() {
    if (compteur) {
        compteur.textContent = "On a : " + produits.length + " produits";
    }
}

if(clear){
    clear.addEventListener("click", function () {
        if (confirm("Vous être sur de vouloir supprimer tous les produits ?")) {
            produits = [];
            localStorage.setItem("produits", JSON.stringify(produits));
            tbody.innerHTML = "";
            compteurProduits();
        }
    });
}

if(sort){
    sort.addEventListener("click", function () {
        produits = produits.sort((a, b) => new Date(b.date) - new Date(a.date));
        afficheProduits();
    });
}

function imgEditFunc(id, value) { 
    produits = produits.map((el) => { 
        if (el.id === id) { 
            return { 
                id: el.id, 
                value: value, 
                prix: el.prix, 
                image: el.image, 
                date: el.date, 
                vendu: el.vendu, 
            }; 
        } 
        return el; 
    }); 

    localStorage.setItem("produits", JSON.stringify(produits)); 
    afficheProduits(); 
}

if(search){
    search.addEventListener("input", function(){
        var mot = search.value.toLowerCase();
        var resultats = produits.filter((el)=>{
            return el.value.toLowerCase().includes(mot);
        });

        if(mot === ""){
            afficheProduits();
        }else{
            afficheProduits(resultats);
        }
    });
}

afficheProduits();