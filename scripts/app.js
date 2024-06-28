vocabPath = 'model/tokenizer_dictionary.json';
classes = ['anger', 'fear', 'joy', 'love', 'neutral',
    'sadness', 'surprise']

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
    console.log(tokenized_text);
    for (var i = (200 - tokenized_text.length), k = 0; i < 200, k < tokenized_text.length; i++, k++) {
        padded_text[i] = tokenized_text[k];
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

function interpretPrediction(prediction) {
    var max = Math.max(...prediction);
    var index = prediction.indexOf(max);
    return [classes[index], max];
}

async function evaluateSentence() {
    if (probabilityChart != undefined) {
        probabilityChart.destroy();
    }

    var inputElem = document.getElementById("input")
    var sentence = inputElem.value;
    inputElem.value = "";

    var preprocessed_text = preprocess_text(sentence);
    prediction = predictEmotion(preprocessed_text);
    prediction = prediction.arraySync();

    predictionMainClass = interpretPrediction(prediction[0]);
    probabilityOfMainClass = Math.round(predictionMainClass[1] * 100);
    document.getElementById("predicted-class").innerText = predictionMainClass[0].charAt(0).toUpperCase() +
        predictionMainClass[0].slice(1);
    document.getElementById("predicted-class-probability").innerText = " Probability: " +
        probabilityOfMainClass +
        "%";
    console.log(prediction, interpretPrediction(prediction[0]));

    var probabilityChart = new Chart("probabilityChart", {
        type: "bar",
        data: {
            labels: classes,
            datasets: [{
                data: prediction[0]
            }]
        },
        options: {
            legend: { display: false },
            title: {
                display: true,
                text: "Emotion Probability Distribution"
            }
        }
    });
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
            evaluateSentence();
        }
    });
});

