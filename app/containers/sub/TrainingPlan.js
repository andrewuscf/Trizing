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

import GlobalStyle from '../globalStyle';

import {API_ENDPOINT, fetchData} from '../../actions/utils';


import Loading from '../../components/Loading';
import MacroBox from '../../components/MacroBox';
import QuestionnaireBox from '../../components/QuestionnaireBox';


const TrainingPlan = React.createClass({
    propTypes: {
        clientId: React.PropTypes.number.isRequired,
        training_plan: React.PropTypes.number.isRequired,
        _redirect: React.PropTypes.func.isRequired,
        tab: React.PropTypes.number
    },

    getInitialState() {
        return {
            questionnaires: null,
            questionnairesNext: null,
            workout_plans: null,
            macro_plansNext: null,
            macro_plans: null,
            tab: this.props.tab ? this.props.tab : 1,
            refreshing: false,
            selected: {
                questionnaire: null,
                workout: null,
                macro_plan: null
            },
        }
    },

    componentDidMount() {
        this.getNeeded();
    },

    getNeeded() {
        if (this.state.tab == 1)
            this.getQuestionnaires();
        else if (this.state.tab == 2)
            this.getMacros();
    },

    createMacroPlan(data) {
        let jsondata = JSON.stringify(data);
        fetch(`${API_ENDPOINT}training/macros/`,
            fetchData('POST', jsondata, this.props.UserToken))
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({macro_plans: [
                    responseJson,
                    ...this.state.macro_plans
                ]});
                console.log(responseJson);
            })
            .catch((error) => {
                return dispatch({
                    type: types.API_ERROR, error: JSON.stringify({
                        title: 'Request could not be performed.',
                        text: 'Please try again later.'
                    })
                });
            });
    },

    getMacros(refresh = false) {
        let url = `${API_ENDPOINT}training/macros/?client=${this.props.clientId}`;
        if (!refresh && this.state.macro_plansNext)
            url = this.state.macro_plansNext;

        fetch(url,
            fetchData('GET', null, this.props.UserToken))
            .then((response) => response.json())
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

    getQuestionnaires() {
        fetch(`${API_ENDPOINT}training/questionnaires/`,
            fetchData('GET', null, this.props.UserToken))
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if (!this.state.questionnairesNext)
                    this.setState({questionnaires: responseJson.results, questionnairesNext: responseJson.next});
                else
                    this.setState({
                        questionnaires: this.state.questionnaires.concat(responseJson.results),
                        questionnairesNext: responseJson.next
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    },

    _onTabPress(tab) {
        if (tab != this.state.tab) {
            if (tab == 1 && !this.state.questionnaires) {
                this.getQuestionnaires();
            }
            else if (tab == 2 && !this.state.macro_plans) {
                this.getMacros();
            }
            this.setState({tab: tab});
        }
    },

    _refresh() {

    },

    isSelected(tab) {
        return tab == this.state.tab
    },

    selectQuestionnaire(id) {
        this.setState({
            selected: {
                ...this.state.selected,
                questionnaire: id
            }
        });
    },

    selectMacroPlan(id) {
        this.setState({
            selected: {
                ...this.state.selected,
                macro_plan: id
            }
        });
    },

    renderCreateBar(){
        if (this.state.tab == 1) {
            return <QuestionnaireBox selectQuestionnaire={this.selectQuestionnaire}
                                     _redirect={this.props._redirect}/>
        } else if (this.state.tab == 2) {
            return <MacroBox selectMacroPlan={this.selectMacroPlan}
                             createMacroPlan={this.createMacroPlan}
                             training_plan={this.props.training_plan}
                             _redirect={this.props._redirect}/>
        }
        return ''
    },

    render() {
        if (!this.state.questionnaires && !this.state.workout_plans && !this.state.macro_plans)
            return <Loading />;
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let dataSource = null;
        if (this.state.tab == 1 && this.state.questionnaires) {
            dataSource = ds.cloneWithRows(this.state.questionnaires);
        } else if (this.state.tab == 2 && this.state.macro_plans) {
            dataSource = ds.cloneWithRows(this.state.macro_plans);
        } else if (this.state.tab == 3 && this.state.workout_plans) {
            dataSource = ds.cloneWithRows(this.state.workout_plans);
        }
        return (
            <View style={GlobalStyle.container}>
                <View style={[styles.tabbarView, GlobalStyle.simpleBottomBorder]}>
                    <TouchableOpacity style={[styles.tabView, (this.isSelected(1)) ? styles.selectedText : null]}
                                      onPress={this._onTabPress.bind(null, 1)}>
                        <Text>Survey</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tabView, (this.isSelected(2)) ? styles.selectedText : null]}
                                      onPress={this._onTabPress.bind(null, 2)}>
                        <Text>Macro Plan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tabView, (this.isSelected(3)) ? styles.selectedText : null]}
                                      onPress={this._onTabPress.bind(null, 3)}>
                        <Text>Workouts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tabView, (this.isSelected(4)) ? styles.selectedText : null]}
                                      onPress={this._onTabPress.bind(null, 4)}>
                        <Text>Progress</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.singleColumn}>

                    {dataSource ?
                        <ListView ref='content' removeClippedSubviews={(Platform.OS !== 'ios')}
                                  renderHeader={this.renderCreateBar}
                                  style={styles.listContainer} enableEmptySections={true} dataSource={dataSource}
                                  renderRow={(object) => {
                                      if (this.state.tab == 1) {
                                          return <QuestionnaireBox questionnaire={object}
                                                                   _redirect={this.props._redirect}
                                                                   selected={object.id == this.state.selected.questionnaire}
                                                                   selectQuestionnaire={this.selectQuestionnaire}/>
                                      } else if (this.state.tab == 2) {
                                          return <MacroBox plan={object} selectMacroPlan={this.selectMacroPlan}
                                                           selected={object.id == this.state.selected.macro_plan}
                                                           training_plan={this.props.training_plan}
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
    selectedText: {
        borderBottomWidth: 2,
        borderBottomColor: '#1352e2',
    },
    singleColumn: {
        flex: 1,
        justifyContent: 'center',
    },
    listContainer: {
        flex: 1
    }
});

export default TrainingPlan;

