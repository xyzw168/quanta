let currentQuiz = [];
let currentIndex = 0;
let score = 0; // Tambah variabel skor

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
            const savedPart = sessionStorage.getItem(materiaFile + '_part');

            if (savedPart && data[savedPart]) {
                currentQuiz = data[savedPart];
                currentIndex = parseInt(sessionStorage.getItem(materiaFile + '_index') || '0');
                score = parseInt(sessionStorage.getItem(materiaFile + '_score') || '0');
                showQuestion();
            } else if (data.part1) {
                document.getElementById('question').innerText = "Pilih Part untuk Memulai";
                document.getElementById('options').innerHTML = `
                    <button class="btn-opt" onclick="loadPart('part1')">Mulai Part 1</button>
                    <button class="btn-opt" onclick="loadPart('part2')">Mulai Part 2</button>
                `;
            } else {
                currentQuiz = data;
                showQuestion();
            }
        });
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
    allButtons.forEach(btn => btn.disabled = true);

    if (selected === correct) {
        score++; // Tambah skor jika benar
        sessionStorage.setItem(materiaFile + '_score', score);
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
    sessionStorage.setItem(materiaFile + '_index', currentIndex);
    showQuestion();
}

// Fungsi Finish yang sudah diperbarui dengan skor
function finishQuiz() {
    sessionStorage.removeItem(materiaFile + '_part');
    sessionStorage.removeItem(materiaFile + '_index');
    sessionStorage.removeItem(materiaFile + '_score');

    const quizBox = document.querySelector('.quiz-box');
    const totalSoal = currentQuiz.length;
    const nilaiFinal = Math.round((score / totalSoal) * 100);

    quizBox.innerHTML = `
        <div style="text-align:center">
            <div style="font-size: 4rem; margin-bottom: 10px;">🏆</div>
            <h2 style="margin-bottom: 5px;">Latihan Selesai!</h2>
            <p style="opacity: 0.8; margin-bottom: 20px;">Kamu hebat sudah mencoba!</p>
            
            <div style="background: var(--bg); padding: 20px; border-radius: 20px; margin-bottom: 25px;">
                <p style="margin: 0; font-size: 0.9rem; font-weight: 600;">SKOR KAMU</p>
                <h1 style="font-size: 3.5rem; margin: 5px 0; color: var(--primary);">${nilaiFinal}</h1>
                <p style="margin: 0; font-size: 0.8rem;">${score} benar dari ${totalSoal} soal</p>
            </div>

            <a href="index.html" class="btn-main" style="text-decoration:none; display: block;">Pilih Materi Lain</a>
        </div>
    `;
}

function loadPart(partName) {
    currentIndex = 0;
    score = 0; // Reset skor saat ganti part

    sessionStorage.setItem(materiaFile + '_part', partName);
    sessionStorage.setItem(materiaFile + '_index', currentIndex);
    sessionStorage.setItem(materiaFile + '_score', score);

    fetch(materiaFile)
        .then(res => res.json())
        .then(data => {
            currentQuiz = data[partName]; 
            showQuestion();
        });
}
