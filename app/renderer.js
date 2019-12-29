
const parser = new DOMParser();

const linksSection = document.querySelector('.links');
const errorMessage = document.querySelector('.error-message');
const newLinkForm = document.querySelector('.new-link-form');
const newLinkUrl = document.querySelector('.new-link-url');
const newLinkSubmit = document.querySelector('.new-link-submit');
const clearStorageButton = document.querySelector('.clear-storage');

newLinkUrl.addEventListener('keyup', () => {
    newLinkSubmit.disabled = !newLinkUrl.validity.valid;
});

newLinkForm.addEventListener('submit', (event) => {
    // don't trigger the HTTP request
    event.preventDefault();
    // get the URL in the new link input field
    const url = newLinkUrl.value;
    // use the Fetch API to fetch the content of the provided URL
    fetch(url)
        .then(validateResponse)
        .then(response => response.text())
        .then(parseResponse)
        .then(findTitle)
        .then(title => storeLink(title, url))
        .then(clearForm)
        .then(renderLinks)
        .catch(error => handleError(error, url));
});

clearStorageButton.addEventListener('click', () => {
    localStorage.clear();
    linksSection.innerHTML = '';
});

const clearForm = () => {
    newLinkUrl.value = null;
};

// takes the string of HTML from the URL and parses it into a DOM tree
const parseResponse = (text) => {
    return parser.parseFromString(text, 'text/html');
}
// traverses the DOM tree to find the <title> node
const findTitle = (nodes) => {
    return nodes.querySelector('title').innerText;
}

// stores the title and URL into local storage
const storeLink = (title, url) => {
    localStorage.setItem(url, JSON.stringify({ title: title, url: url }));
}

// get array of all keys in local storage
// for each key, get its value and parses it from JSON into Javascript object
const getLinks = () => {
    return Object.keys(localStorage)
        .map(key => JSON.parse(localStorage.getItem(key)));
}

const convertToElement = (link) => {
    return `
<div class="link">
<h3>${link.title}</h3>
<p><a href="${link.url}">${link.url}</a></p>
</div>
    `;
}

const renderLinks = () => {
    const linkElements = getLinks().map(convertToElement).join('');
    linksSection.innerHTML = linkElements;
}

const validateResponse = (response) => {
    if (response.ok) {
        return response;
    }
    throw new Error(`Status code of ${response.status} ${response.statusText}`);
}

const handleError = (error, url) => {
    // set the contents of the error message element if fetching a link fails
    errorMessage.innerHTML = `
There was an issue adding "${url}": ${error.message}    
    `.trim();
    // clear the error message after 5 seconds
    setTimeout( () => errorMessage.innerText = null, 5000);
}

renderLinks();
