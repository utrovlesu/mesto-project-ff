import {
  getUserInfo,
  getInitialCards,
  updateUserInfo,
  addNewCard,
  deleteCard,
  likeCard,
  unlikeCard,
  updateUserAvatar
} from '../api.js';

const api = {
  getUserInfo,
  getInitialCards,
  updateUserInfo,
  addNewCard,
  deleteCard,
  likeCard,
  unlikeCard,
  updateUserAvatar
};

//создать карточки

export function createCard(cardData, handleClickLike, onImage, cardTemplate, userId, openPopup) {
  const cardItem = cardTemplate.querySelector(".places__item").cloneNode(true);
  const image = cardItem.querySelector(".card__image");
  const trashButton = cardItem.querySelector('.card__delete-button');
  const likeButton = cardItem.querySelector('.card__like-button');

  image.src = cardData.link;
  image.alt = cardData.name;
  cardItem.querySelector(".card__title").textContent = cardData.name;
  cardItem.querySelector(".card__like-count").textContent = cardData.likes.length;
  
  
  //удаление карточки
  if(cardData.owner._id !== userId) {
  cardItem.querySelector('.card__delete-button').remove();
  
    }
  else {
  trashButton.addEventListener("click", () => {
    openPopup(trashPopup);
    trashPopup.dataset.cardId = cardData._id;
    
    }
    );
  }
  //кнопка лайк
   likeButton.addEventListener("click", () => {
    handleClickLike(cardData, likeButton);
  });

  //клик по картинке
  
  image.addEventListener("click", onImage);

  return cardItem;
}

//кликнуть лайк
export function handleClickLike(cardData, likeButton) {
  
  const cardID = cardData._id;

  const isLiked = likeButton.classList.contains('card__like-button_is-active');

  if (isLiked) {
    api.unlikeCard(cardID, 'DELETE')
    .then((updatedCard) => {
      likeButton.classList.remove('card__like-button_is-active');
      updateLikeCount(likeButton, updatedCard.likes.length); 
    })
    .catch((error) => {
      console.error('Ошибка при удалении лайка:', error);
    });
  } else {
 
  api.likeCard(cardID, 'PUT')
    .then((updatedCard) => {
      likeButton.classList.add('card__like-button_is-active');
      updateLikeCount(likeButton, updatedCard.likes.length); 
    })
    .catch((error) => {
      console.error('Ошибка при добавлении лайка:', error);
    });
  }
}

//удалить карточку
/*
export function deleteCard(card) {
  if (card && card.remove) {
    card.remove(); 
  } else {
    console.error("Ошибка: card не является DOM-элементом");
  }
}*/

function updateLikeCount(likeButton, likeCount) {
  const likeCountElement = likeButton.closest('.card').querySelector('.card__like-count');
  likeCountElement.textContent = likeCount;
}