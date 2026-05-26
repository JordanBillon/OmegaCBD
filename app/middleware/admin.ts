export default defineNuxtRouteMiddleware(() => {
  const user = useSupabaseUser()
  if (!user.value) return navigateTo('/compte/connexion')
})
