import React from 'react';

const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    TouchableOpacity,
    Platform,
    LayoutAnimation,
    Alert,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ActionButton from 'react-native-action-button';
import RNFetchBlob from 'react-native-fetch-blob';

import * as GlobalActions from '../../actions/globalActions';
import GlobalStyle from '../globalStyle';
import {API_ENDPOINT, getFontSize, setHeaders, isATrainer, convertSkill, trunc} from '../../actions/utils';

import CustomIcon from '../../components/CustomIcon';
import EditButton from '../../components/EditButton';
import Loading from '../../components/Loading';

const ProgramList = CreateClass({
    propTypes: {
        tab: PropTypes.number
    },

    getInitialState() {
        return {
            tab: this.props.tab ? this.props.tab : 1,
            isActionButtonVisible: true,
            forSale: [],
            forSaleNext: null,
            loading: false,
            refresh: false,
            isTrainer: isATrainer(this.props.RequestUser.type)
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
        if (this.state.tab === 2) {
            this.getForSale(refresh)
        }
    },

    getForSale(refresh = false) {
        this.setState({loading: true});
        if (refresh) {
            this.setState({refresh: true});
        }

        const url = `${API_ENDPOINT}training/program/sale/`;
        RNFetchBlob.fetch('GET', url, setHeaders(this.props.UserToken))
            .then((res) => {
                let json = res.json();
                this.setState({
                    forSale: json.results,
                    forSaleNext: json.next,
                    loading: false,
                    refresh: false
                });

            }).catch((errorMessage, statusCode) => {
            this.setState({loading: false});
            console.log(errorMessage)
        });
    },

    _onTabPress(tab) {
        if (tab !== this.state.tab) this.setState({tab: tab});
        if (tab === 2 && !this.state.forSale.length) {
            this.getForSale();
        }
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
        // program.trainer.id === this.props.RequestUser.id
        const data = this.state.tab === 1 ? this.props.Schedules : [];
        const workoutMap = this.state.tab === 1 ? {'My Programs': [], 'Trainer Programs': []} : {};
        data.forEach((program) => {
            if (program.trainer.id === this.props.RequestUser.id) {
                workoutMap['My Programs'].push(program);
            } else {
                workoutMap['Trainer Programs'].push(program);
            }
        });
        return workoutMap;

    },

    renderSectionHeader: function (sectionData, category) {
        if (!sectionData.length) return null;
        return (
            <View style={[GlobalStyle.simpleBottomBorder, {backgroundColor: 'white'}]}>
                <Text style={styles.sectionTitle}>{category}</Text>
            </View>
        );
    },

    goToProgram(program) {
        if (isATrainer(this.props.RequestUser.type) || program.trainer.id === this.props.RequestUser.id) {
            this.props.navigation.navigate('EditSchedule', {scheduleId: program.id});
        } else {
            this.props.navigation.navigate('ScheduleDetail', {schedule: program});
        }
    },

    _activate(program) {
        function test(data) {
            console.log(data)
        }

        Alert.alert(
            'Activate Workout Program?',
            `This will override any your current program. Programs can be overwritten by trainers.`,
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Yes', onPress: () => this.props.activateSchedule(program.id, test)},
            ]
        );
    },

    onSwitchChange(program) {
        this._activate(program)
    },


    renderRow(program) {
        let duration = 0;
        program.workouts.forEach((workout) => duration += workout.duration);
        const active = this.props.RequestUser.profile.active_program === program.id;
        return (
            <TouchableOpacity style={styles.link} onPress={this.goToProgram.bind(null, program)}>
                <View style={styles.duration}>
                    <MaterialIcon name="timer" size={24} style={styles.timerIcon}/>
                    <Text style={styles.smallText}>
                        {duration} {duration === 1 ? 'week' : 'weeks'}
                    </Text>
                </View>

                <View style={styles.leftSection}>
                    <Text style={styles.simpleTitle}>{program.name}</Text>
                    {program.description ?
                        <Text style={styles.smallText}>{trunc(program.description, 38)}</Text>
                        : null
                    }
                    {program.skill_level ?
                        <Text style={styles.smallText}>
                            Difficulty: {convertSkill(program.skill_level)}
                        </Text>
                        : null
                    }
                    <TouchableOpacity
                        style={[styles.activeButton, active ? {backgroundColor: '#00AFA3'} : {backgroundColor: '#b1aeb9'}]}
                        onPress={() => this.onSwitchChange(program)}>
                        <Text style={styles.activeText}>{active ? 'Active' : 'Activate'}</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    },

    renderHeader() {
        return (
            <View style={[styles.tabbarView, GlobalStyle.simpleBottomBorder]}>
                <TouchableOpacity style={[styles.tabView, (this.state.tab === 1) ? styles.selectedTab : null]}
                                  onPress={this._onTabPress.bind(null, 1)}>
                    <Text style={(this.state.tab === 1) ? styles.selectedText : null}>Programs</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tabView, (this.state.tab === 2) ? styles.selectedTab : null]}
                                  onPress={this._onTabPress.bind(null, 2)}>
                    <Text style={(this.state.tab === 2) ? styles.selectedText : null}>Find Programs</Text>
                </TouchableOpacity>
            </View>
        )
    },

    renderFooter() {
        const length = this.state.tab === 1 ? this.props.Schedules.length : 0;
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
        if ((this.props.SchedulesLoading && this.state.tab === 1) || (this.state.loading && this.state.tab === 2)) {
            return (
                <View style={GlobalStyle.container}>
                    {this.renderHeader()}
                    <Loading/>
                </View>
            )
        }
        const {navigate} = this.props.navigation;
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        });
        const ProgramsDs = ds.cloneWithRowsAndSections(this.convertToMap());
        return (
            <View style={GlobalStyle.container}>
                <ListView ref='schedules_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                          refreshControl={<RefreshControl refreshing={this.state.refresh}
                                                          onRefresh={this._refresh}/>}
                          enableEmptySections={true} dataSource={ProgramsDs} showsVerticalScrollIndicator={false}
                          renderRow={this.renderRow}
                          renderHeader={this.renderHeader}
                          onScroll={this._onScroll}
                          renderFooter={this.renderFooter}
                          renderSectionHeader={this.renderSectionHeader}
                          contentContainerStyle={{paddingBottom: 150}}
                />
                <EditButton isActionButtonVisible={this.state.isActionButtonVisible}>
                    <ActionButton.Item buttonColor='#3498db' title="New Workout"
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
        fontFamily: 'Heebo-Bold',
        marginTop: 15
    },
    smallText: {
        fontSize: getFontSize(12),
        color: '#b1aea5',
        fontFamily: 'Heebo-Medium',
    },
    leftSection: {
        flex: .8,
    },
    link: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderColor: '#e1e3df',
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
    },
    sectionTitle: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        fontSize: getFontSize(22),
        fontFamily: 'Heebo-Bold',
    },
    duration: {
        flex: .2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeButton: {
        alignSelf: 'flex-end',
        marginTop: 10,
        padding: 5,
        minWidth: '25%',
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 20,
    },
    activeText: {
        fontSize: getFontSize(16),
        color: 'white',
        fontFamily: 'Heebo-Medium',
        textAlign: 'center'
    }
});

const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser,
        Schedules: state.Global.Schedules,
        UserToken: state.Global.UserToken,
        SchedulesLoading: state.Global.SchedulesLoading
    };
};

const dispatchToProps = (dispatch) => {
    return {
        getSchedules: bindActionCreators(GlobalActions.getSchedules, dispatch),
        activateSchedule: bindActionCreators(GlobalActions.activateSchedule, dispatch),
    }
};

export default connect(stateToProps, dispatchToProps)(ProgramList);
