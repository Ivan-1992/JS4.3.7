// Во всех примерах, которые я нашел, createElement используется
// совместно с innerHTML или insertAdjacentHTML. Не нашел как это можно сделать
// по-другому

const container = document.querySelector(".container");
const input = document.querySelector('input');
const autocompleteList = document.querySelector(".autocomplete-list");
const repositoryList = document.querySelector(".repository-list");
const ul = document.querySelector('ul');
let autocompleteRepos = [];
let repositoryRepos = [];

repositoryList.addEventListener('click', (e) => {
  let target = e.target;
  if (!target.classList.contains("img")) {
    return;
  }

  target.parentElement.parentElement.remove();
});

function repoListTemplate(repo) {
  repositoryRepos.push(repo.id);
  const list = document.createElement("li");
  
  list.insertAdjacentHTML('beforeend', `
        <div class="repoList">
          Name: ${repo.name}
          <br>Owner: ${repo.owner.login}
          <br>Stars: ${repo.stargazers_count}
          <button>
          <img src="circle-xmark-solid.svg" alt="img" class="img">
          </button>
          </div>`
  );

  repositoryList.append(list);
  input.value = "";
  renderList([]);
}

autocompleteList.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    const repo = autocompleteRepos.find((el) => el.name === e.target.innerText);
    if (!repositoryRepos.includes(repo.id)) {
      repoListTemplate(repo);
    }
    clearRender();
  }
});

function clearRender() {
 autocompleteList.textContent = ''; 
}

function listTemplate({name}) {
  const list = `
    <li>${name}</li>
  `;
  return list;
}

function renderList(res) {
  let fragment = '';

  for (let i = 0; i < 5; i++) {
    if (res[i]) {
      autocompleteRepos.push(res[i]);
      fragment += listTemplate(res[i]);
    }
  }
  let div = document.createElement('DIV');
  div.insertAdjacentHTML('beforeend', fragment);
  autocompleteList.append(div);
}

const debounce = (fn, debounceTime) => {
  let timeoutId;

  return function (value) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.call(this, value);
    }, debounceTime);
  };
};

function fn(value) {
  getUsers(value).then((data) => {
    renderList(data); 
  });
}

input.addEventListener("input", (e) => {
  const value = e.target.value;
  repos = [];
  debouncedFn(value);
});


const debouncedFn = debounce(fn, 500);
async function getUsers(name) {
  let repos = fetch(`https://api.github.com/users/${name}/repos?per_page=5`).then(
    (successResponse) => {

      if (successResponse.status != 200) {
        return null;
      } else {
        return successResponse.json();
      }
    },
    (failResponse) => {
      return null;
    }
  );

  return repos;
}