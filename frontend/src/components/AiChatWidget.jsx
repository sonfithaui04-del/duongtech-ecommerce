import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { MessageSquare, X, Send } from 'lucide-react'
import { useCompare } from '../context/CompareContext'

const GREETING = {
  role: 'assistant',
  text: 'Xin chào 👋 Mình là trợ lý của DuongTech. Bạn cần tư vấn laptop hay thiết bị công nghệ nào để mình gợi ý nhé?',
  suggestions: [],
}

const priceFmt = new Intl.NumberFormat('vi-VN')

function formatPrice(p) {
  if (p === null || p === undefined) return ''
  return priceFmt.format(Number(p)) + '₫'
}

// Render **đậm** trong một dòng
function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <strong key={i} className="text-cyan-300">{part.slice(2, -2)}</strong>
    }
    return <span key={i}>{part}</span>
  })
}

// Render markdown đơn giản: đậm, gạch đầu dòng, xuống dòng
function renderRich(text) {
  const lines = text.split('\n')
  const blocks = []
  let listItems = []
  const flushList = (key) => {
    if (listItems.length) {
      blocks.push(
        <ul key={'ul' + key} className="list-disc pl-5 space-y-0.5 my-1">
          {listItems}
        </ul>
      )
      listItems = []
    }
  }
  lines.forEach((line, i) => {
    const trimmed = line.trim()
    const bullet = trimmed.match(/^[*-]\s+(.*)$/)
    if (bullet) {
      listItems.push(<li key={i}>{renderInline(bullet[1])}</li>)
    } else {
      flushList(i)
      if (trimmed === '') {
        blocks.push(<div key={i} className="h-1.5" />)
      } else {
        blocks.push(
          <p key={i} className="my-0.5">
            {renderInline(line)}
          </p>
        )
      }
    }
  })
  flushList('end')
  return blocks
}

export default function AiChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  // Đẩy widget lên khi thanh so sánh đang hiện để không che nhau
  const { compareList } = useCompare()
  const location = useLocation()
  const lifted = compareList.length > 0 && location.pathname !== '/compare'
  const offset = lifted ? 'bottom-28' : 'bottom-6'

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const newMessages = [...messages, { role: 'user', text }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const history = messages
        .filter((m) => m !== GREETING)
        .map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', content: m.text }))

      const res = await axios.post('/api/ai/chat', { message: text, history })
      const reply = res.data?.reply || 'Xin lỗi, mình chưa trả lời được câu này.'
      const suggestions = res.data?.suggestions || []
      setMessages((prev) => [...prev, { role: 'assistant', text: reply, suggestions }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Xin lỗi, trợ lý đang bận. Bạn thử lại sau ít phút nhé.', suggestions: [] },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Mở trợ lý AI"
          className={`fixed ${offset} right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center hover:-translate-y-0.5 transition-all z-50`}
        >
          <MessageSquare size={24} />
        </button>
      )}

      {open && (
        <div className={`fixed ${offset} right-6 w-80 md:w-96 h-[520px] bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] border border-white/10 flex flex-col overflow-hidden z-50`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">💻</span>
              <div>
                <p className="font-bold leading-tight">Trợ lý DuongTech</p>
                <p className="text-xs text-white/80">Tư vấn laptop &amp; công nghệ bằng AI</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Đóng" className="text-white/80 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Tin nhắn */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-br-sm whitespace-pre-wrap'
                      : 'bg-white/5 text-slate-200 border border-white/10 rounded-bl-sm leading-relaxed'
                  }`}
                >
                  {m.role === 'user' ? m.text : renderRich(m.text)}
                </div>

                {/* Thẻ sản phẩm gợi ý (kèm ảnh) */}
                {m.role === 'assistant' && m.suggestions && m.suggestions.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 gap-2 w-[85%]">
                    {m.suggestions.map((s) => (
                      <div key={s.id ?? s.name} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                        <div className="w-full h-20 bg-slate-800">
                          {s.imageUrl && (
                            <img
                              src={s.imageUrl}
                              alt={s.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.currentTarget.style.display = 'none' }}
                            />
                          )}
                        </div>
                        <div className="p-2">
                          <p className="text-xs font-medium text-slate-200 line-clamp-2">{s.name}</p>
                          {s.price != null && (
                            <p className="text-xs text-cyan-400 font-bold mt-0.5">{formatPrice(s.price)}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 text-slate-400 px-3 py-2 rounded-2xl rounded-bl-sm text-sm">
                  Đang soạn trả lời…
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Ô nhập */}
          <div className="p-3 border-t border-white/10 flex items-end gap-2 shrink-0">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi…"
              className="flex-1 resize-none bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/60 max-h-24"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-blue-500 to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full w-10 h-10 flex items-center justify-center shrink-0"
              aria-label="Gửi"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
