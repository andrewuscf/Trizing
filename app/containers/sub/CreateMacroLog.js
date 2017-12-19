import React from 'react';

const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
    ListView,
    Platform
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import t from 'tcomb-form-native';
import moment from 'moment';
import DropdownAlert from 'react-native-dropdownalert';
import {Circle} from 'react-native-progress';
import _ from 'lodash';

import {addMacroLog, deleteMacroLog} from '../../actions/homeActions';
import {fetchData, API_ENDPOINT, trunc, checkStatus, getFontSize} from '../../actions/utils';

import GlobalStyle from '../globalStyle';
import InputAccessory from '../../components/InputAccessory';
import MacroLogBox from '../../components/MacroLogBox';


const Form = t.form.Form;

let MacroLog = t.struct({
    name: t.String,
    fats: t.Number,
    carbs: t.Number,
    protein: t.Number
});


const CreateMacroLog = CreateClass({
    propTypes: {
        macro_plan_day: PropTypes.object.isRequired,
        date: PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            value: null,
            macro_response: {
                results: [],
                next: null
            },
            recent_logs: [],
            refreshing: false,
            loading: false,
            disabled: false,
            currentFats: this.props.macro_plan_day.current_logs.fats ? this.props.macro_plan_day.current_logs.fats : 0,
            currentCarbs: this.props.macro_plan_day.current_logs.carbs ? this.props.macro_plan_day.current_logs.carbs : 0,
            currentProtein: this.props.macro_plan_day.current_logs.protein ? this.props.macro_plan_day.current_logs.protein : 0,
        }
    },

    componentDidMount() {
        this.props.navigation.setParams({handleSave: this._onSubmit});
        this.getMacroLogs();
        this.getRecentLogs();
    },

    getRecentLogs() {
        const url = `${API_ENDPOINT}training/macros/logs/?end_date=${this.props.date.format("YYYY-MM-DD")}`;
        fetch(url, fetchData('GET', null, this.props.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                if (responseJson) {
                    this.setState({
                        recent_logs: responseJson.results
                    });
                }
            }).catch(() => {
            console.log('error')
        });
    },

    getMacroLogs(url = `${API_ENDPOINT}training/macros/logs/?date=${this.props.date.format("YYYY-MM-DD")}`) {
        this.setState({loading: true});

        fetch(url, fetchData('GET', null, this.props.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                if (responseJson) {
                    this.setState({
                        macro_response: {
                            ...responseJson,
                            results: [
                                ...this.state.macro_response.results,
                                ...responseJson.results
                            ],
                        },
                        refreshing: false,
                        loading: false
                    });
                }
            });
    },

    asyncActions(success) {
        if (success) {
            this.dropdown.alertWithType('success', 'Success', 'You have logged your daily nutrition.');
            this.setState({value: null});
        } else {
            this.dropdown.alertWithType('error', 'Error', "Couldn't log nutrition.")
        }
        this.setState({disabled: false});
    },


    _onSubmit() {
        let values = this.form.getValue();
        if (!this.state.disabled && values) {
            this.setState({disabled: true});
            values = {
                ...values,
                macro_plan_day: this.props.macro_plan_day.id,
                date: this.props.date.format("YYYY-MM-DD")
            };
            fetch(`${API_ENDPOINT}training/macros/logs/`,
                fetchData('POST', JSON.stringify(values), this.props.UserToken)).then(checkStatus)
                .then((responseJson) => {
                    if (responseJson.id) {
                        this.props.actions.addMacroLog(responseJson);
                        this.setState({
                            macro_response: {
                                ...this.state.macro_response,
                                results: [
                                    responseJson,
                                    ...this.state.macro_response.results
                                ]
                            },
                            currentFats: this.state.currentFats + responseJson.fats,
                            currentCarbs: this.state.currentCarbs + responseJson.carbs,
                            currentProtein: this.state.currentProtein + responseJson.protein
                        });
                        this.asyncActions(true);
                    } else {
                        this.asyncActions(false);
                    }

                }).catch((error) => this.asyncActions(false));
        }
    },

    onChange(value) {
        this.setState({value});
    },

    renderHeader() {
        let options = {
            auto: 'placeholders',
            fields: {
                name: {
                    onSubmitEditing: () => this.form.getComponent('fats').refs.input.focus(),
                    // label: 'Food name',
                    placeholder: 'Food Name',
                    autoCapitalize: 'words',
                    maxLength: 100
                },
                fats: {
                    onSubmitEditing: () => this.form.getComponent('carbs').refs.input.focus(),
                    placeholder: 'Fats (g)'
                },
                carbs: {
                    onSubmitEditing: () => this.form.getComponent('protein').refs.input.focus(),
                    placeholder: 'Carbs (g)'
                },
                protein: {
                    onSubmitEditing: () => this._onSubmit(),
                    placeholder: 'Protein (g)'
                },
            }
        };
        const fats = (this.props.macro_plan_day.fats) ? this.props.macro_plan_day.fats : 0;
        const protein = (this.props.macro_plan_day.protein) ? this.props.macro_plan_day.protein : 0;
        const carbs = (this.props.macro_plan_day.carbs) ? this.props.macro_plan_day.carbs : 0;

        return (
            <View>

                <View style={[styles.row, {
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: 10,
                    paddingBottom: 10
                }]}>
                    <View style={styles.details}>
                        <Circle size={getFontSize(60)}
                                progress={this.state.currentFats !== 0 ? (this.state.currentFats / fats) : 0}
                                unfilledColor={unfilledColor} borderWidth={0} color="#1fc16c"
                                thickness={5} formatText={() => "Fats"} showsText={true}/>
                        <Text
                            style={[styles.smallText, (fats - this.state.currentFats < 0) ? GlobalStyle.redText : null]}>
                            {`${fats - this.state.currentFats}g ${(fats - this.state.currentFats < 0) ? 'over' : 'left'}`}
                        </Text>
                    </View>
                    <View style={styles.details}>
                        <Circle size={getFontSize(60)}
                                progress={this.state.currentCarbs !== 0 ? (this.state.currentCarbs / carbs) : 0}
                                unfilledColor={unfilledColor} borderWidth={0} color="#a56dd1"
                                thickness={5} formatText={() => "Carbs"} showsText={true}/>
                        <Text
                            style={[styles.smallText, (carbs - this.state.currentCarbs < 0) ? GlobalStyle.redText : null]}>
                            {`${carbs - this.state.currentCarbs}g ${(carbs - this.state.currentCarbs < 0) ? 'over' : 'left'}`}
                        </Text>
                    </View>
                    <View style={styles.details}>
                        <Circle size={getFontSize(60)}
                                progress={this.state.currentProtein !== 0 ? (this.state.currentProtein / protein) : 0}
                                unfilledColor={unfilledColor} borderWidth={0} color="#07a8e2"
                                thickness={5} formatText={() => "Protein"} showsText={true}/>
                        <Text
                            style={[styles.smallText, (protein - this.state.currentProtein < 0) ? GlobalStyle.redText : null]}>
                            {`${protein - this.state.currentProtein}g ${(protein - this.state.currentProtein < 0) ? 'over' : 'left'}`}
                        </Text>
                    </View>
                </View>
                <View style={{margin: 10}}>
                    <Form
                        ref={(form) => this.form = form}
                        type={MacroLog}
                        options={options}
                        onChange={this.onChange}
                        value={this.state.value}
                    />
                </View>
            </View>
        )
    },

    quickAdd(log) {
        this.setState({
            value: {
                name: log.name,
                fats: log.fats,
                carbs: log.carbs,
                protein: log.protein
            }
        });
        setTimeout(() => {
            this._onSubmit();
            this.refs.main_list.scrollTo({y: 0});
        }, 50);
    },

    deleteLog(log) {
        const logId = log.id;
        const oldState = _.cloneDeep(this.state);
        const index = _.findIndex(this.state.macro_response.results, {id: logId});
        this.setState({
            macro_response: {
                ...this.state.macro_response,
                results: this.state.macro_response.results.slice(0, index).concat(this.state.macro_response.results.slice(index + 1))
            },
            currentFats: this.state.currentFats - log.fats,
            currentCarbs: this.state.currentCarbs - log.carbs,
            currentProtein: this.state.currentProtein - log.protein
        });
        fetch(`${API_ENDPOINT}training/macro/log/${logId}/`, fetchData('DELETE', null, this.props.UserToken))
            .then(checkStatus).then(()=>{this.props.actions.deleteMacroLog(log)})
            .catch(() => {
                this.dropdown.alertWithType('error', 'Error', "Couldn't delete log nutrition.");
                this.setState({
                    ...oldState
                })
            });
    },

    renderRow(log, set, key) {
        return <MacroLogBox log={log} quickAdd={this.quickAdd} deleteLog={this.deleteLog}/>
    },

    renderSectionHeader(sectionData, category) {
        if (!sectionData.length) return null;
        return (
            <View>
                <Text style={styles.title}>{category}</Text>
            </View>
        );
    },


    _onEndReached() {
        if (this.state.macro_response.next && !this.state.loading) this.getMacroLogs(this.state.macro_response.next);
    },


    render() {

        const ListData = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        }).cloneWithRowsAndSections({
            "Today's Logs": this.state.macro_response.results,
            "Previous Logs": this.state.recent_logs
        });
        return (
            <View style={{flex: 1}}>
                <ListView ref='main_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                          keyboardDismissMode='interactive'
                          keyboardShouldPersistTaps='handled'
                          style={{flex: 1}}
                          enableEmptySections={true} dataSource={ListData} showsVerticalScrollIndicator={false}
                          renderHeader={this.renderHeader}
                          renderSectionHeader={this.renderSectionHeader}
                          renderRow={this.renderRow}
                          onEndReached={this._onEndReached}
                          onEndReachedThreshold={400}
                />
                <DropdownAlert ref={(ref) => this.dropdown = ref}/>
                <InputAccessory/>
            </View>
        )
    }
});

CreateMacroLog.navigationOptions = ({navigation}) => {
    const {state, setParams} = navigation;
    const date = state.params.date ? state.params.date.format("MMMM DD, YYYY") : moment().format("MMMM DD, YYYY");
    return {
        headerTitle: date
    }
};

const unfilledColor = 'rgba(0, 0, 0, 0.1)';

const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
    },
    title: {
        fontSize: getFontSize(24),
        fontFamily: 'Heebo-Bold',
        textAlign: 'center',
        color: '#1DBC8A',
    },
    row: {
        flexDirection: 'row',
    },
    sectionTitle: {
        fontSize: getFontSize(20),
        fontFamily: 'Heebo-Bold',
        color: '#00AFA3'
    },
    details: {
        flexDirection: 'column',
        flex: 1,
        paddingTop: 5,
        alignItems: 'center'
    },
    smallText: {
        paddingTop: 5,
        color: '#00AFA3',
    }
});

const stateToProps = (state) => {
    return {
        UserToken: state.Global.UserToken
    };
};

const dispatchToProps = (dispatch) => {
    return {
        actions: {
            addMacroLog: bindActionCreators(addMacroLog, dispatch),
            deleteMacroLog: bindActionCreators(deleteMacroLog, dispatch)
        }
    }
};

export default connect(stateToProps, dispatchToProps)(CreateMacroLog);
