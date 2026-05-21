<template>
  <div />
</template>

<script setup>
const user = useSupabaseUser()
await navigateTo(user.value ? '/compte/dashboard' : '/compte/connexion')
</script>
