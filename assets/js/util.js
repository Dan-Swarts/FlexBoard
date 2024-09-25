function loadBoardState(){
    boardData = localStorage.getItem('boardData');
    if(!boardData){
        autoFillTiles();
        return;
    }

    clearBoard();
    boardData = JSON.parse(boardData);

    for(let i = 0; i < boardData.length; i++){
        for(let j = 0; j < boardData.length; j++){
            space = boardData[i][j];
            if(space.tileColor == 'tile white'){
                createTile('white',i,j);
            } else if (space.tileColor == 'tile black'){
                createTile('black',i,j);
            } else {continue;}

            if(space.pieceColor){
                pieceName = space.pieceColor + ' ' + space.pieceType;
                createPiece(pieceName,i,j);
            }
        }
    }
}

function saveBoardState(){
    let boardData = [];

    for (let i = 0; i < 13; i++) {
        boardData[i] = [];
        for (let j = 0; j < 13; j++) {
            boardData[i][j] = {
                tileColor: '',
                pieceColor: '',
                pieceType: ''
            }; 
        }
    };

    for (let i = 0; i < tiles.length; i++) { 
        let tile = tiles[i];
        let tileColor = tile.className;
        let tileX = tile.getAttribute('data-x');
        let tileY = tile.getAttribute('data-y');

        boardData[tileX][tileY].tileColor = tileColor;
    };

    for (let i = 0; i < pieces.length; i++) { 
        let piece = pieces[i];
        let pieceColor = piece.className.split(' ')[2];
        let pieceType = piece.className.split(' ')[3];
        let pieceX = piece.getAttribute('data-x');
        let pieceY = piece.getAttribute('data-y');
        
        boardData[pieceX][pieceY].pieceColor = pieceColor;
        boardData[pieceX][pieceY].pieceType = pieceType;
    };

    const serializedBoard = JSON.stringify(boardData);
    
    localStorage.setItem('boardData', serializedBoard);
    console.log('Board saved successfully');
};

function checkBoard(indexX,indexY,className){
    /* 
    This function searches all children of the board for children with 
    The specified className and index, return true if found or false if 
    none are found
    */
    const children = boardArea.children;
    for (var i = 0; i < children.length; i++){
        let child = children[i];

        if(child.classList.contains(className)){
            let x = child.getAttribute('data-x');
            let y = child.getAttribute('data-y');
            if(x == indexX && y == indexY){
                return child;
            }
        }
    }
    return false;
}

function hideHighlight() {
    highlights.forEach((highlight) => {
        highlight.style.display = 'none';
    });
}

function clearHighlights(){
    highlights.forEach((highlight) => {
        highlight.remove();
    });
    highlights = [];
}

function pixelToIndex(clientX, clientY) {
    /* 
    This function converts from pixel values on the screen to index values on 
    the chess board.

    inputs: event.clientX, and event.clientY
    outputs: object cotaining an x value and y value

    example usage: inputed (231.3,294.1), outputs (3,3)
    Position (3,3) is the X on this  tile board:

    0  0  0  0  0  0  0  0  
    0  0  0  0  0  0  0  0  
    0  0  0  0  0  0  0  0  
    0  0  0  X  0  0  0  0  
    0  0  0  0  0  0  0  0  
    0  0  0  0  0  0  0  0  
    0  0  0  0  0  0  0  0  
    0  0  0  0  0  0  0  0  
    */

    bounds = boardArea.getBoundingClientRect();
    const index_X = Math.round((clientX - bounds.left) / TILE_SIZE);
    const index_Y = Math.round((clientY - bounds.top) / TILE_SIZE);
    return {
        x: Math.max(0, Math.min(index_X, GRID_SIZE - 1)),
        y: Math.max(0, Math.min(index_Y, GRID_SIZE - 1))
    };
}

function placeObject(object, indexX, indexY) {
    object.style.left = indexX * TILE_SIZE + 'px';
    object.style.top = indexY * TILE_SIZE + 'px';
    object.dataset.x = indexX;
    object.dataset.y = indexY;
}

function createTile(color, indexX, indexY) {
    // deleteTile(indexX,indexY);
    const tile = document.createElement('div');
    tile.classList.add('tile', color);
    tile.draggable = true;
    tiles.push(tile);
    boardArea.appendChild(tile);

    tile.addEventListener('dragstart', (e) => {
        draggedTile = e.target;
        e.dataTransfer.setData('text/plain', '');
    });

    placeObject(tile, indexX, indexY);
    return tile;
}

function createPiece(pieceName,indexX,indexY){
    // deletePiece(indexX,indexY);
    const piece = document.createElement('div');
    const piece_classes = pieceName.split(' ') ;
    piece.classList.add('piece', 'z-50',piece_classes[0],piece_classes[1]);
    piece.draggable = true;
    pieces.push(piece);
    boardArea.appendChild(piece);

    piece.addEventListener('dragstart', (e) => {
        draggedTile = e.target;
        e.dataTransfer.setData('text/plain', '');
    });

    placeObject(piece, indexX, indexY);
    return piece;
}

function createHighlight(indexX,indexY,visible=true){
    // deleteHighlight(indexX,indexY);
    const highlight = document.createElement('div');
    highlight.classList.add('highlight');
    highlights.push(highlight);
    boardArea.appendChild(highlight);
    placeObject(highlight,indexX,indexY);
    if(visible){
        highlight.style.display = 'block';
    } else {
        highlight.style.display = 'none';
    }
    return highlight;
}

function deletePiece(indexX,indexY){
    for (let i = 0; i < pieces.length; i++){
        piece = pieces[i];
        let x = piece.getAttribute('data-x');
        let y = piece.getAttribute('data-y');
        if(x == indexX && y == indexY){    
            pieces.splice(i,1);
            piece.remove();
        }
    }
}

function deleteTile(indexX,indexY){
    for (let i = 0; i < tiles.length; i++){
        tile = tiles[i];
        let x = tile.getAttribute('data-x');
        let y = tile.getAttribute('data-y');
        if(x == indexX && y == indexY){
            deleteIndex = tiles.findIndex((object)=>{
                return object == tile;
            });

            if(deleteIndex != -1){
                tiles.splice(deleteIndex,1);
            }
            tile.remove();
        }
    }
}

function deleteHighlight(indexX,indexY){
    for(let i = 0; i< highlights.length; i++){
        highlight = highlights[i];
        let x = highlight.getAttribute('data-x');
        let y = highlight.getAttribute('data-y');
        if(x == indexX && y == indexY){    
            highlights.splice(i,1);
            highlight.remove();
        }
    }
}

function clearBoard() {
    boardArea.innerHTML = '';
    tiles = [];
    highlightElement = null;
}