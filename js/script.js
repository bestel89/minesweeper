//! CONSTANTS
const level = {
    'easy': {cellWidth: 8, cellHeight: 10, boardWidth: 48, boardHeight: 60, mineNum: 8},
    'medium': {cellWidth: 14, cellHeight: 18, boardWidth: 56, boardHeight: 70, mineNum: 30},
    'hard': {cellWidth: 20, cellHeight: 24, boardWidth: 64, boardHeight: 80, mineNum: 50},
}

const assets = {
    'mine': 'assets/mine.png',
    'flag': 'assets/flag.png',
}

//! CACHED ELEMENTS
const grid = document.querySelector('.grid')

//! GLOBAL VARIABLES
let board
let difficulty = 'easy'
let minesArr
let flagsPlaced
let undetectedMines
const width = level[difficulty].cellWidth
const height = level[difficulty].cellHeight
const cellCount = width * height

function init() {
    // ! VARIABLES AND ELEMENTS
    // ? ELEMENTS
    
    // ? VARIABLES
    //BOARD CONFIG
    grid.style.height = `${level[difficulty].boardHeight}vmin`
    grid.style.width = `${level[difficulty].boardWidth}vmin`
    grid.style.cursor = 'pointer'
    minesArr = []
    flagsPlaced = 0
    undetectedMines = level[difficulty].mineNum
    
    //! FUNCTIONS
    function createGrid() {
        let rowCounter = 0
        for (let i=0; i<cellCount; i++) {
            const cell = document.createElement('div')
            cell.setAttribute('data-index', i)
            // cell.innerText = i
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
                    cellToPlace.style.fontSize = '3vmin';
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
                        // cellToPlace.innerText = `${adjMineCount}`
                        cellToPlace.style.fontSize = '3vmin';
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
    const cellClicked = evt.target
    //get the MS GRID value of the cell
    const cellClickedValue = Number(cellClicked.getAttribute('MSGRID'))
    
    function checkLeftClickAction(cellClicked, cellClickedValue) {
        if (cellClickedValue === -1) {
            gameOver(minesArr)
            console.log('game over')
        } else if (cellClickedValue > 0) {
            // cellClicked.style.backgroundColor = 'blue'
            openSingleCell(cellClicked, cellClickedValue)
        } else if (cellClickedValue > 8) {
            console.log('invalid')
        } else if (cellClickedValue === 0) {
            openUp(cellClicked, cellClickedValue)
        } else {console.log('invalid2')}
    }

    function openSingleCell(cellClicked, cellClickedValue) {
        // console.log(cellClicked)
        // console.log(cellClickedValue)
        cellClicked.innerText = `${cellClickedValue}`
        cellClicked.style.backgroundColor = 'var(--dirt-bg)'
        cellClicked.setAttribute('OPEN', '1')
    }

    function gameOver(arr) {
        console.log(`mines arr: ${minesArr}`)
        for (let i=0; i<arr.length; i++) {
            console.log(arr[i])
            const cellToPlaceMine = document.querySelector(('[data-index="' + arr[i] + '"]'))
            console.log(cellToPlaceMine)
            const mineEl = document.createElement('img')
            mineEl.src = assets.mine
            mineEl.style.height = '4vmin'
            cellToPlaceMine.appendChild(mineEl)
        }
    }

    function openUp(cellClicked, cellClickedValue) {
        // console.log(`run openUp function`)
        cellClickedIdx = cellClicked.getAttribute('data-index')
        //convert from string to number
        cellClickedIdx = Number(cellClickedIdx)
        //create empty array to store the adjacent indices

        let nextCellToCheck = cellClicked
        
        function makeArrCellsAdj(cell) {
            adjCellArr = [];
            // console.log(`cell being passed into Make Arr Cells Adj:`)
            // console.log(cell)

            function getHoriz() {
                // horiz left
                if (cell % width !== 0 ) {
                    adjCellArr.push(cell-1);
                }
                //horiz right
                if (cell % width !== width-1 || cell === 0) {
                    adjCellArr.push(cell+1)
                }
            } 
            
            function getVert() {
                //vert above
                if (cell - width >= 0) {
                    adjCellArr.push(cell-width)
                }
                //vert below
                if (cell + width <= cellCount-1) {
                    adjCellArr.push(cell+width)
                    // console.log(`${cellToCheckIdx+width} pushed`)
                }
            }
            function getDiagRight() {
                // console.log(`cellToCheckIdx = ${cellToCheckIdx}`)
                // console.log(`cellToCheckIdx+width + 1 = ${(cellToCheckIdx+width)+1}`)
                //diag right up
                if ((cell - width)+1 >0 && ((cell - width)+1)%width !==0 ) {
                    adjCellArr.push((cell - width)+1)
                } else {
                    // console.log('nothing pushed')
                }
                //diag right down
                if ((cell + width)+1 < cellCount && (((cell + width)+1))%width !==0) {
                    adjCellArr.push((cell + width)+1)
                    // console.log(`${(cellToCheckIdx + width)+1} pushed`)
                } else {
                    // console.log('nothing pushed')
                }
            }
            function getDiagLeft() {
                // console.log(`cellToCheckIdx = ${cellToCheckIdx}`)
                // console.log(`cellToCheckIdx+width - 1 modulus width= ${((v+width)-1)%width}`)
                //diag left up
                if ((cell - width)-1 >=0 && ((cell - width)-1)%width !== width-1 ) {
                    adjCellArr.push((cell - width)-1)
                    // console.log(`${(cellToCheckIdx - width)-1} pushed`)
                } else {
                    // console.log('nothing pushed')
                }
                //diag left down
                if ((cell + width)-1 < cellCount-1 && ((cell + width)-1)%width !==width-1) {
                    adjCellArr.push((cell + width)-1)
                    // console.log(`${(cellToCheckIdx + width)-1} pushed`)
                } else {
                    // console.log('nothing pushed')
                }
            }
            
            
            
            getHoriz()
            getVert()
            getDiagRight()
            getDiagLeft()
            adjCellArr.sort(sortArr)
            // console.log(`adjCellArr is: ${adjCellArr}`)
            return adjCellArr
        }

        function openCells(cell, arr) {
            // console.log(`cell passed into openCells is:`)
            // console.log(cell)
            // console.log(`arr passed into openCells is: ${arr}`)
            cell.setAttribute('OPEN', 1)
            cell.style.backgroundColor = 'var(--dirt-bg)'
            for (let i = 0; i<arr.length; i++) {
                // console.log(arr[i])
                const adjCellFromArr = document.querySelector(('[data-index="' + arr[i] + '"]'))
                if (cell.getAttribute('MSGRID') === '0') {
                    // console.log(`if function firing`)
                    cell.innerText = ''
                    adjCellFromArr.setAttribute('ZEROADJ', 1)
                } else {}
                if (cell.getAttribute('MSGRID') === '1') {
                    // console.log(`if function firing`)
                    cell.innerText = ''
                    adjCellFromArr.setAttribute('ZEROADJ', 1)
                } else {}
                // adjCellFromArr.setAttribute('ZEROADJ', 1)
                // console.log(`adj cell from arr:`)
                // console.log(adjCellFromArr)

                let adjCellFromArrIdx = adjCellFromArr.getAttribute('data-index')
                // console.log(`adj cell from arr idx ${adjCellFromArrIdx}`)
                adjCellFromArrIdx = Number(adjCellFromArrIdx)

                let adjCellFromArrValue = adjCellFromArr.getAttribute('MSGRID')
                adjCellFromArrValue = Number(adjCellFromArrValue)
                // console.log(`adj cell from arr value ${adjCellFromArrValue}`)

                function checkIfOpen(cell) {
                    // console.log(`check if open has run`)
                    if (cell.hasAttribute('OPEN')) {
                        return true
                    } else {return false}
                }
                checkIfOpen(adjCellFromArr)
                
                if (checkIfOpen(adjCellFromArr) === false &&
                    adjCellFromArrValue === 0 
                     ) {
                         adjCellFromArr.style.backgroundColor = 'yellow'
                         adjCellFromArr.setAttribute('OPEN', 1)
                        //  console.log(`colored yellow & set to open:`)
                        //  console.log(adjCellFromArr)
                         nextCellToCheck = document.querySelector(('[data-index="' + arr[i] + '"]'))
                        //  console.log(`next cell to check reassigned to: `)
                        //  console.log(nextCellToCheck)
                         const nextArr = makeArrCellsAdj(Number(nextCellToCheck.getAttribute('data-index')))
                        //  console.log(`next arr is: ${nextArr}`)
                         openCells(nextCellToCheck, nextArr)
                     } else if (adjCellFromArr.hasAttribute('ZEROADJ') && adjCellFromArrValue !== 0) {
                        console.log(adjCellFromArrValue)
                        adjCellFromArr.innerText = `${adjCellFromArrValue}`
                        adjCellFromArr.style.backgroundColor = 'var(--dirt-bg)'
                        adjCellFromArr.style.color = 'black'
                        adjCellFromArr.setAttribute('OPEN', 1)
                     }
            }

            // makeArrCellsAdj(adjCellFromArrIdx);
            // openCells(cell, (makeArrCellsAdj(adjCellFromArrIdx)))
        }


        makeArrCellsAdj(cellClickedIdx)
        openCells(nextCellToCheck, adjCellArr)
    }

    checkLeftClickAction(cellClicked, cellClickedValue)
}

function handleRightClick(evt) {
    // console.log(evt.target)
    function toggleFlag() {
        const cellToToggleFlag = evt.target
        if (!cellToToggleFlag.hasAttribute('FLAG') && 
            !cellToToggleFlag.hasAttribute('OPEN'))
            {
            const flagEl = document.createElement('img')
            flagEl.src = assets.flag
            flagEl.setAttribute('flag-index', cellToToggleFlag.getAttribute('data-index'))
            flagEl.style.height = '4vmin'
            cellToToggleFlag.appendChild(flagEl)
            cellToToggleFlag.setAttribute('FLAG', '1')
            flagsPlaced++
            undetectedMines--
        } else if (cellToToggleFlag.hasAttribute('FLAG')) {
            cellToToggleFlag.removeAttribute('FLAG')
            const flagToRemoveEl = document.querySelector(('[flag-index="' + cellToToggleFlag.getAttribute('data-index') + '"]'))
            flagToRemoveEl.remove()
            flagsPlaced--
            undetectedMines++
        }
        console.log(`flagsPlaced = ${flagsPlaced}`)
        console.log(`undetected mines = ${undetectedMines}`)
        // console.log(cellToToggleFlag)
        checkWinner()
    }

    function checkWinner() {
        if (undetectedMines === 0) {
            winner = true
            celebrateWinner()
            console.log(`game won!!!!`)
        } else {
            winner = false
        }
    }

    function celebrateWinner() {

    }

    toggleFlag()
}


function sortArr(a,b) {
    return a-b
}

//! EVENT LISTENERS
window.addEventListener('DOMContentLoaded', init)
grid.addEventListener('click', handleLeftClick)
grid.addEventListener("contextmenu", evt => evt.preventDefault());
grid.addEventListener('contextmenu', handleRightClick)