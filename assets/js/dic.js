const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById("search-btn");

btn.addEventListener("click", () => {
    let inputWord = document.getElementById("input-word").value;
    fetch(`${url}${inputWord}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            result.innerHTML = `
            <div class="word">
                    <h3>${inputWord}</h3>
                    <button onclick="playSound('${data[0].phonetics[1].audio}')">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>
                <div class="details">
                    <p>${data[0].meanings[0].partOfSpeech}</p>
                    <p>${data[0].phonetic||""}</p>
                </div>
                <p class="meaning">
                   ${data[0].meanings[0].definitions[0].definition}
                </p>
                <p class="example">
                    ${data[0].meanings[0].definitions[0].example || ""}
                </p>`;
        })
        .catch(() => {
            result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
        });
});

function playSound(val1) {
    const audio1 = new Audio(val1);
    audio1.play();
    setTimeout(() => {playSound2()}, 1200);
}
function playSound2(){
    let inputWord = document.getElementById("input-word").value;
    fetch(`${url}${inputWord}`)
        .then((response) => response.json())
        .then((data) => {
        const utterance = new SpeechSynthesisUtterance("meaning");
        speechSynthesis.speak(utterance);
        const utterance1 = new SpeechSynthesisUtterance(data[0].meanings[0].definitions[0].definition);
        speechSynthesis.speak(utterance1);
    });
}