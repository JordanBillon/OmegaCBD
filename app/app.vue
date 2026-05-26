<template>
  <NuxtLayout>
    <NuxtPage :transition="{ name: 'page' }" />
  </NuxtLayout>
</template>

<script setup>
const { init } = useTheme()
onMounted(() => init())
</script>
