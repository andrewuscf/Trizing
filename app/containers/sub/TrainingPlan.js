import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    RefreshControl,
    ListView,
    Platform,
    Dimensions
} from 'react-native';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';

import GlobalStyle from '../globalStyle';

import {API_ENDPOINT, fetchData, getFontSize, checkStatus} from '../../actions/utils';

import CustomIcon from '../../components/CustomIcon';
import Loading from '../../components/Loading';
import MacroBox from '../../components/MacroBox';
import QuestionnaireBox from '../../components/QuestionnaireBox';
import SelectInput from '../../components/SelectInput';
import WorkoutProgramBox from '../../components/WorkoutProgramBox';


const TrainingPlan = React.createClass({
    propTypes: {
        clientId: React.PropTypes.number.isRequired,
        training_plan: React.PropTypes.object.isRequired,
        _redirect: React.PropTypes.func.isRequired,
        getQuestionnaires: React.PropTypes.func.isRequired,
        openModal: React.PropTypes.func.isRequired,
        Questionnaires: React.PropTypes.array.isRequired,
        QuestionnairesNext: React.PropTypes.string,
        tab: React.PropTypes.number
    },

    getInitialState() {
        return {
            macro_plansNext: null,
            macro_plans: null,
            tab: this.props.tab ? this.props.tab : 1,
            refreshing: false,
            training_plan: this.props.training_plan,
            schedules: [],
            schedule_next: null
        }
    },

    componentDidMount() {
        if (this.state.tab == 1)
            this.getMacros(true);
        else if (this.state.tab == 2)
            this.getClientSchedules(true);
    },

    componentDidUpdate(prevProps) {
        if (prevProps.Workouts != this.props.Workouts)
            this.getClientSchedules(true);
    },

    createMacroPlan(data) {
        let jsondata = JSON.stringify(data);
        fetch(`${API_ENDPOINT}training/macros/`,
            fetchData('POST', jsondata, this.props.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
            console.log(responseJson)
                if (responseJson.id) {
                    this.setState({
                        macro_plans: [
                            responseJson,
                            ...this.state.macro_plans
                        ]
                    });
                }
            }).catch((error) => {
            console.log(error)
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
                        macro_plans: (macroIndex != -1) ?
                            macro_plans.slice(0, macroIndex).concat(macro_plans.slice(macroIndex + 1)) : macro_plans
                    });
                }
            });
    },

    getMacros(refresh = false) {
        let url = `${API_ENDPOINT}training/macros/?client=${this.props.clientId}`;
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
            })
            .catch((error) => {
                console.log(error);
            });
    },

    getClientSchedules(refresh = false) {
        let url = `${API_ENDPOINT}training/schedules/?client=${this.props.clientId}`;
        if (!refresh && this.state.schedule_next)
            url = this.state.schedule_next;

        fetch(url, fetchData('GET', null, this.props.UserToken)).then(checkStatus)
            .then((responseJson) => {
                if (!this.state.schedule_next || refresh)
                    this.setState({schedules: responseJson.results, schedule_next: responseJson.next});
                else
                    this.setState({
                        schedules: this.state.schedules.concat(responseJson.results),
                        schedule_next: responseJson.next
                    });
            })
    },

    updatePlan(data) {
        fetch(`${API_ENDPOINT}training/${this.props.training_plan.id}/`,
            fetchData('PATCH', JSON.stringify(data), this.props.UserToken)).then(checkStatus)
    },

    deleteSchedule(id) {
        // fetch(`${API_ENDPOINT}training/workout/${id}/`,
        //     fetchData('DELETE', null, this.props.UserToken)).then(checkStatus)
        //     .then((responseJson) => {
        //         if (responseJson.deleted) {
        //             const index = _.findIndex(this.state.schedules, {id: id});
        //             this.setState({schedules:
        //                 [...this.state.schedules.slice(0, index), ...this.state.schedules.slice(index + 1)]
        //             });
        //         }
        //     })
    },

    _onTabPress(tab) {
        if (tab != this.state.tab) {
            if (tab == 1 && !this.state.macro_plans) {
                this.getMacros();
            } else if (tab == 2 && !this.state.schedules.length) {
                this.getClientSchedules();
            }
            this.setState({tab: tab});
        }
    },

    _refresh() {
        if (this.state.tab == 1)
            this.getMacros(true);
        else if (this.state.tab == 2)
            this.getClientSchedules(true);
    },

    _onEndReached() {
        if (this.state.tab == 1 && this.state.macro_plansNext)
            this.getMacros();
        else if (this.state.tab == 2 && this.state.schedule_next)
            this.getClientSchedules();
    },

    isSelected(tab) {
        return tab == this.state.tab
    },

    selectQuestionnaire(id) {
        this.setState({
            training_plan: {
                ...this.state.training_plan,
                questionnaire: id
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
                schedule: id
            }
        });
        this.updatePlan({schedule: id})
    },

    renderCreateBar(rowCount){
        let textSection =<Text style={styles.helpText}>PRESS AND HOLD TO MAKE ACTIVE</Text>;
        if (rowCount < 1) {
            if (this.state.tab == 1) {
                textSection = <Text style={styles.emptyTitle}>Client has zero macro plans. Create One!</Text>;
            } else if (this.state.tab == 2) {
                textSection = <Text style={styles.emptyTitle}>Client has zero workout programs. Create one!</Text>;
            }
        }
        if (this.state.tab == 1 || this.state.tab == 2) {
            return (
                <View>
                    {this.state.tab == 1 ?
                        <MacroBox createMacroPlan={this.createMacroPlan}
                                  training_plan={this.props.training_plan.id}
                                  _redirect={this.props._redirect}/>
                        :
                        <TouchableOpacity style={styles.emptyContainer}
                                          onPress={this.props._redirect.bind(null, 'CreateSchedule',
                                              {training_plan: this.props.training_plan.id})}>
                            <Text style={styles.mainText}>Create a workout program for client</Text>
                            <Text style={styles.smallText}>(Template or Blank)</Text>
                        </TouchableOpacity>
                    }
                    {textSection}
                </View>
            )
        }
        return null;
    },

    render() {
        if (!this.props.Questionnaires && !this.state.schedules.length && !this.state.macro_plans)
            return <Loading />;
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let dataSource = null;
        if (this.state.tab == 1 && this.state.macro_plans) {
            dataSource = ds.cloneWithRows(this.state.macro_plans);
        } else if (this.state.tab == 2) {
            dataSource = ds.cloneWithRows(this.state.schedules);
        }
        return (
            <View style={GlobalStyle.container}>
                {this.props.Questionnaires.length ?
                    <View style={[styles.pickersView, GlobalStyle.simpleBottomBorder]}>
                        <Text style={styles.pickersText}>Survey: </Text>
                        <SelectInput ref='questionnaires' options={this.props.Questionnaires}
                                     selectedId={this.state.training_plan.questionnaire}
                                     submitChange={this.selectQuestionnaire}/>
                    </View> :
                    <TouchableOpacity style={[styles.pickersView, GlobalStyle.simpleBottomBorder]}
                                      onPress={this.props.openModal}>
                        <Text>Create a Survey</Text>
                    </TouchableOpacity>
                }

                <View style={[styles.tabbarView, GlobalStyle.simpleBottomBorder]}>
                    <TouchableOpacity style={[styles.tabView, (this.isSelected(1)) ? styles.selectedTab : null]}
                                      onPress={this._onTabPress.bind(null, 1)}>
                        <CustomIcon name="food" size={30} color={this.isSelected(1) ? selectedIcon : defaultIcon}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tabView, (this.isSelected(2)) ? styles.selectedTab : null]}
                                      onPress={this._onTabPress.bind(null, 2)}>
                        <CustomIcon name="weight" size={30} color={this.isSelected(2) ? selectedIcon : defaultIcon}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tabView, (this.isSelected(3)) ? styles.selectedTab : null]}
                                      onPress={this._onTabPress.bind(null, 3)}>
                        <Icon name="bar-chart" size={25} color={this.isSelected(3) ? selectedIcon : defaultIcon}/>
                    </TouchableOpacity>
                </View>

                <View style={styles.singleColumn}>
                    {dataSource ?
                        <ListView ref='content' removeClippedSubviews={(Platform.OS !== 'ios')}
                                  renderHeader={this.renderCreateBar.bind(null, dataSource.getRowCount())}
                                  keyboardShouldPersistTaps="handled"
                                  style={styles.listContainer} enableEmptySections={true} dataSource={dataSource}
                                  onEndReached={this._onEndReached} onEndReachedThreshold={Dimensions.get('window').height}
                                  renderRow={(object) => {
                                      if (this.state.tab == 1) {
                                          return <MacroBox plan={object}
                                                           selected={object.id == this.state.training_plan.macro_plan}
                                                           training_plan={this.props.training_plan.id}
                                                           select={this.selectMacroPlan}
                                                           deleteMacroPlan={this.deleteMacroPlan}
                                                           _redirect={this.props._redirect}/>
                                      } else if (this.state.tab == 2) {
                                          return <WorkoutProgramBox
                                              selected={object.id == this.state.training_plan.schedule}
                                              select={this.selectTrainingPlan}
                                              schedule={object} _redirect={this.props._redirect}
                                              deleteSchedule={this.deleteSchedule}/>
                                      }
                                  }}
                        />
                        : null
                    }
                </View>

            </View>
        )
    }
});

const selectedIcon = '#1352e2';
const defaultIcon = 'black';
// <QuestionnaireBox questionnaire={object}
//                   _redirect={this.props._redirect}
//                   selected={object.id == this.state.training_plan.questionnaire}
//                   selectQuestionnaire={this.selectQuestionnaire}/>


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
    singleColumn: {
        flex: 1,
        justifyContent: 'center',
    },
    listContainer: {
        flex: 1
    },
    helpText: {
        textAlign: 'center',
        fontSize: getFontSize(12),
        lineHeight: getFontSize(12),
        textDecorationLine: 'underline',
        textDecorationColor: '#4d4d4e',
        backgroundColor: 'transparent',
        color: '#4d4d4e',
        fontFamily: 'OpenSans-Semibold',
        padding: 5
    },
    pickersView: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 19,
        flexDirection: 'row',
        backgroundColor: 'white',
        // minHeight: 20
    },
    emptyContainer: {
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#e1e3df',
        marginTop: 10,
        backgroundColor: 'white',
        alignItems: 'center',
        // margin: 10,
        padding: 10
    },
    pickersText: {
        color: '#4d4d4e',
        fontSize: getFontSize(22),
        lineHeight: getFontSize(26),
        backgroundColor: 'transparent',
        fontFamily: 'OpenSans-Semibold',
        marginRight: 8
    },
    mainText: {
        fontSize: getFontSize(24),
        lineHeight: getFontSize(26),
        backgroundColor: 'transparent',
        color: '#4d4d4e',
        fontFamily: 'OpenSans-Semibold'
    },
    smallText: {
        fontSize: getFontSize(12),
        backgroundColor: 'transparent',
        color: '#4d4d4e',
        fontFamily: 'OpenSans-Semibold'
    },
    emptyTitle: {
        fontSize: getFontSize(22),
        color: '#b1aeb9',
        textAlign: 'center',
        paddingTop: 20,
        fontFamily: 'OpenSans-Semibold'
    }
});

export default TrainingPlan;

