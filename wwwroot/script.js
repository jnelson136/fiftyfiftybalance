let countA = 0;
let countB = 0;
let totalClicks = 0;
let allTimeClicks = 0;

let timer = 0;
let intervalId = null;

const birdThreshold = 500;
const beeThreshold = 500;

// Grab the Elements
const counterA = document.getElementById('counterA');
const counterB = document.getElementById('counterB');
const timerDisplay = document.getElementById('timer');
const balanceProgress = document.getElementById('balanceProgress');
const totalClickCount = document.getElementById('totalClickCount');
const allTimeCount = document.getElementById('allTimeCount');

const birdEnthusiast = document.getElementById('birdEnthusiast');
const beeLover = document.getElementById('beeLover');
const birdIcon = document.getElementById('birdIcon');
const beeIcon = document.getElementById('beeIcon');

let connection = new signalR.HubConnectionBuilder()
    .withUrl("https://fiftyfiftybalance-hpejhuf2h3gjbhba.westus-01.azurewebsites.net/clickHub")
    .build();

// Start connection to SignalR hub
connection.start().catch(err => console.error(err.toString()));

connection.on("RecieveClickCounts", (counts) => {
    countA = counts.CountA;
    countB = counts.CountB;
    allTimeClicks = counts.AllTimeClicks;
    updateCounters(); // Update the UI with the new counts
});

document.addEventListener('DOMContentLoaded', async () => {
    await updateCounters();
    updateTotalClicks();
    checkBalance();
    updateAchievements();
});

function updateAchievements() {
    if (countA >= birdThreshold) {
        birdEnthusiast.classList.add('unlocked');
        birdEnthusiast.classList.remove('locked');

        birdIcon.src = 'bird-color.png';
    } else {
        birdEnthusiast.classList.add('locked');
    }

    if (countB >= beeThreshold) {
        beeLover.classList.add('unlocked');
        beeLover.classList.remove('locked');

        beeIcon.src = 'bee-color.png';
    } else {
        beeLover.classList.add('locked');
    }
}

// Start Timer
function startTimer() {
    intervalId = setInterval(() => {
        timer++;
        timerDisplay.innerText = new Date(timer * 1000).toISOString().substring(11, 19);
    }, 1000);
}

// Stop Timer
function stopTimer() {
    clearInterval(intervalId);
    intervalId = null;
}


async function updateCounters() {
    let response = await fetch('https://fiftyfiftybalance-hpejhuf2h3gjbhba.westus-01.azurewebsites.net/api/click');
    let data = await response.json();

    console.log(data.allTimeClicks);

    countA = data.countA;
    countB = data.countB;
    timer = data.timerValue
    allTimeClicks = data.allTimeClicks;

    totalClicks = countA + countB;

    counterA.innerText = data.countA;
    counterB.innerText = data.countB;
    allTimeCount.innerText = allTimeClicks + totalClicks;

    totalClickCount.innerText = totalClicks;
    

    updateTotalClicks();

    updateBalanceProgress();

    updateMessage();

    checkBalance();

    updateAchievements();

    if (data.countA === data.countB) {
        if (!intervalId) startTimer();
    } else {
        stopTimer();
    }

    timerDisplay.innerText = new Date(timer * 1000).toISOString().substring(11, 19);
}

function updateMessage() {
    const messageElement = document.getElementById('message');

    if (countA > countB) {
        messageElement.innerText = "MAKE MORE BIRDS! CLICK CLICK CLICK BELOW!"
    } else if (countB > countA) {
        messageElement.innerText = "MAKE MORE BEES! CLICK CLICK CLICK BELOW!"
    } else if (countA == countB) {
        messageElement.innerText = "MAKE MORE MAKE MORE!"
    }
}

function updateTotalClicks() {
    totalClicks = countA + countB;
    totalClickCount.innerText = totalClicks
    
}


document.getElementById('buttonA').addEventListener('click', async () => {
    await fetch('https://fiftyfiftybalance-hpejhuf2h3gjbhba.westus-01.azurewebsites.net/api/click/clickA', { method: 'POST' });
    updateCounters();
    updateTotalClicks();
    updateAchievements();
});

document.getElementById('buttonB').addEventListener('click', async () => {
    await fetch('https://fiftyfiftybalance-hpejhuf2h3gjbhba.westus-01.azurewebsites.net/api/click/clickB', { method: 'POST' });
    updateCounters();
    updateTotalClicks();
    updateAchievements();
});

// Calculate and Update the Balance Bar
function updateBalanceProgress() {
    let maxCount = Math.max(countA, countB);
    let minCount = Math.min(countA, countB);

    let balancePercentage = 100; // Default to 100% when they are equal

    if (maxCount !== 0) {
        balancePercentage = Math.floor((minCount / maxCount) * 100)
    }

    balanceProgress.style.width = `${balancePercentage}%`;
    balanceProgress.setAttribute(`aria-valuenow`, balancePercentage);
    balanceProgress.innerText = `${balancePercentage}% Balanced`;
}


let currentImageType = null;

function updateParticles(particleType) {
    let imageSrc;

    switch (particleType) {
        // case 'feather':
        //     imageSrc = 'feather.png';
        //     break;
        case 'bird':
            imageSrc = 'birds.png';
            break;
        case 'bee':
            imageSrc = 'bee.png';
            break;
        default:
            imageSrc = 'bee.png';
            break;
    }

    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80
            },
            "color": {
                "value": "#9BBA9D" // This will be ignored when using images
            },
            "shape": {
                "type": "image",
                "image": {
                    "src": imageSrc, // Update this path to where your image is located
                    "width": 200, // Adjust width as needed
                    "height": 200 // Adjust height as needed
                }
            },
            "opacity": {
                "value": 0.5
            },
            "size": {
                "value": 40 // Adjust size as needed, the image will be scaled to this size
            },
            "move": {
                "enable": true,
                "speed": 2
            }
        },
        "retina_detect": true
    });
}

function checkBalance() {
    if (countA > countB - 1 && currentImageType !== 'bird') {
        updateParticles('bird');
        currentImageType = 'bird';
    } else if (countB > countA - 1 && currentImageType !== 'bee') {
        updateParticles('bee');
        currentImageType = 'bee';
    }
}

document.addEventListener('click', async (e) => {
    if(e.target !== document.getElementById('buttonA') && e.target !== document.getElementById('buttonB')) {
        await fetch('https://fiftyfiftybalance-hpejhuf2h3gjbhba.westus-01.azurewebsites.net/api/click/increment-alltimeclicks', { method: 'POST' });
        updateCounters();
        updateTotalClicks();
    }
});