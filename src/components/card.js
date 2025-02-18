//создать карточки

export function createCard(cardData, onLike, onImage, cardTemplate, userId, openPopup) {
  const cardItem = cardTemplate.querySelector(".places__item").cloneNode(true);
  const image = cardItem.querySelector(".card__image");

  image.src = cardData.link;
  image.alt = cardData.name;
  cardItem.querySelector(".card__title").textContent = cardData.name;
  cardItem.querySelector(".like-count").textContent = cardData.likes.length;
  
  const trashButton = cardItem.querySelector('.card__delete-button');
  const trashPopup = document.querySelector('.popup_type_delete-card');



  //удаление карточки
if(cardData.owner._id !== userId) {
  cardItem.querySelector('.card__delete-button').remove();
  
}
else {
  trashButton.addEventListener("click", () => {
    openPopup(trashPopup);
    trashPopup.dataset.cardId = cardData._id;
    //trashPopup.dataset.cardElement = cardItem;
    }
    );
}
  //кнопка лайк
  const likeButton = cardItem.querySelector(".card__like-button");
  likeButton.addEventListener("click", onLike);

  //клик по картинке
  
  image.addEventListener("click", onImage);

  return cardItem;
}

//кликнуть лайк
export function handleClickLike(evt) {
  evt.target.classList.toggle("card__like-button_is-active");
}

//удалить карточку
export function deleteCard(card) {
  if (card && card.remove) {
    card.remove(); 
  } else {
    console.error("Ошибка: card не является DOM-элементом");
  }
}
