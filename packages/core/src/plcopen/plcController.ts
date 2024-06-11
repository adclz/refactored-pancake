import saxon from 'saxon-js';
import InstancesPathCollector from "@/src/plcopen/collectors/instances_path.js"
import POUVariablesCollector, { VariablesTreeItemsInfos } from "@/src/plcopen/collectors/pou_variables.js"
import InstanceTagnameCollector from "@/src/plcopen/collectors/instance_tagname.js"
import POUBlockInstanceCollector, { BlockInstanceInfos } from "@/src/plcopen/collectors/pou_block_instances.js"
import VariablesCollector from "@/src/plcopen/collectors/variables_info.js"
import {validateTc6} from "@/src/plcopen/tc6/xsdValidation.js";

// Global functions mocks
declare module globalThis {
    function GetProject(): SaxonNode;
    function GetStdLibs(): SaxonNode;
    function GetExtensions(): SaxonNode;
}

globalThis.GetProject = () => saxon.XPath.evaluate(`parse-xml($xml)`, null, { params: { xml: ProjectTemplate } })
globalThis.GetStdLibs = () => saxon.XPath.evaluate(`parse-xml($xml)`, null, { params: { xml: "<text>project_mock</text>" } })
globalThis.GetExtensions = () => saxon.XPath.evaluate(`parse-xml($xml)`, null, { params: { xml: "<text>extensions_mock</text>" } })


// https://github.com/beremiz/beremiz/blob/python3/PLCControler.py
export default class PlcController {
    private _beremizFile: SaxonNode

    private _InstancesPathCollector = new InstancesPathCollector()
    private _POUVariablesCollector = new POUVariablesCollector()
    private _InstanceTagnameCollector = new InstanceTagnameCollector()
    private _POUBlockInstanceCollector = new POUBlockInstanceCollector()
    private _VariableInfoCollector = new VariablesCollector()

    constructor(beremizFile: string) {
        const isValid = validateTc6(beremizFile)
        if (typeof isValid !== "boolean") throw isValid
        this._beremizFile = saxon.XPath.evaluate(`parse-xml($xml)`, null, { params: { xml: beremizFile } })
    }
        
    public getPous = (exclude?: string, filter: string[] = []) => {
        let clause1 = exclude !== null ? `[@name!='${exclude}']` : '';
        let clause2 = filter.length > 0
            ? `[${filter.map(x => `@pouType='${x}'`).join(' or ')}]`
            : '';
        
        return saxon.XPath.evaluate(`//ppx:types/ppx:pous/ppx:pou${clause1}${clause2}`, this._beremizFile, { ...ns, resultForm: "array" })
            .map(x => ({
                getName: saxon.XPath.evaluate('@name', x, ns).value,
                getPouType: saxon.XPath.evaluate('@pouType', x, ns).value,
                getBodyType: saxon.XPath.evaluate('local-name(./body/*[1])', x, ns)  
        }))
    }

    public getVariables = () => {
        return this._VariableInfoCollector.collect(this._beremizFile)
    }

    public getPOUVariables = () => {
        return this._POUVariablesCollector.collect(this._beremizFile)
    }

    public getPOUBlockInstances = () => {
        return this._POUBlockInstanceCollector.collect(this._beremizFile)
    }

    public getInstanceTagName = (instancePath: string) => {
      return this._InstanceTagnameCollector.collect(this._beremizFile, instancePath)
    }

    public getInstancePath = (instanceType: string) => {
        return this._InstancesPathCollector.collect(this._beremizFile, instanceType)
    }
}

const ns =
    {
        namespaceContext: {
            'ns1': 'http://www.plcopen.org/xml/tc6.xsd',
            'ppx': 'http://www.plcopen.org/xml/tc6_0201',
            'xhtml': 'http://www.w3.org/1999/xhtml',
            'xsd': 'http://www.w3.org/2001/XMLSchema'
        },
        xpathDefaultNamespace: "http://www.plcopen.org/xml/tc6_0201",
    }

const ProjectTemplate = `
<project xmlns:ns1="http://www.plcopen.org/xml/tc6_0201"
         xmlns:xhtml="http://www.w3.org/1999/xhtml"
         xmlns:xsd="http://www.w3.org/2001/XMLSchema"
         xmlns="http://www.plcopen.org/xml/tc6_0201">
  <fileHeader companyName="" productName="" productVersion=""
              creationDateTime="1970-01-01T00:00:00"/>
  <contentHeader name="paste_project">
    <coordinateInfo>
      <fbd><scaling x="0" y="0"/></fbd>
      <ld><scaling x="0" y="0"/></ld>
      <sfc><scaling x="0" y="0"/></sfc>
    </coordinateInfo>
  </contentHeader>
  <types>
    <dataTypes/>
    <pous>%s</pous>
  </types>
  <instances>
    <configurations/>
  </instances>
</project>`