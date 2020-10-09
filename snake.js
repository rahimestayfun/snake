//CANVAS
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

//SCORE
let score = 0;
let scoreBoard = document.querySelector("#score");
scoreBoard.innerText = score;

//FOOD AND SNAKE UNIT
let unit = 32;

//CREATING FOOD AND BOARD;
const foodImage = new Image();
const gameBoardImage = new Image();
foodImage.src = "./asset/apple.png";
gameBoardImage.src = "./asset/gameboard.png";

//SNAKE AND AND FOOD (RANDOM) POSITIONS
let snake = [];
snake[0] = { x: 9 * unit, y: 10 * unit };

// GAME BOARD CONSISTS OF 19 UNITS, SO FOOD MUST BE POSITIONED RANDOMLY
let food = {
  x: Math.floor(Math.random() * 19 + 0) * unit,
  y: Math.floor(Math.random() * 19 + 0) * unit,
};

// DRAWING BOARD,FOOD AND SNAKE PARTS IN CANVAS
const setUpDrawings = () => {
  ctx.drawImage(gameBoardImage, 0, 0);
  ctx.drawImage(foodImage, food.x, food.y);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i == 0 ? "gray" : "lightgray";
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit); //for filled rectangle
    ctx.lineWidth = 0.1;
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit); //for rectangle outline
  }
};

//SNAKE DIRECTION - GRABBING KEY COMMANDS
let snakeDirection;
// arrowLeft = 37, arrowUp = 38, arrowRight = 39, arrowDown = 40;
const setSnakeDirection = (e) => {
  let key = e.keyCode;
  if (key == 37 && snakeDirection != "RIGHT") {
    snakeDirection = "LEFT";
  } else if (key == 38 && snakeDirection != "DOWN") {
    snakeDirection = "UP";
  } else if (key == 39 && snakeDirection != "LEFT") {
    snakeDirection = "RIGHT";
  } else if (key == 40 && snakeDirection != "UP") {
    snakeDirection = "DOWN";
  }
};

//COLLISION OF HEAD AND BODY OF SNAKE
const collision = (head, snakeBody) => {
  for (let i = 0; i < snakeBody.length; i++) {
    if (head.x === snakeBody[i].x && head.y === snakeBody[i].y) {
      return true;
    }
  }
  return false;
};

// COLLISION OF FOOD INSIDE SNAKE
const foodCollision = (food, snakeBody) => {
  for (let i = 0; i < snakeBody.length; i++) {
    if (food.x === snakeBody[i].x && food.y === snakeBody[i].y) {
      return true;
    }
  }
  return false;
};

// ###### OUR MAIN FUNCTION ######
const play = () => {
  setUpDrawings();

  if (foodCollision(food, snake)) {
    return (food = {
      x: Math.floor(Math.random() * 19 + 0) * unit,
      y: Math.floor(Math.random() * 19 + 0) * unit,
    });
  }
  // FINDING HEAD OF SNAKE AND DECIDE THE DIRECTION ACCORDING TO KEYCODE
  let snakeFirstHeadX = snake[0].x;
  let snakeFirstHeadY = snake[0].y;

  if (snakeDirection == "LEFT") snakeFirstHeadX -= unit;
  if (snakeDirection == "UP") snakeFirstHeadY -= unit;
  if (snakeDirection == "RIGHT") snakeFirstHeadX += unit;
  if (snakeDirection == "DOWN") snakeFirstHeadY += unit;

  //EATING FOOD - CHECKING COLLISION - SETTING NEW FOOD LOCATION
  if (snakeFirstHeadX === food.x && snakeFirstHeadY === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * 19) * unit,
      y: Math.floor(Math.random() * 19) * unit,
    };
    scoreBoard.innerText = score;
  } else {
    // REMOVING THE TAIL
    snake.pop();
  }
  //ADDING NEW HEAD TO THE BEGINNING
  let snakeNewHead = { x: snakeFirstHeadX, y: snakeFirstHeadY };
  //GAME END
  if (
    snakeFirstHeadX < 0 ||
    snakeFirstHeadY < 0 ||
    snakeFirstHeadX > 18 * unit ||
    snakeFirstHeadY > 18 * unit ||
    collision(snakeNewHead, snake)
  ) {
    clearCanvas();
  }
  //ADDING NEW HEAD INTO THE BEGINNING OF THE SNAKE
  snake.unshift(snakeNewHead);
};
// CLEARING CANVAS
const clearCanvas = () => {
  clearInterval(game);
};
// RESTARTING THE GAME
const restart = (e) => {
  location.reload();
};

document.addEventListener("keydown", setSnakeDirection);
let game = setInterval(play, 100);
window.addEventListener("keydown", (e) =>
  e.keyCode === 13 ? restart() : null
);
