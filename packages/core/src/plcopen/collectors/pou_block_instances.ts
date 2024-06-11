import saxon from 'saxon-js';
import xslt from "@/src/plcopen/xslt/pou_block_instances.xslt"
import { asBool, getAsBool, getAsInt, getTextOrValue } from "@/src/plcopen/saxon/saxon-utils.js";

interface Point {
    x: number;
    y: number;
}

export interface BlockInstanceInfos {
    type: string;
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    specificValues: SpecificValues;
    inputs: InstanceConnectionInfos[];
    outputs: InstanceConnectionInfos[];
}

interface BlockSpecificValues {
    name: string;
    executionOrderId: number;
}

interface VariableSpecificValues {
    name: string;
    value_type: string;
    executionOrderId: number;
}

interface ConnectionSpecificValues {
    name: string;
}

interface PowerRailSpecificValues {
    connectors: number;
}

interface LDElementSpecificValues {
    name: string;
    negated: boolean;
    edge: string;
    storage: string;
    executionOrderId: number;
}

interface DivergenceSpecificValues {
    connectors: number;
}

type StepSpecificValues = {
    name: string;
    initial: boolean;
    action: ActionInfos | null;
}

type TransitionSpecificValues = {
    priority: number;
    condition_type: string;
    condition: string;
    connection: any;
}

type JumpSpecificValues = {
    target: string;
}

type ActionBlockSpecificValues = {
    actions: ActionInfos[]
}

interface CommentSpecificValues {
    content: string;
}

interface ActionInfos {
    qualifer: string,
    type: string,
    value: string,
    duration: number,
    indicator: number
}

type SpecificValues =
    BlockSpecificValues |
    VariableSpecificValues |
    ConnectionSpecificValues |
    PowerRailSpecificValues |
    LDElementSpecificValues |
    DivergenceSpecificValues |
    StepSpecificValues |
    TransitionSpecificValues |
    JumpSpecificValues |
    ActionBlockSpecificValues |
    CommentSpecificValues;

const SpecificValuesTuples: Record<string, Record<string, (value: any) => any>> = {
    comment: { content: (value: string) => value },
    input: { name: (value: string) => value, value_type: (value: string) => value, executionOrderId: parseInt },
    output: { name: (value: string) => value, value_type: (value: string) => value, executionOrderId: parseInt },
    inout: { name: (value: string) => value, value_type: (value: string) => value, executionOrderId: parseInt },
    connector: { name: (value: string) => value },
    continuation: { name: (value: string) => value },
    leftPowerRail: { connectors: parseInt },
    rightPowerRail: { connectors: parseInt },
    contact: { name: (value: string) => value, negated: asBool, edge: (value: string) => value, storage: (value: string) => value, executionOrderId: parseInt },
    coil: { name: (value: string) => value, negated: asBool, edge: (value: string) => value, storage: (value: string) => value, executionOrderId: parseInt },
    step: { name: (value: string) => value, initial: asBool, action: (value: string) => value },
    transition: { priority: parseInt, condition_type: (value: string) => value, condition: (value: string) => value, connection: (value: string) => value },
    selectionDivergence: { connectors: parseInt },
    selectionConvergence: { connectors: parseInt },
    simultaneousDivergence: { connectors: parseInt },
    simultaneousConvergence: { connectors: parseInt },
    jump: { target: (value: string) => value },
    actionBlock: { actions: () => [] },
};

interface InstanceConnectionInfos {
    name: string | null;
    negated: boolean;
    edge: boolean;
    position: Point;
    links: ConnectionLinkInfos[];
}

interface ConnectionLinkInfos {
    refLocalId: number;
    formalParameter: string | null;
    points: Point[];
}

declare module globalThis {
    function AddBlockInstance(_type: SaxonNode, _localId: SaxonNode, _x: SaxonNode, _y: SaxonNode, _width: SaxonNode, _height: SaxonNode): void
    function AddInstanceConnection(_type: SaxonNode, _formalParameter: SaxonNode, _negated: SaxonNode, _edge: SaxonNode, _x: SaxonNode, _y: SaxonNode): void
    function AddLinkPoint(_x: SaxonNode, _y: SaxonNode): void
    function AddConnectionLink(_id: SaxonNode, _formalParameter: SaxonNode): void
    function SetSpecificValues(...args: SaxonNode[]): void
    function AddAction(_qualifier: SaxonNode, _type: SaxonNode, _value: SaxonNode, _duration: SaxonNode, _indicator: SaxonNode): void
}

type RArray = (any | RArray)[]
export default class POUBlockInstanceCollector {
    private _blockInstances: BlockInstanceInfos[] = []
    private _currentInstance: BlockInstanceInfos | null = null
    private _currentConnection: InstanceConnectionInfos | null = null
    private _currentLink: ConnectionLinkInfos | null = null
    private _specificValues: RArray | null = []

    public collect = (xml: SaxonNode) => {
        globalThis.AddBlockInstance = (_type: SaxonNode, _localId: SaxonNode, _x: SaxonNode, _y: SaxonNode, _width: SaxonNode, _height: SaxonNode) => {
            const type = getTextOrValue(_type)!
            const id = getAsInt(_localId)!
            const x = getAsInt(_x)!
            const y = getAsInt(_y)!
            const width = getAsInt(_width)!
            const height = getAsInt(_height)!

            if (this._specificValues)
                if ((type === "step" && this._specificValues.length < 3) || (type === "transition" && this._specificValues.length < 4)) {
                    this._specificValues.push([null])
                }
                else if (type === "actionBlock" && this._specificValues.length < 1) {
                    this._specificValues.push([[]])
                }

            let specificValues: SpecificValues = {} as unknown as SpecificValues

            if (this._specificValues)
                Object.entries(SpecificValuesTuples[type] ?? { name: (value: string) => value, executionOrderId: parseInt })
                    .forEach((tuple, i) => {
                        const key = tuple[0]
                        const cb = tuple[1]

                        let value = this._specificValues![i]
                        //@ts-expect-error
                        specificValues[key] = cb(value)
                    })

            this._specificValues = null

            this._currentInstance = {
                type,
                id,
                x,
                y,
                width,
                height,
                inputs: [],
                outputs: [],
                specificValues,
            }
            this._blockInstances.push(this._currentInstance!)
        }

        globalThis.AddInstanceConnection = (_type: SaxonNode, _formalParameter: SaxonNode, _negated: SaxonNode, _edge: SaxonNode, _x: SaxonNode, _y: SaxonNode) => {
            const formalParameter = getTextOrValue(_formalParameter)
            const type = getTextOrValue(_type)
            const edge = getAsBool(_edge)
            const negated = getAsBool(_negated)
            const x = getAsInt(_x)!
            const y = getAsInt(_y)!

            this._currentConnection = {
                name: formalParameter ?? null,
                edge,
                negated,
                links: [],
                position: { x, y }
            }

            if (this._currentInstance) {
                if (type === "input") this._currentInstance.inputs.push(this._currentConnection)
                else this._currentInstance.outputs.push(this._currentConnection)
            }
            else if (this._specificValues)
                this._specificValues.push([this._currentConnection])
        }

        globalThis.AddLinkPoint = (_x: SaxonNode, _y: SaxonNode) => {
            const x = getAsInt(_x)!
            const y = getAsInt(_y)!
            this._currentLink!.points.push({ x, y })
        }

        globalThis.AddConnectionLink = (_id: SaxonNode, _formalParameter: SaxonNode) => {
            const id = getAsInt(_id)!
            const formalParameter = _formalParameter ? getTextOrValue(_formalParameter) : null

            this._currentLink = {
                refLocalId: id,
                formalParameter,
                points: []
            }
            this._currentConnection?.links.push(this._currentLink!)
        }

        globalThis.SetSpecificValues = (...args: SaxonNode[]) => {
            this._specificValues = Array.isArray(args) ? args.map(x => x ? getTextOrValue(x) : x) : [args]
            this._currentInstance = null
            this._currentConnection = null
            this._currentLink = null
        }

        globalThis.AddAction = (_qualifier: SaxonNode, _type: SaxonNode, _value: SaxonNode, _duration: SaxonNode, _indicator: SaxonNode) => {
            const qualifer = getTextOrValue(_qualifier)
            const type = getTextOrValue(_type)
            const value = getTextOrValue(_value)
            const duration = getTextOrValue(_duration)
            const indicator = getTextOrValue(_indicator)

            if (this._specificValues) {
                if (this._specificValues.length === 0) this._specificValues.push([[]])
                this._specificValues[0][0].push({
                    qualifer,
                    type,
                    value,
                    duration,
                    indicator
                })
            }
        }

        saxon.transform({
            stylesheetText: xslt,
            sourceNode: xml,
            destination: "serialized",
          }, "sync")

        return {
            instances: this._blockInstances
        }
    }
}