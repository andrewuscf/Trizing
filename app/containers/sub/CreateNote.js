import React from 'react';
import {
    View,
    StyleSheet,
    Keyboard,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import t from 'tcomb-form-native';
import _ from 'lodash';
import DropdownAlert from 'react-native-dropdownalert';

import {fetchData, API_ENDPOINT, checkStatus, getFontSize} from '../../actions/utils';

import InputAccessory from '../../components/InputAccessory';

const Form = t.form.Form;
const Note = t.struct({
    text: t.String,
});

const {height: deviceHeight} = Dimensions.get('window');

const CreateNote = React.createClass({
    propTypes: {
        type: React.PropTypes.string.isRequired,
        object_id: React.PropTypes.number.isRequired,
        title: React.PropTypes.string.isRequired,
        noteAdded: React.PropTypes.func.isRequired,
    },

    getInitialState() {
        return {
            value: null,
            disabled: false,
        }
    },

    componentDidMount() {
        this.props.navigation.setParams({handleSave: this.submit, disabled: this.state.disabled});
    },

    componentDidUpdate(prevProps, prevState) {
        if (prevState.disabled !== this.state.disabled) {
            this.props.navigation.setParams({handleSave: this.submit, disabled: this.state.disabled});
        }
    },

    asyncActions(success) {
        if (success) {
            this.props.navigation.goBack();
        } else {
            this.dropdown.alertWithType('error', 'Error', "Couldn't create note.")
        }
        this.setState({disabled: false});
    },

    submit() {
        let values = this.refs.form.getValue();
        if (values) {
            values = {
                ...values,
                content_type: this.props.type,
                object_id: this.props.object_id
            };
            this.setState({disabled: true});
            fetch(`${API_ENDPOINT}training/notes/`,
                fetchData('POST', JSON.stringify(values), this.props.UserToken))
                .then(checkStatus)
                .then((responseJson) => {
                    if (responseJson.id) {
                        this.props.noteAdded(responseJson);
                        this.asyncActions(true);
                    } else {
                        this.asyncActions(false);
                    }
                }).catch((error) => {
                console.log(error);
                this.asyncActions(false);
            });
        }

    },

    onChange(value) {
        this.setState({value});
    },

    render() {
        let options = {
            auto: 'placeholders',
            stylesheet: topStyle,
            fields: {
                text: {
                    placeholder: `Add a note`,
                    // onSubmitEditing: () => this.refs.form.getComponent('duration').refs.input.focus(),
                    maxLength: 1000,
                    autoCapitalize: 'sentences',
                    multiline: true,
                }
            }
        };


        return (
            <View style={styles.container}>
                <Form
                    ref="form"
                    type={Note}
                    options={options}
                    onChange={this.onChange}
                    value={this.state.value}
                />
                <DropdownAlert ref={(ref) => this.dropdown = ref}/>
                <InputAccessory/>
            </View>
        )
    }
});


const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

const topStyle = _.cloneDeep(t.form.Form.stylesheet);

topStyle.formGroup = {
    ...topStyle.formGroup,
    normal: {
        ...topStyle.formGroup.normal,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: '#e1e3df',
        borderBottomWidth: 1,
        marginBottom: 0,
        backgroundColor: 'white'
    },
    error: {
        ...topStyle.formGroup.error,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: 'red',
        borderBottomWidth: 1,
        marginBottom: 0,
        backgroundColor: 'white'
    }
};


topStyle.textbox = {
    ...topStyle.textbox,
    normal: {
        ...topStyle.textbox.normal,
        borderWidth: 0,
        marginTop: 5,
        marginBottom: 0,
        fontSize: 24,
        minHeight: deviceHeight / 2 - 49,
    },
    error: {
        ...topStyle.textbox.error,
        borderWidth: 0,
        marginTop: 5,
        marginBottom: 0,
        fontSize: 24,
        minHeight: deviceHeight / 2 - 49,
    }
};

topStyle.textboxView = {
    ...topStyle.textboxView,
    normal: {
        ...topStyle.textboxView.normal,
        borderWidth: 0,
        borderRadius: 0,
        borderBottomWidth: 0,
        flex: 1,
        backgroundColor: 'transparent',
        minHeight: deviceHeight / 2 - 49,
    },
    error: {
        ...topStyle.textboxView.error,
        borderWidth: 0,
        borderRadius: 0,
        borderBottomWidth: 0,
        flex: 1,
        backgroundColor: 'transparent',
        minHeight: deviceHeight / 2 - 49,
    }
};


const stateToProps = (state) => {
    return state.Global;
};


export default connect(stateToProps, null)(CreateNote);
