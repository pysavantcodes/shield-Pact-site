const chats = document.querySelectorAll(".single-chat");
const modal = document.querySelector(".modal-bg");
const addressVal = document.getElementById("address-val");
const cancel = document.getElementById("cancel")
    //console.log(chats[1].childNodes[0].nextSibling.childNodes[1].innerText);

for (let i = 0; i < chats.length; i++) {
    chats[i].addEventListener("click", () => {
        const address = chats[i].childNodes[0].nextSibling.childNodes[1].innerText;
        modal.style.display = "flex";
        addressVal.innerText = address;
    })
}

cancel.addEventListener("click", () => {
    if (modal.style.display == "flex") {
        modal.style.display = "none";
    }
})