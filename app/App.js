import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Navigator,
    AsyncStorage,
    BackAndroid,
    Platform,
    Alert
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as GlobalActions from './actions/globalActions';

import Login from './containers/Login';
import Home from './containers/Home';
import EditProfile from './containers/edit/EditProfile';

import NavBar from './components/Navbar';
import Loading from './components/Loading';


var navigator;

BackAndroid.addEventListener('hardwareBackPress', () => {
    if (navigator && navigator.getCurrentRoutes().length > 1) {
        navigator.pop();
        return true;
    }
    return false;
});

const App = React.createClass({

    getInitialState: function () {
        return {
            splashArt: true
        };
    },

    _renderScene: function (route, nav) {
        var SceneComponent = route.component;
        switch (route.name) {
            // case 'Home':
            //     return <SceneComponent navigator={ nav } route={route} {...route.passProps}
            //                            openModal={this.openSearchModal}/>;
            default :
                return <SceneComponent navigator={ nav } route={route} {...route.passProps}/>;

        }

    },

    itemChangedFocus(route) {
        this.props.actions.setActiveRoute(route.name);
    },

    componentDidUpdate(prevProps, prevState) {
        if (this.props.Error) {
            const Error = JSON.parse(this.props.Error);
            Alert.alert(
                Error.title,
                Error.text,
                [
                    {text: 'OK', onPress: () => this.props.actions.clearAPIError()},
                ]
            );
        }
    },

    componentWillMount() {
        // AsyncStorage.removeItem('USER_TOKEN');
        AsyncStorage.getItem('USER_TOKEN', (err, result) => {
            if (result) {
                this.props.actions.setTokenInRedux(result);
            }
            this.setState({splashArt: false});
        });
    },

    // openSearchModal() {
    //     this.refs.search_modal.open();
    // },
    //
    // closeSearchModal() {
    //     this.refs.search_modal.close();
    // },

// <Modal style={[styles.modal]} backdrop={false} ref={"search_modal"}
//        swipeToClose={false}>
//     <SearchModal closeModal={this.closeSearchModal}
//                  RequestUser={this.props.RequestUser}
//                  updateAvailability={this.props.actions.updateAvailability}
//                  createRequest={this.props.actions.createRequest}/>
// </Modal>

    render() {
        if (!this.state.splashArt) {
            if (this.props.UserToken) {
                let initRoute = {component: EditProfile, name: 'EditProfile'};
                let navbar = null;
                if (this.props.RequestUser && this.props.RequestUser.profile.completed) {
                    const user = this.props.RequestUser;
                    initRoute = {component: Home, name: 'Home'};
                    navbar = <NavBar activeRoute={this.props.Route} // openModal={this.openSearchModal}
                                     RequestUser={this.props.RequestUser}
                                     checkInColor="red"/>;
                }
                return (
                    <View style={styles.container}>
                        <Navigator initialRoute={initRoute}
                                   ref={(nav) => {
                                       navigator = nav
                                   }}
                                   renderScene={ this._renderScene }
                                   onDidFocus={this.itemChangedFocus}
                                   navigationBar={navbar}
                        />
                    </View>
                );

            }
            return (
                <View style={styles.container}>
                    <Login login={this.props.actions.login}
                           resetPassword={this.props.actions.resetPassword}
                           register={this.props.actions.register}
                           error={this.props.Error}/>
                </View>
            );
        }
        // Should replace this with a splash art.
        return <Loading />;
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: (Platform.OS === 'ios') ? 20 : 0
    },
    modal: {
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
    },
});

const stateToProps = (state) => {
    return state.Global;
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(GlobalActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(App);
