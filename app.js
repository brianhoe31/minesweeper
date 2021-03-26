$(document).ready(function () {
    const grid = document.querySelector('.grid');
    const flagsLeft = document.querySelector('#flags-left');
    const result = document.querySelector('#result');
    let width = 10;
    let bombAmount = 20;
    let flags = 0;
    let squares = [];
    let isGameOver = false;

    function createBoard() {
        //changes the number of bombs left 
        flagsLeft.innerHTML = bombAmount;

        //get shuffled game array with random bombs
        const bombsArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(width * width - bombAmount).fill('valid');
        const gameArray = emptyArray.concat(bombsArray);

        const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.setAttribute('id', i);
            square.classList.add(shuffledArray[i]);
            grid.appendChild(square);
            squares.push(square);

            //normal click
            square.addEventListener('click', function (e) {
                click(square);
            })

            //cntrl and left click
            square.oncontextmenu = function (e) {
                e.preventDefault();
                addFlag(square);
            }
        }

        //add bomb # markers 
        for (let i = 0; i < squares.length; i++) {
            const isLeftSide = (i % width === 0);
            const isRightSide = ((i + 1) % width === 0);
            let total = 0;

            if (squares[i].classList.contains('valid')) {
                if (i > 0 && !isLeftSide && squares[i - 1].classList.contains('bomb')) total++;
                if (i < (width * width - 1) && !isRightSide && squares[i + 1].classList.contains('bomb')) total++;
                if (i >= width && squares[i - width].classList.contains('bomb')) total++;
                if (i < (width * width - width) && squares[i + width].classList.contains('bomb')) total++;

                if (i > width && !isLeftSide && squares[i - 1 - width].classList.contains('bomb')) total++;
                if (i > (width - 1) && !isRightSide && squares[i + 1 - width].classList.contains('bomb')) total++;
                if (i < (width * width - width) && !isLeftSide && squares[i - 1 + width].classList.contains('bomb')) total++;
                if (i < (width * width - width - 1) && !isRightSide && squares[i + 1 + width].classList.contains('bomb')) total++;
                squares[i].setAttribute('data', total);
            }
        }
    }
    createBoard();

    //click on square actions
    function click(square) {
        let currentId = square.id;
        if (isGameOver) return;
        if (square.classList.contains('checked') || square.classList.contains('flag')) return;
        if (square.classList.contains('bomb')) {
            gameOver(square);
        } else {
            let total = square.getAttribute('data');
            if (total != 0) {
                square.classList.add('checked');
                if (total == 1) square.classList.add('one');
                else if (total == 2) square.classList.add('two');
                else if (total == 3) square.classList.add('three');
                else if (total == 4) square.classList.add('four');
                square.innerHTML = total;
                return;
            }
            checkSquare(square, currentId);
        }
        square.classList.add('checked');
    }


    //check neighboring squares once square is clicked
    function checkSquare(square, currentId) {
        const isLeftEdge = (currentId % width === 0);
        const isRightEdge = (currentId % width === width - 1);

        setTimeout(() => {
            if (currentId > 0 && !isLeftEdge) {
                const newId = parseInt(currentId) - 1;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId > 9 && !isRightEdge) {
                const newId = parseInt(currentId) + 1 - width;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId > 9) {
                const newId = parseInt(currentId) - width;
                const newSquare = document.getElementById(newId)
                click(newSquare);
            }
            if (currentId > 10 && !isLeftEdge) {
                const newId = parseInt(currentId) - 1 - width;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 99 && !isRightEdge) {
                const newId = parseInt(currentId) + 1;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 90 && !isLeftEdge) {
                const newId = parseInt(currentId) - 1 + width;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 89 && !isRightEdge) {
                const newId = parseInt(currentId) + 1 + width;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 90) {
                const newId = parseInt(currentId) + width;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
        }, 10);
    }

    //game over
    function gameOver(square) {
        result.innerHTML = 'BOOM! Game Over!';
        isGameOver = true;

        //show ALL the bombs
        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣';
                square.classList.remove('bomb');
                square.classList.add('checked');
            }
        })
    }
});