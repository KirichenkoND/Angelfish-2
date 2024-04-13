# Пропускная система (АИС КПП)

Пропускная система - это программная система, предназначенная для контроля и управления доступами.

# Содержание <a name="Содержание"></a>
* [Содержание](#Содержание)
* [Роли в команде](#Роли)
* [Стек технологий](#Стек)
* [База данных](#БДшка)
* [API и SWAGGER](#API_SWAGGER)
* [Макет веб-приложения](#Макет)
* [Docker](#Docker)

# Роли в команде <a name="Роли"></a>
* Тимлид [Кириченко Н.Д.](https://github.com/KirichenkoND)
* Frontend-Разработчик (Разработчик) [Кирилин Г.Д.](https://github.com/FaneOfficial)
* Frontend-Разработчик (Дизайнер) [Ганьшин Д.А.](https://github.com/Cooper-Farnsworth)
* Backend-Разработчик [Шустров В.Р.](https://github.com/ItsEthra)
* Тестировщик [Мигель Д.Г.](https://github.com/DooMiaN)
* Системный аналитик [Сафиуллин Т.И.](https://github.com/SafiullinT)
* Системный аналитик [Григорьев Н.А.](https://github.com/5ilen)

# Стек технологий <a name="Стек"></a>
В этом проекте используется следующий стек технологий:
* СУБД PostgreSQL
* React + TS + Vite
* Rust
* Figma

# База данных <a name="БДшка"></a>
В данной программной системе используется СУБД PostgreSQL.
Структура базы данных выглядит следующим образом:

![Alt-текст](img/100_database.jpg "Схема Базы данных")

# API и SWAGGER <a name="API_SWAGGER"></a>
Swagger расположен по следующей ссылке: [*swagger*](http://api.securitypass.efbo.ru/swagger-ui/)

# Макет веб-приложения <a name="Макет"></a>
Макет веб-приложения расположен по следующей ссылке [*макет*](https://www.figma.com/)

## Описание макетов приложения
1. Авторизация
![Alt-текст](img/1_auth.jpg "Авторизация")

1. Главная страница
![Alt-текст](img/2_mainpage_1.jpg "Главная страница")
![Alt-текст](img/2_mainpage_2.jpg "Главная страница")

1. Карта
![Alt-текст](img/3_map.jpg "Карта")

1. Настройки категорий
![Alt-текст](img/4_settings_category.jpg "Настройки категорий")

1. Настройки ролей
![Alt-текст](img/4_settings_roles.jpg "Настройки ролей")

1. Настройка прав
![Alt-текст](img/4_settings_perms.jpg "Настройка прав")

1. Настройка помещений
![Alt-текст](img/4_settings_rooms.jpg "Настройка помещений")

# Docker <a name="Docker"></a>
Для сборки проекта необходимо скачать и установить docker. 
* Windows<br>Скачать с официального сайта Docker
* Linux<br>```sudo apt install docker```

# Сбор и запуск контейнера backend в Docker
```
cd backend
docker build -t securitypass-backend .
docker run --name securitypass-backend -e DATABASE_URL=<postgres_url> -d -p 9009:9000 securitypass-backend
```

# Сбор и запуск контейнера frontend в Docker
```
cd frontend
docker build -t securitypass-frontend .
docker run --name securitypass-frontend -d -p 30000:3000 securitypass-frontend
```