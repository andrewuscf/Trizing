import React from 'react';

const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ListView,
    Platform,
    LayoutAnimation
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';
import ActionButton from "react-native-action-button";

import GlobalStyle from '../globalStyle';


import {addSchedules, removeSchedule, getQuestionnaires} from '../../actions/globalActions';
import {API_ENDPOINT, fetchData, getFontSize, checkStatus} from '../../actions/utils';

import CustomIcon from '../../components/CustomIcon';
import Loading from '../../components/Loading';
import MacroBox from '../../components/MacroBox';
import SelectInput from '../../components/SelectInput';
import WorkoutProgramBox from '../../components/WorkoutProgramBox';


const TrainingPlan = CreateClass({
    propTypes: {
        client: PropTypes.object.isRequired,
        training_plan: PropTypes.object.isRequired,
        _redirect: PropTypes.func.isRequired,
        openModal: PropTypes.func.isRequired,
        tab: PropTypes.number
    },

    getInitialState() {
        return {
            macro_plansNext: null,
            macro_plans: null,
            tab: this.props.tab ? this.props.tab : 1,
            refreshing: false,
            training_plan: this.props.training_plan,
            schedule_next: null,
            isActionButtonVisible: true,
        }
    },

    componentDidMount() {
        if (this.state.tab === 1)
            this.getMacros(true);
        else if (this.state.tab === 2)
            this.getClientSchedules(true);

        // if (!this.props.Questionnaires.length) {
        //     this.props.getQuestionnaires();
        // }
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

    addMacroPlan(data) {
        this.setState({
            macro_plans: [
                data,
                ...this.state.macro_plans
            ]
        });
    },

    deleteMacroPlan(id) {
        fetch(`${API_ENDPOINT}training/macro/${id}/`, fetchData('DELETE', null, this.props.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                if (responseJson.deleted) {
                    let macro_plans = this.state.macro_plans;
                    const macroIndex = _.findIndex(macro_plans, {id: id});
                    this.setState({
                        macro_plans: (macroIndex !== -1) ?
                            macro_plans.slice(0, macroIndex).concat(macro_plans.slice(macroIndex + 1)) : macro_plans
                    });
                }
            });
    },

    getMacros(refresh = false) {
        let url = `${API_ENDPOINT}training/macros/?client=${this.props.client.id}`;
        if (!refresh && this.state.macro_plansNext)
            url = this.state.macro_plansNext;

        fetch(url, fetchData('GET', null, this.props.UserToken)).then(checkStatus)
            .then((responseJson) => {
                if (!this.state.macro_plansNext || refresh)
                    this.setState({macro_plans: responseJson.results, macro_plansNext: responseJson.next});
                else
                    this.setState({
                        macro_plans: this.state.macro_plans.concat(responseJson.results),
                        macro_plansNext: responseJson.next
                    });
            });
    },

    getClientSchedules(refresh = false) {
        let url = `${API_ENDPOINT}training/schedules/?client=${this.props.client.id}`;
        if (!refresh && this.state.schedule_next) url = this.state.schedule_next;

        fetch(url, fetchData('GET', null, this.props.UserToken)).then(checkStatus)
            .then((responseJson) => {
                this.props.addSchedules(responseJson.results);
                this.setState({schedule_next: responseJson.next});
            })
    },

    updatePlan(data) {
        fetch(`${API_ENDPOINT}training/${this.props.training_plan.id}/`,
            fetchData('PATCH', JSON.stringify(data), this.props.UserToken)).then(checkStatus)
    },

    deleteSchedule(id) {
        fetch(`${API_ENDPOINT}training/schedule/${id}/`,
            fetchData('DELETE', null, this.props.UserToken)).then(checkStatus)
            .then((responseJson) => {
                if (responseJson.deleted) this.props.removeSchedule(id);
            });
    },

    _onTabPress(tab) {
        const userSchedules = _.filter(this.props.Schedules, schedule => {
            return schedule.training_plan === this.state.training_plan.id;
        });
        if (tab !== this.state.tab) {
            if (tab === 1 && !this.state.macro_plans) {
                this.getMacros();
            } else if (tab === 2 && !userSchedules.length) {
                this.getClientSchedules();
            }
            this.setState({tab: tab});
        }
    },

    _refresh() {
        if (this.state.tab === 1)
            this.getMacros(true);
        else if (this.state.tab === 2)
            this.getClientSchedules(true);
    },

    _onEndReached() {
        if (this.state.tab === 1 && this.state.macro_plansNext)
            this.getMacros();
        else if (this.state.tab === 2 && this.state.schedule_next)
            this.getClientSchedules();
    },

    isSelected(tab) {
        return tab === this.state.tab
    },

    selectQuestionnaire(id) {
        this.setState({
            training_plan: {
                ...this.state.training_plan,
                questionnaire: id,
                answered: false,
            }
        });
        this.updatePlan({questionnaire: id});
    },

    selectMacroPlan(id) {
        this.setState({
            training_plan: {
                ...this.state.training_plan,
                macro_plan: id
            }
        });
        this.updatePlan({macro_plan: id})
    },

    selectTrainingPlan(id) {
        this.setState({
            training_plan: {
                ...this.state.training_plan,
                program: id
            }
        });
        this.updatePlan({program: id})
    },

    renderCreateBar(rowCount) {
        let textSection = null;
        if (rowCount < 1) {
            if (this.state.tab === 1) {
                textSection = <Text style={styles.emptyTitle}>No Nutrition plans. Create One!</Text>;
            } else if (this.state.tab === 2) {
                textSection = <Text style={styles.emptyTitle}>No workout programs. Create one!</Text>;
            }
        }
        if (this.state.tab === 1 || this.state.tab === 2) {
        }
        return (
            <View>
                {/*{this.props.Questionnaires.length ?*/}
                {/*<View style={[styles.pickersView, GlobalStyle.simpleBottomBorder]}>*/}
                {/*<View style={{flexDirection: 'row', flex: .7}}>*/}
                {/*<SelectInput ref='questionnaires' options={this.props.Questionnaires}*/}
                {/*selectedId={this.state.training_plan.questionnaire}*/}
                {/*submitChange={this.selectQuestionnaire}/>*/}
                {/*</View>*/}
                {/*{this.props.training_plan.answered ?*/}
                {/*<TouchableOpacity style={{flex: .3, padding: 5}}*/}
                {/*onPress={this.props._redirect.bind(null, 'AnswersDisplay', {*/}
                {/*questionnaire: _.find(this.props.Questionnaires, {id: this.props.training_plan.questionnaire}),*/}
                {/*client: this.props.client*/}
                {/*})}>*/}
                {/*<Text>View Answers</Text>*/}
                {/*</TouchableOpacity>*/}
                {/*: null*/}
                {/*}*/}
                {/*</View> :*/}
                {/*<TouchableOpacity style={[styles.pickersView, GlobalStyle.simpleBottomBorder]}*/}
                {/*onPress={this.props.openModal}>*/}
                {/*<Text>Create a Survey</Text>*/}
                {/*</TouchableOpacity>*/}
                {/*}*/}

                <View style={[styles.tabbarView, GlobalStyle.simpleBottomBorder]}>
                    <TouchableOpacity style={[styles.tabView, (this.isSelected(1)) ? styles.selectedTab : null]}
                                      onPress={this._onTabPress.bind(null, 1)}>
                        <CustomIcon name="food" size={getFontSize(30)}
                                    color={this.isSelected(1) ? selectedIcon : defaultIcon}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tabView, (this.isSelected(2)) ? styles.selectedTab : null]}
                                      onPress={this._onTabPress.bind(null, 2)}>
                        <CustomIcon name="weight" size={getFontSize(30)}
                                    color={this.isSelected(2) ? selectedIcon : defaultIcon}/>
                    </TouchableOpacity>
                    {/*<TouchableOpacity style={[styles.tabView, (this.isSelected(3)) ? styles.selectedTab : null]}*/}
                    {/*onPress={this._onTabPress.bind(null, 3)}>*/}
                    {/*<CustomIcon name="pie-chart" size={getFontSize(20)}*/}
                    {/*color={this.isSelected(3) ? selectedIcon : defaultIcon}/>*/}
                    {/*</TouchableOpacity>*/}
                </View>
                {textSection}
            </View>
        );
    },

    onActionButton() {
        if (this.state.tab === 1) {
            this.props._redirect('CreateMacroPlan', {
                training_plan: this.props.training_plan.id,
                addMacroPlan: this.addMacroPlan
            });
        } else if (this.state.tab === 2) {
            this.props._redirect('CreateSchedule', {training_plan: this.props.training_plan.id});
        }
    },


    render() {
        if (!this.props.Questionnaires && !this.props.Schedules.length && !this.state.macro_plans)
            return <Loading/>;
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let dataSource = null;
        if (this.state.tab === 1 && this.state.macro_plans) {
            dataSource = ds.cloneWithRows(this.state.macro_plans);
        } else if (this.state.tab === 2) {
            dataSource = ds.cloneWithRows(_.filter(this.props.Schedules, schedule => {
                return schedule.training_plan === this.state.training_plan.id;
            }))
        } else {
            dataSource = ds.cloneWithRows([]);
        }
        return (
            <View style={GlobalStyle.container}>
                <ListView ref='content' removeClippedSubviews={(Platform.OS !== 'ios')}
                          showsVerticalScrollIndicator={false}
                          renderHeader={this.renderCreateBar.bind(null, dataSource.getRowCount())}
                          keyboardShouldPersistTaps="handled"
                          style={[GlobalStyle.container, {backgroundColor: '#f2f3f8'}]} enableEmptySections={true}
                          dataSource={dataSource}
                          contentContainerStyle={{paddingBottom: 100}}
                          onEndReached={this._onEndReached}
                          onScroll={this._onScroll}
                          onEndReachedThreshold={400}
                          renderRow={(object) => {
                              if (this.state.tab === 1) {
                                  return <MacroBox plan={object}
                                                   selected={object.id === this.state.training_plan.macro_plan}
                                                   select={this.selectMacroPlan}
                                                   navigate={this.props._redirect}
                                                   deleteMacroPlan={this.deleteMacroPlan}/>
                              } else if (this.state.tab === 2) {
                                  return <WorkoutProgramBox
                                      selected={object.id === this.state.training_plan.program}
                                      select={this.selectTrainingPlan}
                                      schedule={object} _redirect={this.props._redirect}
                                      deleteSchedule={this.deleteSchedule}/>
                              }
                          }}
                />
                {this.state.isActionButtonVisible ?
                    <ActionButton buttonColor="rgba(0, 175, 163, 1)" position="right" onPress={this.onActionButton}/>
                    : null
                }
            </View>
        )
    }
});

const selectedIcon = '#1352e2';
const defaultIcon = 'black';


const styles = StyleSheet.create({
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
        borderBottomColor: '#1352e2',
        marginLeft: 5,
        marginRight: 5,
    },
    pickersView: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 15,
        paddingTop: 15,
        paddingBottom: 15,
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 10,

        flex: 1,
        borderWidth: 1,
        borderColor: '#e1e3df',
        margin: 10,
        marginBottom: 5,
        backgroundColor: 'white',
        borderRadius: 5
    },
    mainText: {
        backgroundColor: 'transparent',
        color: '#4d4d4e',
        fontFamily: 'Heebo-Medium'
    },
    emptyTitle: {
        color: '#b1aeb9',
        textAlign: 'center',
        paddingTop: 20,
        fontFamily: 'Heebo-Medium'
    },
    details: {
        flexDirection: 'column',
        paddingLeft: 18
    },
});

const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser,
        UserToken: state.Global.UserToken,
        Questionnaires: state.Global.Questionnaires,
        QuestionnairesNext: state.Global.QuestionnairesNext,
        Schedules: state.Global.Schedules,
    };
};

const dispatchToProps = (dispatch) => {
    return {
        getQuestionnaires: bindActionCreators(getQuestionnaires, dispatch),
        addSchedules: bindActionCreators(addSchedules, dispatch),
        removeSchedule: bindActionCreators(removeSchedule, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(TrainingPlan);


