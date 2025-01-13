const cardList= document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content;

initialCards.forEach((element) => {  
    
    cardList.append(addCards(element.link,  element.name, deleteCard));

});

function addCards(cardName, cardImage, callback) {

    const cardItem = cardTemplate.querySelector('.places__item').cloneNode(true);
    cardItem.querySelector('.card__image').src  = cardName;
    cardItem.querySelector('.card__title').textContent  = cardImage;
    const deleteButton = cardItem.querySelector('.card__delete-button');
    deleteButton.addEventListener('click', callback)
   return cardItem;

}
    
function deleteCard(event) {

   const cardItem = event.target.closest('.places__item');
   cardItem.remove();

}
