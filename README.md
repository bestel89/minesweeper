# minesweeper

## constants & variables potentially required:
- sounds
- difficulty parameters - height / with for easy, medium, hard
- array lookup grids - e.g. 0 - empty cell, -1 - bomb present, 1, 2, 3, 4, 5, 6, 7, 8 (for number of bombs around current location)
- array lookup grids - flags placed
- data index of grid

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
    // creates grid of the correct size
    // creates 'bottom layer', containing the bombs (-1), numbers (proximity to bombs), empty cells (0)
    // starts timer function
    // calls render

render(): 
    //render difficulty level on game page
    //render number of flags remaining
    //render timer (?? - might be better placed separately)
    //render SQUARES 'top layer' --> same function would render empty cells after user click

handleSquareClick():
    // function - checkBottomLayer
        // check if user has clicked a bomb -> game over
        // check if user has clicked an empty cell (0) -> open up board to show all adjacent empty cells and numbers next to bombs
        // check if user clicked a number (1-8) -> open up board
        // call RENDER()

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