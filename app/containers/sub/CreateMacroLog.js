import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ListView,
    Platform
} from 'react-native';
import {connect} from 'react-redux';
import t from 'tcomb-form-native';
import moment from 'moment';
import DropdownAlert from 'react-native-dropdownalert';


import {fetchData, API_ENDPOINT, trunc, checkStatus, getFontSize} from '../../actions/utils';

import MacroLogBox from '../../components/MacroLogBox';


const Form = t.form.Form;

let MacroLog = t.struct({
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
            disabled: false,
        }
    },

    componentDidMount() {
        this.props.navigation.setParams({handleSave: this._onSubmit});
        this.getMacroLogs()
    },

    getMacroLogs() {
        fetch(`${API_ENDPOINT}training/macros/logs/?date=${this.props.date.format("YYYY-MM-DD")}`,
            fetchData('GET', null, this.props.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                this.setState({
                    macro_response: responseJson,
                    refreshing: false
                })
            });
    },

    asyncActions(sucess) {
        if (sucess) {
            this.dropdown.alertWithType('success', 'Success', 'You have logged your daily nutrition.')
        } else {
            this.dropdown.alertWithType('error', 'Error', "Couldn't log nutrition.")
        }
        this.setState({disabled: false});
    },


    _onSubmit() {
        let values = this.refs.form.getValue();
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
                        this.asyncActions(true);
                        this.setState({
                            macro_response: {
                                ...this.state.macro_response,
                                results: [
                                    responseJson,
                                    ...this.state.macro_response.results
                                ]
                            }
                        })
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
            fields: {
                fats: {
                    onSubmitEditing: () => this.refs.form.getComponent('carbs').refs.input.focus()
                },
                carbs: {
                    onSubmitEditing: () => this.refs.form.getComponent('protein').refs.input.focus()
                },
                protein: {
                    onSubmitEditing: () => this._onSubmit()
                },
            }
        };
        // let calories = 0;
        const fats = (this.props.macro_plan_day.fats) ? this.props.macro_plan_day.fats : 0;
        const protein = (this.props.macro_plan_day.protein) ? this.props.macro_plan_day.protein : 0;
        const carbs = (this.props.macro_plan_day.carbs) ? this.props.macro_plan_day.carbs : 0;
        // calories = (9 * fats) + (4 * protein) + (4 * carbs);
        return (
            <View>
                <Text style={[styles.title]}>Nutrition for the day</Text>
                <View style={[styles.row, {justifyContent: 'space-between', alignItems: 'center', paddingTop: 10}]}>
                    <View style={styles.details}>
                        <Text style={styles.sectionTitle}>Fats</Text>
                        <Text style={styles.smallText}>{`${fats}g`}</Text>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.sectionTitle}>Carbs</Text>
                        <Text style={styles.smallText}>{`${carbs}g`}</Text>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.sectionTitle}>Protein</Text>
                        <Text style={styles.smallText}>{`${protein}g`}</Text>
                    </View>
                </View>
                <View style={{margin: 10}}>
                    <Form
                        ref="form"
                        type={MacroLog}
                        options={options}
                        onChange={this.onChange}
                        value={this.state.value}
                    />
                </View>
                <Text>Logs</Text>
            </View>
        )
    },

    renderRow(log, set, key) {
        return <MacroLogBox log={log} isLast={key == this.state.macro_response.results.length-1}/>
    },

    render() {

        const ListData = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.state.macro_response.results);
        return (
            <View style={styles.flexCenter}>
                <ListView ref='schedules_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                          enableEmptySections={true} dataSource={ListData} showsVerticalScrollIndicator={false}
                          renderHeader={this.renderHeader}
                          renderRow={this.renderRow}
                />
                <DropdownAlert ref={(ref) => this.dropdown = ref}/>
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
        fontFamily: 'OpenSans-Bold',
    },
    title: {
        fontSize: getFontSize(26),
        fontFamily: 'OpenSans-Bold',
        textAlign: 'center',
        marginTop: 20
    },
    row: {
        flexDirection: 'row',
    },
    sectionTitle: {
        fontSize: getFontSize(20),
        lineHeight: getFontSize(26),
        fontFamily: 'OpenSans-Bold',
    },
    details: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: 'transparent',
        paddingTop: 3,
        paddingBottom: 3,
        alignItems: 'center'
    },

});


const stateToProps = (state) => {
    return {
        UserToken: state.Global.UserToken
    };
};

export default connect(stateToProps, null)(CreateMacroLog);
