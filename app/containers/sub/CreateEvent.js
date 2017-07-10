import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Keyboard,
    ScrollView,
    Dimensions,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import t from 'tcomb-form-native';
import _ from 'lodash';
import moment from 'moment';

import * as CalendarActions from '../../actions/calendarActions';
import {getFontSize, trunc} from '../../actions/utils';

import AvatarImage from '../../components/AvatarImage';



function template(locals) {
    return (
        <View>
            {locals.inputs.title}
            {locals.inputs.event_type}
            <View style={{borderBottomWidth: .5, borderColor: '#aaaaaa', marginBottom: 10}}>
                {locals.inputs.date}
            </View>
            <View style={{flexDirection: 'row'}}>
                <View style={{flex: .5, marginRight: 5, borderBottomWidth: .5,
                    borderColor: '#aaaaaa'}}>
                    {locals.inputs.start_time}
                </View>
                <View style={{flex: .5, borderBottomWidth: .5,
                    borderColor: '#aaaaaa'}}>
                    {locals.inputs.end_time}
                </View>
            </View>
        </View>
    );
}

const window = Dimensions.get('window');


const CreateEvent = React.createClass({
    propTypes: {
        event_type: React.PropTypes.string.isRequired,
    },

    getInitialState() {
        return {
            selected: [],
            value: {
                title: null,
                date: moment().toDate(),
                start_time: moment().add(30, 'minutes').toDate(),
                end_time: moment().add(2, 'hours').toDate(),
            },
            step: 1
        }
    },

    componentDidMount(){
        this.props.navigation.setParams({handleSave: this._onSubmit, saveText: 'Next'});
    },

    asyncActions(start, data = {}){
        if (start) {
            // on fail
        } else {
            this.props.actions.getEvents(true);
            this._back();
        }
    },

    _back() {
        this.props.navigation.goBack()
    },


    _onSubmit() {
        let values;
        if (this.refs.form) {
            values = this.refs.form.getValue();
            if (values) {
                this.props.navigation.setParams({headerTitle: 'Select Users to Invite', saveText: null});
                this.setState({step: 2});
            }
        } else if (this.state.selected.length > 0) {
            values = this.state.value;
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
                event_type: this.props.event_type,
                invited: this.state.selected,
                occurrences: [
                    {
                        start_time: eventDate.clone().utc().format("YYYY-MM-DD HH:mm:ssZ"),
                        end_time: endDate.clone().utc().format("YYYY-MM-DD HH:mm:ssZ")
                    }
                ]
            };
            this.props.actions.addEditEvent(data, this.asyncActions)

        }
    },

    _cancel() {
        if (this.state.step === 1) {
            this._back();
        } else {
            this.props.navigation.setParams({headerTitle: 'Create Event'});
            this.props.navigation.setParams({saveText: 'Next'});
            this.setState({step: 1});
        }
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

    onChange(value) {
        this.setState({value: value});
    },

    render() {
        let options = {
            i18n: {
                optional: '',
                required: '*',
            },
            template: template,
            fields: {
                title: {
                    label: 'Event title*',
                    onSubmitEditing: () => Keyboard.dismiss()
                },
                date: {
                    mode: 'date',
                    minimumDate: moment().toDate(),
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
                {this.state.step == 1 ?
                    <ScrollView style={{margin: 10}} showsVerticalScrollIndicator={false}>
                        <Form
                            ref="form"
                            type={Event}
                            options={options}
                            onChange={this.onChange}
                            value={this.state.value}
                        />
                    </ScrollView>
                    :
                    <ScrollView style={{paddingTop: 20}} showsVerticalScrollIndicator={false}
                                contentContainerStyle={{flexWrap: 'wrap', flexDirection: 'row'}}>
                        {this.props.Clients.map((client, i) => {
                            let image = client.profile.thumbnail ? client.profile.thumbnail : client.profile.avatar;
                            return (
                                <View style={styles.inviteBox} key={i}>
                                    <AvatarImage style={[styles.avatar,
                                        (_.includes(this.state.selected, client.id)) ? styles.selected : null]}
                                                 image={image}
                                                 redirect={this.selectUser.bind(null, client.id)}/>
                                    <Text style={styles.userText}>
                                        {trunc(`${client.profile.first_name} ${client.profile.last_name[0]}`.toUpperCase(), 13)}
                                    </Text>
                                </View>
                            )
                        })}
                    </ScrollView>
                }
            </View>
        )
    }
});

CreateEvent.navigationOptions = ({navigation}) => {
    const {state, setParams} = navigation;
    return {
        headerTitle: state.params && state.params.headerTitle ? state.params.headerTitle : 'Create Event'
    };
};

const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
    },
    selected: {
        borderWidth: 2,
        borderColor: 'red',
    },
    avatar: {
        height: 80,
        width: 80,
        borderRadius: 40
    },
    inviteBox: {
        width: window.width / 3,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    userText: {
        fontSize: getFontSize(18),
        marginTop: 5,
        fontFamily: 'OpenSans-SemiBold',
    },
});

let myFormatFunction = (format, date) => {
    return moment(date).format(format);
};

// T FORM SETUP
const Form = t.form.Form;
// const Occurrences = t.enums({
//     0: 'One Time',
//     1: 'Each Day',
//     2: 'Each Week',
//     3: 'Each Month'
// });
const Event = t.struct({
    title: t.String,
    date: t.Date,
    start_time: t.Date,
    end_time: t.Date,
    // occurrence: Occurrences
});


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
