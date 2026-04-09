import { ChevronDown } from 'lucide-react';

function FormLabel({ children }) {
  return <label className="block text-[15px] font-semibold text-gray-200 mb-2">{children}</label>;
}

function TextInput({ placeholder = '', className = '' }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className={`w-full h-12 rounded-lg bg-[#0E141B] border border-[#2B3948] px-4 text-[18px] text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-cyan-500 ${className}`}
    />
  );
}

function SelectLike({ placeholder = '' }) {
  return (
    <div className="h-12 rounded-lg bg-[#0E141B] border border-[#2B3948] px-4 flex items-center justify-between text-gray-200">
      <span className="text-[18px] text-gray-400">{placeholder}</span>
      <ChevronDown size={20} className="text-sky-400" />
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <section className="bg-[#10161E] border border-[#18212B] rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#1E2A36] bg-[#0E141B]">
        <h2 className="text-[38px] leading-[1.1] md:text-[40px] font-bold tracking-tight text-gray-100">{title}</h2>
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

function FlightSummaryCard() {
  return (
    <div className="bg-[#10161E] border border-[#18212B] rounded-xl p-4 md:p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[30px] md:text-[34px] font-bold text-gray-100">Tóm tắt chuyến bay</h3>
        <button className="text-sky-400 text-[16px] font-semibold hover:text-sky-300">Chi tiết</button>
      </div>

      <div className="bg-[#0F151C] border border-[#1B2531] rounded-xl p-4">
        <p className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-[#1A242E] text-gray-300 mb-3">Chuyến bay đi</p>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div>
            <p className="text-[30px] md:text-[34px] font-bold text-gray-100 leading-tight">TP HCM (SGN)</p>
            <p className="text-[15px] text-gray-400">Thứ 6, 10 thg 4 2026</p>
            <p className="text-[26px] md:text-[30px] font-semibold text-gray-200">18:25</p>
          </div>

          <div className="text-center min-w-[120px]">
            <p className="text-gray-300 text-[18px] font-semibold">1h 40m</p>
            <p className="text-gray-300 text-[16px]">Bay thẳng</p>
            <div className="w-full h-[2px] bg-[#2D3A47] my-2" />
          </div>

          <div className="text-right">
            <p className="text-[30px] md:text-[34px] font-bold text-gray-100 leading-tight">Bangkok (BKK)</p>
            <p className="text-[15px] text-gray-400">Thứ 6, 10 thg 4 2026</p>
            <p className="text-[26px] md:text-[30px] font-semibold text-gray-200">20:05</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-[18px] text-gray-200 font-semibold">Vietnam Airlines</p>
          <p className="text-[16px] text-gray-400">Nguyên bản · Phổ thông</p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="inline-flex items-center rounded-full border border-emerald-500/50 px-3 py-1 text-emerald-300 text-xs font-semibold">CÓ ÁP DỤNG ĐỔI LỊCH BAY</span>
            <span className="inline-flex items-center rounded-full border border-gray-500/50 px-3 py-1 text-gray-300 text-xs font-semibold">HOÀN VÉ TÙY THUỘC VÀO CHÍNH SÁCH CỦA HÃNG HÀNG KHÔNG</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TotalCard() {
  return (
    <div className="bg-[#10161E] border border-[#18212B] rounded-xl p-4 md:p-5 mt-4">
      <h3 className="text-[30px] md:text-[34px] font-bold text-gray-100 mb-3">Tóm tắt</h3>
      <div className="border-t border-[#2A3643] pt-3 flex items-center justify-between">
        <p className="text-[34px] md:text-[38px] font-semibold text-gray-200">Giá bạn trả</p>
        <p className="text-[34px] md:text-[38px] font-bold text-orange-400">21.606.753 VND</p>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,#123044_0%,#0A121A_55%)] text-white">
      <div className="max-w-[1600px] mx-auto px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
        <div className="grid grid-cols-1 gap-4 md:gap-6 xl:pr-[430px]">
          <div className="space-y-4 md:space-y-6">
            <SectionCard title="Thông tin liên hệ (nhận vé/phiếu thanh toán)">
              <div>
                <FormLabel>Họ tên<span className="text-red-500">*</span></FormLabel>
                <TextInput />
                <p className="text-[15px] text-gray-400 mt-2">Người Việt: nhập Tên đệm + Tên chính + Họ. Người nước ngoài: nhập Tên + Họ.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                <div>
                  <FormLabel>Điện thoại di động<span className="text-red-500">*</span></FormLabel>
                  <div className="grid grid-cols-[140px_1fr] gap-2">
                    <SelectLike placeholder="🇻🇳 +84" />
                    <TextInput />
                  </div>
                  <p className="text-[15px] text-gray-400 mt-2">VD: +84 901234567 trong đó (+84) là mã quốc gia và 901234567 là số di động</p>
                </div>

                <div>
                  <FormLabel>Email<span className="text-red-500">*</span></FormLabel>
                  <TextInput placeholder="VD: email@example.com" />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Thông tin hành khách">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormLabel>Giới tính<span className="text-red-500">*</span></FormLabel>
                  <SelectLike placeholder="" />
                </div>
                <div />

                <div>
                  <FormLabel>Họ (vd: NGUYEN)<span className="text-red-500">*</span></FormLabel>
                  <TextInput />
                  <p className="text-[15px] text-gray-400 mt-2">như trên CMND (không dấu)</p>
                </div>

                <div>
                  <FormLabel>Chữ đệm và tên (vd: VAN ANH)<span className="text-red-500">*</span></FormLabel>
                  <TextInput />
                  <p className="text-[15px] text-gray-400 mt-2">như trên CMND (không dấu)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                <div>
                  <FormLabel>Ngày sinh<span className="text-red-500">*</span></FormLabel>
                  <div className="grid grid-cols-3 gap-2">
                    <TextInput placeholder="DD" />
                    <TextInput placeholder="MMMM" />
                    <TextInput placeholder="YYYY" />
                  </div>
                  <p className="text-[15px] text-gray-400 mt-2">Hành khách người lớn (trên 12 tuổi)</p>
                </div>

                <div>
                  <FormLabel>Quốc tịch<span className="text-red-500">*</span></FormLabel>
                  <SelectLike placeholder="" />
                </div>
              </div>
            </SectionCard>
          </div>

          <aside className="h-fit xl:fixed xl:top-4 xl:right-4 xl:w-[620px] xl:origin-top-right xl:scale-[0.65] xl:z-20">
            <FlightSummaryCard />
            <TotalCard />
            <div className="mt-4">
              <button className="w-full h-12 px-6 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#08202E] text-[20px] font-bold transition-colors">
                Đồng ý đặt vé
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
