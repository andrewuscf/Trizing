import React from 'react';

const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import Swiper from 'react-native-swiper';
import InputAccessory from '../../components/InputAccessory';
import {CachedImage} from "react-native-img-cache";
import Gallery from 'react-native-image-gallery';

import {getFontSize, trunc} from '../../actions/utils';


import CustomIcon from '../../components/CustomIcon';
import SetLogBox from '../../components/SetLogBox';
import GlobalStyle from "../../containers/globalStyle";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';


const {width} = Dimensions.get('window');

const SetGroupDetail = CreateClass({
    propTypes: {
        set_group: PropTypes.object.isRequired,
        saveLogs: PropTypes.func,
        date: PropTypes.string,
        workout: PropTypes.number.isRequired
    },

    getInitialState() {
        return {
            rows: [],
            isComplete: false,
            showDescription: false,
        }
    },

    getStatus() {
        let isComplete = true;
        const logs = [];
        for (const row of this.state.rows) {
            if (!row.isCompleted()) {
                isComplete = false;
                break;
            }
            const formValues = row.refs.form.getValue();
            if (formValues) {
                logs.push({
                    exercise_set: row.props.set.id,
                    reps: formValues.reps,
                    weight: formValues.weight,
                    workout: this.props.workout,
                    date: this.props.date ? this.props.date : moment().format("YYYY-MM-DD")
                })
            }
        }
        if (this.state.isComplete !== isComplete) {
            this.setState({isComplete: isComplete});
        }
        this.props.saveLogs(this.props.set_group.id, logs)
    },


    renderAssets() {
        const set_group = this.props.set_group;
        if (!set_group.exercise.image && !set_group.exercise.second_image && !set_group.exercise.video) return null;
        return (
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {set_group.exercise.image ?
                    <TouchableOpacity style={[{overflow: 'hidden'}]} activeOpacity={1}
                                      onPress={this.showGallery.bind(null, 0)}>
                        <CachedImage resizeMode={Image.resizeMode.contain}
                                     style={{
                                         height: 100,
                                         resizeMode: 'contain',
                                         width: (width / 2) - 10,
                                     }}
                                     source={{uri: set_group.exercise.image}}/>
                    </TouchableOpacity>
                    : null
                }
                {set_group.exercise.second_image ?
                    <TouchableOpacity style={[{overflow: 'hidden'}]} activeOpacity={1}
                                      onPress={this.showGallery.bind(null, set_group.exercise.second_image ? 1 : 0)}>
                        <CachedImage resizeMode={Image.resizeMode.contain}
                                     style={{
                                         height: 100,
                                         resizeMode: 'contain',
                                         width: (width / 2) - 10,
                                     }}
                                     source={{uri: set_group.exercise.second_image}}/>
                    </TouchableOpacity>
                    : null
                }
                {/*{set_group.exercise.second_image ?*/}
                {/*<TouchableOpacity style={[{overflow: 'hidden'}]} activeOpacity={1}*/}
                {/*onPress={this.showGallery.bind(null, set_group.exercise.second_image ? 1 : 0)}>*/}
                {/*<CachedImage resizeMode={Image.resizeMode.cover}*/}
                {/*style={{*/}
                {/*height: 100,*/}
                {/*resizeMode: 'cover',*/}
                {/*width: (width / 2) - 10,*/}
                {/*}}*/}
                {/*source={{uri: set_group.exercise.second_image}}/>*/}
                {/*</TouchableOpacity>*/}
                {/*: null*/}
                {/*}*/}
            </View>
        )
    },

    showGallery(index) {
        this.setState({
            galleryShown: true,
            curIndex: index
        });
    },

    closeGallery() {
        this.setState({
            galleryShown: false,
            curIndex: 0
        });
    },


    render() {
        const set_group = this.props.set_group;
        if (this.state.galleryShown) {
            const images = [];
            if (set_group.exercise.image) {
                images.push(
                    {source: {uri: set_group.exercise.image}}
                )
            }
            if (set_group.exercise.second_image) {
                images.push(
                    {source: {uri: set_group.exercise.second_image}}
                )
            }
            return (
                <View style={GlobalStyle.container}>
                    <Gallery
                        style={{flex: 1, backgroundColor: 'white'}}
                        initialPage={this.state.curIndex}
                        images={images}
                        imageComponent={(props, dimensions) => <CachedImage {...props} />}
                    />
                    <TouchableOpacity activeOpacity={1} onPress={this.closeGallery} style={styles.closeGallery}>
                        <CustomIcon name="close" size={40}
                                    style={{color: 'black', paddingRight: '5%', alignSelf: 'flex-end'}}/>
                    </TouchableOpacity>
                </View>
            );
        }

        let sets = [];
        let notes = set_group.notes ? set_group.notes.map((note, i) =>
            <Text key={i} style={[{
                paddingLeft: 15,
                paddingRight: 15,
                paddingBottom: 10
            }, styles.notBold]}>{i + 1}. {note.text}</Text>) : [];

        if (this.props.saveLogs) {
            sets = set_group.sets.map((set, i) => {
                let value = null;
                if (set_group.logs && set_group.logs[i]) {
                    value = set_group.logs[i];
                }
                return <SetLogBox ref={(row) => this.state.rows[i] = row} key={i} set={set}
                                  value={value}
                                  getStatus={this.getStatus}/>
            })
        } else {
            sets = set_group.sets.map((set, index) => {
                return (
                    <View key={index} style={styles.rowSection}>
                        <View style={styles.topSection}>
                            <Text>{set.order}</Text>
                        </View>
                        <View style={styles.topSection}>
                            <Text>{set.weight}</Text>
                        </View>
                        <View style={styles.topSection}>
                            <Text>{set.reps}</Text>
                        </View>
                    </View>
                )
            });
        }

        return (
            <View style={GlobalStyle.container}>
                <KeyboardAwareScrollView style={[styles.displayWorkoutBox]} extraHeight={130}
                                         showsVerticalScrollIndicator={false}
                                         removeClippedSubviews={false}
                                         keyboardDismissMode='interactive'
                                         showsHorizontalScrollIndicator={false}
                                         keyboardShouldPersistTaps='handled'>
                    <Text style={styles.simpleTitle}>{trunc(set_group.exercise.name, 30)}</Text>
                    {this.renderAssets()}
                    <Text>
                        {!this.state.showDescription && set_group.exercise.description
                            ? trunc(set_group.exercise.description, 30)
                            : set_group.exercise.description
                        }
                        {!this.state.showDescription && set_group.exercise.description ?
                            <Text onPress={() => this.setState({showDescription: true})}
                              style={GlobalStyle.lightBlueText}>More</Text>
                            : null
                        }
                    </Text>
                    <View style={{flexDirection: 'column', flex: 1}}>
                        <View style={[{flex: 1}]}>
                            <View style={styles.rowSection}>
                                <View style={styles.topSection}>
                                    <Text>#</Text>
                                </View>
                                <View style={styles.topSection}>
                                    <Text>LBS</Text>
                                </View>
                                <View style={styles.topSection}>
                                    <Text>REPS</Text>
                                </View>
                                {this.props.saveLogs ?
                                    <View style={styles.topSection}>
                                        {this.state.isComplete ?
                                            <MaterialIcon name="check-circle" size={getFontSize(20)} color="green"/> :
                                            <MaterialIcon name="check" size={getFontSize(20)}/>
                                        }
                                    </View>
                                    : null
                                }
                            </View>
                            {sets}
                            {notes.length ?
                                <View style={[GlobalStyle.simpleBottomBorder, styles.headerContainer]}>
                                    <Text style={styles.smallBold}>Notes:</Text>
                                    {notes}
                                </View>
                                : null
                            }
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <InputAccessory/>
            </View>
        )
    }
});

const styles = StyleSheet.create({
    displayWorkoutBox: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
    },
    setCircle: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 25,
        width: 50,
        height: 50,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    simpleTitle: {
        fontSize: getFontSize(18),
        fontFamily: 'Heebo-Bold',
        marginBottom: 5,
    },
    rowSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#e1e3df',
        borderWidth: .5,
    },
    topSection: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        flex: 1
    },
    wrapper: {},
    image: {
        flex: 1,
        resizeMode: 'cover',
        width: width - 50
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    noteSection: {
        margin: 10,
        marginLeft: 5,
        marginRight: 5,
    },
    smallBold: {
        fontSize: getFontSize(16),
        fontFamily: 'Heebo-Bold',
    },
    exerciseImage: {
        resizeMode: "contain",
        padding: 10,
        marginRight: 10,
        borderColor: '#e1e3df',
        borderWidth: 1,
    },
    headerContainer: {
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: 'white'
    },
    notBold: {
        color: 'grey',
        fontFamily: 'Heebo-Medium',
    },
    closeGallery: {
        top: 0,
        height: 65,
        backgroundColor: 'transparent',
        width: '100%',
        position: 'absolute',
        justifyContent: 'center'
    },
});


export default SetGroupDetail;
