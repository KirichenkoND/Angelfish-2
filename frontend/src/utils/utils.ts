const setUserTokenToCookie = (token: string) => {
    // Устанавливаем куку с токеном доступа
    document.cookie = `accessToken=${token}; path=/; max-age=3600`; // Примерный срок действия куки - 1 час
};

const clearUserTokenFromCookie = () => {
    // Удаляем куку с токеном доступа
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};