$(document).ready(function() {
    function HandleWallPlacement(e) {
        if (e.shiftKey && (e.target.className === 'grid-item' || e.target.className === 'grid-item wall') && e.buttons) {
            if (!hasStarted && !needsReset) {
                if (!creatingMaze) {
                    if (!resettingWalls) {
                        e.target.classList.toggle('wall');
                    } else {
                        StartError("Walls are currently being reset!");
                    }
                } else {
                    StartError("A maze is currently being made!");
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
                if (!hasStarted && !needsReset) {
                    if (!creatingMaze) {
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
                    } else {
                        StartError("A maze is currently being made!");
                    }
                } else {
                    StartError("Visualizer is currently running!");
                }
            }

    }
    
    function HandleTargetNodePlacement(e) {
            if (e.ctrlKey && e.buttons && e.target.className === 'grid-item') {
                if (!hasStarted && !needsReset) {
                    if (!creatingMaze) {
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
                    } else {
                        StartError("A maze is currently being made!");
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
    
    function ResetNodes() {
        if (!hasStarted) {
            var nodes = document.getElementsByClassName('grid-item open-node');
            var node;
            var timer;
            needsReset = true;
            if (document.getElementsByClassName('grid-item open-node').length > 0 || document.getElementsByClassName('grid-item best-path').length > 0 || document.getElementsByClassName('grid-item closed-node').length > 0) {
                timer = setInterval(() => {
                    if (document.getElementsByClassName('grid-item best-path').length == 0 && document.getElementsByClassName('grid-item closed-node').length == 0 && document.getElementsByClassName('grid-item open-node').length == 0) {
                        clearInterval(timer);
                        needsReset = false;
                    } else if (document.getElementsByClassName('grid-item closed-node').length == 0 && document.getElementsByClassName('grid-item open-node').length == 0) {
                        nodes = document.getElementsByClassName('grid-item best-path');
                        node = nodes[0];
                        node.classList.remove('best-path');
                    } else if (document.getElementsByClassName('grid-item open-node').length == 0) {
                        nodes = document.getElementsByClassName('grid-item closed-node');
                        node = nodes[0];
                        node.classList.remove('closed-node');
                    } else {
                        node = nodes[0];
                        node.classList.remove('open-node');
                    }
                    if (node) {
                        $(node).data('f', Infinity);
                        $(node).data('h', 0);
                        $(node).data('g', Infinity);
                        $(node).data('neighbors', 0);
                        $(node).data('previous', 0);
                    }  
                }, 5)
            } else {
                clearInterval(timer);
                needsReset = false;
            }
        } else {
            StartError("Visualizer already running!");
        }
    }

    function ResetWalls() {
        if (!hasStarted) {
            if (!creatingMaze) {
                var timer;
                resettingWalls = true
                const nodes = document.getElementsByClassName('grid-item wall');
                if (nodes.length > 0) {
                    timer = setInterval(() => {
                        node = nodes[0];
                        node.classList.remove('wall');
                        if (nodes.length === 0) {
                            clearInterval(timer);
                            resettingWalls = false
                        }
                    }, 5)
                } else {
                    clearInterval(timer);
                    resettingWalls = false;
                }
            } else {
                StartError("A maze is currently being made!");
            }
        } else {
            StartError("Visualizer already running!");
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
        if (creatingMaze) {
            StartError("A maze is currently being made!");
            return;
        }
        if(resettingWalls) {
            StartError("Walls are currently being reset!");
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
        }
    }
    
    function RemoveFromArray(arr, elt) {
        for (var i = arr.length - 1; i >= 0; i--) {
            if (arr[i] === elt) {
                arr.splice(i, 1);
            }
        }
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
            }, 25);
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

    function CreateMaze() {
        if (!hasStarted) {
            if (!creatingMaze) {
                if(!resettingWalls) {
                    for(var i = 0; i < rows; i++ ) {
                        for(var j = 0; j < cols; j++) {
                            const temp = grid[i][j];
                            if (temp.childNodes[0]) {
                                if (temp.childNodes[0].className == 'far fa-dot-circle target') {
                                    temp.childNodes[0].parentElement.removeChild(temp.childNodes[0]);
                                } else if (temp.childNodes[0].className == 'fa fa-arrow-right start') {
                                    temp.childNodes[0].parentElement.removeChild(temp.childNodes[0]);
                                }
                            }
                        }
                    }
                    i = 0;
                    j = 0;
                    ResetWalls();
                    
                    ResetNodes();

                    maze = mazes[parseInt(Math.random() * (mazes.length))];
                    timer = setInterval(() => {
                        if (!resettingWalls && !needsReset) {
                            creatingMaze = true;
                            if (i === maze.length - 1 && j === maze[i].length - 1) {
                                clearInterval(timer);
                                creatingMaze = false;
                            }
                            if (maze[i][j] === 1) {
                                grid[i][j].classList.toggle('wall');
                            } else if (maze[i][j] === 0) {
                                grid[i][j].classList.remove('wall');
                            }
                            j++;
                            if (j === maze[i].length) {
                                j = 0;
                                i++;
                            }
                        }
                    }, 5)
                } else {
                    StartError("Walls are currently being reset!");
                }
            } else {
                StartError("A maze is currently being made!");
            }
        } else {
            StartError("Visualizer already running!");

        }
    }
    
    var timeout = null;
    var hasStarted = false;
    var needsReset = false;
    var creatingMaze = false
    var resettingWalls = false;
    var rows = 20;
    var cols = 50;
    var grid;
    const mazes = [
        [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1],
            [1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
            [1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1],
            [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1],
            [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1],
            [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
            [1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ],
        [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
            [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1],
            [1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1],
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1],
            [1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
            [1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1],
            [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ],
        [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1],
            [1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1],
            [1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1],
            [1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ]
    ]
    MakeGrid(rows, cols);
    
    window.addEventListener('mousedown', (e) => HandleWallPlacement(e));
    const resetNodes = document.getElementsByClassName('reset-nodes')[0];
    resetNodes.addEventListener('click', ResetNodes);
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

    const createMaze = document.getElementsByClassName('create-maze')[0];
    createMaze.addEventListener('click', CreateMaze);
})
