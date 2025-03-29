const filmData = JSON.parse(localStorage.getItem('currentFilm'));
console.log(filmData)
const main = document.querySelector('main')
const imageDiv = document.querySelector('.image-div')

function createElement(tagName, className, text) {
    const newElement = document.createElement(tagName); // Создаем элемент
    newElement.classList.add(className); // Добавляем класс
    newElement.textContent = text; // Добавляем текст
    return newElement;
}

main.innerHTML = ""

// begin
// const title = createElement('h1', '.title', filmData.Title);
// main.appendChild(title)

 const poster = createElement('img', '.poster');
 poster.src = filmData.Poster;
 imageDiv.appendChild(poster);

// const actors = createElement('p', '.actors', filmData.Actors);
// main.appendChild(actors)
const filmDataArray = Object.entries(filmData) 

filmDataArray.forEach((element, index) => {
    const paragraph = document.createElement('p');
    paragraph.className = `p-${index}`;

    const keySpan = document.createElement('span');
    keySpan.className = 'film-key';
    keySpan.textContent = `${element[0]}: `;  // двоеточие тут

    paragraph.append(keySpan, element[1]);  // значение без двоеточия
    main.append(paragraph);
});