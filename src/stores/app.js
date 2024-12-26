import {makeAutoObservable, observable} from 'mobx';
import {makePersistable} from 'mobx-persist-store';

export default class AppStore {
  @observable locationPermission = false;

  constructor() {
    makeAutoObservable(this);

    makePersistable(this, {
      name: 'dashboardStore',
      properties: ['locationPermission'],
    });
  }
}
