//! CONSTANTS
const level = {
    'easy': {cellWidth: 8, cellHeight: 10, boardWidth: 48, boardHeight: 60, mineNum: 5},
    'medium': {cellWidth: 14, cellHeight: 18, boardWidth: 56, boardHeight: 70, mineNum: 20},
    'hard': {cellWidth: 20, cellHeight: 24, boardWidth: 64, boardHeight: 80, mineNum: 40},
}

//! CACHED ELEMENTS
const grid = document.querySelector('.grid')

//! GLOBAL VARIABLES
let board
let difficulty = 'medium'
let minesArr
let flagsPlaced

function init() {
    // ! VARIABLES AND ELEMENTS
    // ? ELEMENTS
    
    // ? VARIABLES
    //BOARD CONFIG
    const width = level[difficulty].cellWidth
    const height = level[difficulty].cellHeight
    const cellCount = width * height
    grid.style.height = `${level[difficulty].boardHeight}vmin`
    grid.style.width = `${level[difficulty].boardWidth}vmin`
    minesArr = []
    flagsPlaced = 0
    
    //! FUNCTIONS
    function createGrid() {
        let rowCounter = 0
        for (let i=0; i<cellCount; i++) {
            const cell = document.createElement('div')
            cell.setAttribute('data-index', i)
            cell.innerText = i
            cell.style.height = `${100/height}%`
            cell.style.width = `${100/width}%`
            //implement cell checkerboard
            cell.style.backgroundColor = `var(--grass1-bg)`
            if (i % width === 0) {
                rowCounter++
            }
            if ((rowCounter % 2 === 0 || rowCounter === 0) && (i % 2 === 0 || i % 2 === 0)) {
                cell.style.backgroundColor = `var(--grass2-bg)`
            } else if ((rowCounter % 2 === 1) && (i % 2 === 1)) {
                cell.style.backgroundColor = `var(--grass2-bg)`
            } 
            grid.appendChild(cell)
        }
    }

    function createNumbers() {
        
        function placeMines() {
            let minesPlaced = 0;
            while (minesPlaced < level[difficulty].mineNum) {
                const mineToPlace = randNum()
                const cellToPlace = document.querySelector('[data-index="' + mineToPlace + '"]')
                if (cellToPlace.innerText === '-1') {
                } else {
                    cellToPlace.setAttribute('MSGRID', -1)
                    cellToPlace.innerText = '-1'
                    cellToPlace.style.fontSize = '5vmin';
                    cellToPlace.style.color = 'red';
                    minesPlaced++
                    minesArr.push(mineToPlace)
                }
            }
        }

        function placeNumbers(){
            //get each cell in the grid, one by one
            for(let i = 0; i<cellCount; i++) {

                let adjMineCount = 0;

                let adjCellArr = [];

                //get each adjacent cell and put it in an array
                function getHoriz() {
                    // horiz left
                    if (i % width !== 0 ) {
                        adjCellArr.push(i-1);
                    }
                    //horiz right
                    if (i % width !== width-1 || i === 0) {
                        adjCellArr.push(i+1)
                    }
                }    
                
                function getVert() {
                    //vert above
                    if (i - width >= 0) {
                        adjCellArr.push(i-width)
                    }
                    //vert below
                    if (i + width <= cellCount-1) {
                        adjCellArr.push(i+width)
                        // console.log(`${i+width} pushed`)
                    }
                }
                
                function getDiagRight() {
                    // console.log(`i = ${i}`)
                    // console.log(`i+width + 1 = ${(i+width)+1}`)
                    //diag right up
                    if ((i - width)+1 >0 && ((i - width)+1)%width !==0 ) {
                        adjCellArr.push((i - width)+1)
                    } else {
                        // console.log('nothing pushed')
                    }
                    //diag right down
                    if ((i + width)+1 < cellCount && (((i + width)+1))%width !==0) {
                        adjCellArr.push((i + width)+1)
                        // console.log(`${(i + width)+1} pushed`)
                    } else {
                        // console.log('nothing pushed')
                    }
                }

                function getDiagLeft() {
                    // console.log(`i = ${i}`)
                    // console.log(`i+width - 1 modulus width= ${((i+width)-1)%width}`)
                    //diag left up
                    if ((i - width)-1 >0 && ((i - width)-1)%width !== width-1 ) {
                        adjCellArr.push((i - width)-1)
                        // console.log(`${(i - width)-1} pushed`)
                    } else {
                        // console.log('nothing pushed')
                    }
                    //diag left down
                    if ((i + width)-1 < cellCount-1 && ((i + width)-1)%width !==width-1) {
                        adjCellArr.push((i + width)-1)
                        // console.log(`${(i + width)-1} pushed`)
                    } else {
                        // console.log('nothing pushed')
                    }
                }

                // console.log(adjCellArr);
                
                function checkMineAdj() {
                    // console.log(`i = ${i}`)
                    // console.log(`minesArr = ${minesArr}`)
                    // console.log(`adjCellArr = ${adjCellArr}`)
                    for(let i=0; i<minesArr.length; i++) {
                        if(adjCellArr.includes(minesArr[i])) {
                            // console.log(`minesArr i = ${minesArr[i]}`)
                            // console.log(`adjCellArr i = ${adjCellArr[i]}`)
                            adjMineCount++
                        }
                        // console.log(`adjMineCount = ${adjMineCount}`)
                    }
                }

                // console.log(adjMineCount)
                function updateMSGRID() {
                    const cellToPlace = document.querySelector('[data-index="' + i + '"]')
                    // console.log(cellToPlace)
                    if(cellToPlace.hasAttribute('MSGRID') === false) {
                        cellToPlace.setAttribute('MSGRID', adjMineCount)
                        cellToPlace.innerText = `${adjMineCount}`
                        cellToPlace.style.fontSize = '4vmin';
                        if (adjMineCount >0) {
                            cellToPlace.style.color = 'orange';
                        }
                    }
                }

                getHoriz()
                getVert()
                getDiagRight()
                getDiagLeft()
                adjCellArr.sort(sortArr)
                minesArr.sort(sortArr)
                checkMineAdj()
                updateMSGRID()
            }
        }
        placeMines()
        placeNumbers()

        function randNum() {
            return Math.floor(Math.random() * cellCount);
        }
    }
    
    
    //! PAGE LOAD
    createGrid()
    createNumbers()
}

function handleLeftClick(evt) {
    // console.log(evt.target)
    function checkGameOver() {
        const cellMSGRIDValue = evt.target.getAttribute('MSGRID')
        if (cellMSGRIDValue === '-1') {
            gameOver()
            console.log('game over')
        } else {
            openUp()
            // console.log("open up")
        }
    }

    function openUp() {
        
        function checkMSGRIDIsNum() {
            const cellToCheck = evt.target
            const cellToCheckValue = cellToCheck.getAttribute('MSGRID')
            // console.log(typeof cellToCheckValue)
            // Number(cellToCheckValue)
            // console.log(typeof Number(cellToCheckValue))
            if (Number(cellToCheckValue) > 0) {
                cellToCheck.style.backgroundColor = 'blue'
            } else if (Number(cellToCheckValue) > 8) {
                console.log('invalid')
            } else if (Number(cellToCheckValue) === 0) {
                openUpIfZero()
            } else {console.log('invalid2')}
        }

        function openUpIfZero() {
            console.log('desired function running')
        }

        checkMSGRIDIsNum()
    }

    checkGameOver()
}

function handleRightClick(evt) {
    // console.log(evt.target)
    function toggleFlag() {
        const cellToToggleFlag = evt.target
        if (!cellToToggleFlag.hasAttribute('FLAG')) {
            evt.target.setAttribute('FLAG', '1')
            cellToToggleFlag.style.backgroundColor = 'pink'
            flagsPlaced++
        } else if (cellToToggleFlag.hasAttribute('FLAG')) {
            cellToToggleFlag.removeAttribute('FLAG')
            cellToToggleFlag.style.backgroundColor = 'brown'
            flagsPlaced--
        }
        console.log(`flagsPlaced = ${flagsPlaced}`)
        // console.log(cellToToggleFlag)
    }

    toggleFlag()
}

function gameOver() {

}


function sortArr(a,b) {
    return a-b
}

//! EVENT LISTENERS
window.addEventListener('DOMContentLoaded', init)
grid.addEventListener('click', handleLeftClick)
grid.addEventListener("contextmenu", evt => evt.preventDefault());
grid.addEventListener('contextmenu', handleRightClick)