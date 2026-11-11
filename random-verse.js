import { verses } from "./verses.js";


const randomVerseBack =
    document.getElementById("random-verse-back");

const randomVerseTrack =
    document.getElementById("random-verse-track");

const randomVerseHint =
    document.getElementById("random-verse-hint");


let randomVerseRunning = true;

let autoScrollPaused = false;

let autoScrollResumeTimer = null;

let lastTime = null;


/* ================================
   Shuffle
================================ */

function shuffleVerses() {

    const shuffled = [...verses];

    for (let i = shuffled.length - 1; i > 0; i--) {

        const j =
            Math.floor(Math.random() * (i + 1));

        [
            shuffled[i],
            shuffled[j]
        ] = [
            shuffled[j],
            shuffled[i]
        ];
    }

    return shuffled;
}


/* ================================
   Create Card
================================ */

function createCard(verse, index) {

    const card =
        document.createElement("div");

    card.className =
        "random-verse-card";


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


/* ================================
   Create Cards
================================ */

function createCards() {

    randomVerseTrack.innerHTML = "";

    const shuffled =
        shuffleVerses();


    const cardsToCreate = 12;


    for (let i = 0; i < cardsToCreate; i++) {

        const verse =
            shuffled[i % shuffled.length];


        const card =
            createCard(verse, i);


        randomVerseTrack.appendChild(card);

    }

}


/* ================================
   Card Selection
================================ */

function selectCard(card) {

    pauseAutoScroll();


    /*
     * Click same card
     * → close it
     */

    if (
        card.classList.contains("flipped")
    ) {

        card.classList.remove("flipped");

        card.classList.remove("selected");

        randomVerseHint.textContent =
            "✨ 点击一张卡片";

        return;
    }


    /*
     * Close other cards
     */

    const flippedCards =
        randomVerseTrack.querySelectorAll(
            ".random-verse-card.flipped"
        );


    flippedCards.forEach(function(otherCard) {

        otherCard.classList.remove(
            "flipped"
        );

        otherCard.classList.remove(
            "selected"
        );

    });


    /*
     * Select new card
     */

    card.classList.add("selected");


    randomVerseHint.textContent =
        "♡ 你选择了这一节";


    /*
     * Small delay before flip
     */

    setTimeout(function() {

        if (
            card.classList.contains("selected")
        ) {

            card.classList.add("flipped");

        }

    }, 100);

}


/* ================================
   Pause Auto Scroll
================================ */

function pauseAutoScroll() {

    autoScrollPaused = true;


    clearTimeout(
        autoScrollResumeTimer
    );


    autoScrollResumeTimer =
        setTimeout(function() {

            autoScrollPaused = false;

        }, 1200);

}


/* ================================
   Detect Manual Scroll
================================ */

let lastScrollY =
    window.scrollY;


window.addEventListener(
    "scroll",
    function() {

        const currentScrollY =
            window.scrollY;


        /*
         * Ignore very small
         * automatic movement
         */

        if (
            Math.abs(
                currentScrollY - lastScrollY
            ) > 1
        ) {

            pauseAutoScroll();

        }


        lastScrollY =
            currentScrollY;

    },
    {
        passive:true
    }
);


/* ================================
   Auto Scroll
================================ */

function autoScroll(timestamp) {

    if (!lastTime) {

        lastTime = timestamp;

    }


    const delta =
        timestamp - lastTime;


    lastTime =
        timestamp;


    if (
        !autoScrollPaused &&
        randomVerseRunning
    ) {

        window.scrollBy(
            0,
            delta * 0.025
        );

    }


    requestAnimationFrame(
        autoScroll
    );

}


/* ================================
   Back Button
================================ */

randomVerseBack.addEventListener(
    "click",
    function() {

        window.location.href =
            "index.html";

    }
);


/* ================================
   Start
================================ */

createCards();


requestAnimationFrame(
    autoScroll
);