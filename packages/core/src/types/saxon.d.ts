declare module "saxon-js" {
    /**
     * Exactly one of stylesheetLocation, stylesheetFileName, stylesheetText, or stylesheetInternal must be supplied.
     * Exactly one of sourceLocation, sourceFileName, sourceNode, or sourceText can be supplied.
     */
    export interface ITransformOptions {
      /**
       * A URI that can be used to locate the compiled stylesheet (a SEF file in JSON format).
       */
      stylesheetLocation?: string;
  
      /**
       * A file name that can be used to locate the compiled stylesheet (a JSON document).
       * Available in Node.js only. The filename, if relative, is resolved against the
       * current working directory.
       */
      stylesheetFileName?: string;
  
      /**
       * The JSON text content of the compiled stylesheet.
       */
      stylesheetText?: string;
  
      /**
       * This may be set to the JavaScript object that results from JSON-parsing of the SEF file.
       */
      stylesheetInternal?: object;
  
      /**
       * The static base URI of the stylesheet, as an absolute base URI.
       * Used, for example, by functions such as doc() or resolve-uri().
       */
      stylesheetBaseURI?: string;
  
      /**
       * Either "json" or "xml": used with sourceLocation, sourceFileName, or sourceText
       * to indicate whether the source is JSON or XML. Defaults to "xml".
       */
      sourceType?: string;
  
      /**
       * URI that can be used to locate the XML or JSON document.
       */
      sourceLocation?: string;
  
      /**
       * File name of the XML or JSON document. Available in Node.js only.
       * The filename, if relative, is resolved against the current working directory.
       */
      sourceFileName?: string;
  
      /**
       * The principal input as a DOM Node. This will normally be a Document or
       * DocumentFragment node, but any node is acceptable. (If it is not a
       * Document or DocumentFragment, then it will not match any match="/"
       * template rule.)
       */
      sourceNode?: SaxonNode;
  
      /**
       * Lexical XML or JSON supplying the source document.
       */
      sourceText?: string;
  
      /**
       * Absolute base URI for the source. The base URI of the source is automatically
       * set when supplied using sourceLocation or sourceFileName. This option can be
       * used to set the base URI for source supplied using sourceNode or sourceText,
       * as required.
       */
      sourceBaseURI?: string;
  
      /**
       * Determines what happens to the principal result tree from the transformation.
       * The default value is "application".
       */
      destination?:
        | "replaceBody"
        | "appendToBody"
        | "prependToBody"
        | "raw"
        | "document"
        | "application"
        | "file"
        | "stdout"
        | "serialized";
  
      /**
       * The meanings of the values are described under SaxonJS.XPath.evaluate().
       */
      resultForm?: "default" | "array" | "iterator" | "xdm";
  
      /**
       * Supplies additional serialization properties to be used when the principal
       * transformation result is serialized (if no serialization takes place, this
       * property is ignored). An example might be {method: "xml", indent: false}.
       */
      outputProperties?: object;
  
      /**
       * Applicable to Node.js only (in the browser, the HTML page always acts as the
       * master document). The master document is accessible within the transformation
       * using the extension function ixsl:page(). It can be updated in-situ by invoking
       * xsl:result-document with an appropriate method, or by using the extension
       * instructons ixsl:set-attribute or ixsl:remove-attribute.
       */
      masterDocument?: SaxonNode;
  
      /**
       * The Base Output URI for the transformation. Used to resolve relative URIs
       * appearing in the href attribute of xsl:result-document. In the browser, the
       * base output URI is always the URI of the HTML page (any other value is ignored).
       * In Node.js, the default is the URI of the principal output file for the
       * transformation; or failing that, the URI of the document supplied as
       * masterDocument.
       */
      baseOutputURI?: string;
      
      
      /// EXTENDED
      // Static parameters
      staticParameters?: Record<string, string>;  
    }
  
    export interface ITransformOutput {
      principalResult: any;
      resultDocuments: object;
      stylesheetInternal: object;
      masterDocument: Node;
    }
  
    export function transform(
      options: ITransformOptions,
      execution: "async" | "sync" | undefined
    ): Promise<ITransformOutput> | ITransformOutput;

    export interface IEvaluateOptions<T extends "default" | "array" | "iterator" | "xdm" = "default">  {
        /**
         * A JavaScript object containing the values of parameters whose values can be referred to in the expression.
         * The key is the name of the parameter either as a simple local name, or a URI qualified name in the form 'Q{uri}local'. 
         * The corresponding value is a JavaScript value, which is converted to an XDM value according to the JavaScript to XDM conversion as described in JS/XDM Type Conversion (using "strong" conversion for JavaScript objects). 
         * The default is an empty object (meaning no parameters are bound).
         */
        params?: Record<string, string>

        /**
         * The static Base URI of the expression (this is used, for example, in calls of doc() or unparsed-text()).
         * The default is the HTML page location, i.e. the value of window.location.href.
         */
        staticBaseURI?: string

        /**
         * A JavaScript object containing the bindings of prefixes to namespaces to be used in the XPath expression.
         * The key is the prefix; the corresponding value as a String, is the respective URI.
         * The default is an empty object (so no additional namespaces are bound). 
         * For convenience the usual namespaces for prefixes xml, fn, xs, map, array, math, and saxon are defined by default, but can be overwritten.
         */
        namespaceContext?: Record<string, string>

        /**
         * The default namespace for unprefixed QNames in the expression. The value "", which is the default, indicates that unprefixed names represent names in no namespaces. 
         * This default applies only to element names and type names: it does not affect, for example, names used to refer to attributes, to variables, or to functions.
         */
        xpathDefaultNamespace?: string

        /**
         * A JavaScript object containing the (alterations to the) default or unnamed decimal format for use by format-number() calls within the XPath expression. 
         * The keys of the object are the selected components as described for xsl:decimal-format; the corresponding value is the required component value. 
         * In the absence of this option, default number formatting is performed for the unnamed (default) decimal format.
         * For example, with
         * @example
         * defaultDecimalFormat: {"decimal-separator":",",
         *                      "grouping-separator":"."}
         * ...
         * format-number(12345.6, '#.###,00') → "12.345,60"
         */
        defaultDecimalFormat?: Record<string, string>

        /**
         * A JavaScript object containing named decimal formats for use in format-number() calls within the XPath expression.
         * The key is the name of the format; the corresponding value is a map for that named format, in the same form as described for defaultDecimalFormat above.
         * For example, with
         * @example
         * namedDecimalFormats: {"alternate":{"infinity":"out-of-range"}}
         * ...
         * format-number(1e0 div 0, '#','alternate') → "out-of-range"
         */
        namedDecimalFormats?: Record<string, string>

        /**
         * The form in which the expression result should be emitted. 
         * Items in the result are converted from XDM to JavaScript according to the JavaScript to XDM conversion as described in JS/XDM Type Conversion, except that XDM maps are converted to JavaScript objects as described below.
         * These results are returned as a sequence according to the following values of this option:
         * 
         * ## default
         * The default behaviour: an empty sequence is returned as null, a singleton as its JavaScript conversion, and sequences longer than one item as an array.
         *
         * ## array
         * The result will be always be returned as an array, even if it is a singleton or an empty sequence, in which case the array result will have one or zero members respectively. Each array member contains the JavaScript conversion of one item in the result.
         *
         * So, for example, if the XPath expression returns a sequence of zero or more xs:integer values, the result will be delivered as a JavaScript array containing JavaScript number values.
         *
         * ## iterator
         * The result will be always be returned as an iterator over the converted result sequence rather than an array, singleton or null. The iterator will be an instance a Saxon internal iterator class: successive items can be obtained by repeated calls on the next() method, until null is returned, each item being converted from XDM to JavaScript as it is requested.
         *
         * The iterator may operate lazily, meaning that the expression is evaluated incrementally as items are requested. This means that a dynamic error in evaluating the expression might not be detected until several items have been successfully returned. It also makes the behavior unpredictable if the expression being evaluated accesses mutable data (for example, external JavaScript objects, or HTML or XML documents that are modified during the evaluation).
         *
         * ## xdm
         * The result will be returned as an unconverted XDM value (for details see XDM Data Model).
         *
         * This will always be a JavaScript array (representing an XDM sequence) of XDM items. Within the array, an XDM node is represented as a DOM Node; an atomic value will be an instance of a class such as SaxonJS.Atomic.XdmString or SaxonJS.Atomic.XdmQName; XDM functions, arrays, and maps are instances of SaxonJS.XdmFunction, SaxonJS.XdmArray, or SaxonJS.XdmMap respectively. The item may also be a wrapped JavaScript value (class JSValue).
         */
        resultForm?: T
        
    }

    export const XPath: {
        evaluate<T extends "default" | "array" | "iterator" | "xdm" = "default">
        (xPath: string, contextItem?: null | SaxonNode | string | string[], options?: IEvaluateOptions<T>):
            T extends "default" ? SaxonNode :
                T extends "array" ? SaxonNode[] :
                    T extends "iterator" ? Iterable<any> :
                        T extends "xdm" ? SaxonNode[] : never
    }
  }

// Extended
  /**
   * Xml node processed by saxon
   */
interface SaxonNode extends Node {
    readonly textContent: string | undefined
    readonly value: string | undefined
}  