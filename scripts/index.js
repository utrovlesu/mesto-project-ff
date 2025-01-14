const cardsContainer = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content;

initialCards.forEach((element) => {  
    
    cardsContainer.append(createCard(element, deleteCard));

});

function createCard(cardData, onDelete) {

    const cardItem = cardTemplate.querySelector('.places__item').cloneNode(true);
    cardItem.querySelector('.card__image').src  = cardData.link;
    cardItem.querySelector('.card__image').alt = cardData.name;
    cardItem.querySelector('.card__title').textContent  = cardData.name;
    const deleteButton = cardItem.querySelector('.card__delete-button');
    deleteButton.addEventListener('click',  () =>  onDelete(cardItem));
   return cardItem;

}
    
function deleteCard(card) {

   //const cardItem = event.target.closest('.places__item');
   card.remove();

}


