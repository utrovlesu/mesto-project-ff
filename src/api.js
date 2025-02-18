const config = {
    baseUrl: 'https://nomoreparties.co/v1/pwff-cohort-1', 
    headers: {
      authorization: 'b2612306-5efa-42fe-befe-e170f4680808', 
      'Content-Type': 'application/json'
    }
  };

  function checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }
  
  // Получить информацию о пользователе
  export const getUserInfo = () => {
    return fetch(`${config.baseUrl}/users/me`, {
      headers: config.headers
    })
    .then(checkResponse);
  };
  
  // Получить начальные карточки
  export const getInitialCards = () => {
    return fetch(`${config.baseUrl}/cards`, {
      headers: config.headers
    })
    .then(checkResponse);
  };
  
  // Обновить информацию о пользователе
  export const updateUserInfo = (data) => {
    return fetch(`${config.baseUrl}/users/me`, {
      method: 'PATCH',
      headers: config.headers,
      body: JSON.stringify(data)
    })
    .then(checkResponse);
  };
  
  // Добавить новую карточку
  export const addNewCard = (data) => {
    return fetch(`${config.baseUrl}/cards`, {
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify(data)
    })
    .then(checkResponse);
  };
  
  // Удалить карточку
  export const deleteCard = (cardID) => {
    return fetch(`${config.baseUrl}/cards/${cardID}`, {
      method: 'DELETE',
      headers: config.headers
    })
    .then(checkResponse);
  };
  
  // Поставить лайк карточке
  export const likeCard = (cardID) => {
    return fetch(`${config.baseUrl}/cards/likes/${cardID}`, {
      method: 'PUT',
      headers: config.headers
    })
    .then(checkResponse);
  };
  
  // Убрать лайк с карточки
  export const unlikeCard = (cardID) => {
    return fetch(`${config.baseUrl}/cards/likes/${cardID}`, {
      method: 'DELETE',
      headers: config.headers
    })
    .then(checkResponse);
  };
  
  // Обновить аватар пользователя
  export const updateUserAvatar = (avatarURL) => {
    return fetch(`${config.baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: config.headers,
      body: JSON.stringify({ avatar: avatarURL })
    })
    .then(checkResponse);
  };