let game, block, hole, character, score, gameoverscreen, gameStopped, isJumping

let scoreTotal, gravityStopped;

// util functions
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

function getCss(element, prop) {
    return window
        .getComputedStyle(element)
        .getPropertyValue(prop)
}

function detectCollision(el1, el2, extra) {
    const rect1 = el1.getBoundingClientRect()
    const rect2 = el2.getBoundingClientRect()

    extra = extra || { y1: 0, y2: 0 }
    return (
        rect2.x < rect1.x + rect1.width &&
        rect1.x < rect2.x + rect2.width &&
        rect2.y < rect1.y + rect1.height + extra.y1 &&
        rect1.y < rect2.y + rect2.height + extra.y2
    )

}



function getElements() {
    game = document.querySelector('#game')
    block = document.querySelector('#block')
    hole = document.querySelector('#hole')
    character = document.querySelector('#character')
    score = document.querySelector('#score')
    gameoverscreen = document.querySelector('#gameoverscreen')
}



function setInitialValues() {
    gameStopped = false;
    isJumping = false;
    scoreTotal = 0;
    gravityStopped = false;
}



function setEventListeners() {
    window.addEventListener('resize', () => {
        if (gameStopped) return
        resetAllAnimations();
    })

    gameoverscreen.querySelector('button').addEventListener('click', () => {
        hideGameoverScreen();
        resetAllAnimations();
        resetCharacterPosition();
        resetScore();
        changeScoreUi();
        gravityStopped = false
        setTimeout(() => {
            gameStopped = false;
        }, 10)

    })

    document.body.parentElement.addEventListener('click', () => {
        if (gameStopped) return
        characterJump()
    })

    document.onkeypress = e => {
        e = e || window.event

        if (e.keyCode === 32) {
            if (gameStopped) return
            characterJump();
        }
    }
}



function gameOver() {
    //game over sound
    gameStopped = true;
    showGameoverScreen();
    stopBlockAnimation();
    stopGravity();
}

function resetCharacterPosition() {
    character.style.left = '40vh';
    character.style.top = '40vh';
}

function resetScore() {
    scoreTotal = 0;
}

function changeScoreUi() {
    score.innerText = `Score ${scoreTotal.toString()}`
    gameoverscreen.querySelector('.score').innerText = score.innerText
}


function characterJump() {
    isJumping = true;
    let jumpcnt = 0;

    const jumpInterval = setInterval(() => {
        changeGameState({ diff: -8 })

        if (jumpcnt > 20) {
            clearInterval(jumpInterval)
            isJumping = false
            jumpcnt = 0;
        }

        jumpcnt++;
    }, 10)

}



function changeGameState({ diff }) {
    handleCharacterCollision();
    handleCharacterPosition(diff);
}


function handleCharacterPosition(diff) {
    const charTop = parseInt(getCss(character, 'top'))

    const changeTop = charTop + diff;
    if (changeTop < 0) {
        return
    }

    if (changeTop > window.innerHeight) {
        return gameOver()
    }

    character.style.top = `${changeTop}px`
}


let soundCount = 0;

function handleCharacterCollision() {
    const collisionBlock = detectCollision(character, block);
    const collisionhole = detectCollision(character, hole, { y1: -28, y2: -33 });

    if (collisionBlock && !collisionhole) {
        changeScoreUi()
        return gameOver()
    }
    else if (collisionhole) {
        //score handling
        scoreTotal++
        soundCount++;
        if (soundCount > 0) {
            //play hole sound
            soundCount = 0;
        }
        changeScoreUi();
        if (gameStopped) return
    }

}

function initRandomHoles() {
    hole.addEventListener('animationiteration', () => {
        const from = 30 * window.innerHeight / 100;
        const to = 96 * window.innerHeight / 100;
        const randTop = getRandom(from, to)
        hole.style.top = `-${randTop}px`
    })
}



function beginGravity() {
    setInterval(() => {
        if (isJumping || gameStopped) return
        changeGameState({ diff: 5 })
    }, 15)
}


function resetAllAnimations() {
    const sec = 1.6;
    const blockAnimCss = `blockAnim ${sec}s infinite linear`
    block.style.animation = blockAnimCss;
    hole.style.animation = blockAnimCss;
}

function stopBlockAnimation() {
    const blockLeft = block.getBoundingClientRect().x;

    block.style.animation = ''
    hole.style.animation = ''
    block.style.left = `${blockLeft}px`
    hole.style.left = `${blockLeft}px`
}


function stopGravity() {
    gravityStopped = true;
}

function showGameoverScreen() {
    gameoverscreen.style.display = '';
}
function hideGameoverScreen() {
    gameoverscreen.style.display = 'none';
}

function gameLoad() {
    getElements();
    setInitialValues();
    beginGravity();
    initRandomHoles();
    setEventListeners();
    resetAllAnimations();
}


gameLoad();