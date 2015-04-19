(function($) {
//GLOBAL VARIABLE//
    var map_event = {};
    var buffer_motion_events = [];
    var settings = "";
    var count = 0;
    var tilt = false; //indicates if a tilt event occurred (up, down, left, right)

    var tilting_activated = false;

    var current_os = (navigator.appVersion.indexOf("Linux") > -1)? "android": "ios";

    var elem_selection_indicator_radius = "10px", elem_selection_indicator_color = "red",
        elem_selection_indicator_left = "49%", elem_selection_indicator_top = "0px",
        elem_selection_indicator_opacity = 0.6, elem_selection_indicator_visibility = true,
        elem_selection_indicator_dimensionality = "1D", elem_selection_indicator_element = "document",
        elem_selection_scrollingdirection = "physical", elem_selection_speed = 1, elem_selection_sensitivity = 0.5,
        default_sliding_enabled = true;

    $.fn.tiltandtap = function(options) {
        settings = $.extend({
            touch: false, onOrientationChange: null, onMotionChange: null, onRotationChange: null,
            elem_selection: {
                elem_selected: function(cur_elem){}
                ,indicator: {
                    radius: null
                    ,color: null
                    ,left: null
                    ,top: null
                    ,opacity: null    // 0 <= opacity <= 1
                    ,visibility: null    // true, false
                    ,dimensionality: null   // 1D which is the x-axis, 2D
                    ,element: null
                }
                ,speed: null // 0 <= speed
                ,sensitivity: null // sensitivity >= 0 (0 = most sensitive value)
                ,scrollingdirection : null
                ,gallery: {classname: null, innerid: null, outerid: null, sliding_enabled: null}
            },


            activationBy: {type: null, element: null},

/*

            onTiltUp_middle: null,
            tiltUp_middle: {onTiltUp: null, thTiltUp: null,
                audioFeedback: null, vibrationFeedback: null, visualFeedback: null,
                interaction: {type: null, element: null}
            },

            onTiltDown_middle: null,
            tiltDown_middle: {onTiltDown: null, thTiltDown: null,
                audioFeedback: null, vibrationFeedback: null, visualFeedback: null,
                interaction: {type: null, element: null}
            },

            onTiltLeft_middle: null,
            tiltLeft_middle: {onTiltLeft: null, thTiltLeft: null,
                audioFeedback: null, vibrationFeedback: null, visualFeedback: null,
                interaction: {type: null, element: null}
            },

            onTiltRight_middle: null,
            tiltRight_middle: {onTiltRight: null, thTiltRight: null,
                audioFeedback: null, vibrationFeedback: null, visualFeedback: null,
                interaction: {type: null, element: null}
            },

            onTiltClock_middle: null,
            tiltClock_middle: {onTiltClock: null, thTiltClock: null,
                audioFeedback: null, vibrationFeedback: null, visualFeedback: null,
                interaction: {type: null, element: null}
            },

            onTiltCounterClock_middle: null,
            tiltCounterClock_middle: {onTiltCounterClock: null, thTiltCounterClock: null,
                audioFeedback: null, vibrationFeedback: null, visualFeedback: null,
                interaction: {type: null, element: null}
            },



            onTiltUp_hard: null,
            tiltUp_hard: {onTiltUp: null, thTiltUp: null,
                audioFeedback: null, vibrationFeedback: null, visualFeedback: null,
                interaction: {type: null, element: null}
            },

            onTiltDown_hard: null,
            tiltDown_hard: {onTiltDown: null, thTiltDown: null,
                audioFeedback: null, vibrationFeedback: null, visualFeedback: null,
                interaction: {type: null, element: null}
            },

            onTiltLeft_hard: null,
            tiltLeft_hard: {onTiltLeft: null, thTiltLeft: null,
                audioFeedback: null, vibrationFeedback: null, visualFeedback: null,
                interaction: {type: null, element: null}
            },

            onTiltRight_hard: null,
            tiltRight_hard: {onTiltRight: null, thTiltRight: null,
                audioFeedback: null, vibrationFeedback: null, visualFeedback: null,
                interaction: {type: null, element: null}
            },

            onTiltClock_hard: null,
            tiltClock_hard: {onTiltClock: null, thTiltClock: null,
                audioFeedback: null, vibrationFeedback: null, visualFeedback: null,
                interaction: {type: null, element: null}
            },

            onTiltCounterClock_hard: null,
            tiltCounterClock_hard: {onTiltCounterClock: null, thTiltCounterClock: null,
                audioFeedback: null, vibrationFeedback: null, visualFeedback: null,
                interaction: {type: null, element: null}
            },

*/


            onTiltUp: null,
            tiltUp: {onTiltUp: null, thTiltUp: null,
                audioFeedback: null, vibrationFeedback: null, visualFeedback: null,
                interaction: {type: null, element: null}
            },

            onTiltDown: null,
            tiltDown: {onTiltDown: null, thTiltDown: null,
                audioFeedback: null, vibrationFeedback: null, visualFeedback: null,
                interaction: {type: null, element: null}
            },

            onTiltLeft: null,
            tiltLeft: {onTiltLeft: null, thTiltLeft: null,
                audioFeedback: null, vibrationFeedback: null, visualFeedback: null,
                interaction: {type: null, element: null}
            },

            onTiltRight: null,
            tiltRight: {onTiltRight: null, thTiltRight: null,
                audioFeedback: null, vibrationFeedback: null, visualFeedback: null,
                interaction: {type: null, element: null}
            },

            onTiltClock: null,
            tiltClock: {onTiltClock: null, thTiltClock: null,
                audioFeedback: null, vibrationFeedback: null, visualFeedback: null,
                interaction: {type: null, element: null}
            },

            onTiltCounterClock: null,
            tiltCounterClock: {onTiltCounterClock: null, thTiltCounterClock: null,
                audioFeedback: null, vibrationFeedback: null, visualFeedback: null,
                interaction: {type: null, element: null}
            },

            onDiscreteTiltRight : null, onTiltingRight: null,
            complete: null, dimBuffer: 8, dimBufferDiscard: 15,

            //default thresholds for Google Chrome on Android devices
            thTiltUp: (current_os == "android")? 3.1 : 180,
            thTiltDown: (current_os == "android")? -3.1 : -180,
            thTiltLeft: (current_os == "android")? -3.1 : -180,
            thTiltRight: (current_os == "android")? 3.1 : 180,
            thTiltClock: (current_os == "android")? -3.1 : -180,
            thTiltCounterClock: (current_os == "android")? 3.1 : 180,
            thTiltUp_middle: (current_os == "android")? 4.6 : 400,
            thTiltDown_middle: (current_os == "android")? -4.6 : -400,
            thTiltLeft_middle: (current_os == "android")? -4.6 : -400,
            thTiltRight_middle: (current_os == "android")? 4.6 : 400,
            thTiltClock_middle: (current_os == "android")? -4.6 : -400,
            thTiltCounterClock_middle: (current_os == "android")? 4.6 : 400,
            thTiltUp_hard: (current_os == "android")? 7.1 : 550,
            thTiltDown_hard: (current_os == "android")? -7.1 : -550,
            thTiltLeft_hard: (current_os == "android")? -7.1 : -550,
            thTiltRight_hard: (current_os == "android")? 7.1 : 550,
            thTiltClock_hard: (current_os == "android")? -7.1 : -550,
            thTiltCounterClock_hard: (current_os == "android")? 7.1 : 550



        } ,options);


        checkOrientationMode ();
        //START TILLTUP RECOGNITION
        init();

        if ( $.isFunction( settings.complete ) ) { settings.complete.call( this ); }
    };

    var interaction_enabled_up = false, interaction_enabled_down = false,
        interaction_enabled_left = false, interaction_enabled_right = false,
        interaction_enabled_clock = false, interaction_enabled_counterclock = false;

    var interaction_enabled_up_middle = false, interaction_enabled_down_middle = false,
        interaction_enabled_left_middle = false, interaction_enabled_right_middle = false,
        interaction_enabled_clock_middle = false, interaction_enabled_counterclock_middle = false;

    var interaction_enabled_up_hard = false, interaction_enabled_down_hard = false,
        interaction_enabled_left_hard = false, interaction_enabled_right_hard = false,
        interaction_enabled_clock_hard = false, interaction_enabled_counterclock_hard = false;

    var ball_activated = false;


//START TILLTUP RECOGNITION
    function init(){

        if(settings.activationBy.type != null){
            var cur_type = settings.activationBy.type;
            var cur_activation_element = settings.activationBy.element;

            var timer, press = false, number_of_taps = 0;
            var press_interval = 500, double_tap_interval = 250;

            if(cur_activation_element == "document"){
                $(document).bind('touchstart',touchstart);
                $(document).bind('touchend touchcancel touchleave',touchend);
            }
            else{
                $("#" + cur_activation_element).bind('touchstart',touchstart);
                $("#" + cur_activation_element).bind('touchend touchcancel touchleave',touchend);
            }

            function touchstart() {
                number_of_taps = number_of_taps + 1;
                timer = setTimeout(press_detected, press_interval);
                return false;
            }

            function touchend() {
                if(press == true){ //press
                    press = false;
                    number_of_taps = 0;
                }
                else{ //touch but what type of touch?
                    setTimeout(function(){
                        if(number_of_taps == 1){ //singletap as activation type
                            if(cur_type == "tap"){
                                tilting_activated = true;
                                ball_activated = true;
                            }
                        }
                        else{ //multitap (doubletap) as activation type
                            if(cur_type == "doubletap"){
                                tilting_activated = true;
                                ball_activated = true;
                            }
                        }
                        number_of_taps = 0;
                    }, double_tap_interval);
                }
                if (timer){ clearTimeout(timer); }
                return false;
            }

            press_detected = function() { //taphold as activation type
                press = true;
                number_of_taps = 0;
                if(cur_type == "press"){
                    tilting_activated = true;
                    ball_activated = true;
                }
            };

        }
        else{
            tilting_activated = true;
            ball_activated = true;
        }

        var check_tilting_interval = setInterval(function(){
            if(tilting_activated == true){
                var timer,
                    timer_up, timer_up_middle, timer_up_hard, timer_down, timer_down_middle, timer_down_hard,
                    timer_left, timer_left_middle, timer_left_hard, timer_right, timer_right_middle, timer_right_hard,
                    timer_clock, timer_clock_middle, timer_clock_hard, timer_counterclock, timer_counterclock_middle, timer_counterclock_hard,
                    number_of_taps = 0;
                var press_interval = 500, double_tap_interval = 250;


                if (settings.tiltUp != null && settings.tiltUp.interaction != null && settings.tiltUp.interaction.type != null) {
                    var cur_type_up, cur_element_up;

                    setTimeout(function () {
                        cur_type_up = settings.tiltUp.interaction.type;
                        cur_element_up = settings.tiltUp.interaction.element;

                        $("#" + cur_element_up).bind('touchstart', touchstart_up);
                        $("#" + cur_element_up).bind('touchend touchleave touchcancel', touchend_up);
                    }, 100);

                    function touchstart_up() {
                        number_of_taps = number_of_taps + 1;
                        timer_up = setTimeout(press_detected_up, press_interval);
                        return false;
                    }

                    function touchend_up() {
                        clearTimeout(timer_up);
                        interaction_enabled_up = false;
                        number_of_taps = 0;
                    }

                    press_detected_up = function () {
                        console.log("press");

                        if (cur_type_up == "press") {
                            interaction_enabled_up = true;
                            number_of_taps = 0;
                        }
                        return false;
                    };
                }
                else{
                    interaction_enabled_up = false;
                }
                /*if(settings.tiltUp_middle != null && settings.tiltUp_middle.interaction != null && settings.tiltUp_middle.interaction.type != null){
                    var cur_type_up_middle, cur_element_up_middle;
                    setTimeout(function(){
                        cur_type_up_middle = settings.tiltUp_middle.interaction.type;
                        cur_element_up_middle = settings.tiltUp_middle.interaction.element;

                        $("#" + cur_element_up_middle).bind('touchstart',touchstart_up_middle);
                        $("#" + cur_element_up_middle).bind('touchend touchleave touchcancel',touchend_up_middle);
                    }, 100);

                    function touchstart_up_middle() {
                        number_of_taps = number_of_taps + 1;
                        timer_up_middle = setTimeout(press_detected_up_middle, press_interval);
                        return false;
                    }

                    function touchend_up_middle() {
                        clearTimeout(timer_up_middle);
                        interaction_enabled_up_middle = false;
                        number_of_taps = 0;
                    }

                    press_detected_up_middle = function(){
                        if(cur_type_up_middle == "press"){
                            interaction_enabled_up_middle = true;
                            number_of_taps = 0;
                        }
                        return false;
                    };
                }
                else{
                    interaction_enabled_up_middle = false;
                }
                if (settings.tiltUp_hard != null && settings.tiltUp_hard.interaction != null && settings.tiltUp_hard.interaction.type != null) {
                    var cur_type_up_hard, cur_element_up_hard;
                    setTimeout(function () {
                        cur_type_up_hard = settings.tiltUp_hard.interaction.type;
                        cur_element_up_hard = settings.tiltUp_hard.interaction.element;

                        $("#" + cur_element_up_hard).bind('touchstart', touchstart_up_hard);
                        $("#" + cur_element_up_hard).bind('touchend touchleave touchcancel', touchend_up_hard);
                    }, 100);

                    function touchstart_up_hard() {
                        number_of_taps = number_of_taps + 1;
                        timer_up_hard = setTimeout(press_detected_up_hard, press_interval);
                        return false;
                    }

                    function touchend_up_hard() {
                        clearTimeout(timer_up_hard);
                        interaction_enabled_up_hard = false;
                        number_of_taps = 0;
                    }

                    press_detected_up_hard = function () {
                        if (cur_type_up_hard == "press") {
                            interaction_enabled_up_hard = true;
                            number_of_taps = 0;
                        }
                        return false;
                    };
                }
                else{
                    interaction_enabled_up_hard = false;
                }
*/
                if(settings.tiltDown != null && settings.tiltDown.interaction != null && settings.tiltDown.interaction.type != null){
                    var cur_type_down, cur_element_down;

                    setTimeout(function(){
                        cur_type_down = settings.tiltDown.interaction.type;
                        cur_element_down = settings.tiltDown.interaction.element;

                        $("#" + cur_element_down).bind('touchstart',touchstart_down);
                        $("#" + cur_element_down).bind('touchend touchleave touchcancel',touchend_down);
                    }, 100);

                    function touchstart_down() {
                        number_of_taps = number_of_taps + 1;
                        timer_down = setTimeout(press_detected_down, press_interval);
                        return false;
                    }

                    function touchend_down() {
                        clearTimeout(timer_down);
                        interaction_enabled_down = false;
                        number_of_taps = 0;
                    }

                    press_detected_down = function(){
                        if(cur_type_down == "press"){
                            interaction_enabled_down = true;
                            number_of_taps = 0;
                        }
                        return false;
                    };
                }
                else{
                    interaction_enabled_down = false;
                }

                /*if(settings.tiltDown_middle != null && settings.tiltDown_middle.interaction != null && settings.tiltDown_middle.interaction.type != null){
                    var cur_type_down_middle, cur_element_down_middle;
                    setTimeout(function(){
                        cur_type_down_middle = settings.tiltDown_middle.interaction.type;
                        cur_element_down_middle = settings.tiltDown_middle.interaction.element;

                        $("#" + cur_element_down_middle).bind('touchstart',touchstart_down_middle);
                        $("#" + cur_element_down_middle).bind('touchend touchleave touchcancel',touchend_down_middle);
                    }, 100);

                    function touchstart_down_middle() {
                        number_of_taps = number_of_taps + 1;
                        timer_down_middle = setTimeout(press_detected_down_middle, press_interval);
                        return false;
                    }

                    function touchend_down_middle() {
                        clearTimeout(timer_down_middle);
                        interaction_enabled_down_middle = false;
                        number_of_taps = 0;
                    }

                    press_detected_down_middle = function(){
                        if(cur_type_down_middle == "press"){
                            interaction_enabled_down_middle = true;
                            number_of_taps = 0;
                        }
                        return false;
                    };
                }
                else{
                    interaction_enabled_down_middle = false;
                }
                if(settings.tiltDown_hard != null && settings.tiltDown_hard.interaction != null && settings.tiltDown_hard.interaction.type != null){
                    var cur_type_down_hard, cur_element_down_hard;
                    setTimeout(function(){
                        cur_type_down_hard = settings.tiltDown_hard.interaction.type;
                        cur_element_down_hard = settings.tiltDown_hard.interaction.element;

                        $("#" + cur_element_down_hard).bind('touchstart',touchstart_down_hard);
                        $("#" + cur_element_down_hard).bind('touchend touchleave touchcancel',touchend_down_hard);
                    }, 100);

                    function touchstart_down_hard() {
                        number_of_taps = number_of_taps + 1;
                        timer_down_hard = setTimeout(press_detected_down_hard, press_interval);
                        return false;
                    }

                    function touchend_down_hard() {
                        clearTimeout(timer_down_hard);
                        interaction_enabled_down_hard = false;
                        number_of_taps = 0;
                    }

                    press_detected_down_hard = function(){
                        if(cur_type_down_hard == "press"){
                            interaction_enabled_down_hard = true;
                            number_of_taps = 0;
                        }
                        return false;
                    };
                }
                else{
                    interaction_enabled_down_hard = false;
                }
*/
                if(settings.tiltLeft != null && settings.tiltLeft.interaction != null && settings.tiltLeft.interaction.type != null){
                    var cur_type_left, cur_element_left;

                    setTimeout(function(){
                        cur_type_left = settings.tiltLeft.interaction.type;
                        cur_element_left = settings.tiltLeft.interaction.element;

                        $("#" + cur_element_left).bind('touchstart',touchstart_left);
                        $("#" + cur_element_left).bind('touchend touchleave touchcancel',touchend_left);
                    }, 100);

                    function touchstart_left() {
                        number_of_taps = number_of_taps + 1;
                        timer_left = setTimeout(press_detected_left, press_interval);
                        return false;
                    }

                    function touchend_left() {
                        clearTimeout(timer_left);
                        interaction_enabled_left = false;
                        number_of_taps = 0;
                    }

                    press_detected_left = function(){
                        if(cur_type_left == "press"){
                            interaction_enabled_left = true;
                            number_of_taps = 0;
                        }
                        return false;
                    };
                }
                else{
                    interaction_enabled_left = false;
                }

                /*if(settings.tiltLeft_middle != null && settings.tiltLeft_middle.interaction != null && settings.tiltLeft_middle.interaction.type != null){
                    var cur_type_left_middle, cur_element_left_middle;
                    setTimeout(function(){
                        cur_type_left_middle = settings.tiltLeft_middle.interaction.type;
                        cur_element_left_middle = settings.tiltLeft_middle.interaction.element;

                        $("#" + cur_element_left_middle).bind('touchstart',touchstart_left_middle);
                        $("#" + cur_element_left_middle).bind('touchend touchleave touchcancel',touchend_left_middle);
                    }, 100);

                    function touchstart_left_middle() {
                        number_of_taps = number_of_taps + 1;
                        timer_left_middle = setTimeout(press_detected_left_middle, press_interval);
                        return false;
                    }

                    function touchend_left_middle() {
                        clearTimeout(timer_left_middle);
                        interaction_enabled_left_middle = false;
                        number_of_taps = 0;
                    }

                    press_detected_left_middle = function(){
                        if(cur_type_left_middle == "press"){
                            interaction_enabled_left_middle = true;
                            number_of_taps = 0;
                        }
                        return false;
                    };
                }
                else{
                    interaction_enabled_left_middle = false;
                }
                if(settings.tiltLeft_hard != null && settings.tiltLeft_hard.interaction != null && settings.tiltLeft_hard.interaction.type != null){
                    var cur_type_left_hard, cur_element_left_hard;
                    setTimeout(function(){
                        cur_type_left_hard = settings.tiltLeft_hard.interaction.type;
                        cur_element_left_hard = settings.tiltLeft_hard.interaction.element;

                        $("#" + cur_element_left_hard).bind('touchstart',touchstart_left_hard);
                        $("#" + cur_element_left_hard).bind('touchend touchleave touchcancel',touchend_left_hard);
                    }, 100);

                    function touchstart_left_hard() {
                        number_of_taps = number_of_taps + 1;
                        timer_left_hard = setTimeout(press_detected_left_hard, press_interval);
                        return false;
                    }

                    function touchend_left_hard() {
                        clearTimeout(timer_left_hard);
                        interaction_enabled_left_hard = false;
                        number_of_taps = 0;
                    }

                    press_detected_left_hard = function(){
                        if(cur_type_left_hard == "press"){
                            interaction_enabled_left_hard = true;
                            number_of_taps = 0;
                        }
                        return false;
                    };
                }
                else{
                    interaction_enabled_left_hard = false;
                }
*/
                if(settings.tiltRight != null && settings.tiltRight.interaction != null && settings.tiltRight.interaction.type != null){
                    //console.log(settings.tiltRight.interaction.type != null);
                    var cur_type_right, cur_element_right;

                    setTimeout(function(){
                        cur_type_right = settings.tiltRight.interaction.type;
                        cur_element_right = settings.tiltRight.interaction.element;

                        $("#" + cur_element_right).bind('touchstart',touchstart_right);
                        $("#" + cur_element_right).bind('touchend touchleave touchcancel',touchend_right);
                    }, 100);

                    function touchstart_right() {
                        number_of_taps = number_of_taps + 1;
                        timer_right = setTimeout(press_detected_right, press_interval);
                        return false;
                    }

                    function touchend_right() {
                        clearTimeout(timer_right);
                        interaction_enabled_right = false;
                        number_of_taps = 0;
                    }

                    press_detected_right = function(){
                        if(cur_type_right == "press"){
                            interaction_enabled_right = true;
                            number_of_taps = 0;
                        }
                        return false;
                    };
                }
                else{
                    interaction_enabled_right = false;
                }

                /*if(settings.tiltRight_middle != null && settings.tiltRight_middle.interaction != null && settings.tiltRight_middle.interaction.type != null){
                    var cur_type_right_middle, cur_element_right_middle;
                    setTimeout(function(){
                        cur_type_right_middle = settings.tiltRight_middle.interaction.type;
                        cur_element_right_middle = settings.tiltRight_middle.interaction.element;

                        $("#" + cur_element_right_middle).bind('touchstart',touchstart_right_middle);
                        $("#" + cur_element_right_middle).bind('touchend touchleave touchcancel',touchend_right_middle);
                    }, 100);

                    function touchstart_right_middle() {
                        number_of_taps = number_of_taps + 1;
                        timer_right_middle = setTimeout(press_detected_right_middle, press_interval);
                        return false;
                    }

                    function touchend_right_middle() {
                        clearTimeout(timer_right_middle);
                        interaction_enabled_right_middle = false;
                        number_of_taps = 0;
                    }

                    press_detected_right_middle = function(){
                        if(cur_type_right_middle == "press"){
                            interaction_enabled_right_middle = true;
                            number_of_taps = 0;
                        }
                        return false;
                    };
                }
                else{
                    interaction_enabled_right_middle = false;
                }
                if(settings.tiltRight_hard != null && settings.tiltRight_hard.interaction != null && settings.tiltRight_hard.interaction.type != null){
                    var cur_type_right_hard, cur_element_right_hard;
                    setTimeout(function(){
                        cur_type_right_hard = settings.tiltRight_hard.interaction.type;
                        cur_element_right_hard = settings.tiltRight_hard.interaction.element;

                        $("#" + cur_element_right_hard).bind('touchstart',touchstart_right_hard);
                        $("#" + cur_element_right_hard).bind('touchend touchleave touchcancel',touchend_right_hard);
                    }, 100);

                    function touchstart_right_hard() {
                        number_of_taps = number_of_taps + 1;
                        timer_right_hard = setTimeout(press_detected_right_hard, press_interval);
                        return false;
                    }

                    function touchend_right_hard() {
                        clearTimeout(timer_right_hard);
                        interaction_enabled_right_hard = false;
                        number_of_taps = 0;
                    }

                    press_detected_right_hard = function(){
                        if(cur_type_right_hard == "press"){
                            interaction_enabled_right_hard = true;
                            number_of_taps = 0;
                        }
                        return false;
                    };
                }
                else{
                    interaction_enabled_right_hard = false;
                }
*/
                if(settings.tiltClock != null && settings.tiltClock.interaction != null && settings.tiltClock.interaction.type != null){
                    var cur_type_clock, cur_element_clock;

                    setTimeout(function(){
                        cur_element_clock = settings.tiltClock.interaction.element;
                        cur_type_clock = settings.tiltClock.interaction.type;

                        $("#" + cur_element_clock).bind('touchstart',touchstart_clock);
                        $("#" + cur_element_clock).bind('touchend touchleave touchcancel',touchend_clock);
                    }, 100);

                    function touchstart_clock() {
                        number_of_taps = number_of_taps + 1;
                        timer_clock = setTimeout(press_detected_clock, press_interval);
                        return false;
                    }

                    function touchend_clock() {
                        clearTimeout(timer_clock);
                        interaction_enabled_clock = false;
                        number_of_taps = 0;
                    }

                    press_detected_clock = function(){
                        if(cur_type_clock == "press"){
                            interaction_enabled_clock = true;
                            number_of_taps = 0;
                        }
                        return false;
                    };
                }
                else{
                    interaction_enabled_clock = false;
                }

                /*if(settings.tiltClock_middle != null && settings.tiltClock_middle.interaction != null && settings.tiltClock_middle.interaction.type != null){
                    var cur_type_clock_middle, cur_element_clock_middle;
                    setTimeout(function(){
                        cur_type_clock_middle = settings.tiltClock_middle.interaction.type;
                        cur_element_clock_middle = settings.tiltClock_middle.interaction.element;

                        $("#" + cur_element_clock_middle).bind('touchstart',touchstart_clock_middle);
                        $("#" + cur_element_clock_middle).bind('touchend touchleave touchcancel',touchend_clock_middle);
                    }, 100);

                    function touchstart_clock_middle() {
                        number_of_taps = number_of_taps + 1;
                        timer_clock_middle = setTimeout(press_detected_clock_middle, press_interval);
                        return false;
                    }

                    function touchend_clock_middle() {
                        clearTimeout(timer_clock_middle);
                        interaction_enabled_clock_middle = false;
                        number_of_taps = 0;
                    }

                    press_detected_clock_middle = function(){
                        if(cur_type_clock_middle == "press"){
                            interaction_enabled_clock_middle = true;
                            number_of_taps = 0;
                        }
                        return false;
                    };
                }
                else{
                    interaction_enabled_clock_middle = false;
                }
                if(settings.tiltClock_hard != null && settings.tiltClock_hard.interaction != null && settings.tiltClock_hard.interaction.type != null){
                    var cur_type_clock_hard, cur_element_clock_hard;
                    setTimeout(function(){
                        cur_type_clock_hard = settings.tiltClock_hard.interaction.type;
                        cur_element_clock_hard = settings.tiltClock_hard.interaction.element;

                        $("#" + cur_element_clock_hard).bind('touchstart',touchstart_clock_hard);
                        $("#" + cur_element_clock_hard).bind('touchend touchleave touchcancel',touchend_clock_hard);
                    }, 100);

                    function touchstart_clock_hard() {
                        number_of_taps = number_of_taps + 1;
                        timer_clock_hard = setTimeout(press_detected_clock_hard, press_interval);
                        return false;
                    }

                    function touchend_clock_hard() {
                        clearTimeout(timer_clock_hard);
                        interaction_enabled_clock_hard = false;
                        number_of_taps = 0;
                    }

                    press_detected_clock_hard = function(){
                        if(cur_type_clock_hard == "press"){
                            interaction_enabled_clock_hard = true;
                            number_of_taps = 0;
                        }
                        return false;
                    };
                }
                else{
                    interaction_enabled_clock_hard = false;
                }
*/
                if(settings.tiltCounterClock != null && settings.tiltCounterClock.interaction != null && settings.tiltCounterClock.interaction.type != null){
                    var cur_type_counterclock, cur_element_counterclock;

                    setTimeout(function(){
                        cur_element_counterclock = settings.tiltCounterClock.interaction.element;
                        cur_type_counterclock = settings.tiltCounterClock.interaction.type;

                        $("#" + cur_element_counterclock).bind('touchstart',touchstart_counterclock);
                        $("#" + cur_element_counterclock).bind('touchend touchleave touchcancel',touchend_counterclock);
                    }, 100);

                    function touchstart_counterclock() {
                        number_of_taps = number_of_taps + 1;
                        timer_counterclock = setTimeout(press_detected_counterclock, press_interval);
                        return false;
                    }

                    function touchend_counterclock() {
                        clearTimeout(timer_counterclock);
                        interaction_enabled_counterclock = false;
                        number_of_taps = 0;
                    }

                    press_detected_counterclock = function(){
                        if(cur_type_counterclock == "press"){
                            interaction_enabled_counterclock = true;
                            number_of_taps = 0;
                        }
                        return false;
                    };
                }
                else{
                    interaction_enabled_counterclock = false;
                }

                /*if(settings.tiltCounterClock_middle != null && settings.tiltCounterClock_middle.interaction != null && settings.tiltCounterClock_middle.interaction.type != null){
                    var cur_type_counterclock_middle, cur_element_counterclock_middle;
                    setTimeout(function(){
                        cur_type_counterclock_middle = settings.tiltCounterClock_middle.interaction.type;
                        cur_element_counterclock_middle = settings.tiltCounterClock_middle.interaction.element;

                        $("#" + cur_element_counterclock_middle).bind('touchstart',touchstart_counterclock_middle);
                        $("#" + cur_element_counterclock_middle).bind('touchend touchleave touchcancel',touchend_counterclock_middle);
                    }, 100);

                    function touchstart_counterclock_middle() {
                        number_of_taps = number_of_taps + 1;
                        timer_counterclock_middle = setTimeout(press_detected_counterclock_middle, press_interval);
                        return false;
                    }

                    function touchend_counterclock_middle() {
                        clearTimeout(timer_counterclock_middle);
                        interaction_enabled_counterclock_middle = false;
                        number_of_taps = 0;
                    }

                    press_detected_counterclock_middle = function(){
                        if(cur_type_counterclock_middle == "press"){
                            interaction_enabled_counterclock_middle = true;
                            number_of_taps = 0;
                        }
                        return false;
                    };
                }
                else{
                    interaction_enabled_counterclock_middle = false;
                }
                if(settings.tiltCounterClock_hard != null && settings.tiltCounterClock_hard.interaction != null && settings.tiltCounterClock_hard.interaction.type != null){
                    var cur_type_counterclock_hard, cur_element_counterclock_hard;
                    setTimeout(function(){
                        cur_type_counterclock_hard = settings.tiltCounterClock_hard.interaction.type;
                        cur_element_counterclock_hard = settings.tiltCounterClock_hard.interaction.element;

                        $("#" + cur_element_counterclock_hard).bind('touchstart',touchstart_counterclock_hard);
                        $("#" + cur_element_counterclock_hard).bind('touchend touchleave touchcancel',touchend_counterclock_hard);
                    }, 100);

                    function touchstart_counterclock_hard() {
                        number_of_taps = number_of_taps + 1;
                        timer_counterclock_hard = setTimeout(press_detected_counterclock_hard, press_interval);
                        return false;
                    }

                    function touchend_counterclock_hard() {
                        clearTimeout(timer_counterclock_hard);
                        interaction_enabled_counterclock_hard = false;
                        number_of_taps = 0;
                    }

                    press_detected_counterclock_hard = function(){
                        if(cur_type_counterclock_hard == "press"){
                            interaction_enabled_counterclock_hard = true;
                            number_of_taps = 0;
                        }
                        return false;
                    };
                }
                else{
                    interaction_enabled_counterclock_hard = false;
                }
*/

                if ((window.DeviceMotionEvent) || ('listenForDeviceMovement' in window)) {
                    window.addEventListener('devicemotion', deviceMotionHandler, false);
                }

            }


            if(tilting_activated == true){
                //DISPLAY THE BALL, but only ONCE, since there is a setInterval looping all the time...
                if(ball_activated == true){
                    if(settings.elem_selection.indicator.radius != null || settings.elem_selection.indicator.color != null || settings.elem_selection.indicator.left != null || settings.elem_selection.indicator.top != null || settings.elem_selection.indicator.opacity != null || settings.elem_selection.indicator.visibility != null || settings.elem_selection.indicator.dimensionality != null || settings.elem_selection.indicator.element != null){
                        ball_activated = false;
                        func_ball();
                    }
                }
            }
        }, 500);


        if (window.DeviceOrientationEvent){
            window.addEventListener('deviceorientation',
                function (eventData){
                    if ( $.isFunction( settings.onOrientationChange ) ){
                        settings.onOrientationChange.call(this, eventData.alpha, eventData.beta, eventData.gamma);
                    }
                },false );
        }

    }

    /**
     *
     * @param {type} eventData
     * @returns {undefined}
     */
    function deviceMotionHandler(eventData){
        var map = {};

        // Grab the rotation from the results
        var rotation = eventData.rotationRate;
        var acc =  eventData.accelerationIncludingGravity;


        var dim_motion;
        var x = rotation.alpha;
        var y = rotation.beta;
        var z = rotation.gamma;


        if ( $.isFunction( settings.onMotionChange ) ){
            settings.onMotionChange.call(this, acc.x, acc.y, acc.z);
        }

        if ( $.isFunction( settings.onRotationChange ) ){
            settings.onRotationChange.call(this, x, y, z);
        }

        checkOrientationMode ();
        if(!tilt){

            if(settings.tiltUp.thTiltUp == null){
                var val_up1 = settings.thTiltUp;
                if(x > parseInt(val_up1)){
                    map["event"] = map_event["port-up"];
                    map["value"] = x;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
            else{
                var val_up2 = parseInt(settings.tiltUp.thTiltUp);

                if(settings.tiltUp.thTiltUp == "middle"){ val_up2 = settings.thTiltUp_middle; }
                else if(settings.tiltUp.thTiltUp == "hard"){ val_up2 = settings.thTiltUp_hard; }
                //else{ val_up2 = settings.tiltUp.thTiltUp; }

                if(x > parseInt(val_up2)){
                    map["event"] = map_event["port-up"];
                    map["value"] = x;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }

            /*
            if(settings.tiltUp_middle.thTiltUp == null) {
                var val_up1_middle = settings.thTiltUp_middle;
                if(x > val_up1_middle){
                    map["event"] = map_event["port-up_middle"];
                    map["value"] = x;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
            else{
                var val_up2_middle;

                if(settings.tiltUp_middle.thTiltUp == "middle"){ val_up2_middle = settings.thTiltUp_middle; }
                else if(settings.tiltUp_middle.thTiltUp == "hard"){ val_up2_middle = settings.thTiltUp_hard; }
                else{ val_up2_middle = settings.tiltUp_middle.thTiltUp; }

                if(x > val_up2_middle){
                    map["event"] = map_event["port-up_middle"];
                    map["value"] = x;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
            if(settings.tiltUp_hard.thTiltUp == null) {
                var val_up1_hard = settings.thTiltUp_hard;
                if(x > val_up1_hard){
                    map["event"] = map_event["port-up_hard"];
                    map["value"] = x;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
            else{
                var val_up2_hard;

                if(settings.tiltUp_hard.thTiltUp == "middle"){ val_up2_hard = settings.thTiltUp_middle; }
                else if(settings.tiltUp_hard.thTiltUp == "hard"){ val_up2_hard = settings.thTiltUp_hard; }
                else{ val_up2_hard = settings.tiltUp_hard.thTiltUp; }

                if(x > val_up2_hard){
                    map["event"] = map_event["port-up_hard"];
                    map["value"] = x;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
*/

            if(settings.tiltDown.thTiltDown == null){
                var val_down1 = settings.thTiltDown;
                if(x < parseInt(val_down1)){
                    map["event"] = map_event["port-down"];
                    map["value"] = x;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
            else{
                var val_down2 = parseInt(settings.tiltDown.thTiltDown);

                if(settings.tiltDown.thTiltDown == "middle"){ val_down2 = settings.thTiltDown_middle; }
                else if(settings.tiltDown.thTiltDown == "hard"){ val_down2 = settings.thTiltDown_hard; }
                //else{ val_down2 = parseInt(settings.tiltDown.thTiltDown); }

                if(x < parseInt(val_down2)){
                    map["event"] = map_event["port-down"];
                    map["value"] = x;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }

            /*
            if(settings.tiltDown_middle.thTiltDown == null){
                var val_down1_middle = settings.thTiltDown_middle;
                if(x < val_down1_middle){
                    map["event"] = map_event["port-down_middle"];
                    map["value"] = x;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
            else{
                var val_down2_middle;

                if(settings.tiltDown_middle.thTiltDown == "middle"){ val_down2_middle = settings.thTiltDown_middle; }
                else if(settings.tiltDown_middle.thTiltDown == "hard"){ val_down2_middle = settings.thTiltDown_hard; }
                else{ val_down2_middle = -1 * parseInt(settings.tiltDown_middle.thTiltDown); }

                if(x < val_down2_middle){
                    map["event"] = map_event["port-down_middle"];
                    map["value"] = x;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
            if(settings.tiltDown_hard.thTiltDown == null){
                var val_down1_hard = settings.thTiltDown_hard;
                if(x < val_down1_hard){
                    map["event"] = map_event["port-down_hard"];
                    map["value"] = x;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
            else{
                var val_down2_hard;

                if(settings.tiltDown_hard.thTiltDown == "middle"){ val_down2_hard = settings.thTiltDown_middle; }
                else if(settings.tiltDown_hard.thTiltDown == "hard"){ val_down2_hard = settings.thTiltDown_hard; }
                else{ val_down2_hard = -1 * parseInt(settings.tiltDown_hard.thTiltDown); }

                if(x < val_down2_hard){
                    map["event"] = map_event["port-down_hard"];
                    map["value"] = x;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
*/

            if(settings.tiltLeft.thTiltLeft == null){
                var val_left1 = settings.thTiltLeft;
                if(y < parseInt(val_left1)){
                    map["event"] = map_event["port-left"];
                    map["value"] = y;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
            else{
                var val_left2 = parseInt(settings.tiltLeft.thTiltLeft);

                if(settings.tiltLeft.thTiltLeft == "middle"){ val_left2 = settings.thTiltLeft_middle; }
                else if(settings.tiltLeft.thTiltLeft == "hard"){ val_left2 = settings.thTiltLeft_hard; }
                //else{ val_left2 = parseInt(settings.tiltLeft.thTiltLeft); }

                if(y < parseInt(val_left2)){
                    map["event"] = map_event["port-left"];
                    map["value"] = y;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }

            /*
            if(settings.tiltLeft_middle.thTiltLeft == null){
                var val_left1_middle = settings.thTiltLeft_middle;
                if(y < val_left1_middle){
                    map["event"] = map_event["port-left_middle"];
                    map["value"] = y;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
            else{
                var val_left2_middle;

                if(settings.tiltLeft_middle.thTiltLeft == "middle"){ val_left2_middle = settings.thTiltLeft_middle; }
                else if(settings.tiltLeft_middle.thTiltLeft == "hard"){ val_left2_middle = settings.thTiltLeft_hard; }
                else{ val_left2_middle = -1 * parseInt(settings.tiltLeft_middle.thTiltLeft); }

                if(y < val_left2_middle){
                    map["event"] = map_event["port-left_middle"];
                    map["value"] = y;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
            if(settings.tiltLeft_hard.thTiltLeft == null){
                var val_left1_hard = settings.thTiltLeft_hard;
                if(y < val_left1_hard){
                    map["event"] = map_event["port-left_hard"];
                    map["value"] = y;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
            else{
                var val_left2_hard;

                if(settings.tiltLeft_hard.thTiltLeft == "middle"){ val_left2_hard = settings.thTiltLeft_middle; }
                else if(settings.tiltLeft_hard.thTiltLeft == "hard"){ val_left2_hard = settings.thTiltLeft_hard; }
                else{ val_left2_hard = -1 * parseInt(settings.tiltLeft_hard.thTiltLeft); }

                if(y < val_left2_hard){
                    map["event"] = map_event["port-left_hard"];
                    map["value"] = y;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
*/

            if(settings.tiltRight.thTiltRight == null){
                var val_right1 = settings.thTiltRight;
                if(y > parseInt(val_right1)){
                    map["event"] = map_event["port-right"];
                    map["value"] = y;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
            else{
                var val_right2 = parseInt(settings.tiltRight.thTiltRight);

                if(settings.tiltRight.thTiltRight == "middle"){ val_right2 = settings.thTiltRight_middle; }
                else if(settings.tiltRight.thTiltRight == "hard"){ val_right2 = settings.thTiltRight_hard; }
                //else{ val_right2 = parseInt(settings.tiltRight.thTiltRight); }

                if(y > parseInt(val_right2)){
                    map["event"] = map_event["port-right"];
                    map["value"] = y;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }

            /*if(settings.tiltRight_middle.thTiltRight == null){
                var val_right1_middle = settings.thTiltRight_middle;
                if(y > val_right1_middle){
                    map["event"] = map_event["port-right_middle"];
                    map["value"] = y;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
            else{
                var val_right2_middle;

                if(settings.tiltRight_middle.thTiltRight == "middle"){ val_right2_middle = settings.thTiltRight_middle; }
                else if(settings.tiltRight_middle.thTiltRight == "hard"){ val_right2_middle = settings.thTiltRight_hard; }
                else{ val_right2_middle = parseInt(settings.tiltRight_middle.thTiltRight); }

                if(y > val_right2_middle){
                    map["event"] = map_event["port-right_middle"];
                    map["value"] = y;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
            if(settings.tiltRight_hard.thTiltRight == null){
                var val_right1_hard = settings.thTiltRight_hard;
                if(y > val_right1_hard){
                    map["event"] = map_event["port-right_hard"];
                    map["value"] = y;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
            else{
                var val_right2_hard;

                if(settings.tiltRight_hard.thTiltRight == "middle"){ val_right2_hard = settings.thTiltRight_middle; }
                else if(settings.tiltRight_hard.thTiltRight == "hard"){ val_right2_hard = settings.thTiltRight_hard; }
                else{ val_right2_hard = parseInt(settings.tiltRight_hard.thTiltRight); }

                if(y > val_right2_hard){
                    map["event"] = map_event["port-right_hard"];
                    map["value"] = y;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
*/

            if(settings.tiltClock.thTiltClock == null){
                var val_clock1 = settings.thTiltClock;
                if(z < parseInt(val_clock1)){
                    map["event"] = map_event["port-clock"];
                    map["value"] = z;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
            else{
                var val_clock2 = parseInt(settings.tiltClock.thTiltClock);

                if(settings.tiltClock.thTiltClock == "middle"){ val_clock2 = settings.thTiltClock_middle; }
                else if(settings.tiltClock.thTiltClock == "hard"){ val_clock2 = settings.thTiltClock_hard; }
                //else{ val_clock2 = parseInt(settings.tiltClock.thTiltClock); }

                if(z < parseInt(val_clock2)){
                    map["event"] = map_event["port-clock"];
                    map["value"] = z;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }

            /*
            if(settings.tiltClock_middle.thTiltClock == null){
                var val_clock1_middle = settings.thTiltClock_middle;
                if(z < val_clock1_middle){
                    map["event"] = map_event["port-clock_middle"];
                    map["value"] = z;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
            else{
                var val_clock2_middle;

                if(settings.tiltClock_middle.thTiltClock == "middle"){ val_clock2_middle = settings.thTiltClock_middle; }
                else if(settings.tiltClock_middle.thTiltClock == "hard"){ val_clock2_middle = settings.thTiltClock_hard; }
                else{ val_clock2_middle = -1 * parseInt(settings.tiltClock_middle.thTiltClock); }

                if(z < val_clock2_middle){
                    map["event"] = map_event["port-clock_middle"];
                    map["value"] = z;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
            if(settings.tiltClock_hard.thTiltClock == null){
                var val_clock1_hard = settings.thTiltClock_hard;
                if(z < val_clock1_hard){
                    map["event"] = map_event["port-clock_hard"];
                    map["value"] = z;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
            else{
                var val_clock2_hard;

                if(settings.tiltClock_hard.thTiltClock == "middle"){ val_clock2_hard = settings.thTiltClock_middle; }
                else if(settings.tiltClock_hard.thTiltClock == "hard"){ val_clock2_hard = settings.thTiltClock_hard; }
                else{ val_clock2_hard = -1 * parseInt(settings.tiltClock_hard.thTiltClock); }

                if(z < val_clock2_hard){
                    map["event"] = map_event["port-clock_hard"];
                    map["value"] = z;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
*/

            if(settings.tiltCounterClock.thTiltCounterClock == null){
                var val_counterclock1 = settings.thTiltCounterClock;
                if(z > parseInt(val_counterclock1)){
                    map["event"] = map_event["port-counterclock"];
                    map["value"] = z;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
            else{
                var val_counterclock2 = settings.tiltCounterClock.thTiltCounterClock;

                if(settings.tiltCounterClock.thTiltCounterClock == "middle"){ val_counterclock2 = settings.thTiltCounterClock_middle; }
                else if(settings.tiltCounterClock.thTiltCounterClock == "hard"){ val_counterclock2 = settings.thTiltCounterClock_hard; }
                //else{ val_counterclock2 = settings.tiltCounterClock.thTiltCounterClock; }

                if(z > parseInt(val_counterclock2)){
                    map["event"] = map_event["port-counterclock"];
                    map["value"] = z;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }

            /*if(settings.tiltCounterClock_middle.thTiltCounterClock == null){
                var val_counterclock1_middle = settings.thTiltCounterClock_middle;
                if(z > val_counterclock1_middle){
                    map["event"] = map_event["port-counterclock_middle"];
                    map["value"] = z;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
            else{
                var val_counterclock2_middle;

                if(settings.tiltCounterClock_middle.thTiltCounterClock == "middle"){ val_counterclock2_middle = settings.thTiltCounterClock_middle; }
                else if(settings.tiltCounterClock_middle.thTiltCounterClock == "hard"){ val_counterclock2_middle = settings.thTiltCounterClock_hard; }
                else{ val_counterclock2_middle = settings.tiltCounterClock_middle.thTiltCounterClock; }

                if(z > val_counterclock2_middle){
                    map["event"] = map_event["port-counterclock_middle"];
                    map["value"] = z;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
            if(settings.tiltCounterClock_hard.thTiltCounterClock == null){
                var val_counterclock1_hard = settings.thTiltCounterClock_hard;
                if(z > val_counterclock1_hard){
                    map["event"] = map_event["port-counterclock_hard"];
                    map["value"] = z;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
            else{
                var val_counterclock2_hard;

                if(settings.tiltCounterClock_hard.thTiltCounterClock == "middle"){ val_counterclock2_hard = settings.thTiltCounterClock_middle; }
                else if(settings.tiltCounterClock_hard.thTiltCounterClock == "hard"){ val_counterclock2_hard = settings.thTiltCounterClock_hard; }
                else{ val_counterclock2_hard = settings.tiltCounterClock_hard.thTiltCounterClock; }

                if(z > val_counterclock2_hard){
                    map["event"] = map_event["port-counterclock_hard"];
                    map["value"] = z;
                    dim_motion = buffer_motion_events.push(map);
                    tilt = true;
                }
            }
*/

        }
        else{
            if(count < settings.dimBufferDiscard){
                if(count == 1){
                    var event_to_perform = democracy_buffer();
                    //alert(event_to_perform);
                    //document.getElementById("msg1").innerHTML = event_to_perform;
                    perform_event(event_to_perform);
                    empty_array(buffer_motion_events);
                }
                count++;
            }
            else{ count = 0; tilt = false; }
        }
    }

    function playSound(soundfile){
        $("body").append( "<audio id='sound-tilt'> <source  type='audio/mpeg' src="+soundfile+" /> Your browser does not support the audio element. </audio>");
    }

    /**
     *
     * @returns {undefined}
     */
    function democracy_buffer(){
        return buffer_motion_events[0]["event"];
    }

    function show_visualFeedback(cur_color, position){
        var color = cur_color;
        var pos = position;

        //var screen_width = screen.availWidth, screen_height = screen.availHeight;
        var screen_width = window.outerWidth, screen_height = window.outerHeight;
        var line_thickness, thin = 20, medium = 2 * thin, thick = 4 * thin;

        var line = document.createElement("div");
        line.id = "line";
        line.style.position = "fixed";
        line.style.display = "none";
        line.style.zIndex = 100000000;

        if(pos == "up"){
            if(settings.tiltUp.thTiltUp != null){
                if(settings.tiltUp.thTiltUp == "middle" ||
                    (
                    settings.tiltUp.thTiltUp > settings.thTiltUp_middle &&
                    settings.tiltUp.thTiltUp < settings.thTiltUp_hard
                    )
                )
                {
                    line_thickness = medium;
                }
                else if(settings.tiltUp.thTiltUp == "hard" || settings.tiltUp.thTiltUp > settings.thTiltUp_hard){
                    line_thickness = thick;
                }
                else{
                    line_thickness = thin;
                }
            }
            else{
                line_thickness = thin;
            }

            line.style.width = screen_width + "px";
            line.style.height = line_thickness + "px";
            line.style.left = "0px";
            line.style.bottom = "0px";
            line.style.background = "linear-gradient(to bottom, white, " + color + ")";
        }
        if(pos == "up_middle"){
            line_thickness = medium;

            line.style.width = screen_width + "px";
            line.style.height = line_thickness + "px";
            line.style.left = "0px";
            line.style.bottom = "0px";
            line.style.background = "linear-gradient(to bottom, white, " + color + ")";
        }
        if(pos == "up_hard"){
            line_thickness = thick;

            line.style.width = screen_width + "px";
            line.style.height = line_thickness + "px";
            line.style.left = "0px";
            line.style.bottom = "0px";
            line.style.background = "linear-gradient(to bottom, white, " + color + ")";
        }

        if(pos == "down"){
            if(settings.tiltDown.thTiltDown != null){
                if(settings.tiltDown.thTiltDown == "middle" ||
                    (
                    settings.tiltDown.thTiltDown < settings.thTiltDown_middle &&
                    settings.tiltDown.thTiltDown > settings.thTiltDown_hard
                    )
                )
                {
                    line_thickness = medium;
                }
                else if(settings.tiltDown.thTiltDown == "hard" || settings.tiltDown.thTiltDown < settings.thTiltDown_hard){
                    line_thickness = thick;
                }
                else{
                    line_thickness = thin;
                }
            }
            else{
                line_thickness = thin;
            }

            line.style.width = screen_width + "px";
            line.style.height = line_thickness + "px";
            line.style.left = "0px";
            line.style.top = "0px";
            line.style.background = "linear-gradient(to top, white, " + color + ")";
        }
        if(pos == "down_middle"){
            line_thickness = medium;

            line.style.width = screen_width + "px";
            line.style.height = line_thickness + "px";
            line.style.left = "0px";
            line.style.top = "0px";
            line.style.background = "linear-gradient(to top, white, " + color + ")";
        }
        if(pos == "down_hard"){
            line_thickness = thick;

            line.style.width = screen_width + "px";
            line.style.height = line_thickness + "px";
            line.style.left = "0px";
            line.style.top = "0px";
            line.style.background = "linear-gradient(to top, white, " + color + ")";
        }

        if(pos == "left"){
            if(settings.tiltLeft.thTiltLeft != null){
                if(settings.tiltLeft.thTiltLeft == "middle" ||
                    (
                    settings.tiltLeft.thTiltLeft < settings.thTiltLeft_middle &&
                    settings.tiltLeft.thTiltLeft > settings.thTiltLeft_hard
                    )
                )
                {
                    line_thickness = medium;
                }
                else if(settings.tiltLeft.thTiltLeft == "hard" || settings.tiltLeft.thTiltLeft < settings.thTiltLeft_hard){
                    line_thickness = thick;
                }
                else{
                    line_thickness = thin;
                }
            }
            else{
                line_thickness = thin;
            }

            line.style.width = line_thickness + "px";
            line.style.height = screen_height + "px";
            line.style.left = "0px";
            line.style.background = "linear-gradient(to left, white, " + color + ")";
        }
        if(pos == "left_middle"){
            line_thickness = medium;

            line.style.width = line_thickness + "px";
            line.style.height = screen_height + "px";
            line.style.left = "0px";
            line.style.background = "linear-gradient(to left, white, " + color + ")";
        }
        if(pos == "left_hard"){
            line_thickness = thick;

            line.style.width = line_thickness + "px";
            line.style.height = screen_height + "px";
            line.style.left = "0px";
            line.style.background = "linear-gradient(to left, white, " + color + ")";
        }

        if(pos == "right"){
            if(settings.tiltRight.thTiltRight != null){
                if(settings.tiltRight.thTiltRight == "middle" ||
                    (
                    settings.tiltRight.thTiltRight > settings.thTiltRight_middle &&
                    settings.tiltRight.thTiltRight < settings.thTiltRight_hard
                    )
                )
                {
                    line_thickness = medium;
                }
                else if(settings.tiltRight.thTiltRight == "hard" || settings.tiltRight.thTiltRight > settings.thTiltRight_hard){
                    line_thickness = thick;
                }
                else{
                    line_thickness = thin;
                }
            }
            else{
                line_thickness = thin;
            }


            line.style.width = line_thickness + "px";
            line.style.height = screen_height + "px";
            line.style.right = "0px";
            line.style.background = "linear-gradient(to right, white, " + color + ")";
        }
        if(pos == "right_middle"){
            line_thickness = medium;

            line.style.width = line_thickness + "px";
            line.style.height = screen_height + "px";
            line.style.right = "0px";
            line.style.background = "linear-gradient(to right, white, " + color + ")";
        }
        if(pos == "right_hard"){
            line_thickness = thick;

            line.style.width = line_thickness + "px";
            line.style.height = screen_height + "px";
            line.style.right = "0px";
            line.style.background = "linear-gradient(to right, white, " + color + ")";
        }

        if(pos == "clock"){
            if(settings.tiltClock.thTiltClock != null){
                if(settings.tiltClock.thTiltClock == "middle" ||
                    (
                    settings.tiltClock.thTiltClock < settings.thTiltClock_middle &&
                    settings.tiltClock.thTiltClock > settings.thTiltClock_hard
                    )
                )
                {
                    line_thickness = 2*medium;
                }
                else if(settings.tiltLeft.thTiltClock == "hard" ||
                    settings.tiltClock.thTiltClock < settings.thTiltClock_hard
                )
                {
                    line_thickness = 2*thick;
                }
                else{
                    line_thickness = 2*thin;
                }
            }
            else{
                line_thickness = 2*thin;
            }

            line.style.width = 2*line_thickness + "px";
            line.style.height = 2*line_thickness + "px";
            line.style.transform = "rotate(45deg)";
            line.style.right = "-" + line_thickness + "px";
            line.style.top = "-" + line_thickness + "px";
            line.style.background = "linear-gradient(to top, rgba(255,255,255,0.4) 0%, " + color + " 30%)";
        }
        if(pos == "clock_middle"){
            line_thickness = 2*medium;

            line.style.width = 2*line_thickness + "px";
            line.style.height = 2*line_thickness + "px";
            line.style.transform = "rotate(45deg)";
            line.style.right = "-" + line_thickness + "px";
            line.style.top = "-" + line_thickness + "px";
            line.style.background = "linear-gradient(to top, rgba(255,255,255,0.4) 0%, " + color + " 30%)";
        }
        if(pos == "clock_hard"){
            line_thickness = 2*thick;

            line.style.width = 2*line_thickness + "px";
            line.style.height = 2*line_thickness + "px";
            line.style.transform = "rotate(45deg)";
            line.style.right = "-" + line_thickness + "px";
            line.style.top = "-" + line_thickness + "px";
            line.style.background = "linear-gradient(to top, rgba(255,255,255,0.4) 0%, " + color + " 30%)";
        }

        if(pos == "counterclock"){
            if(settings.tiltCounterClock.thTiltCounterClock != null){
                if(settings.tiltCounterClock.thTiltCounterClock == "middle" ||
                    (
                    settings.tiltCounterClock.thTiltCounterClock > settings.thTiltCounterClock_middle &&
                    settings.tiltCounterClock.thTiltCounterClock < settings.thTiltCounterClock_hard
                    )
                )
                {
                    line_thickness = 2*medium;
                }
                else if(settings.tiltCounterClock.thTiltCounterClock == "hard" ||
                    settings.tiltCounterClock.thTiltCounterClock > settings.thTiltCounterClock_hard
                )
                {
                    line_thickness = 2*thick;
                }
                else{
                    line_thickness = 2*thin;
                }
            }
            else{
                line_thickness = 2*thin;
            }


            line.style.width = 2*line_thickness + "px";
            line.style.height = 2*line_thickness + "px";
            line.style.transform = "rotate(-45deg)";
            line.style.left = "-" + line_thickness + "px";
            line.style.top = "-" + line_thickness + "px";
            line.style.background = "linear-gradient(to top, rgba(255,255,255,0.4) 0%, " + color + " 30%)";
        }
        if(pos == "counterclock_middle"){
            line_thickness = 2*medium;

            line.style.width = 2*line_thickness + "px";
            line.style.height = 2*line_thickness + "px";
            line.style.transform = "rotate(-45deg)";
            line.style.left = "-" + line_thickness + "px";
            line.style.top = "-" + line_thickness + "px";
            line.style.background = "linear-gradient(to top, rgba(255,255,255,0.4) 0%, " + color + " 30%)";
        }
        if(pos == "counterclock_hard"){
            line_thickness = 2*thick;

            line.style.width = 2*line_thickness + "px";
            line.style.height = 2*line_thickness + "px";
            line.style.transform = "rotate(-45deg)";
            line.style.left = "-" + line_thickness + "px";
            line.style.top = "-" + line_thickness + "px";
            line.style.background = "linear-gradient(to top, rgba(255,255,255,0.4) 0%, " + color + " 30%)";
        }


        var doc_body = document.body;
        doc_body.insertBefore(line, doc_body.childNodes[0]);

        $('#line').stop().fadeIn(0).delay(1000).fadeOut(1000);
    }

    function vibrate_it(duration){

        var dur = parseInt(duration);

        navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

        if (navigator.vibrate) {
            navigator.vibrate(dur);
        }
        else {
            //console.log("vibration not supported");
        }
    }

    function show_popup(text){
        if(!document.getElementById("popup")){
            var popup = document.createElement("div");
            var t = document.createTextNode(text);    popup.appendChild(t);
            popup.id = "popup";
            popup.style.display = "none";   popup.style.width = "200px";
            popup.style.height = "20px";    popup.style.height = "auto";
            popup.style.position = "absolute";  popup.style.left = "50%";
            popup.style.marginLeft = "-100px";  popup.style.bottom = "10px";
            popup.style.backgroundColor = "#383838";    popup.style.color = "#F0F0F0";
            popup.style.fontSize = "20px";  popup.style.padding = "10px";
            popup.style.textAlign = "center";   popup.style.borderRadius = "2px";
            popup.style.webkitBoxShadow = "0px 0px 24px -1px rgba(56, 56, 56, 1)";
            popup.style.boxShadow = "0px 0px 24px -1px rgba(56, 56, 56, 1)";
            var list = document.body;
            list.insertBefore(popup, list.childNodes[0]);
        }
        $('#popup').stop().fadeIn(400).delay(500).fadeOut(400);
    }

    function play_sound(file){
        var audio = new Audio(file);
        audio.play();
    }


    //Continuous tilting logic
    function func_ball(){
        if(! document.getElementById('ball')) { //comment this out to have >1 balls
            var ball = document.createElement("div");
            ball.id = "ball";
            ball.style.zIndex = 10;
            ball.style.background = (settings.elem_selection.indicator.color != null) ? settings.elem_selection.indicator.color : elem_selection_indicator_color;
            ball.style.width = (settings.elem_selection.indicator.radius != null) ? parseInt(settings.elem_selection.indicator.radius) * 2 + "px" : parseInt(elem_selection_indicator_radius) * 2 + "px";
            ball.style.height = (settings.elem_selection.indicator.radius != null) ? parseInt(settings.elem_selection.indicator.radius) * 2 + "px" : parseInt(elem_selection_indicator_radius) * 2 + "px";
            ball.style.position = "absolute";
            ball.style.top = (settings.elem_selection.indicator.top != null) ? settings.elem_selection.indicator.top : elem_selection_indicator_top;
            ball.style.left = (settings.elem_selection.indicator.left != null) ? settings.elem_selection.indicator.left : elem_selection_indicator_left;
            ball.style.marginLeft = (settings.elem_selection.indicator.radius != null) ? -parseInt(settings.elem_selection.indicator.radius) + "px" : -parseInt(elem_selection_indicator_radius) + "px";
            ball.style.opacity = (settings.elem_selection.indicator.opacity != null) ? settings.elem_selection.indicator.opacity : elem_selection_indicator_opacity;
            ball.style.borderRadius = "50%";

            var tmp_visibility = (settings.elem_selection.indicator.visibility != null) ? settings.elem_selection.indicator.visibility : elem_selection_indicator_visibility;
            ball.style.display = (tmp_visibility == true) ? "inline" : "none";

            if(settings.elem_selection.indicator.element != null && settings.elem_selection.indicator.element != elem_selection_indicator_element){
                var cur_element = settings.elem_selection.indicator.element;
                document.getElementById(cur_element).appendChild(ball);
            }
            else{
                document.body.appendChild(ball);
            }
        }

        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', deviceMotionHandler, true);
        }


        var direction;
        if(settings.elem_selection.scrollingdirection != null){
            if(settings.elem_selection.scrollingdirection == "physical"){
                direction = -1;
            }
            else{
                direction = 1;
            }
        }
        else{
            if(elem_selection_scrollingdirection == "physical"){ direction = -1; }
            else{ direction = 1; }
        }

        var arti = 1, eksi = -1,
            tmp_speed = ((settings.elem_selection.speed != null) ? settings.elem_selection.speed : elem_selection_speed),
            speed = direction * 3.5 * tmp_speed,
            curgamma = 0, curfb = 0, prevgamma = 0, prevfb = 0, firstgamma = 0, firstfb = 0,
            dimension,
            threshold = ((settings.elem_selection.sensitivity != null) ? settings.elem_selection.sensitivity : elem_selection_sensitivity),
            gotfirstvalues = false;


        //normally, the ball behaves always as a spirit level, but this can be prevented if the sliding direction is counterphysical
        if(settings.elem_selection.indicator.dimensionality != null){// 0 for 1D which is the x-axis, +-1 for 2D
            if(settings.elem_selection.indicator.dimensionality == "1D"){ dimension = 0; }
            else{ dimension = 1 * direction * (-1); }
        }
        else{
            if(elem_selection_indicator_dimensionality == "1D"){ dimension = 0; }
            else{ dimension = 1 * direction * (-1); }
        }

        firstgamma = curgamma; firstfb = curfb;

        var tick = 16.666,
            rate = 0,
            rate2 = 0,
            x = window.innerWidth / 2,
            y = 0,
            $bl = $("." + settings.elem_selection.gallery.outerid),
            $th = $("." + settings.elem_selection.gallery.innerid),
            blW = $bl.outerWidth(),
            blW2 = $bl.outerHeight(),
            blSW = $bl[0].scrollWidth, //blSW is longer than blW, if div of images is longer than the screen-width
            wDiff = (blSW/blW)-1;

        $th.css({marginLeft: -(x)*wDiff });

        var curId = "", prevId = "";
        var prev_img = "", cur_img = "", img_class = settings.elem_selection.gallery.classname;


        //HERE STARTS THE MAGIC (for the gallery)
        var
            alpha = 0, ballgamma = 0, ballfb = 0,
            first_time = true,
            handleMotionEvent = function(e) {
                alpha = e.accelerationIncludingGravity.x;

                if(window.orientation == 90){
                    alpha = e.accelerationIncludingGravity.y;
                }
                else if(window.orientation == -90 || window.orientation == 270){
                    alpha = -1 * e.accelerationIncludingGravity.y;
                }
                else if(window.orientation == -180 || window.orientation == 180){
                    alpha = -1 * e.accelerationIncludingGravity.x;
                }

                if (Math.abs(alpha) < threshold) { alpha = 0; }
            },
            my_func = function(){
                if(dimension == 0){
                    rate = direction * ballgamma * 4;
                    x -= rate;
                    if(x < 0){ x = 0; }
                    if(x > blW){ x = blW; }
                    $th.css({marginLeft: -(x)*wDiff });
                    if(first_time == true){
                        first_time = false;
                    }
                }
                else{
                    rate = direction * ballgamma * 4;
                    x -= rate;
                    if(x < 0){ x = 0; }
                    if(x > blW){ x = blW; }
                    $th.css({marginLeft: -(x)*wDiff });

                    rate2 = direction * ballfb * 4;
                    y -= rate2;
                    if(y < 0){ y = 0; }
                    if(y > blW2){ y = blW2; }
                    $th.css({marginTop: -(y)*wDiff });

                    if(first_time == true){
                        first_time = false;
                    }
                }
            };

        var sliding_enabled = ((settings.elem_selection.gallery.sliding_enabled != null) ?
            settings.elem_selection.gallery.sliding_enabled : default_sliding_enabled);

        if(sliding_enabled == true){
            window.addEventListener("devicemotion", handleMotionEvent, false);
            window.setInterval(my_func, tick);
        }


        //Offshore: Here are the all the information about the elements in the gallery stored
        var orig_marginLeft = $th[0].style.marginLeft;
        var orig_marginTop = $th[0].style.marginTop;
        var classname = settings.elem_selection.gallery.classname;
        var radius = (settings.elem_selection.indicator.radius != null) ? parseInt(settings.elem_selection.indicator.radius) : parseInt(elem_selection_indicator_radius);
        var arr_img_pos = new Array(document.getElementsByClassName(classname).length);


        //store the positions of the elements in the gallery
        for (var i = 0; i < document.getElementsByClassName(classname).length; ++i) {
            arr_img_pos[i] = new Array(4);

            var cur_id = document.getElementsByClassName(classname)[i].getAttribute("id");
            var e1 = document.getElementById(cur_id); var offset1 = {x:0,y:0,width:0,height:0};
            while (e1){ offset1.x += parseInt(e1.offsetLeft); offset1.y += parseInt(e1.offsetTop); offset1.width = parseInt($("#"+cur_id).width()); offset1.height = parseInt($("#"+cur_id).height()); e1 = e1.offsetParent; } if (document.documentElement && (document.documentElement.scrollTop || document.documentElement.scrollLeft)){ offset1.x -= document.documentElement.scrollLeft; offset1.y -= document.documentElement.scrollTop; } else if (document.body && (document.body.scrollTop || document.body.scrollLeft)){ offset1.x -= document.body.scrollLeft; offset1.y -= document.body.scrollTop; } else if (window.pageXOffset || window.pageYOffset){ offset1.x -= window.pageXOffset; offset1.y -= window.pageYOffset; }

            arr_img_pos[i][0] = offset1.x;
            arr_img_pos[i][1] = offset1.x + offset1.width;

            arr_img_pos[i][2] = offset1.y;
            arr_img_pos[i][3] = offset1.y + offset1.height;
        }


        //store the information about the ball's element
        var e, offset;
        if(settings.elem_selection.indicator.element != null){ //if there exists an element where the ball should be placed
            e = document.getElementById(settings.elem_selection.indicator.element);

            offset = {x:0,y:0,width:0,height:0}; while (e){
                offset.x += parseInt(e.offsetLeft); offset.y += parseInt(e.offsetTop);
                offset.width = parseInt($("#"+settings.elem_selection.indicator.element).width());
                offset.height = parseInt($("#"+settings.elem_selection.indicator.element).height());
                e = e.offsetParent;
            }

            if (document.documentElement && (document.documentElement.scrollTop || document.documentElement.scrollLeft)){ offset.x -= document.documentElement.scrollLeft; offset.y -= document.documentElement.scrollTop; } else if (document.body && (document.body.scrollTop || document.body.scrollLeft)){ offset.x -= document.body.scrollLeft; offset.y -= document.body.scrollTop; } else if (window.pageXOffset || window.pageYOffset){ offset.x -= window.pageXOffset; offset.y -= window.pageYOffset; }

        }
        else{ //otherwise use the screen as the ball's div
            e = document.body;

            offset = {x:0,y:0,width:0,height:0}; while (e){
                offset.x += parseInt(e.offsetLeft); offset.y += parseInt(e.offsetTop);
                offset.width = blW;
                offset.height = blW;
                e = e.offsetParent;
            }

            if (document.documentElement && (document.documentElement.scrollTop || document.documentElement.scrollLeft)){ offset.x -= document.documentElement.scrollLeft; offset.y -= document.documentElement.scrollTop; } else if (document.body && (document.body.scrollTop || document.body.scrollLeft)){ offset.x -= document.body.scrollLeft; offset.y -= document.body.scrollTop; } else if (window.pageXOffset || window.pageYOffset){ offset.x -= window.pageXOffset; offset.y -= window.pageYOffset; }

        }



        function deviceMotionHandler(eventData) {
            //'granularity' variable is used ONLY for computational reason, so doesn't change the functionality at all
            var granularity = 100;

            var acc_grav = eventData.accelerationIncludingGravity;
            var tilt_lr = Math.round(granularity * acc_grav.x) / granularity;
            var tilt_fb = Math.round(granularity * acc_grav.y) / granularity;
            var acc_grav_z = Math.round(granularity * acc_grav.z) / granularity;

            if(window.orientation == 90){
                tilt_lr = -1 * Math.round(granularity * acc_grav.y) / granularity;
                tilt_fb = -1 * Math.round(granularity * acc_grav.x) / granularity;
            }
            else if(window.orientation == -90 || window.orientation == 270){
                tilt_lr = Math.round(granularity * acc_grav.y) / granularity;
                tilt_fb = Math.round(granularity * acc_grav.x) / granularity;
            }
            else if(window.orientation == -180 || window.orientation == 180){
                tilt_lr = -1 * Math.round(granularity * acc_grav.x) / granularity;
                tilt_fb = -1 * Math.round(granularity * acc_grav.y) / granularity;
            }


            if(gotfirstvalues == false){
                if(curgamma == 0 && prevgamma == 0 && curfb == 0 && prevfb == 0) {
                    firstgamma = tilt_lr; firstfb = tilt_fb;
                    gotfirstvalues = true;
                }
            }

            curgamma = tilt_lr;  curfb = tilt_fb;
            var deltagamma = curgamma - firstgamma; var deltafb = curfb - firstfb;
            if(Math.abs(deltagamma) < threshold){ deltagamma = 0; }
            if(Math.abs(deltafb) < threshold){ deltafb = 0; }
            ballgamma = deltagamma; ballfb = deltafb;

            var os = $("#ball").offset();
            var bottomn = parseInt(offset.y + offset.height) - ((os.top + ((arti * ballfb) * speed))) - $("#ball").height();
            var rightn = parseInt(offset.x + offset.width) - (os.left + (eksi * ballgamma * speed)) - $("#ball").width();
            var leftn = os.left + (eksi * ballgamma * speed);
            var topn = os.top - 1 + ((arti * ballfb) * speed);

            var original_top = parseInt(offset.y + offset.height) - $("#ball").height();
            var on_the_right = blW - $("#ball").width();

            if(on_the_right > blW){
                on_the_right = blW;
            }


            if(dimension == 0){
                if(bottomn > speed){
                    if(leftn < parseInt(offset.x)){ //ball @ left border
                        if(topn < parseInt(offset.y)){ $("#ball").offset({left:parseInt(offset.x), top:parseInt(offset.y)}); } //ball @ top-left corner
                        else{ $("#ball").offset({left:parseInt(offset.x), top:os.top + (dimension * ((arti * ballfb) * speed))}); } //ball @ left border
                    }
                    else{
                        if(topn < parseInt(offset.y)){ //ball @ top border
                            if(leftn > blW - (radius * 2)){ $("#ball").offset({left:on_the_right, top:parseInt(offset.y)}); } //ball @ top-right corner
                            else{ $("#ball").offset({left:os.left + (/*direction **/ eksi * ballgamma * speed), top:parseInt(offset.y)}); } //ball @ top border
                        }
                        else{
                            if(leftn > blW - (radius * 2)){ $("#ball").offset({left:on_the_right, top:os.top + (dimension * ((arti * ballfb) * speed))}); } //ball @ right border
                            else{ $("#ball").offset({left:os.left + (/*direction **/ eksi * ballgamma * speed),top:os.top + (dimension * ((arti * ballfb) * speed))}); }
                        }
                    }
                }
                if(bottomn <= speed){
                    if(leftn < parseInt(offset.x)){ //ball @ left border
                        if(topn < parseInt(offset.y)){ $("#ball").offset({left:parseInt(offset.x), top:parseInt(offset.y)}); } //ball @ top-left corner
                        else{ $("#ball").offset({left:parseInt(offset.x), top:original_top}); } //ball @ bottom-left corner
                    }
                    else{
                        if(topn < parseInt(offset.y)){ //ball @ top border
                            if(leftn > blW - (radius * 2)){ $("#ball").offset({left:on_the_right, top:parseInt(offset.y)}); } //ball @ top-right corner
                            else{ $("#ball").offset({left:os.left+(/*direction **/ eksi * ballgamma * speed), top:parseInt(offset.y)}); } //ball @ top border
                        }
                        else{
                            if(leftn > blW - (radius * 2)){ $("#ball").offset({left:on_the_right, top:original_top}); } //ball @ bottom-right corner
                            else{ $("#ball").offset({left:os.left+(/*direction **/ eksi * ballgamma * speed), top:original_top}); } //ball @ bottom border
                        }
                    }
                }
            }
            else{
                if(bottomn > speed){
                    if(leftn < parseInt(offset.x)){ //ball @ left border
                        if(topn < parseInt(offset.y)){ $("#ball").offset({left:parseInt(offset.x), top:parseInt(offset.y)}); } //ball @ top-left corner
                        else{ $("#ball").offset({left:parseInt(offset.x), top:os.top + (/*dimension **/ ((arti * ballfb) * speed))}); } //ball @ left border
                    }
                    else{
                        if(topn < parseInt(offset.y)){ //ball @ top border
                            if(leftn > blW - (radius * 2)){ $("#ball").offset({left:on_the_right, top:parseInt(offset.y)}); } //ball @ top-right corner
                            else{ $("#ball").offset({left:os.left + (/*direction **/ eksi * ballgamma * speed), top:parseInt(offset.y)}); } //ball @ top border
                        }
                        else{
                            if(leftn > blW - (radius * 2)){ $("#ball").offset({left:on_the_right, top:os.top + (/*dimension **/ ((arti * ballfb) * speed))}); } //ball @ right border
                            else{ $("#ball").offset({left:os.left + (/*direction **/ eksi * ballgamma * speed),top:os.top + (/*dimension **/ ((arti * ballfb) * speed))}); }
                        }
                    }
                }
                if(bottomn <= speed){
                    if(leftn < parseInt(offset.x)){ //ball @ left border
                        if(topn < parseInt(offset.y)){ $("#ball").offset({left:parseInt(offset.x), top:parseInt(offset.y)}); } //ball @ top-left corner
                        else{ $("#ball").offset({left:parseInt(offset.x), top:original_top}); } //ball @ bottom-left corner
                    }
                    else{
                        if(topn < parseInt(offset.y)){ //ball @ top border
                            if(leftn > blW - (radius * 2)){ $("#ball").offset({left:on_the_right, top:parseInt(offset.y)}); } //ball @ top-right corner
                            else{ $("#ball").offset({left:os.left+(/*direction **/ eksi * ballgamma * speed), top:parseInt(offset.y)}); } //ball @ top border
                        }
                        else{
                            if(leftn > blW - (radius * 2)){ $("#ball").offset({left:on_the_right, top:original_top}); } //ball @ bottom-right corner
                            else{ $("#ball").offset({left:os.left+(/*direction **/ eksi * ballgamma * speed), top:original_top}); } //ball @ bottom border
                        }
                    }
                }
            }

            prevgamma = curgamma;
            prevfb = curfb;


            //SELECTION LOGIC STARTS HERE

            if(dimension == 0){ //dimension = "1D"

                //Here, it is sufficient to store only moved amount
                var cur_marginLeft = $th[0].style.marginLeft;
                var delta = parseInt(orig_marginLeft) - parseInt(cur_marginLeft);

                for(var k = 0; k < arr_img_pos.length; ++k) {
                    var cur_imgId = document.getElementsByClassName(classname)[k].getAttribute("id");

                    if (os.left > arr_img_pos[k][0] - delta - radius && os.left < arr_img_pos[k][1] - delta - radius) {
                        curId = cur_imgId;

                        if(curId != prevId){
                            prevId = curId;

                            if ($.isFunction(settings.elem_selection.elem_selected)) {
                                var cur_elem = document.getElementsByClassName(classname)[k];
                                settings.elem_selection.elem_selected.call(this, cur_elem);
                            }
                        }
                    }
                    if(os.left > arr_img_pos[arr_img_pos.length - 1][1] || os.left < arr_img_pos[0][0]){
                        prevId = "";
                    }
                }
            }
            else{ //dimension = "2D"

                //Here, it is sufficient to store only moved amount
                var cur_marginLeft = $th[0].style.marginLeft;
                var cur_marginTop = $th[0].style.marginTop;
                var delta_left = parseInt(orig_marginLeft) - parseInt(cur_marginLeft);
                var delta_top = parseInt(orig_marginTop) - parseInt(cur_marginTop);

                for(var k = 0; k < arr_img_pos.length; ++k) {
                    var cur_imgId = document.getElementsByClassName(classname)[k].getAttribute("id");

                    if (os.left > arr_img_pos[k][0] - delta_left - radius && os.left < arr_img_pos[k][1] - delta_left - radius &&
                        os.top > arr_img_pos[k][2] /*- delta_top*/ - radius && os.top < arr_img_pos[k][3] /*- delta_top*/ - radius) {
                        curId = cur_imgId;

                        if(curId != prevId){
                            prevId = curId;

                            if ($.isFunction(settings.elem_selection.elem_selected)) {
                                var cur_elem = document.getElementsByClassName(classname)[k];
                                settings.elem_selection.elem_selected.call(this, cur_elem);
                            }
                        }
                    }
                    if(os.left > arr_img_pos[arr_img_pos.length - 1][1] || os.left < arr_img_pos[0][0]){
                        prevId = "";
                    }
                }
            }

        }
    }

    /**
     *
     * @param {type} event_to_perform
     * @returns {undefined}
     */
    function perform_event(event_to_perform){
        switch (event_to_perform) {
            case "tiltUP_hard":
                tiltUP_hard(); break;
            case "tiltUP_middle":
                tiltUP_middle(); break;
            case "tiltUP":
                tiltUP(); /*tiltUP_occured = true;*/ break;
            case "tiltDOWN_hard":
                tiltDOWN_hard(); break;
            case "tiltDOWN_middle":
                tiltDOWN_middle(); break;
            case "tiltDOWN":
                tiltDOWN(); break;
            case "tiltLEFT_hard":
                tiltLEFT_hard(); break;
            case "tiltLEFT_middle":
                tiltLEFT_middle(); break;
            case "tiltLEFT":
                tiltLEFT(); break;
            case "tiltRIGHT_hard":
                tiltRIGHT_hard(); break;
            case "tiltRIGHT_middle":
                tiltRIGHT_middle(); break;
            case "tiltRIGHT":
                tiltRIGHT(); break;
            case "tiltCLOCK_hard":
                tiltCLOCK_hard(); break;
            case "tiltCLOCK_middle":
                tiltCLOCK_middle(); break;
            case "tiltCLOCK":
                tiltCLOCK(); break;
            case "tiltCOUNTERCLOCK_hard":
                tiltCOUNTERCLOCK_hard(); break;
            case "tiltCOUNTERCLOCK_middle":
                tiltCOUNTERCLOCK_middle(); break;
            case "tiltCOUNTERCLOCK":
                tiltCOUNTERCLOCK(); break;
        }
    }

    function tiltUP(){
        if(interaction_enabled_up == true) {
            if (settings.tiltUp != null && settings.tiltUp.onTiltUp != null && settings.tiltUp.interaction != null) {
                settings.tiltUp.onTiltUp.call( this );

                if(settings.tiltUp.audioFeedback != null){
                    play_sound(settings.tiltUp.audioFeedback);
                }

                if(settings.tiltUp.vibrationFeedback != null){
                    vibrate_it(settings.tiltUp.vibrationFeedback);
                }

                if(settings.tiltUp.visualFeedback != null){
                    show_visualFeedback(settings.tiltUp.visualFeedback, "up");
                }
            }
        }
        else{
            if(settings.tiltUp != null && settings.tiltUp.onTiltUp != null && settings.tiltUp.interaction == null){
                settings.tiltUp.onTiltUp.call(this);

                if (settings.tiltUp.audioFeedback != null) {
                    play_sound(settings.tiltUp.audioFeedback);
                }

                if (settings.tiltUp.vibrationFeedback != null) {
                    vibrate_it(settings.tiltUp.vibrationFeedback);
                }

                if (settings.tiltUp.visualFeedback != null) {
                    show_visualFeedback(settings.tiltUp.visualFeedback, "up");
                }
            }
            if(settings.onTiltUp != null){
                settings.onTiltUp.call( this );
            }
        }
    }

    /*function tiltUP_middle(){
        if(interaction_enabled_up_middle == true) {
            if (settings.tiltUp_middle != null && settings.tiltUp_middle.onTiltUp != null && settings.tiltUp_middle.interaction != null) {
                settings.tiltUp_middle.onTiltUp.call( this );

                if(settings.tiltUp_middle.audioFeedback != null){
                    play_sound(settings.tiltUp_middle.audioFeedback);
                }

                if(settings.tiltUp_middle.vibrationFeedback != null){
                    vibrate_it(settings.tiltUp_middle.vibrationFeedback);
                }

                if(settings.tiltUp_middle.visualFeedback != null){
                    show_visualFeedback(settings.tiltUp_middle.visualFeedback, "up_middle");
                }
            }
        }
        else{
            if(settings.tiltUp_middle != null && settings.tiltUp_middle.onTiltUp != null && settings.tiltUp_middle.interaction == null){
                settings.tiltUp_middle.onTiltUp.call(this);

                if (settings.tiltUp_middle.audioFeedback != null) {
                    play_sound(settings.tiltUp_middle.audioFeedback);
                }

                if (settings.tiltUp_middle.vibrationFeedback != null) {
                    vibrate_it(settings.tiltUp_middle.vibrationFeedback);
                }

                if (settings.tiltUp_middle.visualFeedback != null) {
                    show_visualFeedback(settings.tiltUp_middle.visualFeedback, "up_middle");
                }
            }
            if(settings.onTiltUp_middle != null){
                settings.onTiltUp_middle.call( this );
            }
        }
    }
    function tiltUP_hard(){
        if(interaction_enabled_up_hard == true) {
            if (settings.tiltUp_hard != null && settings.tiltUp_hard.onTiltUp != null && settings.tiltUp_hard.interaction != null) {
                settings.tiltUp_hard.onTiltUp.call( this );

                if(settings.tiltUp_hard.audioFeedback != null){
                    play_sound(settings.tiltUp_hard.audioFeedback);
                }

                if(settings.tiltUp_hard.vibrationFeedback != null){
                    vibrate_it(settings.tiltUp_hard.vibrationFeedback);
                }

                if(settings.tiltUp_hard.visualFeedback != null){
                    show_visualFeedback(settings.tiltUp_hard.visualFeedback, "up_hard");
                }
            }
        }
        else{
            if(settings.tiltUp_hard != null && settings.tiltUp_hard.onTiltUp != null && settings.tiltUp_hard.interaction == null){
                settings.tiltUp_hard.onTiltUp.call(this);

                if (settings.tiltUp_hard.audioFeedback != null) {
                    play_sound(settings.tiltUp_hard.audioFeedback);
                }

                if (settings.tiltUp_hard.vibrationFeedback != null) {
                    vibrate_it(settings.tiltUp_hard.vibrationFeedback);
                }

                if (settings.tiltUp_hard.visualFeedback != null) {
                    show_visualFeedback(settings.tiltUp_hard.visualFeedback, "up_hard");
                }
            }
            if(settings.onTiltUp_hard != null){
                settings.onTiltUp_hard.call( this );
            }
        }
    }
*/
    function tiltDOWN(){
        if(interaction_enabled_down == true) {
            if (settings.tiltDown != null && settings.tiltDown.onTiltDown != null && settings.tiltDown.interaction != null) {
                settings.tiltDown.onTiltDown.call( this );

                if(settings.tiltDown.audioFeedback != null){
                    play_sound(settings.tiltDown.audioFeedback);
                }

                if(settings.tiltDown.vibrationFeedback != null){
                    vibrate_it(settings.tiltDown.vibrationFeedback);
                }

                if(settings.tiltDown.visualFeedback != null){
                    show_visualFeedback(settings.tiltDown.visualFeedback, "down");
                }
            }
        }
        else{
            if(settings.tiltDown != null && settings.tiltDown.onTiltDown != null && settings.tiltDown.interaction == null){
                settings.tiltDown.onTiltDown.call(this);

                if (settings.tiltDown.audioFeedback != null) {
                    play_sound(settings.tiltDown.audioFeedback);
                }

                if (settings.tiltDown.vibrationFeedback != null) {
                    vibrate_it(settings.tiltDown.vibrationFeedback);
                }

                if (settings.tiltDown.visualFeedback != null) {
                    show_visualFeedback(settings.tiltDown.visualFeedback, "down");
                }
            }
            if(settings.onTiltDown != null){
                settings.onTiltDown.call( this );
            }
        }
    }

    /*function tiltDOWN_middle(){
        if(interaction_enabled_down_middle == true) {
            if (settings.tiltDown_middle != null && settings.tiltDown_middle.onTiltDown != null && settings.tiltDown_middle.interaction != null) {
                settings.tiltDown_middle.onTiltDown.call( this );

                if(settings.tiltDown_middle.audioFeedback != null){
                    play_sound(settings.tiltDown_middle.audioFeedback);
                }

                if(settings.tiltDown_middle.vibrationFeedback != null){
                    vibrate_it(settings.tiltDown_middle.vibrationFeedback);
                }

                if(settings.tiltDown_middle.visualFeedback != null){
                    show_visualFeedback(settings.tiltDown_middle.visualFeedback, "down_middle");
                }
            }
        }
        else{
            if(settings.tiltDown_middle != null && settings.tiltDown_middle.onTiltDown != null && settings.tiltDown_middle.interaction == null){
                settings.tiltDown_middle.onTiltDown.call(this);

                if (settings.tiltDown_middle.audioFeedback != null) {
                    play_sound(settings.tiltDown_middle.audioFeedback);
                }

                if (settings.tiltDown_middle.vibrationFeedback != null) {
                    vibrate_it(settings.tiltDown_middle.vibrationFeedback);
                }

                if (settings.tiltDown_middle.visualFeedback != null) {
                    show_visualFeedback(settings.tiltDown_middle.visualFeedback, "down_middle");
                }
            }
            if(settings.onTiltDown_middle != null){
                settings.onTiltDown_middle.call( this );
            }
        }
    }
    function tiltDOWN_hard(){
        if(interaction_enabled_down_hard == true) {
            if (settings.tiltDown_hard != null && settings.tiltDown_hard.onTiltDown != null && settings.tiltDown_hard.interaction != null) {
                settings.tiltDown_hard.onTiltDown.call( this );

                if(settings.tiltDown_hard.audioFeedback != null){
                    play_sound(settings.tiltDown_hard.audioFeedback);
                }

                if(settings.tiltDown_hard.vibrationFeedback != null){
                    vibrate_it(settings.tiltDown_hard.vibrationFeedback);
                }

                if(settings.tiltDown_hard.visualFeedback != null){
                    show_visualFeedback(settings.tiltDown_hard.visualFeedback, "down_hard");
                }
            }
        }
        else{
            if(settings.tiltDown_hard != null && settings.tiltDown_hard.onTiltDown != null && settings.tiltDown_hard.interaction == null){
                settings.tiltDown_hard.onTiltDown.call(this);

                if (settings.tiltDown_hard.audioFeedback != null) {
                    play_sound(settings.tiltDown_hard.audioFeedback);
                }

                if (settings.tiltDown_hard.vibrationFeedback != null) {
                    vibrate_it(settings.tiltDown_hard.vibrationFeedback);
                }

                if (settings.tiltDown_hard.visualFeedback != null) {
                    show_visualFeedback(settings.tiltDown_hard.visualFeedback, "down_hard");
                }
            }
            if(settings.onTiltDown_hard != null){
                settings.onTiltDown_hard.call( this );
            }
        }
    }
*/
    function tiltRIGHT(){
        if(interaction_enabled_right == true) {
            if (settings.tiltRight != null && settings.tiltRight.onTiltRight != null && settings.tiltRight.interaction != null) {
                settings.tiltRight.onTiltRight.call( this );

                if(settings.tiltRight.audioFeedback != null){
                    play_sound(settings.tiltRight.audioFeedback);
                }

                if(settings.tiltRight.vibrationFeedback != null){
                    vibrate_it(settings.tiltRight.vibrationFeedback);
                }

                if(settings.tiltRight.visualFeedback != null){
                    show_visualFeedback(settings.tiltRight.visualFeedback, "right");
                }
            }
        }
        else{
            if(settings.tiltRight != null && settings.tiltRight.onTiltRight != null && settings.tiltRight.interaction == null){
                settings.tiltRight.onTiltRight.call(this);

                if (settings.tiltRight.audioFeedback != null) {
                    play_sound(settings.tiltRight.audioFeedback);
                }

                if (settings.tiltRight.vibrationFeedback != null) {
                    vibrate_it(settings.tiltRight.vibrationFeedback);
                }

                if (settings.tiltRight.visualFeedback != null) {
                    show_visualFeedback(settings.tiltRight.visualFeedback, "right");
                }
            }
            if(settings.onTiltRight != null){
                settings.onTiltRight.call( this );
            }
        }
    }

    /*function tiltRIGHT_middle(){
        if(interaction_enabled_right_middle == true) {
            if (settings.tiltRight_middle != null && settings.tiltRight_middle.onTiltRight != null && settings.tiltRight_middle.interaction != null) {
                settings.tiltRight_middle.onTiltRight.call( this );

                if(settings.tiltRight_middle.audioFeedback != null){
                    play_sound(settings.tiltRight_middle.audioFeedback);
                }

                if(settings.tiltRight_middle.vibrationFeedback != null){
                    vibrate_it(settings.tiltRight_middle.vibrationFeedback);
                }

                if(settings.tiltRight_middle.visualFeedback != null){
                    show_visualFeedback(settings.tiltRight_middle.visualFeedback, "right_middle");
                }
            }
        }
        else{
            if(settings.tiltRight_middle != null && settings.tiltRight_middle.onTiltRight != null && settings.tiltRight_middle.interaction == null){
                settings.tiltRight_middle.onTiltRight.call(this);

                if (settings.tiltRight_middle.audioFeedback != null) {
                    play_sound(settings.tiltRight_middle.audioFeedback);
                }

                if (settings.tiltRight_middle.vibrationFeedback != null) {
                    vibrate_it(settings.tiltRight_middle.vibrationFeedback);
                }

                if (settings.tiltRight_middle.visualFeedback != null) {
                    show_visualFeedback(settings.tiltRight_middle.visualFeedback, "right_middle");
                }
            }
            if(settings.onTiltRight_middle != null){
                settings.onTiltRight_middle.call( this );
            }
        }
    }
    function tiltRIGHT_hard(){
        if(interaction_enabled_right_hard == true) {
            if (settings.tiltRight_hard != null && settings.tiltRight_hard.onTiltRight != null && settings.tiltRight_hard.interaction != null) {
                settings.tiltRight_hard.onTiltRight.call( this );

                if(settings.tiltRight_hard.audioFeedback != null){
                    play_sound(settings.tiltRight_hard.audioFeedback);
                }

                if(settings.tiltRight_hard.vibrationFeedback != null){
                    vibrate_it(settings.tiltRight_hard.vibrationFeedback);
                }

                if(settings.tiltRight_hard.visualFeedback != null){
                    show_visualFeedback(settings.tiltRight_hard.visualFeedback, "right_hard");
                }
            }
        }
        else{
            if(settings.tiltRight_hard != null && settings.tiltRight_hard.onTiltRight != null && settings.tiltRight_hard.interaction == null){
                settings.tiltRight_hard.onTiltRight.call(this);

                if (settings.tiltRight_hard.audioFeedback != null) {
                    play_sound(settings.tiltRight_hard.audioFeedback);
                }

                if (settings.tiltRight_hard.vibrationFeedback != null) {
                    vibrate_it(settings.tiltRight_hard.vibrationFeedback);
                }

                if (settings.tiltRight_hard.visualFeedback != null) {
                    show_visualFeedback(settings.tiltRight_hard.visualFeedback, "right_hard");
                }
            }
            if(settings.onTiltRight_hard != null){
                settings.onTiltRight_hard.call( this );
            }
        }
    }
*/
    function tiltLEFT(){
        if(interaction_enabled_left == true) {
            if (settings.tiltLeft != null && settings.tiltLeft.onTiltLeft != null && settings.tiltLeft.interaction != null) {
                settings.tiltLeft.onTiltLeft.call( this );

                if(settings.tiltLeft.audioFeedback != null){
                    play_sound(settings.tiltLeft.audioFeedback);
                }

                if(settings.tiltLeft.vibrationFeedback != null){
                    vibrate_it(settings.tiltLeft.vibrationFeedback);
                }

                if(settings.tiltLeft.visualFeedback != null){
                    show_visualFeedback(settings.tiltLeft.visualFeedback, "left");
                }
            }
        }
        else{
            if(settings.tiltLeft != null && settings.tiltLeft.onTiltLeft != null && settings.tiltLeft.interaction == null){
                settings.tiltLeft.onTiltLeft.call(this);

                if (settings.tiltLeft.audioFeedback != null) {
                    play_sound(settings.tiltLeft.audioFeedback);
                }

                if (settings.tiltLeft.vibrationFeedback != null) {
                    vibrate_it(settings.tiltLeft.vibrationFeedback);
                }

                if (settings.tiltLeft.visualFeedback != null) {
                    show_visualFeedback(settings.tiltLeft.visualFeedback, "left");
                }
            }
            if(settings.onTiltLeft != null){
                settings.onTiltLeft.call( this );
            }
        }
    }

    /*function tiltLEFT_middle(){
        if(interaction_enabled_left_middle == true) {
            if (settings.tiltLeft_middle != null && settings.tiltLeft_middle.onTiltLeft != null && settings.tiltLeft_middle.interaction != null) {
                settings.tiltLeft_middle.onTiltLeft.call( this );

                if(settings.tiltLeft_middle.audioFeedback != null){
                    play_sound(settings.tiltLeft_middle.audioFeedback);
                }

                if(settings.tiltLeft_middle.vibrationFeedback != null){
                    vibrate_it(settings.tiltLeft_middle.vibrationFeedback);
                }

                if(settings.tiltLeft_middle.visualFeedback != null){
                    show_visualFeedback(settings.tiltLeft_middle.visualFeedback, "left_middle");
                }
            }
        }
        else{
            if(settings.tiltLeft_middle != null && settings.tiltLeft_middle.onTiltLeft != null && settings.tiltLeft_middle.interaction == null){
                settings.tiltLeft_middle.onTiltLeft.call(this);

                if (settings.tiltLeft_middle.audioFeedback != null) {
                    play_sound(settings.tiltLeft_middle.audioFeedback);
                }

                if (settings.tiltLeft_middle.vibrationFeedback != null) {
                    vibrate_it(settings.tiltLeft_middle.vibrationFeedback);
                }

                if (settings.tiltLeft_middle.visualFeedback != null) {
                    show_visualFeedback(settings.tiltLeft_middle.visualFeedback, "left_middle");
                }
            }
            if(settings.onTiltLeft_middle != null){
                settings.onTiltLeft_middle.call( this );
            }
        }
    }
    function tiltLEFT_hard(){
        if(interaction_enabled_left_hard == true) {
            if (settings.tiltLeft_hard != null && settings.tiltLeft_hard.onTiltLeft != null && settings.tiltLeft_hard.interaction != null) {
                settings.tiltLeft_hard.onTiltLeft.call( this );

                if(settings.tiltLeft_hard.audioFeedback != null){
                    play_sound(settings.tiltLeft_hard.audioFeedback);
                }

                if(settings.tiltLeft_hard.vibrationFeedback != null){
                    vibrate_it(settings.tiltLeft_hard.vibrationFeedback);
                }

                if(settings.tiltLeft_hard.visualFeedback != null){
                    show_visualFeedback(settings.tiltLeft_hard.visualFeedback, "left_hard");
                }
            }
        }
        else{
            if(settings.tiltLeft_hard != null && settings.tiltLeft_hard.onTiltLeft != null && settings.tiltLeft_hard.interaction == null){
                settings.tiltLeft_hard.onTiltLeft.call(this);

                if (settings.tiltLeft_hard.audioFeedback != null) {
                    play_sound(settings.tiltLeft_hard.audioFeedback);
                }

                if (settings.tiltLeft_hard.vibrationFeedback != null) {
                    vibrate_it(settings.tiltLeft_hard.vibrationFeedback);
                }

                if (settings.tiltLeft_hard.visualFeedback != null) {
                    show_visualFeedback(settings.tiltLeft_hard.visualFeedback, "left_hard");
                }
            }
            if(settings.onTiltLeft_hard != null){
                settings.onTiltLeft_hard.call( this );
            }
        }
    }
*/
    function tiltCLOCK(){
        if(interaction_enabled_clock == true) {
            if (settings.tiltClock != null && settings.tiltClock.onTiltClock != null && settings.tiltClock.interaction != null) {
                settings.tiltClock.onTiltClock.call( this );

                if(settings.tiltClock.audioFeedback != null){
                    play_sound(settings.tiltClock.audioFeedback);
                }

                if(settings.tiltClock.vibrationFeedback != null){
                    vibrate_it(settings.tiltClock.vibrationFeedback);
                }

                if(settings.tiltClock.visualFeedback != null){
                    show_visualFeedback(settings.tiltClock.visualFeedback, "clock");
                }
            }
        }
        else{
            if(settings.tiltClock != null && settings.tiltClock.onTiltClock != null && settings.tiltClock.interaction == null){
                settings.tiltClock.onTiltClock.call(this);

                if (settings.tiltClock.audioFeedback != null) {
                    play_sound(settings.tiltClock.audioFeedback);
                }

                if (settings.tiltClock.vibrationFeedback != null) {
                    vibrate_it(settings.tiltClock.vibrationFeedback);
                }

                if (settings.tiltClock.visualFeedback != null) {
                    show_visualFeedback(settings.tiltClock.visualFeedback, "clock");
                }
            }
            if(settings.onTiltClock != null){
                settings.onTiltClock.call( this );
            }
        }
    }

    /*function tiltCLOCK_middle(){
        if(interaction_enabled_clock_middle == true) {
            if (settings.tiltClock_middle != null && settings.tiltClock_middle.onTiltClock != null && settings.tiltClock_middle.interaction != null) {
                settings.tiltClock_middle.onTiltClock.call( this );

                if(settings.tiltClock_middle.audioFeedback != null){
                    play_sound(settings.tiltClock_middle.audioFeedback);
                }

                if(settings.tiltClock_middle.vibrationFeedback != null){
                    vibrate_it(settings.tiltClock_middle.vibrationFeedback);
                }

                if(settings.tiltClock_middle.visualFeedback != null){
                    show_visualFeedback(settings.tiltClock_middle.visualFeedback, "clock_middle");
                }
            }
        }
        else{
            if(settings.tiltClock_middle != null && settings.tiltClock_middle.onTiltClock != null && settings.tiltClock_middle.interaction == null){
                settings.tiltClock_middle.onTiltClock.call(this);

                if (settings.tiltClock_middle.audioFeedback != null) {
                    play_sound(settings.tiltClock_middle.audioFeedback);
                }

                if (settings.tiltClock_middle.vibrationFeedback != null) {
                    vibrate_it(settings.tiltClock_middle.vibrationFeedback);
                }

                if (settings.tiltClock_middle.visualFeedback != null) {
                    show_visualFeedback(settings.tiltClock_middle.visualFeedback, "clock_middle");
                }
            }
            if(settings.onTiltClock_middle != null){
                settings.onTiltClock_middle.call( this );
            }
        }
    }
    function tiltCLOCK_hard(){
        if(interaction_enabled_clock_hard == true) {
            if (settings.tiltClock_hard != null && settings.tiltClock_hard.onTiltClock != null && settings.tiltClock_hard.interaction != null) {
                settings.tiltClock_hard.onTiltClock.call( this );

                if(settings.tiltClock_hard.audioFeedback != null){
                    play_sound(settings.tiltClock_hard.audioFeedback);
                }

                if(settings.tiltClock_hard.vibrationFeedback != null){
                    vibrate_it(settings.tiltClock_hard.vibrationFeedback);
                }

                if(settings.tiltClock_hard.visualFeedback != null){
                    show_visualFeedback(settings.tiltClock_hard.visualFeedback, "clock_hard");
                }
            }
        }
        else{
            if(settings.tiltClock_hard != null && settings.tiltClock_hard.onTiltClock != null && settings.tiltClock_hard.interaction == null){
                settings.tiltClock_hard.onTiltClock.call(this);

                if (settings.tiltClock_hard.audioFeedback != null) {
                    play_sound(settings.tiltClock_hard.audioFeedback);
                }

                if (settings.tiltClock_hard.vibrationFeedback != null) {
                    vibrate_it(settings.tiltClock_hard.vibrationFeedback);
                }

                if (settings.tiltClock_hard.visualFeedback != null) {
                    show_visualFeedback(settings.tiltClock_hard.visualFeedback, "clock_hard");
                }
            }
            if(settings.onTiltClock_hard != null){
                settings.onTiltClock_hard.call( this );
            }
        }
    }
*/
    function tiltCOUNTERCLOCK(){
        if(interaction_enabled_counterclock == true) {
            if (settings.tiltCounterClock != null && settings.tiltCounterClock.onTiltCounterClock != null && settings.tiltCounterClock.interaction != null) {
                settings.tiltCounterClock.onTiltCounterClock.call( this );

                if(settings.tiltCounterClock.audioFeedback != null){
                    play_sound(settings.tiltCounterClock.audioFeedback);
                }

                if(settings.tiltCounterClock.vibrationFeedback != null){
                    vibrate_it(settings.tiltCounterClock.vibrationFeedback);
                }

                if(settings.tiltCounterClock.visualFeedback != null){
                    show_visualFeedback(settings.tiltCounterClock.visualFeedback, "counterclock");
                }
            }
        }
        else{
            if(settings.tiltCounterClock != null && settings.tiltCounterClock.onTiltCounterClock != null && settings.tiltCounterClock.interaction == null){
                settings.tiltCounterClock.onTiltCounterClock.call(this);

                if (settings.tiltCounterClock.audioFeedback != null) {
                    play_sound(settings.tiltCounterClock.audioFeedback);
                }

                if (settings.tiltCounterClock.vibrationFeedback != null) {
                    vibrate_it(settings.tiltCounterClock.vibrationFeedback);
                }

                if (settings.tiltCounterClock.visualFeedback != null) {
                    show_visualFeedback(settings.tiltCounterClock.visualFeedback, "counterclock");
                }
            }
            if(settings.onTiltCounterClock != null){
                settings.onTiltCounterClock.call( this );
            }
        }
    }

    /*function tiltCOUNTERCLOCK_middle(){
        if(interaction_enabled_counterclock_middle == true) {
            if (settings.tiltCounterClock_middle != null && settings.tiltCounterClock_middle.onTiltCounterClock != null && settings.tiltCounterClock_middle.interaction != null) {
                settings.tiltCounterClock_middle.onTiltCounterClock.call( this );

                if(settings.tiltCounterClock_middle.audioFeedback != null){
                    play_sound(settings.tiltCounterClock_middle.audioFeedback);
                }

                if(settings.tiltCounterClock_middle.vibrationFeedback != null){
                    vibrate_it(settings.tiltCounterClock_middle.vibrationFeedback);
                }

                if(settings.tiltCounterClock_middle.visualFeedback != null){
                    show_visualFeedback(settings.tiltCounterClock_middle.visualFeedback, "counterclock_middle");
                }
            }
        }
        else{
            if(settings.tiltCounterClock_middle != null && settings.tiltCounterClock_middle.onTiltCounterClock != null && settings.tiltCounterClock_middle.interaction == null){
                settings.tiltCounterClock_middle.onTiltCounterClock.call(this);

                if (settings.tiltCounterClock_middle.audioFeedback != null) {
                    play_sound(settings.tiltCounterClock_middle.audioFeedback);
                }

                if (settings.tiltCounterClock_middle.vibrationFeedback != null) {
                    vibrate_it(settings.tiltCounterClock_middle.vibrationFeedback);
                }

                if (settings.tiltCounterClock_middle.visualFeedback != null) {
                    show_visualFeedback(settings.tiltCounterClock_middle.visualFeedback, "counterclock_middle");
                }
            }
            if(settings.onTiltCounterClock_middle != null){
                settings.onTiltCounterClock_middle.call( this );
            }
        }
    }
    function tiltCOUNTERCLOCK_hard(){
        if(interaction_enabled_counterclock_hard == true) {
            if (settings.tiltCounterClock_hard != null && settings.tiltCounterClock_hard.onTiltCounterClock != null && settings.tiltCounterClock_hard.interaction != null) {
                settings.tiltCounterClock_hard.onTiltCounterClock.call( this );

                if(settings.tiltCounterClock_hard.audioFeedback != null){
                    play_sound(settings.tiltCounterClock_hard.audioFeedback);
                }

                if(settings.tiltCounterClock_hard.vibrationFeedback != null){
                    vibrate_it(settings.tiltCounterClock_hard.vibrationFeedback);
                }

                if(settings.tiltCounterClock_hard.visualFeedback != null){
                    show_visualFeedback(settings.tiltCounterClock_hard.visualFeedback, "counterclock_hard");
                }
            }
        }
        else{
            if(settings.tiltCounterClock_hard != null && settings.tiltCounterClock_hard.onTiltCounterClock != null && settings.tiltCounterClock_hard.interaction == null){
                settings.tiltCounterClock_hard.onTiltCounterClock.call(this);

                if (settings.tiltCounterClock_hard.audioFeedback != null) {
                    play_sound(settings.tiltCounterClock_hard.audioFeedback);
                }

                if (settings.tiltCounterClock_hard.vibrationFeedback != null) {
                    vibrate_it(settings.tiltCounterClock_hard.vibrationFeedback);
                }

                if (settings.tiltCounterClock_hard.visualFeedback != null) {
                    show_visualFeedback(settings.tiltCounterClock_hard.visualFeedback, "counterclock_hard");
                }
            }
            if(settings.onTiltCounterClock_hard != null){
                settings.onTiltCounterClock_hard.call( this );
            }
        }
    }
*/


    function checkOrientationMode (){
        if((window.orientation) == 90 ){
            // Landscape primary
            map_event["port-left_hard"]="tiltUP_hard";
            map_event["port-left_middle"]="tiltUP_middle";
            map_event["port-left"]="tiltUP";
            map_event["port-right_hard"]="tiltDOWN_hard";
            map_event["port-right_middle"]="tiltDOWN_middle";
            map_event["port-right"]="tiltDOWN";
            map_event["port-down_hard"]="tiltLEFT_hard";
            map_event["port-down_middle"]="tiltLEFT_middle";
            map_event["port-down"]="tiltLEFT";
            map_event["port-up_hard"]="tiltRIGHT_hard";
            map_event["port-up_middle"]="tiltRIGHT_middle";
            map_event["port-up"]="tiltRIGHT";
            map_event["port-clock_hard"]="tiltCLOCK_hard";
            map_event["port-clock_middle"]="tiltCLOCK_middle";
            map_event["port-clock"]="tiltCLOCK";
            map_event["port-counterclock_hard"]="tiltCOUNTERCLOCK_hard";
            map_event["port-counterclock_middle"]="tiltCOUNTERCLOCK_middle";
            map_event["port-counterclock"]="tiltCOUNTERCLOCK";
        }
        else if((window.orientation) == -90 || (window.orientation) == 270){
            // Landscape secondary
            map_event["port-left_hard"]="tiltDOWN_hard";
            map_event["port-left_middle"]="tiltDOWN_middle";
            map_event["port-left"]="tiltDOWN";
            map_event["port-right_hard"]="tiltUP_hard";
            map_event["port-right_middle"]="tiltUP_middle";
            map_event["port-right"]="tiltUP";
            map_event["port-down_hard"]="tiltRIGHT_hard";
            map_event["port-down_middle"]="tiltRIGHT_middle";
            map_event["port-down"]="tiltRIGHT";
            map_event["port-up_hard"]="tiltLEFT_hard";
            map_event["port-up_middle"]="tiltLEFT_middle";
            map_event["port-up"]="tiltLEFT";
            map_event["port-clock_hard"]="tiltCLOCK_hard";
            map_event["port-clock_middle"]="tiltCLOCK_middle";
            map_event["port-clock"]="tiltCLOCK";
            map_event["port-counterclock_hard"]="tiltCOUNTERCLOCK_hard";
            map_event["port-counterclock_middle"]="tiltCOUNTERCLOCK_middle";
            map_event["port-counterclock"]="tiltCOUNTERCLOCK";
        }
        else if(Math.abs(window.orientation) == 180 ){
            // Primary secondary
            map_event["port-left_hard"]="tiltRIGHT_hard";
            map_event["port-left_middle"]="tiltRIGHT_middle";
            map_event["port-left"]="tiltRIGHT";
            map_event["port-right_hard"]="tiltLEFT_hard";
            map_event["port-right_middle"]="tiltLEFT_middle";
            map_event["port-right"]="tiltLEFT";
            map_event["port-down_hard"]="tiltUP_hard";
            map_event["port-down_middle"]="tiltUP_middle";
            map_event["port-down"]="tiltUP";
            map_event["port-up_hard"]="tiltDOWN_hard";
            map_event["port-up_middle"]="tiltDOWN_middle";
            map_event["port-up"]="tiltDOWN";
            map_event["port-clock_hard"]="tiltCLOCK_hard";
            map_event["port-clock_middle"]="tiltCLOCK_middle";
            map_event["port-clock"]="tiltCLOCK";
            map_event["port-counterclock_hard"]="tiltCOUNTERCLOCK_hard";
            map_event["port-counterclock_middle"]="tiltCOUNTERCLOCK_middle";
            map_event["port-counterclock"]="tiltCOUNTERCLOCK";
        }
        else{
            // Portrait
            map_event["port-left_hard"]="tiltLEFT_hard";
            map_event["port-left_middle"]="tiltLEFT_middle";
            map_event["port-left"]="tiltLEFT";
            map_event["port-right_hard"]="tiltRIGHT_hard";
            map_event["port-right_middle"]="tiltRIGHT_middle";
            map_event["port-right"]="tiltRIGHT";
            map_event["port-down_hard"]="tiltDOWN_hard";
            map_event["port-down_middle"]="tiltDOWN_middle";
            map_event["port-down"]="tiltDOWN";
            map_event["port-up_hard"]="tiltUP_hard";
            map_event["port-up_middle"]="tiltUP_middle";
            map_event["port-up"]="tiltUP";
            map_event["port-clock_hard"]="tiltCLOCK_hard";
            map_event["port-clock_middle"]="tiltCLOCK_middle";
            map_event["port-clock"]="tiltCLOCK";
            map_event["port-counterclock_hard"]="tiltCOUNTERCLOCK_hard";
            map_event["port-counterclock_middle"]="tiltCOUNTERCLOCK_middle";
            map_event["port-counterclock"]="tiltCOUNTERCLOCK";
        }
    }

    /**
     FUNCTION THAT MAKES THE ARRAY EMPTY (buffer_events)
     **/
    function empty_array (buffer_to_empty) {
        while(buffer_to_empty.length > 0) {buffer_to_empty.pop();}
    }

}(jQuery));

