import React from 'react';
const CreateClass = require('create-react-class');
import {
    View,
    Text,
    StyleSheet,
    ListView,
    Platform,
    Keyboard
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import t from 'tcomb-form-native';
import moment from 'moment';
import DropdownAlert from 'react-native-dropdownalert';

import {addWeightLog, getWeightLogs} from '../../actions/homeActions';
import {fetchData, API_ENDPOINT, trunc, checkStatus, getFontSize} from '../../actions/utils';

import GlobalStyle from '../globalStyle';
import InputAccessory from '../../components/InputAccessory';


const Form = t.form.Form;

let WeightLog = t.struct({
    weight: t.Number
});


const CreateWeightLog = CreateClass({

    getInitialState() {
        return {
            value: null,
            refreshing: false,
            loading: false,
            disabled: false,
        }
    },

    componentDidMount() {
        this.props.navigation.setParams({handleSave: this._onSubmit});
        if (!this.props.WeightLogs.month.results.length) {
            this.props.actions.getWeightLogs('month', true);
        }
    },

    asyncActions(success) {
        if (success) {
            this.dropdown.alertWithType('success', 'Success', 'You have logged your daily weight.');
            this.setState({value: null});
        } else {
            this.dropdown.alertWithType('error', 'Error', "Couldn't log weight.")
        }
        this.setState({disabled: false});
    },


    _onSubmit() {
        let values = this.form.getValue();
        if (!this.state.disabled && values) {
            this.setState({disabled: true});
            values = {
                ...values,
            };
            fetch(`${API_ENDPOINT}training/weight/logs/`,
                fetchData('POST', JSON.stringify(values), this.props.UserToken)).then(checkStatus)
                .then((responseJson) => {
                    if (responseJson.id) {
                        console.log(responseJson)
                        this.props.actions.addWeightLog(responseJson);
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
                weight: {
                    onSubmitEditing: () => Keyboard.dismiss(),
                    placeholder: 'Current Weight (lb)',
                },
            }
        };
        return (
            <View>
                <View style={{margin: 10}}>
                    <Form
                        ref={(form) => this.form = form}
                        type={WeightLog}
                        options={options}
                        onChange={this.onChange}
                        value={this.state.value}
                    />
                </View>
                <Text style={styles.title}>Weight Logs</Text>
            </View>
        )
    },

    renderRow(log, set, key) {
        console.log(log)
        const created_at = moment.utc(log.created_at).local();
        return (
            <View style={styles.logBox}>
                <Text>
                    {created_at.format('MMM DD, YY')} at {created_at.format('h:mma')}
                </Text>
                <Text>{log.weight} lb</Text>
            </View>
        )
    },

    render() {

        const ListData = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.props.WeightLogs.month.results);
        return (
            <View style={GlobalStyle.container}>
                <ListView ref='schedules_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                          keyboardDismissMode='interactive'
                          keyboardShouldPersistTaps='handled'
                          style={{flex: 1}}
                          contentContainerStyle={{paddingBottom: 50}}
                          enableEmptySections={true} dataSource={ListData} showsVerticalScrollIndicator={false}
                          renderHeader={this.renderHeader}
                          renderRow={this.renderRow}
                />
                <DropdownAlert ref={(ref) => this.dropdown = ref}/>
                <InputAccessory/>
            </View>
        )
    }
});

const unfilledColor = 'rgba(0, 0, 0, 0.1)';

const styles = StyleSheet.create({
    title: {
        fontSize: getFontSize(24),
        fontFamily: 'Heebo-Bold',
        textAlign: 'center',
        color: '#1DBC8A',
    },
    logBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: '#e1e3df',
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'white',
        margin: 10,
        marginBottom: 5,
        borderRadius: 5,
    }
});

const stateToProps = (state) => {
    return {
        UserToken: state.Global.UserToken,
        WeightLogs: state.Home.WeightLogs
    };
};

const dispatchToProps = (dispatch) => {
    return {
        actions: {
            addWeightLog: bindActionCreators(addWeightLog, dispatch),
            getWeightLogs: bindActionCreators(getWeightLogs, dispatch)
        }
    }
};

export default connect(stateToProps, dispatchToProps)(CreateWeightLog);
