const searchInput = document.getElementById('search-input');
const autocompleteList = document.getElementById('autocomplete-list');
const reposList = document.getElementById('repos-list');

// Debounce function
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Fetch repositories from GitHub API
async function fetchRepos(query) {
  if (!query) {
    autocompleteList.style.display = 'none';
    return;
  }
  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(
        query
      )}&per_page=5`
    );
    const data = await response.json();
    displayAutocomplete(data.items);
  } catch (error) {
    console.error('Error fetching repos:', error);
  }
}

// Display autocomplete suggestions
function displayAutocomplete(repos) {
  autocompleteList.innerHTML = '';
  if (repos.length === 0) {
    autocompleteList.style.display = 'none';
    return;
  }
  repos.forEach(repo => {
    const li = document.createElement('li');
    li.textContent = repo.full_name;
    li.addEventListener('click', () => addRepo(repo));
    autocompleteList.appendChild(li);
  });
  autocompleteList.style.display = 'block';
}

// Add repo to the list
function addRepo(repo) {
  const li = document.createElement('li');
  li.innerHTML = `
        <span>Name: ${repo.name}, Owner: ${repo.owner.login}, Stars: ${repo.stargazers_count}</span>
        <button>Delete</button>
    `;
  li.querySelector('button').addEventListener('click', () => li.remove());
  reposList.appendChild(li);
  searchInput.value = '';
  autocompleteList.style.display = 'none';
}

// Hide autocomplete when clicking outside
document.addEventListener('click', event => {
  if (
    !autocompleteList.contains(event.target) &&
    event.target !== searchInput
  ) {
    autocompleteList.style.display = 'none';
  }
});

// Debounced input handler
const debouncedFetch = debounce(fetchRepos, 300);
searchInput.addEventListener('input', event => {
  const query = event.target.value.trim();
  debouncedFetch(query);
});
