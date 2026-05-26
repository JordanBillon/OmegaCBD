export interface CartItem {
  productId: string
  name: string
  weight: '2g' | '5g' | '10g'
  price: number
  quantity: number
  image: string
}

export const useCart = () => {
  const items = useState<CartItem[]>('cart', () => [])
  const loaded = useState<boolean>('cart_loaded', () => false)

  // Charger depuis localStorage
  const load = () => {
    if (import.meta.client && !loaded.value) {
      const saved = localStorage.getItem('omegacbd_cart')
      if (saved) items.value = JSON.parse(saved)
      loaded.value = true
    }
  }

  // Sauvegarder dans localStorage
  const save = () => {
    if (import.meta.client) {
      localStorage.setItem('omegacbd_cart', JSON.stringify(items.value))
    }
  }

  const add = (item: Omit<CartItem, 'quantity'>) => {
    const existing = items.value.find(
      i => i.productId === item.productId && i.weight === item.weight
    )
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...item, quantity: 1 })
    }
    save()
  }

  const remove = (productId: string, weight: string) => {
    items.value = items.value.filter(
      i => !(i.productId === productId && i.weight === weight)
    )
    save()
  }

  const updateQuantity = (productId: string, weight: string, quantity: number) => {
    const item = items.value.find(i => i.productId === productId && i.weight === weight)
    if (item) {
      if (quantity <= 0) remove(productId, weight)
      else { item.quantity = quantity; save() }
    }
  }

  const clear = () => {
    items.value = []
    save()
  }

  const total = computed(() =>
    items.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
  )

  const count = computed(() =>
    items.value.reduce((sum, i) => sum + i.quantity, 0)
  )

  return { items, load, add, remove, updateQuantity, clear, total, count }
}
