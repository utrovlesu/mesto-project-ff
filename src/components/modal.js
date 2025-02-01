//открыть окно 
export function openPopup (popupContainer, handleKeyEsc) {
    popupContainer.classList.add('popup_is-animated');
   setTimeout(() => {
        popupContainer.classList.add('popup_is-opened');  
   }, 100);
 
   document.addEventListener('keydown', handleKeyEsc);    
}

//закрыть окно
export function closePopup (popupContainer, handleKeyEsc) {
   popupContainer.classList.remove('popup_is-opened');
   document.removeEventListener('keydown', handleKeyEsc);
   setTimeout(() => {
   popupContainer.classList.remove('popup_is-animated');
   },1000);
}