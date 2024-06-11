import saxon from 'saxon-js';
import xslt from "@/src/plcopen/xslt/variables_info.xslt"
import {getAsBool, getAsInt, getTextOrValue} from "@/src/plcopen/saxon/saxon-utils.js";

declare module globalThis {
    function AddTree(): void;
    function AddVarToTree(name: SaxonNode): void;
    function SetType(type: SaxonNode): void;
    function AddDimension(lower: SaxonNode, upper: SaxonNode): void;
    function AddVariable(_name: SaxonNode, _varClass: SaxonNode, _varOption: SaxonNode, _adress: SaxonNode, _initialValue: SaxonNode, _edit: SaxonNode, _doc: SaxonNode): void
}

type Variable = {
    name: string,
    varClass: string,
    varOption?: string,
    adress?: string,
    initialValue?: string,
    edit: boolean,
    doc?: string
}
 
export default class VariablesCollector {
    private _variables: Variable[] = []
    private _treeStack: string[][] = []
    private _type: string | null = null
    private _dimensions: { lower: number, upper: number }[] = []

    public collect = (xml: SaxonNode) => {
        globalThis.SetType = (_type: SaxonNode) => {
            this._type = getTextOrValue(_type)
        }

        globalThis.AddDimension = (_lower: SaxonNode, _upper: SaxonNode) => {
            this._dimensions.push({
                lower: getAsInt(_lower)!,
                upper: getAsInt(_upper)!
            })
        }

        globalThis.AddTree = () => {
            this._treeStack.push([])
            this._dimensions = []
        }

        globalThis.AddVarToTree = (args: SaxonNode) => { 
            this._treeStack.at(-1)!.push(getTextOrValue(args)!)
        }

        globalThis.AddVariable = (_name: SaxonNode, _varClass: SaxonNode, _varOption: SaxonNode, _adress: SaxonNode, _initialValue: SaxonNode, _edit: SaxonNode, _doc: SaxonNode) => {
                this._variables.push({
                    name: getTextOrValue(_name)!,
                    varClass: getTextOrValue(_varClass)!,
                    varOption: getTextOrValue(_varOption)!,
                    adress: getTextOrValue(_adress)!,
                    initialValue: getTextOrValue(_initialValue)!,
                    edit: getAsBool(_edit),
                    doc: getTextOrValue(_doc)!,
                })
        }

        saxon.transform({
            stylesheetText: xslt,
            sourceNode: xml,
            destination: "serialized",
          }, "sync")
        
        return {
            variables: this._variables
        }
    }
}