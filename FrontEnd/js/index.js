let categories =[];
let works=[];
function loadCategories(){

    fetch("http://localhost:5678/api/categories")
    .then((response) => {
        console.log(response);
        if(response.ok){
           return response.json();
        }
    })
    .then((data) =>{
        if(data){
            console.log(data);
            categories = data;
            displayCategories(categories);
            
        }
    })
    .catch((error) => {
        console.log(error);
        alert("Une erreur est survenue! Veuillez contacter l'administrateur du site ! ");
    });
}

function loadWorks(){

    fetch("http://localhost:5678/api/works")
    .then((response) => {
        console.log(response);
        if(response.ok){
           return response.json();
        }
    })
    .then((data) =>{
        if(data){
            console.log(data);
            works = data;
            displayProjects(works);
        }
    })
    .catch((error) => {
        console.log(error);
        alert("Une erreur est survenue! Veuillez contacter l'administrateur du site ! ");
    });
}

function checkIfConnected() {

    if(localStorage.getItem("token") && localStorage.getItem("userId"))
    {
        // afficher les boutons modifier , la barre noir , le menu item logout et 
        const listBtnModifier =document.querySelectorAll(".button-edit");
        listBtnModifier.forEach(element => {
            element.style.display = "flex";
        });
        
        document.querySelector(".mode_connexion").style.display = "flex";
        document.getElementById("logout").style.display = "block";
        document.getElementById("logout").addEventListener("click", function(event){
            event.preventDefault();
            logout();
        });
        // cacher les filtres et le mot login
        document.querySelector(".filtres").style.display = "none";
        document.getElementById("login").style.display = "none";
    } 
        // si t'es pas connecter :
        else{
            // afficher les boutons modifier , la barre noir , le menu item logout et 
            const listBtnModifier =document.querySelectorAll(".button-edit");
            listBtnModifier.forEach(element => {
                element.style.display = "none";
            });
            
            document.querySelector(".mode_connexion").style.display = "none";
            document.getElementById("logout").style.display = "none";
            // cacher les filtres et le mot login
            document.querySelector(".filtres").style.display = "flex";
            document.getElementById("login").style.display = "block";
        } 
}  

function logout(){
    localStorage.clear();
    window.location.reload();
}

loadCategories();
loadWorks();
checkIfConnected();
function displayCategories(categories){
    //Parcourir le tableau
    categories.forEach(element => {
        // creer un element filtre:  div avec le nom de l'element et son id 
        const filtre = createFilter(element);
        // ajout du bouton sur le bloc filtres
        document.querySelector(".filtres").appendChild(filtre);
    }); 
       filterProjects();
       createSelect(categories);
}

function createFilter(category){

    const filter = document.createElement("div");
    filter.className = 'filtre';
    filter.textContent = category.name;
    filter.id = category.id;

    return filter;
}

function createSelect(categories){
    const select = document.getElementById("categorie");
    for (let index = 0; index < categories.length; index++) {
        const element = categories[index];
        const option = document.createElement("option");
        option.setAttribute("class","optionCategorie");
        option.text= element.name;
        option.value= element.id;
        select.appendChild(option);
    }
}

function filterProjects(){
    const btnFilters = document.querySelectorAll(".filtre");
    btnFilters.forEach(element => {
        element.addEventListener('click', function(event){
            
            if(element.id == 0)
            {
                displayProjects(works);
            }
            else{
                const tableauFilter = works.filter(projet => (projet.categoryId == element.id));
                displayProjects(tableauFilter);
            }
        })
    });
}

function displayProjects(projects){
    // selectionner le bloc gallery sur lequel on va afficher les projets
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML="";
    // parcourir avec une boucle for le tableau des projets 
    projects.forEach(element => {
        // creer une figure pour chaque projet 
        const figure = createFigureIndex(element);
        // l'ajouter sous gallery 
        gallery.appendChild(figure);
    });
 
}

function createFigureIndex (projet){
   const figure = document.createElement("figure");
   figure.id = projet.id;
   const image = document.createElement("img");
   image.src = projet.imageUrl;
   image.alt = projet.title;

   const figcaption = document.createElement("figcaption");
   figcaption.textContent = projet.title;
   
   figure.appendChild(image);
   figure.appendChild(figcaption);

    return figure;
}
