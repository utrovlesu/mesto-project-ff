import { initialCards } from './cards.js';
import '../pages/index.css';

//шаблон карточки
const cardsContainer = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content;

initialCards.forEach((element) => {      
    cardsContainer.append(createCard(element, deleteCard, handleClickLike, handleClickImage, cardTemplate));
});

//создать карточки, кликнуть лайк, удалить карточку
import { createCard, deleteCard, handleClickLike } from './components/card.js';


//профайл 
const editProfileButton = document.querySelector('.profile__edit-button');
const editProfilePopup= document.querySelector('.popup_type_edit');

//новая карточка
const newCardButton = document.querySelector('.profile__add-button');
const newCardPopup = document.querySelector('.popup_type_new-card');

//кнопка закрытия окна
const closeButtons = document.querySelectorAll('.popup__close');

//оверлей
const overlays = document.querySelectorAll('.popup');

//нажать Esc
function handleKeyEsc (evt) {
    if(evt.key === 'Escape'){     
        const popupOpen = document.querySelector('.popup_is-opened');

        if(popupOpen) {
            closePopup(popupOpen, handleKeyEsc);
        }               
    }
}

//открыть, закрыть окно
import { openPopup, closePopup } from './components/modal.js';

//оверлей и обработка кнопки
function handleClickOverlay (evt) {
    const popupOpen = evt.target.closest('.popup');

    if(popupOpen && (evt.target === popupOpen || evt.target.closest('.popup__close'))) {
        closePopup(popupOpen, handleKeyEsc);
        const formsInsidePopup = popupOpen.querySelectorAll('form');
        formsInsidePopup.forEach((form) => form.reset());
    }
}

//обработчики на кнопки
editProfileButton.addEventListener('click', () => openPopup(editProfilePopup, handleKeyEsc));

newCardButton.addEventListener('click', () => openPopup(newCardPopup, handleKeyEsc));

overlays.forEach(function (object) {
    object.addEventListener('click', handleClickOverlay);
});

// Форма редктирования профиля
const formElement = document.querySelector('.popup__form');
const nameInput = formElement.querySelector('.popup__input_type_name');
const jobInput = formElement.querySelector('.popup__input_type_description');


// Обработчик «отправки» формы профиля
function handleFormSubmit(evt) {
    evt.preventDefault();     
    const jobInputValue = jobInput.value;
    const nameInputValue = nameInput.value;
   
    const profileTitle = document.querySelector('.profile__title');
    const profileDescription = document.querySelector('.profile__description');

    profileTitle.textContent =  nameInputValue;
    profileDescription.textContent = jobInputValue;
    
    formElement.reset();

    const popupOpen = evt.target.closest('.popup');
    closePopup(popupOpen);
}

// Отправка формы
formElement.addEventListener('submit', handleFormSubmit); 

// Форма добавления карточки
const formCard = document.forms['new-place'];

// Обработчик «отправки» формы карточки
function handleFormCardSubmit(evt) {
    evt.preventDefault();    
    const nameCardInput = formCard.querySelector('.popup__input_type_card-name');
    const urlInput = formCard.querySelector('.popup__input_type_url');
    
    const newCardObject = {
        name: nameCardInput.value,
        link: urlInput.value
    };
    cardsContainer.prepend(createCard(newCardObject, deleteCard, handleClickLike, handleClickImage, cardTemplate));     
    
    formCard.reset();

    const popupOpen = evt.target.closest('.popup');
    closePopup(popupOpen);
}

formCard.addEventListener('submit', handleFormCardSubmit); 

//кликнуть по картинке
function handleClickImage (evt){
    const src = evt.target.src;
    const parent = evt.target.closest('.places__item');
    const caption = parent.querySelector('.card__title').textContent;
    const popuoImageContainer = document.querySelector('.popup_type_image');
    popuoImageContainer.classList.add('popup_is-animated');
    setTimeout(() => {
        popuoImageContainer.classList.add('popup_is-opened');  
   }, 100);
    const popupImage = popuoImageContainer.querySelector('.popup__image');
    popupImage.src = src;
    popupImage.alt = caption;
    popuoImageContainer.querySelector('.popup__caption').textContent = caption;
    document.addEventListener('keydown', handleKeyEsc);   
}    