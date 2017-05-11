import React from 'react';
import Subscribable from 'Subscribable';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    RefreshControl,
    ListView,
    ScrollView,
    Dimensions
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import {fetchData, API_ENDPOINT, validateEmail, getFontSize} from '../../actions/utils';

import * as GlobalActions from '../../actions/globalActions';

import GlobalStyle from '../globalStyle';

import BackBar from '../../components/BackBar';
import NotificationBox from '../../components/NotificationBox';


const Notifications = React.createClass({
    mixins: [Subscribable.Mixin],
    scrollToTopEvent(args) {
        if (args.routeName == 'Notifications') {
            const isTrue = true;
            this.refs.notifications.scrollTo({y: 0, isTrue});
        }
    },

    componentDidMount() {
        this.addListenerOn(this.props.events, 'scrollToTopEvent', this.scrollToTopEvent);
        if (!this.props.Notifications.length) {
            this.props.actions.getNotifications();
        }
    },
    _refresh() {
        this.props.actions.getNotifications(true);
    },

    onEndReached() {
        if (this.props.NotificationsNext)
            this.props.actions.getNotifications();
    },

    renderHeader() {
        return (
            <BackBar back={this.props.navigator.pop}>
                <Text style={{fontSize: getFontSize(24)}}>Notifications</Text>
            </BackBar>
        )
    },

    render() {
        if (this.props.Notifications.length) {
            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            const dataSource = ds.cloneWithRows(this.props.Notifications);
            return (
                <ListView
                    refreshControl={<RefreshControl refreshing={this.props.Refreshing} onRefresh={this._refresh}/>}
                    style={styles.container} enableEmptySections={true}
                    renderHeader={this.renderHeader}
                    dataSource={dataSource} onEndReached={this.onEndReached}
                    onEndReachedThreshold={Dimensions.get('window').height}
                    renderRow={(noti, i) => <NotificationBox navigator={this.props.navigator} notification={noti}
                                                             readNotification={this.props.actions.readNotification}/>}
                />
            );
        }
        return (
            <ScrollView contentContainerStyle={styles.scrollContainer}
                        refreshControl={<RefreshControl refreshing={this.props.Refreshing} onRefresh={this._refresh}/>}>
                {this.renderHeader()}
                <View style={styles.noRequests}>
                    <Icon name="comments-o" size={60}
                          color='#b1aea5'/>
                    <Text style={styles.noRequestTitle}>
                        No Notifications
                    </Text>
                </View>
            </ScrollView>
        );
    }
});

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
    },
    noRequests: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20
    },
    noRequestTitle: {
        fontSize: getFontSize(22),
        color: '#b1aeb9',
        textAlign: 'center',
        paddingTop: 20,
        fontFamily: 'OpenSans-Semibold'
    }
});


const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser,
        Refreshing: state.Global.Refreshing,
        ...state.Home
    };
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(GlobalActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(Notifications);