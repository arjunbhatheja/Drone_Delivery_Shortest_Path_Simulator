document.addEventListener('DOMContentLoaded', () => {
    createGrid();
    setupKeyControls();
    
    const refreshButton = document.getElementById('refreshButton');
    refreshButton.addEventListener('click', () => {
        location.reload(); // Refresh the page
    });
});

let droneCounter = 1;
let landingCounter = 1;
let activeButton = null;
let moveCounter = 0;
let initialPositions = [];

const dronebtn = document.querySelector('#droneImg');
dronebtn.style.backgroundImage = "url('Drone.webp')";

const landingbtn = document.querySelector('#landingImg');
landingbtn.style.backgroundImage = "url('No_fly_zone.webp')";

const noflybtn = document.querySelector('#noflyImg');
noflybtn.style.backgroundImage = "url('Drone_landing.webp')";

function createGrid() {
    const container = document.querySelector('.grid-container');
    container.innerHTML = ''; // Clear existing grid

    for (let i = 0; i < 64; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        container.appendChild(cell);
    }
    setupButtons();
}

function clearGrid() {
    const cells = document.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.backgroundColor = '#fff';
        cell.style.fontSize = '';
        cell.style.fontWeight = '';
        cell.style.color = '';
    });

    droneCounter = 1;
    landingCounter = 1;
    activeButton = null;
    moveCounter = 0;
    updateMoveCounter();
}

function setupButtons() {
    dronebtn.addEventListener('click', function() {
        if (activeButton == 'landingImg') {
            landingbtn.click();
        } else if (activeButton == 'noflyImg') {
            noflybtn.click();
        }
        activateButton(dronebtn);
    });

    landingbtn.addEventListener('click', function() {
        if (activeButton == 'droneImg') {
            dronebtn.click();
        } else if (activeButton == 'noflyImg') {
            noflybtn.click();
        }
        activateButton(landingbtn);
    });

    noflybtn.addEventListener('click', function() {
        if (activeButton == 'droneImg') {
            dronebtn.click();
        } else if (activeButton == 'landingImg') {
            landingbtn.click();
        }
        activateButton(noflybtn);
    });
}

function activateButton(button) {
    if (activeButton) {
        button.style.scale = '';
        button.style.transition = '0.2s';
        button.style.boxShadow = '';
        button.style.border = '';
        button.style.border = "3px solid black";
        activeButton = null;
    } else {
        button.style.scale = '.8';
        button.style.transition = '0.2s';
        button.style.boxShadow = '3px 2px 22px 1px rgba(0, 0, 0, 0.24)';
        button.style.border = "3px solid black";
        activeButton = button.id;
    }
}

function handleCellClick(event) {
    const cell = event.target;
    if (activeButton) {
        if (activeButton === 'droneImg') {
            if (droneCounter < 5) {
                cell.textContent = 'D' + droneCounter++;
                cell.style.backgroundColor = '#483D8B';
                cell.style.fontSize = '150%';
                cell.style.fontWeight = 'bold';
                cell.style.color = 'White';
                saveInitialPosition(cell);
            }
        } else if (activeButton === 'landingImg') {
            if (landingCounter < 5) {
                cell.textContent = 'G' + landingCounter++;
                cell.style.backgroundColor = '#556B2F';
                cell.style.fontSize = '150%';
                cell.style.fontWeight = 'bold';
                cell.style.color = 'White';
                saveInitialPosition(cell);
            }
        } else if (activeButton === 'noflyImg') {
                cell.textContent = 'XX';
                cell.style.backgroundColor = '#8B0000';
                cell.style.fontSize = '150%';
                cell.style.fontWeight = 'bold';
                cell.style.color = 'White';
                saveInitialPosition(cell);
        }
    }
}

function saveInitialPosition(cell) {
    initialPositions.push({
        index: cell.dataset.index,
        textContent: cell.textContent,
        backgroundColor: cell.style.backgroundColor,
        fontSize: cell.style.fontSize,
        fontWeight: cell.style.fontWeight,
        color: cell.style.color
    });
}

function resetToInitialPositions() {
    let dronenums = droneCounter;
    let landingnums = landingCounter;
    clearGrid();
    droneCounter = dronenums;
    landingCounter = landingnums;
    initialPositions.forEach(pos => {
        const cell = document.querySelector(`.grid-cell[data-index='${pos.index}']`);
        cell.textContent = pos.textContent;
        cell.style.backgroundColor = pos.backgroundColor;
        cell.style.fontSize = pos.fontSize;
        cell.style.fontWeight = pos.fontWeight;
        cell.style.color = pos.color;
    });
}

function shuffleBoard() {
    const output = document.getElementById('output');
    output.textContent = '';
    clearGrid();
    initialPositions = [];
    const cells = document.querySelectorAll('.grid-cell');
    const indices = Array.from({ length: 64 }, (_, i) => i);
    shuffleArray(indices);

    // Place 4 drones
    for (let i = 0; i < 4; i++) {
        const index = indices.pop();
        cells[index].textContent = 'D' + (i + 1);
        cells[index].style.backgroundColor = '#483D8B';
        cells[index].style.fontSize = '150%';
        cells[index].style.fontWeight = 'bold';
        cells[index].style.color = 'White';
        saveInitialPosition(cells[index]);
    }

    // Place 4 destinations
    for (let i = 0; i < 4; i++) {
        const index = indices.pop();
        cells[index].textContent = 'G' + (i + 1);
        cells[index].style.backgroundColor = '#556B2F';
        cells[index].style.fontSize = '150%';
        cells[index].style.fontWeight = 'bold';
        cells[index].style.color = 'White';
        saveInitialPosition(cells[index]);
    }

    // Place random number of no-fly zones (between 5 and 10)
    const noFlyZoneCount = Math.floor(Math.random() * 6) + 5;
    for (let i = 0; i < noFlyZoneCount; i++) {
        const index = indices.pop();
        cells[index].textContent = 'XX';
        cells[index].style.backgroundColor = '#8B0000';
        cells[index].style.fontSize = '150%';
        cells[index].style.fontWeight = 'bold';
        cells[index].style.color = 'White';
        saveInitialPosition(cells[index]);
    }
    droneCounter = 5;
    landingCounter = 5;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function setupKeyControls() {
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
            moveDronesWithKeys(key);
            moveCounter++;
            updateMoveCounter();
        }
    });
}

function moveDronesWithKeys(key) {
    const cells = document.querySelectorAll('.grid-cell');
    const drones = [];

    // Initialize drone positions
    cells.forEach((cell, index) => {
        if (cell.textContent.startsWith('D')) {
            const droneMatches = cell.textContent.match(/D(\d+)/g); // Match all occurrences of 'D' followed by a number
            if (droneMatches) {
                droneMatches.forEach(droneText => {
                    const droneNumber = parseInt(droneText.slice(1), 10); // Extract the number after 'D'
                    drones.push({ 
                        number: droneNumber, 
                        cell: cell, 
                        index: index, 
                        x: Math.floor(index / 8), 
                        y: index % 8, 
                        reached: false 
                    });
                });
            }
        }
        
    });

    drones.forEach(drone => {
        if (drone.reached) return;

        let newX = drone.x;
        let newY = drone.y;

        switch (key) {
            case 'ArrowUp':
                newX -= 1;
                break;
            case 'ArrowDown':
                newX += 1;
                break;
            case 'ArrowLeft':
                newY -= 1;
                break;
            case 'ArrowRight':
                newY += 1;
                break;
        }

        const newIndex = newX * 8 + newY;
        const newCell = cells[newIndex];

        let mat;
            if(newX >= 0 && newX < 8 && newY >= 0 && newY < 8){
            mat = newCell.textContent.startsWith('G') && ((parseInt(newCell.textContent[1], 10)) !== drone.number);

            }
            else{
                mat = true;
            }
            if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8 && newCell && newCell.textContent !== 'XX' && !mat) {

            const regex = new RegExp(`D${drone.number}`, 'g');
            drone.cell.textContent = drone.cell.textContent.replace(regex, '').trim();


            const regex2 = new RegExp(`^D(\\d+)$`);
            const match = drone.cell.textContent.match(regex2);

            if (drone.cell.textContent === '') {
                drone.cell.style.backgroundColor = '#fff';
            }
            else if(match){
                drone.cell.style.backgroundColor = '#483D8B';
            }
            else{
                drone.cell.style.backgroundColor = 'brown';
            }

            
                drone.x = newX;
                drone.y = newY;
                drone.index = newIndex;
                drone.cell = newCell;

                console.log(parseInt(drone.cell.textContent[1], 10) === drone.number)

                if (drone.cell.textContent.startsWith('G') && parseInt(drone.cell.textContent[1], 10) === drone.number && drone.cell.style.backgroundColor === `rgb(85, 107, 47)`) {
                    drone.reached = true;
                    drone.cell.style.backgroundColor = 'orange';
                    drone.cell.textContent = `G${drone.number}`;
                }

                else if(drone.cell.textContent.startsWith('D')){
                    drone.cell.textContent += `D${drone.number}`;
                    drone.cell.style.backgroundColor = 'brown';
                } 
                else {
                    // Update cell content
                    drone.cell.textContent = `D${drone.number}`;
                    drone.cell.style.backgroundColor = '#483D8B';
                    drone.cell.style.fontSize = '150%';
                    drone.cell.style.fontWeight = 'bold';
                    drone.cell.style.color = 'White';
                }
        }
        });
}

function updateMoveCounter() {
    const moveCounterElement = document.getElementById('moveCounter');
    moveCounterElement.textContent = `Moves: ${moveCounter}`;
}

function calculateMoves() {
    // Extract the grid state
    if (droneCounter == landingCounter) {
        resetToInitialPositions();
        moveCounter = 0;
        updateMoveCounter();

        const cells = document.querySelectorAll('.grid-cell');
        const gridArray = Array.from(cells).map(cell => {
            if (cell.textContent == '') return '__';
            else return cell.textContent;
        });

        // Send the grid state to the server
        fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ gridArray, droneCounter: droneCounter - 1 })
        })
        .then(response => response.json())
        .then(output => {
            if (output.distance === -1) {
                document.getElementById('output').textContent = "The drones can't reach their respective locations";
            } else {
                document.getElementById('output').textContent = `Minimum Number of Moves is ${output.distance} and moves are ${output.moves.join(', ')}`;
                animatePath(output.moves);
            }
        })
        .catch(error => console.error('Error:', error));
    } else {
        document.getElementById('output').textContent = "Number of Drones should be equal to Number of landing spaces";
    }
}

function animatePath(moves) {
    const cells = document.querySelectorAll('.grid-cell');
    const drones = [];

    // Initialize drone positions
    cells.forEach((cell, index) => {
        if (cell.textContent.startsWith('D')) {
            const droneNumber = parseInt(cell.textContent[1], 10);
            drones.push({ number: droneNumber, cell: cell, index: index, x: Math.floor(index / 8), y: index % 8, reached: false });
        }
    });

    if (drones.length === 0) {
        console.error('No drones found');
        return;
    }

    let i = 0;

    function moveDrones() {
        if (i >= moves.length) {
            console.log('Animation completed');
            return;
        }

        const move = moves[i];
        console.log(`Move ${i + 1}: ${move}`);

        drones.forEach(drone => {
            if (drone.reached) return;

            let newX = drone.x;
            let newY = drone.y;

            switch (move) {
                case 'UP':
                    newX -= 1;
                    break;
                case 'LEFT':
                    newY -= 1;
                    break;
                case 'RIGHT':
                    newY += 1;
                    break;
                case 'DOWN':
                    newX += 1;
                    break;
            }

            const newIndex = newX * 8 + newY;
            const newCell = cells[newIndex];

            let mat;
            if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
                mat = newCell.textContent.startsWith('G') && ((parseInt(newCell.textContent[1], 10)) !== drone.number);
            } else {
                mat = true;
            }

            if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8 && newCell && newCell.textContent !== 'XX' && !mat) {
                const regex = new RegExp(`D${drone.number}`, 'g');
                drone.cell.textContent = drone.cell.textContent.replace(regex, '').trim();

                const regex2 = new RegExp(`^D(\\d+)$`);
                const match = drone.cell.textContent.match(regex2);

                if (drone.cell.textContent === '') {
                    drone.cell.style.backgroundColor = '#fff';
                } else if (match) {
                    drone.cell.style.backgroundColor = '#483D8B';
                } else {
                    drone.cell.style.backgroundColor = 'black';
                }

                drone.x = newX;
                drone.y = newY;
                drone.index = newIndex;
                drone.cell = newCell;

                if (drone.cell.textContent.startsWith('G') && parseInt(drone.cell.textContent[1], 10) === drone.number && drone.cell.style.backgroundColor === `rgb(85, 107, 47)`) {
                    drone.reached = true;
                    drone.cell.style.backgroundColor = 'orange';
                    drone.cell.textContent = `G${drone.number}`;
                } else if (drone.cell.textContent.startsWith('D')) {
                    drone.cell.textContent += `D${drone.number}`;
                    drone.cell.style.backgroundColor = 'black';
                } else {
                    // Update cell content
                    drone.cell.textContent = `D${drone.number}`;
                    drone.cell.style.backgroundColor = '#483D8B';
                    drone.cell.style.fontSize = '150%';
                    drone.cell.style.fontWeight = 'bold';
                    drone.cell.style.color = 'White';
                }
            }
        });

        i++;
        setTimeout(moveDrones, 400);
    }
    moveDrones();
}

