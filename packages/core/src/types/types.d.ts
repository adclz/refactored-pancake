// Declare xslt / xml / xsd / csv / po files as typescript modules globally

declare type xslt = string
declare module "*.xslt" {
    const doc: xslt;
    export default doc;
}

declare type xml = string
declare module "*.xml" {
    const doc: xml;
    export default doc;
}

declare type xsd = string
declare module "*.xsd" {
    const doc: csv;
    export default doc;
}

declare type csv = string
declare module "*.csv" {
    const doc: csv;
    export default doc;
}

declare type po = import("gettext.js").JsonData;
declare module "*.po" {
    const doc: po;
    export default doc;
}

// mjs file for esbuild
declare module "*.mjs" {
    const doc: any;
    export default doc;
}