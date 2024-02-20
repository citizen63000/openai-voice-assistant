import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TextToSpeechService {

    private synth = window.speechSynthesis;

    constructor() {
    }

    init() {
    }

    say(msg) {
        let ut = new SpeechSynthesisUtterance(msg);
        let voices = this.synth.getVoices();
        ut.voice = voices[0];
        ut.lang = 'fr-FR';
        this.synth.speak(ut);
    }
}
