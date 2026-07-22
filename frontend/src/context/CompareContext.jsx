import React, { createContext, useState, useContext, useEffect } from 'react'
import toast from 'react-hot-toast'

const CompareContext = createContext()

const STORAGE_KEY = 'duongtech_compare'
const MAX_COMPARE = 4

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(compareList))
  }, [compareList])

  const isComparing = (id) => compareList.some(i => i.id === id)

  // Nhóm sản phẩm: phụ kiện không so sánh chung với laptop
  const getGroup = (item) => ((item.categoryName || '').toLowerCase().includes('phụ kiện') ? 'accessory' : 'laptop')

  const toggleCompare = (item) => {
    setCompareList(prev => {
      if (prev.some(i => i.id === item.id)) {
        return prev.filter(i => i.id !== item.id)
      }
      if (prev.length > 0 && getGroup(prev[0]) !== getGroup(item)) {
        toast.error('Không thể so sánh laptop với phụ kiện. Vui lòng chọn cùng nhóm sản phẩm.')
        return prev
      }
      if (prev.length >= MAX_COMPARE) {
        toast.error(`Chỉ so sánh tối đa ${MAX_COMPARE} sản phẩm`)
        return prev
      }
      toast.success(`Đã thêm "${item.name}" vào so sánh`)
      return [...prev, item]
    })
  }

  const removeCompare = (id) => {
    setCompareList(prev => prev.filter(i => i.id !== id))
  }

  const clearCompare = () => setCompareList([])

  return (
    <CompareContext.Provider value={{ compareList, isComparing, toggleCompare, removeCompare, clearCompare, MAX_COMPARE }}>
      {children}
    </CompareContext.Provider>
  )
}

export const useCompare = () => useContext(CompareContext)
