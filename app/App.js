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
import Modal from 'react-native-modalbox';

import * as GlobalActions from './actions/globalActions';
import {getRoute} from './routes';

import Login from './containers/Login';
import EditProfile from './containers/edit/EditProfile';

import CreateQuestionnaire from './containers/sub/CreateQuestionnaire';
import CreateWorkout from './containers/sub/CreateWorkout';

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
            splashArt: true,
            route: 'Home'
        };
    },

    _renderScene: function (route, nav) {
        var SceneComponent = route.component;
        switch (route.name) {
            case 'Home':
                return <SceneComponent navigator={ nav } route={route} {...route.passProps}
                                       openWorkoutModal={this.openWorkoutModal}/>;
            case 'Profile':
                return <SceneComponent navigator={ nav } route={route} {...route.passProps}
                                       openModal={this.openQuestionnaireModal}/>;
            default :
                return <SceneComponent navigator={ nav } route={route} {...route.passProps}/>;

        }

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
        // this.props.actions.removeToken();
        AsyncStorage.getItem('USER_TOKEN', (err, result) => {
            if (result) {
                this.props.actions.setTokenInRedux(result);
            }
            this.setState({splashArt: false});
        });
    },

    itemChangedFocus(route) {
        this.setState({route: route.name})
    },

    openQuestionnaireModal() {
        this.refs.questionnaire.open();
    },

    closeQuestionnaireModal() {
        this.refs.questionnaire.close();
    },

    openWorkoutModal() {
        this.refs.workout.open();
    },

    closeWorkoutModal() {
        this.refs.workout.close();
    },

    configureScene(route, routeStack) {
        switch (route.name) {
            case 'Home':
                return Navigator.SceneConfigs.PushFromRight;
            case 'Profile':
                return Navigator.SceneConfigs.PushFromRight;
            case 'Feed':
                if (routeStack[routeStack.length - 2].name == "Home" || routeStack[routeStack.length - 2].name == "Calendar")
                    return Navigator.SceneConfigs.PushFromRight;
                return Navigator.SceneConfigs.PushFromLeft;
            case 'Calendar':
                if (routeStack[routeStack.length - 2].name == "Home")
                    return Navigator.SceneConfigs.PushFromRight;
                return Navigator.SceneConfigs.PushFromLeft;
            case 'Chat':
                if (routeStack[routeStack.length - 2].name == "Profile")
                    return Navigator.SceneConfigs.PushFromLeft;
                return Navigator.SceneConfigs.PushFromRight;
            default :
                return Navigator.SceneConfigs.FloatFromRight

        }
    },

    render() {
        if (!this.state.splashArt) {
            if (this.props.UserToken) {
                if (!this.props.RequestUser) {
                    return <Loading />;
                }
                if (!this.props.RequestUser.profile.completed) {
                    return <EditProfile />;
                } else {
                    return (
                        <View style={styles.container}>
                            <Navigator initialRoute={getRoute('Home')}
                                       ref={(nav) => {
                                           navigator = nav
                                       }}
                                       configureScene={this.configureScene}
                                       onDidFocus={this.itemChangedFocus}
                                       renderScene={ this._renderScene }
                                       navigationBar={<NavBar RequestUser={this.props.RequestUser}
                                                              route={this.state.route}/>}
                            />
                            <Modal style={[styles.modal]} backdrop={false} ref={"questionnaire"}
                                   swipeToClose={false}>
                                <CreateQuestionnaire closeQuestionnaireModal={this.closeQuestionnaireModal}
                                                     createQuestionnaire={this.props.actions.createQuestionnaire}/>
                            </Modal>
                            <Modal style={[styles.modal]} backdrop={false} ref={"workout"}
                                   swipeToClose={false}>
                                <CreateWorkout closeWorkoutModal={this.closeWorkoutModal}
                                               createWorkout={this.props.actions.createWorkout}/>
                            </Modal>
                        </View>
                    );
                }

            }
            return <Login login={this.props.actions.login}
                          resetPassword={this.props.actions.resetPassword}
                          register={this.props.actions.register}
                          error={this.props.Error}
                          socialAuth={this.props.actions.socialAuth}/>;
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
