function MakeGrid() {
    const cols = 1000;
    const container = document.getElementsByClassName('pathfinder-container')[0];

    for (let i = 0; i < cols; i++) {
        const item = document.createElement('div');
        item.classList.toggle('grid-item')
        container.appendChild(item);
        item.addEventListener('mouseout', (e) => HandleWallPlacement(e))
    }
}

function HandleWallPlacement(e) {
    if (e.shiftKey && (e.target.className === 'grid-item' || e.target.className === 'grid-item wall') && e.buttons) {
        if (e.target.childNodes.length == 0) {
            e.target.classList.toggle('wall');
        }
    }
}

function HandleStartNodePlacement(e) {
    if (e.buttons && e.target.className === 'grid-item' && !e.shiftKey && !e.ctrlKey) {
        if (e.target.childNodes.length == 0) {
            const start = document.getElementsByClassName('start');
            if (start[0]) {
                start[0].parentElement.removeChild(start[0]);
            }
            const item = document.createElement('i');
            item.classList.toggle('fa');
            item.classList.toggle('fa-arrow-right');
            item.classList.toggle('start');
            item.style.color = '#000000';
            e.target.appendChild(item);
        }
    }
}

function HandleTargetNodePlacement(e) {
    if (e.ctrlKey && e.buttons && e.target.className === 'grid-item') {
        if (e.target.childNodes.length == 0) {
            const target = document.getElementsByClassName('target');
            if (target[0]) {
                target[0].parentElement.removeChild(target[0]);
            }
            const item = document.createElement('i');
            item.classList.toggle('far');
            item.classList.toggle('fa-dot-circle');
            item.classList.toggle('target');
            item.style.color = '#000000';
            e.target.appendChild(item);
        }
    }
}

function CloseDropDown() {
    const dropdownUl = document.getElementsByClassName('dropdown-ul')[0];
    dropdownUl.classList.toggle('open');
}

function ResetWalls() {
    const walls = document.getElementsByClassName('wall');
    while (walls.length != 0) {
        walls[0].classList.remove('wall');
        
    }
}

function UpdatePathFinder(i) {
    CloseDropDown();
    switch (i) {
        case 0: 
            currentPathfinder = 'A*';
            dropdown.childNodes[1].innerText = 'A* Seacrh';
            break;
        case 1:
            currentPathfinder = 'Dijksra';
            dropdown.childNodes[1].innerText = 'Dijksra Algorithim';
            break;
        case 2:
            currentPathfinder = 'Swarm';
            dropdown.childNodes[1].innerText = 'Swarm Algorithim';
            break;
        case 3:
            currentPathfinder = 'BFS';
            dropdown.childNodes[1].innerText = 'Breadth-first Algorithim';
            break;
        case 4:
            currentPathfinder = 'DFS';
            dropdown.childNodes[1].innerText = 'Depth-first Algorithim';
            break;
    }
}

MakeGrid();
window.addEventListener('mousedown', (e) => HandleWallPlacement(e));
const resetWalls = document.getElementsByClassName('reset-walls')[0];
resetWalls.addEventListener('click', ResetWalls);
window.addEventListener('mousedown', (e) => HandleStartNodePlacement(e));
window.addEventListener('mousedown', (e) => HandleTargetNodePlacement(e));
let currentPathfinder = '';

const dropdown = document.getElementsByClassName('dropdown')[0];
dropdown.addEventListener('click', CloseDropDown)

const dropdownItems = document.getElementsByClassName('pathfinder-dropdown');
for (let i = 0; i < dropdownItems.length; i++) {
    dropdownItems[i].addEventListener('click', () => UpdatePathFinder(i));
}