import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheet } from 'ionic-angular';
import { Dish } from '../../shared/dish';
import { Comment } from '../../shared/comment';
import { FavoriteProvider } from '../../providers/favorite/favorite';
import { ActionSheetController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';

import { CommentPage } from '../comment/comment';
import { Nav, Platform } from 'ionic-angular';



/**
 * Generated class for the DishdetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-dishdetail',
  templateUrl: 'dishdetail.html',
})
export class DishdetailPage {
  dish: Dish;
  errMess: string;
  avgstars: string;
  numcomments: number;
  favorite: boolean;
  actionSheet: ActionSheet;

 
  

  constructor(public navCtrl: NavController, public navParams: NavParams,
    @Inject('BaseURL') private BaseURL,
    private toastCtrl: ToastController,
    private favoriteservice: FavoriteProvider,
    private actionSheetController: ActionSheetController,
    public modalCtrl: ModalController,
    public platform: Platform) {
    this.dish = navParams.get('dish');
    this.favorite = favoriteservice.isFavorite(this.dish.id);
    this.numcomments = this.dish.comments.length;
    let total = 0;
    this.dish.comments.forEach(comment => total += comment.rating );
    this.avgstars = (total/this.numcomments).toFixed(2);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DishdetailPage');
  }

  addToFavorites() {
    console.log('Adding to Favorites', this.dish.id);
    this.favorite = this.favoriteservice.addFavorite(this.dish.id);
    this.toastCtrl.create({
      message: 'Dish ' + this.dish.id + ' added as favorite successfully',
      position: 'middle',
      duration: 3000}).present();
  }
  

  async openActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      title: 'Select Action',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Add to Favorites',
        icon: 'heart',
        handler: () => {
          console.log('Favorite dish');
          this.addToFavorites();
        }
      }, {
        text: 'Add a Comment',
        icon: 'create',
        handler: () => {
          console.log('Comment');
          this.openComment();
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel');
        }
      }]
    });
    await actionSheet.present();
  }

  openComment() {
    console.log("openComment()");
    let modal = this.modalCtrl.create(CommentPage);
    modal.onDidDismiss (data => {
      this.dish.comments.push(data);
    })
    modal.present();
  }

}
   
 
