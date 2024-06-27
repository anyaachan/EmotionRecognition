vocabPath = 'model/tokenizer_dictionary.json';

async function loadTokenizer() {
    let tknzr = fetch(vocabPath).then(response => {
        return response.json();
    })
    return tknzr;
  }

function preprocess_text(text){
    text = text.toLowerCase();
    text = text.replace(/[0-9]+/g, '') // Remove digits
                .replace(/'/g, '') // Remove apostrophes
                .replace(/["#$%&()*+,-./:;<=>@[\\\]^_`{|}~\t\n]/g, '') // Remove punctuation and whitespace characters
                .replace(/@[^\s]+/g, '') // Remove mentions
                .replace('?', ' ?');
    var split_text = text.split(' ');
    console.log(tokenizer);
    return text;
}

async function loadModel() {
    const model = await tf.loadLayersModel('model/tfjs/model.json'); // Can only be called in async function
    return model;
}

function processModel(sentence){
    prediction  = model.predict(tensorInput);

    return prediction; 
}

function getSentence() {
    var inputElem = document.getElementById("input")
    var sentence = inputElem.value;
    inputElem.value = "";
    console.log(preprocess_text(sentence));
}


async function init() {
    tokenizer = await loadTokenizer();
    model = await loadModel();   
}

document.addEventListener('DOMContentLoaded', (event) => {
    init();

    document.getElementById("input").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            getSentence();
        }
    });
});

