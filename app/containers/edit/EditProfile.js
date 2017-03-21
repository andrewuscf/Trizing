import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Dimensions,
    Alert
} from 'react-native';
import {bindActionCreators} from 'redux';
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

var {width: deviceWidth} = Dimensions.get('window');


const EditProfile = React.createClass({
    getInitialState() {
        let initData = {
            phone_number: null,
            showRoll: false,
            previewImage: null,
            first_name: null,
            last_name: null,
            type: null
        };
        if (this.props.RequestUser) {
            initData = {
                ...initData,
                username: this.props.RequestUser.username,
                first_name: this.props.RequestUser.profile.first_name,
                last_name: this.props.RequestUser.profile.last_name,
                phone_number: this.props.RequestUser.profile.phone_number,
                type: this.props.RequestUser.type
            }
        }
        return initData;
    },

    componentDidUpdate(prevProps) {
        if (!prevProps.RequestUser && this.props.RequestUser) {
            this.setState({
                username: this.props.RequestUser.username,
                first_name: this.props.RequestUser.profile.first_name,
                last_name: this.props.RequestUser.profile.last_name,
                phone_number: this.props.RequestUser.profile.phone_number,
                type: this.props.RequestUser.type ? this.props.RequestUser.type : null
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

    checkAllRequired() {
        return !!(this.state.phone_number &&
        (this.state.previewImage || this.props.RequestUser.profile.avatar) &&
        this.state.first_name && this.state.last_name && this.state.type);
    },

    selectType(num) {
        this.setState({
            type: num
        });
    },

    _onSubmit(){
        if (this.checkAllRequired()) {
            const data = {
                username: this.state.username,
                type: this.state.type
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
            profileData.append("first_name", this.state.first_name);
            profileData.append("last_name", this.state.last_name);
            profileData.append("phone_number", this.state.phone_number);
            this.props.actions.updateUser(data, profileData, this.asyncActions);
            // this.props.actions.updateProfile(profileData, this.asyncActions);
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

                            <View style={[styles.section, styles.twoColumn]}>
                                <TextInput style={[styles.textInput, styles.nameInput]}
                                           underlineColorAndroid='transparent'
                                           autoCapitalize='words'
                                           keyboardType='default'
                                           autoCorrect={false}
                                           onChangeText={(text) => this.setState({first_name: text})}
                                           value={this.state.first_name}
                                           onSubmitEditing={(event) => {
                                               this.refs.last_name.focus();
                                           }}
                                           placeholder="First Name"/>
                                <View style={styles.divider}/>
                                <TextInput style={[styles.textInput, styles.nameInput]}
                                           underlineColorAndroid='transparent'
                                           autoCapitalize='words'
                                           keyboardType='default'
                                           autoCorrect={false}
                                           ref="last_name"
                                           onSubmitEditing={(event) => {
                                               this.refs.username.focus();
                                           }}
                                           onChangeText={(text) => this.setState({last_name: text})}
                                           value={this.state.last_name}
                                           placeholder="Last Name"/>
                            </View>

                            <View style={styles.section}>
                                <TextInput ref="username" style={styles.textInput}
                                           underlineColorAndroid='transparent'
                                           autoCapitalize='none'
                                           maxLength={150}
                                           onSubmitEditing={(event) => {
                                               this.refs.phone_number.focus();
                                           }}
                                           nChangeText={(text) => this.setState({username: text})}
                                           value={this.state.username}
                                           placeholder="Username"/>
                            </View>

                            <View style={styles.section}>
                                <TextInput ref="phone_number" style={styles.textInput}
                                           underlineColorAndroid='transparent'
                                           keyboardType="phone-pad"
                                           maxLength={10}
                                           onChangeText={(number) => this.setState({phone_number: number})}
                                           value={this.state.phone_number}
                                           onSubmitEditing={(event) => {
                                               if (this.props.RequestUser.type)
                                                   this._onSubmit();
                                           }}
                                           placeholder="Phone Number"/>
                            </View>

                            {(!this.props.RequestUser.type) ?
                                <View style={{flexDirection: 'row', paddingTop: 20}}>
                                    <TouchableOpacity onPress={this.selectType.bind(null, 1)}
                                                      style={[styles.typeButtons, this.state.type == 1 ? styles.selectedType : styles.notSelected]}>
                                        <Text
                                            style={this.state.type == 1 ? styles.selectedText : styles.notSelectedText}>Trainer</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.selectType.bind(null, 2)}
                                                      style={[styles.typeButtons, this.state.type == 2 ? styles.selectedType : styles.notSelected]}>
                                        <Text
                                            style={this.state.type == 2 ? styles.selectedText : styles.notSelectedText}>Client</Text>
                                    </TouchableOpacity>
                                </View>
                                : null
                            }


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
        flex: 1
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
    section: {
        marginTop: 20,
        borderBottomWidth: 1,
        borderColor: '#b1aea5'
    },
    userName: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userNameEdit: {
        alignSelf: 'flex-end',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingBottom: 5
    },
    userNameText: {
        fontSize: 18,
        fontWeight: "400",
        paddingTop: 15
    },
    twoColumn: {
        flexDirection: 'row',
    },
    nameInput: {
        flex: 2
    },
    textInput: {
        flex: 1,
        height: 35,
        color: 'black',
        backgroundColor: 'transparent',
        paddingTop: 2,
        fontSize: 17,
        textAlignVertical: 'top',
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
        // fontFamily: 'OpenSans-Bold',
    },
    divider: {
        width: 1,
        backgroundColor: '#C7C7CD',
        marginBottom: 5,
        marginTop: 5,
        marginRight: 5
    },
    typeButtons: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
        paddingTop: 10
    },
    notSelected: {
        borderWidth: 1,
        borderColor: '#1352e2',
        backgroundColor: 'transparent'
    },
    selectedType: {
        backgroundColor: '#1352e2'
    },
    selectedText: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'OpenSans-Bold',
    },
    notSelectedText: {
        color: '#1352e2',
        fontSize: 14,
        fontFamily: 'OpenSans-Bold',
    },
    buttonText: {
        color: '#1352e2',
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
