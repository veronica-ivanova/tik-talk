import {Component, inject, input, Renderer2} from '@angular/core';
import {AvatarCircleComponent} from '../../../common-ui/avatar-circle/avatar-circle.component';
import {ProfileService} from '../../../data/services/profile.service';
import {NgIf} from '@angular/common';
import {SvgIconComponent} from '../../../common-ui/svg-icon/svg-icon.component';
import {PostService} from '../../../data/services/post.service';
import {firstValueFrom} from 'rxjs';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-post-input',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    NgIf,
    SvgIconComponent,
    FormsModule
  ],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss'
})
export class PostInputComponent {
  r2 = inject(Renderer2)
  postService = inject(PostService);
  isCommentInput = input(false)
  postId = input<number>(0)
  profile = inject(ProfileService).me;
  postText = ''

  onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;

    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

 onCreatePost(){
    if (!this.postText) return

   if (this.isCommentInput()) {
     firstValueFrom(this.postService.createComment({
       text: this.postText,
       authorId: this.profile()!.id,
       postId: this.postId()
     })).then(() => {
       this.postText = '';
     })
     return
   }

    firstValueFrom(this.postService.createPost({
      title: 'Пост',
      content: this.postText,
      authorId: this.profile()!.id
    })).then(() => {
      this.postText = '';
    })
  }
}
