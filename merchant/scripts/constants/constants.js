twystApp
.constant('APP_NAME','Twyst App')
.constant('APP_VERSION','0.1')

.constant('_START_REQUEST_', '_START_REQUEST_')
.constant('_END_REQUEST_', '_END_REQUEST_')
.constant('REWARD_CHECK',  [
    {"text": "Discount", value:"discount"},
    {"text": "Flat off", value:"flat"},
    {"text": "Free ", value:"free"},
    {"text": "Buy one get one ", value:"buy_one_get_one"},
    {"text": "Happy hours", value:"happy"},
    {"text": "Reduced price ", value:"reduced"},
    {"text": "Custom ", value:"custom"}
])
.constant('WEEK', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])

.constant('OPERATE_HOURS', {
    sunday: {
        closed: false,
        timings: [{
            open: {
                hr: '',
                min: ''
            },
            close: {
                hr: '',
                min: ''
            }
        }]
    },
    monday: {
        closed: false,
        timings: [{
            open: {
                hr: '',
                min: ''
            },
            close: {
                hr: '',
                min: ''
            }
        }]
    },
    tuesday: {
        closed: false,
        timings: [{
            open: {
                hr: '',
                min: ''
            },
            close: {
                hr: '',
                min: ''
            }
        }]
    },
    wednesday: {
        closed: false,
        timings: [{
            open: {
                hr: '',
                min: ''
            },
            close: {
                hr: '',
                min: ''
            }
        }]
    },
    thursday: {
        closed: false,
        timings: [{
            open: {
                hr: '',
                min: ''
            },
            close: {
                hr: '',
                min: ''
            }
        }]
    },
    friday: {
        closed: false,
        timings: [{
            open: {
                hr: '',
                min: ''
            },
            close: {
                hr: '',
                min: ''
            }
        }]
    },
    saturday: {
        closed: false,
        timings: [{
            open: {
                hr: '',
                min: ''
            },
            close: {
                hr: '',
                min: ''
            }
        }]
    }
})