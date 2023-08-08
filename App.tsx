import React, {Component} from 'react';
import LoginPage2 from './src/components/LoginPage2';
import ContextProvider from './src/context/ContextProvider';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Dashboard from './src/components/Dashboard';



const Stack = createStackNavigator();

export class App extends Component {

  render() {
    return (
      <ContextProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="LoginPage" component={LoginPage2} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
          </Stack.Navigator>
        </NavigationContainer>
      </ContextProvider>
    );
  }
}

export default App;
