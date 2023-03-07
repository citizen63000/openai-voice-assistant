import {Injectable} from '@angular/core';

declare var webkitSpeechRecognition: any;

@Injectable({
    providedIn: 'root'
})

export class VoiceRecognitionService {

    private recognition;
    private isStoppedSpeechRecog = true;
    public text = '';
    public tempWords;

    constructor() {
    }

    init() {

        if (!('webkitSpeechRecognition' in window)) {
            alert('SpeechRecognition not supported by your browser, please use Google Chrome');
        } else {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.interimResults = true;
            this.recognition.lang = 'fr-FR';

            this.recognition.addEventListener('result', (e) => {
                const transcript = Array.from(e.results)
                    .map((result) => result[0])
                    .map((result) => result.transcript)
                    .join('');
                this.tempWords = transcript;
            });
        }
    }

    start() {
        // if (this.isStoppedSpeechRecog == true) {
            this.isStoppedSpeechRecog = false;
            this.recognition.start();
            this.recognition.addEventListener('end', (condition) => {
                if (this.isStoppedSpeechRecog) {
                    this.recognition.stop();
                } else {
                    this.wordConcat()
                    this.recognition.start();
                }
            });
        // }
    }

    stop() {
        this.isStoppedSpeechRecog = true;
        this.wordConcat()
        this.recognition.stop();
    }

    wordConcat() {
        if (this.tempWords != undefined && this.tempWords.trim() != '') {
            this.text = this.text + ' ' + this.tempWords.trim();
        }
        this.tempWords = '';
    }

}
