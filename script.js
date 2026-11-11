import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { verses } from "./verses.js";

// ================================
// Firebase
// ================================

const auth = window.firebaseAuth;
const db = window.firebaseDB;


// ================================
// Current Firebase User
// ================================

let currentUser = null;


onAuthStateChanged(
    auth,
    function (user) {

        currentUser = user;

        console.log(
            "Firebase Auth State:",
            user
        );

    }
);


// ================================
// Pages
// ================================

const openingPage =
    document.getElementById("opening-page");

const loginPage =
    document.getElementById("login-page");

const usernamePage =
    document.getElementById("username-page");

const mainPage =
    document.getElementById("main-page");


// ================================
// Opening Button
// ================================

const openButton =
    document.getElementById("open-button");

// ================================
// Opening Button
// ================================

openButton.addEventListener(
    "click",
    async function () {

        openingPage.style.display = "none";


        // Already logged in
        if (currentUser) {

            console.log(
                "User already logged in:",
                currentUser.uid
            );

            await checkUserProfile(
                currentUser
            );

        }

        // Not logged in
        else {

            loginPage.style.display = "flex";

        }

    }
);


// ================================
// Login / Sign Up Elements
// ================================

const loginEmail =
    document.getElementById("login-email");

const loginPassword =
    document.getElementById("login-password");

const loginButton =
    document.getElementById("login-button");


const signupUsername =
    document.getElementById("signup-username");

const signupEmail =
    document.getElementById("signup-email");

const signupPassword =
    document.getElementById("signup-password");

const signupButton =
    document.getElementById("signup-button");


const googleLoginButton =
    document.getElementById("google-login-button");


const signupForm =
    document.getElementById("signup-form");


const showSignupButton =
    document.getElementById("show-signup-button");


const showLoginButton =
    document.getElementById("show-login-button");


const authMessage =
    document.getElementById("auth-message");


// ================================
// Username Elements
// ================================

const usernameInput =
    document.getElementById("username-input");

const saveUsernameButton =
    document.getElementById("save-username-button");

const usernameMessage =
    document.getElementById("username-message");


// ================================
// Switch to Sign Up
// ================================

showSignupButton.addEventListener(
    "click",
    function () {

        signupForm.style.display = "block";

        loginEmail.style.display = "none";

        loginPassword.style.display = "none";

        loginButton.style.display = "none";

        googleLoginButton.style.display = "none";

        document.querySelector(
            ".login-divider"
        ).style.display = "none";

        showSignupButton.parentElement.style.display =
            "none";

        authMessage.textContent = "";

    }
);


// ================================
// Switch Back to Login
// ================================

showLoginButton.addEventListener(
    "click",
    function () {

        signupForm.style.display = "none";

        loginEmail.style.display = "block";

        loginPassword.style.display = "block";

        loginButton.style.display = "block";

        googleLoginButton.style.display = "flex";

        document.querySelector(
            ".login-divider"
        ).style.display = "flex";

        showSignupButton.parentElement.style.display =
            "block";

        authMessage.textContent = "";

    }
);


// ================================
// Email Login
// ================================

loginButton.addEventListener(
    "click",
    async function () {

        const email =
            loginEmail.value.trim();

        const password =
            loginPassword.value;


        if (!email || !password) {

            authMessage.textContent =
                "请填写 Email 和 Password。";

            return;

        }


        try {

            authMessage.textContent =
                "登录中...";


            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                userCredential.user;


            await checkUserProfile(user);


        } catch (error) {

            console.error(error);

            authMessage.textContent =
                "Login 失败，请检查 Email 和 Password。";

        }

    }
);


// ================================
// Google Login
// ================================

googleLoginButton.addEventListener(
    "click",
    async function () {

        try {

            authMessage.textContent =
                "正在连接 Google...";


            const provider =
                new GoogleAuthProvider();


            const result =
                await signInWithPopup(
                    auth,
                    provider
                );


            const user =
                result.user;


            console.log(
                "Google Login Success:",
                user
            );


            await checkUserProfile(user);


        } catch (error) {

            console.error(error);

            authMessage.textContent =
                "Google Login 失败，请再试一次。";

        }

    }
);


// ================================
// Sign Up
// ================================

signupButton.addEventListener(
    "click",
    async function () {

        const username =
            signupUsername.value.trim();

        const email =
            signupEmail.value.trim();

        const password =
            signupPassword.value;


        if (!username || !email || !password) {

            authMessage.textContent =
                "请填写 Username、Email 和 Password。";

            return;

        }


        if (password.length < 6) {

            authMessage.textContent =
                "Password 至少需要 6 个字符。";

            return;

        }


        try {

            authMessage.textContent =
                "正在创建账号...";


            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                userCredential.user;


            await setDoc(
                doc(db, "users", user.uid),
                {
                    username: username,
                    email: email,
                    createdAt: serverTimestamp()
                }
            );


            enterMainPage();


        } catch (error) {

            console.error(error);

            authMessage.textContent =
                "注册失败，请检查资料。";

        }

    }
);


// ================================
// Check User Profile
// ================================

async function checkUserProfile(user) {

    try {

        const userRef =
            doc(db, "users", user.uid);


        const userSnapshot =
            await getDoc(userRef);


        if (userSnapshot.exists()) {

            const userData =
                userSnapshot.data();


            console.log(
                "Existing User:",
                userData
            );


            if (
                userData.username &&
                userData.username.trim() !== ""
            ) {

                enterMainPage();

            } else {

                showUsernamePage();

            }

        } else {

            console.log(
                "New User - Username Required"
            );


            showUsernamePage();

        }

    } catch (error) {

        console.error(
            "Check User Profile Error:",
            error
        );


        authMessage.textContent =
            "无法读取用户资料，请再试一次。";

    }

}


// ================================
// Show Username Page
// ================================

function showUsernamePage() {

    openingPage.style.display = "none";

    loginPage.style.display = "none";

    usernamePage.style.display = "flex";

    mainPage.style.display = "none";

    usernameInput.value = "";

    usernameMessage.textContent = "";

}


// ================================
// Save Username
// ================================

saveUsernameButton.addEventListener(
    "click",
    async function () {

        const username =
            usernameInput.value.trim();


        if (!username) {

            usernameMessage.textContent =
                "请输入 Username。";

            return;

        }


        if (username.length < 2) {

            usernameMessage.textContent =
                "Username 至少需要 2 个字符。";

            return;

        }


        try {

            saveUsernameButton.disabled = true;

            usernameMessage.textContent =
                "保存中...";


            const user =
                auth.currentUser;


            if (!user) {

                usernameMessage.textContent =
                    "登录状态已经失效，请重新登录。";

                return;

            }


            await setDoc(
                doc(db, "users", user.uid),
                {
                    username: username,
                    email: user.email,
                    createdAt: serverTimestamp()
                },
                {
                    merge: true
                }
            );


            console.log(
                "Username saved:",
                username
            );


            enterMainPage();


        } catch (error) {

            console.error(
                "Save Username Error:",
                error
            );


            usernameMessage.textContent =
                "保存失败，请再试一次。";


        } finally {

            saveUsernameButton.disabled = false;

        }

    }
);


// ================================
// Enter Main Page
// ================================

// ================================
// Enter Main Page
// ================================

function enterMainPage() {
    openingPage.style.display = "none";
    loginPage.style.display = "none";
    usernamePage.style.display = "none";
    mainPage.style.display = "block";

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });

    loadDailyLogin();
    loadQuizStats();
    loadProfile();
    loadLeaderboard();
    updateOnlineStatus();
}

setInterval(function() {
    if (auth.currentUser) {
        updateOnlineStatus();
    }
}, 30000);

window.addEventListener("beforeunload", function() {
    if (!auth.currentUser) return;

    updateDoc(doc(db, "users", auth.currentUser.uid), {
        online: false,
        lastSeen: serverTimestamp()
    });
});

async function loadProfile() {
    const user = auth.currentUser;
    if (!user) return;

    try {
        const userRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(userRef);

        if (!snapshot.exists()) return;

        const data = snapshot.data();
        const loginStats = data.loginStats || {};
        const gameStats = data.gameStats || {};

        const username = data.username || "Username";
        const totalCheckins = loginStats.totalCheckins || 0;
        const totalQuizCorrect = gameStats.totalQuizCorrect || 0;
        const xp = gameStats.xp || 0;

        updateProfileUI({
            username,
            totalCheckins,
            totalQuizCorrect,
            xp
        });
    } catch (error) {
        console.error("Load Profile Error:", error);
    }
}

function updateProfileUI(stats) {
    const levelInfo = getLevelInfo(stats.xp);

    const profileUsername = document.getElementById("profile-username");
    const profileCheckin = document.getElementById("profile-checkin");
    const profileQuiz = document.getElementById("profile-quiz");
    const profileLevel = document.getElementById("profile-level");
    const profileXpText = document.getElementById("profile-xp-text");
    const profileLevelProgress = document.getElementById("profile-level-progress");

    profileUsername.textContent = stats.username;
    profileCheckin.textContent = stats.totalCheckins;
    profileQuiz.textContent = stats.totalQuizCorrect;
    profileLevel.textContent = levelInfo.level;

    profileXpText.textContent =
        `${levelInfo.currentXP} / ${levelInfo.requiredXP} XP`;

    const progress =
        (levelInfo.currentXP / levelInfo.requiredXP) * 100;

    profileLevelProgress.style.width = progress + "%";
}

// ================================
// Navbar
// ================================

const menuButton =
    document.getElementById("menu-button");

const navMenu =
    document.getElementById("nav-menu");


const profileButton =
    document.getElementById("profile-button");

const profileCard =
    document.getElementById("profile-card");


// ================================
// Open / Close Menu
// ================================

menuButton.addEventListener(
    "click",
    function () {

        navMenu.classList.toggle("active");

        // Close profile
        profileCard.classList.remove("active");

    }
);


// ================================
// Close Menu After Clicking Link
// ================================

const navLinks =
    navMenu.querySelectorAll("a");

navLinks.forEach(function (link) {

    link.addEventListener(
        "click",
        function () {

            navMenu.classList.remove("active");

        }
    );

});


// ================================
// Profile Button
// ================================

profileButton.addEventListener(
    "click",
    function () {

        profileCard.classList.toggle("active");

        // Close navigation menu
        navMenu.classList.remove("active");

    }
);




// ================================
// Test Profile Data
// ================================

function loadProfileTestData() {

    document.getElementById(
        "profile-username"
    ).textContent = "Chun Yen";


    document.getElementById(
        "profile-checkin"
    ).textContent = "12";


    document.getElementById(
        "profile-quiz"
    ).textContent = "86";


    document.getElementById(
        "profile-level"
    ).textContent = "8";


    document.getElementById(
        "profile-xp-text"
    ).textContent = "820 / 1000 XP";


    document.getElementById(
        "profile-level-progress"
    ).style.width = "82%";

}

loadProfileTestData();


// ================================
// Daily Login
// ================================

const dailyLoginButton = document.getElementById("daily-login-button");
const dailyLoginStatus = document.getElementById("daily-login-status");
const dailyStreak = document.getElementById("daily-streak");
const dailyTotal = document.getElementById("daily-total");
const dailyXp = document.getElementById("daily-xp");
const dailyLevelNumber = document.getElementById("daily-level-number");
const dailyXpText = document.getElementById("daily-xp-text");
const dailyLevelProgress = document.getElementById("daily-level-progress");

const DAILY_LOGIN_XP = 10;

function getTodayDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getYesterdayDate() {
    const date = new Date();
    date.setDate(date.getDate() - 1);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getLevelInfo(xp) {
    let level = 1;
    let requiredXP = 100;
    let remainingXP = xp;

    while (remainingXP >= requiredXP) {
        remainingXP -= requiredXP;
        level++;
        requiredXP = 100;
    }

    return {
        level: level,
        currentXP: remainingXP,
        requiredXP: requiredXP
    };
}

function updateDailyLoginUI(stats) {
    const levelInfo = getLevelInfo(stats.xp);

    dailyStreak.textContent = stats.currentStreak;
    dailyTotal.textContent = stats.totalCheckins;
    dailyXp.textContent = "+" + DAILY_LOGIN_XP;
    dailyLevelNumber.textContent = levelInfo.level;

    dailyXpText.textContent =
        `${levelInfo.currentXP} / ${levelInfo.requiredXP} XP`;

    const progress =
        (levelInfo.currentXP / levelInfo.requiredXP) * 100;

    dailyLevelProgress.style.width =
        progress + "%";

    if (stats.lastCheckinDate === getTodayDate()) {
        dailyLoginStatus.textContent =
            "✓ 今天已经签到啦 ♡";

        dailyLoginButton.textContent =
            "✓ 今日已签到";

        dailyLoginButton.classList.add("checked");
        dailyLoginButton.disabled = true;
    } else {
        dailyLoginStatus.textContent =
            "今天签到吧 ♡";

        dailyLoginButton.textContent =
            "✨ 签到";

        dailyLoginButton.classList.remove("checked");
        dailyLoginButton.disabled = false;
    }
}

async function loadDailyLogin() {
    const user = auth.currentUser;

    if (!user) {
        return;
    }

    try {
        const userRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(userRef);

        if (!snapshot.exists()) {
            return;
        }

        const data = snapshot.data();

        const loginStats = data.loginStats || {};
        const gameStats = data.gameStats || {};

        const stats = {
            totalCheckins: loginStats.totalCheckins || 0,
            currentStreak: loginStats.currentStreak || 0,
            lastCheckinDate: loginStats.lastCheckinDate || null,
            xp: gameStats.xp || 0
        };

        updateDailyLoginUI(stats);

    } catch (error) {
        console.error("Load Daily Login Error:", error);
    }
}

dailyLoginButton.addEventListener("click", async function () {
    const user = auth.currentUser;

    if (!user) {
        dailyLoginStatus.textContent =
            "请先登录后再签到。";
        return;
    }

    const today = getTodayDate();
    const yesterday = getYesterdayDate();

    try {
        dailyLoginButton.disabled = true;
        dailyLoginStatus.textContent = "签到中...";

        const userRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(userRef);

        if (!snapshot.exists()) {
            return;
        }

        const data = snapshot.data();

        const loginStats = data.loginStats || {};
        const gameStats = data.gameStats || {};

        const lastCheckinDate =
            loginStats.lastCheckinDate || null;

        const totalCheckins =
            loginStats.totalCheckins || 0;

        let currentStreak =
            loginStats.currentStreak || 0;

        let xp =
            gameStats.xp || 0;

        if (lastCheckinDate === today) {
            updateDailyLoginUI({
                totalCheckins,
                currentStreak,
                lastCheckinDate,
                xp
            });
            return;
        }

        if (lastCheckinDate === yesterday) {
            currentStreak++;
        } else {
            currentStreak = 1;
        }

        const newTotalCheckins =
            totalCheckins + 1;

        const newXP =
            xp + DAILY_LOGIN_XP;

        await updateDoc(userRef, {
            "loginStats.totalCheckins": newTotalCheckins,
            "loginStats.currentStreak": currentStreak,
            "loginStats.lastCheckinDate": today,
            "gameStats.xp": newXP
        });

        updateDailyLoginUI({
            totalCheckins: newTotalCheckins,
            currentStreak,
            lastCheckinDate: today,
            xp: newXP
        });

        loadProfile();

        console.log("Daily Login Success");

    } catch (error) {
        console.error("Daily Login Error:", error);

        dailyLoginStatus.textContent =
            "签到失败，请再试一次。";

        dailyLoginButton.disabled = false;
    }
});

const quizDifficulty = document.getElementById("quiz-difficulty");
const quizArea = document.getElementById("quiz-area");
const quizQuestion = document.getElementById("quiz-question");
const quizOptions = document.getElementById("quiz-options");
const quizResult = document.getElementById("quiz-result");
const quizAnswerInfo = document.getElementById("quiz-answer-info");
const nextQuizButton = document.getElementById("next-quiz-button");
const changeDifficultyButton = document.getElementById("change-difficulty-button");
const quizCorrect = document.getElementById("quiz-correct");
const quizXp = document.getElementById("quiz-xp");

const QUIZ_XP = {
    Easy: 10,
    Medium: 15,
    Hard: 20,
    Insane: 30
};

let quizQuestions = [];
let currentQuiz = null;
let selectedDifficulty = null;
let quizAnswered = false;
let quizDataLoaded = false;

async function loadQuizData() {
    try {
        const response = await fetch("./bible_questions.json");

        if (!response.ok) {
            throw new Error("Unable to load bible_questions.json");
        }

        quizQuestions = await response.json();
        quizDataLoaded = true;

        console.log("Quiz Questions Loaded:", quizQuestions.length);

        const difficulties = [...new Set(
            quizQuestions.map(function(question) {
                return String(question.difficulty).trim();
            })
        )];

        console.log("Available Difficulties:", difficulties);
    } catch (error) {
        console.error("Load Quiz JSON Error:", error);
        quizDataLoaded = false;
        quizQuestion.textContent = "无法读取 Quiz 题库。";
    }
}

function getRandomQuestion() {
    if (!quizDataLoaded) {
        quizQuestion.textContent = "Quiz 题库还在加载，请稍等。";
        return;
    }

    const filteredQuestions = quizQuestions.filter(function(question) {
        return String(question.difficulty).trim().toLowerCase() ===
            String(selectedDifficulty).trim().toLowerCase();
    });

    console.log(
        "Selected Difficulty:",
        selectedDifficulty,
        "Questions Found:",
        filteredQuestions.length
    );

    if (filteredQuestions.length === 0) {
        quizQuestion.textContent = "这个难度暂时没有题目。";
        quizOptions.innerHTML = "";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    currentQuiz = filteredQuestions[randomIndex];

    showQuizQuestion();
}

function showQuizQuestion() {
    quizAnswered = false;
    quizResult.textContent = "";
    quizAnswerInfo.textContent = "";

    quizQuestion.textContent = currentQuiz.question;
    quizOptions.innerHTML = "";

    const letters = ["A","B","C","D"];

    letters.forEach(function(letter) {
        const button = document.createElement("button");

        button.className = "quiz-option";
        button.textContent = `${letter}. ${currentQuiz.options[letter]}`;

        button.addEventListener("click", function() {
            answerQuiz(letter);
        });

        quizOptions.appendChild(button);
    });
}

async function answerQuiz(selectedAnswer) {
    if (quizAnswered) return;

    quizAnswered = true;

    const buttons = quizOptions.querySelectorAll(".quiz-option");

    buttons.forEach(function(button) {
        button.disabled = true;
    });

    const correctAnswer = currentQuiz.answer;
    const correct = selectedAnswer === correctAnswer;
    const rewardXP = QUIZ_XP[selectedDifficulty] || 0;

    buttons.forEach(function(button) {
        if (button.textContent.startsWith(correctAnswer + ".")) {
            button.classList.add("correct");
        }
    });

    if (correct) {
        quizResult.textContent = `✓ 答对了！ +${rewardXP} XP`;
        await saveQuizResult(rewardXP, true);
    } else {
        buttons.forEach(function(button) {
            if (button.textContent.startsWith(selectedAnswer + ".")) {
                button.classList.add("wrong");
            }
        });

        quizResult.textContent = "✗ 答错了，今天的 Quiz 已结束。";
        await saveQuizResult(0, false);
    }

    quizAnswerInfo.innerHTML =
        `<strong>答案：</strong>${correctAnswer}<br>` +
        `<strong>经文：</strong>${currentQuiz.verse}<br>` +
        `<strong>解释：</strong>${currentQuiz.explanation}`;

    if (nextQuizButton) {
        nextQuizButton.style.display = "none";
    }

    changeDifficultyButton.style.display = "none";
}

async function saveQuizResult(rewardXP, correct) {
    const user = auth.currentUser;

    if (!user) return;

    try {
        const userRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(userRef);

        if (!snapshot.exists()) return;

        const data = snapshot.data();
        const gameStats = data.gameStats || {};
        const today = getQuizTodayDate();

        if (gameStats.lastQuizDate === today) {
            return;
        }

        const oldCorrect = gameStats.totalQuizCorrect || 0;
        const oldXP = gameStats.xp || 0;

        const newCorrect = correct ? oldCorrect + 1 : oldCorrect;
        const newXP = oldXP + rewardXP;

        await updateDoc(userRef, {
            "gameStats.xp": newXP,
            "gameStats.totalQuizCorrect": newCorrect,
            "gameStats.lastQuizDate": today,
            "gameStats.lastQuizDifficulty": selectedDifficulty
        });

        quizCorrect.textContent = newCorrect;
        quizXp.textContent = newXP + " XP";

        loadProfile();

        console.log("Quiz Result Saved:", {
            difficulty: selectedDifficulty,
            rewardXP: rewardXP,
            correct: correct
        });

        loadDailyLogin();
    } catch (error) {
        console.error("Save Quiz Result Error:", error);
    }
}

document.querySelectorAll(".difficulty-button").forEach(function(button) {
    button.addEventListener("click", async function() {
        const user = auth.currentUser;

        if (!user) {
            quizResult.textContent = "请先登录。";
            return;
        }

        if (!quizDataLoaded) {
            quizResult.textContent = "Quiz 题库还在加载，请稍等。";
            return;
        }

        try {
            const userRef = doc(db, "users", user.uid);
            const snapshot = await getDoc(userRef);

            if (!snapshot.exists()) return;

            const data = snapshot.data();
            const gameStats = data.gameStats || {};
            const today = getQuizTodayDate();

            if (gameStats.lastQuizDate === today) {
                loadQuizStats();
                return;
            }

            selectedDifficulty = button.dataset.difficulty;

            quizDifficulty.style.display = "none";
            quizArea.style.display = "block";

            getRandomQuestion();
        } catch (error) {
            console.error("Check Quiz Date Error:", error);
        }
    });
});

if (nextQuizButton) {
    nextQuizButton.addEventListener("click", function() {
        return;
    });
}

changeDifficultyButton.addEventListener("click", function() {
    quizArea.style.display = "none";
    quizDifficulty.style.display = "grid";
    currentQuiz = null;
    selectedDifficulty = null;
});

function getQuizTodayDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

async function loadQuizStats() {
    const user = auth.currentUser;

    if (!user) return;

    try {
        const userRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(userRef);

        if (!snapshot.exists()) return;

        const data = snapshot.data();
        const gameStats = data.gameStats || {};
        const today = getQuizTodayDate();

        quizCorrect.textContent = gameStats.totalQuizCorrect || 0;
        quizXp.textContent = (gameStats.xp || 0) + " XP";

        if (gameStats.lastQuizDate === today) {
            quizDifficulty.style.display = "none";
            quizArea.style.display = "block";

            quizQuestion.textContent = "今天的 Quiz 已经完成啦 ♡";
            quizOptions.innerHTML = "";
            quizResult.textContent = "明天再来挑战吧！";
            quizAnswerInfo.textContent = "";

            if (nextQuizButton) {
                nextQuizButton.style.display = "none";
            }

            changeDifficultyButton.style.display = "none";
        } else {
            quizDifficulty.style.display = "grid";
            quizArea.style.display = "none";
            changeDifficultyButton.style.display = "block";
        }
    } catch (error) {
        console.error("Load Quiz Stats Error:", error);
    }
}

loadQuizData();

function escapeLeaderboardText(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function loadLeaderboard() {
    const user = auth.currentUser;
    if (!user) return;

    const leaderboardList = document.getElementById("leaderboard-list");
    const myRank = document.getElementById("leaderboard-my-rank");

    if (!leaderboardList || !myRank) return;

    try {
        leaderboardList.innerHTML =
            `<div class="leaderboard-loading">Loading...</div>`;

        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);

        const users = [];

        snapshot.forEach(function(docSnapshot) {
            const data = docSnapshot.data();
            const gameStats = data.gameStats || {};

            users.push({
                uid: docSnapshot.id,
                username: data.username || "Unknown",
                xp: gameStats.xp || 0,
                totalQuizCorrect: gameStats.totalQuizCorrect || 0
            });
        });

        users.sort(function(a, b) {
            if (b.xp !== a.xp) {
                return b.xp - a.xp;
            }

            return b.totalQuizCorrect - a.totalQuizCorrect;
        });

        leaderboardList.innerHTML = "";

        if (users.length === 0) {
            leaderboardList.innerHTML =
                `<div class="leaderboard-loading">暂时没有排行榜数据。</div>`;
            return;
        }

        users.slice(0, 10).forEach(function(player, index) {
            const rank = index + 1;
            const levelInfo = getLevelInfo(player.xp);

            const item = document.createElement("div");

            item.className =
                "leaderboard-item" +
                (player.uid === user.uid ? " me" : "");

            let rankDisplay = rank;

            if (rank === 1) rankDisplay = "🥇";
            if (rank === 2) rankDisplay = "🥈";
            if (rank === 3) rankDisplay = "🥉";

            item.innerHTML = `
                <div class="leaderboard-rank ${rank <= 3 ? "top" + rank : ""}">
                    ${rankDisplay}
                </div>

                <div class="leaderboard-user">
                    <div class="leaderboard-username">
                        ${escapeLeaderboardText(player.username)}
                    </div>
                    <div class="leaderboard-level">
                        Level ${levelInfo.level}
                    </div>
                </div>

                <div class="leaderboard-xp">
                    ${player.xp}
                    <div class="leaderboard-xp-label">XP</div>
                </div>
            `;

            leaderboardList.appendChild(item);
        });

        const currentIndex = users.findIndex(function(player) {
            return player.uid === user.uid;
        });

        if (currentIndex !== -1) {
            const currentRank = currentIndex + 1;
            const currentUser = users[currentIndex];

            myRank.innerHTML =
                `你的排名：<strong>#${currentRank}</strong> · ` +
                `${currentUser.xp} XP`;

            myRank.style.display = "block";
        }
    } catch (error) {
        console.error("Load Leaderboard Error:", error);

        leaderboardList.innerHTML =
            `<div class="leaderboard-loading">无法读取排行榜。</div>`;
    }
}





const onlineButton = document.getElementById("online-button");
const onlineCard = document.getElementById("online-card");
const onlineList = document.getElementById("online-list");
const onlineCount = document.getElementById("online-count");

onlineButton.addEventListener("click", function() {
    onlineCard.classList.toggle("active");
    profileCard.classList.remove("active");
    navMenu.classList.remove("active");

    if (onlineCard.classList.contains("active")) {
        loadOnlinePlayers();
    }
});

async function updateOnlineStatus() {
    const user = auth.currentUser;
    if (!user) return;

    try {
        await updateDoc(doc(db, "users", user.uid), {
            online: true,
            lastSeen: serverTimestamp()
        });
    } catch (error) {
        console.error("Update Online Status Error:", error);
    }
}

async function loadOnlinePlayers() {
    try {
        onlineList.innerHTML =
            `<div class="online-loading">Loading...</div>`;

        const usersSnapshot = await getDocs(
            collection(db, "users")
        );

        const now = Date.now();
        const players = [];

        usersSnapshot.forEach(function(userDoc) {
            const data = userDoc.data();

            if (!data.online || !data.lastSeen) return;

            const lastSeen = data.lastSeen.toDate().getTime();
            const secondsAgo = (now - lastSeen) / 1000;

            if (secondsAgo <= 60) {
                players.push({
                    uid: userDoc.id,
                    username: data.username || "Unknown",
                    xp: data.gameStats?.xp || 0
                });
            }
        });

        onlineList.innerHTML = "";

        onlineCount.textContent =
            `${players.length} ${players.length === 1 ? "person" : "people"} online`;

        if (players.length === 0) {
            onlineList.innerHTML =
                `<div class="online-empty">目前没有其他人在线 ♡</div>`;
            return;
        }

        players.forEach(function(player) {
            const levelInfo = getLevelInfo(player.xp);

            const item = document.createElement("div");
            item.className = "online-player";

            item.innerHTML = `
                <div class="online-dot">🟢</div>
                <div class="online-player-info">
                    <div class="online-player-name">
                        ${escapeLeaderboardText(player.username)}
                    </div>
                    <div class="online-player-level">
                        Level ${levelInfo.level}
                    </div>
                </div>
            `;

            onlineList.appendChild(item);
        });
    } catch (error) {
        console.error("Load Online Players Error:", error);

        onlineList.innerHTML =
            `<div class="online-empty">无法读取 Online Players。</div>`;
    }
}


const dailyVerseImg = document.getElementById("daily-verse-img");
const dailyVerseTitle = document.getElementById("daily-verse-title");
const dailyVerseText = document.getElementById("daily-verse-text");
const dailyVerseReference = document.getElementById("daily-verse-reference");
const randomVerseButton = document.getElementById("random-verse-button");

function getVerseDayNumber() {
    const now = new Date();
    const start = new Date(now.getFullYear(),0,0);
    const diff = now - start;
    return Math.floor(diff / 86400000);
}

function getDailyVerse() {
    if (!verses.length) return null;

    const today = getQuizTodayDate();

    let seed = 0;

    for (let i = 0; i < today.length; i++) {
        seed = (seed * 31 + today.charCodeAt(i)) >>> 0;
    }

    const index = seed % verses.length;

    return verses[index];
}

function displayVerse(verse) {
    if (!verse) return;

    dailyVerseImg.src = verse.image;
    dailyVerseImg.alt = verse.title;
    dailyVerseTitle.textContent = verse.title;
    dailyVerseText.textContent = verse.text;
    dailyVerseReference.textContent = verse.reference;
}

function loadDailyVerse() {
    displayVerse(getDailyVerse());
}

function loadRandomVerse() {
    if (!verses.length) return;

    const randomIndex = Math.floor(Math.random() * verses.length);
    displayVerse(verses[randomIndex]);
}

randomVerseButton.addEventListener("click", function() {
    loadRandomVerse();
});

loadDailyVerse();


randomVerseButton.addEventListener("click", function() {
    window.location.href = "random-verse.html";
});