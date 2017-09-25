import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    TouchableOpacity,
    Platform,
    LayoutAnimation
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ActionButton from 'react-native-action-button';

import * as GlobalActions from '../../actions/globalActions';
import GlobalStyle from '../globalStyle';
import {getFontSize, isATrainer} from '../../actions/utils';

import CustomIcon from '../../components/CustomIcon';
import EditButton from '../../components/EditButton';

const ProgramList = React.createClass({
    propTypes: {
        Refreshing: React.PropTypes.bool.isRequired,
        tab: React.PropTypes.number
    },

    getInitialState() {
        return {
            tab: this.props.tab ? this.props.tab : 1,
            isActionButtonVisible: true
        }
    },

    componentDidMount() {
        this.getNeeded(true);
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


    getNeeded(refresh = false) {
        if (isATrainer(this.props.RequestUser.type)) {
            this.props.getSchedules('?template=true', refresh);
        } else {
            this.props.getSchedules('', refresh);
        }
    },

    _onTabPress(tab) {
        if (tab !== this.state.tab) this.setState({tab: tab});
    },

    _refresh() {
        this.getNeeded(true);
    },

    onEndReached() {
    },

    _redirect(routeName, props = null) {
        this.props.navigation.navigate(routeName, props);
    },

    convertToMap: function () {
        const workoutMap = {'Workout Templates': [], 'Messages': []};
        this.props.ChatRooms.forEach((chatroom) => {
            if (chatroom.team || chatroom.activity) {
                workoutMap['Group Chats'].push(chatroom);
            } else {
                workoutMap['Messages'].push(chatroom);
            }
        });
        return workoutMap;

    },

    renderSectionHeader: function (sectionData, category) {
        if (!sectionData.length) return null;

        return <Text style={styles.sectionTitle}>{category}</Text>;
    },

    goToProgram(program) {
        if (isATrainer(this.props.RequestUser.type)) {
            this.props.navigation.navigate('EditSchedule', {scheduleId: program.id});
        } else {
            // this.props.navigation.navigate('ScheduleDetail', {scheduleId: program});
        }
    },


    renderRow(program) {
        let duration = 0;
        program.workouts.forEach((workout) => duration += workout.duration);
        return (
            <TouchableOpacity style={styles.link} onPress={this.goToProgram.bind(null, program)}>
                <View style={styles.leftSection}>
                    <Text style={styles.simpleTitle}>{program.name}</Text>
                    <View style={styles.row}>
                        <MaterialIcon name="timer" size={getFontSize(18)} style={styles.timerIcon}/>
                        <Text style={styles.smallText}>
                            {duration} {duration === 1 ? 'week' : 'weeks'}
                        </Text>
                    </View>
                </View>
                <MaterialIcon name="keyboard-arrow-right" size={getFontSize(18)}
                              style={styles.linkArrow}/>
            </TouchableOpacity>
        )
    },

    renderHeader() {
        return (
            <View style={[styles.tabbarView, GlobalStyle.simpleBottomBorder]}>
                <TouchableOpacity style={[styles.tabView, (this.state.tab === 1) ? styles.selectedTab : null]}
                                  onPress={this._onTabPress.bind(null, 1)}>
                    <Text style={(this.state.tab === 1) ? styles.selectedText : null}>My Programs</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tabView, (this.state.tab === 2) ? styles.selectedTab : null]}
                                  onPress={this._onTabPress.bind(null, 2)}>
                    <Text style={(this.state.tab === 2) ? styles.selectedText : null}>Find Programs</Text>
                </TouchableOpacity>
            </View>
        )
    },

    renderFooter(length) {
        if (length > 0) return null;
        return (
            <View style={styles.empty}>
                <CustomIcon name="weight" size={getFontSize(60)} color="#b1aea5"/>
                <Text style={styles.emptyText}>
                    Oh No! {this.state.tab === 1 ? `You currently have no workout programs.`
                        : 'There are currently no workout programs for sale.'}
                </Text>
            </View>
        )
    },


    render() {
        const isTrainer = isATrainer(this.props.RequestUser.type);
        const {navigate} = this.props.navigation;
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const showData = this.state.tab === 1 ? this.props.Schedules : [];
        const ProgramsDs = ds.cloneWithRows(showData);
        return (
            <View style={GlobalStyle.container}>
                <ListView ref='schedules_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                          refreshControl={<RefreshControl refreshing={this.props.Refreshing}
                                                          onRefresh={this._refresh}/>}
                          enableEmptySections={true} dataSource={ProgramsDs} showsVerticalScrollIndicator={false}
                          renderRow={this.renderRow}
                          renderHeader={this.renderHeader}
                          onScroll={this._onScroll}
                          renderFooter={this.renderFooter.bind(null, showData.length)}
                />
                <EditButton isActionButtonVisible={!!(isTrainer && this.state.isActionButtonVisible)}>
                    <ActionButton.Item buttonColor='#3498db' title="New Workout template"
                                       onPress={() => navigate('CreateSchedule')}>
                        <CustomIcon name="barbell" color="white" size={getFontSize(30)}/>
                    </ActionButton.Item>
                </EditButton>
            </View>
        )
    }
});

ProgramList.navigationOptions = {
    title: 'Workout Programs',
};


const styles = StyleSheet.create({
    row: {
        flexDirection: 'row'
    },
    timerIcon: {
        color: '#b1aea5',
        alignSelf: 'center',
        paddingRight: 5
    },
    simpleTitle: {
        fontSize: getFontSize(18),
        fontFamily: 'Heebo-Medium',
    },
    smallText: {
        fontSize: getFontSize(12),
        color: '#b1aea5',
        fontFamily: 'Heebo-Medium',
    },
    leftSection: {
        flex: .9,
        margin: 10,
    },
    link: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderColor: '#e1e3df',
    },
    linkArrow: {
        flex: .1
    },
    tabbarView: {
        height: 50,
        opacity: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    tabView: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#00AFA3',
    },
    selectedText: {
        color: '#00AFA3',
    },
    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20
    },
    emptyText: {
        fontSize: getFontSize(22),
        color: '#b1aeb9',
        textAlign: 'center',
        paddingTop: 20,
        fontFamily: 'Heebo-Medium'
    }
});

const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser,
        Schedules: state.Global.Schedules,
        Refreshing: state.Global.Refreshing,
    };
};

const dispatchToProps = (dispatch) => {
    return {
        getSchedules: bindActionCreators(GlobalActions.getSchedules, dispatch),
    }
};

export default connect(stateToProps, dispatchToProps)(ProgramList);
