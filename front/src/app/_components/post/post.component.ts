import { ChangeDetectorRef, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/shared/services/Auth.service';
import { Post } from 'src/app/_models/post';
import { SocketIoService } from 'src/app/_services/io.service';
import { PostService } from 'src/app/_services/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  // data
  public posts: Post[] = [];
  public postDialog: boolean = false;

  constructor(
    public authService: AuthService,
    private postService: PostService,
    private ioService: SocketIoService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.refeshPostList();

    // subscriptions
    this.subscribeToIoLikes();
    this.subscribeToIoUnLikes();
    this.subscribeToPosts();
    this.subscribeToPostDelete();
  }

  /**
   * broadcast likes to others
   * @param post the liked post
   */
  public broadcastLike(post: Post): void {
    this.ioService.sendLikeInformation(post);
  }

  /**
   * broadcast un likes to others
   * @param post the liked post
   */
  public broadcastUnLike(post: Post): void {
    this.ioService.sendUnLikeInformation(post);
  }

  /**
   * broadcast post to others
   * @param post the post
   */
  public broadcastPost(post: Post): void {
    this.ioService.sendPostInformation(post);
  }

  /**
   * 
   * @param post boadcast post  deletion
   */
  public broadcastDeleted(post: Post): void {
    this.ioService.sendPostDeleteInformation(post);
  }

  /**
   * Refresh posts list
   */
  public refeshPostList(post?: Post): void {
    // hide dialog
    if (this.postDialog) {
      this.postDialog = false;
    }

    if (post) {
      this.ioService.sendPostInformation(post);
    } else {
      this.queryPosts();
    }
  }

  /**
   * query posts to api
   */
  private queryPosts(): void {
    // reload data
    this.postService.getAllWithHeader<Post>(
      { 'userData': JSON.stringify(this.authService.getUserData()) }
      ).subscribe(posts => {
        this.posts = posts.sort((a, b) => new Date(a.UpdatedAt).getTime() - new Date(b.UpdatedAt).getTime());;
        this.posts.reverse();

        this.posts.map(p => p.Content = this.addUserNameToPostContent(p.Content, p.UserDisplayName));

        console.log('posts', posts);
        this.cd.markForCheck();
      },
      err => {
        console.log('get all posts error.', err);
      }
    );
  }

  /**
   * Add @Name to post contant 
   * @param content 
   * @param toAdd 
   */
  private addUserNameToPostContent(content: string, toAdd?: string): string {
    let split: string[] = content.split('<p>');
    let newContent: string = '';

    if(split.length > 1)
    {
      split[1] = toAdd ? `<b class="post-name">@${toAdd}</b>: ${split[1]}` : `<b>@unknown</b>: ${split[1]}`;
      split.forEach((s, i) => newContent += (i == 0) ? `${s}` : `<p>${s}`);
    } else {
      newContent = toAdd ? `<b class="post-name">@${toAdd}</b>: ${content}` : `<b>@unknown</b>: ${content}`;
    }
    return newContent;
  }



  /**
   * Subscribe to deleted posts
   */
  private subscribeToPostDelete(): void {
    this.ioService.getPostDelete()
    .subscribe((post: Post) => {
      const index = this.posts.findIndex(p => p.Id === post.Id);
      this.posts.splice(index, 1);
      this.cd.markForCheck();
    });
  }

  /**
   * Subscribe to posts
   */
  private subscribeToPosts(): void {
    this.ioService.getPost()
    .subscribe((post: Post) => {
      post.Content = this.addUserNameToPostContent(post.Content, post.UserDisplayName)
      post.likes = 0;
      this.posts.unshift(post);
      this.cd.markForCheck();
    });
  }

  /**
   * Subscribe to likes
   */
  private subscribeToIoLikes(): void {
    this.ioService.getLikes()
    .subscribe((post: Post) => {
      // --
      let selectedPost: Post = this.posts.find(p => p.Id === post.Id);
      if (selectedPost) {
        selectedPost.likes++;
      }
    });
  }

  /**
   * Subscibe to unlikes
   */
  private subscribeToIoUnLikes(): void {
    this.ioService.getUnLikes()
    .subscribe((post: Post) => {
      // --
      let selectedPost: Post = this.posts.find(p => p.Id === post.Id);
      if (selectedPost) {
        selectedPost.likes--;
      }
    });
  }
}
