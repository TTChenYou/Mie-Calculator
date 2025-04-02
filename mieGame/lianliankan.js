const boardSize = 6; // 6x6 网格
const totalTiles = boardSize * boardSize;
const symbols = ['🍎', '🍌', '🍇', '🍒', '🍑', '🍍', '🥝', '🍓', '🍊', '🥑', '🌽', '🍉'];

let selectedTiles = [];
let tileElements = [];

function generateSymbols() {
  const neededPairs = totalTiles / 2;
  let pool = [];

  for (let i = 0; i < neededPairs; i++) {
    const symbol = symbols[i % symbols.length];
    pool.push(symbol, symbol); // 每个图案两次
  }

  // 打乱顺序
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool;
}

function createBoard() {
  const board = document.getElementById('game-board');
  board.innerHTML = '';
  tileElements = [];
  selectedTiles = [];

  const shuffledSymbols = generateSymbols();

  for (let i = 0; i < totalTiles; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.dataset.symbol = shuffledSymbols[i];
    tile.dataset.index = i;

    tile.addEventListener('click', () => handleTileClick(tile));
    board.appendChild(tile);
    tileElements.push(tile);
  }
}

function handleTileClick(tile) {
  if (tile.classList.contains('matched') || tile.classList.contains('selected')) return;

  tile.textContent = tile.dataset.symbol;
  tile.classList.add('selected');
  selectedTiles.push(tile);

  if (selectedTiles.length === 2) {
    const [tile1, tile2] = selectedTiles;

    if (tile1.dataset.symbol === tile2.dataset.symbol) {
      // 匹配成功
      setTimeout(() => {
        tile1.classList.add('matched');
        tile2.classList.add('matched');
        tile1.classList.remove('selected');
        tile2.classList.remove('selected');
        selectedTiles = [];

        tile1.style.visibility = 'hidden';
        tile2.style.visibility = 'hidden';

        checkGameOver();
      }, 300);
    } else {
      // 匹配失败
      setTimeout(() => {
        tile1.textContent = '';
        tile2.textContent = '';
        tile1.classList.remove('selected');
        tile2.classList.remove('selected');
        selectedTiles = [];
      }, 500);
    }
  }
}

function checkGameOver() {
  const remaining = tileElements.filter(tile => !tile.classList.contains('matched'));
  if (remaining.length === 0) {
    setTimeout(() => {
      alert('🎉 通关啦！肥羊太强啦～');
    }, 300);
  }
}

function restartGame() {
  createBoard();
}

window.onload = createBoard;
