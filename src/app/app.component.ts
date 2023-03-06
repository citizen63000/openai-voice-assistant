import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../environments/environment";
import { Injectable } from '@angular/core';
import {VoiceRecognitionService} from "./service/voice-recognition.service";
import {TextToSpeechService} from "./service/text-to-speech.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

@Injectable({
    providedIn: 'root'
})

export class AppComponent implements OnInit {

    public conversation = '';
    public voiceRecognitionState = 0;
    public voiceButtonColor = 'primary'

  constructor(private http: HttpClient, public voiceRecognition: VoiceRecognitionService, public textToSpeech: TextToSpeechService) { }

  ngOnInit(): void {

      // microphone authorization
      navigator.mediaDevices.getUserMedia({audio: true});
      // init recognition system
      this.voiceRecognition.init();
      // init textToSpeech system
      this.textToSpeech.init();
  }

  voiceRecognitionSwitch() {
      if (this.voiceRecognitionState == 0) {
          this.voiceRecognition.start();
          this.voiceRecognitionState = 1;
          this.voiceButtonColor = 'warn'
      } else {
          this.voiceRecognition.stop();
          this.voiceRecognitionState = 0;
          this.voiceButtonColor = 'primary'
          this.callChatGPT(this.voiceRecognition.text);
          this.voiceRecognition.text = '';
      }
  }

  callChatGPT(text) {

    this.conversation = this.conversation.concat('<br /><b>Me</b> : ' + text);

    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + environment.openAIApiKey,
      'Content-Type': 'application/json'
    });

    let requestData = { 'model': 'gpt-3.5-turbo', 'messages': [{'role': 'user', 'content': text}]}

    this.http.post<any>('https://api.openai.com/v1/chat/completions', JSON.stringify(requestData),{headers: headers})
        .subscribe(data => {
            let htmlResponse = data.choices[0].message.content.replace(/\\n/g, '<br/>')
            this.textToVoice(htmlResponse);
            this.conversation = this.conversation.concat('<br /><b>ChatGPT</b> : ' + htmlResponse);
        });
  }

  textToVoice(text) {
        this.textToSpeech.say(text);
  }
}
