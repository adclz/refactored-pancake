import StdBlocks from "../std/std_function_blocks.xml";
import StdAdditional from "../std/std_additional_function_blocks.xml";
import Stdcsv from "../std/iec_std.csv";

export const StdTC6Libs = [
    ["Standard function blocks", StdBlocks],
    ["Additional function blocks", StdAdditional]
] as const

export const StdFuncsCSV = Stdcsv

export const LANGUAGES = ["IL", "ST", "FBD", "LD", "SFC"] as const

export const LOCATIONDATATYPES = {
    "X": ["BOOL"],
    "B": ["SINT", "USINT", "BYTE", "STRING"],
    "W": ["INT", "UINT", "WORD", "WSTRING"],
    "D": ["DINT", "UDINT", "REAL", "DWORD"],
    "L": ["LINT", "ULINT", "LREAL", "LWORD"]
} as const

export const TypeHierarchy_list = [
    ["ANY", null],
    ["ANY_DERIVED", "ANY"],
    ["ANY_ELEMENTARY", "ANY"],
    ["ANY_MAGNITUDE", "ANY_ELEMENTARY"],
    ["ANY_BIT", "ANY_ELEMENTARY"],
    ["ANY_NBIT", "ANY_BIT"],
    ["ANY_STRING", "ANY_ELEMENTARY"],
    ["ANY_DATE", "ANY_ELEMENTARY"],
    ["ANY_NUM", "ANY_MAGNITUDE"],
    ["ANY_REAL", "ANY_NUM"],
    ["ANY_INT", "ANY_NUM"],
    ["ANY_SINT", "ANY_INT"],
    ["ANY_UINT", "ANY_INT"],
    ["BOOL", "ANY_BIT"],
    ["SINT", "ANY_SINT"],
    ["INT", "ANY_SINT"],
    ["DINT", "ANY_SINT"],
    ["LINT", "ANY_SINT"],
    ["USINT", "ANY_UINT"],
    ["UINT", "ANY_UINT"],
    ["UDINT", "ANY_UINT"],
    ["ULINT", "ANY_UINT"],
    ["REAL", "ANY_REAL"],
    ["LREAL", "ANY_REAL"],
    ["TIME", "ANY_MAGNITUDE"],
    ["DATE", "ANY_DATE"],
    ["TOD", "ANY_DATE"],
    ["DT", "ANY_DATE"],
    ["STRING", "ANY_STRING"],
    ["BYTE", "ANY_NBIT"],
    ["WORD", "ANY_NBIT"],
    ["DWORD", "ANY_NBIT"],
    ["LWORD", "ANY_NBIT"]
    // ["WSTRING", "ANY_STRING"] TODO
] as const

export const DefaultType = "DINT"

export const DataTypeRange_list = [
    ["SINT",  [-(2**7),  2**7 - 1]],
    ["INT",   [-(2**15), 2**15 - 1]],
    ["DINT",  [-(2**31), 2**31 - 1]],
    ["LINT",  [-(2**63), 2**63 - 1]],
    ["USINT", [0,      2**8 - 1]],
    ["UINT",  [0,      2**16 - 1]],
    ["UDINT", [0,      2**32 - 1]],
    ["ULINT", [0,      2**64 - 1]]
] as const

export const ANY_TO_ANY_FILTERS = {
    "ANY_TO_ANY": [
        //# simple type conv are let as C cast
        [["ANY_INT", "ANY_BIT"], ["ANY_NUM", "ANY_BIT"]],
        [["ANY_REAL",], ["ANY_REAL",]],
        //# REAL_TO_INT
        [["ANY_REAL",], ["ANY_SINT",]],
        [["ANY_REAL",], ["ANY_UINT",]],
        [["ANY_REAL",], ["ANY_BIT",]],
        //# TO_TIME
        [["ANY_INT", "ANY_BIT"], ["ANY_DATE", "TIME"]],
        [["ANY_REAL",],          ["ANY_DATE", "TIME"]],
        [["ANY_STRING",],        ["ANY_DATE", "TIME"]],
        //# FROM_TIME
        [["ANY_DATE", "TIME"], ["ANY_REAL",]],
        [["ANY_DATE", "TIME"], ["ANY_INT", "ANY_NBIT"]],
        [["TIME",], ["ANY_STRING",]],
        [["DATE",], ["ANY_STRING",]],
        [["TOD",],  ["ANY_STRING",]],
        [["DT",],   ["ANY_STRING",]],
        //# TO_STRING
        [["BOOL",],     ["ANY_STRING",]],
        [["ANY_BIT",],  ["ANY_STRING",]],
        [["ANY_REAL",], ["ANY_STRING",]],
        [["ANY_SINT",], ["ANY_STRING",]],
        [["ANY_UINT",], ["ANY_STRING",]],
        //# FROM_STRING
        [["ANY_STRING",], ["BOOL",]],
        [["ANY_STRING",], ["ANY_BIT",]],
        [["ANY_STRING",], ["ANY_SINT",]],
        [["ANY_STRING",], ["ANY_UINT",]],
        [["ANY_STRING",], ["ANY_REAL",]]
    ],
    "BCD_TO_ANY": [
        [["BYTE",],  ["USINT",]],
        [["WORD",],  ["UINT",]],
        [["DWORD",], ["UDINT",]],
        [["LWORD",], ["ULINT",]]
    ],
    "ANY_TO_BCD": [
        [["USINT",], ["BYTE",]],
        [["UINT",],  ["WORD",]],
        [["UDINT",], ["DWORD",]],
        [["ULINT",], ["LWORD",]]
    ]
} as const