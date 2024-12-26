import {action, makeAutoObservable, observable} from 'mobx';
import {makePersistable} from 'mobx-persist-store';
import {getDashboard} from '../api/user';

export default class DashboardStore {
  @observable data = null;

  constructor() {
    makeAutoObservable(this);

    makePersistable(this, {
      name: 'dashboardStore',
      properties: [''],
    });
  }

  @action fetchDashboardData = async () => {
    try {
      const data = await getDashboard();
      if (data.success) {
        this.data = data.data;
      } else {
        console.error('Dashboard data fetch failed:', data.message);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };
}
