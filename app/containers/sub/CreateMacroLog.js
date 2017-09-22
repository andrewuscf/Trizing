import React from 'react';
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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Bar, Circle} from 'react-native-progress';
import _ from 'lodash';

import {addMacroLog} from '../../actions/homeActions';
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


const CreateMacroLog = React.createClass({
    propTypes: {
        macro_plan_day: React.PropTypes.object.isRequired,
        date: React.PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            value: null,
            macro_response: {
                results: [],
                next: null
            },
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
        this.getMacroLogs()
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
                        console.log(responseJson.protein)
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
                <Text style={styles.title}>Nutrition Logs</Text>
            </View>
        )
    },

    renderRow(log, set, key) {
        return <MacroLogBox log={log}/>
    },

    _onEndReached() {
        if (this.state.macro_response.next && !this.state.loading) this.getMacroLogs(this.state.macro_response.next);
    },


    render() {

        const ListData = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.state.macro_response.results);
        return (
            <View style={{flex: 1}}>
                <ListView ref='schedules_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                          keyboardDismissMode='interactive'
                          keyboardShouldPersistTaps='handled'
                          style={{flex: 1}}
                          enableEmptySections={true} dataSource={ListData} showsVerticalScrollIndicator={false}
                          renderHeader={this.renderHeader}
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
    submitText: {
        color: 'white',
        fontSize: getFontSize(22),
        fontFamily: 'Heebo-Bold',
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
    totalBox: {
        paddingTop: 10,
        paddingBottom: 10,
        marginRight: 10,
        marginLeft: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
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
        actions: {addMacroLog: bindActionCreators(addMacroLog, dispatch)}
    }
};

export default connect(stateToProps, dispatchToProps)(CreateMacroLog);
