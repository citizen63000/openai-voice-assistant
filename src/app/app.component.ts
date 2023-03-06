import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../environments/environment";
import { Injectable } from '@angular/core';
import {VoiceRecognitionService} from "./service/voice-recognition.service";

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

  constructor(private http: HttpClient, public voiceRecognition: VoiceRecognitionService) { }

  ngOnInit(): void {

      // microphone authorization
      navigator.mediaDevices.getUserMedia({audio: true});
      //init recognition system
      this.voiceRecognition.init();

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
          console.log(data);
          let htmlResponse = data.choices[0].message.content.replace(/\\n/g, '<br/>')
          this.conversation = this.conversation.concat('<br /><b>ChatGPT</b> : ' + htmlResponse);
          this.textToVoice(this.conversation);
        });
  }

  textToVoice(text) {

  }

}
