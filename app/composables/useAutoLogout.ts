const INACTIVITY_TIMEOUT = 60 * 60 * 1000       // 1 heure
const REMEMBER_TIMEOUT = 30 * 24 * 60 * 60 * 1000 // 30 jours

export const useAutoLogout = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  let timer: ReturnType<typeof setTimeout>

  const signOut = async () => {
    localStorage.removeItem('rememberMe')
    localStorage.removeItem('loginDate')
    await supabase.auth.signOut()
  }

  const reset = () => {
    clearTimeout(timer)
    if (!user.value) return

    const rememberMe = localStorage.getItem('rememberMe') === 'true'

    if (rememberMe) {
      const loginDate = parseInt(localStorage.getItem('loginDate') || '0')
      const remaining = REMEMBER_TIMEOUT - (Date.now() - loginDate)
      if (remaining <= 0) {
        signOut()
      } else {
        timer = setTimeout(signOut, remaining)
      }
    } else {
      timer = setTimeout(signOut, INACTIVITY_TIMEOUT)
    }
  }

  const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']

  onMounted(() => {
    events.forEach(e => window.addEventListener(e, reset, { passive: true }))
    reset()
  })

  onUnmounted(() => {
    clearTimeout(timer)
    events.forEach(e => window.removeEventListener(e, reset))
  })
}
