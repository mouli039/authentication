import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

interface IProps {
  navigation?: {
    navigate: (arg: string) => void;
  };
  route?: {
    params: {
      userDetails: {
        email: string;
        name: string;
      };
      data: string;
    };
  };
}
interface IState {}

export class LoginPage extends Component<IProps, IState> {
  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.props.navigation!.navigate('LoginPage');
    } catch (error) {
      console.error(error);
    }
  };

  logOut = () => {
    auth()
      .signOut()
      .then(() => this.props.navigation?.navigate('LoginPage'));
    this.signOut();
  };

  render() {
    console.log('params',this.props.route?.params)
    const {userDetails,data} = this.props.route!.params;
    const currentTime = new Date();
    const time = currentTime.toTimeString();
    return (
      <View style={styles.logOutCont}>
        <StatusBar backgroundColor={'transparent'} translucent={false} />
        <View>
          <Text style={styles.welcomeText}>
            Welcome <Text>{userDetails?.name}!</Text>
          </Text>
          <View style={styles.dashboard}>
            <View>
              <Text style={styles.nameText}>{userDetails.email}</Text>
              <Text>Login at :{time}</Text>
            </View>
            {/* <View style={styles.imageContainer}>
              <Image
                source={{uri: `${userData?.photo}`}}
                style={styles.imageStyles}
              />
            </View> */}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={data === 'google' ? this.signOut : this.logOut}
              style={styles.button}>
              {data === 'google' ? (
                <Text style={styles.logoutText}>SignOut</Text>
              ) : (
                <Text style={styles.logoutText}>Logout</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'blue',
    textAlign: 'center',
    borderRadius: hp('1'),
  },

  logoutText: {
    color: '#fff',
    fontSize: hp('2'),
    fontFamily: 'Roboto',
    fontWeight: '500',
    padding: hp('1.5'),
  },

  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('3'),
  },

  imageStyles: {
    borderRadius: hp('5'),
    width: hp('10'),
    height: hp('10'),
  },

  imageContainer: {
    borderRadius: hp('0.5'),
  },

  nameText: {
    fontSize: hp('2'),
    color: '#000',
    fontFamily: 'Roboto',
    fontWeight: '500',
  },
  welcomeText: {
    fontSize: hp('3'),
    color: '#000',
    fontFamily: 'Roboto',
    fontWeight: '500',
  },

  dashboard: {
    elevation: 5,
    backgroundColor: '#fff',
    padding: hp('1'),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  logOutCont: {
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});

export default LoginPage;
