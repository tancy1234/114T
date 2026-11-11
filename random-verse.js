import { verses } from "./verses.js";


const randomVerseBack = document.getElementById("random-verse-back");
const randomVerseTrack = document.getElementById("random-verse-track");
const randomVerseHint = document.getElementById("random-verse-hint");

const randomVerseStage =
    document.querySelector(".random-verse-stage");

let randomVerseRunning = true;
let selectedCard = null;

function shuffleVerses() {
    const shuffled = [...verses];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] = [
            shuffled[j],
            shuffled[i]
        ];
    }

    return shuffled;
}

function createCard(verse, index) {
    const card = document.createElement("div");

    card.className = "random-verse-card";

    card.innerHTML = `
        <div class="random-verse-card-inner">

            <div class="random-verse-card-front">

                <div class="random-verse-card-number">
                    ${String(index + 1).padStart(2, "0")}
                </div>

                <div class="random-verse-card-icon">
                    ✦
                </div>

                <div class="random-verse-card-title">
                    ${verse.title}
                </div>

                <div class="random-verse-card-reference">
                    ${verse.reference}
                </div>

                <div class="random-verse-card-hint">
                    点击翻开
                </div>

            </div>

            <div class="random-verse-card-back">

                <div class="random-verse-card-back-title">
                    ${verse.title}
                </div>

                <div class="random-verse-card-back-text">
                    “${verse.text}”
                </div>

                <div class="random-verse-card-back-reference">
                    ${verse.reference}
                </div>

            </div>

        </div>
    `;

    card.addEventListener("click", function() {
        selectCard(card);
    });

    return card;
}

function createCards() {
    randomVerseTrack.innerHTML = "";

    const shuffled = shuffleVerses();

    /*
     * Create more cards than visible.
     * This allows the list to continuously move.
     */
    const cardsToCreate = 12;

    for (let i = 0; i < cardsToCreate; i++) {

        const verse = shuffled[i % shuffled.length];

        const card = createCard(verse, i);

        randomVerseTrack.appendChild(card);
    }
}


function startScrolling() {
    randomVerseRunning = true;
}

function stopScrolling() {
    randomVerseRunning = false;
}


function selectCard(card) {
    pauseAutoScroll();

    if (card.classList.contains("flipped")) {
        card.classList.remove("flipped");
        card.classList.remove("selected");

        randomVerseHint.textContent = "✨ 点击一张卡片";
        return;
    }

    const flippedCards =
        randomVerseTrack.querySelectorAll(".random-verse-card.flipped");

    flippedCards.forEach(function(otherCard) {
        otherCard.classList.remove("flipped");
        otherCard.classList.remove("selected");
    });

    card.classList.add("selected");

    randomVerseHint.textContent = "♡ 你选择了这一节";

    setTimeout(function() {
        if (card.classList.contains("selected")) {
            card.classList.add("flipped");
        }
    }, 100);
}

randomVerseBack.addEventListener("click", function() {
    window.location.href = "index.html";
});

createCards();

let autoScrollAnimation = null;
let lastTime = 0;
let autoScrollPaused = false;

function autoScroll(timestamp) {
    if (!lastTime) lastTime = timestamp;

    const delta = timestamp - lastTime;
    lastTime = timestamp;

    if (!autoScrollPaused && randomVerseRunning) {
        randomVerseStage.scrollTop += delta * 0.025;
    }

    autoScrollAnimation = requestAnimationFrame(autoScroll);
}

randomVerseStage.addEventListener("touchstart", function() {
    autoScrollPaused = true;
});

randomVerseStage.addEventListener("touchend", function() {
    setTimeout(function() {
        autoScrollPaused = false;
    }, 1200);
});

randomVerseStage.addEventListener("mousedown", function() {
    autoScrollPaused = true;
});

randomVerseStage.addEventListener("mouseup", function() {
    setTimeout(function() {
        autoScrollPaused = false;
    }, 1200);
});


randomVerseStage.addEventListener("mousemove", function(event) {
    if (event.buttons) {
        pauseAutoScroll();
    }
});

autoScrollAnimation = requestAnimationFrame(autoScroll);

function pauseAutoScroll() {
    autoScrollPaused = true;

    clearTimeout(autoScrollResumeTimer);

    autoScrollResumeTimer = setTimeout(function() {
        autoScrollPaused = false;
    }, 1200);
}