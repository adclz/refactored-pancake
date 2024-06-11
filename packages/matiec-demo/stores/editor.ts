export const useEditorStore = defineStore('editor', () => {
    const content = ref("")
    const errorMarker = ref(null)
   
    const getContent = computed(() => content)
    function setContent(data: string) {
        content.value = data
    }

    const getError = computed(() => errorMarker)
    function setError(startLine: number, endLine: number, startColumn: number, endColumn: number, message: string) {
        errorMarker.value = {
            startLine,
            endLine,
            startColumn,
            endColumn,
            message
        }
    }

    return { getContent, setContent, getError, setError }
})