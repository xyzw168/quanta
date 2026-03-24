let currentQuiz = [];
let currentIndex = 0;

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');
const progressEl = document.getElementById('current-index');

const materiaFile = document.body.getAttribute('data-materi');

if (materiaFile) {
    fetch(materiaFile)
        .then(res => res.json())
        .then(data => {
            currentQuiz = data;
            showQuestion();
        })
        .catch(err => console.error("Gagal memuat soal:", err));
}

function showQuestion() {
    if (currentIndex >= currentQuiz.length) {
        finishQuiz();
        return;
    }

    const q = currentQuiz[currentIndex];
    questionEl.innerText = q.soal;
    progressEl.innerText = currentIndex + 1;
    
    optionsEl.innerHTML = '';
    feedbackEl.innerHTML = '';
    nextBtn.style.display = 'none';

    q.opsi.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = 'btn-opt';
        btn.onclick = () => checkAnswer(opt, q.jawaban, q.kata_kunci);
        optionsEl.appendChild(btn);
    });
}

function checkAnswer(selected, correct, keyword) {
    const allButtons = document.querySelectorAll('.btn-opt');
    allButtons.forEach(btn => btn.disabled = true); // Kunci tombol

    if (selected === correct) {
        feedbackEl.innerHTML = `<div style="color:var(--success)">✨ Jawabanmu benar!</div>`;
    } else {
        feedbackEl.innerHTML = `<div style="color:var(--error)">💡 Kurang tepat. Jawaban benar: ${correct}</div>`;
    }

    if (keyword) {
        feedbackEl.innerHTML += `
            <a href="https://kbbi.kemdikbud.go.id/entri/${keyword}" target="_blank" class="kbbi-link">
                Lihat penjelasan di KBBI →
            </a>`;
    }

    nextBtn.style.display = 'block';
}

function nextQuestion() {
    currentIndex++;
    showQuestion();
}

function finishQuiz() {
    const quizBox = document.querySelector('.quiz-box');
    quizBox.innerHTML = `
        <div style="text-align:center">
            <h2>Latihan Selesai</h2>
            <p>Kamu sudah menyelesaikan semua soal di kategori ini.</p>
            <br>
            <a href="index.html" class="btn-main" style="text-decoration:none">Pilih Materi Lain</a>
        </div>
    `;
}
