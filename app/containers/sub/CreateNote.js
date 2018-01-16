import React from 'react';
const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    Dimensions,
    Text
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import t from 'tcomb-form-native';
import _ from 'lodash';

import {fetchData, API_ENDPOINT, checkStatus, getFontSize} from '../../actions/utils';
import GlobalStyle from '../../containers/globalStyle';

import InputAccessory from '../../components/InputAccessory';
import {appMessage} from "../../actions/homeActions";


const Form = t.form.Form;
const Note = t.struct({
    text: t.String,
});

const {height: deviceHeight} = Dimensions.get('window');

const CreateNote = CreateClass({
    propTypes: {
        type: PropTypes.string.isRequired,
        object_id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        noteAdded: PropTypes.func.isRequired,
        exerciseId: PropTypes.number
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
            this.props.actions.appMessage("Couldn't create note.", null, "red");
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
            if (this.props.exerciseId) {
                values = {
                    ...values,
                    exercise: this.props.exerciseId
                }
            }
            this.setState({disabled: true});
            fetch(`${API_ENDPOINT}training/notes/`,
                fetchData('POST', JSON.stringify(values), this.props.UserToken))
                .then(checkStatus)
                .then((responseJson) => {
                    console.log(responseJson)
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
                <View style={[GlobalStyle.simpleBottomBorder, styles.headerContainer]}>
                    <Text style={styles.smallBold}>{this.props.title}</Text>
                </View>
                <Form
                    ref="form"
                    type={Note}
                    options={options}
                    onChange={this.onChange}
                    value={this.state.value}
                />
                <InputAccessory/>
            </View>
        )
    }
});


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerContainer: {
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: 'white'
    },
    smallBold: {
        fontSize: 16,
        fontFamily: 'Heebo-Bold',
        paddingLeft: 10,
        paddingBottom: 5
    },
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

const dispatchToProps = (dispatch) => {
    return {
        actions: {
            appMessage: bindActionCreators(appMessage, dispatch)
        }
    }
};

export default connect(stateToProps, dispatchToProps)(CreateNote);
