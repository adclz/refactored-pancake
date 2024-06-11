import { XmlDocument, XsdValidator, XmlValidateError } from "libxml2-wasm"
import tc6 from "@/src/plcopen/tc6/tc6_xml_v201.xsd"

export const validateTc6 = (xmlFile: string): XmlValidateError | true => {
    const schema = XmlDocument.fromString(tc6)
    const validator = XsdValidator.fromDoc(schema)
    
    const doc = XmlDocument.fromString(xmlFile)
    
    let ex: XmlValidateError | true = true;
    try {
        validator.validate(doc)
    } catch (e: any) {
        ex = e
    }
    doc.dispose();
    validator.dispose();
    schema.dispose();
    return ex
}

