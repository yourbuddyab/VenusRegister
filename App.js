import React, { Component } from 'react'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Home from './src/screens/Home';
import OTP from './src/screens/OTP';
import Splash from './src/screens/Splash';
import Login from './src/screens/Login';
import VersionCheck from 'react-native-version-check';
import { Alert, BackHandler, Linking } from 'react-native';

export default class App extends Component {


  componentDidMount() {
    this.checkUpdateNeeded();
  }

  checkUpdateNeeded = async () => {
    try {
      let updateNeeded = await VersionCheck.needUpdate();
      if (updateNeeded.isNeeded) {
        Alert.alert(
          'Please Update',
          'You will have to update your app to the latest version to continue using,',
          [
            {
              text: 'Update',
              onPress: () => {
                BackHandler.exitApp();
                Linking.openURL(updateNeeded.storeUrl);
              },
            },
          ],
          { cancelable: false },
        )
      }
    } catch (error) {
      console.log(error)
    }
  }



  render() {
    const Stack = createStackNavigator()
    return (
      <NavigationContainer>
        <Stack.Navigator headerMode="none" initialRouteName="Splash">
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="OTP" component={OTP} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

