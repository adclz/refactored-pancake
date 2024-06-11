// Equivalent of _StringValue, _Bool & _Number of beremiz


export const getTextOrValue = (node: SaxonNode): string | null => {
    if (!node) return null
    if (node["textContent"]) return node.textContent
    else if (node["value"]) return node.value
    else return null
}

export const getAsBool = (node: SaxonNode) => {
    const content = getTextOrValue(node);
    if (!content) return false;
    else return asBool(content)
}

export const getAsInt = (node: SaxonNode) => {
    const content = getTextOrValue(node);
    if (!content) return null
    else return parseInt(content)
}

// Other
export const asBool = (content: string) => (content.includes("true") || content.includes("0"))