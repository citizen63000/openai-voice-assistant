import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'openai-voice-assistant';

  conversation = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {}

  voiceToText() {

    let headers = new HttpHeaders({
      'Authorization': 'Bearer ',
      'Content-Type': 'application/json'
    });

    let requestData = { 'audio': '', 'config': {
        'enableAutomaticPunctuation': true,
        'encoding': "LINEAR16",
        "languageCode": "fr-FR",
        "model": "default"
      }
    }

    this.http.post<any>('https://speech.googleapis.com/v1p1beta1/speech:recognize', JSON.stringify(requestData),{headers: headers})
        .subscribe(data => {
          console.log(data);
          this.conversation = data.choices[0].message.content;
          this.textToVoice(this.conversation);
        });
  }

  callChatGPT(text) {

    this.conversation = this.conversation.concat('<br /><b>You</b> : ' + text);

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
