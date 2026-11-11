import { verses } from "./verses.js";

const randomVerseBack = document.getElementById("random-verse-back");
const randomVerseTrack = document.getElementById("random-verse-track");
const randomVerseHint = document.getElementById("random-verse-hint");

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
    randomVerseTrack.classList.add("scrolling");
}

function stopScrolling() {
    randomVerseRunning = false;

    randomVerseTrack.classList.remove("scrolling");
}

function selectCard(card) {

    if (!randomVerseRunning) return;

    selectedCard = card;

    stopScrolling();

    randomVerseHint.textContent =
        "♡ 你选择了这一节";

    const allCards =
        randomVerseTrack.querySelectorAll(".random-verse-card");

    allCards.forEach(function(otherCard) {

        if (otherCard !== card) {
            otherCard.classList.add("dimmed");
            otherCard.style.pointerEvents = "none";
        }

    });

    card.classList.add("selected");

    setTimeout(function() {
        card.classList.add("flipped");
    }, 150);
}

randomVerseBack.addEventListener("click", function() {
    window.location.href = "index.html";
});

createCards();
startScrolling();