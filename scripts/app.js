function getSentence() {
    var inputElem = document.getElementById("input")
    var sentence = inputElem.value;
    inputElem.value = "";
    console.log(sentence);
}

document.addEventListener('DOMContentLoaded', (event) => {

    document.getElementById("input").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
          event.preventDefault();
          getSentence();
        }
      });
});
