const buttonElement = document.querySelector('button');
const inputElement = document.querySelector('input');
const ulElement = document.querySelector('ul');

buttonElement.addEventListener('click', handleClick);
inputElement.addEventListener('focus', handleReset);

async function handleClick() {
    const searchTerm = inputElement.value;
    if(!searchTerm) return alert('Sorry No Search Team Was Provided');

    const response = await fetch('/books/search?term=' + searchTerm)
    
    const data = await response.json();

    if(data.results.length === 0) {
        ulElement.innerHTML = '<li>No Results</li>'
    } else {
        const list = data.results.map(book => (
            `<li style="text-transform: capitalize;">
                <a href="/books/${book._id}">
                    ${book.title}
                </a>
            </li>`
        )).join('');
    
        ulElement.innerHTML = list;
    }
    
    inputElement.value = "";
}


function handleReset() {
    ulElement.innerHTML = "";
}