let characters = [];  // Armazenar todos os personagens
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];  // Recupera os favoritos do localStorage

// Função para buscar os personagens da API
async function fetchCharacters() {
    try {
        const response = await fetch('https://hp-api.onrender.com/api/characters');
        characters = await response.json();  // Salva todos os personagens no array 'characters'

        // Exibe os primeiros 10 personagens por padrão
        displayCharacters(characters.slice(0, 10), document.getElementById('character-list'));
        displayFavorites();  // Exibe os favoritos salvos
    } catch (error) {
        console.error('Error fetching characters:', error);
    }
}

// Função para exibir os personagens
function displayCharacters(charactersToDisplay, container) {
    container.innerHTML = '';  // Limpa a lista antes de adicionar novos itens

    charactersToDisplay.forEach(character => {
        const characterCard = document.createElement('div');
        characterCard.classList.add('card');

        // Definir cor com base na casa
        let houseClass;
        switch (character.house) {
            case 'Gryffindor':
                houseClass = 'house-gryffindor';
                break;
            case 'Slytherin':
                houseClass = 'house-slytherin';
                break;
            case 'Hufflepuff':
                houseClass = 'house-hufflepuff';
                break;
            case 'Ravenclaw':
                houseClass = 'house-ravenclaw';
                break;
            default:
                houseClass = 'house-unknown';  // Caso o personagem não tenha casa definida
        }
        characterCard.classList.add(houseClass);  // Aplica a classe correspondente à casa

        const characterImage = document.createElement('img');
        characterImage.src = character.image || 'https://via.placeholder.com/200';  // Placeholder se não houver imagem
        characterImage.alt = character.name; // Adiciona alt à imagem
        characterCard.appendChild(characterImage);

        const characterName = document.createElement('h3');
        characterName.textContent = character.name;
        characterCard.appendChild(characterName);

        const favoriteButton = document.createElement('button');
        favoriteButton.classList.add('favorite'); // Adiciona a classe 'favorite'
        favoriteButton.textContent = favorites.some(fav => fav.name === character.name) ? '❤️' : '🤍'; // Usando ícones para favoritar
        favoriteButton.addEventListener('click', (event) => {
            event.stopPropagation();  // Evita que o clique no botão acione outros eventos
            toggleFavorite(character); // Chama a função para adicionar/remover favoritos
            favoriteButton.textContent = favorites.some(fav => fav.name === character.name) ? '❤️' : '🤍'; // Atualiza o texto do botão
        });
        characterCard.appendChild(favoriteButton);

        // Ao clicar na imagem, mostra os detalhes do personagem
        characterImage.addEventListener('click', (event) => {
            event.stopPropagation(); // Evita que o clique na imagem feche o modal
            openModal(character);  // Chama openModal ao clicar na imagem
        });

        container.appendChild(characterCard);
    });
}

// Função para abrir o modal e mostrar detalhes do personagem
function openModal(character) {
    const modalCharacterImage = document.getElementById("modalCharacterImage");
    const modalCharacterDetails = document.getElementById("modalCharacterDetails");
    const modalContent = document.querySelector('.modal-content');

    // Adiciona a classe correspondente à casa
    modalContent.className = 'modal-content';  // Reseta as classes para apenas modal-content
    switch (character.house) {
        case 'Gryffindor':
            modalContent.classList.add('house-gryffindor');
            break;
        case 'Slytherin':
            modalContent.classList.add('house-slytherin');
            break;
        case 'Hufflepuff':
            modalContent.classList.add('house-hufflepuff');
            break;
        case 'Ravenclaw':
            modalContent.classList.add('house-ravenclaw');
            break;
        default:
            modalContent.classList.add('house-unknown');  // Caso o personagem não tenha casa definida
    }


    modalCharacterImage.src = character.image || 'https://via.placeholder.com/200';
    modalCharacterDetails.innerHTML = `
        <strong>Name:</strong> ${character.name || 'Unknown'} <br>
        <strong>Species:</strong> ${character.species || 'Unknown'} <br>
        <strong>Gender:</strong> ${character.gender || 'Unknown'} <br>
        <strong>House:</strong> ${character.house || 'Unknown'} <br>
        <strong>Ancestry:</strong> ${character.ancestry || 'Unknown'} <br>
        <strong>Patronus:</strong> ${character.patronus || 'Unknown'} <br>
        <strong>Actor:</strong> ${character.actor || 'Unknown'}
    `;

    const modal = document.getElementById("characterModal");
    modal.style.display = "block"; // Mostra o modal
}

// Função para fechar o modal
document.querySelector(".close").addEventListener("click", () => {
    document.getElementById("characterModal").style.display = "none"; // Oculta o modal
});

// Fecha o modal ao clicar fora do conteúdo
window.addEventListener("click", (event) => {
    const modal = document.getElementById("characterModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Função para salvar ou remover favoritos
function toggleFavorite(character) {
    if (favorites.some(fav => fav.name === character.name)) {
        // Se já está nos favoritos, remove
        favorites = favorites.filter(fav => fav.name !== character.name);
    } else {
        // Se não está nos favoritos, adiciona
        favorites.push(character);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));  // Atualiza o localStorage
    displayFavorites();  // Atualiza a exibição dos favoritos
    displayCharacters(characters.slice(0, 10), document.getElementById('character-list')); // Atualiza a exibição dos personagens
}

// Função para exibir os favoritos salvos
function displayFavorites() {
    const favoritesList = document.getElementById('favorites-list');
    if (favorites.length > 0) {
        displayCharacters(favorites, favoritesList);
    } else {
        favoritesList.innerHTML = '<p>No favorites added.</p>';  // Exibe mensagem se não houver favoritos
    }
}

// Função de filtro com base no critério selecionado
function filterCharacters() {
    const filterInput = document.getElementById('filterInput').value.toLowerCase();
    const filterCriterio = document.getElementById('filterCriterio').value;

    const filteredCharacters = characters.filter(character => {
        if (filterCriterio === 'name') {
            return character.name.toLowerCase().includes(filterInput);
        } else if (filterCriterio === 'species') {
            return character.species.toLowerCase().includes(filterInput);
        } else if (filterCriterio === 'house') {
            return character.house && character.house.toLowerCase().includes(filterInput);
        } else if (filterCriterio === 'ancestry') {
            return character.ancestry && character.ancestry.toLowerCase().includes(filterInput);
        }
        return false;
    });

    displayCharacters(filteredCharacters, document.getElementById('character-list'));
}

// Adiciona evento ao botão de filtro
document.getElementById('filterButton').addEventListener('click', filterCharacters);

// Adiciona evento de tecla 'Enter' no campo de filtro
document.getElementById('filterInput').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        filterCharacters();  // Chama a função de filtro se a tecla pressionada for 'Enter'
    }
});


// Busca os personagens ao carregar a página
fetchCharacters();
