document.querySelector(".form").addEventListener("submit", function(event){
    event.preventDefault();
    login();
});

function login(){
    
    fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        headers:{
            'accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "email": document.getElementById("email").value , //"sophie.bluel@test.tld"
            "password": document.getElementById("password").value , //"S0phie"
          }),
        
    })
    .then((response) =>{
        console.log(response);
        if(response.status == 404){
            alert("User non trouvé! veuillez vous inscrire ! ");
        }
        if(response.status == 401){
            alert("Veuillez verifier votre login et mot de passe ! ");
        }
        if(response.status == 200){
           return response.json();
        }
    })
    .then((user)=> {
        if(user){
            console.log(user);
            // sauvegarder les parametres user id et token dans le localstorage 
            localStorage.setItem("userId", user.userId);
            localStorage.setItem("token", user.token);
            window.location.href= "./index.html";
        }
    })
    .catch((error) => {
            alert("Une erreur est survenue , Veuillez contacter l'admin ! ");
    });
}
