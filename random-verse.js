import { verses } from "./verses.js";

const randomVerseBack =
    document.getElementById("random-verse-back");

const randomVerseContainer =
    document.getElementById("random-verse-container");

const randomVerseTrack =
    document.getElementById("random-verse-track");

const randomVerseHint =
    document.getElementById("random-verse-hint");


let autoScrollPaused = false;
let autoScrollTimer = null;


/* =========================================
   SHUFFLE
   ========================================= */

function shuffleVerses() {

    const shuffled = [...verses];

    for (let i = shuffled.length - 1; i > 0; i--) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

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


/* =========================================
   CREATE CARD
   ========================================= */

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


    card.addEventListener(
        "click",
        function() {

            selectCard(card);

        }
    );


    return card;
}


/* =========================================
   CREATE CARDS
   ========================================= */

function createCards() {

    randomVerseTrack.innerHTML = "";

    const shuffled =
        shuffleVerses();


    const cardsToCreate = 40;


    for (
        let i = 0;
        i < cardsToCreate;
        i++
    ) {

        const verse =
            shuffled[
                i % shuffled.length
            ];


        const card =
            createCard(
                verse,
                i
            );


        randomVerseTrack.appendChild(
            card
        );
    }
}


/* =========================================
   CARD SELECT
   ========================================= */

function selectCard(card) {

    pauseAutoScroll();


    if (
        card.classList.contains("flipped")
    ) {

        card.classList.remove("flipped");
        card.classList.remove("selected");

        randomVerseHint.textContent =
            "✨ 点击一张卡片";

        return;
    }


    const flippedCards =
        randomVerseTrack.querySelectorAll(
            ".random-verse-card.flipped"
        );


    flippedCards.forEach(
        function(otherCard) {

            otherCard.classList.remove(
                "flipped"
            );

            otherCard.classList.remove(
                "selected"
            );

        }
    );


    card.classList.add("selected");


    randomVerseHint.textContent =
        "♡ 你选择了这一节";


    setTimeout(
        function() {

            if (
                card.classList.contains(
                    "selected"
                )
            ) {

                card.classList.add(
                    "flipped"
                );

            }

        },
        100
    );
}


/* =========================================
   PAUSE AUTO SCROLL
   ========================================= */

function pauseAutoScroll() {

    autoScrollPaused = true;


    clearTimeout(
        autoScrollTimer
    );


    autoScrollTimer =
        setTimeout(
            function() {

                autoScrollPaused = false;

            },
            1500
        );
}


/* =========================================
   USER SCROLL
   ========================================= */



/* =========================================
   AUTO SCROLL
   ========================================= */

setInterval(
    function() {

        randomVerseContainer.scrollTop += 1;

    },
    20
);


/* =========================================
   BACK BUTTON
   ========================================= */

randomVerseBack.addEventListener(
    "click",
    function() {

        window.location.href =
            "index.html";

    }
);


/* =========================================
   START
   ========================================= */

createCards();