//открыть окно 
export function openPopup (popupContainer) {
    popupContainer.classList.add('popup_is-opened'); 
    document.addEventListener('keydown', handleKeyEsc);    
}

//закрыть окно
export function closePopup (popupContainer) {
   popupContainer.classList.remove('popup_is-opened');
   document.removeEventListener('keydown', handleKeyEsc);  
}

//нажать Esc 
function handleKeyEsc (evt) { 
  if(evt.key === 'Escape'){      
      const popupOpen = document.querySelector('.popup_is-opened'); 

      if(popupOpen) { 
          closePopup(popupOpen, handleKeyEsc); 
      }                
  } 
}