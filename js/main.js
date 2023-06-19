let API = "http://localhost:8000/contacts";

const resetBtn = document.querySelector(".reset-btn");
const addForm = document.querySelector(".add-contact-info");
const addName = document.querySelector("#addName");
const addSurname = document.querySelector("#addSurname");
const addPicture = document.querySelector("#addPicture");
const addNumber = document.querySelector("#addNumber");

const editModal = document.querySelector("#edit-modal");
const closeModalBtn = document.querySelector("#close-modal");
const editName = document.querySelector("#editName");
const editSurname = document.querySelector("#editSurname");
const editPicture = document.querySelector("#editPicture");
const editNumber = document.querySelector("#editNumber");

const editCancel = document.querySelector("#edit-cancel");
const editSubmit = document.querySelector(".edit-submit");

const contactContainer = document.querySelector("#contact-container");

//!   GET
async function getContacts() {
  const res = await fetch(API);
  const data = await res.json();
  return data;
}

//!  getting one element
async function getOneContact(id) {
  const res = await fetch(`${API}/${id}`);
  const data = await res.json();
  return data;
}

//!   POST
async function addContact(newContact) {
  await fetch(API, {
    method: "POST",
    body: JSON.stringify(newContact),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

//!  DELETE

async function deleteContact(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
}

//!  PATCH заменяет частично

async function editContact(newData, id) {
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(newData),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

//todod   ------------------------------------------

render();

async function render() {
  const data = await getContacts();
  contactContainer.innerHTML = "";
  data.forEach((item) => {
    contactContainer.innerHTML += `
    <div class="contact-item">
      <div id="inputs">
      <img src="${item.picture}" alt="" id="imgId" />
        <span>${item.name}</span>
        <span>${item.surname}</span>
        <span>${item.number}</span>
      </div>
      <div>
        <button id="${item.id}" class="edit-btn">Edit</button>
        <button id="${item.id}" class="delete-btn">Delete</button>
      </div>
    </div>`;
  });
}

addForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (
    !addName.value.trim() ||
    !addSurname.value.trim() ||
    !addNumber.value.trim() ||
    !addPicture.value.trim()
  ) {
    alert("Fill all blank");
    return;
  }

  const contact = {
    name: addName.value,
    surname: addSurname.value,
    picture: addPicture.value,
    number: addNumber.value,
  };

  addName.value = "";
  addSurname.value = "";
  addPicture.value = "";
  addNumber.value = "";

  await addContact(contact);
  render();
});

//!    DELETE

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    await deleteContact(e.target.id);
    render();
  }
});

//!  EDIT

let id = null;

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("edit-btn")) {
    editModal.style.visibility = "visible";
    const contact = await getOneContact(e.target.id);

    id = e.target.id;

    editName.value = contact.name;
    editSurname.value = contact.surname;
    editPicture.value = contact.picture;
    editNumber.value = contact.number;

    editName.focus();
  }
});

//!  CLOSE

function close() {
  editModal.style.visibility = "hidden";
}

closeModalBtn.addEventListener("click", close);
editCancel.addEventListener("click", close);

//!   SAVE

editSubmit.addEventListener("click", async () => {
  if (
    !editName.value.trim() ||
    !editSurname.value.trim() ||
    !editNumber.value.trim() ||
    !editPicture.value.trim()
  ) {
    return;
  }

  const newContact = {
    name: editName.value,
    surname: editSurname.value,
    picture: editPicture.value,
    number: editNumber.value,
  };

  await editContact(newContact, id);
  render();
  close();
});
