import { ChangeDetectorRef, Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NewMessage } from 'src/app/shared/interfaces/discussion/new-message';
import { MatCardModule } from '@angular/material/card';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-new-message-input',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule,MatIconModule, NgOptimizedImage],
  templateUrl: './new-message-input.component.html',
  styleUrls: ['./new-message-input.component.scss']
})
export class NewMessageInputComponent {
  @ViewChild('fileUpload') fileUpload: HTMLInputElement;
  @Output() newMessageSend = new EventEmitter<NewMessage>()
  private cd = inject(ChangeDetectorRef)
  messageText = new FormControl('', [Validators.required, Validators.maxLength(300)])
  image: File | undefined;
  imageSrc: string | undefined;
  onImageChange(event: any){
    const reader = new FileReader()
    this.image = event.target.files[0];
    reader.onload = (e: any) => {
      this.imageSrc = e.target.result
      this.cd.detectChanges()
    }
    reader.readAsDataURL(event.target.files[0]);
  }
  remove(){
    this.image = undefined;
  }
  submit(){
    if(this.messageText.valid && this.messageText.dirty){
      const newMessage: NewMessage = {
        content: this.messageText.value!,
        image: this.image,
        imageSrc: this.imageSrc
      }
      this.newMessageSend.emit(newMessage)
      this.messageText.reset()
      this.imageSrc = undefined
      this.image = undefined
    }
  }
}
