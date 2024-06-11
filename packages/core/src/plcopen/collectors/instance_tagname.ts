import saxon from 'saxon-js';
import xslt from "@/src/plcopen/xslt/instance_tagname.xslt"
import {getTextOrValue} from "@/src/plcopen/saxon/saxon-utils.js";


// Compute a data type name
const ComputeDataTypeName = (datatype: string) =>`D::${datatype}`

// Compute a pou name
const ComputePouName = (pou: string) => `P::${pou}`

// Compute a pou transition name
const ComputePouTransitionName = (pou: string, transition: string) => `T::${pou}::${transition}`

// Compute a pou action name
const ComputePouActionName = (pou: string, action: string) => `A::${pou}::${action}`

// Compute a pou  name
const ComputeConfigurationName = (config: string) =>  `C::${config}`

// Compute a pou  name
const ComputeConfigurationResourceName = (config: string, resource: string) => "R::%s::%s"

declare module globalThis {
    function ConfigTagName(_name: SaxonNode): void
    function ResourceTagName(_ancestor: SaxonNode, _name: SaxonNode): void
    function PouTagName(_name: SaxonNode): void
    function ActionTagName(_ancestor: SaxonNode, _name: SaxonNode): void
    function TransitionTagName(_ancestor: SaxonNode, _name: SaxonNode): void
}

export default class InstanceTagnameCollector {
    private _tagName: string | null = null

    public collect = (xml: SaxonNode, instancePath: string) => {
        globalThis.ConfigTagName = (_name: SaxonNode) => {
            this._tagName = getTextOrValue(_name)!
        }

        globalThis.ResourceTagName = (_ancestor: SaxonNode, _name: SaxonNode) => {
            this._tagName = ComputeConfigurationResourceName(getTextOrValue(_ancestor)!, getTextOrValue(_name)!)
        }

        globalThis.PouTagName = (_name: SaxonNode) => {
            this._tagName = ComputePouName(getTextOrValue(_name)!)
        }

        globalThis.ActionTagName = (_ancestor: SaxonNode, _name: SaxonNode) => {
            this._tagName = ComputePouActionName(getTextOrValue(_ancestor)!, getTextOrValue(_name)!)
        }

        globalThis.TransitionTagName = (_ancestor: SaxonNode, _name: SaxonNode) => {
            this._tagName = ComputePouTransitionName(getTextOrValue(_ancestor)!, getTextOrValue(_name)!)
        }

        saxon.transform({
            stylesheetText: xslt,
            sourceNode: xml,
            destination: "serialized",
            staticParameters: {
                instance_path: instancePath
              }
          }, "sync")
        return {
            tagName: this._tagName
        }
    }
}