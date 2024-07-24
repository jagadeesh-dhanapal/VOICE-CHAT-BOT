
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const checkResultsButton = document.getElementById('checkResultsButton');
const outputDiv = document.getElementById('output');
const timerDiv = document.getElementById('timer');
let recognition;
let startTime, endTime;
let timeRemaining = 60;
let stopped = false;
let gapCount = 0;
let filling = '';

// Create speech recognition object
recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();

// Set properties
recognition.lang = 'en-US'; // Set the language for speech recognition
recognition.interimResults = false; // Get only final results
recognition.continuous = true; // Keep listening continuously

let transcription = sessionStorage.getItem('transcription') || '';

startButton.addEventListener('click', () => {
  startButton.disabled = true;
  stopButton.disabled = false;

  // Start recognition
  startTime = new Date(); // Record start time
  recognition.start();

  // Update timer every second
  const timerInterval = setInterval(() => {
    timeRemaining--;
    const minutes = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
    const seconds = (timeRemaining % 60).toString().padStart(2, '0');
    timerDiv.textContent = minutes + ':' + seconds;

    if (timeRemaining === 0 || stopped) {
      clearInterval(timerInterval);
      recognition.stop();
      endTime = new Date(); // Record end time

      // Calculate time taken
      const timeTaken = (endTime - startTime) / 1000; // Convert to seconds

      // Store time-related information in session storage
      sessionStorage.setItem('timeTaken', timeTaken);
      sessionStorage.setItem('startTime', startTime);
      sessionStorage.setItem('endTime', endTime);
      sessionStorage.setItem('gapCount', gapCount);

      stopButton.disabled = true;
      checkResultsButton.disabled = false;
    }
  }, 1000);
});

stopButton.addEventListener('click', () => {
  stopped = true;
  stopButton.disabled = true;
});

checkResultsButton.addEventListener('click', () => {
  // Redirect to result page
  window.location.href = 'result.html';
});

recognition.addEventListener('result', (event) => {
  const transcript = event.results[event.results.length - 1][0].transcript;

  transcription += transcript + ' ';
  outputDiv.textContent = transcription.replace(/ +/g, ' '); // Replace multiple spaces with a single space

  const lastIndex = transcript.length - 1;
  const lastChar = transcript[lastIndex];
  if (lastChar === ' ') {
    filling += '_';
  } else {
    filling += lastChar;
  }

  // Store transcription and filling in session storage
  sessionStorage.setItem('transcription', transcription);
  sessionStorage.setItem('filling', filling);

  // Calculate gap count based on filling
  const gapMatches = filling.match(/_/g);
  gapCount = gapMatches ? gapMatches.length : 0;
});

recognition.addEventListener('end', () => {
  // Store transcription and filling in session storage
  sessionStorage.setItem('transcription', transcription);
  sessionStorage.setItem('filling', filling);
});

// Display transcription on initial load
outputDiv.textContent = transcription.replace(/ +/g, ' '); // Replace multiple spaces with a single space