<script setup lang="ts">
import {iec2c, libs} from "@private/matiec"
import {useEditorStore} from "@/stores/editor";
import * as monaco from "monaco-editor";

const editorRef = ref(null);
const models = ref<monaco.Uri[]>([])
const activeModel = ref(null)
const store = useEditorStore()
const matiecProcessing = ref(false)
const matiecError = ref(null)

const onLoad = () => {
  const editor = toRaw(editorRef.value.$editor) as monaco.editor.IStandaloneCodeEditor;
  editor.updateOptions({readOnly: true})
  const parent = document.getElementById("output")!
  const rect = parent.getBoundingClientRect()
  const buttons = document.getElementById("buttons")!
  
  window.addEventListener('resize', () => {
    editor.layout({ width: 0, height: 0 })

    window.requestAnimationFrame(() => {
      const rect = parent.getBoundingClientRect()
      editor.layout({ width: rect.width, height: rect.height - buttons.getBoundingClientRect().height })
    })
  })
};
const switchModel = (model: monaco.Uri) => {
  const editor = toRaw(editorRef.value.$editor) as monaco.editor.IStandaloneCodeEditor;
  editor.setModel(monaco.editor.getModel(model));
  activeModel.value = model
  const parent = document.getElementById("output")!
  const rect = parent.getBoundingClientRect()
  const buttons = document.getElementById("buttons")!
  editor.layout({ width: rect.width, height: rect.height - 35  })
}

const resetAllModels = () => {
  const editor = toRaw(editorRef.value.$editor) as monaco.editor.IStandaloneCodeEditor;
  const currmodels = monaco.editor.getModels()
  currmodels.forEach(model => {
    if (model.uri.path.endsWith("h") || model.uri.path.endsWith("c") || model.uri.path.endsWith("csv"))
    model.dispose()
  })
  models.value = []
}

watch(store.getContent, content => {
  if (!matiecProcessing.value) runMatiec(content)
})


const runMatiec = async (data: string) => {
  matiecProcessing.value = true
  matiecError.value = null
  store.setError(null)

  resetAllModels()

  const args = [
    "-I", "/lib",
    "-T", "/test", "/test/plc.st"
  ]
  
  await iec2c({
    print: (data: string) => {
      console.log(data)
    },
    printErr: (err: string) => {
      if (err.startsWith("/")) {
        let splitResult = err.split(":");
        let filePath = splitResult[0];
        let lineDetails = splitResult[1];
        let errorDetails = splitResult.slice(2).join(":");
        let splitLineDetails = lineDetails.split("..");
        let startingLine, startingColumn, endingLine, endingColumn;

        if (splitLineDetails.length > 1) {
          let startingLineAndColumn = splitLineDetails[0].split("-");
          let endingLineAndColumn = splitLineDetails[1].split("-");
          startingLine = startingLineAndColumn[0];
          startingColumn = startingLineAndColumn[1];
          endingLine = endingLineAndColumn[0];
          endingColumn = endingLineAndColumn[1];
          store.setError(parseInt(startingLine), parseInt(endingLine), parseInt(startingColumn), parseInt(endingColumn), errorDetails)
        } else {
          startingLine = lineDetails;
          store.setError(parseInt(startingLine), parseInt(startingLine), null, null, errorDetails)
        }

        matiecError.value = errorDetails
        matiecProcessing.value = false
      }
    },
    noInitialRun: true,
    onRuntimeInitialized: function () {
      this.FS.mkdir('/lib');

      Object.entries(libs)
          .forEach(tuple => {
            const fileName = tuple[0] + ".txt"
            const file = tuple[1]
            this.FS.writeFile('/lib/' + fileName, file);
          })

      // Test folder with first_steps ST code            
      this.FS.mkdir('/test');
      this.FS.writeFile('/test/plc.st', data);

      // Call iec2c 
      const status = this.callMain(args);
      const editor = toRaw(editorRef.value.$editor) as monaco.editor.IStandaloneCodeEditor;

      // No unit tests here but just checking in the console if c code is generated
      const files = this.FS.readdir('/test');
      for (const file of files) {
        if (file !== '.' && file !== '..') {
          const content = this.FS.readFile('/test/' + file, {encoding: 'utf8'});
          if (file.includes('.c') || (file.includes('.h') || (file.includes(".csv")))) {
            const modelUri = monaco.Uri.parse(`file:///${file}`);
            const model = monaco.editor.createModel(content, "c", modelUri);
            models.value.push(model.uri);
          }
        }
      }

      matiecProcessing.value = false
      switchModel(models.value[0])
    }
  })
}

</script>

<template>
  <div id="output" class="flex flex-col w-full h-full overflow-hidden">
    <div id="buttons" class="flex flex-row overflow-y-auto overflow-y-hidden">
      <button
          v-for="(model, index) in models"
          @click="switchModel(model)"
          :class="activeModel === model ? 'bg-[#1e1e1e]' : 'bg-[#2D2D2D]'"
          class="py-2 px-4 text-sm text-white hover:cursor-pointer decoration-none border-0"
      >
        <span>{{ model.fsPath.replace("\\", "") }}</span>
      </button>
    </div>
    <div class="h-full">
      <MonacoEditor @load="onLoad"
                    lang="c"
                    :options="{ theme: 'vs-dark' }"
                    ref="editorRef"/>
    </div>
    <div class="text-white h-full w-full text-center" 
         v-if="matiecError">
      <h1 class="">Something went wrong :/</h1>
      <span>{{matiecError}}</span>
    </div>
  </div>
</template>

<style scoped>

</style>