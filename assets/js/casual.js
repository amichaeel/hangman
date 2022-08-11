/** User stats */
if (!localStorage.getItem("wins")) {
    let wins = localStorage.setItem("wins", 0);
}
if (!localStorage.getItem("losses")) {
    let losses = localStorage.setItem("losses", 0);
}
$("#wins").text(`Wins: ${localStorage.getItem("wins")}`)
$("#losses").text(`Losses: ${localStorage.getItem("losses")}`)

const displayLoading = () => {
    $("#spinner").show()
}

const hideLoading = () => {
    $("#spinner").hide();
}

/** Generate word and create word array */
let word = "";
let chosenWord = [];
let underscores = [];
displayLoading();
fetch('https://random-word-api.herokuapp.com/word')
    .then((response) => response.json())
    .then((data) => {
        hideLoading();
        word = data[0];
        chosenWord = word.split("");

        /** Underscore Logic */
        underscores = [];
        for (const letter of chosenWord) {
            underscores.push("_");
        }
        $("#underscore").text(underscores.join(" "));
    });

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
        lockKeys();
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
        lockKeys();
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
    displayLoading();
    fetch('https://random-word-api.herokuapp.com/word')
        .then((response) => response.json())
        .then((data) => {
            hideLoading();
            word = data[0];
            chosenWord = word.split("");

            /** Underscore Logic */
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
        });
}
/** Stats logic */
const updateStats = (won) => {
    if (!won) {
        const lossesVal = (parseInt(localStorage.getItem("losses"))+1);
        localStorage.setItem("losses", lossesVal.toString());
        $('#losses').text(`Losses: ${localStorage.getItem("losses")}`)
    } else {
        const winsVal = (parseInt(localStorage.getItem("wins"))+1);
        localStorage.setItem("wins", winsVal.toString());
        $('#wins').text(`Wins: ${localStorage.getItem("wins")}`)
    }
}

/** Refresh stats logic */
const refreshStats = () => {
    localStorage.setItem("wins", 0);
    localStorage.setItem("losses", 0);
    location.reload();
}

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


/** Refresh casual stats */
$('#reset-stats').click(() => {
    refreshStats();
})