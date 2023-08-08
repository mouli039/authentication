import {Text, TouchableOpacity, View} from 'react-native';
import React, {Component} from 'react';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

export class GoogleAuth extends Component {
  onPressGoogle = async () => {
    try {
      const res1 = await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      console.log(res1);

      // Get the users ID token
      const {idToken} = await GoogleSignin.signIn();
      console.log(idToken);
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      console.log(googleCredential);
      // Sign-in the user with the credential
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.log('error===========', error);
    }
  };

  componentDidMount() {
    GoogleSignin.configure({
      webClientId:
        '703799486406-dvjiuh5qq6n2pebgcsdub3j45l31mkna.apps.googleusercontent.com',
    });
  }
  render() {
    return (
      <View style={{padding: 20}}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 28,
            fontWeight: 'bold',
            color: 'red',
          }}>
          GoogleAuth
        </Text>
        <TouchableOpacity
          onPress={this.onPressGoogle}
          style={{
            alignSelf: 'flex-start',
            backgroundColor: 'orange',
            paddingHorizontal: 20,
            paddingVertical: 5,
            borderRadius: 7,
          }}>
          <Text style={{color: 'red', fontSize: 16}}>Google</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default GoogleAuth;
