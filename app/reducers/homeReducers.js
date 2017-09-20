import _ from 'lodash';
import * as constants from '../actions/actionTypes';
import moment from 'moment';


const initialState = {
    Clients: [],
    Notifications: [],
    NotificationsNext: null,
    ActiveData: [],
    Refreshing: false,
    HomeIsLoading: true,
    WeightLogs: {
        month: {
            results: [],
            next: null
        },
        three_months: {
            results: [],
            next: null
        },
        year: {
            results: [],
            next: null
        }
    },
};

export default function homeReducers(state = initialState, action = null) {
    switch (action.type) {
        case constants.LOAD_CLIENTS:
            return {
                ...state,
                Clients: (action.refresh) ? action.response.results : state.Clients.concat(action.response.results),
                Refreshing: false,
                HomeIsLoading: false,
            };

        case constants.DELETE_CLIENT:
            const index = _.findIndex(state.Clients, {'user': action.clientId});
            return {
                ...state,
                Clients: state.Clients.slice(0, index).concat(state.Clients.slice(index + 1))
            };

        case constants.GET_NOTIFICATIONS:
            return {
                ...state,
                Notifications: (action.refresh) ? action.response.results
                    : _.uniqBy(state.Notifications.concat(action.response.results), 'id'),
                NotificationsNext: action.response.next,
                Refreshing: false
            };

        case constants.READ_NOTIFICATION:
            return {
                ...state,
                Notifications: state.Notifications.map(notification =>
                    (notification.id === action.noteId) ?
                        {
                            ...notification,
                            unread: false
                        } :
                        notification
                )
            };

        case constants.LOAD_ACTIVE_DATA:
            const activeIndex = _.findIndex(state.ActiveData, {date: action.response.date});
            let newData = state.ActiveData;
            if (activeIndex === -1) {
                newData = [...state.ActiveData, action.response];
            } else {
                newData = [
                    ...state.ActiveData.slice(0, activeIndex).concat(state.ActiveData.slice(activeIndex + 1)),
                    action.response
                ];
            }
            return {
                ...state,
                ActiveData: newData,
                Refreshing: false,
                HomeIsLoading: false,
            };


        case constants.CREATE_WORKOUT_LOG:
            return {
                ...state,
                ActiveData: state.ActiveData.map(active_data => {
                        if (moment(active_data.date).isSame(moment(action.response[0].date).local())) {
                            return {
                                ...active_data,
                                training_day: {
                                    ...active_data.training_day,
                                    logged_today: true
                                }
                            }
                        }
                        return active_data
                    }
                ),
            };

        case constants.ADD_MACRO_LOG:
            return {
                ...state,
                ActiveData: state.ActiveData.map(active_data => {
                        if (active_data.date === moment(action.response.date).format("YYYY-MM-DD")) {
                            return {
                                ...active_data,
                                macro_plan_day: {
                                    ...active_data.macro_plan_day,
                                    current_logs: {
                                        fats: active_data.macro_plan_day.current_logs.fats + action.response.fats,
                                        carbs: active_data.macro_plan_day.current_logs.carbs + action.response.carbs,
                                        protein: active_data.macro_plan_day.current_logs.protein + action.response.protein,
                                    }
                                }
                            }
                        }
                        return active_data
                    }
                ),
            };

        case constants.LOAD_WEIGHT_LOGS:
            const WeightLogs = state.WeightLogs;
            if (action.timeFrame === "month") {
                WeightLogs["month"] = {
                    results: (action.refresh) ? action.response.results :
                        _.uniqBy([...action.response.results, ...state.WeightLogs.month.results], 'id'),
                    next: action.next
                }
            } else if (action.timeFrame === "three_months") {
                WeightLogs["three_months"] = {
                    results: (action.refresh) ? action.response.results :
                        _.uniqBy([...action.response.results, ...state.WeightLogs.three_months.results], 'id'),
                    next: action.next
                }
            } else if (action.timeFrame === "year") {
                WeightLogs["year"] = {
                    results: (action.refresh) ? action.response.results :
                        _.uniqBy([...action.response.results, ...state.WeightLogs.year.results], 'id'),
                    next: action.next
                }
            }
            return {
                ...state,
                WeightLogs: WeightLogs,
                HomeIsLoading: false,
            };


        case constants.REMOVE_TOKEN:
            return initialState;

        //
        // case constants.SEND_REQUEST:
        //     const index = _.findIndex(state.Clients, {'user': action.clientId });
        //     return {
        //         ...state,
        //         Clients: state.Clients.slice(0, index).concat(state.Clients.slice(index + 1))
        //     };


        default:
            return state
    }
}