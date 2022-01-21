$(document).ready(function() {
    function HandleWallPlacement(e) {

            if (e.shiftKey && (e.target.className === 'grid-item' || e.target.className === 'grid-item wall') && e.buttons) {
                if (!hasStarted) {
                    if (e.target.childNodes.length == 0) {
                        e.target.classList.toggle('wall');
                    }
                } else {
                    StartError("Visualizer is currently running!");
                }
            }

    }
    
    function IsWall(gridItem) {
        return gridItem.className === 'grid-item wall'
    }
    
    function HandleStartNodePlacement(e) {
            if (e.buttons && e.target.className === 'grid-item' && !e.shiftKey && !e.ctrlKey) {
                if (!hasStarted) {
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
                } else {
                    StartError("Visualizer is currently running!");
                }
            }

    }
    
    function HandleTargetNodePlacement(e) {
            if (e.ctrlKey && e.buttons && e.target.className === 'grid-item') {
                if (!hasStarted) {
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
                } else {
                    StartError("Visualizer is currently running!");
                }
            }
    }
    
    function GetStartPos() {
        pos = [];
        for(var i = 0; i < rows; i++ ) {
            for(var j = 0; j < cols; j++) {
                const temp = grid[i][j];
                if (temp.childNodes[0]) {
                    if (temp.childNodes[0].className == 'fa fa-arrow-right start') {
                        pos = [i, j];
                        break;
                    }
                }
            }
        }
        return pos;
    }
    
    function GetEndPos() {
        pos = [];
        for(var i = 0; i < rows; i++ ) {
            for(var j = 0; j < cols; j++) {
                const temp = grid[i][j];
                if (temp.childNodes[0]) {
                    if (temp.childNodes[0].className == 'far fa-dot-circle target') {
                        pos = [i, j];
                        break;
                    }
                }
            }
        }
        return pos;
    }
    
    function ResetWalls() {
        if (!hasStarted) {
            const nodes = document.getElementsByClassName('grid-item');
            for (let node of nodes) {
                node.classList.remove('wall');
                node.classList.remove('open-node');
                node.classList.remove('closed-node');
                node.classList.remove('best-path');
                $(node).data('f', Infinity);
                $(node).data('h', 0);
                $(node).data('g', Infinity);
                $(node).data('neighbors', 0);
                $(node).data('previous', 0);
            }
            needsReset = false;
        }
    }
    
    function CloseDropDown() {
        const dropdownUl = document.getElementsByClassName('dropdown-ul')[0];
        dropdownUl.classList.toggle('open');
    }
    
    function UpdatePathFinder(i) {
        CloseDropDown();
        switch (i) {
            case 0: 
                currentPathfinder = 'A*';
                dropdown.childNodes[1].innerText = 'A* Search';
                break;
            case 1:
                currentPathfinder = 'Dijksra';
                dropdown.childNodes[1].innerText = "Dijksra's Algorithm";
                break;
            case 2:
                currentPathfinder = 'Swarm';
                dropdown.childNodes[1].innerText = 'Swarm Algorithm';
                break;
            case 3:
                currentPathfinder = 'BFS';
                dropdown.childNodes[1].innerText = 'Breadth-first Search';
                break;
            case 4:
                currentPathfinder = 'DFS';
                dropdown.childNodes[1].innerText = 'Depth-first Search';
                break;
        }
    }
    
    function StartError(text) {
        const startContainer = document.getElementsByClassName('start-error-container')[0];
        const item = document.createElement('div');
        item.classList.toggle('start-error');
        item.innerText = text;
        if (startContainer.hasChildNodes()) {
            startContainer.removeChild(startContainer.childNodes[0]);
        }
        startContainer.appendChild(item);
    
        if (timeout != null) {
            window.clearTimeout(timeout);
        }
        timeout = setTimeout(() => {  startContainer.removeChild(startContainer.childNodes[0]); }, 4000);
    }
    
    function StartVisualizer(rows, cols) {
        if (GetEndPos().length === 0) {
            StartError("Place down a target node to run the visualizer!");
            return;
        } else if (GetStartPos().length === 0) {
            StartError("Place down a start node to run the visualizer!");
            return;
        }
        if (hasStarted) {
            StartError("Visualizer already running!");
            return;
        }
        if (needsReset) {
            StartError("Reset nodes to continue!");
            return;
        }
        switch (currentPathfinder) {
            case '':
                StartError("Select a pathfinder to run the visualizer!");
                break;
            case 'A*':
                hasStarted = true;
                for (var i = 0; i < rows; i++) {
                    for(var j = 0; j < cols; j++) {
                        UpdateNeighbors(i, j)
                    }
                }
                StartAStar();
                break;
            case 'Dijksra':
                hasStarted = true;
                for (var i = 0; i < rows; i++) {
                    for(var j = 0; j < cols; j++) {
                        UpdateNeighbors(i, j)
                    }
                }
                StartDijkstra();
                break;
            case 'Swarm':
                hasStarted = true;
                for (var i = 0; i < rows; i++) {
                    for(var j = 0; j < cols; j++) {
                        UpdateNeighbors(i, j)
                    }
                }
                StartSwarm();
                break;
            case 'BFS':
                break;
            case 'DFS':
                break;
        }
    }
    
    function RemoveFromArray(arr, elt) {
        for (var i = arr.length - 1; i >= 0; i--) {
            if (arr[i] === elt) {
                arr.splice(i, 1);
            }
        }
    }

    function RunSwarm(openSet, closedSet, timer) {

    }

    function StartSwarm() {
        var timer = setInterval(() => {
            RunSwarm(openSet, closedSet, timer);
            if (openSet.length <= 0) {
                clearInterval(timer);
                hasStarted = false;
                needsReset = true;
            }
        }, 15)
    }

    function RunDijkstra(openSet, closedSet, timer) {
        current = openSet[0];

        if (current === end) {
            ReBuildPath(current, timer);
        }

        RemoveFromArray(openSet, current);
        closedSet.push(current);
        current.classList.toggle('closed-node');
        current.classList.toggle('open-node');
        var neighbors = $(current).data('neighbors');
        for (neighbor of neighbors) {
            if (!closedSet.includes(neighbor)) {
                $(neighbor).data('previous', current);

                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                    neighbor.classList.toggle('open-node');
                }
            }
        }
    }

    function StartDijkstra() {
        openSet = [];
        closedSet = [];
        start = grid[GetStartPos()[0]][GetStartPos()[1]];
        end = grid[GetEndPos()[0]][GetEndPos()[1]];
        openSet.push(start);
        start.classList.toggle('open-node');
        var timer = setInterval(() => {
            RunDijkstra(openSet, closedSet, timer);
            if (openSet.length <= 0) {
                clearInterval(timer);
                hasStarted = false;
                needsReset = true;
            }
        }, 15)
    }

    function ReBuildPath(current, timer) {
        clearInterval(timer);
        path = [];
        var temp = current;
        path.push(temp);
        var t;
        if ($(temp).data('previous') != undefined) {
            t = setInterval(() => {
                temp.classList.toggle('closed-node');
                temp.classList.toggle('best-path');
                path.push($(temp).data('previous'));
                temp = $(temp).data('previous');
                if ($(temp).data('previous') == undefined) {
                    clearInterval(t);
                    hasStarted = false;
                    needsReset = true;
                }
            }, 50);
        } 
    }


    function RunAStar(openSet, closedSet, timer) {
        var lowestFValue = 0
        for (var i = 0; i < openSet.length; i++) {
            if ($(openSet[i]).data('f') < $(openSet[lowestFValue]).data('f')) {
                lowestFValue = i
            }
        }
        var current = openSet[lowestFValue];

        if (current === end) {
            ReBuildPath(current, timer);
        }
        
        RemoveFromArray(openSet, current);
        closedSet.push(current);
        current.classList.toggle('closed-node');
        current.classList.toggle('open-node');

        var neighbors = $(current).data('neighbors');
        for (neighbor of neighbors) {
            if (!closedSet.includes(neighbor)) {
                var tempG = ($(current).data('g') + 1);   
                if (tempG < $(neighbor).data('g')) {
                    $(neighbor).data('g', tempG);
                    neighborPos = neighbor.id.split(' ');
                    $(neighbor).data('h', h(neighborPos[0], neighborPos[1], GetEndPos()[0], GetEndPos()[1]))
                    $(neighbor).data('f', ($(neighbor).data('g') + $(neighbor).data('h')));
                    $(neighbor).data('previous', current);

                    if (!openSet.includes(neighbor)) {
                        $(neighbor).data('g', tempG);
                        openSet.push(neighbor);
                        neighbor.classList.toggle('open-node');
                    }
                }
            } 
        }
    }
    
    function StartAStar() {
        openSet = [];
        closedSet = [];
        start = grid[GetStartPos()[0]][GetStartPos()[1]];
        end = grid[GetEndPos()[0]][GetEndPos()[1]];
        $(start).data('g', 0);
        $(start).data('f', h(GetStartPos()[0], GetStartPos()[1], GetEndPos()[0], GetEndPos()[1]));
        openSet.push(start);
        start.classList.toggle('open-node');
        var timer = setInterval(() => {
            RunAStar(openSet, closedSet, timer);
            if (openSet.length <= 0) {
                clearInterval(timer);
                hasStarted = false;
                needsReset = true;
            }
        }, 15);

    }
    
    function UpdateNeighbors(i, j) {
        const gridItem = grid[i][j];
        var neighbors = [];
        if (i - 1 >= 0) { //same column, one row down
            if (!IsWall(grid[i - 1][j]))
            {
                neighbors.push(grid[i - 1][j]);
            }
        }
        if (i + 1 < grid.length) { //same column, one row up
            if (!IsWall(grid[i + 1][j])) {
                neighbors.push(grid[i + 1][j]);
            }
        }
        if (j + 1 < grid[i].length) { //same row, one column to the right
            if (!IsWall(grid[i][j + 1])) {
                neighbors.push(grid[i][j + 1]);
            }
        }
        if (j - 1 >= 0) { //same row, one column to the left
            if (!IsWall(grid[i][j - 1])) {
                neighbors.push(grid[i][j - 1]);
            }
        }
        $(gridItem).data('neighbors', neighbors);
    }
    
    function h(x1, x2, y1, y2) {
        return Math.abs(x1 - y1) + Math.abs(x2 - y2);
    }
    
    function MakeGrid(rows, cols) {
        grid = [];
        const container = document.getElementsByClassName('pathfinder-container')[0];
    
        for (var i = 0; i < rows; i++) {
            grid.push([]);
            for (var j = 0; j < cols; j++) {
                const item = document.createElement('div');
                grid[i].push(item);
                item.classList.toggle('grid-item')
                item.setAttribute('id', i + ' ' + j);
                $(item).data('f', Infinity);
                $(item).data('h', 0);
                $(item).data('g', Infinity);
                $(item).data('neighbors', 0);
                $(item).data('previous', 0);
                item.addEventListener('mouseover', (e) => HandleWallPlacement(e));
                container.appendChild(grid[i][j]);
            }
        }
    }
    
    var timeout = null;
    var hasStarted = false;
    var needsReset = false;
    var rows = 20;
    var cols = 50;
    var grid;
    MakeGrid(rows, cols);
    
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
    
    const startButton = document.getElementsByClassName('start-button')[0];
    startButton.addEventListener('click', () => StartVisualizer(rows, cols));    
})
