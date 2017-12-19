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
    Switch
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
    getInitialState() {
        return {
            isActionButtonVisible: true,
            nutrition_plans: [],
            next: null,
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

    getNeeded(refresh = false, url = `${API_ENDPOINT}training/macros/?all_plans=true`) {
        this.setState({loading: true});
        if (refresh) {
            this.setState({refresh: true});
        }
        RNFetchBlob.fetch('GET', url, setHeaders(this.props.UserToken))
            .then((res) => {
                let json = res.json();
                this.setState({
                    nutrition_plans: json.results,
                    next: json.next,
                    loading: false,
                    refresh: false
                });

            }).catch((errorMessage, statusCode) => {
            this.setState({loading: false});
            console.log(errorMessage)
        });
    },

    _refresh() {
        this.getNeeded(true);
    },

    onEndReached() {
        if (this.state.next && !this.state.loading) {
            this.getNeeded(false, this.state.next);
        }
    },

    _redirect(routeName, props = null) {
        this.props.navigation.navigate(routeName, props);
    },

    convertToMap() {
        const nutritionMap = {'My Plans': [], 'Trainer Plans': []};
        this.state.nutrition_plans.forEach((program) => {
            if (program.trainer.id === this.props.RequestUser.id) {
                nutritionMap['My Plans'].push(program);
            } else {
                nutritionMap['Trainer Plans'].push(program);
            }
        });
        return nutritionMap;

    },

    renderSectionHeader: function (sectionData, category) {
        if (!sectionData.length) return null;
        return (
            <View style={[GlobalStyle.simpleBottomBorder, {backgroundColor: 'white'}]}>
                <Text style={styles.sectionTitle}>{category}</Text>
            </View>
        );
    },


    _activate(program) {
        Alert.alert(
            'Activate Workout Program?',
            `This will override any your current program. Programs can be overwritten by trainers.`,
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Yes', onPress: () => this.props.activateSchedule(program.id)},
            ]
        );
    },

    onSwitchChange(value, program) {
        if (value) {
            this._activate(program)
        }
    },


    renderRow(nutrition_plan) {
        console.log(nutrition_plan)
        return null;
        // program.workouts.forEach((workout) => duration += workout.duration);
        // const active = this.props.RequestUser.profile.active_program === program.id;
        // return (
        //     <TouchableOpacity style={styles.link} onPress={this.goToProgram.bind(null, program)}>
        //
        //         <View style={styles.leftSection}>
        //             <Text style={[styles.simpleTitle, {padding: '2%'}]}>{program.name}</Text>
        //             <View style={[styles.row, {borderColor: '#e1e3df', borderTopWidth: 1, padding: '2%'}]}>
        //                 <MaterialIcon name="timer" size={getFontSize(18)} style={styles.timerIcon}/>
        //                 <Text style={styles.smallText}>
        //                     {duration} {duration === 1 ? 'week' : 'weeks'}
        //                 </Text>
        //             </View>
        //         </View>
        //         <Switch value={this.props.RequestUser.profile.active_program === program.id}
        //                 style={{alignSelf: 'center', marginLeft: '10%'}}
        //                 onValueChange={(value) => this.onSwitchChange(value, program)} onTintColor='#00AFA3'/>
        //     </TouchableOpacity>
        // )
    },

    renderHeader() {
        return null;
    },

    renderFooter() {
        return null;
    },


    render() {
        if (this.state.loading) {
            return <Loading/>;
        }
        const {navigate} = this.props.navigation;
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        });
        const planDs = ds.cloneWithRowsAndSections(this.convertToMap());
        return (
            <View style={GlobalStyle.container}>
                <ListView ref='nutrition_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                          refreshControl={<RefreshControl refreshing={this.state.refresh}
                                                          onRefresh={this._refresh}/>}
                          enableEmptySections={true} dataSource={planDs} showsVerticalScrollIndicator={false}
                          renderRow={this.renderRow}
                          renderHeader={this.renderHeader}
                          onScroll={this._onScroll}
                          renderFooter={this.renderFooter}
                          onEndReached={this.onEndReached}
                          onEndReachedThreshold={400}
                          renderSectionHeader={this.renderSectionHeader}
                          contentContainerStyle={{paddingBottom: 100}}
                />
                <EditButton isActionButtonVisible={this.state.isActionButtonVisible}>
                    <ActionButton.Item buttonColor='#3498db' title="New Nutrition Plan"
                                       onPress={() => navigate('CreateMacroPlan')}>
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
    },
    link: {
        flexDirection: 'row',
        alignItems: 'center',
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
