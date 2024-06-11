<template>
  <div class="flex flex-row items-center h-screen w-screen bg-[#2D2D2D]">
    <Editor/>
    <Output/>
  </div>
</template>

<style>
body {
  margin: 0;
}

/* CSS for a scrollbar similar to Visual Studio Code */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(121, 136, 156, 0.4);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(100, 115, 135, 0.7);
}

::-webkit-scrollbar-track {
  background-color: rgba(255, 255, 255, 0.08);
}
</style>
<script setup>
</script>