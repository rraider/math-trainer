var totalTime = 0;
var questions;
var challengeRoomId;
var question;
var questionId = -1;
var answer = document.getElementById("answer");
var correctAnswers = 0;


function startGame(_challengeRoomId, _questions) {
    answerList = [];
    questionId = -1;
    totalTime = 0;
    correctAnswers = 0;
    challengeRoomId = _challengeRoomId;
    questions = _questions;
    nextQuestion();
}


function onButtonClick(e) {
    e.preventDefault();
    question.timeEnd = new Date();
    question.userInput = answer.value;
    question.expectedAnswer = question.num1 * question.num2;
    question.correct = question.userInput == question.expectedAnswer;
    question.timeDifference = question.timeEnd - question.timeStart;
    if (question.correct) {
        document.getElementById("output").innerHTML = ("Richtig!");
    } else {
        document.getElementById("output").innerHTML = (question.userInput + " Ist Falsch! Richtig wäre " + question.expectedAnswer + "!");

    }

    var user = firebase.auth().currentUser;
    firebase.database().ref("/statistics/" + challengeRoomId + "/" + user.uid + "/answers/" + questionId).set(question);


    answer.value = "";
    totalTime += question.timeDifference;
    var timeDifferenceSeconds = question.timeDifference / 1000;
    var timeAverage = Math.round((totalTime / questions.length) / 100) / 10;
    document.getElementById("time").innerHTML = ("Du hast " + timeDifferenceSeconds +
    " Sekunden gebraucht! Durchschnitt: " + timeAverage + " Sekunden!");
    $("#results").append($("<tr><td>" + question.num1 + " * " + question.num2 +
        "</td><td>" + question.expectedAnswer + "</td><td>" + question.userInput +
        "</td><td>" + question.timeDifference + "</td><td>" + question.correct + "</td></tr>"));


    if (questionId >= questions.length) {
        $("#gameView").hide();
        $("#outcome").show();
        $("#yourTime").text(totalTime / 1000);
        $("#yourAverage").text(timeAverage);


        var correctAnswersInPercent = (correctAnswers / questions.length) * 100;
        $("#correctAnswersInPercent").text(correctAnswersInPercent);
        firebase.database().ref("/statistics/" + challengeRoomId + "/" + user.uid + "/data").set({
            correctAnswers: correctAnswers,
            totalTime: totalTime,
        })
    } else {
        nextQuestion();
    }

    return false;


}

function nextQuestion() {
    questionId++;
    var gameQuestion = questions[questionId];
    question = {
        num1: gameQuestion.num1,
        num2: gameQuestion.num2,
        timeStart: new Date()
    }

    var questionText = "Was ist " + question.num1 + " * " + question.num2 + " ?";
    document.getElementById("question").innerHTML = questionText;

}
