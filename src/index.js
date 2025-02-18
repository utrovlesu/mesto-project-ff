import "../pages/index.css";
import { createCard, deleteCard, handleClickLike } from "./components/card.js";
import { openPopup, closePopup } from "./components/modal.js";
import { enableValidation, clearValidation, checkInputValidity } from "./validation.js";

let initialCards = [];
let userId;

const popups = document.querySelectorAll('.popup');
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
const trashButton = document.querySelector('.card__delete-button');
const trashPopup = document.querySelector('.popup_type_delete-card');

// Оверлей и обработка кнопки
function handleClickOverlay(evt) {
  const popupOpen = evt.target.closest(".popup");

  if (popupOpen && (evt.target === popupOpen || evt.target.closest(".popup__close"))) {
    closePopup(popupOpen);
  }
}

// Форма редактирования профиля
const formEditProfile = document.forms["edit-profile"];
const nameInput = formEditProfile.querySelector(".popup__input_type_name");
const jobInput = formEditProfile.querySelector(".popup__input_type_description");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

// Обработчик «отправки» формы профиля
function handleFormEditProfileSubmit(evt) {
  evt.preventDefault();

  const buttonElement = formEditProfile.querySelector('.popup__button');
  if (buttonElement.classList.contains('popup__button_disabled')) {
    return;
  }

  let isFormValid = true;
  const inputList = Array.from(formEditProfile.querySelectorAll('.popup__input'));

  inputList.forEach((inputElement) => {
    if (!checkInputValidity(formEditProfile, inputElement, {
      inputErrorClass: 'popup__input_type_error',
      errorClass: 'popup__error_visible'
    })) {
      isFormValid = false;
    }
  });

  if (!isFormValid) {
    return;
  }

  const userData = {
    name: nameInput.value,
    about: jobInput.value
  };

  api.sendUserData(userData)
  .then((resData) => {
    updateProfile(resData); 
  })
  .catch((error) => {
    console.error('Ошибка отправки данных профиля:', error);
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
  console.log('userId в updateCards:', userId);
  console.log('cardData.owner._id:', data.owner._id);

  const newCardObject = {
    likes: data.likes,
    name: data.name,
    link: data.link,
    _id: data._id,
    owner: {
      _id: data.owner._id
    }
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
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
  });

  closePopup(newCardPopup);
}

// Обработчики на кнопки
profileEditButton.addEventListener("click", () => {
  openPopup(profileEditPopup);
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(formEditProfile, {
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
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
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
});

// API
const token = 'b2612306-5efa-42fe-befe-e170f4680808';
const avatarURL = document.querySelector('.profile__image');

const api = {
  getUserInfo() {
    return fetch(`https://nomoreparties.co/v1/pwff-cohort-1/users/me`, {
      headers: {
        authorization: token
      }
    })
    .then(res => {
      if (res.ok) return res.json();
      return Promise.reject(`Ошибка: ${res.status}`);
    });
  },

  getInitialCards() {
    return fetch(`https://nomoreparties.co/v1/pwff-cohort-1/cards`, {
      headers: {
        authorization: token
      }
    })
    .then(res => {
      if (res.ok) return res.json();
      return Promise.reject(`Ошибка: ${res.status}`);
    });
  },

  sendUserData(data) {
    return fetch(`https://nomoreparties.co/v1/pwff-cohort-1/users/me`, {
      method: 'PATCH',
      headers: {
        authorization: token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res => {
      if (res.ok) return res.json();
      return Promise.reject(`Ошибка: ${res.status}`);
    });
  },

  sendNewCard(data) {
    return fetch(`https://nomoreparties.co/v1/pwff-cohort-1/cards`, {
      method: 'POST',
      headers: {
        authorization: token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res => {
      if (res.ok) return res.json();
      return Promise.reject(`Ошибка: ${res.status}`);
    });
  },

  deleteCardFromServer(cardID) {
    return fetch(`https://nomoreparties.co/v1/pwff-cohort-1/cards/${cardID}`, {
      method: 'DELETE',
      headers: {
        authorization: token
      }
    })
    .then(res => {
      if (res.ok) return res.json();
      return Promise.reject(`Ошибка: ${res.status}`);
    });
  },

  sendLikeToServer(cardID) {
    return fetch(`https://nomoreparties.co/v1/pwff-cohort-1/cards/likes/${cardID}`, {
      method: 'PUT',
      headers: {
        authorization: token
      }
    })
    .then(res => {
      if (res.ok) return res.json();
      return Promise.reject(`Ошибка: ${res.status}`);
    });
  }
};

// Инициализация приложения
Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([userData, cardsData]) => {
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    avatarURL.style.backgroundImage = `url(${userData.avatar})`;
    userId = userData._id;
    console.log('userId при загрузке страницы:', userId);

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
    console.error('Ошибка получения данных:', error);
  });

// Обработчик «отправки» формы карточки
function handleFormNewCardSubmit(evt) {
  evt.preventDefault();

  if (!userId) {
    console.error('userId не определен, карточка не может быть создана');
    return;
  }

  const buttonElement = formNewCard.querySelector('.popup__button');
  if (buttonElement.classList.contains('popup__button_disabled')) {
    return;
  }

  const newCardObject = {
    name: nameCardInput.value,
    link: urlInput.value,
  };
  api.sendNewCard(newCardObject)
    .then((resData) => {
      console.log('Карточка создана:', resData);
      console.log('userId в sendNewCard:', userId);
      updateCards(resData, userId);
    })
    .catch((error) => {
      console.error('Ошибка отправки данных карточки:', error);
    });
}

// Обработчик отправки формы карточки
formNewCard.addEventListener("submit", handleFormNewCardSubmit);

// Удалить карточку с сервера
function deleteCardFromServer(cardData, cardElement) {
  const cardID = cardData._id;
  api.deleteCardFromServer(cardID)
    .then(() => deleteCard(cardElement))
    .catch((error) => {
      console.error('Ошибка удаления карточки:', error);
    });
}

function handleFormConfirmDeleteSubmit(evt) {
  evt.preventDefault();

  const cardData = {
    _id: trashPopup.dataset.cardId
  };
  const cardElement = document.querySelector('.places__item');

  deleteCardFromServer(cardData, cardElement);
  closePopup(trashPopup);
}

const formConfirmDelete = document.forms["confirm-delete-card"];
formConfirmDelete.addEventListener("submit", handleFormConfirmDeleteSubmit);