
const cards = document.querySelector('.cards');
const btn = document.querySelector('button')

cards.innerHTML = ''; // Очистка содержимого


function createElement(tagName, className, text) {
    const newElement = document.createElement(tagName); // Создаем элемент
    newElement.classList.add(className); // Добавляем класс
    newElement.textContent = text; // Добавляем текст
    return newElement;
}

if(cards.innerHTML === '') {
    cards.style.minHeight = '650px'
}

async function fetchApi(query, searchMultiple = false, page = 1) {
    const apikey = 'dba0b690'; // Замени на свой ключ

    // Выбираем параметр запроса в зависимости от searchMultiple
    const queryParam = searchMultiple ? 's' : 'i';

    try {
        const response = await fetch(`http://www.omdbapi.com/?apikey=${apikey}&${queryParam}=${query}&page=${page}`);
        const data = await response.json();

        if (data.Response === 'True') {
            return data; // Возвращаем данные
        } else {
            console.log('Данные не найдены');
            return null;
        }
    } catch (error) {
        console.log('Ошибка:', error);
        return null;
    }
}

let totalFilms = 0

async function obnovka () {
    const UserInput = document.querySelector('#film').value;
    // Используем параметр 's' для поиска по частичному названию
    const data = await fetchApi(UserInput, true, count);
    console.log(data) // true указывает на использование параметра 's'
    totalFilms = data.totalResults

    if (!data || data.Response === 'False') {
        console.log('Фильмы не найдены');
        cards.innerHTML = '';
        return; // Если фильмы не найдены, прекращаем выполнение
    }

    // Очищаем контейнер перед добавлением новых карточек
    cards.innerHTML = '';

    // Обрабатываем массив результатов (data.Search)
    for (const movie of data.Search) {
        // ===================== НОВЫЙ ЭЛЕМЕНТ =====================
        // Делаем дополнительный запрос для получения полной информации о фильме
        const fullMovieData = await fetchApi(movie.imdbID, false); // false указывает на использование параметра 'i'
        // ===================== КОНЕЦ НОВОГО ЭЛЕМЕНТА =====================

        if (!fullMovieData || fullMovieData.Response === 'False') {
            console.log('Данные о фильме не найдены');
            continue; // Пропускаем этот фильм, если данные не найдены
        }

        // Создаем карточку фильма
        const newCard = createElement('div', 'film-info');

        // Контейнер для изображения
        const newImageContainer = createElement('div', 'image-container');
        const newImage = document.createElement('img');
        newImage.src = fullMovieData.Poster; // Постер фильма
        newImage.alt = fullMovieData.Title; // Название фильма как альтернативный текст
        newImageContainer.appendChild(newImage);

        // Контейнер для текстовой информации
        const newTextContainer = createElement('div', 'text-container');

        // Основная информация (год, название, рейтинг)
        const newMainInfo = createElement('div', 'main-info');
        const newYear = createElement('p', null, fullMovieData.Year); // Год
        const newTitle = createElement('h3', null, fullMovieData.Title); // Название
        // ===================== НОВЫЙ ЭЛЕМЕНТ =====================
        const newRating = createElement('i', null, `${fullMovieData.imdbRating}★`); // Рейтинг
        // ===================== КОНЕЦ НОВОГО ЭЛЕМЕНТА =====================

        newMainInfo.appendChild(newYear);
        newMainInfo.appendChild(newTitle);
        newMainInfo.appendChild(newRating);

        // ===================== НОВЫЙ ЭЛЕМЕНТ =====================
        // Описание фильма
        const newPlot = createElement('p', 'text-inside', fullMovieData.Plot); // Описание
        // ===================== КОНЕЦ НОВОГО ЭЛЕМЕНТА =====================

        // Собираем текстовый контейнер
        newTextContainer.appendChild(newMainInfo);
        newTextContainer.appendChild(newPlot);

        // Собираем карточку
        newCard.appendChild(newImageContainer);
        newCard.appendChild(newTextContainer);

        // Добавляем карточку в контейнер
        cards.appendChild(newCard);
        currentPage.innerHTML = `страница ${count}`
    }
};
btn.addEventListener('click', obnovka)

let count = 1
const currentPage = document.querySelector("#current-page")

const next = document.querySelector('#next-page');
next.addEventListener('click', function() {
    if(totalFilms/10 > count) {
        count+=1
        obnovka()
        currentPage.innerHTML = `страница ${count}`
    }
})

const prev = document.querySelector('#prev-page');
prev.addEventListener('click', function() {
    if(count>=2) {
        count-=1
        obnovka()
        currentPage.innerHTML = `страница ${count}`
    }
})


