export enum ITEMS_EDITABLES {
    ITEM_PROJECT,
    ITEM_POU,
    ITEM_VARIABLE,
    ITEM_TRANSITION,
    ITEM_ACTION,
    ITEM_CONFIGURATION,
    ITEM_RESOURCE,
    ITEM_DATATYPE
}

export enum ITEMS_UNEDITABLE {
    ITEM_DATATYPES,
    ITEM_FUNCTION,
    ITEM_FUNCTIONBLOCK,
    ITEM_PROGRAM,
    ITEM_TRANSITIONS,
    ITEM_ACTIONS,
    ITEM_CONFIGURATIONS,
    ITEM_RESOURCES,
    ITEM_PROPERTIES
}

export enum ITEMS_VARIABLE {
    ITEM_VAR_LOCAL = 17,
    ITEM_VAR_GLOBAL,
    ITEM_VAR_EXTERNAL,
    ITEM_VAR_TEMP,
    ITEM_VAR_INPUT,
    ITEM_VAR_OUTPUT,
    ITEM_VAR_INOUT,
    ITEM_CONFNODE = 25
}

export enum LOCATIONS_ITEMS {
    LOCATION_CONFNODE,
    LOCATION_MODULE,
    LOCATION_GROUP,
    LOCATION_VAR_INPUT,
    LOCATION_VAR_OUTPUT,
    LOCATION_VAR_MEMORY
}

// Uneditable names
export enum UNEDITABLE_NAMES {
    USER_DEFINED_POUS = "User-defined POUs", 
    FUNCTIONS = "Functions", 
    FUNCTION_BLOCKS = "Function Blocks",
    PROGRAMS = "Programs",
    DATA_TYPES = "Data Types",
    TRANSITIONS = "Transitions", 
    ACTIONS = "Actions", 
    CONFIGURATIONS = "Configurations", 
    RESOURCES = "Resources", 
    PROPERTIES = "Properties"
}

// Variable class info mapping
// as const so we keep the tuple type
export const VAR_CLASS_INFOS = {
    "Local": ["localVars", ITEMS_VARIABLE.ITEM_VAR_LOCAL],
    "Global": ["globalVars", ITEMS_VARIABLE.ITEM_VAR_GLOBAL],
    "External": ["externalVars", ITEMS_VARIABLE.ITEM_VAR_EXTERNAL],
    "Temp": ["tempVars", ITEMS_VARIABLE.ITEM_VAR_TEMP],
    "Input": ["inputVars", ITEMS_VARIABLE.ITEM_VAR_INPUT],
    "Output": ["outputVars", ITEMS_VARIABLE.ITEM_VAR_OUTPUT],
    "InOut": ["inOutVars", ITEMS_VARIABLE.ITEM_VAR_INOUT]
} as const

// POU types mapping
export const POU_TYPES = {
    "program": ITEMS_UNEDITABLE.ITEM_PROGRAM,
    "functionBlock": ITEMS_UNEDITABLE.ITEM_FUNCTIONBLOCK,
    "function": ITEMS_UNEDITABLE.ITEM_FUNCTION
};

// Class types mapping
export const CLASS_TYPES = {
    "configuration": ITEMS_EDITABLES.ITEM_CONFIGURATION,
    "resource": ITEMS_EDITABLES.ITEM_RESOURCE,
    "action": ITEMS_EDITABLES.ITEM_ACTION,
    "transition": ITEMS_EDITABLES.ITEM_TRANSITION,
    "program": ITEMS_UNEDITABLE.ITEM_PROGRAM
};