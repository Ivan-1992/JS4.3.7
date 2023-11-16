const container = document.querySelector("#container");
const input = document.querySelector('input')
const autocompleteList = document.querySelector("#autocomplete-list");
const repositoryList = document.querySelector("#repository-list");
let autocompleteRepos = [];
let repositoryRepos = [];

repositoryList.addEventListener('click', (e) => {
  if (e.target.closest("span")) {
    const el = document.getElementById(
      `${e.target.closest("span").parentElement.id}`
    );

    el.remove();
  }
})

function repoListTemplate(repo) {
  repositoryRepos.push(repo.id);
  const list = document.createElement("li");

  list.innerHTML = `
    <ul class='repoList' id='${repo.id}'>
      <li>Name: ${repo.name}</li>
      <li>Owner: ${repo.owner.login}</li>
      <li>Stars: ${repo.stargazers_count}</li>
      <span><img src="circle-xmark-solid.svg" alt="img"></span>
    </ul>
  `;

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
  }
})

function listTemplate({name}) {
  const list = `
    <li>${name}</li>
  `;
  return list;
}

function renderList(res) {
  let fragment = '';
  if (!res) {
    autocompleteList.innerHTML = "";
    return
  }

  for (let i = 0; i < 5; i++) {
    if (res[i]) {
      autocompleteRepos.push(res[i]);
      const card = listTemplate(res[i]);
      fragment += card;
    }
  }

  autocompleteList.innerHTML = fragment;
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
  repos = []
  debouncedFn(value);
});

const debouncedFn = debounce(fn, 500);
async function getUsers(name) {
  let repos = fetch(`https://api.github.com/users/${name}/repos`).then(
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