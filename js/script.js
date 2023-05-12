//! CONSTANTS
const level = {
    'easy': {cellWidth: 8, cellHeight: 10, boardWidth: 48, boardHeight: 60, mineNum: 10, difficulty:'easy'},
    'medium': {cellWidth: 14, cellHeight: 18, boardWidth: 56, boardHeight: 70, mineNum: 40, difficulty:'medium'},
    'hard': {cellWidth: 20, cellHeight: 24, boardWidth: 64, boardHeight: 80, mineNum: 99, difficulty:'hard'},
}

const assets = {
    'mine': 'assets/mine.png',
    'flag': 'assets/flag.png',
    'stopwatch': 'assets/stopwatch.png',
    'tick': 'assets/check.png',
    'welcome': 'assets/welcome.mp3',
    'win': 'assets/win.mp3',
    'openUp': 'assets/openUp.mp3',
    'singleCell': 'assets/singleCell.mp3',
    'err': 'assets/error.mp3',
    'flagsound': 'assets/flag2.mp3'
}

const numberColors = {
    1: 'var(--one-num)',
    2: 'var(--two-num)',
    3: 'var(--three-num)',
    4: 'var(--four-num)',
    5: 'var(--five-num)',
    6: 'var(--six-num)',
    7: 'var(--seven-num)',
    8: 'var(--eight-num)',
}

const audioPlayer = new Audio();

//! CACHED ELEMENTS
const grid = document.querySelector('.grid')

//! GLOBAL VARIABLES
let difficulty
let minesArr
let flagsArr
let flagsPlaced
let flagsToPlace
let detectedMines
let timer
let width
let height
let cellCount

function init() {

    //! INITIALISE VARIABLES
    getDifficulty()
    width = level[difficulty].cellWidth
    height = level[difficulty].cellHeight
    cellCount = width * height
    grid.style.height = `${level[difficulty].boardHeight}vmin`
    grid.style.width = `${level[difficulty].boardWidth}vmin`
    grid.style.cursor = 'pointer'
    minesArr = []
    flagsArr = []
    flagsPlaced = 0
    flagsToPlace = level[difficulty].mineNum - flagsPlaced
    timer = 0
    undetectedMines = level[difficulty].mineNum - detectedMines
    
    //! INIT FUNCTIONS
    function getDifficulty() {
        difficulty = localStorage.getItem("difficulty");
    }
    
    function createHeader() {
        // console.log(`create header has run`)
        const headerEl = document.getElementById('headerEl')

        const pageTitleEl = document.createElement('h1')
        pageTitleEl.innerText = 'minesweeper'
        headerEl.appendChild(pageTitleEl)

        const flagCounterEl = document.createElement('div')
        flagCounterEl.setAttribute('id', 'flagDiv')
        headerEl.appendChild(flagCounterEl)
        const flagImgEl = createFlag()
        flagCounterEl.appendChild(flagImgEl)
        const flagCounterNum = document.createElement('h3')
        flagCounterNum.innerText = flagsToPlace
        flagCounterNum.setAttribute('id', 'flagCounterNum')
        flagCounterEl.appendChild(flagCounterNum)
        
        const timerDivEl = document.createElement('div')
        timerDivEl.setAttribute('id', 'timerDiv')
        headerEl.appendChild(timerDivEl)
        const timerImgEl = document.createElement('img')
        timerImgEl.setAttribute('src', 'assets/stopwatch.png')
        timerImgEl.style.height = '3.5vmin'
        timerDivEl.appendChild(timerImgEl)
        const timerCounterNum = document.createElement('h3')
        timerCounterNum.setAttribute('id', 'timerCounterNum')
        timerCounterNum.innerText = '0'
        timerDivEl.appendChild(timerCounterNum)

        const buttonsDiv = document.createElement('div')
        buttonsDiv.setAttribute('id', 'buttonsDiv')
        headerEl.appendChild(buttonsDiv)
        const easyBtnEl = document.createElement('button')
        easyBtnEl.setAttribute('id', 'easyBtn')
        easyBtnEl.innerText = 'Easy'
        buttonsDiv.appendChild(easyBtnEl)
        const mediumBtnEl = document.createElement('button')
        mediumBtnEl.setAttribute('id', 'mediumBtn')
        mediumBtnEl.innerText = 'Medium'
        buttonsDiv.appendChild(mediumBtnEl)
        const hardBtnEl = document.createElement('button')
        hardBtnEl.setAttribute('id', 'hardBtn')
        hardBtnEl.innerText = 'Hard'
        buttonsDiv.appendChild(hardBtnEl)

        function highlightBtn(){
            const btnToHighlight = document.getElementById(`${difficulty}Btn`)
            btnToHighlight.classList.add('selected')
        }

        //add button event listeners
        easyBtnEl.addEventListener('click', startEasyGame)
        mediumBtnEl.addEventListener('click', startMediumGame)
        hardBtnEl.addEventListener('click', startHardGame)

        //run highlight button
        highlightBtn()
    }
    
    function createGrid() {

        // console.log(`create grid has run`)

        let rowCounter = 0
        for (let i=0; i<cellCount; i++) {
            const cell = document.createElement('div')
            cell.setAttribute('data-index', i)
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

        // console.log(`create numbers has run`)
    
        function placeMines() {
            let minesPlaced = 0;
            while (minesPlaced < level[difficulty].mineNum) {
                const mineToPlace = randNum()
                const cellToPlace = document.querySelector('[data-index="' + mineToPlace + '"]')
                if (cellToPlace.hasAttribute('MSGRID')) {
                    //do nothing
                } else {
                    cellToPlace.setAttribute('MSGRID', -1)
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
                    }
                }
                
                function getDiagRight() {
                    //diag right up
                    if ((i - width)+1 >0 && ((i - width)+1)%width !==0 ) {
                        adjCellArr.push((i - width)+1)
                    } else {}
                    //diag right down
                    if ((i + width)+1 < cellCount && (((i + width)+1))%width !==0) {
                        adjCellArr.push((i + width)+1)
                    } else {}
                }

                function getDiagLeft() {
                    //diag left up
                    if ((i - width)-1 >0 && ((i - width)-1)%width !== width-1 ) {
                        adjCellArr.push((i - width)-1)
                    } else {}
                    //diag left down
                    if ((i + width)-1 < cellCount-1 && ((i + width)-1)%width !==width-1) {
                        adjCellArr.push((i + width)-1)
                    } else {}
                }
                
                function checkMineAdj() {
                    for(let i=0; i<minesArr.length; i++) {
                        if(adjCellArr.includes(minesArr[i])) {
                            adjMineCount++
                        }
                    }
                }

                function updateMSGRID() {
                    const cellToPlace = document.querySelector('[data-index="' + i + '"]')
                    if(cellToPlace.hasAttribute('MSGRID') === false) {
                        cellToPlace.setAttribute('MSGRID', adjMineCount)
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
    }
    //! PAGE LOAD
    playSound('welcome')
    createHeader()
    createGrid()
    createNumbers()
}

function handleLeftClick(evt) {
    const cellClicked = evt.target
    //get the MS GRID value of the cell
    const cellClickedValue = Number(cellClicked.getAttribute('MSGRID'))
    
    function checkLeftClickAction(cellClicked, cellClickedValue) {
        if (cellClickedValue === -1) {
            gameOver(minesArr)
            removeEvtListeners()
            console.log('game over')
        } else if (cellClickedValue > 0) {
            openSingleCell(cellClicked, cellClickedValue)
        } else if (cellClickedValue > 8) {
            console.log('invalid')
        } else if (cellClickedValue === 0) {
            openUp(cellClicked, cellClickedValue)
        } else {console.log('invalid2')}
    }

    function openSingleCell(cellClicked, cellClickedValue) {
        cellClicked.innerText = `${cellClickedValue}`
        cellClicked.style.backgroundColor = 'var(--dirt-bg)'
        cellClicked.style.border = "1px solid var(--border)"
        cellClicked.style.color = `${numberColors[cellClickedValue]}`
        cellClicked.setAttribute('OPEN', '1')
        playSound('singleCell')
    }

    function gameOver(arr) {
        grid.style.cursor = 'auto'
        for (let i=0; i<arr.length; i++) {
            console.log(arr[i])
            const cellToPlaceMine = document.querySelector(('[data-index="' + arr[i] + '"]'))
            console.log(cellToPlaceMine)
            const mineEl = document.createElement('img')
            const tickEl = document.createElement('img')
            mineEl.src = assets.mine
            tickEl.src = assets.tick
            mineEl.style.height = '3.5vmin'
            tickEl.style.height = '3.5vmin'
            if (cellToPlaceMine.hasAttribute('flag')) {
                cellToPlaceMine.appendChild(tickEl)
                const flagToRemove = document.querySelector(('[flag-index="' + arr[i] + '"]'))
                flagToRemove.remove()
            } else {
                cellToPlaceMine.appendChild(mineEl)
            }
        }
        playSound('err')
    }

    function openUp(cellClicked, cellClickedValue) {
        cellClickedIdx = cellClicked.getAttribute('data-index')
        //convert from string to number
        cellClickedIdx = Number(cellClickedIdx)

        let nextCellToCheck = cellClicked
        
        function makeArrCellsAdj(cell) {
            adjCellArr = [];

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
                }
            }
            function getDiagRight() {
                //diag right up
                if ((cell - width)+1 >0 && ((cell - width)+1)%width !==0 ) {
                    adjCellArr.push((cell - width)+1)
                } else {}
                //diag right down
                if ((cell + width)+1 < cellCount && (((cell + width)+1))%width !==0) {
                    adjCellArr.push((cell + width)+1)
                } else {}
            }

            function getDiagLeft() {
                //diag left up
                if ((cell - width)-1 >=0 && ((cell - width)-1)%width !== width-1 ) {
                    adjCellArr.push((cell - width)-1)
                } else {}
                //diag left down
                if ((cell + width)-1 < cellCount-1 && ((cell + width)-1)%width !==width-1) {
                    adjCellArr.push((cell + width)-1)
                } else {}
            }
            
            getHoriz()
            getVert()
            getDiagRight()
            getDiagLeft()
            adjCellArr.sort(sortArr)
            return adjCellArr
        }

        function openCells(cell, arr) {
            cell.setAttribute('OPEN', 1)
            cell.style.backgroundColor = 'var(--dirt-bg)'
            for (let i = 0; i<arr.length; i++) {
                const adjCellFromArr = document.querySelector(('[data-index="' + arr[i] + '"]'))
                if (cell.getAttribute('MSGRID') === '0') {
                    cell.innerText = ''
                    adjCellFromArr.setAttribute('ZEROADJ', 1)
                } else {}
                if (cell.getAttribute('MSGRID') === '1') {
                    cell.innerText = ''
                    adjCellFromArr.setAttribute('ZEROADJ', 1)
                } else {}

                let adjCellFromArrIdx = adjCellFromArr.getAttribute('data-index')
                adjCellFromArrIdx = Number(adjCellFromArrIdx)
                let adjCellFromArrValue = adjCellFromArr.getAttribute('MSGRID')
                adjCellFromArrValue = Number(adjCellFromArrValue)
                
                function checkIfOpen(cell) {
                    if (cell.hasAttribute('OPEN')) {
                        return true
                    } else {return false}
                }
                checkIfOpen(adjCellFromArr)
                
                if (checkIfOpen(adjCellFromArr) === false &&
                    adjCellFromArrValue === 0 
                     ) {
                         adjCellFromArr.setAttribute('OPEN', 1)
                         nextCellToCheck = document.querySelector(('[data-index="' + arr[i] + '"]'))
                         const nextArr = makeArrCellsAdj(Number(nextCellToCheck.getAttribute('data-index')))
                         openCells(nextCellToCheck, nextArr)
                     } else if (adjCellFromArr.hasAttribute('ZEROADJ') && adjCellFromArrValue !== 0) {
                        adjCellFromArr.innerText = `${adjCellFromArrValue}`
                        adjCellFromArr.style.color = `${numberColors[adjCellFromArrValue]}`
                        adjCellFromArr.style.backgroundColor = 'var(--dirt-bg)'
                        adjCellFromArr.style.border = "1px solid var(--border)"
                        adjCellFromArr.setAttribute('OPEN', 1)
                     }
            }
        }

        makeArrCellsAdj(cellClickedIdx)
        openCells(nextCellToCheck, adjCellArr)
        playSound('openUp')
    }

    checkLeftClickAction(cellClicked, cellClickedValue)
}

function handleRightClick(evt) {
    
    const itemClicked = evt.target
    const itemClickedIdx = itemClicked.getAttribute('data-index')
    const itemFlagIdx = itemClicked.getAttribute('flag-index')
    
    function toggleFlag(itemClicked, itemClickedIdx, itemFlagIdx, minesArr, flagsArr) {

        function checkIfFlagPresent(itemClicked, itemClickedIdx, itemFlagIdx) {
            if (itemClicked.hasAttribute('flag') === true) {
                removeFlag(itemClicked, itemClickedIdx, itemFlagIdx)
            } else if (itemClicked.hasAttribute('open')) {
                //do nothing because open
            } else {
                addFlag(itemClicked)
            }
        }

        function addFlag(itemClicked) {
            const flagEl = createFlag()
            itemClicked.setAttribute('FLAG', '1')
            flagEl.setAttribute('FLAG', '1')
            flagEl.setAttribute('flag-index', itemClickedIdx)
            itemClicked.appendChild(flagEl)
            flagsArr.push(Number(itemClickedIdx))
            flagsPlaced++ 
            console.log(`flags placed: ${flagsPlaced}`)
            console.log(`flags to place: ${flagsToPlace}`)
            console.log(flagCounterNum)
            flagCounterNum.innerText = flagsToPlace - flagsPlaced
            playSound('flagsound')
        }

        function removeFlag(itemClicked, itemClickedIdx, itemFlagIdx) {
            if (itemClicked.hasAttribute('flag') && itemClicked.hasAttribute('data-index')) {
                flagToRemoveEl = document.querySelector('[flag-index="' + itemClickedIdx + '"]')
                flagToRemoveEl.remove()
                const cellFlagToRemove = document.querySelector('[data-index="' + itemClickedIdx + '"]')
                cellFlagToRemove.removeAttribute('flag')
            } else if (itemClicked.hasAttribute('flag') && itemClicked.hasAttribute('flag-index')) {
                flagToRemoveEl = document.querySelector('[flag-index="' + itemFlagIdx + '"]')
                flagToRemoveEl.remove()
                itemClicked.removeAttribute('flag')
                const cellFlagToRemove = document.querySelector('[data-index="' + itemFlagIdx + '"]')
                cellFlagToRemove.removeAttribute('flag')
            } else {}
            adjustFlagsArr(itemClicked)
            flagsPlaced--
            flagCounterNum.innerText = flagsToPlace - flagsPlaced
            playSound('flagsound')
        }

        function adjustFlagsArr(itemToRemove) {
            if (itemToRemove.hasAttribute('flag-index')) {
                const idxToRemove = itemToRemove.getAttribute('flag-index')
                removeFlagFromArr(idxToRemove)
            } else if (itemToRemove.hasAttribute('data-index')) {
                const idxToRemove = itemToRemove.getAttribute('data-index')
                removeFlagFromArr(idxToRemove)
            } else {}
            
            function removeFlagFromArr(idxToRemove) {
                idxToRemove = Number(idxToRemove)
                const locationToRemove = flagsArr.indexOf(idxToRemove)
                if (locationToRemove > -1) {
                    flagsArr.splice(locationToRemove, 1)
                }
            }
        }

        function calculateUndetectedMines(minesArr, flagsArr) {
            detectedMines = 0
            for (let i=0; i<minesArr.length; i++) {
                const idxToCheck = flagsArr.indexOf(minesArr[i])
                if (idxToCheck === -1) {
                    //do nothing because mine is not in flags arr
                } else if (idxToCheck > -1) {
                    detectedMines++
                }
            }
            checkWinner()
        }

        checkIfFlagPresent(itemClicked, itemClickedIdx, itemFlagIdx)
        calculateUndetectedMines(minesArr, flagsArr)
    }

    function checkWinner() {
        if (detectedMines === level[difficulty].mineNum) {
            winner = true
            runConfetti()
            playSound('win')
        } else {
            winner = false
        }
    }

    toggleFlag(itemClicked, itemClickedIdx, itemFlagIdx, minesArr, flagsArr)
}


function sortArr(a,b) {
    return a-b
}

function randNum() {
    return Math.floor(Math.random() * cellCount);
}

function createFlag() {
    const flagEl = document.createElement('img')
    flagEl.src = assets.flag
    flagEl.style.height = '3.5vmin'
    return flagEl
}

function removeEvtListeners() {
    grid.removeEventListener('click', handleLeftClick)
    grid.removeEventListener('contextmenu', handleRightClick)
}

function startEasyGame() {
    localStorage.setItem("difficulty", "easy");
    location.reload()
}

function startMediumGame() {
    localStorage.setItem("difficulty", "medium");
    location.reload()
}

function startHardGame() {
    localStorage.setItem("difficulty", "hard");
    location.reload()
}

function playSound(name) {
    audioPlayer.src = assets[name];
    audioPlayer.play();
}

//TAKEN OFF INTERNET AND IMPLEMENTED - https://confetti.js.org/more.html
function runConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
    });
}

//! EVENT LISTENERS
window.addEventListener('DOMContentLoaded', init)
grid.addEventListener('click', handleLeftClick)
grid.addEventListener("contextmenu", e => e.preventDefault());
grid.addEventListener('contextmenu', handleRightClick)




