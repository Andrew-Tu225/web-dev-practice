// all of our quotes
const quotes = [
    'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
    'There is nothing more deceptive than an obvious fact.',
    'I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.',
    'I never make exceptions. An exception disproves the rule.',
    'What one man can invent another can discover.',
    'Nothing clears up a case so much as stating it to another person.',
    'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
];
// store the list of words and the index of the word the player is currently typing
let words = [];
let wordIndex = 0;
// the starting time
let startTime = Date.now();

// page elements
let quoteElement = document.getElementById("quote");
let messageElement = document.getElementById("message");
let typedValueElement = document.getElementById("typed-value");

document.getElementById("start-btn").addEventListener("click", () => {
    let quoteIndex = Math.floor(Math.random() * quotes.length);
    let quote = quotes[quoteIndex];
    words = quote.split(" ");
    wordIndex = 0;

    const spanWords = words.map(function(word) {return `<span>${word} </span>`});
    quoteElement.innerHTML = spanWords.join("");
    quoteElement.childNodes[0].className = "highlight";
    messageElement.innerText = '';

    //empty type space and set focus
    typedValueElement.value = "";
    typedValueElement.focus();

    startTime = new Date().getTime();
})

typedValueElement.addEventListener("input", ()=>{
    let word = words[wordIndex];
    let typedValue = typedValueElement.value;

    if (word === typedValue && wordIndex === words.length - 1){
        const elapsedTime = new Date().getTime() - startTime;
        const message = `CONGRATULATIONS! You finished in ${elapsedTime / 1000} seconds.`;
        messageElement.innerText = message;
    }
    else if (typedValue.endsWith(" ") && typedValue.trim() === word) {

        typedValueElement.value = "";
        wordIndex++;

        for(const wordElement of quoteElement.childNodes){
            wordElement.className = "";
        }
        quoteElement.childNodes[wordIndex].className = "highlight";
    }
    else if (word.startsWith(typedValue)){
        typedValueElement.className = '';
    }
    else {
        typedValueElement.className = 'error';
    }
})