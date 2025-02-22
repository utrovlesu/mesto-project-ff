//показать ошибку валидации
function showInputError (formElement, inputElement, errorMes, validationConfig) {
     const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    
     inputElement.classList.add(validationConfig.inputErrorClass);
     errorElement.textContent = errorMes;
     errorElement.classList.add(validationConfig.errorClass);
       
}

//скрыть ошибку валидации
function hideInputError (formElement, inputElement, validationConfig) {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.remove(validationConfig.inputErrorClass);
    errorElement.classList.remove(validationConfig.errorClass);
    errorElement.textContent = '';
}

//проверка валидации
function checkInputValidity (formElement, inputElement, validationConfig) {
       
    if (!inputElement.validity.valid) {
     showInputError(formElement, inputElement, inputElement.validationMessage, validationConfig);
     const inputsText = document.querySelectorAll('input[type="text"]');
  inputsText.forEach(input => {    
      if (input.validity.patternMismatch) {
        const errorMessage = input.getAttribute('data-error');
        showInputError(formElement, input, errorMessage, validationConfig);
        return false;
      }
         
  })
     return false;
   }
  
    hideInputError(formElement, inputElement, validationConfig);
    return true;
}

//обработчик ввода текста в поля
function setEventListeners (formElement, validationConfig) {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, validationConfig.inactiveButtonClass);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, validationConfig);
      toggleButtonState(inputList, buttonElement, validationConfig.inactiveButtonClass);
    });
  });
}

//включить валидацию
export function enableValidation (validationConfig) {
  const formList = Array.from(document.querySelectorAll(validationConfig.formSelector));

  formList.forEach((formElement) => {
    formElement.addEventListener('submit', (evt) => {
      evt.preventDefault();
     
    });
    setEventListeners(formElement, validationConfig);
    
  });
}

//проверка на валидность всех полей
function hasInvalidInput (inputList) {
  return inputList.some((element) => {
    return !element.validity.valid ;
  });
}

//переключение доступности кнопки
function toggleButtonState (inputList, buttonElement,  inactiveButtonClass) {
  if (hasInvalidInput(inputList)) {
    console.log(inactiveButtonClass);
    buttonElement.classList.add(inactiveButtonClass); 
  } else {
    buttonElement.classList.remove(inactiveButtonClass);   
  }
}

//очистить форму от ошибок валидации
export function clearValidation (formElement, validationConfig) {
  console.log("Очистка валидации для формы:", formElement);
  
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, validationConfig);
  });

  toggleButtonState(inputList, buttonElement, validationConfig.inactiveButtonClass);
}