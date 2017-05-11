import React from 'react';
import Subscribable from 'Subscribable';
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
import Icon from 'react-native-vector-icons/FontAwesome';

import * as CalendarActions from '../actions/calendarActions';

import {getRoute} from '../routes';
import {getFontSize} from '../actions/utils';
import GlobalStyle from './globalStyle';

import EventBox from '../components/EventBox';


const Calendar = React.createClass({
    mixins: [Subscribable.Mixin],
    scrollToTopEvent(args) {
        if (args.routeName == 'Calendar') {
            const isTrue = true;
            this.refs.calendar_list.scrollTo({y: 0, isTrue});
        }
    },

    componentDidMount() {
        this.addListenerOn(this.props.events, 'scrollToTopEvent', this.scrollToTopEvent);
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

    goToCreate() {
        this.props.navigator.push(getRoute('CreateEvent'))
    },

    renderHeader() {
        if (this.props.RequestUser.type == 1)
            return (
                <TouchableOpacity style={styles.header} onPress={this.goToCreate}>
                    <Icon name="calendar-plus-o" size={30}
                          color='#b1aea5'/>
                    <Text style={styles.createEventText}>Create New Event</Text>
                </TouchableOpacity>
            );
        return null;
    },


    render() {
        if (this.props.Events.length) {
            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            const dataSource = ds.cloneWithRows(this.props.Events);
            return (
                <ListView ref="calendar_list"
                          refreshControl={<RefreshControl refreshing={this.props.Refreshing}
                                                          onRefresh={this._refresh}/>}
                          enableEmptySections={true}
                          renderHeader={this.renderHeader}
                          dataSource={dataSource} onEndReached={this.onEndReached}
                          onEndReachedThreshold={Dimensions.get('window').height}
                          renderRow={(occurrence, i) => <EventBox occurrence={occurrence}
                                                                  navigator={this.props.navigator}/>}
                />
            );
        }
        return (
            <ScrollView contentContainerStyle={styles.scrollContainer} ref="calendar_list"
                        refreshControl={<RefreshControl refreshing={this.props.Refreshing} onRefresh={this._refresh}/>}>
                {this.renderHeader()}
                <View style={styles.noRequests}>
                    <Icon name="calendar-o" size={60}
                          color='#b1aea5'/>
                    <Text style={styles.noRequestTitle}>
                        {this.props.RequestUser.type == 1 ?
                            'You have no upcoming events.'
                            : "Your trainer needs to invite you to events."
                        }
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
