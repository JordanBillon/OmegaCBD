export const useTheme = () => {
  const isDark = useState('isDark', () => false)

  const applyTheme = (dark: boolean) => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }

  const toggle = () => {
    isDark.value = !isDark.value
    applyTheme(isDark.value)
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  const init = () => {
    const saved = localStorage.getItem('theme')
    isDark.value = saved === 'dark'
    applyTheme(isDark.value)
  }

  return { isDark, toggle, init }
}
