//создать карточки

export function createCard(cardData, onDelete, onLike, onImage, cardTemplate) {
  const cardItem = cardTemplate.querySelector(".places__item").cloneNode(true);
  const image = cardItem.querySelector(".card__image");

  image.src = cardData.link;
  image.alt = cardData.name;
  cardItem.querySelector(".card__title").textContent = cardData.name;

  //удаление карточки
  const deleteButton = cardItem.querySelector(".card__delete-button");
  deleteButton.addEventListener("click", () => onDelete(cardItem));

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
  card.remove();
}
