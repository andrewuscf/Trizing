import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    ScrollView,
    Dimensions,
    LayoutAnimation
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ActionButton from 'react-native-action-button';
import _ from 'lodash';
import moment from 'moment';

import * as CalendarActions from '../actions/calendarActions';

import GlobalStyle from './globalStyle';
import {getFontSize} from '../actions/utils';

import EditButton from '../components/EditButton';
import EventBox from '../components/EventBox';
import Loading from '../components/Loading';


const Calendar = React.createClass({
    getInitialState() {
        return {
            isActionButtonVisible: true
        }
    },

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


    renderRow(occurrence) {
        return <EventBox occurrence={occurrence} navigate={this.props.navigation.navigate}/>;
    },

    renderSectionHeader: function (sectionData, category) {
        if (!sectionData.length) return null;
        return (
            <View style={[GlobalStyle.simpleBottomBorder, {backgroundColor: 'white'}]}>
                <Text style={styles.sectionTitle}>{category}</Text>
            </View>
        );
    },

    _listViewOffset: 0,

    _onScroll(event) {
        const CustomLayoutLinear = {
            duration: 100,
            create: {type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity},
            update: {type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity},
            delete: {type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity}
        };
        const currentOffset = event.nativeEvent.contentOffset.y;
        const direction = (currentOffset > 0 && currentOffset > this._listViewOffset) ? 'down' : 'up';
        const isActionButtonVisible = direction === 'up';
        if (isActionButtonVisible !== this.state.isActionButtonVisible) {
            LayoutAnimation.configureNext(CustomLayoutLinear);
            this.setState({isActionButtonVisible})
        }
        this._listViewOffset = currentOffset;
    },

    convertToMap() {
        const eventMap = {};
        // _.orderBy(this.state.events, 'start_time')
        _.orderBy(this.props.Events, 'start_time').forEach((occurrence) => {
            const date = moment.utc(occurrence.start_time).local();
            let firstDayOfWeek = date.format('ddd, MMMM DD');

            const today = moment();
            if (date.isSame(today, 'd')) {
                firstDayOfWeek = `Today - ${firstDayOfWeek}`
            } else if (date.isSame(today.add(1, 'd'), 'd')) {
                firstDayOfWeek = `Tomorrow - ${firstDayOfWeek}`
            }
            if (!eventMap[firstDayOfWeek]) {
                eventMap[firstDayOfWeek] = [];
            }
            eventMap[firstDayOfWeek].push(occurrence);
        });
        return eventMap;

    },

    render() {
        const isTrainer = this.props.RequestUser.type === 1;
        if (this.props.CalendarIsLoading) return <Loading/>;
        let content = null;
        let subMenu = null;
        if (!this.props.Events.length) {
            content = (
                <ScrollView contentContainerStyle={styles.scrollContainer} ref="calendar_list"
                            style={GlobalStyle.noHeaderContainer}
                            showsVerticalScrollIndicator={false}
                            onScroll={this._onScroll}
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
            const ds = new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2
            });
            const dataSource = ds.cloneWithRowsAndSections(this.convertToMap());
            content = (
                <ListView ref="calendar_list"
                          showsVerticalScrollIndicator={false}
                          refreshControl={<RefreshControl refreshing={this.props.Refreshing}
                                                          onRefresh={this._refresh}/>}
                          onScroll={this._onScroll}
                          style={GlobalStyle.container}
                          enableEmptySections={true}
                          dataSource={dataSource} onEndReached={this.onEndReached}
                          onEndReachedThreshold={Dimensions.get('window').height}
                          renderRow={this.renderRow}
                          renderSectionHeader={this.renderSectionHeader}
                />
            )
        }
        if (isTrainer) {
            subMenu = (
                <EditButton isActionButtonVisible={this.state.isActionButtonVisible}>
                    <ActionButton.Item buttonColor='#FD795B' title="New Client Check-In"
                                       onPress={() => this.goToCreate('chk')}>
                        <MaterialIcon name="event-available" color="white" size={22}/>
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#9b59b6' title="New Event"
                                       onPress={() => this.goToCreate('eve')}>
                        <MaterialIcon name="event" color="white" size={22}/>
                    </ActionButton.Item>
                </EditButton>
            )
        } else {
            subMenu = (
                <EditButton isActionButtonVisible={this.state.isActionButtonVisible}>
                    <ActionButton.Item buttonColor='#9b59b6' title="New Event"
                                       onPress={() => this.goToCreate('eve')}>
                        <MaterialIcon name="event" color="white" size={22}/>
                    </ActionButton.Item>
                </EditButton>
            )
        }
        return (
            <View style={styles.scrollContainer}>
                {content}
                {subMenu}
            </View>
        );
    }
});


const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        // backgroundColor: '#f1f1f3'
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
        fontFamily: 'Heebo-Medium'
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
    sectionTitle: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        fontSize: getFontSize(22),
        fontFamily: 'Heebo-Bold',
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
