/** User stats */
if (!localStorage.getItem("daily-win-streak")) {
    let wins = localStorage.setItem("daily-win-streak", 0);
}

$("#wins").text(`Win Streak: ${localStorage.getItem("wins")}`)

/** Generate word and create word array */
let word = "";

fetch('https://random-word-api.herokuapp.com/word')
    .then((response) => response.json())
    .then((data) => word = data[0]);

localStorage.setItem("daily-word", word);
let chosenWord = word.split('');

/** Underscore Logic */
let underscores = [];
for (const letter of chosenWord) {
    underscores.push("_");
}
$("#underscore").text(underscores.join(" "));

/** Guess logic */
let guessesLeft = 10;
$('#guess').text(guessesLeft);

/** Hangman game logic */
$(".letters").click((event) => {
    let key = event.target.innerText.toLowerCase();

    /** Letter found logic */
    let found = false;
    for (let i = 0; i < chosenWord.length; i++) {
        if (chosenWord[i] == key) {
            found = true
            underscores[i] = key;
            $("#underscore").text(underscores.join(" "));
            const letterID = event.target.getAttribute("id");
            $(`#${letterID}`).removeClass("btn-outline-dark");
            $(`#${letterID}`).attr('disabled', 'disabled')
            $(`#${letterID}`).addClass("btn-success");
        }
    }

    /** Letter not found logic */
    if (!found) {
        guessesLeft--
        $('#guess').text(guessesLeft);
        const letterID = event.target.getAttribute("id");
        $(`#${letterID}`).removeClass("btn-outline-dark");
        $(`#${letterID}`).attr('disabled', true)
    }

    /** Winning logic */
    if (underscores.join("") == chosenWord.join("")) {
        updateStats(true);
        $('#win').text('You win!');
        $('#restart').text('*Restarting*')
        setTimeout(() => {
            refresh(true);
        }, 2000);
    }

    if (guessesLeft <= 6) {
        $("#guess").addClass("low-guesses");
    }

    /** Loss logic */
    if (guessesLeft == 0) {
        updateStats(false);
        $('#reveal').text('The word was: ' + chosenWord.join("") + '.');
        $('#lose').fadeIn().text('You lose.');
        $('#restart').text('*Restarting*')
        setTimeout(() => {
            refresh(false);
        }, 2000);
    }

})

/** Keyboard refresh logic */
const newKeys = () => {
    $('button').each(index => {
        const letterID = `#letter${index+1}`
        $(`${letterID}`).removeClass("btn-success");
        $(`${letterID}`).attr("disabled", false);
        $(`${letterID}`).addClass("btn-outline-dark");
    })

}
