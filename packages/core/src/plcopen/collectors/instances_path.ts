import saxon from 'saxon-js';
import xslt from "@/src/plcopen/xslt/instances_path.xslt"
import {getTextOrValue} from "@/src/plcopen/saxon/saxon-utils.js";

declare module globalThis {
    function AddInstance(_instance: SaxonNode): void
}

export default class InstancesPathCollector {
    private _instances: string[] = []
    public collect = (xml: SaxonNode, instanceType: string) => {
        
        globalThis.AddInstance = (_instance: SaxonNode) => {
            this._instances.push(getTextOrValue(_instance)!)
        }

        saxon.transform({
            stylesheetText: xslt,
            sourceNode: xml,
            destination: "serialized",
            staticParameters: {
                instance_type: instanceType
            }
        }, "sync")
        return {
            instances: this._instances
        }
    }
}