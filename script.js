const quoteApiUrl = "https://api.quotable.io/random?minLength=250";

const typingText = document.querySelector(".text p");
const inputField = document.querySelector(".container .input-field");
const timerTag = document.querySelector(".time span b")
const mistakesTag = document.querySelector(".mistakes span");
const wpmTag = document.querySelector(".wpm span");
const cpmTag = document.querySelector(".cpm span");
tryAgainButton = document.querySelector("button");

const maxTime = 60;
let remainingTime = maxTime;
let timer;

let charIndex = 0;
let mistakes = 0;

let isTyping = false;

const getQuote = async () => {
    const response = await fetch(quoteApiUrl);
    const data = await response.json();
    quote = data.content;
    return quote;
};

const renderRandomQuote = () => {
    typingText.innerHTML = "";
    getQuote().then((quote) => {
        quote.split("").forEach((span) => {
            let spanTag = `<span>${span}</span>`;
            typingText.innerHTML += spanTag;
        });
        typingText.querySelectorAll("span")[0].classList.add("active");
    });

    document.addEventListener("keydown", () => inputField.focus());
    typingText.addEventListener("click", () => inputField.focus());
};

const initTyping = () => {
    const characters = typingText.querySelectorAll("span");

    if (charIndex < characters.length - 1 && remainingTime > 0) {
        handleTyping(characters);
    } else {
        inputField.value = "";
        clearInterval(timer);
    }
}

const handleTyping = (characters) => {
    let typedCharacter = inputField.value.split("")[charIndex];
    
    if (!isTyping) {
        isTyping = true;
        timer = setInterval(initTimer, 1000);
    }

    if (typedCharacter == null) {
        charIndex--;

        if (characters[charIndex].classList.contains("incorrect")) {
            mistakes--;
        }

        characters[charIndex].classList.remove("correct", "incorrect");
    } else {

        if (characters[charIndex].innerText === typedCharacter) {
            characters[charIndex].classList.add("correct");
        } else {
            mistakes++;
            characters[charIndex].classList.add("incorrect");
        }

        charIndex++;
    }

    updateCursor(characters);
    updateCpmAndMistakes();
    updateWpm();

}

const updateCursor = (characters) => {
    characters.forEach(span => span.classList.remove("active"));
    characters[charIndex].classList.add("active");
}

const updateCpmAndMistakes = () => {
    mistakesTag.innerText = mistakes;
    cpmTag.innerText = charIndex - mistakes;
}

    // Wpm calculated using assuming an average word size of 5
    // Using formula from: https://support.sunburst.com/hc/en-us/articles/229335208-Type-to-Learn-How-are-Words-Per-Minute-and-Accuracy-Calculated-#:~:text=Calculating%20Words%20per%20Minute%20(WPM)&text=Therefore%2C%20the%20number%20of%20words,elapsed%20time%20(in%20minutes).
const updateWpm = () => {
    let wordsTyped = (charIndex - mistakes) / 5;
    let passedTime = maxTime - remainingTime;
    let wpm = Math.round(wordsTyped / passedTime * 60);
    // console.log(wordsTyped, passedTime, wpm);

    if (wpm < 0 || !wpm || wpm === Infinity) {
        wpmTag.innerText = 0;
    } else {
        wpmTag.innerText = wpm;
    }
}

const initTimer = () => {
    if (remainingTime > 0) {
        remainingTime--;
        timerTag.innerText = remainingTime;
    } else {
        clearInterval(timer);
    }
}

const resetApp = () => {
    renderRandomQuote();
    reinitVariables();
}

const reinitVariables = () => {
    remainingTime = maxTime;
    charIndex = 0;
    mistakes = 0;
    isTyping = false;

    timerTag.innerText = remainingTime;
    mistakesTag.innerText = mistakes;
    wpmTag.innerText = 0;
    cpmTag.innerText = 0;

    inputField.value = "";
    clearInterval(timer);
}

// TODO: create INIT function with seperate initialization functions for global variables
// will result in cleaner code
renderRandomQuote();
inputField.addEventListener("input", initTyping);
tryAgainButton.addEventListener("click", resetApp);
