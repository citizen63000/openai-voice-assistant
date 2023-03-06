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
        this.synth.speak(ut);
    }
}
