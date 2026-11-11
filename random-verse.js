import { verses } from "./verses.js";


/* ================================
   Elements
================================ */

const randomVerseBack =
    document.getElementById("random-verse-back");

const randomVerseTrack =
    document.getElementById("random-verse-track");

const randomVerseHint =
    document.getElementById("random-verse-hint");


/* ================================
   Variables
================================ */

let autoScrollPaused = false;
let autoScrollResumeTimer = null;

let lastTime = null;


/* ================================
   Shuffle Verses
================================ */

function shuffleVerses() {

    const shuffled = [...verses];

    for (let i = shuffled.length - 1; i > 0; i--) {

        const j = Math.floor(
            Math.random() * (i + 1)
        );

        [shuffled[i], shuffled[j]] = [
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

    const card = document.createElement("div");

    card.className = "random-verse-card";

    card.innerHTML = `

        <div class="random-verse-card-inner">


            <!-- Front -->

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


            <!-- Back -->

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


    /* ================================
       Card Click
    ================================ */

    card.addEventListener(
        "click",
        function() {

            selectCard(card);

        }
    );


    return card;
}


/* ================================
   Create Cards
================================ */

function createCards() {

    randomVerseTrack.innerHTML = "";

    const shuffled = shuffleVerses();

    /*
     * Number of cards shown.
     */
    const cardsToCreate = 12;


    for (
        let i = 0;
        i < cardsToCreate;
        i++
    ) {

        const verse =
            shuffled[i % shuffled.length];


        const card =
            createCard(
                verse,
                i
            );


        randomVerseTrack.appendChild(card);

    }
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

        }, 1500);

}


/* ================================
   Select Card
================================ */

function selectCard(card) {

    /*
     * Stop auto movement temporarily
     * when user interacts with a card.
     */
    pauseAutoScroll();


    /* ================================
       Click Same Card
       → Close it
    ================================ */

    if (
        card.classList.contains("flipped")
    ) {

        card.classList.remove(
            "flipped"
        );

        card.classList.remove(
            "selected"
        );


        randomVerseHint.textContent =
            "✨ 点击一张卡片";


        return;
    }


    /* ================================
       Close Other Cards
    ================================ */

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


    /* ================================
       Select New Card
    ================================ */

    card.classList.add(
        "selected"
    );


    randomVerseHint.textContent =
        "♡ 你选择了这一节";


    /* ================================
       Flip Open
    ================================ */

    setTimeout(function() {

        if (
            card.classList.contains(
                "selected"
            )
        ) {

            card.classList.add(
                "flipped"
            );

        }

    }, 100);

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
   Automatic Scroll
================================ */

function autoScroll(timestamp) {


    /*
     * First frame
     */
    if (lastTime === null) {

        lastTime = timestamp;

    }


    const delta =
        timestamp - lastTime;


    lastTime = timestamp;


    /*
     * Only scroll when user
     * is not interacting.
     */
    if (!autoScrollPaused) {


        /*
         * Scroll the entire webpage.
         *
         * 0.025 = very slow
         */
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
   Start Auto Scroll
================================ */

requestAnimationFrame(
    autoScroll
);


/* ================================
   Detect Manual Touch
================================ */

window.addEventListener(
    "touchstart",
    function() {

        pauseAutoScroll();

    },
    {
        passive: true
    }
);


window.addEventListener(
    "touchmove",
    function() {

        pauseAutoScroll();

    },
    {
        passive: true
    }
);


window.addEventListener(
    "touchend",
    function() {

        pauseAutoScroll();

    },
    {
        passive: true
    }
);


/* ================================
   Detect Mouse Wheel
================================ */

window.addEventListener(
    "wheel",
    function() {

        pauseAutoScroll();

    },
    {
        passive: true
    }
);


/* ================================
   Detect Mouse Drag
================================ */

window.addEventListener(
    "mousedown",
    function() {

        pauseAutoScroll();

    }
);


window.addEventListener(
    "mousemove",
    function(event) {

        if (event.buttons) {

            pauseAutoScroll();

        }

    }
);


window.addEventListener(
    "mouseup",
    function() {

        pauseAutoScroll();

    }
);


/* ================================
   Create Cards
================================ */

createCards();