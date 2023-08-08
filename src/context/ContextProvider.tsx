import React, {Component} from 'react';
import {AuthContext} from './AuthContext';

interface IProps {
  children: any
}

interface IState {
  check: boolean;
  signCheck: number;
  loginDeails: any;
  isEnabled:boolean
}

class ContextProvider extends Component<IProps, IState> {
  state: IState = {
    check: false,
    signCheck: 0,
    isEnabled:false,
    loginDeails: {},
  };

  onCheckPassword = () => {
    this.setState(prev => ({check: !prev.check}));
  };

  changeText = (index: number) => {
    this.setState({signCheck: index});
  };


  toggleSwitch = () => {
    this.setState({isEnabled:!this.state.isEnabled})
  }

  render() {
    
    return (
      <AuthContext.Provider
        value={{
          data: this.state,
          checkPassword: this.onCheckPassword,
          checkValue: this.changeText,
          toggleSwitch:this.toggleSwitch
        }}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export default ContextProvider;
