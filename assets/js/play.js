boardArea = document.getElementById('board-area');
homeBtn = document.getElementById('home-button');
playColorEl = document.getElementById('playColor');

/* Timer functionality */
const timerText = document.getElementById('timer');

let timerTimeMinutes = 10*60;
const TILE_SIZE = 50;
const GRID_SIZE = 13;
const MAX_TILES = 170;
let draggedTile = null;
let tiles = [];
let pieces = [];
let highlights = [];
let playColor = 'white';

function startTimer() {
    let timer = timerTimeMinutes;
    let newInterval = setInterval(function() {
        minutes = parseInt(timer/ 60, 10);
        seconds = parseInt(timer % 60, 10);

        timerText.innerText = "(" + minutes + ":" + seconds + ")";

        if (--timer < 0){
            clearInterval(newInterval);
            display.innerText = "Game Finished!";
        }
    }, 1000);
}

function switchColor(){
    if(playColor == 'white'){
        playColor = 'black';
        playColorEl.textContent = "Black's Move";
    } else {
        playColor = 'white';
        playColorEl.textContent = "White's Move";
    }
}

homeBtn.addEventListener('click',()=>{
    window.location.href = 'index.html';
});

boardArea.addEventListener('dragover', (e) => {
    if(draggedTile){
        e.preventDefault();
        const position = pixelToIndex(e.clientX, e.clientY);
        placeObject(target,position.x,position.y);
        target.style.display = 'block';
    }
});

boardArea.addEventListener('dragleave', () => {
    hideHighlight();
});

boardArea.addEventListener('drop', (e) => {
    e.preventDefault();
    hideHighlight();

    if(!draggedTile){return;}

    const position = pixelToIndex(e.clientX,e.clientY);
    const classList = draggedTile.classList
    const destination = checkBoard(position.x,position.y,'piece');

    if (classList.contains('fa-regular') && playColor == 'white'){

        if(destination != draggedTile){
            deletePiece(position.x, position.y);
        }

        placeObject(draggedTile, position.x, position.y);
        switchColor();

    } else if (classList.contains('fa-solid') && playColor == 'black'){

        if(destination != draggedTile){
            deletePiece(position.x, position.y);
        }
        placeObject(draggedTile, position.x, position.y);
        switchColor();
    }

    draggedTile = null;
});

startTimer();
loadBoardState();
let target = createHighlight(1,1,visible=false);

tiles.forEach(tile => {
    tile.draggable = false;
});