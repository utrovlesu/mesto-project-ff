import { initialCards } from "./cards.js";
import "../pages/index.css"; //удалить, но все ломается


const popups = document.querySelectorAll('.popup');

popups.forEach(function(element) {
    element.classList.add("popup_is-animated");
  });

//шаблон карточки
const cardsContainer = document.querySelector(".places__list");
const cardTemplate = document.querySelector("#card-template").content;

initialCards.forEach((element) => {
  cardsContainer.append(
    createCard(
      element,
      deleteCard,
      handleClickLike,
      handleClickImage,
      cardTemplate
    )
  );
});

//создать карточки, кликнуть лайк, удалить карточку
import { createCard, deleteCard, handleClickLike } from "./components/card.js";

//профайл
const profileEditButton = document.querySelector(".profile__edit-button");
const profileEditPopup = document.querySelector(".popup_type_edit");

//новая карточка
const newCardButton = document.querySelector(".profile__add-button");
const newCardPopup = document.querySelector(".popup_type_new-card");

//открыть, закрыть окно
import { openPopup, closePopup, handleKeyEsc } from "./components/modal.js";

//оверлей и обработка кнопки
function handleClickOverlay(evt) {
  const popupOpen = evt.target.closest(".popup");

  if (
    popupOpen &&
    (evt.target === popupOpen || evt.target.closest(".popup__close"))
  ) {
    closePopup(popupOpen, handleKeyEsc);
    formNewCard.reset();
    
  }
}

//обработчики на кнопки
profileEditButton.addEventListener("click", () =>
  openPopup(profileEditPopup, handleKeyEsc)
);

newCardButton.addEventListener("click", () =>
  openPopup(newCardPopup, handleKeyEsc)
);

popups.forEach(function (object) {
  object.addEventListener("click", handleClickOverlay);
});

// Форма редктирования профиля
const formEditProfile = document.querySelector(".popup__form");
const nameInput = formEditProfile.querySelector(".popup__input_type_name");
const jobInput = formEditProfile.querySelector(".popup__input_type_description");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
nameInput.value = profileTitle.textContent;
jobInput.value = profileDescription.textContent;

// Обработчик «отправки» формы профиля
function handleFormEditProfileSubmit(evt) {
  evt.preventDefault();
  const jobInputValue = jobInput.value;
  const nameInputValue = nameInput.value; 

  profileTitle.textContent = nameInputValue;
  profileDescription.textContent = jobInputValue;

  closePopup(profileEditPopup);
}

// Отправка формы профиля
formEditProfile.addEventListener("submit", handleFormEditProfileSubmit);

// Форма добавления карточки
const formNewCard = document.forms["new-place"];

// Обработчик «отправки» формы карточки
function handleFormNewCardSubmit(evt) {
  evt.preventDefault();
  const nameCardInput = formNewCard.querySelector(".popup__input_type_card-name");
  const urlInput = formNewCard.querySelector(".popup__input_type_url");

  const newCardObject = {
    name: nameCardInput.value,
    link: urlInput.value,
  };
  cardsContainer.prepend(
    createCard(
      newCardObject,
      deleteCard,
      handleClickLike,
      handleClickImage,
      cardTemplate
    )
  );

  formNewCard.reset();

  const popupOpen = evt.target.closest(".popup");
  closePopup(popupOpen);
}

formNewCard.addEventListener("submit", handleFormNewCardSubmit);

//кликнуть по картинке
function handleClickImage(evt) {
  const src = evt.target.src;
  const parent = evt.target.closest(".places__item");
  const caption = parent.querySelector(".card__title").textContent;
  const popupImageContainer = document.querySelector(".popup_type_image");
  openPopup(popupImageContainer);
  const popupImage = popupImageContainer.querySelector(".popup__image");
  popupImage.src = src;
  popupImage.alt = caption;
  popupImageContainer.querySelector(".popup__caption").textContent = caption;
  document.addEventListener("keydown", handleKeyEsc);
}
