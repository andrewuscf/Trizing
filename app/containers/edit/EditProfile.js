import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Alert,
    Keyboard,
    KeyboardAvoidingView
} from 'react-native';
import {bindActionCreators} from 'redux';
import t from 'tcomb-form-native';
import _ from 'lodash';
import {connect} from 'react-redux';
import CameraRollPicker from 'react-native-camera-roll-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import FCM from 'react-native-fcm';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';

import {fetchData, API_ENDPOINT, getFontSize} from '../../actions/utils';
import {getRoute} from '../../routes';

import * as ProfileActions from '../../actions/profileActions';
import {removeToken} from '../../actions/globalActions';

import AvatarImage from '../../components/AvatarImage';
import BackBar from '../../components/BackBar';
import CameraPage from '../../components/CameraPage';
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
            imageError: false,
            showCamera: false
        };
        if (this.props.RequestUser) {
            initData = {
                ...initData,
                value: {
                    username: this.props.RequestUser.username,
                    first_name: this.props.RequestUser.profile.first_name,
                    last_name: this.props.RequestUser.profile.last_name,
                    phone_number: this.props.RequestUser.profile.phone_number,
                    type: this.props.RequestUser.type
                }
            }
        }
        return initData;
    },

    onChange(value) {
        this.setState({value});
    },

    clearForm() {
        this.setState({value: null});
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

    asyncActions(start, data = {}){
        if (start) {
            this.refs.postbutton.setState({busy: true});
        } else {
            this.refs.postbutton.setState({busy: false});
            if (data.completed && !this.props.RequestUser.profile.completed) {
                this.props.navigator.immediatelyResetRouteStack([getRoute('Home')]);
            }
        }
    },

    getSelectedImages(images) {
        this.setState({
            previewImage: images[0]
        });
        this.toggleRoll();
    },

    toggleRoll() {
        this.setState({
            showRoll: !this.state.showRoll,
        });
    },

    toggleCamera() {
        this.setState({
            showCamera: !this.state.showCamera,
        });
    },

    _back() {
        if (this.state.showRoll) {
            this.setState({showRoll: false});
        } else if (this.state.showCamera) {
            this.setState({showCamera: false});
        } else if (this.props.RequestUser.profile.completed) {
            this.props.navigator.pop();
        }

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
        if (!this.state.previewImage && !this.props.RequestUser.profile.avatar)
            this.setState({imageError: true});
        else
            this.setState({imageError: false});
    },

    _logOut() {
        const self = this;
        Alert.alert(
            'Log out',
            'Are you sure you want to log out?',
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Yes', onPress: () => {
                    const login = getRoute('Login');
                    this.props.navigator.immediatelyResetRouteStack([login]);
                    if (FCM) FCM.setBadgeNumber(0);
                    FCM.getFCMToken().then(token => {
                        self.props.removeToken(token);
                    });
                }
                },
            ]
        );
    },

    getCameraData(data) {
        this.setState({
            previewImage: {
                uri: data.mediaUri,
                path: data.path
            }
        });
        this.toggleCamera();
    },

    render() {
        const rollPickerWidth = deviceWidth;
        const user = this.props.RequestUser;

        let options = {
            // stylesheet: stylesheet,
            fields: {
                username: {
                    onSubmitEditing: () => this.refs.form.getComponent('first_name').refs.input.focus(),
                    autoCapitalize: 'words'
                },
                first_name: {
                    onSubmitEditing: () => this.refs.form.getComponent('last_name').refs.input.focus(),
                    autoCapitalize: 'words'
                },
                last_name: {
                    onSubmitEditing: () => this.refs.form.getComponent('phone_number').refs.input.focus(),
                    autoCapitalize: 'words'
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

            let content = null;
            if (this.state.showRoll) {
                content = <CameraRollPicker imageMargin={2} containerWidth={rollPickerWidth}
                                            callback={this.getSelectedImages} maximum={1} selected={[]}/>;
            } else if (this.state.showCamera) {
                content = <CameraPage passData={this.getCameraData}/>;
            } else {
                content = (
                    <ScrollView ref='_scrollView' keyboardDismissMode='interactive'
                                style={styles.mainContainer}>
                        <KeyboardAvoidingView behavior="position">
                            <View style={styles.mainContent}>
                                <Menu style={{justifyContent: 'center', alignItems: 'center'}}>
                                    <MenuTrigger>
                                        <AvatarImage image={userImage}
                                                     style={[styles.avatar, this.state.imageError ? {
                                                             borderColor: 'red',
                                                             borderWidth: 1
                                                         } : null]}/>
                                        <Text style={{alignSelf: 'center', fontSize: getFontSize(18), paddingTop: 10}}>
                                            {this.state.showRoll ? 'Close Camera Roll' : 'Change Profile Photo'}
                                        </Text>
                                    </MenuTrigger>
                                    <MenuOptions
                                        optionsContainerStyle={{alignSelf: 'center', width: 300, marginTop: 120}}>
                                        <MenuOption
                                            style={[styles.menuOption, {borderBottomWidth: 1, borderColor: 'grey'}]}
                                            onSelect={() => this.toggleRoll()} text='From Camera Roll'/>
                                        <MenuOption style={[styles.menuOption]}
                                                    onSelect={() => this.toggleCamera()}>
                                            <Text>Take New Photo</Text>
                                        </MenuOption>

                                    </MenuOptions>
                                </Menu>

                                <Form
                                    ref="form"
                                    type={Profile}
                                    options={options}
                                    value={this.state.value}
                                    onChange={this.onChange}
                                />


                            </View>
                            <SubmitButton buttonStyle={styles.button}
                                          textStyle={styles.submitText} onPress={this._onSubmit} ref='postbutton'
                                          text='Save'/>
                        </KeyboardAvoidingView>
                    </ScrollView>
                )
            }

            return (
                <View style={styles.mainContainer}>
                    <BackBar
                        back={this.props.RequestUser.profile.completed || this.state.showRoll || this.state.showCamera ? this._back : null}>
                        <TouchableOpacity style={styles.logOut} onPress={this._logOut}>
                            <Icon name="power-off" size={20} color='red'/>
                        </TouchableOpacity>
                    </BackBar>


                    {content}


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
        paddingLeft: 10,
        width: 100
    },
    mainContent: {
        margin: 10
    },
    avatar: {
        alignSelf: 'center',
        height: 120,
        width: 120,
        borderRadius: 60
    },
    button: {
        margin: 20
    },
    submitText: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'OpenSans-Bold',
    },
    logOut: {
        right: 0,
        position: 'absolute',
        padding: 10,
        paddingTop: 17,
    },
    menuOption: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
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
