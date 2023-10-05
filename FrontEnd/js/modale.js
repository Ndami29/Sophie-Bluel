// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
const listBtnModifier =document.querySelectorAll(".button-edit");
listBtnModifier.forEach(element => {
      // When the user clicks on the button, open the modal
      element.onclick = function() {
        modal.style.display = "block";
        displayProjectInModal();
      }
        });

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];



// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

//Créer des petites figures sur la modale//
function createFigureModale(projet){
  const figure  = document.createElement("figure");
  figure.id = "figureModale"+projet.id;
  figure.setAttribute("class", "figureModale");
  const image = document.createElement("img");
  image.src = projet.imageUrl;
  image.alt = projet.title;

  const icon = document.createElement("div");
  icon.setAttribute("class", "icon");
  icon.addEventListener("click", function(event){
  const confirmation = confirm("Voulez vous supprimer le projet numero: "+ projet.id);
  if(confirmation){
    // je vais proceder à la suppression du projet
    deleteProjet(projet.id);
  }
});
  const trash = document.createElement("i");
  trash.setAttribute("class", "fa-solid fa-trash-can");
  
  icon.appendChild(trash);
  
  const edit  = document.createElement("figcation");
  edit.textContent = "editer";
  
  figure.appendChild(image);
  figure.appendChild(edit);
  figure.appendChild(icon);

   return figure;
}

function displayProjectInModal(){
  const gallery = document.querySelector(".photos");
  gallery.innerHTML="";
  works.forEach(element => {
      const projet = createFigureModale(element);
      gallery.appendChild(projet);
  });

  const ajoutProjet = document.querySelector(".add");
ajoutProjet.addEventListener("click", function(event){

  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.style.display = "none";
  const modalAjout = document.querySelector(".modal-ajout");
  modalAjout.style.display = "flex";
  const returnBtn = document.querySelector(".return");
  returnBtn.style.display = "block";
  returnBtn.addEventListener("click", function(event){

    const modalGallery = document.querySelector(".modal-gallery");
    modalGallery.style.display = "flex";
    const modalAjout = document.querySelector(".modal-ajout");
    modalAjout.style.display = "none";
    const returnBtn = document.querySelector(".return");
    returnBtn.style.display = "none";
  
  });

});
}



function deleteProjet(id){

fetch(`http://localhost:5678/api/works/${id}`, {
  method: 'DELETE',
  headers:{
    Accept: '*/*',
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  }
})
.then((response) => {
  console.log(response);
        if(response.status == 204){
            alert("Elément supprimé avec succes!");
           // Supprimer le projet depuis le tableau globale
            works = works.filter(element => element.id !== id);

            // Supprimer le projet depuis la gallery
            const projetGallery = document.getElementById(id);
            projetGallery.remove();

            //Supprimer le projet depuis la modale
            const projetModale = document.getElementById("figureModale"+id);
            projetModale.remove();
            
        }
        if(response.status == 401){
            alert("Impossible de supprimer l'élement, Veuillez vous authentifier ! ");
        }
})
.catch((error) => {
  alert("Une erreur est survenue , Veuillez contacter l'admin ! ");
});

}


// Fonction pour basculer entre display:none et display:flex des bloc previewImage et formIlmage//

document.getElementById('file').addEventListener("change", function(e){
  e.preventDefault();
  const file = document.getElementById('file').files[0];
  //verifier si un fichier est selectionné
  if(file){ 
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(event){
      const formImage = document.querySelector(".formImage");
      formImage.style.display = "none";
    
      const previewImage = document.querySelector(".previewImage");
      previewImage.style.display = "flex";
    
      const image = document.getElementById("imageSeletionne");
      image.src=event.target.result;

      const remove = document.querySelector('.remove');
      remove.addEventListener("click", function(event){
        const formImage = document.querySelector(".formImage");
      formImage.style.display = "flex";
    
      const previewImage = document.querySelector(".previewImage");
      previewImage.style.display = "none";
      const image = document.getElementById("imageSeletionne");
      image.src="";


    
      });
    }
}
else{
  alert("Veuillez selectionner un fichier image!");
}


});

document.getElementById("addProject").addEventListener("click", function(e){
  //recuprer les champs : file, titre et categorie
  const file = document.getElementById("file").files[0];
  const titre =  document.getElementById("titre").value;
  const categorie =  document.getElementById("categorie").value;
  

  //verifier que tu as les champs remplis
  if(!file || titre=="" || categorie==""){
    alert("Veuillez remplir le formulaire !");
  }
  else{

  const formData = new FormData();
  formData.append("title", titre);
  formData.append("category", categorie);
  formData.append("image", file);
  //Invoquer le fetch en methode post : voir la documentation sur swagger 
  fetch("http://localhost:5678/api/works", {
    method: 'POST',
    headers:{
      Accept: 'application/json',
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData
  })
  .then((response) =>{
    console.log(response);
    if(response.status == 400){
        alert("Erreur lors d'ajout du projet !");
    }
    if(response.status == 401){
      alert("Veuillez refaire l'authentification !");
  }
    if(response.status == 201){
        alert("Projet ajoutée ! ");
        return response.json();
    }
  })
  .then(projet  =>{
    if(projet != null){
    console.log(projet);
    // Ajouter le projet dans le tableau globale
    works.push(projet);

    // Ajouter le projet dans la gallery
    const projetGallery = createFigureIndex(projet);
    document.querySelector(".gallery").appendChild(projetGallery);

    //Supprimer le projet depuis la modale
    const projetModale =createFigureModale(projet);
    document.querySelector(".photos").appendChild(projetModale);

    const returnBtn = document.querySelector(".return");
    returnBtn.click();
    }
  })
  .catch((error) => {
    alert("Une erreur est survenue , Veuillez contacter l'admin ! ");
  });
}});