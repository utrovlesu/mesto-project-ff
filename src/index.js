import "../pages/index.css";
import { createCard, handleClickLike, deleteCard } from "./components/card.js";
import { openPopup, closePopup } from "./components/modal.js";
import {
  enableValidation,
  clearValidation,
  checkInputValidity,
} from "./validation.js";
import {
  getUserInfo,
  getInitialCards,
  sendUserData,
  addNewCard,
  deleteUserCard,
  likeCard,
  unlikeCard,
  sendUserAvatar,
} from "./api.js";

const api = {
  getUserInfo,
  getInitialCards,
  sendUserData,
  addNewCard,
  deleteUserCard,
  likeCard,
  unlikeCard,
  sendUserAvatar,
};

let initialCards = [];
let userId;

const popups = document.querySelectorAll(".popup");
popups.forEach((element) => {
  element.classList.add("popup_is-animated");
});

// Шаблон карточки
const cardsContainer = document.querySelector(".places__list");
const cardTemplate = document.querySelector("#card-template").content;

// Профайл
const profileEditButton = document.querySelector(".profile__edit-button");
const profileEditPopup = document.querySelector(".popup_type_edit");

// Новая карточка
const newCardButton = document.querySelector(".profile__add-button");
const newCardPopup = document.querySelector(".popup_type_new-card");

// Кнопка удаления
const trashPopup = document.querySelector(".popup_type_delete-card");

// Оверлей и обработка кнопки
function handleClickOverlay(evt) {
  const popupOpen = evt.target.closest(".popup");

  if (
    popupOpen &&
    (evt.target === popupOpen || evt.target.closest(".popup__close"))
  ) {
    closePopup(popupOpen);
  }
}

// Форма редактирования профиля
const formEditProfile = document.forms["edit-profile"];
const nameInput = formEditProfile.querySelector(".popup__input_type_name");
const jobInput = formEditProfile.querySelector(
  ".popup__input_type_description"
);
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

// Обработчик «отправки» формы профиля
function handleFormEditProfileSubmit(evt) {
  evt.preventDefault();

  const buttonElement = formEditProfile.querySelector(".popup__button");
  if (buttonElement.classList.contains("popup__button_disabled")) {
    return;
  }

  let isFormValid = true;
  const inputList = Array.from(
    formEditProfile.querySelectorAll(".popup__input")
  );

  inputList.forEach((inputElement) => {
    if (
      !checkInputValidity(formEditProfile, inputElement, {
        inputErrorClass: "popup__input_type_error",
        errorClass: "popup__error_visible",
      })
    ) {
      isFormValid = false;
    }
  });

  if (!isFormValid) {
    return;
  }

  const userData = {
    name: nameInput.value,
    about: jobInput.value,
  };

  const submitButton = formEditProfile.querySelector(".popup__button");
  submitButton.textContent = "Сохранение...";

  api
    .sendUserData(userData)
    .then((resData) => {
      updateProfile(resData);
    })
    .catch((error) => {
      console.error("Ошибка отправки данных профиля:", error);
    })
    .finally(() => {
      submitButton.textContent = "Сохранить";
    });
}

// Обновить профиль

function updateProfile(data) {
  profileTitle.textContent = data.name;
  profileDescription.textContent = data.about;
  closePopup(profileEditPopup);
}

// Отправка формы профиля
formEditProfile.addEventListener("submit", handleFormEditProfileSubmit);

// Форма добавления карточки
const formNewCard = document.forms["new-place"];
const nameCardInput = formNewCard.querySelector(".popup__input_type_card-name");
const urlInput = formNewCard.querySelector(".popup__input_type_url");

newCardButton.addEventListener("click", () => openPopup(newCardPopup));

// Обновить карточки
function updateCards(data, userId) {
  const newCardObject = {
    likes: data.likes,
    name: data.name,
    link: data.link,
    _id: data._id,
    owner: {
      _id: data.owner._id,
    },
  };

  cardsContainer.prepend(
    createCard(
      newCardObject,
      handleClickLike,
      handleClickImage,
      cardTemplate,
      userId,
      openPopup
    )
  );

  formNewCard.reset();
  clearValidation(formNewCard, {
    inputSelector: ".popup__input",
    submitButtonSelector: ".popup__button",
    inactiveButtonClass: "popup__button_disabled",
    inputErrorClass: "popup__input_type_error",
    errorClass: "popup__error_visible",
  });

  closePopup(newCardPopup);
}

// Обработчики на кнопки
profileEditButton.addEventListener("click", () => {
  openPopup(profileEditPopup);
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(formEditProfile, {
    inputSelector: ".popup__input",
    submitButtonSelector: ".popup__button",
    inactiveButtonClass: "popup__button_disabled",
    inputErrorClass: "popup__input_type_error",
    errorClass: "popup__error_visible",
  });
});

popups.forEach((object) => {
  object.addEventListener("click", handleClickOverlay);
});

const popupImageContainer = document.querySelector(".popup_type_image");
const popupImage = popupImageContainer.querySelector(".popup__image");

// Кликнуть по картинке
function handleClickImage(evt) {
  const src = evt.target.src;
  const parent = evt.target.closest(".places__item");
  const caption = parent.querySelector(".card__title").textContent;

  openPopup(popupImageContainer);

  popupImage.src = src;
  popupImage.alt = caption;
  popupImageContainer.querySelector(".popup__caption").textContent = caption;
}

enableValidation({
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
});

// API
const token = "b2612306-5efa-42fe-befe-e170f4680808";
const avatarURL = document.querySelector(".profile__image");

// Инициализация приложения
Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([userData, cardsData]) => {
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    avatarURL.style.backgroundImage = `url(${userData.avatar})`;
    userId = userData._id;
    console.log("userId при загрузке страницы:", userId);

    initialCards = cardsData;

    initialCards.forEach((element) => {
      cardsContainer.append(
        createCard(
          element,
          handleClickLike,
          handleClickImage,
          cardTemplate,
          userId,
          openPopup
        )
      );
    });
  })
  .catch((error) => {
    console.error("Ошибка получения данных:", error);
  });

// Обработчик «отправки» формы карточки
function handleFormNewCardSubmit(evt) {
  evt.preventDefault();

  if (!userId) {
    console.error("userId не определен, карточка не может быть создана");
    return;
  }

  const buttonElement = formNewCard.querySelector(".popup__button");
  if (buttonElement.classList.contains("popup__button_disabled")) {
    return;
  }

  const newCardObject = {
    name: nameCardInput.value,
    link: urlInput.value,
  };

  const submitButton = formNewCard.querySelector(".popup__button");
  submitButton.textContent = "Сохранение...";

  api
    .addNewCard(newCardObject)
    .then((resData) => {
      updateCards(resData, userId);
    })
    .catch((error) => {
      console.error("Ошибка отправки данных карточки:", error);
    })
    .finally(() => {
      submitButton.textContent = "Сохранить";
    });
}

// Обработчик отправки формы карточки
formNewCard.addEventListener("submit", handleFormNewCardSubmit);

// Удалить карточку с сервера
let cardDelete = null;
let cardIdDelete = null;

export function openDeletePopup(cardElement, cardId) {
  cardDelete = cardElement;
  cardIdDelete = cardId;
  openPopup(trashPopup);
}

const formConfirmDelete = document.forms["confirm-delete-card"];

function deleteCardFromServer(cardData, cardElement) {
  const cardID = cardData._id;

  api
    .deleteUserCard(cardID)
    .then(() => deleteCard(cardElement))
    .catch((error) => {
      console.error("Ошибка удаления карточки:", error);
      if (error.response) {
        error.response.json().then((data) => {
          console.error("Детали ошибки:", data);
        });
      }
    });
}

function handleFormConfirmDeleteSubmit(evt) {
  evt.preventDefault();
  if (!cardDelete || !cardIdDelete) {
    console.error("Карточка или её ID не определены");
    return;
  }
  api
    .deleteUserCard(cardIdDelete)
    .then(() => {
      deleteCard(cardDelete);
      closePopup(trashPopup);
    })
    .catch((error) => {
      console.error("Ошибка удаления карточки:", error);
    });
}

//обработчик подтверждения удаления

formConfirmDelete.addEventListener("submit", handleFormConfirmDeleteSubmit);

//элементы для редактирования аватара
const formEditAvatar = document.forms["new-avatar"];
const inputUrlAvatar = formEditAvatar.querySelector(".popup__input_type_url");
const popupNewAvatar = document.querySelector(".popup_type_new-avatar");
const editAvatarButton = document.querySelector(".profile__avatar-edit-button");

editAvatarButton.addEventListener("click", () => {
  openPopup(popupNewAvatar);
});

function updateUserAvatar(data) {
  const avatarImg = document.querySelector(".profile__image");
  avatarImg.style.backgroundImage = `url('${data.avatar}')`;
}

function handleFormEditAvatarSubmit(evt) {
  evt.preventDefault();
  const userData = {
    avatar: inputUrlAvatar.value,
  };
  const url = userData.avatar;
  const submitButton = formEditAvatar.querySelector(".popup__button");
  submitButton.textContent = "Сохранение...";
  api
    .sendUserAvatar(url)
    .then((resData) => {
      updateUserAvatar(resData);
    })
    .catch((error) => {
      console.error("Ошибка загрузки аватара:", error);
    })
    .finally(() => {
      submitButton.textContent = "Сохранить";
    });
  closePopup(popupNewAvatar);
  formEditAvatar.reset();
}

formEditAvatar.addEventListener("submit", handleFormEditAvatarSubmit);
