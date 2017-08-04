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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Bar} from 'react-native-progress';
import _ from 'lodash';


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
        // let calories = 0;
        const fats = (this.props.macro_plan_day.fats) ? this.props.macro_plan_day.fats : 0;
        const protein = (this.props.macro_plan_day.protein) ? this.props.macro_plan_day.protein : 0;
        const carbs = (this.props.macro_plan_day.carbs) ? this.props.macro_plan_day.carbs : 0;
        // calories = (9 * fats) + (4 * protein) + (4 * carbs);


        let currentFats = 0;
        let currentcarbs = 0;
        let currentprotein = 0;
        this.state.macro_response.results.forEach((log) => {
            currentFats += log.fats;
            currentcarbs += log.carbs;
            currentprotein += log.protein;
        });
        // let calories = (9 * currentFats) + (4 * currentcarbs) + (4 * currentprotein);
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
                        <Bar progress={currentcarbs / carbs} width={80}
                             borderWidth={0} height={5} borderRadius={20} unfilledColor="grey"/>
                        <Text style={styles.smallText}>{`${carbs - currentcarbs}g left`}</Text>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.sectionTitle}>Protein</Text>
                        <Text style={styles.smallText}>{`${protein}g`}</Text>
                        <Bar progress={currentprotein / protein} width={80}
                             borderWidth={0} height={5} borderRadius={20} unfilledColor="grey"/>
                        <Text style={styles.smallText}>{`${protein - currentprotein}g left`}</Text>
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

    render() {

        const ListData = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.state.macro_response.results);
        return (
            <View style={{flex: 1}}>
                <KeyboardAwareScrollView style={styles.flexCenter}>
                    <ListView ref='schedules_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                              enableEmptySections={true} dataSource={ListData} showsVerticalScrollIndicator={false}
                              renderHeader={this.renderHeader}
                              renderRow={this.renderRow}
                    />
                    <DropdownAlert ref={(ref) => this.dropdown = ref}/>
                </KeyboardAwareScrollView>
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

export default connect(stateToProps, null)(CreateMacroLog);
