import React from 'react';
import Subscribable from 'Subscribable';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    ScrollView,
    TouchableOpacity,
    Platform
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';
// import FCM from 'react-native-fcm';
import Icon from 'react-native-vector-icons/FontAwesome';

import * as HomeActions from '../actions/homeActions';
import * as GlobalActions from '../actions/globalActions';

import {getRoute} from '../routes';
import {getFontSize} from '../actions/utils';
import GlobalStyle from './globalStyle';

import NotificationBox from '../components/NotificationBox';
import PeopleBar from '../components/PeopleBar';


const Home = React.createClass({
    mixins: [Subscribable.Mixin],
    propTypes: {
        Refreshing: React.PropTypes.bool.isRequired,
        openModal: React.PropTypes.func.isRequired
    },

    scrollToTopEvent(args) {
        if (args.routeName == 'Home') this.refs.home_scroll.scrollTo({y: 0, true});
    },

    componentDidMount() {
        this.addListenerOn(this.props.events, 'scrollToTopEvent', this.scrollToTopEvent);
        if (!this.props.Clients.length) {
            this.getNeeded(true);
        }
        // this.getToken();
    },

    getNeeded(refresh = false) {
        if (this.props.RequestUser.type == 1) {
            this.props.actions.getClients(refresh);
            this.props.getSchedules('?template=true', refresh);
            this.props.getQuestionnaires();
        }
        if (refresh) {
            this.props.getNotifications(refresh);
        }
    },

    // getToken() {
    //     const self = this;
    //     FCM.requestPermissions(); // for iOS
    //     FCM.getFCMToken().then(token => {
    //         if (token) self.props.actions.setDeviceForNotification(token);
    //     });
    // },


    _refresh() {
        this.getNeeded(true);
    },

    onEndReached() {
        console.log('End reach')
    },

    _redirect(routeName, props = null) {
        this.props.navigator.push(getRoute(routeName, props));
    },


    render() {
        const user = this.props.RequestUser;
        const isTrainer = user.type == 1;
        let content = null;
        if (isTrainer) {
            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            const QuestionnaireDS = ds.cloneWithRows(this.props.Questionnaires);
            const SchedulesDs = ds.cloneWithRows(_.filter(this.props.Schedules, function (o) {
                return !o.training_plan;
            }));
            content = (
                <View>
                    <PeopleBar navigator={this.props.navigator} people={this.props.Clients}
                               manageClients={this._redirect.bind(null, 'ManageClients', null)}/>

                    <View style={[styles.box]}>
                        <Text style={styles.textTitle}>Program Templates</Text>
                        <ListView ref='schedules_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                                  style={styles.container} enableEmptySections={true} dataSource={SchedulesDs}
                                  renderRow={(schedule) =>
                                      <TouchableOpacity style={styles.link}
                                                        onPress={this._redirect.bind(null, 'EditSchedule', {scheduleId: schedule.id})}>
                                          <Text style={styles.simpleTitle}>{schedule.name}</Text>
                                          <Icon name="angle-right" size={getFontSize(18)} style={styles.linkArrow}/>
                                      </TouchableOpacity>
                                  }
                        />
                        <TouchableOpacity onPress={this._redirect.bind(null, 'CreateSchedule', null)}
                                          style={styles.link}>
                            <Text style={styles.simpleTitle}>Create Program Template</Text>
                            <Icon name="plus" size={getFontSize(18)} style={styles.linkArrow}/>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.box]}>
                        <Text style={styles.textTitle}>Surveys</Text>
                        <ListView ref='survey_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                                  style={styles.container} enableEmptySections={true} dataSource={QuestionnaireDS}
                                  renderRow={(survey) =>
                                      <TouchableOpacity style={styles.link}>
                                          <Text style={styles.simpleTitle}>{survey.name}</Text>
                                          <Icon name="angle-right" size={getFontSize(18)} style={styles.linkArrow}/>
                                      </TouchableOpacity>
                                  }
                        />
                        <TouchableOpacity onPress={this.props.openModal} style={styles.link}>
                            <Text style={styles.simpleTitle}>Create Survey</Text>
                            <Icon name="plus" size={getFontSize(18)} style={styles.linkArrow}/>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        } else {
            content = <Text>Client</Text>;
        }
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const dataSource = ds.cloneWithRows(this.props.Notifications.slice(0, 4));
        return (
            <View style={GlobalStyle.container}>
                <ScrollView ref='home_scroll'
                            refreshControl={<RefreshControl refreshing={this.props.Refreshing}
                                                            onRefresh={this._refresh}/>}
                            style={styles.scrollView} contentContainerStyle={styles.contentContainerStyle}>

                    {content}
                    <View style={styles.box}>
                        <ListView ref='notification_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                                  style={styles.container} enableEmptySections={true} dataSource={dataSource}
                                  renderRow={(notification) => <NotificationBox
                                      navigator={this.props.navigator} notification={notification}
                                      readNotification={this.props.readNotification}/>}
                        />
                        <TouchableOpacity onPress={this._redirect.bind(null, 'Notifications', null)}
                                          style={styles.link}>
                            <Text style={styles.simpleTitle}>View All Notifications</Text>
                            <Icon name="angle-right" size={getFontSize(18)} style={styles.linkArrow}/>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        )
    }
});


const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#f1f1f1'
    },
    contentContainerStyle: {
        backgroundColor: '#f1f1f1'
    },
    box: {
        marginTop: 5,
        justifyContent: 'center',
        backgroundColor: 'white',
        borderBottomWidth: 0.5,
        borderRightWidth: 0.5,
        borderLeftWidth: 0.5,
        borderColor: '#e1e3df',
    },
    textTitle: {
        fontSize: getFontSize(20),
        fontFamily: 'OpenSans-Semibold',
        margin: 10,
        alignSelf: 'center'
    },
    simpleTitle: {
        fontSize: getFontSize(18),
        color: '#b1aea5',
        fontFamily: 'OpenSans-Semibold',
        margin: 10,
        flex: 17
    },
    link: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        borderTopWidth: 0.5,
        borderColor: '#e1e3df',
    },
    linkArrow: {
        flex: 1
    },
    listItemText: {
        color: '#4d4d4e',
        fontSize: getFontSize(22),
        lineHeight: getFontSize(26),
        backgroundColor: 'transparent',
        fontFamily: 'OpenSans-Semibold',
        textDecorationLine: 'underline'
    }
});

const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser,
        Questionnaires: state.Global.Questionnaires,
        Schedules: state.Global.Schedules,
        ...state.Home
    };
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(HomeActions, dispatch),
        getNotifications: bindActionCreators(GlobalActions.getNotifications, dispatch),
        readNotification: bindActionCreators(GlobalActions.readNotification, dispatch),
        getQuestionnaires: bindActionCreators(GlobalActions.getQuestionnaires, dispatch),
        getSchedules: bindActionCreators(GlobalActions.getSchedules, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(Home);
