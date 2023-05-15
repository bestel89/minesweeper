//! GLOBAL CONSTANTS
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

//! GLOBAL CACHED ELEMENTS
const grid = document.querySelector('.grid')

//! GLOBAL VARIABLES
let difficulty
let minesArr
let flagsArr
let flagsPlaced
let flagsToPlace
let detectedMines
let width
let height
let cellCount
let totalSeconds
let totalMinutes
let screenwidth

//? INIT FUNCTION BELOW ------------------------------------------------------ \\

function init() {

    //! INITIALISE VARIABLES
    getDifficulty()
    width = level[difficulty].cellWidth
    height = level[difficulty].cellHeight
    cellCount = width * height
    grid.style.cursor = 'pointer'
    grid.style.height = `${level[difficulty].boardHeight}vmin`
    grid.style.width = `${level[difficulty].boardWidth}vmin`
    minesArr = []
    flagsArr = []
    flagsPlaced = 0
    flagsToPlace = level[difficulty].mineNum - flagsPlaced
    totalSeconds = 0
    totalMinutes = 0
    undetectedMines = level[difficulty].mineNum - detectedMines
    
    screenwidth = window.matchMedia("(max-width: 800px)");
    function screenTest(e) {
        if (e.matches) {
            console.log(`a firing`)
            grid.style.height = `80vmin`
            grid.style.width = `80vmin`
        } else {
            console.log(`b firing`)
            grid.style.height = `${level[difficulty].boardHeight}vmin`
            grid.style.width = `${level[difficulty].boardWidth}vmin`
        }
    }
    screenwidth.addEventListener("change", screenTest);
    
    //! INIT FUNCTIONS
    function getDifficulty() {
        if (localStorage.getItem("difficulty")) {
            difficulty = localStorage.getItem('difficulty')
        } else {
            difficulty = 'easy'
        }
        return difficulty
    }
    
    //FUNCTION TO CREATE THE HEADER USING JS
    function createHeader() {
        const headerEl = document.getElementById('headerEl')

        //MINESWEEPER TITLE
        const pageTitleEl = document.createElement('h1')
        pageTitleEl.innerText = 'minesweeper'
        headerEl.appendChild(pageTitleEl)

        //FLAG COUNTER
        const flagCounterEl = document.createElement('div')
        flagCounterEl.setAttribute('id', 'flagDiv')
        headerEl.appendChild(flagCounterEl)
        const flagImgEl = createFlag()
        flagCounterEl.appendChild(flagImgEl)
        const flagCounterNum = document.createElement('h3')
        flagCounterNum.innerText = flagsToPlace
        flagCounterNum.setAttribute('id', 'flagCounterNum')
        flagCounterEl.appendChild(flagCounterNum)
        
        //TIMER ELEMENTS
        const timerDivEl = document.createElement('div')
        timerDivEl.setAttribute('id', 'timerDiv')
        headerEl.appendChild(timerDivEl)
        const timerImgEl = document.createElement('img')
        timerImgEl.setAttribute('src', 'assets/stopwatch.png')
        timerImgEl.style.height = '3.5vmin'
        timerDivEl.appendChild(timerImgEl)
        const minutesEl = document.createElement('h3')
        const semiColonEl = document.createElement('h3')
        const secondsEl = document.createElement('h3')
        minutesEl.setAttribute('id', 'minutes')
        semiColonEl.setAttribute('id', 'semiColon')
        secondsEl.setAttribute('id', 'seconds')
        timerDivEl.appendChild(minutesEl)
        timerDivEl.appendChild(semiColonEl)
        timerDivEl.appendChild(secondsEl)

        // TIMER FUNCTIONALITY
        setInterval(setTime, 1000)
        function setTime() {
            totalSeconds++
            secondsEl.innerHTML = totalSeconds
            if (totalSeconds%60 === 0){
                totalMinutes++
                minutesEl.innerText = totalMinutes
                semiColonEl.innerText = ':'
                secondsEl.innerText = '00'
            } else if (totalSeconds%60 < 10) {
                secondsEl.innerText = `0${totalSeconds%60}`
            } else if (totalSeconds%60 > 9) {
                secondsEl.innerText = totalSeconds%60
            }
        }

        //LEVEL BUTTON ELEMENTS
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

        //FUNCTION TO HIGHLIGHT CORRECT BUTTON
        function highlightBtn(){
            const btnToHighlight = document.getElementById(`${difficulty}Btn`)
            btnToHighlight.classList.add('selected')
        }

        // BUTTON EVENT LISTENERS
        easyBtnEl.addEventListener('click', startEasyGame)
        mediumBtnEl.addEventListener('click', startMediumGame)
        hardBtnEl.addEventListener('click', startHardGame)

        //RUN HIGHLIGHT BUTTON UPON PAGE LOAD, AFTER GOT DIFFICULTY FROM LOCAL STORAGE
        highlightBtn()
    }
    
    //FUNCTION TO CREATE THE CELL HEIGHT AND WIDTH(DIFF FOR DIFFERENT DIFFICULTIES) AND CREATE THE CHECKERBOARD GRID
    function createGrid() {

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

    //FUNCTION TO LAY THE NUMBERS AND MINES ON EACH CELL USING AN ATTRIBUTE: MSGRID
    function createNumbers() {
    
        //FUNCTION THAT GENERATES THE MINE LOCATIONS FIRST, BY PLACING AN MSGRID VALUE OF -1
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

        //FUNCTION THAT TAKES EACH CELL IN THE GRID, CALCULATES ADJ MINES AND SETS THE MSGRID NUMBER TO BE THE NUMBER OF ADJACENT MINES
        function placeNumbers(){
            //get each cell in the grid, one by one
            for(let i = 0; i<cellCount; i++) {
                
                let adjMineCount = 0;
                let adjCellArr = [];

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
    createHeader()
    createGrid()
    createNumbers()
}

//? INIT FUNCTION ABOVE ------------------------------------------------------ \\

//? HANDLE LEFT CLICK BELOW ------------------------------------------------------ \\

//MAIN EVENT HANDLER FUNCTIOM THAT IS PASSED INTO THE EVENT LISTENER
function handleLeftClick(evt) {

    // SHORTCUT TO THE EVENT TARGET(THE CELL CLICKED)
    const cellClicked = evt.target
    
    //get the MS GRID value of the cell (NUMBER OF ADJ MINES), CONVERT TO NUMBER
    const cellClickedValue = Number(cellClicked.getAttribute('MSGRID'))
    
    //DECIDE THE RIGHT COURSE OF ACTION WHEN A LEFT CLICK TAKES PLACE
    function checkLeftClickAction(cellClicked, cellClickedValue) {
        if (cellClickedValue === -1) {
            gameOver(minesArr)
            removeEvtListeners()
        } else if (cellClicked.hasAttribute('flag')) {
            //do nothing
        } else if (cellClickedValue > 0) {
            openSingleCell(cellClicked, cellClickedValue)
        } else if (cellClickedValue > 8) {
            console.log('invalid')
        } else if (cellClickedValue === 0) {
            openUp(cellClicked, cellClickedValue)
        } else {console.log('invalid2')}
    }

    //OPENS AND DISPLAYS MSGRID FOR SINGLE CELL IF MSGRID > 0
    function openSingleCell(cellClicked, cellClickedValue) {
        cellClicked.innerText = `${cellClickedValue}`
        cellClicked.style.backgroundColor = 'var(--dirt-bg)'
        cellClicked.style.border = "1px solid var(--border)"
        cellClicked.style.color = `${numberColors[cellClickedValue]}`
        cellClicked.setAttribute('OPEN', '1')
        playSound('singleCell')
    }

    //GAMEOVER FUNCTION - DISPLAYS MINES, SHOWS WHICH MINES WERE TAGGED CORRECTLY
    function gameOver(arr) {
        grid.style.cursor = 'auto'
        for (let i=0; i<arr.length; i++) {
            const cellToPlaceMine = document.querySelector(('[data-index="' + arr[i] + '"]'))
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

    //OPEN UP FUNCTION - CALCULATES CORRECT PORTION OF THE BOARD TO OPEN UP IN RESPONSE TO CLICKING A CELL WITH MSGRID = 0
    function openUp(cellClicked, cellClickedValue) {
        
        //GET DATA INDEX VALUE OF THE CELL THAT WAS CLICKED
        cellClickedIdx = cellClicked.getAttribute('data-index')
        //CONVERT TO NUMBER
        cellClickedIdx = Number(cellClickedIdx)

        //REQUIRED FOR RECURSION
        let nextCellToCheck = cellClicked

        //! CANDIDATE FOR REFACTORING - IDEALLY THIS WOULD BE REFACTORED AND USED HERE, BUT ALSO FOR THE INIT FUNCTION
        //CREATES AN ARRAY OF THE ADJACENT CELLS FOR USE LATER
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

        //OPENS UP THE CELLS BY SETTING CELLS THAT ARE ADJACENT TO A ZERO WITH AN ATTRIBUTE OF 'ZERO ADJ'
        function openCells(cell, arr) {

            //SETS CELL CLICKED AS 'OPEN'
            cell.setAttribute('OPEN', 1)
            cell.style.backgroundColor = 'var(--dirt-bg)'

            //LOOPS THROUGH THE ARRAY OF ADJACENT CELLS TO THE CELL THAT WAS CLICKED
            for (let i = 0; i<arr.length; i++) {
                const adjCellFromArr = document.querySelector(('[data-index="' + arr[i] + '"]'))
                if (cell.getAttribute('MSGRID') === '0') {
                    cell.innerText = ''
                    adjCellFromArr.setAttribute('ZEROADJ', 1)
                } else {}

                //! CANDIDATE TO REMOVE AFTER FURTHER TESTING
                // if (cell.getAttribute('MSGRID') === '1') {
                //     cell.innerText = ''
                //     adjCellFromArr.setAttribute('ZEROADJ', 1)
                // } else {}

                //GET CELLS INDEX AND ITS MSGRID VALUE
                let adjCellFromArrIdx = adjCellFromArr.getAttribute('data-index')
                adjCellFromArrIdx = Number(adjCellFromArrIdx)
                let adjCellFromArrValue = adjCellFromArr.getAttribute('MSGRID')
                adjCellFromArrValue = Number(adjCellFromArrValue)
                
                //CHECK IF THE ADJ CELL IS ALREADY 'OPEN
                function checkIfOpenOrHasFlag(cell) {
                    if (cell.hasAttribute('OPEN') || cell.hasAttribute('flag')) {
                        return true
                    } else {return false}
                }
                checkIfOpenOrHasFlag(adjCellFromArr)

                //IF IT MEETS CONDITIONS, OPEN THE CELL UP
                // CHANGE THE 'NEXT CELL TO CHECK' VARIABLE TO DO THE SAME FUNCTION WITH ALL ADJACENT CELLS IN ARRAY
                if (checkIfOpenOrHasFlag(adjCellFromArr) === false &&
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

//? HANDLE LEFT CLICK ABOVE ------------------------------------------------------ \\

//? HANDLE RIGHT CLICK BELOW ------------------------------------------------------ \\

//RIGHT CLICK EVENTS ARE MAINLY FOR TOGGLING FLAGS, BUT CAN TRIGGER WINS
function handleRightClick(evt) {
    
    //ITEM CLICKED RATHER THAN CELL CLICKED BECAUSE IT COULD BE A FLAG
    const itemClicked = evt.target
    const itemClickedIdx = itemClicked.getAttribute('data-index')
    const itemFlagIdx = itemClicked.getAttribute('flag-index')
    
    function toggleFlag(itemClicked, itemClickedIdx, itemFlagIdx, minesArr, flagsArr) {

        //CHECKS IF A FLAG IS ALREADY PRESENT AT A CELL OR NOT AND DECIDES NEXT ACTION
        function checkIfFlagPresent(itemClicked, itemClickedIdx, itemFlagIdx) {
            if (itemClicked.hasAttribute('flag') === true) {
                removeFlag(itemClicked, itemClickedIdx, itemFlagIdx)
            } else if (itemClicked.hasAttribute('open')) {
                //do nothing because open
            } else {
                addFlag(itemClicked)
            }
        }

        //ADDS A FLAG IF CELL WAS EMPTY, UPDATES FLAG COUNTER, ADDS TO FLAG ARRAY
        function addFlag(itemClicked) {
            if (flagsToPlace > 0) {
                const flagEl = createFlag()
                itemClicked.setAttribute('FLAG', '1')
                flagEl.setAttribute('FLAG', '1')
                flagEl.setAttribute('flag-index', itemClickedIdx)
                itemClicked.appendChild(flagEl)
                flagsArr.push(Number(itemClickedIdx))
                flagsPlaced++ 
                flagCounterNum.innerText = flagsToPlace
                flagsToPlace--
                playSound('flagsound')
            } else {
                playSound('err')
                flagCounterNum.innerText = '0'
            }
        }

        //REMOVES A FLAG IF ONE WAS ALREADY THERE, UPDATES FLAG COUNTER
        //! OPPORTUNITY TO DO SOME REFACTORING ON THIS
        function removeFlag(itemClicked, itemClickedIdx, itemFlagIdx) {
            console.log(`remove flag firing`)
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
            flagsToPlace++
            flagCounterNum.innerText = flagsToPlace
            playSound('flagsound')
        }

        //UPDATES FLAG ARRAY AFTER REMOVED A FLAG
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

        //CHECKS FLAGS ARR AGAINST MINES ARR, IF ALL FLAGS ARE ON MINES THEN CHECK WINNER
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

    //CHECKS IF THE NUMBER OF DETECTED MINES IS EQUAL TO THE STARTING MINE NUMBER, AND CELEBRATES IF WINNER
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

//? HANDLE RIGHT CLICK ABOVE ------------------------------------------------------ \\

//? SUPPORTING FUNCTIONS BELOW ------------------------------------------------------ \\

// SUPPORTS SORTING OF ARRAYS
function sortArr(a,b) {
    return a-b
}

//PROVIDES RANDOM NUMBER USING CELL COUNT - HELPS PLACE MINES
function randNum() {
    return Math.floor(Math.random() * cellCount);
}

//SHORTCUT TO CREATE FLAG IMG ELEMENT
function createFlag() {
    const flagEl = document.createElement('img')
    flagEl.src = assets.flag
    flagEl.style.height = '3.5vmin'
    return flagEl
}

//SHORTCUT TO REMOVE MAIN EVENT LISTENERS
function removeEvtListeners() {
    grid.removeEventListener('click', handleLeftClick)
    grid.removeEventListener('contextmenu', handleRightClick)
}

//START NEW GAME - FORCES PAGE RELOAD AND SAVES DATA TO LOCAL STORAGE
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

//PLAYS ANY SOUND YOU PASS TO THE PLAYER
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


//? BUGS TO FIX
//1 - LEFT CLICK OF A FLAG - SHOULD DO NOTHING   ------ DONE
//2 - SOMETIMES A -1 INNERTEXT IS PRESENT IN CELL WITH INDEX 0


//? ROADMAP FEATURES
//1 - username entry
//2 - leaderboard using username and time taken
//3 - custom grid size