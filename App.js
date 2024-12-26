import {inject, observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import AppNavigation from './src/navigation/AppNavigation';
import {handleLocationPermissions} from './src/utils/permission';

const App = inject('app')(
  observer(({app}) => {
    useEffect(() => {
      handleLocationPermissions().then(result => {
        app.locationPermission = result;
      });
    }, []);

    return <AppNavigation />;
  }),
);
export default App;
