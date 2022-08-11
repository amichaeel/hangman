/** User stats */
if (!localStorage.getItem("wins")) {
    let wins = localStorage.setItem("wins", 0);
}
if (!localStorage.getItem("losses")) {
    let losses = localStorage.setItem("losses", 0);
}
$("#wins").text(`Wins: ${localStorage.getItem("wins")}`)
$("#losses").text(`Losses: ${localStorage.getItem("losses")}`)


/** Generate word and create word array */
const words = ["javascript", "java", "python", "swift", "react", "programming"]
let chosenWord = words[Math.floor(Math.random() * words.length)].split('');

/** Underscore Logic */
let underscores = [];
for (const letter of chosenWord) {
    underscores.push("_");
}
$("#underscore").text(underscores.join(" "));

/** Guess logic */
let guessesLeft = 10;
$('#guess').text(guessesLeft);

$('#reset-stats').click(() => {
    refreshStats();
})

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
        wins++
        $("#wins").text(`Wins: ${wins}`)
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

/** Hangman refresh logic */
const refresh = (won) => {
    guessesLeft = 10;
    $("#guess").text(guessesLeft);
    chosenWord = words[Math.floor(Math.random() * words.length)].split('');
    underscores = [];
    for (const letter of chosenWord) {
        underscores.push("_");
    }
    $("#underscore").text(underscores.join(" "));

    if (!won) {
        $("#lose").text("");
        $("#restart").text("");
        $("#reveal").text("");
        $("#guess").removeClass("low-guesses");

    } else {
        $("#win").text("");
        $("#restart").text("");
        $("#guess").removeClass("low-guesses");
    }

    newKeys();

}
/** Stats logic */
const updateStats = (won) => {
    if (!won) {
        const lossesVal = (parseInt(localStorage.getItem("losses"))+1);
        localStorage.setItem("losses", lossesVal.toString());
        $('#losses').text(`Losses: ${localStorage.getItem("losses")}`)
    } else {
        const winsVal = (parseInt(localStorage.getItem("wins"))+1);
        localStorage.setItem("losses", winsVal.toString());
        $('#wins').text(`Losses: ${localStorage.getItem("wins")}`)
    }
}

/** Refresh stats logic */
const refreshStats = () => {
    localStorage.setItem("wins", 0);
    localStorage.setItem("losses", 0);
    location.reload();
}

/** Manual refresh */
$("#reset").click(() => {
    updateStats(false);
    refresh(false)
});