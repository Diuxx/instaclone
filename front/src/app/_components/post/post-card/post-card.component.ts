import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ViewEncapsulation } from '@angular/core'
import { AuthService } from 'src/app/shared/services/Auth.service';
import { Like } from 'src/app/_models/like';
import { Post } from 'src/app/_models/post';
import { LikeService } from 'src/app/_services/like.service';
import { PostService } from 'src/app/_services/post.service';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PostCardComponent implements OnInit {

  @Input() post: Post; // a post

  // variables
  private userdata: any = null;
  public deleteButtonDisplay: boolean = false;

  // output
  @Output() liked = new EventEmitter<Post>();
  @Output() unliked = new EventEmitter<Post>();
  @Output() deleted = new EventEmitter<Post>();

  constructor(
    private likeService: LikeService,
    private postService: PostService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.userdata = { 
      'userData': JSON.stringify(this.authService.getUserData()) 
    };
  }

  public isMyPost(): boolean {
    return this.post.CreatedBy === this.authService.getUserData().uid
  }

  /**
   * 
   */
  public deletePost(): void {
    console.log('delete post');
    this.postService.deleteWithHeader(this.post.Id, this.userdata)
    .subscribe(p => {
      if(this.deleted.observers.length > 0)
      {
        this.deleted.emit(this.post);
      }
    }, err => {
      console.log(err);
    });
  }

  /**
   * Like selected Post
   */
  public like(): void {
    let like: Like = {
      PostId: this.post.Id,
      FireBaseId: this.authService.getUserData().uid
    };

    // send liked
    this.likeService.postWithHeader<Like>(like, this.userdata)
    .subscribe(l => {
      this.post.didILikeIt = l.Id; // add like id
      // this.post.likes++; 
      // with socket i will recieve a broadcast and at this moment i will increment the likes

      if(this.liked.observers.length > 0)
      {
        this.liked.emit(this.post);
      }
    }, err => {
      console.log(err);
    });
  }

  /**
   * UnLike selected Post
   */
  public unlike(): void {
    if (!this.post.didILikeIt) {
      console.log('err, this post do not contain your like');
      return;
    }

    // remove like
    this.likeService.deleteWithHeader<Like>(this.post.didILikeIt, this.userdata)
    .subscribe(l => {
      this.post.didILikeIt = null;
      // this.post.likes--;
      // with socket i will recieve a broadcast and at this moment i will decrement the likes

      if(this.unliked.observers.length > 0)
      {
        this.unliked.emit(this.post);
      }
    }, err => {
      console.log(err);
    });
  }
}
