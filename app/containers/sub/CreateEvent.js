import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Keyboard,
    ScrollView
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import t from 'tcomb-form-native';
import _ from 'lodash';
import moment from 'moment';

import * as CalendarActions from '../../actions/calendarActions';
import {getFontSize} from '../../actions/utils';
// import {getRoute} from '../../routes';

import BackBar from '../../components/BackBar';
import PeopleBar from '../../components/PeopleBar';
import SelectInput from '../../components/SelectInput';
import SubmitButton from '../../components/SubmitButton';


const CreateEvent = React.createClass({
    getInitialState() {
        return {
            selected: []
        }
    },

    asyncActions(start, data = {}){
        if (start) {
            this.refs.postbutton.setState({busy: true});
        } else {
            this.refs.postbutton.setState({busy: false});
            // this.props.navigator.pop();
        }
    },


    _onSubmit() {
        let values = this.refs.form.getValue();
        if (values) {
            if (this.state.selected.length > 0) {
                let eventDate = moment(values.date);
                let startTime = moment(values.start_time);
                let endTime = moment(values.end_time);

                eventDate.set('hour', startTime.get('hour')).set('minute', startTime.get('minute')).set('second', 0);

                let endDate = eventDate.clone();
                if (startTime.get('hour') > 12 && endTime.get('hour') < 12) {
                    endDate = endDate.add(1, 'days');
                }
                endDate.set('hour', endTime.get('hour')).set('minute', endTime.get('minute')).set('second', 0);
                const data = {
                    title: values.title,
                    event_type: values.event_type,
                    start_time: eventDate.clone().utc().format("YYYY-MM-DD HH:mm:ssZ"),
                    end_time: endDate.clone().utc().format("YYYY-MM-DD HH:mm:ssZ"),
                    invited: this.state.selected
                }
                console.log(data)
                // this.props.actions.addEditEvent()

            }
        }
    },

    _cancel() {
        this.props.navigator.pop();
    },

    selectUser(userId) {
        const index = _.indexOf(this.state.selected, userId);
        if (index != -1) {
            this.setState({
                selected: [...this.state.selected.slice(0, index), ...this.state.selected.slice(index + 1)]
            });
        } else {
            this.setState({
                selected: [
                    ...this.state.selected,
                    userId
                ]
            })
        }
    },

    render: function () {
        let options = {
            i18n: {
                optional: '',
                required: '*',
            },
            stylesheet: stylesheet,
            fields: {
                title: {
                    label: 'Event title*',
                    onSubmitEditing: () => Keyboard.dismiss()
                },
                event_type: {
                    label: 'Type*',
                },
                date: {
                    mode: 'date',
                    minimumDate: moment().toDate(),
                    minuteInterval: 10,
                    config: {
                        format: (date) => myFormatFunction("MMMM DD YYYY", date),
                    }
                },
                start_time: {
                    mode: 'time',
                    minuteInterval: 10,
                    config: {
                        format: (date) => myFormatFunction("h:mma", date),
                    }
                },
                end_time: {
                    mode: 'time',
                    config: {
                        format: (date) => myFormatFunction("h:mma", date),
                        minuteInterval: 10,
                    }
                }
            }
        };
        return (
            <View style={styles.flexCenter}>
                <BackBar back={this._cancel} backText="Cancel">
                    <Text style={{fontSize: getFontSize(24)}}>Create Event</Text>
                </BackBar>
                <ScrollView style={{margin: 10}}>
                    <Form
                        ref="form"
                        type={Event}
                        options={options}
                    />
                    <Text style={stylesheet.controlLabel.normal}>Invite Clients*</Text>
                    <PeopleBar navigator={this.props.navigator}
                               people={this.props.Clients} action={this.selectUser} selected={this.state.selected}/>
                    <SubmitButton buttonStyle={styles.button}
                                  textStyle={styles.submitText} onPress={this._onSubmit} ref='postbutton'
                                  text='Create'/>
                </ScrollView>
            </View>
        )
    }
});

const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
    },
    button: {
        backgroundColor: '#00BFFF',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 30,
        paddingRight: 30,
    },
    submitText: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'OpenSans-Bold',
    }
});

let myFormatFunction = (format, date) => {
    return moment(date).format(format);
};

// T FORM SETUP
const Form = t.form.Form;
const Event_types = t.enums({
    chk: 'Check In',
    eve: 'Group Event'
});
const Occurrences = t.enums({
    0: 'One Time',
    1: 'Each Day',
    2: 'Each Week',
    3: 'Each Month'
});
const Event = t.struct({
    title: t.String,
    event_type: Event_types,
    date: t.Date,
    start_time: t.Date,
    end_time: t.Date,
    occurrence: Occurrences
});
const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

stylesheet.formGroup = {
    ...stylesheet.formGroup,
    normal: {
        ...stylesheet.formGroup.normal,
        marginBottom: 12,
        borderBottomWidth: .5,
        borderColor: '#aaaaaa',
        justifyContent: 'center',
        alignItems: 'stretch'
    },
    error: {
        ...stylesheet.formGroup.error,
        marginBottom: 12,
        borderBottomWidth: .5,
        borderColor: 'red',
        justifyContent: 'center',
        alignItems: 'stretch'
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
stylesheet.controlLabel = {
    ...stylesheet.controlLabel,
    normal: {
        ...stylesheet.controlLabel.normal,
        fontSize: getFontSize(25),
        lineHeight: getFontSize(26),
        fontFamily: 'OpenSans-Semibold',
        textAlign: 'center'
    },
    error: {
        ...stylesheet.controlLabel.error,
        fontSize: getFontSize(25),
        lineHeight: getFontSize(26),
        fontFamily: 'OpenSans-Semibold',
        textAlign: 'center'
    }
};


const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser,
        Clients: state.Home.Clients,
        ...state.Calendar
    };
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(CalendarActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(CreateEvent);
