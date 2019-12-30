import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AccessProviders } from "src/app/providors/access-providers";
import {
  ToastController,
  LoadingController,
  NavController,
  AlertController
} from "@ionic/angular";
import { Storage } from "@ionic/storage";

@Component({
  selector: "app-questions",
  templateUrl: "./questions.page.html",
  styleUrls: ["./questions.page.scss"]
})
export class QuestionsPage implements OnInit {
  datastorage: any;
  user_id: string;

  hasCode: boolean = false;
  showVideoCard: boolean = false;
  codeTyped: string = "";
  choices: any = [];
  question = {
    question_id: "",
    img_url: "",
    video_url: "",
    text: "",
    created_at: ""
  };
  answerDisabled: boolean = false;
  chosen_choice_id: string;
  // choice = {
  //   choice_id: '',
  //   img_url: '',
  //   text: ''
  // }
  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private accsPrvds: AccessProviders,
    private storage: Storage,
    public navCtrl: NavController
  ) {}

  ngOnInit() {}
  ionViewDidEnter() {
    this.storage.get("storage_xxx").then(res => {
      console.log(res);
      this.datastorage = res;
      this.user_id = this.datastorage.id_user;
      console.log("the user id is", this.user_id);
    });
  }
  showQuestionCard() {
    this.showVideoCard = false;
  }
  async getQuestion() {
    if (this.codeTyped == "") {
      this.presentToast("Code is required.");
    } else {
      console.log(this.codeTyped);

      const loader = await this.loadingCtrl.create({
        message: "Please wait........"
      });
      loader.present();

      return new Promise(resolve => {
        let body = {
          aksi: "get_question",
          code: this.codeTyped,
          user_id: this.user_id
        };

        this.accsPrvds.postData(body, "proses_api.php").subscribe(
          (res: any) => {
            console.log(res.success);
            console.log(res.result);
            if (res.success == true) {
              loader.dismiss();

              // this.showQuestion();

              this.question.img_url = res.result.question.img_url;
              this.question.video_url = res.result.question.video_url;
              if (this.question.video_url) {
                this.showVideoCard = true;
              }
              this.question.text = res.result.question.text;
              this.question.question_id = res.result.question.question_id;
              this.choices = res.result.choices;
              this.hasCode = true;

              // this.presentToast('Login successfuly');
              // this.storage.set('storage_xxx', res.result); // create storage session
              // this.navCtrl.navigateRoot(['/home']);
            } else {
              loader.dismiss();
              this.presentToast("Code may already be used or incorrect.");
              // this.presentToastWithOptions('Email or password is incorrect');
            }
          },
          err => {
            loader.dismiss();
            this.presentToast("Timeout");
            console.log(err);
          }
        );
      });
    }
  }

  async presentToast(a) {
    const toast = await this.toastCtrl.create({
      message: a,
      duration: 1500
    });
    toast.present();
  }

  onAnswer() {
    console.log(this.chosen_choice_id);
    this.tryAnswer();
  }

  async tryAnswer() {
    if (this.chosen_choice_id == "" || this.chosen_choice_id == undefined) {
      this.presentToast("Please choose an answer");
    } else {
      this.answerDisabled = true;
      console.log(this.chosen_choice_id);

      const loader = await this.loadingCtrl.create({
        message: "Please wait........"
      });
      loader.present();

      return new Promise(resolve => {
        let body = {
          aksi: "proses_answer",
          choice_id: this.chosen_choice_id,
          user_id: this.user_id,
          question_id: this.question.question_id
          // email: this.email,
          // password: this.password
        };

        this.accsPrvds.postData(body, "proses_api.php").subscribe(
          (res: any) => {
            console.log(res.success);
            console.log(res.result);
            if (res.success == true) {
              loader.dismiss();

              // this.showQuestion();

              // this.question.img_url = res.result.question.img_url;
              // this.question.text = res.result.question.text;
              // this.choices = res.result.choices;
              // this.hasCode = true;
              this.presentAlert("Saved!", "", res.msg);
              //  this.presentToast(res.msg);
              // this.storage.set('storage_xxx', res.result); // create storage session
            } else {
              loader.dismiss();
              this.presentToast(res.msg);
              this.answerDisabled = false;
              // this.presentToast(res.msg);
              // this.presentToastWithOptions('Email or password is incorrect');
            }
          },
          err => {
            loader.dismiss();
            this.presentToast("Timeout");
            this.answerDisabled = false;
            console.log(err);
          }
        );
      });
    }
  }

  async presentAlert(header, subheader, msg) {
    const alert = await this.alertCtrl.create({
      header: header,
      subHeader: subheader,
      message: msg,
      buttons: [
        {
          text: "Ok",
          handler: () => {
            this.navCtrl.navigateRoot(["/home"]);
          }
        }
      ]
    });

    await alert.present();
  }
  // sanitize(link){
  //   return this.dom.bypassSecurityTrustResourceUrl(link);
  // }
}
