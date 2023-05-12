# minesweeper

## constants & variables potentially required:
- sounds
- difficulty parameters - height / width for easy, medium, hard + MINES present
- data index of grid

## Board object structure:
const board = {
    1: {
        visible: 1,                                 (or -1 for hidden)
        number: -1, 0, 1, 2, 3, 4, 5, 6, 7, 8       (-1 = bomb, 0 = empty, other = adj bombs)
        flag: -1, 1,                                (-1 = no flag, 1 = flag)
    }
    2: {
        visible: -1, 
        number: 0
        flag: 1
    }
    3: {
        ...
        ...
        ...
    }...
}

## elements to cache
- dropdown - main page
- dropdown - game page
- PLAY GAME / RESTART button
- Level difficulty indicator
- 'Flags left to place' indicator
- Timer
- SQUARES


## functions to build
init():
    // initialise all required variables
    // be called when 'RESTART' or 'PLAY GAME' is clicked
    // creates grid of the correct size for difficulty level
    // generates board object as per above
        // function placeBombs --> randomly places the bombs according to how difficult the game is
        // function placeNumbers --> iterates through the squares in the board and assigns a number (0-8) depending on how many bombs are adjacent to it
    // starts timer function
    // calls render

render(): 
    //render difficulty level on game page
    //render number of flags remaining
    //render timer (?? - might be better placed separately)
    //render BOARD / SQUARES
        --> based visibility of square
        --> displays empty, full, flag, number


handleSquareClick():
    // function - checkBottomLayer
        // check if user has clicked a bomb -> game over
        // check if user has clicked an empty cell (0) -> open up board to show all adjacent empty cells and numbers next to bombs
        // check if user clicked a number (1-8) -> open up board - function openUp()
        // call RENDER()

openUp():
    // if square with number 0-8 clicked...
        // calculate squares to change from HIDDEN to VISIBLE
    //call render()

handleRightClick():
    // right click square
        // check if flag present
            // if no -> add flag, decrease flag count
            // if yes -> remove flag
        // check if final flag placement
            // if yes -> FUNCTION - checkWinner()

checkWinner():
    // when all flags placed
        // check flags indexes against bomb index
            // if match -> WINNER
            // if incorrect -> GAME OVER



## event listeners required
- click dropdown - main page
- select item from dropdown - main page
- click dropdown - game page
- select item from dropdown - game page
- click PLAY GAME / RESTART button
- DELEGATED - CLICK - SQUARES
- DELEGATED - RIGHT CLICK - SQUARES


## CREDITS

<a href="https://www.flaticon.com/free-icons/timer" title="timer icons">Timer icons created by Freepik - Flaticon</a>

<a href="https://www.flaticon.com/free-icons/foursquare-check-in" title="foursquare check in icons">Foursquare check in icons created by Pixel perfect - Flaticon</a>

Sound Effect by <a href="https://pixabay.com/users/universfield-28281460/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=131853">UNIVERSFIELD</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=131853">Pixabay</a>