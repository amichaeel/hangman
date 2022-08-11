/** User stats */
if (!localStorage.getItem("win-streak")) {
    let wins = localStorage.setItem("win-streak", 0);
    $("#win-streak").text(`Win Streak: ${localStorage.getItem("win-streak")}`)
} else {
    $("#win-streak").text(`Win Streak: ${localStorage.getItem("win-streak")}`)
}

/** Display spinner */
const displayLoading = () => {
    $("#spinner").show()
}

/** Hide spinner */
const hideLoading = () => {
    $("#spinner").hide();
}

/** Keyboard refresh logic */
const newKeys = () => {
    $('button').each(index => {
        const letterID = `#letter${index+1}`
        $(`${letterID}`).removeClass("btn-success");
        $(`${letterID}`).attr("disabled", false);
        $(`${letterID}`).addClass("btn-outline-dark");
    })

}

/** Generate word and create word array based on current state*/
let won = false;
$("#play-again-btn").hide();
let word = "";
let chosenWord = [];
let underscores = [];
displayLoading();
if (!localStorage.getItem("casual-word")) {
    localStorage.removeItem("letters-guessed")
    newKeys();
    fetch('https://random-word-api.herokuapp.com/word')
        .then((response) => response.json())
        .then((data) => {
            hideLoading();
            word = data[0];
            localStorage.setItem("casual-word", word);
            chosenWord = word.split("");

            /** Underscore Logic */
            underscores = [];
            for (const letter of chosenWord) {
                underscores.push("_");
            }
            $("#underscore").text(underscores.join(" "));
        });
} else {
    word = localStorage.getItem("casual-word");
    chosenWord = word.split("");
    hideLoading();
    /** Underscore Logic */
    underscores = [];
    for (const letter of chosenWord) {
        underscores.push("_");
    }
    if (localStorage.getItem("letters-guessed")) {
        console.log("test")
        let letterGuessed = JSON.parse(localStorage.getItem("letters-guessed"))
        for (let i = 0; i < chosenWord.length; i++) {
            if (letterGuessed.includes(chosenWord[i])) {
                underscores[i] = chosenWord[i];
            }
        }
        $("#underscore").text(underscores.join(" "));
    } else {
        $("#underscore").text(underscores.join(" "));
    }
}

/** Guess logic */
let guessesLeft;
if (!localStorage.getItem("guesses")) {
    guessesLeft = 10;
    localStorage.setItem("guesses", guessesLeft);
    $('#guess').text(guessesLeft);
} else {
    guessesLeft = (parseInt(localStorage.getItem("guesses")));
    $('#guess').text(guessesLeft);
}

/** Keyboard state logic */
let letteresGuessed;
if (localStorage.getItem("letters-guessed")) {
    lettersGuessed = JSON.parse(localStorage.getItem("letters-guessed"))
    $("button").each((index) => {
        let letterID = `#letter${index+1}`
        let letter = $(`${letterID}`).text().toLowerCase();
        if (lettersGuessed.includes(letter)) {
            if (chosenWord.includes(letter)) {
                $(`${letterID}`).removeClass("btn-outline-dark");
                $(`${letterID}`).addClass("btn-success");
                $(`${letterID}`).attr("disabled", true);
            } else {
                $(`${letterID}`).removeClass("btn-outline-dark");
                $(`${letterID}`).attr("disabled", true);
            }
        }
    })
} else {
    lettersGuessed = [];
    localStorage.setItem("letters-guessed", lettersGuessed);
}


/** Hangman game logic */
$(".letters").click((event) => {
    let key = event.target.innerText.toLowerCase();
    lettersGuessed.push(key);
    localStorage.setItem("letters-guessed", JSON.stringify(lettersGuessed));

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
        localStorage.setItem("guesses", guessesLeft.toString());
        $('#guess').text(guessesLeft);
        const letterID = event.target.getAttribute("id");
        $(`#${letterID}`).removeClass("btn-outline-dark");
        $(`#${letterID}`).attr('disabled', true)
    }

    /** Winning logic */
    if (underscores.join("") == chosenWord.join("")) {
        won = true;
        $("#play-again-btn").show();
        localStorage.removeItem("casual-word");
        localStorage.removeItem("guesses");
        lockKeys();
        updateStats(true);
        $('#win').text('You win!');
    }

    if (guessesLeft <= 6) {
        $("#guess").addClass("low-guesses");
    }

    /** Lose logic */
    if (guessesLeft == 0) {
        localStorage.removeItem("guesses");
        $("#play-again-btn").show();
        localStorage.removeItem("casual-word");
        lockKeys();
        updateStats(false);
        $('#reveal').text('The word was: ' + chosenWord.join("") + '.');
        $('#lose').fadeIn().text('You lose.');
    }
})

/** Hangman refresh logic */
const refresh = (won) => {
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
    guessesLeft = 10;
    localStorage.setItem("guesses", guessesLeft.toString());
    $("#play-again-btn").hide();
    $("#guess").text(guessesLeft);
    displayLoading();
    lettersGuessed = [];
    localStorage.removeItem("letters-guessed");
    localStorage.removeItem("casual-word");
    fetch('https://random-word-api.herokuapp.com/word')
        .then((response) => response.json())
        .then((data) => {
            hideLoading();
            word = data[0];
            localStorage.setItem("casual-word", word);
            chosenWord = word.split("");

            /** Underscore Logic */
            underscores = [];
            for (const letter of chosenWord) {
                underscores.push("_");
            }
            $("#underscore").text(underscores.join(" "));
            newKeys();
            won = false;
        });
}

/** Stats logic */
const updateStats = (won) => {
    let winStreak = (parseInt(localStorage.getItem("win-streak")));
    if (!won) {
        winStreak = 0;
        localStorage.setItem("win-streak", winStreak.toString());
        $('#win-streak').text(`Win Streak: ${localStorage.getItem("win-streak")}`)
    } else {
        winStreak++
        localStorage.setItem("win-streak", winStreak.toString());
        $('#win-streak').text(`Win Streak: ${localStorage.getItem("win-streak")}`)
    }
}

/** Play again */
$("#play-again-btn").click(() => {
    refresh(won);
})

/** Manual game refresh */
$("#reset").click(() => {
    updateStats(false);
    refresh(false)
});

const lockKeys = () => {
    $('button').each((index) => {
        const letterID = `#letter${index+1}`
        $(`${letterID}`).attr("disabled", true);
    })
}
