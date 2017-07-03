import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    ScrollView,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ActionButton from 'react-native-action-button';

import * as CalendarActions from '../actions/calendarActions';

import GlobalStyle from './globalStyle';
import {getFontSize} from '../actions/utils';

import EventBox from '../components/EventBox';
import Loading from '../components/Loading';


const Calendar = React.createClass({
    componentDidMount() {
        if (!this.props.Events.length) {
            this.props.actions.getEvents();
        }
    },
    _refresh() {
        this.props.actions.getEvents(true);
    },

    onEndReached() {
        if (this.props.EventsNext)
            this.props.actions.getEvents();
    },

    goToCreate(type) {
        this.props.navigation.navigate('CreateEvent', {event_type: type});
    },

    render() {
        const isTrainer = this.props.RequestUser.type == 1;
        if (this.props.CalendarIsLoading) return <Loading />;
        let content = null;
        let subMenu = null;
        if (!this.props.Events.length) {
            content = (
                <ScrollView contentContainerStyle={styles.scrollContainer} ref="calendar_list"
                            style={GlobalStyle.noHeaderContainer}
                            refreshControl={<RefreshControl refreshing={this.props.Refreshing}
                                                            onRefresh={this._refresh}/>}>
                    <View style={styles.noRequests}>
                        <MaterialIcon name="today" size={60} color='#b1aea5'/>
                        <Text style={styles.noRequestTitle}>
                            No events. Create one.
                        </Text>
                    </View>
                </ScrollView>
            );
        } else {
            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            const dataSource = ds.cloneWithRows(this.props.Events);
            content = (
                <ListView ref="calendar_list"
                          refreshControl={<RefreshControl refreshing={this.props.Refreshing}
                                                          onRefresh={this._refresh}/>}
                          style={styles.scrollContainer}
                          enableEmptySections={true}
                          dataSource={dataSource} onEndReached={this.onEndReached}
                          onEndReachedThreshold={Dimensions.get('window').height}
                          renderRow={(occurrence, i) => <EventBox occurrence={occurrence}
                                                                  navigate={this.props.navigation.navigate}/>}
                />
            )
        }
        if (isTrainer) {
            subMenu = (
                <ActionButton buttonColor="rgba(0, 175, 163, 1)" position="right">
                    <ActionButton.Item buttonColor='#FD795B' title="New Client Check-In"
                                       onPress={() => this.goToCreate('chk')}>
                        <MaterialIcon name="event-available" color="white" size={22}/>
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#9b59b6' title="New Event"
                                       onPress={() => this.goToCreate('eve')}>
                        <MaterialIcon name="event" color="white" size={22}/>
                    </ActionButton.Item>
                </ActionButton>
            )
        } else {
            subMenu = (
                <ActionButton buttonColor="rgba(0, 175, 163, 1)" position="right">
                    <ActionButton.Item buttonColor='#9b59b6' title="New Event"
                                       onPress={() => this.goToCreate('eve')}>
                        <MaterialIcon name="event" color="white" size={22}/>
                    </ActionButton.Item>
                </ActionButton>
            )
        }
        return (
            <View style={GlobalStyle.noHeaderContainer}>
                {content}
                {subMenu}
            </View>
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
    },
    header: {
        backgroundColor: 'white',
        height: 50,
        padding: 10,
        margin: 5,
        borderColor: '#e1e3df',
        borderTopWidth: .5,
        borderBottomWidth: .5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    createEventText: {
        fontSize: getFontSize(22),
        color: '#b1aeb9',
        fontFamily: 'OpenSans-Semibold',
        paddingLeft: 10
    }
});

const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser,
        Refreshing: state.Global.Refreshing,
        ...state.Calendar
    };
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(CalendarActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(Calendar);
