import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { AuthService } from 'src/app/shared/services/Auth.service';
import { Post } from 'src/app/_models/post';
import { Url } from 'src/app/_models/url';
import { PostService } from 'src/app/_services/post.service';
import { UploadService } from 'src/app/_services/upload.service';

// template
import { FormComponent } from '../../form/form.component';

@Component({
  selector: 'app-postDialog',
  templateUrl: './postDialog.component.html',
  styleUrls: ['./postDialog.component.scss']
})
export class PostDialogComponent extends FormComponent implements OnInit {

  // view child
  @ViewChild('postImgFileUpload') postImgFileUpload: FileUpload;

  // output
  @Output() postHasBeenUploaded = new EventEmitter<Post>();

  constructor(
    formBuilder: FormBuilder,
    authService: AuthService,
    private postService: PostService,
    private uploadService: UploadService,
    private cd: ChangeDetectorRef
  ) {
    super(formBuilder, authService);
    super.formCheckout = this.formBuilder.group({
      imgUrl: new FormControl(),
      post: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
  }

  /**
   * overrided send data
   */
  protected sendData(): void {
    console.log('postDialog sending data...');
    
    let post: Post = new Post();
    post.Content = this.formCheckout.controls.post.value;
    post.ImgUrl = this.formCheckout.controls.imgUrl.value;

    this.postService.postWithHeader<Post>(
      post, 
      { 'userData': JSON.stringify(this.authService.getUserData()) })
      .subscribe(p => {
        // clear data..
        this.clearData();
        p.UserDisplayName = this.authService.getUserData().displayName;
        if (this.postHasBeenUploaded.observers.length > 0) {
          console.log(p);
          this.postHasBeenUploaded.emit(p);
        }
      }, err => {
        console.log(err);
      }
    );
  }

  /**
   * Clear form data
   */
  private clearData(): void {
    this.formCheckout.controls.post.setValue(null);
    this.formCheckout.controls.imgUrl.setValue(null);
  }

  public emptyUploadedFiles(): void {
    this.formCheckout.controls.imgUrl.setValue(null);
  }

  /**
   * On file selected
   */
  public onFileChange(event: any): void {
    console.log('to upload: ', this.postImgFileUpload.files);

    if(this.postImgFileUpload.files.length === 0) return;

    let formData: FormData = this.buildFormData(this.postImgFileUpload.files[0]);

    this.uploadService.upload<Url>(formData).subscribe(u => {
      console.log('url', u);
      this.postImgFileUpload.files = [];
      console.log(this.postImgFileUpload);
      this.formCheckout.controls.imgUrl.setValue(u.value);
      this.postImgFileUpload.cd.detectChanges();
    }, 
    err => {
      console.log(err);
      this.postImgFileUpload.files = [];
    });
  }

  /**
   * build a form data with url to upload
   */
  private buildFormData(file: File): FormData {
    let formData: FormData = new FormData();

    formData.append('fileToUpload', file, file.name);
    return formData;
  }
}
