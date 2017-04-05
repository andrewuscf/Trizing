import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Alert,
    Keyboard
} from 'react-native';
import {bindActionCreators} from 'redux';
import t from 'tcomb-form-native';
import _ from 'lodash';
import {connect} from 'react-redux';
import CameraRollPicker from 'react-native-camera-roll-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

import {fetchData, API_ENDPOINT} from '../../actions/utils';

import * as ProfileActions from '../../actions/profileActions';
import {removeToken} from '../../actions/globalActions';

import AvatarImage from '../../components/AvatarImage';
import BackBar from '../../components/BackBar';
import {EMPTY_AVATAR} from '../../assets/constants';
import Loading from '../../components/Loading';
import SubmitButton from '../../components/SubmitButton';

const {width: deviceWidth} = Dimensions.get('window');


const EditProfile = React.createClass({
    getInitialState() {
        let initData = {
            value: null,
            showRoll: false,
            previewImage: null,
        };
        if (this.props.RequestUser) {
            initData = {
                value: {
                    username: this.props.RequestUser.username,
                    first_name: this.props.RequestUser.profile.first_name,
                    last_name: this.props.RequestUser.profile.last_name,
                    phone_number: this.props.RequestUser.profile.phone_number,
                    type: this.props.RequestUser.type
                },
                showRoll: false,
                previewImage: null,
            }
        }
        return initData;
    },

    onChange(value) {
        this.setState({ value });
    },

    clearForm() {
        this.setState({ value: null });
    },

    componentDidUpdate(prevProps) {
        if (!prevProps.RequestUser && this.props.RequestUser) {
            this.setState({
                value: {
                    ...this.state.value,
                    username: this.props.RequestUser.username,
                    first_name: this.props.RequestUser.profile.first_name,
                    last_name: this.props.RequestUser.profile.last_name,
                    phone_number: this.props.RequestUser.profile.phone_number,
                    type: this.props.RequestUser.type ? this.props.RequestUser.type : null
                }
            })
        }
    },

    asyncActions(start){
        if (start) {
            this.refs.postbutton.setState({busy: true});
        } else {
            this.refs.postbutton.setState({busy: false});
        }
    },

    getSelectedImages(images) {
        this.setState({
            previewImage: images[0]
        });
        this.toggleRoll();
        this.refs._scrollView.scrollTo({y: 0, false});
    },

    toggleRoll() {
        this.setState({
            showRoll: !this.state.showRoll,
        });
    },

    _back() {
        this.props.navigator.pop();
    },

    _onSubmit(){
        let values = this.refs.form.getValue();
        if (values && (this.state.previewImage || this.props.RequestUser.profile.avatar)) {
            const data = {
                username: values.username,
                type: values.type
            };
            let profileData = new FormData();
            if (this.state.previewImage) {
                profileData.append("avatar", {
                    ...this.state.previewImage,
                    url: this.state.previewImage.uri,
                    name: 'image.jpg',
                    type: 'multipart/form-data'
                });
            }
            profileData.append("first_name", values.first_name);
            profileData.append("last_name", values.last_name);
            profileData.append("phone_number", values.phone_number);
            this.props.actions.updateUser(data, profileData, this.asyncActions);

        }
    },

    _logOut() {
        Alert.alert(
            'Log out',
            'Are you sure you want to log out?',
            [
                {text: 'Cancel', null, style: 'cancel'},
                {text: 'Yes', onPress: () => this.props.removeToken()},
            ]
        );
    },

    render() {
        const rollPickerWidth = deviceWidth - 20;
        const user = this.props.RequestUser;

        let options = {
            // stylesheet: stylesheet,
            fields: {
                username: {
                    // label: 'Event title*',
                    onSubmitEditing: () => this.refs.form.getComponent('first_name').refs.input.focus()
                },
                first_name: {
                    onSubmitEditing: () => this.refs.form.getComponent('last_name').refs.input.focus()
                },
                last_name: {
                    onSubmitEditing: () => this.refs.form.getComponent('phone_number').refs.input.focus()
                },
                phone_number: {
                    onSubmitEditing: () => Keyboard.dismiss()
                }
            }
        };
        // Hours available options
        if (user) {
            let userImage = EMPTY_AVATAR;
            if (this.state.previewImage) {
                userImage = this.state.previewImage.uri
            } else if (user.profile.thumbnail) {
                userImage = user.profile.thumbnail;
            } else if (user.profile.avatar) {
                userImage = user.profile.avatar;
            }

            let Profile = t.struct({
                username: t.String,
                first_name: t.String,
                last_name: t.String,
                phone_number: t.Number
            });
            if (!this.props.RequestUser.type) {
                Profile = t.struct({
                    type: ACCOUNT_Type,
                    username: t.String,
                    first_name: t.String,
                    last_name: t.String,
                    phone_number: t.Number,
                });
            }
            return (
                <View style={styles.mainContainer}>
                    {this.state.showRoll ?
                        <CameraRollPicker imageMargin={2} containerWidth={rollPickerWidth}
                                          callback={this.getSelectedImages} maximum={1} selected={[]}/>
                        : null
                    }
                    <ScrollView ref='_scrollView' keyboardDismissMode='interactive'
                                style={styles.mainContainer}>
                        <View style={styles.backNav}>
                            {this.props.RequestUser.profile.completed ?
                                <TouchableOpacity onPress={this._back} style={styles.backNavButton}>
                                    <Icon name="angle-left" size={30} color='#333333'/>
                                </TouchableOpacity>
                                : null
                            }

                            <TouchableOpacity
                                style={this.props.RequestUser.profile.completed ? styles.logOut : styles.logOutCreateProfile}
                                onPress={this._logOut}>
                                <Icon name="power-off" size={20} color='red'/>
                            </TouchableOpacity>

                        </View>
                        <View style={styles.mainContent}>
                            <AvatarImage image={userImage} style={styles.avatar} redirect={this.toggleRoll}/>

                            <Form
                                ref="form"
                                type={Profile}
                                options={options}
                                value={this.state.value}
                                onChange={this.onChange}
                            />


                        </View>
                    </ScrollView>
                    <SubmitButton buttonStyle={styles.button}
                                  textStyle={styles.submitText} onPress={this._onSubmit} ref='postbutton'
                                  text='Save'/>
                </View>
            );
        } else {
            return <Loading />
        }

    }
});

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    backNav: {
        minHeight: 50,
        borderBottomWidth: .5,
        borderBottomColor: 'rgba(0,0,0,.15)',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    backNavButton: {
        paddingLeft: 10
    },
    mainContent: {
        margin: 10
    },
    avatar: {
        alignSelf: 'center',
        height: 100,
        width: 100,
        borderRadius: 50
    },
    button: {
        backgroundColor: '#00BFFF',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 30,
        paddingRight: 30,
        width: deviceWidth,
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    submitText: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'OpenSans-Bold',
    },
    logOut: {
        paddingRight: 10,
    },
    logOutCreateProfile: {
        right: 10,
        top: 25,
        position: 'absolute'
    }
});


// T FORM SETUP
const Form = t.form.Form;
const ACCOUNT_Type = t.enums({
    1: 'Trainer',
    2: 'Client'
});

const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser
    };
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(ProfileActions, dispatch),
        removeToken: bindActionCreators(removeToken, dispatch),
    }
};

export default connect(stateToProps, dispatchToProps)(EditProfile);
