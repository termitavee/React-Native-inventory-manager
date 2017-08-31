import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import { Scene, Router, ActionConst } from 'react-native-router-flux';

import SplashScreen from './splash'
import MainScreen from './main'
import SearchScreen from './search'
import OptionsScreen from './options'
import DataTaker from './dataTaker'
import Inventory from './inventory'

export default class DtcInventario extends Component {

  render() {
    return (
      <Router >
        <Scene key="root" >
          <Scene key="splash" component={SplashScreen} initial="true" hideNavBar />
          <Scene key="main" component={MainScreen} type={ActionConst.REPLACE} />
          <Scene key="hojea" component={SearchScreen} type={ActionConst.PUSH} />
          <Scene key="configuration" component={OptionsScreen} type={ActionConst.PUSH} />
          <Scene key="tomador" component={DataTaker} type={ActionConst.PUSH} />
          <Scene key="listar" component={Inventory} type={ActionConst.PUSH} />
        </Scene>
      </Router>
    );
  }
}

AppRegistry.registerComponent('DtcInventario', () => DtcInventario);
