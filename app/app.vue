<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const { init } = useTheme()
onMounted(() => init())
</script>
