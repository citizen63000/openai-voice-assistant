import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

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

  }

  textToChatGPT(text) {
    console.log(text);
    let headers = new HttpHeaders({
      'Authorization': 'Bearer [your_token]',
      'Content-Type': 'application/json'
    });

    let requestData = { 'model': 'gpt-3.5-turbo', 'messages': [{'role': 'user', 'content': text}]}

    this.http.post<any>('https://api.openai.com/v1/chat/completions', JSON.stringify(requestData),{headers: headers})
        .subscribe(data => {
          console.log(data);
          this.conversation = data.choices[0].message.content;
          this.textToVoice(this.conversation);
        });
  }

  textToVoice(text) {

  }

}
