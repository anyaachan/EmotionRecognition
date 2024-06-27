vocabPath = 'model/tokenizer_dictionary.json';

async function loadTokenizer() {
    let tknzr = fetch(vocabPath).then(response => {
        return response.json();
    })

    return tknzr;
}

function preprocess_text(text) {
    text = text.toLowerCase();
    text = text.replace(/[0-9]+/g, '') // Remove digits
        .replace(/'/g, '') // Remove apostrophes
        .replace(/["#$%&()*+,-./:;<=>@[\\\]^_`{|}~\t\n]/g, '') // Remove punctuation and whitespace characters
        .replace(/@[^\s]+/g, '') // Remove mentions
        .replace('?', ' ?');
    var split_text = text.split(' ');
    var tokenized_text = [];
    split_text.forEach((word) => {
        if (tokenizer[word] != undefined) {
            tokenized_text.push(parseInt(tokenizer[word]));
        }
    })
    var padded_text = new Array(200).fill(0);
    for (var i = 200, k = 0; i > (200 - tokenized_text.length), k < tokenized_text.length; i--, k++) {
        padded_text[i-1] = tokenized_text[k];
    }

    console.log(tokenizer);
    console.log(padded_text);
    return tf.tensor2d([padded_text], [1, 200]);
}

async function loadModel() {
    const model = await tf.loadLayersModel('model/tfjs/model.json'); // Can only be called in async function
    return model;
}

function predictEmotion(sentence) {
    prediction = model.predict(sentence);

    return prediction;
}

async function getSentence() {
    var inputElem = document.getElementById("input")
    var sentence = inputElem.value;
    inputElem.value = "";

    var preprocessed_text = preprocess_text(sentence);
    prediction = predictEmotion(preprocessed_text);
    prediction = prediction.arraySync();
    
    console.log(prediction);
}


async function init() {
    tokenizer = await loadTokenizer();
    model = await loadModel();
    console.log("Model and tokenizer loaded successfully.");
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

