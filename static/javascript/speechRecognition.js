
    // variables
    const button = document.getElementById('microphone-button'); // const button is getting html button element
    const transcription = document.getElementById('transcription');
    let finalTranscript = '';
    let speechActive = false; // tracking if microphone is recording, defaulted to false
    let speech = new webkitSpeechRecognition() || new SpeechRecognition();
    speech.continuous = true; // will continue to listen to user
    speech.interimResults = false;
    speech.lang = 'en-US';

    speech.onresult = function(event) {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript + ' ';
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        transcription.textContent = finalTranscript; // Update the page with the transcription
    };

    speech.onend = function() {
        if (finalTranscript !== '') {
            // Send the complete transcription when the speech recognition stops
            fetch('/send_text', {
                method: 'POST',
//                headers: {
//                    'Content-Type': 'application/json',
//                },
                body: JSON.stringify({text: finalTranscript})
            })
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.error('Error:', error));
        }
    };

    button.onclick = () => {
        if (speechActive) {
            speech.stop();
            button.textContent = 'Start Recording';
        } else {
            speech.start();
            button.textContent = 'Stop Recording';
        }
        speechActive = !speechActive;
    };