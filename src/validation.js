//показать ошибку валидации
function showInputError (formElement, inputElement, errorMessage, { inputErrorClass, errorClass }) {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.add(inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(errorClass);
}

//скрыть ощибку валидации
function hideInputError (formElement, inputElement, { inputErrorClass, errorClass }) {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.remove(inputErrorClass);
    errorElement.classList.remove(errorClass);
    errorElement.textContent = '';
}

//проверка валидации
export function checkInputValidity (formElement, inputElement, validationConfig) {
    const regex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;
  
    if (inputElement.name === 'name' || inputElement.name === 'description' || inputElement.name === 'place-name') {
      if (!regex.test(inputElement.value)) {
        showInputError(formElement, inputElement, 'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы', validationConfig);
        return false;
      }
    }
  
    if (!inputElement.validity.valid) {
      showInputError(formElement, inputElement, inputElement.validationMessage, validationConfig);
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
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid || inputElement.classList.contains('popup__input_type_error');
  });
}

//переключение доступности кнопки
function toggleButtonState (inputList, buttonElement, inactiveButtonClass) {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(inactiveButtonClass); 
  } else {
    buttonElement.classList.remove(inactiveButtonClass);   
  }
}

//очистить форму от ошибок валидации
export function clearValidation (formElement, validationConfig) {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, validationConfig);
  });

  toggleButtonState(inputList, buttonElement, validationConfig.inactiveButtonClass);
}