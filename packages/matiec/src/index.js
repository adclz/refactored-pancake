import iec2c from "./matiec/iec2c.js"

import bistable from "./matiec/lib/bistable.txt"
import counter from "./matiec/lib/counter.txt"
import derivative_st from "./matiec/lib/derivative_st.txt"
import edge_detection from "./matiec/lib/edge_detection.txt"
import hysteresis_st from "./matiec/lib/hysteresis_st.txt"
import ieclib from "./matiec/lib/ieclib.txt"
import integral_st from "./matiec/lib/integral_st.txt"
import pid_st from "./matiec/lib/pid_st.txt"
import ramp_st from "./matiec/lib/ramp_st.txt"
import rtc from "./matiec/lib/rtc.txt"
import sema from "./matiec/lib/sema.txt"
import standard_FB from "./matiec/lib/standard_FB.txt"
import standard_functions from "./matiec/lib/standard_functions.txt"
import timer from "./matiec/lib/timer.txt"

const libs = { 
    bistable,
    counter,
    derivative_st,
    edge_detection,
    hysteresis_st,
    ieclib,
    integral_st,
    pid_st,
    ramp_st,
    rtc,
    sema,
    standard_FB,
    standard_functions,
    timer
}

export {iec2c, libs}