import saxon from 'saxon-js';
import { CLASS_TYPES, POU_TYPES, VAR_CLASS_INFOS } from "@/src/plcopen/constant/items.js"
import xslt from "@/src/plcopen/xslt/pou_variables.xslt"
import {getAsBool, getTextOrValue} from "@/src/plcopen/saxon/saxon-utils.js";

const extractClass = (value: string) => {
    const asClass = CLASS_TYPES[value as keyof typeof CLASS_TYPES]
    if (asClass) return asClass

    const asPou = POU_TYPES[value as keyof typeof POU_TYPES]
    if (asPou) return asPou

    const asType = VAR_CLASS_INFOS[value as keyof typeof VAR_CLASS_INFOS]
    if (asType) return asType[1]

    return null
}

declare module globalThis {
    function SetRoot(_varClass: SaxonNode, _varType: SaxonNode, _edit: SaxonNode, _debug: SaxonNode): void;
    function AddVariable(_name: SaxonNode, _varClass: SaxonNode, _varType: SaxonNode, _edit: SaxonNode, _debug: SaxonNode): void
}

export interface VariablesTreeItemsInfos {
    name: string
    varClass: number
    varType: string
    edit: boolean
    debug: boolean
    variables: VariablesTreeItemsInfos[]
}

export default class POUVariablesCollector {
    private _root: Omit<VariablesTreeItemsInfos, "name"> | null = null

    public collect = (xml: SaxonNode) => {
        globalThis.AddVariable = (_name: SaxonNode, _varClass: SaxonNode, _varType: SaxonNode, _edit: SaxonNode, _debug: SaxonNode) => {
            this._root?.variables.push({
                name: getTextOrValue(_name)!,
                varClass: extractClass(getTextOrValue(_varClass)!) as number,
                varType: getTextOrValue(_varType)!,
                edit: getAsBool(_edit),
                debug: getAsBool(_debug),
                variables: []
            })
        }

        globalThis.SetRoot = (_varClass: SaxonNode, _varType: SaxonNode, _edit: SaxonNode, _debug: SaxonNode) => {
            this._root = {
                varClass: extractClass(getTextOrValue(_varClass)!) as number,
                varType: getTextOrValue(_varType)!,
                edit: getAsBool(_edit),
                debug: getAsBool(_debug),
                variables: []
            }
        }

        saxon.transform({
            stylesheetText: xslt,
            sourceNode: xml,
            destination: "serialized",
          }, "sync")

        return {
            root: this._root
        }
    }
}