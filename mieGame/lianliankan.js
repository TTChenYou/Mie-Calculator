let boardSize = 6;
const symbols = ['🍎','🍌','🍇','🍒','🍑','🍍','🥝','🍓','🍊','🥑','🌽','🍉','🥥','🥕','🍈','🥬'];
let selectedTiles = [];
let tileElements = [];

let gameStarted = false;
let gameMode = 'countup';
let timer = 0;
let timerInterval = null;
let clickCount = 0;
let maxCountdown = 60;

function generateSymbols() {
  const total = boardSize * boardSize;
  const neededPairs = total / 2;
  let pool = [];

  for (let i = 0; i < neededPairs; i++) {
    const symbol = symbols[i % symbols.length];
    pool.push(symbol, symbol);
  }

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool;
}

function createBoard() {
  const board = document.getElementById('game-board');
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${boardSize}, auto)`;
  tileElements = [];
  selectedTiles = [];

  const shuffled = generateSymbols();
  const total = boardSize * boardSize;

  for (let i = 0; i < total; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.dataset.symbol = shuffled[i];
    tile.dataset.index = i;

    tile.addEventListener('click', () => handleTileClick(tile));
    board.appendChild(tile);
    tileElements.push(tile);
  }
}

function handleTileClick(tile) {
  if (!gameStarted || tile.classList.contains('matched') || tile.classList.contains('selected')) return;

  tile.textContent = tile.dataset.symbol;
  tile.classList.add('selected');
  selectedTiles.push(tile);
  clickCount++;
  updateStatus();

  if (selectedTiles.length === 2) {
    const [t1, t2] = selectedTiles;
    if (t1.dataset.symbol === t2.dataset.symbol) {
      setTimeout(() => {
        t1.classList.add('matched');
        t2.classList.add('matched');
        t1.classList.remove('selected');
        t2.classList.remove('selected');
        t1.style.visibility = 'hidden';
        t2.style.visibility = 'hidden';
        selectedTiles = [];
        checkGameOver();
      }, 200);
    } else {
      setTimeout(() => {
        t1.textContent = '';
        t2.textContent = '';
        t1.classList.remove('selected');
        t2.classList.remove('selected');
        selectedTiles = [];
      }, 400);
    }
  }
}

function checkGameOver() {
  const left = tileElements.filter(tile => !tile.classList.contains('matched'));
  if (left.length === 0) {
    clearInterval(timerInterval);
    gameStarted = false;

    if (gameMode === 'countup') {
      setTimeout(() => {
        alert(`🎉 通关成功！\n用时：${timer} 秒\n总共点击：${clickCount} 次`);
      }, 300);
    }
  }
}

function updateStatus() {
  document.getElementById('timer').textContent = timer;
  document.getElementById('clicks').textContent = clickCount;
}

function startGame() {
  gameMode = document.querySelector('input[name="mode"]:checked').value;
  gameStarted = true;
  timer = 0;
  clickCount = 0;
  updateStatus();

  createBoard();

  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer++;
    updateStatus();

    if (gameMode === 'countdown' && timer >= maxCountdown) {
      clearInterval(timerInterval);
      gameStarted = false;
      alert('⏰ 时间到！肥羊这把没赢～');
    }
  }, 1000);
}

function confirmRestart() {
  if (confirm("确定要重新开始吗？🐏")) {
    startGame();
  }
}

function setDifficulty(size) {
  boardSize = size;
  gameStarted = false;
  clearInterval(timerInterval);
  document.getElementById('timer').textContent = '0';
  document.getElementById('clicks').textContent = '0';
  document.getElementById('game-board').innerHTML = '';
}

function setCustomSize() {
  let input = prompt("请输入棋盘尺寸（如 6 表示 6x6）：");
  const value = parseInt(input);
  if (!isNaN(value) && value >= 2 && value <= 20) {
    if ((value * value) % 2 !== 0) {
      alert("总格子数必须是偶数才能配对！");
    } else {
      setDifficulty(value);
    }
  } else {
    alert("请输入 2～20 的整数！");
  }
}
