import AppStore from './app';
import DashboardStore from './dashboard';

const stores = {};

export function createStores() {
  stores.dashboard = new DashboardStore();
  stores.app = new AppStore();

  // add here other stores as above

  return stores;
}

export async function initializeStores() {
  for (const name of Object.keys(stores)) {
    if (!stores[name].isReady) {
      stores[name].isReady = true;
    }
  }

  return stores;
}

export function destroyStores() {
  for (const name of Object.keys(stores)) {
    if (stores[name].isReady) {
      stores[name].isReady = false;
      stores[name].destroy && stores[name].destroy();
    }
  }
}
