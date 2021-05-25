import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Action, NgxsOnInit, Selector, State, StateContext, Store } from '@ngxs/store';
import firebase from 'firebase';
import { ChangeImage } from './image.actions';

export interface ImageInterface {
  imageName: string;
  index: number;
}

export interface ImageStateModel {
  image: ImageInterface;
}

function getImages(): string[] {
  return ['Divotkey.jpg', 'Dreiseitl.jpg', 'Haller.jpg', 'Volker.jpg'];
}

@State<ImageStateModel>({
  name: 'imageState',
  defaults: {
    image: {
      imageName: getImages()[0],
      index: 0,
    },
  },
})

@Injectable()
export class ImageState implements NgxsOnInit {

  constructor(private angularFireStore: AngularFirestore, private store: Store) {
  }
  // allows to easily access the users id
  @Selector()
  static currentImage(state: ImageStateModel): ImageInterface {
    return state.image;
  }

  static imageCount(state: ImageStateModel): number {
    return getImages().length;
  }

  ngxsOnInit(context?: StateContext<ImageStateModel>): void {
  }

  @Action(ChangeImage)
  changeImage(context: StateContext<ImageStateModel>, action: ChangeImage): void {
    let newIndex = this.store.selectSnapshot(ImageState.currentImage).index;
    if (newIndex
      < this.store.selectSnapshot(ImageState.imageCount) - 1) {
      newIndex++;
    } else {
      newIndex = 0;
    }
    context.patchState({
      image: {
        imageName: getImages()[newIndex],
        index: newIndex,
      }
    });
  }
}
