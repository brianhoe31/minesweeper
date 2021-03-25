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
        const bombsArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width * width - bombAmount).fill('valid')
        const gameArray = emptyArray.concat(bombsArray)

        const shuffledArray = gameArray.sort(() => Math.random() - 0.5)

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div')
            square.setAttribute('id', i)
            square.classList.add(shuffledArray[i])
            grid.appendChild(square)
            squares.push(square)

            //normal click
            square.addEventListener('click', function (e) {
                click(square)
            })

            //cntrl and left click
            square.oncontextmenu = function (e) {
                e.preventDefault()
                addFlag(square)
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
                squares[i].setAttribute('data', total)
            }
        }
    }
    createBoard()



    //game over
    function gameOver(square) {
        result.innerHTML = 'BOOM! Game Over!'
        isGameOver = true

        //show ALL the bombs
        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣'
                square.classList.remove('bomb')
                square.classList.add('checked')
            }
        })
    }
});