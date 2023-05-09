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
let difficulty = 'easy'

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
    
    //! FUNCTIONS
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

    // function createNumbers() {
    //     const mineToPlace = randNum()
    //     document.querySelector('[data-index=`2`]')

    //     console.log(mineToPlace);

    // }
    
    function randNum() {
        return Math.floor(Math.random() * cellCount);
    }

    //! EVENTS


    //! PAGE LOAD
    createGrid()
    createNumbers()
}

//! EVENT LISTENERS
window.addEventListener('DOMContentLoaded', init)