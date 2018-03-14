import React from 'react';

const CreateClass = require('create-react-class');
import {
    StyleSheet,
    Text,
    View,
    Alert,
    Keyboard,
    Dimensions,
    Platform,
    AsyncStorage
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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import InputAccessory from '../../components/InputAccessory';

import {getFontSize, resetNav} from '../../actions/utils';

import * as ProfileActions from '../../actions/profileActions';
import {removeToken} from '../../actions/globalActions';
import {EMPTY_AVATAR} from '../../assets/constants';

import AvatarImage from '../../components/AvatarImage';
import Loading from '../../components/Loading';
import SubmitButton from '../../components/SubmitButton';


const {width: deviceWidth} = Dimensions.get('window');

function formatPhoneNumber(s) {
    if (!s) return s;
    s = s.split("-").join(""); // remove hyphens
    return s.match(new RegExp('.{1,4}$|.{1,3}', 'g')).join("-");
}

const myFormatFunction = (format, date) => {
    return moment(date).format(format);
};


const EditProfile = CreateClass({
    getInitialState() {
        let initData = {
            value: null,
            previewImage: null,
            imageError: false,
            progress: 0
        };
        const user = this.props.RequestUser;
        if (user) {
            initData = {
                ...initData,
                date_of_birth: user.profile.date_of_birth ? moment(user.profile.date_of_birth) : null,
                value: {
                    username: user.username,
                    first_name: user.profile.first_name,
                    last_name: user.profile.last_name,
                    phone_number: user.profile.phone_number,
                    type: user.type,
                    date_of_birth: user.profile.date_of_birth ? moment(user.profile.date_of_birth).toDate() : null,
                    gender: user.profile.gender ? user.profile.gender.toString() : null,
                }
            }
        }
        return initData;
    },

    onChange(value) {
        this.setState({
            value: value,
            date_of_birth: value.date_of_birth ? value.date_of_birth : this.state.date_of_birth,
        });
    },

    componentDidMount() {
        this.props.navigation.setParams({handleSave: this._onSubmit});
    },

    componentDidUpdate(prevProps) {
        const user = this.props.RequestUser;
        if (!prevProps.RequestUser && user) {
            this.setState({
                value: {
                    ...this.state.value,
                    username: user.username,
                    first_name: user.profile.first_name,
                    last_name: user.profile.last_name,
                    phone_number: user.profile.phone_number,
                    type: user.type ? this.props.RequestUser.type : null,
                    date_of_birth: user.profile.date_of_birth ? moment(user.profile.date_of_birth).toDate() : null,
                    gender: user.profile.gender ? user.profile.gender.toString() : null,
                }
            })
        }
        if (user && prevProps.RequestUser && prevProps.RequestUser.profile.completed !== user.profile.completed) {
            AsyncStorage.getItem('deep_link', (err, result) => {
                if (result) {
                    this._handleOpenURL(result);
                    AsyncStorage.removeItem('deep_link');
                } else {
                    this.props.navigation.dispatch(resetNav('Home'));
                }
            });
        }
    },

    _handleOpenURL(url) {
        const parsedUrl = this._urlToPathAndParams(url);
        if (parsedUrl) {
            const {path, params} = parsedUrl;
            const action = AppNavigator.router.getActionForPathAndParams(path, params);
            if (action) {
                this.props.navigation.dispatch(action);
            }
        }
    },

    _urlToPathAndParams(url) {
        const params = {};
        const delimiter = this.props.uriPrefix || '://';
        let path = url.split(delimiter)[1];
        if (typeof path === 'undefined') {
            path = url;
        }
        return {
            path,
            params,
        };
    },

    asyncActions(progress) {
        this.setState({progress: progress})
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

    _onSubmit() {
        let values = this.refs.form.getValue();
        if (values && (this.state.previewImage || this.props.RequestUser.profile.avatar) && this.state.date_of_birth) {
            const age = moment().diff(moment(this.state.date_of_birth), 'years');
            if (age < 13) {
                Alert.alert(
                    'Minimum age is 13 years old',
                    '',
                    [
                        {text: 'OK'}
                    ]
                );
                return;
            }

            const data = {
                username: values.username,
                type: values.type
            };
            let profileData = {
                first_name: values.first_name,
                last_name: values.last_name,
                phone_number: values.phone_number,
                avatar: {
                    ...this.state.previewImage
                },
                date_of_birth: moment(values.date_of_birth).format("YYYY-MM-DD"),
                gender: values.gender,
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
        Alert.alert(
            'Log out',
            'Are you sure you want to log out?',
            [
                {
                    text: 'Yes', onPress: () => {
                        if (FCM) FCM.setBadgeNumber(0);
                        this.props.removeToken(()=> this.props.navigation.dispatch(resetNav('SplashScreen')));
                    }
                },
                {text: 'Cancel', style: 'cancel'},
            ]
        );
    },

    render() {
        const user = this.props.RequestUser;
        let options = {
            auto: 'placeholders',
            fields: {
                type: {
                    nullOption: {value: '', text: 'Choose a Profile Type'},
                },
                username: {
                    onSubmitEditing: () => this.refs.form.getComponent('first_name').refs.input.focus(),
                    autoCapitalize: 'words'
                },
                date_of_birth: {
                    mode: 'date',
                    maximumDate: moment().add(1, "years").toDate(),
                    config: {
                        format: (date) => {
                            if (!this.state.date_of_birth) {
                                return 'Birthday'
                            } else {
                                return myFormatFunction("MMMM DD YYYY", date)
                            }
                        },
                    },
                    hasError: !this.state.date_of_birth
                },
                gender: {
                    nullOption: {value: '', text: 'Gender'},
                },
                first_name: {
                    onSubmitEditing: () => this.refs.form.getComponent('last_name').refs.input.focus(),
                    autoCapitalize: 'words'
                },
                last_name: {
                    onSubmitEditing: () => this.refs.form.getComponent('phone_number').refs.input.focus(),
                    autoCapitalize: 'words',
                },
                phone_number: {
                    onSubmitEditing: () => Keyboard.dismiss(),
                    keyboardType: 'number-pad',
                    transformer: {
                        format: (value) => formatPhoneNumber(value),
                        parse: (value) => {
                            if (value) return value.split("-").join("");
                            return value;
                        }
                    }
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
                date_of_birth: t.Date,
                gender: GENDER_TYPES,
                first_name: t.String,
                last_name: t.String,
                phone_number: t.String
            });
            if (!this.props.RequestUser.type) {
                Profile = t.struct({
                    type: ACCOUNT_Type,
                    username: t.String,
                    date_of_birth: t.Date,
                    gender: GENDER_TYPES,
                    first_name: t.String,
                    last_name: t.String,
                    phone_number: t.String,
                });
            }

            return (
                <View style={styles.mainContainer}>
                    {this.state.progress !== 0 ?
                        <Bar progress={this.state.progress} width={deviceWidth} height={3} borderRadius={0}/>
                        : null
                    }

                    <KeyboardAwareScrollView ref='_scrollView' keyboardDismissMode='interactive'
                                             style={styles.mainContainer}>
                        <Menu style={styles.menuStyling}>
                            <MenuTrigger>
                                <AvatarImage image={userImage}
                                             style={[styles.avatar, this.state.imageError ? {
                                                 borderColor: '#a94442',
                                                 borderWidth: 1
                                             } : null]}/>
                                <Text style={styles.changePhotoText}>
                                    Change Photo
                                </Text>
                            </MenuTrigger>
                            <MenuOptions
                                optionsContainerStyle={{alignSelf: 'center', width: 300, marginTop: 120}}>
                                <MenuOption
                                    style={[styles.menuOption, {borderBottomWidth: .5, borderColor: 'grey'}]}
                                    onSelect={this.toggleRoll} text='From Camera Roll'/>
                                <MenuOption style={[styles.menuOption]}
                                            onSelect={this.toggleCamera}>
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

                        <SubmitButton onPress={this._logOut}
                                      text='LOG OUT'/>


                    </KeyboardAwareScrollView>
                    <InputAccessory/>

                </View>
            );
        } else {
            return <Loading/>
        }

    }
});

EditProfile.navigationOptions = {
    title: 'Edit Profile',
};


const GENDER_TYPES = t.enums({
    1: 'Male',
    2: 'Female',
});


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    menuStyling: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    avatar: {
        alignSelf: 'center',
        height: 80,
        width: 80,
        borderRadius: 40,
    },
    menuOption: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    changePhotoText: {
        alignSelf: 'center',
        paddingTop: 10,
        fontFamily: 'Heebo-Medium'
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
        RequestUser: state.Global.RequestUser,
        UserToken: state.Global.UserToken
    };
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(ProfileActions, dispatch),
        removeToken: bindActionCreators(removeToken, dispatch),
    }
};

export default connect(stateToProps, dispatchToProps)(EditProfile);
