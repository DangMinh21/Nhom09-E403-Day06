import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Globe, Ticket, Briefcase, Map, Plane, Star, HelpCircle,
  MessageCircle, Search, ChevronLeft, ArrowRightLeft,
  ShoppingBag, Armchair, Shield, LayoutGrid, Building2,
  Maximize2, Minimize2, X, Send, PlaneTakeoff, PlaneLanding,
  Loader2, ThumbsUp, ThumbsDown, MessageSquare, ChevronDown, ChevronUp,
  CheckCircle2, ExternalLink, MapPin
} from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const COLLAPSED_LINES = 5;
const VNA_BOOK_URL = 'https://www.vietnamairlines.com/vn/vi/buy-tickets-other-products/booking-and-manage-bookings/book-tickets';
const VNA_HOTELS_URL = 'https://www.vietnamairlines.com/vn/vi/buy-tickets-other-products/hotels-and-tours';

// --- COMPONENTS ---

const LotusLogo = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 10C50 10 40 30 20 40C40 45 50 60 50 60C50 60 60 45 80 40C60 30 50 10 50 10Z" fill="#EAB308"/>
    <path d="M50 65C50 65 35 75 10 70C25 85 50 90 50 90C50 90 75 85 90 70C65 75 50 65 50 65Z" fill="#EAB308"/>
    <path d="M15 45C15 45 25 60 5 65C15 75 30 75 30 75C20 60 15 45 15 45Z" fill="#EAB308"/>
    <path d="M85 45C85 45 75 60 95 65C85 75 70 75 70 75C80 60 85 45 85 45Z" fill="#EAB308"/>
  </svg>
);

const ChatAvatar = () => (
  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm overflow-hidden border border-gray-200">
    <span className="text-teal-700 font-bold text-xs">Nemo</span>
  </div>
);

// --- FEEDBACK BAR ---

function FeedbackBar({ msgId, botResponse, userMessage, onFeedbackSent }) {
  const [rating, setRating] = useState('');          // 'like' | 'dislike' | ''
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleRate = (value) => {
    if (submitted) return;
    setRating(prev => prev === value ? '' : value);
  };

  const handleSubmit = async () => {
    if (submitting || submitted) return;
    setSubmitting(true);
    try {
      await fetch(`${BACKEND_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bot_response: botResponse,
          user_message: userMessage,
          rating,
          comment,
        }),
      });
      setSubmitted(true);
      setShowComment(false);
      if (onFeedbackSent) onFeedbackSent(msgId);
    } catch {
      // silent fail — feedback is best-effort
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-1.5 mt-1.5 text-xs text-green-600">
        <CheckCircle2 size={13} />
        <span>Cảm ơn bạn đã phản hồi!</span>
      </div>
    );
  }

  return (
    <div className="mt-1.5">
      {/* Rating + comment toggle row */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleRate('like')}
          title="Hữu ích"
          className={`p-1 rounded transition-colors ${
            rating === 'like' ? 'text-green-600' : 'text-gray-400 hover:text-green-500'
          }`}
        >
          <ThumbsUp size={14} />
        </button>

        <button
          onClick={() => handleRate('dislike')}
          title="Không hữu ích"
          className={`p-1 rounded transition-colors ${
            rating === 'dislike' ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
          }`}
        >
          <ThumbsDown size={14} />
        </button>

        <button
          onClick={() => setShowComment(v => !v)}
          title="Thêm nhận xét"
          className={`p-1 rounded transition-colors ${
            showComment ? 'text-teal-600' : 'text-gray-400 hover:text-teal-500'
          }`}
        >
          <MessageSquare size={14} />
        </button>

        {/* Send immediately when only rating (no comment) */}
        {(rating && !showComment) && (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="text-xs text-teal-600 hover:text-teal-800 font-medium disabled:opacity-50 ml-1"
          >
            {submitting ? 'Đang gửi...' : 'Gửi'}
          </button>
        )}
      </div>

      {/* Comment textarea */}
      {showComment && (
        <div className="mt-2 flex flex-col gap-1.5">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Mô tả phản hồi của bạn..."
            rows={2}
            className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-2 resize-none focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting || (!rating && !comment.trim())}
              className="flex items-center gap-1 text-xs bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- MARKDOWN COMPONENTS ---

const mdComponents = {
  p: ({ children }) => <p className="mb-1.5 last:mb-0 leading-relaxed">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-gray-800">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => <ul className="list-disc pl-4 mb-1.5 space-y-0.5">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-4 mb-1.5 space-y-0.5">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-teal-600 underline hover:text-teal-800 break-all"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="bg-gray-200 text-gray-800 rounded px-1 py-0.5 text-[12px] font-mono">{children}</code>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-teal-300 pl-3 italic text-gray-600 mb-1.5">{children}</blockquote>
  ),
  hr: () => <hr className="border-gray-200 my-2" />,
  h1: ({ children }) => <h1 className="text-base font-bold mb-1">{children}</h1>,
  h2: ({ children }) => <h2 className="text-sm font-bold mb-1">{children}</h2>,
  h3: ({ children }) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
  table: ({ children }) => (
    <div className="overflow-x-auto mb-2">
      <table className="text-xs border-collapse w-full">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-gray-300 bg-gray-100 px-2 py-1 text-left font-semibold">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border border-gray-300 px-2 py-1">{children}</td>
  ),
};

// --- FLIGHT CARD ---

function formatPrice(vnd) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(vnd);
}

function FlightCard({ flight, fromName, toName }) {
  const isDelayed = flight.status && flight.status !== 'Đúng giờ';
  const bookUrl = `${VNA_BOOK_URL}`;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="bg-[#005564] text-white px-3 py-2 flex justify-between items-center">
        <span className="font-bold text-sm tracking-wide">{flight.flight_number}</span>
        <span className="text-xs text-teal-200">{flight.aircraft}</span>
      </div>

      {/* Route */}
      <div className="px-3 pt-2.5 pb-1 flex items-center gap-2">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-800 leading-none">{flight.departure_time}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">{fromName?.split(' - ')[0] || fromName}</div>
        </div>
        <div className="flex-1 flex flex-col items-center gap-0.5">
          <div className="text-[10px] text-gray-400">{Math.floor(flight.duration_min / 60)}g{flight.duration_min % 60 > 0 ? ` ${flight.duration_min % 60}p` : ''}</div>
          <div className="w-full flex items-center gap-1">
            <div className="h-px flex-1 bg-gray-300"></div>
            <Plane size={12} className="text-[#005564]" />
            <div className="h-px flex-1 bg-gray-300"></div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-800 leading-none">{flight.arrival_time}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">{toName?.split(' - ')[0] || toName}</div>
        </div>
      </div>

      {/* Status + seats */}
      <div className="px-3 pb-2 flex items-center gap-2">
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${isDelayed ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
          {flight.status}
        </span>
        <span className="text-[10px] text-gray-500">{flight.available_seats} ghế còn trống</span>
      </div>

      {/* Price + button */}
      <div className="border-t border-gray-100 px-3 py-2 flex items-center justify-between bg-gray-50">
        <div>
          <div className="text-[10px] text-gray-500">Economy từ</div>
          <div className="text-sm font-bold text-[#005564]">{formatPrice(flight.economy_price_vnd)}</div>
        </div>
        <a
          href={bookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 bg-[#005564] hover:bg-[#004a57] text-white text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
        >
          Đặt vé <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
}

// --- HOTEL CARD ---

function StarRating({ count }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />
      ))}
    </span>
  );
}

function HotelCard({ hotel }) {
  const bookUrl = hotel.booking_url || `${VNA_HOTELS_URL}`;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="bg-[#005564] text-white px-3 py-2">
        <div className="font-semibold text-sm leading-tight">{hotel.name}</div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <StarRating count={hotel.stars} />
          <span className="text-teal-200 text-[10px]">({hotel.stars} sao)</span>
        </div>
      </div>

      {/* Info */}
      <div className="px-3 py-2 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-gray-500 text-[11px]">
            <MapPin size={11} />
            <span>Cách sân bay {hotel.distance_km} km</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-600 text-xs font-semibold">
            <span>★ {hotel.rating}</span>
          </div>
        </div>

        {hotel.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {hotel.amenities.slice(0, 3).map((a) => (
              <span key={a} className="text-[10px] bg-teal-50 text-teal-700 border border-teal-100 rounded-full px-1.5 py-0.5">{a}</span>
            ))}
            {hotel.amenities.length > 3 && (
              <span className="text-[10px] text-gray-400">+{hotel.amenities.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* Price + button */}
      <div className="border-t border-gray-100 px-3 py-2 flex items-center justify-between bg-gray-50">
        <div>
          <div className="text-[10px] text-gray-500">Giá từ / đêm</div>
          <div className="text-sm font-bold text-[#005564]">{formatPrice(hotel.price_per_night_vnd)}</div>
        </div>
        <a
          href={bookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 bg-[#005564] hover:bg-[#004a57] text-white text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
        >
          Đặt phòng <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
}

// --- CARD LIST ---

function CardList({ cards }) {
  if (!cards?.items?.length) return null;

  if (cards.type === 'flights') {
    return (
      <div className="mt-2">
        <p className="text-[11px] text-gray-500 mb-1.5 font-medium">
          ✈️ {cards.from_name} → {cards.to_name} · {cards.date}
        </p>
        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-0.5">
          {cards.items.map((flight) => (
            <FlightCard
              key={flight.flight_number}
              flight={flight}
              fromName={cards.from_name}
              toName={cards.to_name}
            />
          ))}
        </div>
      </div>
    );
  }

  if (cards.type === 'hotels') {
    return (
      <div className="mt-2">
        <p className="text-[11px] text-gray-500 mb-1.5 font-medium">
          🏨 Khách sạn gần {cards.airport_name} · {cards.city}
        </p>
        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-0.5">
          {cards.items.map((hotel) => (
            <HotelCard key={hotel.name} hotel={hotel} />
          ))}
        </div>
      </div>
    );
  }

  return null;
}

// --- BOT MESSAGE ---

function BotMessage({ msg, prevUserMessage }) {
  const lines = msg.text.split('\n').filter(l => l.trim() !== '');
  const isLong = lines.length > COLLAPSED_LINES;
  const [expanded, setExpanded] = useState(false);

  const displayText = isLong && !expanded
    ? lines.slice(0, COLLAPSED_LINES).join('\n')
    : msg.text;

  return (
    <div className="flex justify-start">
      <div className="mr-2 mt-auto mb-1 flex-shrink-0">
        <ChatAvatar />
      </div>

      <div className="max-w-[90%]">
        {/* Bubble */}
        <div className="bg-[#F0F4F8] text-[#333] rounded-2xl rounded-tl-sm px-3.5 py-3 text-[13.5px] shadow-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
            {displayText}
          </ReactMarkdown>

          {isLong && (
            <button
              onClick={() => setExpanded(v => !v)}
              className="flex items-center gap-1 mt-1 text-xs text-teal-600 hover:text-teal-800 font-medium"
            >
              {expanded
                ? <><ChevronUp size={13} /> Thu gọn</>
                : <><ChevronDown size={13} /> Xem thêm ({lines.length - COLLAPSED_LINES} dòng)</>
              }
            </button>
          )}

          {/* Cards rendered inside the bubble */}
          {msg.cards && <CardList cards={msg.cards} />}
        </div>

        {/* Feedback bar */}
        <div className="px-1">
          <FeedbackBar
            msgId={msg.id}
            botResponse={msg.text}
            userMessage={prevUserMessage}
          />
        </div>
      </div>
    </div>
  );
}

// --- MAIN APP ---

const INITIAL_SUGGESTIONS = [
  'Có chuyến bay nào từ Hà Nội đi TP.HCM ngày mai không?',
  'Giá vé Hà Nội - Đà Nẵng hạng economy bao nhiêu?',
  'Quy định hành lý xách tay của Vietnam Airlines?',
  'Khách sạn gần sân bay Nội Bài có những chỗ nào?',
  'Chuyến bay VN200 hôm nay có đúng giờ không?',
];

let msgIdCounter = 0;
const makeMsg = (sender, text, cards = null) => ({ id: ++msgIdCounter, sender, text, cards });

export default function App() {
  const [chatState, setChatState] = useState('closed');
  const [messages, setMessages] = useState([
    makeMsg('bot', 'Xin chào! Tôi là Nemo 👋 — trợ lý AI của Vietnam Airlines.\n\nTôi có thể giúp bạn:\n✈️ Tra cứu chuyến bay\n💰 Xem giá vé\n🧳 Quy định hành lý\n🏨 Khách sạn gần sân bay\n\nBạn cần tôi hỗ trợ gì?')
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(INITIAL_SUGGESTIONS);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, chatState]);

  const getHistory = () => {
    const history = [];
    for (const msg of messages) {
      if (msg.sender === 'user') history.push({ role: 'user', content: msg.text });
      else if (msg.sender === 'bot') history.push({ role: 'assistant', content: msg.text });
    }
    return history;
  };

  const sendMessage = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    const history = getHistory();
    setMessages(prev => [...prev, makeMsg('user', text)]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const botMsg = makeMsg('bot', data.response, data.cards || null);
      setMessages(prev => [...prev, botMsg]);

      // Fetch suggestions based on updated history (run in background)
      const updatedHistory = [
        ...history,
        { role: 'user', content: text },
        { role: 'assistant', content: data.response },
      ];
      fetchSuggestions(updatedHistory);
    } catch {
      setMessages(prev => [
        ...prev,
        makeMsg('bot', '⚠️ Xin lỗi, không thể kết nối đến server. Vui lòng thử lại sau.')
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const fetchSuggestions = async (history) => {
    setLoadingSuggestions(true);
    try {
      const res = await fetch(`${BACKEND_URL}/suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history }),
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.suggestions?.length) setSuggestions(data.suggestions);
    } catch {
      // silent — suggestions are best-effort
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Find the last user message before a given bot message index
  const getPrevUserMessage = (botIndex) => {
    for (let i = botIndex - 1; i >= 0; i--) {
      if (messages[i].sender === 'user') return messages[i].text;
    }
    return '';
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 font-sans overflow-hidden">

      {/* --- LEFT SIDEBAR --- */}
      <div className="w-64 bg-[#005564] text-white flex flex-col relative z-20 shadow-xl h-full">
        <button className="absolute -right-3 top-20 bg-[#568A9B] rounded-full p-1 shadow-md">
          <ChevronLeft size={16} className="text-white" />
        </button>

        <div className="p-4 flex items-center space-x-2 border-b border-[#004a57]">
          <LotusLogo />
          <span className="font-semibold text-lg tracking-wide">Vietnam Airlines</span>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-1">
          <NavItem icon={<Globe size={20} />} label="Khám Phá" />
          <NavItem icon={<Ticket size={20} />} label="Mua vé" />
          <NavItem icon={<Briefcase size={20} />} label="Dịch vụ bổ trợ" />
          <NavItem icon={<Map size={20} />} label="Hành trình" />
          <NavItem icon={<Plane size={20} />} label="Trải nghiệm bay" />
          <NavItem icon={<Star size={20} />} label="Lotusmiles" />
          <NavItem icon={<HelpCircle size={20} />} label="Trợ giúp" />

          <div className="px-4 mt-6">
            <button
              onClick={() => setChatState(chatState === 'closed' ? 'small' : chatState)}
              className="w-full flex items-center space-x-3 bg-[#004a57] border border-[#568A9B] rounded-full px-4 py-2 hover:bg-[#003d47] transition-all shadow-[0_0_10px_rgba(86,138,155,0.5)]"
            >
              <div className="relative">
                <ChatAvatar />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#004a57] rounded-full"></span>
              </div>
              <span className="font-medium text-sm">Chat với Nemo</span>
            </button>
          </div>
        </div>

        <div className="p-4 m-4 bg-[#4A7F8C]/30 rounded-lg backdrop-blur-sm">
          <div className="flex justify-center mb-3">
            <span className="text-[#EAB308] font-serif font-bold text-lg tracking-widest">LOTUSMILES</span>
          </div>
          <div className="space-y-2">
            <button className="w-full bg-[#006C7A] hover:bg-[#005564] py-2 rounded text-sm font-medium transition-colors">Đăng nhập</button>
            <button className="w-full bg-transparent border border-[#568A9B] hover:bg-[#4A7F8C]/50 py-2 rounded text-sm font-medium transition-colors">Đăng ký</button>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 relative flex flex-col h-full">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2070&auto=format&fit=crop")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#002f3a]/80 via-[#002f3a]/40 to-transparent"></div>
        </div>

        <div className="relative z-10 flex justify-end items-center p-6 space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Tìm kiếm" className="pl-10 pr-4 py-2 rounded-full w-64 border-none focus:ring-2 focus:ring-[#005564] outline-none shadow-md" />
          </div>
          <button className="flex items-center space-x-2 bg-[#005564] text-white px-3 py-2 rounded-full shadow-md">
            <div className="w-5 h-5 bg-red-500 rounded-sm flex items-center justify-center overflow-hidden border border-white">
              <span className="text-yellow-400 text-[10px]">★</span>
            </div>
            <span className="text-sm font-medium">VI</span>
          </button>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center px-12">
          <div className="absolute right-12 top-20 text-white text-right space-y-2">
            <p className="text-lg">Tháng 4 - Mùa Hoa Mở Lối</p>
            <h1 className="text-5xl font-bold tracking-wider">ƯU ĐÃI ĐẾN 15%</h1>
            <button className="mt-4 px-6 py-2 border border-white rounded-full hover:bg-white hover:text-[#005564] transition-colors font-medium">Khám phá ngay</button>
          </div>

          <div className="absolute left-12 top-20 space-y-6 text-white/50 text-xl font-bold">
            <div className="text-white text-3xl border-l-2 border-white pl-4 h-8 flex items-center relative -left-[2px]">01</div>
            <div className="pl-4">02</div>
            <div className="pl-4">03</div>
          </div>

          <div className="mt-40 bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-auto overflow-hidden">
            <div className="flex border-b">
              <button className="flex-1 py-4 text-center font-semibold text-[#005564] border-b-2 border-[#005564]">Mua vé</button>
              <button className="flex-1 py-4 text-center text-gray-500 hover:text-gray-700">Quản lý đặt chỗ</button>
              <button className="flex-1 py-4 text-center text-gray-500 hover:text-gray-700">Làm thủ tục</button>
              <button className="flex-1 py-4 text-center text-gray-500 hover:text-gray-700">Trạng thái chuyến bay</button>
              <button className="flex-1 py-4 text-center text-gray-500 hover:text-gray-700">Tra cứu lịch bay</button>
            </div>
            <div className="p-8 flex items-center gap-4">
              <div className="flex-1 border-b pb-2 cursor-pointer">
                <div className="flex items-center text-gray-500 text-sm mb-1">
                  <PlaneTakeoff size={16} className="mr-2" /> Từ
                </div>
                <div className="flex items-end">
                  <span className="text-4xl font-light">HAN</span>
                  <span className="ml-3 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600 border border-teal-200">Hà Nội, Việt Nam</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:bg-gray-100 cursor-pointer border shadow-sm z-10 mx-[-20px]">
                <ArrowRightLeft size={18} />
              </div>
              <div className="flex-1 border-b pb-2 cursor-pointer pl-6">
                <div className="flex items-center text-gray-500 text-sm mb-1">
                  <PlaneLanding size={16} className="mr-2" /> Đến
                </div>
                <div className="text-2xl text-gray-300 font-light mt-2">Chọn điểm đến</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full bg-gradient-to-t from-black/80 to-transparent py-6 px-12">
          <div className="max-w-5xl mx-auto flex justify-between text-white/80 text-xs font-medium text-center">
            <ServiceIcon icon={<Briefcase size={24} />} label="HÀNH LÝ TRẢ TRƯỚC" />
            <ServiceIcon icon={<Armchair size={24} />} label="NÂNG HẠNG GHẾ" />
            <ServiceIcon icon={<ShoppingBag size={24} />} label="MUA SẮM" />
            <ServiceIcon icon={<Building2 size={24} />} label="KHÁCH SẠN & TOUR" />
            <ServiceIcon icon={<Shield size={24} />} label="BẢO HIỂM" />
            <ServiceIcon icon={<LayoutGrid size={24} />} label="CÁC DỊCH VỤ KHÁC" />
          </div>
        </div>
      </div>

      {/* --- CHAT WIDGET --- */}
      {chatState !== 'closed' && (
        <div className={`
          fixed transition-all duration-300 ease-in-out bg-white shadow-2xl flex flex-col z-50
          ${chatState === 'small'
            ? 'bottom-6 right-6 w-96 h-[600px] rounded-xl border border-gray-200'
            : 'inset-0 w-full h-full'
          }
        `}>
          {/* Header */}
          <div className="bg-[#417684] text-white p-3 flex justify-between items-center rounded-t-xl shrink-0">
            <div className="flex items-center space-x-2">
              <LotusLogo />
              <div>
                <span className="font-medium text-lg">Nemo</span>
                <p className="text-xs text-teal-200">AI Assistant · Vietnam Airlines</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {chatState === 'small'
                ? <button onClick={() => setChatState('full')} className="hover:text-gray-300" title="Phóng to"><Maximize2 size={18} /></button>
                : <button onClick={() => setChatState('small')} className="hover:text-gray-300" title="Thu nhỏ"><Minimize2 size={18} /></button>
              }
              <button onClick={() => setChatState('closed')} className="hover:text-gray-300" title="Đóng"><X size={22} /></button>
            </div>
          </div>

          {/* Messages */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4">
            {messages.map((msg, idx) =>
              msg.sender === 'user' ? (
                <div key={msg.id} className="flex justify-end">
                  <div className="max-w-[80%] p-3 text-[14px] whitespace-pre-wrap leading-relaxed shadow-sm bg-[#3C6E7B] text-white rounded-2xl rounded-tr-sm">
                    {msg.text}
                  </div>
                </div>
              ) : (
                <BotMessage
                  key={msg.id}
                  msg={msg}
                  prevUserMessage={getPrevUserMessage(idx)}
                />
              )
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="mr-2 mt-auto mb-1 flex-shrink-0"><ChatAvatar /></div>
                <div className="bg-[#F0F4F8] rounded-2xl rounded-tl-sm p-3 flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-teal-600" />
                  <span className="text-sm text-gray-500">Nemo đang tra cứu...</span>
                </div>
              </div>
            )}
          </div>

          {/* Dynamic suggestions */}
          {!isLoading && suggestions.length > 0 && (
            <div className="px-3 pb-2 border-t border-gray-100 pt-2">
              <p className="text-[10px] text-gray-400 mb-1.5 px-1">
                {loadingSuggestions ? 'Đang cập nhật gợi ý...' : 'Gợi ý câu hỏi'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setInputValue(s);
                      setTimeout(() => inputRef.current?.focus(), 50);
                    }}
                    className="text-xs bg-teal-50 border border-teal-200 text-teal-700 rounded-full px-3 py-1 hover:bg-teal-100 transition-colors text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100 shrink-0">
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi của Quý khách tại đây"
                disabled={isLoading}
                className="w-full pl-4 pr-12 py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm disabled:opacity-60"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="absolute right-3 text-teal-600 hover:text-teal-800 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              </button>
            </div>
            <div className="text-center mt-3 text-[11px] text-gray-500">
              Nemo có thể sai sót, hãy kiểm tra thông tin quan trọng.{' '}
              <a href="#" className="text-blue-500 hover:underline">Điều khoản sử dụng</a>
            </div>
          </div>
        </div>
      )}

      {/* Floating button */}
      {chatState === 'closed' && (
        <button
          onClick={() => setChatState('small')}
          className="fixed bottom-6 right-6 bg-[#005564] text-white rounded-full p-4 shadow-xl hover:bg-[#004a57] transition-colors z-40 flex items-center gap-2"
        >
          <MessageCircle size={24} />
          <span className="text-sm font-medium pr-1">Chat với Nemo</span>
        </button>
      )}
    </div>
  );
}

// --- HELPERS ---

function NavItem({ icon, label }) {
  return (
    <div className="flex items-center space-x-4 px-6 py-3 hover:bg-[#004a57] cursor-pointer transition-colors border-l-4 border-transparent hover:border-[#EAB308]">
      <span className="text-teal-200">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function ServiceIcon({ icon, label }) {
  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer group">
      <div className="text-white group-hover:text-yellow-400 transition-colors">{icon}</div>
      <span className="tracking-wide group-hover:text-yellow-400 transition-colors">{label}</span>
    </div>
  );
}
