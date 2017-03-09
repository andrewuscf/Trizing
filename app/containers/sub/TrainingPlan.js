import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    RefreshControl,
    ListView,
    Platform
} from 'react-native';
import _ from 'lodash';

import GlobalStyle from '../globalStyle';

import {API_ENDPOINT, fetchData, getFontSize, checkStatus} from '../../actions/utils';


import Loading from '../../components/Loading';
import MacroBox from '../../components/MacroBox';
import QuestionnaireBox from '../../components/QuestionnaireBox';


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
            workout_plans: null,
            macro_plansNext: null,
            macro_plans: null,
            tab: this.props.tab ? this.props.tab : 1,
            refreshing: false,
            training_plan: this.props.training_plan,
        }
    },

    componentDidMount() {
        this.getNeeded(true);
    },

    getNeeded(refresh = false) {
        if (this.state.tab == 1)
            this.props.getQuestionnaires(refresh);
        else if (this.state.tab == 2)
            this.getMacros(refresh);
    },

    createMacroPlan(data) {
        let jsondata = JSON.stringify(data);
        fetch(`${API_ENDPOINT}training/macros/`,
            fetchData('POST', jsondata, this.props.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
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

    updatePlan(data) {
        fetch(`${API_ENDPOINT}training/${this.props.training_plan.id}/`,
            fetchData('PATCH', JSON.stringify(data), this.props.UserToken)).then(checkStatus)
            .catch((error) => {
                console.log(error);
            });
    },

    _onTabPress(tab) {
        if (tab != this.state.tab) {
            if (tab == 1 && !this.props.Questionnaires.length) {
                this.props.getQuestionnaires(true);
            }
            else if (tab == 2 && !this.state.macro_plans) {
                this.getMacros();
            }
            this.setState({tab: tab});
        }
    },

    _refresh() {
        this.getNeeded(true)
    },

    _onEndReached() {
        if (this.state.tab == 1 && this.state.QuestionnairesNext)
            this.props.getQuestionnaires();
        else if (this.state.tab == 2 && this.state.macro_plansNext)
            this.getMacros();
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
        this.updatePlan({macro_plan: id});
        this.setState({
            training_plan: {
                ...this.state.training_plan,
                macro_plan: id
            }
        });
    },

    renderCreateBar(){
        if (this.state.tab == 1) {
            return (
                <View>
                    <QuestionnaireBox selectQuestionnaire={this.selectQuestionnaire}
                                      openModal={this.props.openModal}
                                      _redirect={this.props._redirect}/>
                    <Text style={styles.helpText}>PRESS AND HOLD TO MAKE ACTIVE</Text>
                </View>
            )
        } else if (this.state.tab == 2) {
            return (
                <View>
                    <MacroBox createMacroPlan={this.createMacroPlan}
                              training_plan={this.props.training_plan.id}
                              _redirect={this.props._redirect}/>
                    <Text style={styles.helpText}>PRESS AND HOLD TO MAKE ACTIVE</Text>
                </View>
            )
        }
        return ''
    },

    render() {
        if (!this.props.Questionnaires && !this.state.workout_plans && !this.state.macro_plans)
            return <Loading />;
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let dataSource = null;
        if (this.state.tab == 1 && this.props.Questionnaires) {
            dataSource = ds.cloneWithRows(this.props.Questionnaires);
        } else if (this.state.tab == 2 && this.state.macro_plans) {
            dataSource = ds.cloneWithRows(this.state.macro_plans);
        } else if (this.state.tab == 3 && this.state.workout_plans) {
            dataSource = ds.cloneWithRows(this.state.workout_plans);
        }
        return (
            <View style={GlobalStyle.container}>
                <View style={[styles.tabbarView, GlobalStyle.simpleBottomBorder]}>
                    <TouchableOpacity style={[styles.tabView, (this.isSelected(1)) ? styles.selectedTab : null]}
                                      onPress={this._onTabPress.bind(null, 1)}>
                        <Text>Survey</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tabView, (this.isSelected(2)) ? styles.selectedTab : null]}
                                      onPress={this._onTabPress.bind(null, 2)}>
                        <Text>Macro Plan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tabView, (this.isSelected(3)) ? styles.selectedTab : null]}
                                      onPress={this._onTabPress.bind(null, 3)}>
                        <Text>Workouts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tabView, (this.isSelected(4)) ? styles.selectedTab : null]}
                                      onPress={this._onTabPress.bind(null, 4)}>
                        <Text>Progress</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.singleColumn}>

                    {dataSource ?
                        <ListView ref='content' removeClippedSubviews={(Platform.OS !== 'ios')}
                                  renderHeader={this.renderCreateBar}
                                  style={styles.listContainer} enableEmptySections={true} dataSource={dataSource}
                                  onEndReached={this._onEndReached} onEndReachedThreshold={250}
                                  renderRow={(object) => {
                                      if (this.state.tab == 1) {
                                          return <QuestionnaireBox questionnaire={object}
                                                                   _redirect={this.props._redirect}
                                                                   selected={object.id == this.state.training_plan.questionnaire}
                                                                   selectQuestionnaire={this.selectQuestionnaire}/>
                                      } else if (this.state.tab == 2) {
                                          return <MacroBox plan={object}
                                                           selected={object.id == this.state.training_plan.macro_plan}
                                                           training_plan={this.props.training_plan.id}
                                                           selectMacroPlan={this.selectMacroPlan}
                                                           deleteMacroPlan={this.deleteMacroPlan}
                                                           _redirect={this.props._redirect}/>
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
    }
});

export default TrainingPlan;

