let response;

let request = new XMLHttpRequest();
request.open('GET', 'https://news.investforum.ru/feed/filter/full/?&channels=satellits');
request.onreadystatechange = function(e) {
    if (this.readyState === 4) {
        if (this.status === 200) {
            response = JSON.parse(this.responseText);
            console.log(response);
            let dataLength = response.length;
            showItems(dataLength);
            fillItems(dataLength, response);
            findChildren(dataLength);

            
        }
        else {
            console.log('No JSON file');
        }
    }
}
request.send(null);


let articlesParent = document.getElementById('main');
let article = document.getElementById('item');


function createCommentsForm(index) {
    let formContainer = document.createElement('div');
    let formHeader = document.createElement('h3');
    let formInputName = document.createElement('input');
    let formInputEmail = document.createElement('input');
    let formInputComment = document.createElement('textarea');
    let formButton = document.createElement('button');

    formInputName.placeholder = 'Name';
    formInputEmail.placeholder = 'E-mail';
    formInputComment.placeholder = 'Comment';

    formContainer.className = 'form__container';
    formHeader.className = 'form__header';
    formInputName.className = 'form__input__name';
    formInputEmail.className = 'form__input__email';
    formInputComment.className = 'form__input__comment';
    formButton.className = 'form__button';

    formContainer.id = 'formContainer';
    formInputName.id = 'formInputName';
    formInputEmail.id = 'formInputEmail';
    formInputComment.id = 'formInputComment';
    formButton.id = 'formButton';

    formHeader.innerHTML = 'Comments';
    formButton.innerHTML = 'Send';

    formContainer.appendChild(formHeader);
    formContainer.appendChild(formInputName);
    formContainer.appendChild(formInputEmail);
    formContainer.appendChild(formInputComment);
    formContainer.appendChild(formButton);
    articlesParent.children[index].children[1].appendChild(formContainer);

    return true;
}


function openArticle(currentArticleData, index) {
    articlesParent.children[index].className = 'current__article';
    let elements = articlesParent.children[index].getElementsByTagName('*');
    elements[5].innerHTML = currentArticleData.Encoded;
}


function formattingDate(time) {
    timeChar = time.toString();
    if (timeChar.length < 2) {
        return time = '0' + timeChar;
    } else {
        return time;
    }
}


function fillItems(dataLength, response) {

    for (let i = 0; i < dataLength; i++) {
        let elements = articlesParent.children[i].getElementsByTagName('*');
        let articleDate = new Date(response[i].PublishDate*1000);

        elements[1].src = response[i].Image;
        elements[4].innerHTML = response[i].Title;
        elements[5].innerHTML = response[i].Description;
        elements[7].innerHTML = `
        ${formattingDate(articleDate.getHours())}:${formattingDate(articleDate.getMinutes())}, 
        ${formattingDate(articleDate.getDate())}.${formattingDate(articleDate.getMonth() + 1)}.${articleDate.getFullYear()}`;
        elements[8].id = response[i].ID;
        elements[9].dataset.index = [i];
    }
}


function showItems(dataLength) {
    for (let i = 1; i < dataLength; i++) {
        let newArticle = article.cloneNode(true);
        newArticle.id = "item";
        article.dataset.index = [0];
        newArticle.dataset.index = [i];
        articlesParent.appendChild(newArticle);
    }
}


function removeCommentsForm(index) {
    let articlesParent = document.getElementById('main');

    let article = articlesParent.children[index].children[1];
    let form = document.getElementById('formContainer');

    article.removeChild(form);
}


function closeArticle(index) {
    let articlesParent = document.getElementById('main');
    let elements = articlesParent.children[index].getElementsByTagName('*');
    elements[5].innerHTML = response[index].Description;
    articlesParent.children[index].className = 'item';
}

let selectedArticle;

function getArticle(event) {
    let target = event.target;
    
    if (target.id === 'articleButton') {
        if (selectedArticle) {
            removeCommentsForm(selectedArticle.dataset.index);
            closeArticle(selectedArticle.dataset.index);
        } 
            selectedArticle = target;
            let index = selectedArticle.dataset.index;
            console.log(index);
            let currentArticleData = response[index];
            console.log(currentArticleData);
            openArticle(currentArticleData, index);
            createCommentsForm(index);
        
    } else {
        return console.log(false);
    }
}


function findChildren(dataLength) {
    let itemsArray = articlesParent.children;
    
    for (let i = 0; i < dataLength; i++) {
        itemsArray[i].addEventListener('click', getArticle);
    }
}