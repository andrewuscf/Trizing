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

import Login from './containers/Login';
import Home from './containers/Home';
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
            Route: 'Home'
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

    render() {
        if (!this.state.splashArt) {
            if (this.props.UserToken) {
                let navbar = null;
                if (this.props.RequestUser && this.props.RequestUser.profile.completed) {
                    navbar = <NavBar route={this.state.Route}
                                     RequestUser={this.props.RequestUser}
                                     checkInColor="red"/>;
                    return (
                        <View style={styles.container}>
                            <Navigator initialRoute={{component: Home, name: 'Home'}}
                                       ref={(nav) => {
                                       navigator = nav
                                   }}
                                       renderScene={ this._renderScene }
                                       navigationBar={navbar}
                            />
                            <Modal style={[styles.modal]} backdrop={false} ref={"questionnaire"}
                                   swipeToClose={false}>
                                <CreateQuestionnaire closeQuestionnaireModal={this.closeQuestionnaireModal}
                                                     createQuestionnaire={this.props.actions.createQuestionnaire} />
                            </Modal>
                            <Modal style={[styles.modal]} backdrop={false} ref={"workout"}
                                   swipeToClose={false}>
                                <CreateWorkout closeWorkoutModal={this.closeWorkoutModal}
                                               createWorkout={this.props.actions.createWorkout} />
                            </Modal>
                        </View>
                    );
                }
                return (
                    <View style={styles.container}>
                        <EditProfile />
                    </View>
                );

            }
            return (
                <View style={styles.container}>
                    <Login login={this.props.actions.login}
                           resetPassword={this.props.actions.resetPassword}
                           register={this.props.actions.register}
                           error={this.props.Error}
                           socialAuth={this.props.actions.socialAuth}/>
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
