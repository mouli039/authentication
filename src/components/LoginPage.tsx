import React, {Component} from 'react';

import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  LogBox,
  Switch,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';

import BottomSheet, {TouchableOpacity} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import {AuthContext} from '../context/AuthContext';

interface IProps {
  navigation?: {
    push: (arg: string, arg1: {userDetails: any; data: string}) => void;
  };
}
interface IState {
  nameInput: string;
  emailInput: string;
  passwordInput: string;
  login: boolean;
}

interface Context {
  data: {
    check: boolean;
    emailInput: string;
    passwordInput: string;
    signCheck: number;
    isEnabled: boolean;
  };
  checkPassword: () => void;
  emailChange: (text: string) => void;
  passwordChange: (text: string) => void;
  checkValue: (index: number) => void;
  toggleSwitch: () => void;
}

class LandingScreen extends Component<IProps, IState> {
  static contextType: React.Context<any> | undefined = AuthContext;
  declare context: React.ContextType<typeof AuthContext>;

  state: IState = {
    nameInput: '',
    emailInput: '',
    passwordInput: '',
    login: true,
  };

  componentDidMount(): void {
    auth().onAuthStateChanged(async (user: any) => {
      if (user) {
        this.props.navigation?.push('Dashboard', {
          userDetails: user,
          data: 'login',
        });
      }

      GoogleSignin.configure({});
      try {
        await GoogleSignin.hasPlayServices();
        const user = await GoogleSignin.getCurrentUser();
        const userInfo = user?.user;
        if (userInfo) {
          this.props.navigation?.push('Dashboard', {
            userDetails: userInfo,
            data: 'google',
          });
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  onLoginFacebook = async () => {
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      console.log('User cancelled the login process');
    }

    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      console.log('Something went wrong obtaining access token');
    }

    if (data !== null) {
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken,
      );

      const face = auth().signInWithCredential(facebookCredential);
    }
  };

  onLogin = async (emailInput: string, passwordInput: string) => {
    if (emailInput && passwordInput !== '') {
      auth()
        .signInWithEmailAndPassword(emailInput, passwordInput)
        .then((user: any) => {
          console.log(user);
          const userInfo = user.user;
          this.props.navigation?.push('Dashboard', {
            userDetails: userInfo,
            data: 'login',
          });
          this.setState({emailInput: '', passwordInput: ''});
        })
        .catch(error => {
          console.log(error);
          this.setState({emailInput: '', passwordInput: ''});
        });
    } else {
      Alert.alert('Invalid details');
    }
  };

  goToSigIn = async () => {
    GoogleSignin.configure({});
    try {
      await GoogleSignin.hasPlayServices();
      const user: any = await GoogleSignin.signIn();
      const userInfo = user.user;
      this.props.navigation?.push('Dashboard', {
        userDetails: userInfo,
        data: 'google',
      });
    } catch (error) {
      console.log(error);
    }
  };

  onEmailChange = (text: string) => {
    this.setState({emailInput: text});
  };

  onNameChange = (text: string) => {
    this.setState({nameInput: text});
  };

  onPasswordChange = (text: string) => {
    this.setState({passwordInput: text});
  };

  ChangeLogin = () => {
    this.setState({
      login: !this.state.login,
      emailInput: '',
      passwordInput: '',
    });
  };

  toRegister = () => {
    const {nameInput, emailInput, passwordInput} = this.state;

    if (emailInput && passwordInput !== '') {
      auth()
        .createUserWithEmailAndPassword(emailInput, passwordInput)
        .then((user: any) => {
          if (user) {
            auth().currentUser?.updateProfile({
              displayName: nameInput,
            });
          }
          const userInfo = user.user;
          this.props.navigation?.push('Dashboard', {
            userDetails: userInfo,
            data: 'login',
          });
          this.setState({emailInput: '', passwordInput: ''});
        })
        .catch(error => {
          console.log(error);
          this.setState({emailInput: '', passwordInput: ''});
        });
    } else {
      Alert.alert('Invalid details');
    }
  };

  render() {
    const myContext: Context = this.context as Context;
    const {login} = this.state;
    LogBox.ignoreLogs([
      'Non-serializable values were found in the navigation state',
    ]);
    const {toggleSwitch, data} = myContext;
    const {isEnabled} = data;
    return (
      <GestureHandlerRootView style={styles.appContainer}>
        <KeyboardAvoidingView style={styles.appContainer}>
          <StatusBar
            backgroundColor={'transparent'}
            translucent
            barStyle={!isEnabled ? 'light-content' : 'dark-content'}
          />
          <ImageBackground
            style={styles.backImage}
            source={require('../assets/bgImg.png')}
            resizeMode="cover">
            <Switch
              trackColor={{false: '#767577', true: '#888888'}}
              thumbColor={isEnabled ? '#121515' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
              style={styles.switch}
            />
            <Text style={styles.heading}>Herbalova</Text>
          </ImageBackground>
          <BottomSheet
            backgroundStyle={{backgroundColor: 'transparent'}}
            handleIndicatorStyle={{
              backgroundColor: !isEnabled ? 'white' : 'black',
              width: wp('13%'),
            }}
            onChange={index => myContext.checkValue(index)}
            snapPoints={['10%', '85%']}>
            {login === true ? (
              <View>
                {myContext.data.signCheck === 0 && (
                  <View
                    style={[
                      styles.signContainer,
                      {backgroundColor: !isEnabled ? 'white' : 'black'},
                    ]}>
                    <Text
                      style={[
                        styles.signText,
                        {color: isEnabled ? '#fff' : 'black'},
                      ]}>
                      Sign to your account
                    </Text>
                  </View>
                )}
                {!isEnabled ? (
                  <View style={styles.loginContainer}>
                    <View style={styles.loginHeading}>
                      <Text style={styles.loginText}>Login</Text>
                      <Text style={styles.signLabelText}>
                        Sign to your account{' '}
                      </Text>
                    </View>
                    <View style={styles.inputContainer}>
                      <View>
                        <Text style={styles.label}>YOUR EMAIL</Text>
                        <TextInput
                          value={this.state.emailInput}
                          style={styles.emailInput}
                          placeholder="Email"
                          onChangeText={text => this.onEmailChange(text)}
                        />
                      </View>
                      <View style={styles.passwordBox}>
                        <Text style={styles.label}>PASSWORD</Text>
                        <View style={styles.passwordContainer}>
                          <TextInput
                            value={this.state.passwordInput}
                            style={styles.passwordInput}
                            placeholder="Password"
                            secureTextEntry={!myContext.data.check}
                            onChangeText={text => this.onPasswordChange(text)}
                          />
                          <TouchableOpacity onPress={myContext.checkPassword}>
                            <Feather
                              name={myContext.data.check ? 'eye' : 'eye-off'}
                              color={'#1A1E1E'}
                              size={hp('3%')}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <Text style={styles.forgotText}>Forgot Password?</Text>
                      <View style={styles.partnersContainer}>
                        <TouchableOpacity
                          style={styles.partnerImage}
                          onPress={this.onLoginFacebook}>
                          <Image
                            style={styles.googleImage}
                            source={require('../assets/facebookIcon.png')}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.goToSigIn}>
                          <Image
                            style={styles.googleImage}
                            source={require('../assets/googleIcon.png')}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.noAccountContainer}>
                        <Text
                          style={styles.noAccountText}
                          onPress={this.ChangeLogin}>
                          I don't have account
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.RloginContainer}>
                    <View style={styles.RloginHeading}>
                      <Text style={styles.RloginText}>Login</Text>
                      <Text style={styles.RsignLabelText}>
                        Sign to your account{' '}
                      </Text>
                    </View>
                    <View style={styles.RinputContainer}>
                      <View>
                        <Text style={styles.Rlabel}>YOUR EMAIL</Text>
                        <TextInput
                          value={this.state.emailInput}
                          style={styles.RemailInput}
                          placeholder="Email"
                          placeholderTextColor={'white'}
                          onChangeText={text => this.onEmailChange(text)}
                        />
                      </View>
                      <View style={styles.RpasswordBox}>
                        <Text style={styles.Rlabel}>PASSWORD</Text>
                        <View style={styles.RpasswordContainer}>
                          <TextInput
                            value={this.state.passwordInput}
                            style={styles.RpasswordInput}
                            placeholder="Password"
                            placeholderTextColor={'white'}
                            secureTextEntry={!myContext.data.check}
                            onChangeText={text => this.onPasswordChange(text)}
                          />
                          <TouchableOpacity onPress={myContext.checkPassword}>
                            <Feather
                              name={myContext.data.check ? 'eye' : 'eye-off'}
                              color={'#1A1E1E'}
                              size={hp('3%')}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <Text style={styles.RforgotText}>Forgot Password?</Text>
                      <View style={styles.RpartnersContainer}>
                        <TouchableOpacity
                          style={styles.RpartnerImage}
                          onPress={this.onLoginFacebook}>
                          <Image
                            style={styles.RgoogleImage}
                            source={require('../assets/facebookIcon.png')}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.goToSigIn}>
                          <Image
                            style={styles.RgoogleImage}
                            source={require('../assets/googleIcon.png')}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.RnoAccountContainer}>
                        <Text
                          style={styles.RnoAccountText}
                          onPress={this.ChangeLogin}>
                          I don't have account
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.loginButtonContainer}
                  onPress={() =>
                    this.onLogin(
                      this.state.emailInput,
                      this.state.passwordInput,
                    )
                  }>
                  <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <View style={styles.RloginContainer}>
                  <View style={styles.RloginHeading}>
                    <Text style={styles.RloginText}>Register</Text>
                    <Text style={styles.RsignLabelText}>
                      create your account{' '}
                    </Text>
                  </View>
                  <View style={styles.RinputContainer}>
                    <View>
                      <Text style={styles.Rlabel}>YOUR NAME</Text>
                      <TextInput
                        value={this.state.nameInput}
                        style={styles.RemailInput}
                        placeholder="Enter your name"
                        placeholderTextColor={'white'}
                        onChangeText={text => this.onNameChange(text)}
                      />
                    </View>
                    <View>
                      <Text style={styles.Rlabel}>YOUR EMAIL</Text>
                      <TextInput
                        value={this.state.emailInput}
                        style={styles.RemailInput}
                        placeholder="Email"
                        placeholderTextColor={'white'}
                        onChangeText={text => this.onEmailChange(text)}
                      />
                    </View>
                    <View style={styles.RpasswordBox}>
                      <Text style={styles.Rlabel}>PASSWORD</Text>
                      <View style={styles.RpasswordContainer}>
                        <TextInput
                          value={this.state.passwordInput}
                          style={styles.RpasswordInput}
                          placeholder="Password"
                          placeholderTextColor={'white'}
                          secureTextEntry={!myContext.data.check}
                          onChangeText={text => this.onPasswordChange(text)}
                        />
                        <TouchableOpacity onPress={myContext.checkPassword}>
                          <Feather
                            name={myContext.data.check ? 'eye' : 'eye-off'}
                            color={'white'}
                            size={hp('3%')}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.RnoAccountContainer}>
                      <Text
                        style={styles.RnoAccountText}
                        onPress={this.ChangeLogin}>
                        I have an account
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.RloginButtonContainer}
                  onPress={this.toRegister}>
                  <Text style={styles.RloginButtonText}>Register</Text>
                </TouchableOpacity>
              </View>
            )}
          </BottomSheet>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    );
  }
}

export default LandingScreen;

const styles = StyleSheet.create({
  switch: {
    bottom: '40%',
    left: '40%',
  },
  passwordBox: {
    height: hp('10'),
    justifyContent: 'space-between',
  },
  loginHeading: {
    height: hp('7'),
    justifyContent: 'space-between',
  },
  appContainer: {
    flex: 1,
  },
  backImage: {
    height: hp('100%'),
    width: wp('100%'),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    color: '#ffffff',
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: hp('5%'),
    // fontWeight: '800',
  },
  signContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: wp('100%'),
    height: hp('8%'),
    textAlign: 'center',
  },
  signText: {
    color: '#121515',
    fontFamily: 'Playfair Display',
    fontSize: hp('2%'),
    fontWeight: '800',
  },
  loginContainer: {
    padding: hp('5%'),
    height: hp('78.2%'),
    backgroundColor: '#fff',
  },
  loginText: {
    color: '#121515',
    fontFamily: 'Playfair Display',
    fontSize: hp('3%'),
    fontWeight: '800',
  },
  signLabelText: {
    color: '#888888',
    fontFamily: 'Playfair Display',
    fontSize: hp('2%'),
    fontWeight: '800',
  },
  inputContainer: {
    marginTop: hp('5%'),
    height: hp('59'),
    justifyContent: 'space-around',
  },
  label: {
    color: '#888888',
    letterSpacing: wp('0.4%'),
    fontFamily: 'Playfair Display',
    fontSize: hp('1.7%'),
    fontWeight: '500',
  },
  emailInput: {
    color: '#121515',
    height: hp('6.5%'),
    backgroundColor: '#F9FAFB',
    elevation: 1,
    paddingLeft: hp('2%'),
    marginTop: hp('1%'),
    marginBottom: hp('2%'),
  },
  passwordContainer: {
    height: hp('6.5%'),
    backgroundColor: '#F9FAFB',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    marginTop: hp('1%'),
  },
  passwordInput: {
    width: wp('70%'),
    paddingLeft: hp('2%'),
  },
  forgotText: {
    color: '#121515',
    fontFamily: 'Playfair Display',
    fontSize: hp('2.1%'),
    fontWeight: '800',
  },
  partnersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('3%'),
  },
  partnerImage: {
    marginRight: wp('2%'),
  },
  googleImage: {
    height: hp('9%'),
    width: wp('20%'),
  },
  noAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAccountText: {
    color: '#121515',
    fontFamily: 'Playfair Display',
    fontSize: hp('2.1%'),
    fontWeight: '800',
  },
  loginButtonContainer: {
    backgroundColor: '#19A54A',
    height: hp('8%'),
    width: wp('100%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Playfair Display',
    fontSize: hp('2.1%'),
    fontWeight: '800',
  },
  RpasswordBox: {
    height: hp('10'),
    justifyContent: 'space-between',
  },
  RloginHeading: {
    height: hp('7'),
    justifyContent: 'space-between',
  },
  RsignContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: wp('100%'),
    height: hp('8%'),
    textAlign: 'center',
  },
  RsignText: {
    color: '#121515',
    fontFamily: 'Playfair Display',
    fontSize: hp('2%'),
    fontWeight: '800',
  },
  RloginContainer: {
    padding: hp('5%'),
    height: hp('78.2%'),
    backgroundColor: '#121515',
  },
  RloginText: {
    color: 'white',
    fontFamily: 'Playfair Display',
    fontSize: hp('3%'),
    fontWeight: '800',
  },
  RsignLabelText: {
    color: '#888888',
    fontFamily: 'Playfair Display',
    fontSize: hp('2%'),
    fontWeight: '800',
  },
  RinputContainer: {
    marginTop: hp('5%'),
    height: hp('59'),
    justifyContent: 'space-around',
  },
  Rlabel: {
    color: '#888888',
    letterSpacing: wp('0.4%'),
    fontFamily: 'Playfair Display',
    fontSize: hp('1.7%'),
    fontWeight: '500',
  },
  RemailInput: {
    color: 'white',
    height: hp('6.5%'),
    backgroundColor: '#1A1E1E',
    elevation: 1,
    paddingLeft: hp('2%'),
    marginTop: hp('1%'),
    marginBottom: hp('2%'),
  },
  RpasswordContainer: {
    height: hp('6.5%'),
    backgroundColor: '#1A1E1E',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    marginTop: hp('1%'),
  },
  RpasswordInput: {
    width: wp('70%'),
    paddingLeft: hp('2%'),
    color: 'white',
  },
  RforgotText: {
    color: '#121515',
    fontFamily: 'Playfair Display',
    fontSize: hp('2.1%'),
    fontWeight: '800',
  },
  RpartnersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('3%'),
  },
  RpartnerImage: {
    marginRight: wp('2%'),
  },
  RgoogleImage: {
    height: hp('9%'),
    width: wp('20%'),
  },
  RnoAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  RnoAccountText: {
    color: 'white',
    fontFamily: 'Playfair Display',
    fontSize: hp('2.1%'),
    fontWeight: '800',
  },
  RloginButtonContainer: {
    backgroundColor: '#19A54A',
    height: hp('8%'),
    width: wp('100%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  RloginButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Playfair Display',
    fontSize: hp('2.1%'),
    fontWeight: '800',
  },
});
