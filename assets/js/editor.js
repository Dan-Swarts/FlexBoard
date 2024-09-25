// TODO: Create save button which saves the current board to local storage

const boardArea = document.getElementById('board-area');
const clearBoardBtn = document.getElementById('clear-board');
const homeBtn = document.getElementById('home-button');
const playBtn = document.getElementById('play-button');
const clearPiecesBtn = document.getElementById('clear-pieces');
const saveBtn = document.getElementById('save-button');
const loadBtn = document.getElementById('upload-button');
const autoFillBtn = document.getElementById('autofill-board');


let draggableElements = document.querySelectorAll('.draggable');

draggableElements.forEach((element) => {
    element.draggable = true;
    element.addEventListener('dragstart',(e) => {
        draggedTile = e.target;
    });
});

const TILE_SIZE = 50;
const GRID_SIZE = 13;
const MAX_TILES = 170;
let draggedTile = null;
let tiles = [];
let pieces = [];
let highlights = [];
let target = null;
// target.style.display = 'none';


function addTiles(color, count) {
    const remainingSlots = MAX_TILES - tiles.length;
    const tilesToAdd = Math.min(count, remainingSlots);

    for (let i = 0; i < tilesToAdd; i++) {
        const position = findAvailablePosition();
        if (position) {
            const tile = createTile(color, position.x, position.y);
            updateTileCount();
        } else {
            document.getElementById('reachedlimitmodel').classList.remove('hidden');
            document.getElementById('createarea').classList.add('hidden');
            console.log('Reaching this part of the code!!');
            document.getElementById('close-button').addEventListener("click", ()=>{
                document.getElementById('reachedlimitmodel').classList.add('hidden');
                document.getElementById('createarea').classList.remove('hidden');
            });
            break;
        }
    }

    updateTileCount();
    updateControls();
}

function autoFillTiles() {
    clearBoard();
    updateTileCount();
    updateControls();
    tile_color = 'white';

    // create function to swap colors
    const swap_color = function () {
        if(tile_color == 'white'){
            tile_color = 'black';
        } else {
            tile_color = 'white';
        }
    };

    for(let col = 0; col < GRID_SIZE; col++){
        for(let row = 0; row < GRID_SIZE; row++){
            createTile(tile_color,col,row);
            updateTileCount();
            swap_color();
        }

        if(!(GRID_SIZE % 2)){
            swap_color();
        }
    }
}

function findAvailablePosition() {
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            if (!tiles.some(t => t.dataset.x == x && t.dataset.y == y)) { // Don't attempt to put tripple equals since string and number comparison
                return { x, y };
            }
        }
    }
    return null;
}

function clearPieces() {
    for(let i = 0; i < pieces.length; i++){
        piece = pieces[i]
        piece.remove();
    }
    pieces = [];
}

clearBoardBtn.addEventListener('click', () => {clearBoard();updateTileCount();updateControls();});

boardArea.addEventListener('dragover', (e) => {
    if(draggedTile){
        e.preventDefault();
        const position = pixelToIndex(e.clientX, e.clientY);
        placeObject(target,position.x,position.y);
        target.style.display = 'block';
    }
});


boardArea.addEventListener('drop', (e) => {
    e.preventDefault();
    hideHighlight();

    if(!draggedTile){return;}

    const position = pixelToIndex(e.clientX,e.clientY);
    const classList = draggedTile.classList

    if (classList.contains('piece')){

        const destination = checkBoard(position.x,position.y,'piece');

        if(destination != draggedTile){
            deletePiece(position.x, position.y);
        }

        placeObject(draggedTile, position.x, position.y);

    } else if (classList.contains('piece-maker')){
        const destination = checkBoard(position.x,position.y,'piece');

        if(destination != draggedTile){
            deletePiece(position.x, position.y);
        }

        piece_classes = Array.from(classList).filter((className) => {
            return className.startsWith('fa-');
        });

        createPiece(`${piece_classes[0]} ${piece_classes[1]}`,position.x,position.y);

    } else if (classList.contains('tile')) {

        const destination = checkBoard(position.x,position.y,'tile');

        if(destination != draggedTile){
            deleteTile(position.x, position.y);
        }
        placeObject(draggedTile, position.x, position.y);

    } else if (classList.contains('tile-maker')) {
        const destination = checkBoard(position.x,position.y,'tile');

        if(destination != draggedTile){
            deleteTile(position.x, position.y);
        }

        if(draggedTile.classList.contains('white')){
            createTile('white',position.x,position.y);
            updateTileCount();
        }

        else if(draggedTile.classList.contains('black')){
            createTile('black',position.x,position.y);
            updateTileCount();
        }
    } else if(classList.contains('tile-eraser')){
        deletePiece(position.x,position.y);
        deleteTile(position.x,position.y);

    } else if (classList.contains('piece-eraser')){
        deletePiece(position.x,position.y);
    }

    draggedTile = null;
});

boardArea.addEventListener('dblclick', (e) => {
    if (e.target.classList.contains('tile')) {
        e.target.classList.toggle('white');
        e.target.classList.toggle('black');
    }
});

autoFillBtn.addEventListener('click',() => {
    autoFillTiles();
});

homeBtn.addEventListener('click',()=>{
    window.location.href = 'index.html';
});

playBtn.addEventListener('click',()=>{
    window.location.href = 'play.html';
});

clearPiecesBtn.addEventListener('click',()=>{
    clearPieces();
});

saveBtn.addEventListener('click',() => {
    saveBoardState();
});

loadBtn.addEventListener('click', () => {
    loadBoardState();
});


loadBoardState();
target = createHighlight(1,1,visible=false);
