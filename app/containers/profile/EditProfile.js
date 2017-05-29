import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Dimensions
} from 'react-native';
import {bindActionCreators} from 'redux';
import t from 'tcomb-form-native';
import {connect} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import {Bar} from 'react-native-progress';
import FCM from 'react-native-fcm';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';

import {getFontSize, resetNav} from '../../actions/utils';

import * as ProfileActions from '../../actions/profileActions';
import {removeToken} from '../../actions/globalActions';

import AvatarImage from '../../components/AvatarImage';
import {EMPTY_AVATAR} from '../../assets/constants';
import Loading from '../../components/Loading';
import SubmitButton from '../../components/SubmitButton';


const {width: deviceWidth} = Dimensions.get('window');

const EditProfile = React.createClass({
    getInitialState() {
        let initData = {
            value: null,
            previewImage: null,
            imageError: false,
            progress: 0
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

    componentDidMount() {
        this.props.navigation.setParams({handleSave: this._onSubmit});
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
        if (prevProps.RequestUser && prevProps.RequestUser.profile.completed != this.props.RequestUser.profile.completed) {
            this.props.navigation.dispatch(resetNav('Main'));
        }
    },

    asyncActions(progress){
        this.setState({progress: progress})
    },

    getSelectedImages(images) {
        this.setState({
            previewImage: images[0]
        });
        this.toggleRoll();
    },

    toggleRoll() {
        ImagePicker.openPicker({
            width: 200,
            height: 200,
            cropping: true,
            mediaType: 'photo',
            includeBase64: true,
        }).then(image => {
            this.setState({
                previewImage: {
                    ...image,
                    uri: image.path
                }
            });
        });
    },

    toggleCamera() {
        ImagePicker.openCamera({
            width: 200,
            height: 200,
            cropping: true,
            mediaType: 'photo',
            includeBase64: true,
        }).then(image => {
            this.setState({
                previewImage: {
                    ...image,
                    uri: image.path
                }
            });
        });

    },

    _back() {
        if (this.props.RequestUser.profile.completed) {
            this.props.navigation.goBack();
        }
    },

    _onSubmit(){
        let values = this.refs.form.getValue();
        if (values && (this.state.previewImage || this.props.RequestUser.profile.avatar)) {
            const data = {
                username: values.username,
                type: values.type
            };
            // const data = [
            //     {name: 'username', data: values.username},
            //     {name: 'profile', data: {name: 'avatar', filename: 'avatar.png',}}
            // ]
            let profileData = {
                first_name: values.first_name,
                last_name: values.last_name,
                phone_number: values.phone_number,
                avatar: {
                    ...this.state.previewImage
                }
            };
            this.props.actions.updateUser(data, profileData, this.asyncActions);
        }
        if (!this.state.previewImage && !this.props.RequestUser.profile.avatar) {
            this.setState({imageError: true});
            Alert.alert(
                'You need a profile photo',
                'Please take or select a profile photo.',
                [
                    {text: 'Okay'},
                ]
            );
        } else {
            this.setState({imageError: false});
        }

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
                    this.props.navigation.dispatch(resetNav('Login'));
                    if (FCM) FCM.setBadgeNumber(0);
                    FCM.getFCMToken().then(token => {
                        self.props.removeToken(token);
                    });
                }
                },
            ]
        );
    },

    render() {
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

            return (
                <View style={styles.mainContainer}>
                    {this.state.progress != 0 ?
                        <Bar progress={this.state.progress} width={deviceWidth} height={3} borderRadius={0}/>
                        : null
                    }

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
                                            Change Profile Photo
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
                                          textStyle={styles.submitText} onPress={this._logOut}
                                          text='Log Out'/>
                        </KeyboardAvoidingView>
                    </ScrollView>


                </View>
            );
        } else {
            return <Loading />
        }

    }
});

EditProfile.navigationOptions = {
    title: 'Edit Profile',
};


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
    save: {
        borderWidth: 1,
        borderColor: 'red',
        height: Platform.OS === 'ios' ? 44 : 56,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50
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
