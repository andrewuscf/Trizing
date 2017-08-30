import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ListView,
    Platform,
    Dimensions
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import t from 'tcomb-form-native';
import moment from 'moment';
import DropdownAlert from 'react-native-dropdownalert';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Bar} from 'react-native-progress';
import _ from 'lodash';

import {addMacroLog} from '../../actions/homeActions';


import {fetchData, API_ENDPOINT, trunc, checkStatus, getFontSize} from '../../actions/utils';


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
                        this.setState({
                            macro_response: {
                                ...this.state.macro_response,
                                results: [
                                    responseJson,
                                    ...this.state.macro_response.results
                                ]
                            }
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
            stylesheet: stylesheet,
            fields: {
                name: {
                    onSubmitEditing: () => this.form.getComponent('fats').refs.input.focus(),
                    label: 'Food name',
                    placeholder: 'required',
                    autoCapitalize: 'words',
                    maxLength: 100
                },
                fats: {
                    onSubmitEditing: () => this.form.getComponent('carbs').refs.input.focus(),
                    placeholder: 'required'
                },
                carbs: {
                    onSubmitEditing: () => this.form.getComponent('protein').refs.input.focus(),
                    placeholder: 'required'
                },
                protein: {
                    onSubmitEditing: () => this._onSubmit(),
                    placeholder: 'required'
                },
            }
        };
        const fats = (this.props.macro_plan_day.fats) ? this.props.macro_plan_day.fats : 0;
        const protein = (this.props.macro_plan_day.protein) ? this.props.macro_plan_day.protein : 0;
        const carbs = (this.props.macro_plan_day.carbs) ? this.props.macro_plan_day.carbs : 0;


        let currentFats = this.props.macro_plan_day.current_logs.fats ? this.props.macro_plan_day.current_logs.fats : 0;
        let currentCarbs = this.props.macro_plan_day.current_logs.carbs ? this.props.macro_plan_day.current_logs.carbs : 0;
        let currentProtein = this.props.macro_plan_day.current_logs.protein ? this.props.macro_plan_day.current_logs.protein : 0;

        return (
            <View>
                <View style={[styles.row, {justifyContent: 'space-between', alignItems: 'center', paddingTop: 10}]}>
                    <View style={styles.details}>
                        <Text style={styles.sectionTitle}>Fats</Text>
                        <Text style={styles.smallText}>{`${fats}g`}</Text>
                        <Bar progress={currentFats / fats} width={80}
                             borderWidth={0} height={5} borderRadius={20} unfilledColor="grey"/>
                        <Text style={styles.smallText}>{`${fats - currentFats}g left`}</Text>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.sectionTitle}>Carbs</Text>
                        <Text style={styles.smallText}>{`${carbs}g`}</Text>
                        <Bar progress={currentCarbs / carbs} width={80}
                             borderWidth={0} height={5} borderRadius={20} unfilledColor="grey"/>
                        <Text style={styles.smallText}>{`${carbs - currentCarbs}g left`}</Text>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.sectionTitle}>Protein</Text>
                        <Text style={styles.smallText}>{`${protein}g`}</Text>
                        <Bar progress={currentProtein / protein} width={80}
                             borderWidth={0} height={5} borderRadius={20} unfilledColor="grey"/>
                        <Text style={styles.smallText}>{`${protein - currentProtein}g left`}</Text>
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
    details: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: 'transparent',
        paddingTop: 3,
        paddingBottom: 3,
        alignItems: 'center'
    },
    totalBox: {
        paddingTop: 10,
        paddingBottom: 10,
        marginRight: 10,
        marginLeft: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});


const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

stylesheet.formGroup = {
    ...stylesheet.formGroup,
    normal: {
        ...stylesheet.formGroup.normal,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: '#e1e3df',
        borderBottomWidth: 1,
    },
    error: {
        ...stylesheet.formGroup.error,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: 'red',
        borderBottomWidth: 1,
    }
};

stylesheet.textbox = {
    ...stylesheet.textbox,
    normal: {
        ...stylesheet.textbox.normal,
        borderWidth: 0,
        marginBottom: 0,
        textAlign: 'center'
    },
    error: {
        ...stylesheet.textbox.error,
        borderWidth: 0,
        marginBottom: 0,
        textAlign: 'center'
    }
};

stylesheet.textboxView = {
    ...stylesheet.textboxView,
    normal: {
        ...stylesheet.textboxView.normal,
        borderWidth: 0,
        borderRadius: 0,
        borderBottomWidth: 0,
        flex: 1,
        backgroundColor: 'transparent',
    },
    error: {
        ...stylesheet.textboxView.error,
        borderWidth: 0,
        borderRadius: 0,
        borderBottomWidth: 0,
        flex: 1,
        backgroundColor: 'transparent',
    }
};

stylesheet.controlLabel.normal.flex = 1;
stylesheet.controlLabel.error.flex = 1;
stylesheet.controlLabel.normal.marginLeft = 5;
stylesheet.controlLabel.error.marginLeft = 5;


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
