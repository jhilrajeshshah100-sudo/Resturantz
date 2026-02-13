
import React, { useState } from 'react';

const ProfileScreen: React.FC = () => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('visa');

  const billItems = [
    { name: "Estate Cabernet '18", desc: "2 Bottles • Pre-booked", price: 11500 },
    { name: "Extra Brunch Ticket", desc: "Sunday Farewell • Guest +1", price: 3750 }
  ];

  const subtotal = billItems.reduce((acc, item) => acc + item.price, 0);
  const gst = Math.round(subtotal * 0.18);
  const serviceCharge = 500;
  const total = subtotal + gst + serviceCharge;

  return (
    <div className="px-6 py-12 pb-32 min-h-screen">
      <header className="flex flex-col items-center mb-12">
        <div className="relative mb-4">
          <img 
            src="https://picsum.photos/seed/me/200/200" 
            alt="My Profile" 
            className="w-32 h-32 rounded-full border-4 border-primary p-1 object-cover shadow-2xl" 
          />
          <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
            <span className="material-icons-round text-sm">edit</span>
          </button>
        </div>
        <h1 className="font-display text-3xl text-navy-900 dark:text-white">Jhil Shah</h1>
        <p className="text-gray-500 text-[10px] uppercase font-black tracking-[0.3em] mt-2">Groom's Side • Shah Parivaar</p>
      </header>

      <div className="space-y-8">
        {/* Your Cart & Checkout Flow */}
        <section className="bg-white dark:bg-navy-800 rounded-[40px] p-8 shadow-xl border border-orange-50 dark:border-navy-900/50">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-[10px] uppercase text-gray-400 tracking-[0.2em]">Wedding Folio</h3>
            <span className="bg-orange-100 text-orange-600 text-[9px] font-black px-3 py-1 rounded-full uppercase">Pending Dues</span>
          </div>

          <div className="space-y-6 mb-8">
            {billItems.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-navy-50 dark:bg-navy-900 rounded-2xl flex items-center justify-center overflow-hidden">
                  <span className="material-icons-round text-primary/60">{i === 0 ? 'wine_bar' : 'confirmation_number'}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-navy-900 dark:text-white">{item.name}</h4>
                  <p className="text-[10px] text-gray-500 font-medium">{item.desc}</p>
                </div>
                <span className="text-sm font-display text-primary">₹{item.price.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-6 border-t border-gray-50 dark:border-white/5">
            <div className="flex justify-between text-xs font-medium text-gray-400">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-400">
              <span>GST (18%)</span>
              <span>₹{gst.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-400">
              <span>Service Charge</span>
              <span>₹{serviceCharge.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="text-xs font-black uppercase text-navy-900 dark:text-white tracking-widest">Total Amount</span>
              <span className="text-2xl font-display text-primary">₹{total.toLocaleString()}</span>
            </div>
          </div>

          <button 
            onClick={() => setIsCheckingOut(!isCheckingOut)}
            className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] mt-8 shadow-xl transition-all active:scale-95 ${
              isCheckingOut 
              ? 'bg-navy-900 text-white' 
              : 'bg-primary text-white shadow-primary/20'
            }`}
          >
            {isCheckingOut ? 'Cancel Checkout' : 'Proceed to Payment'}
          </button>
        </section>

        {/* Payment Methods Section */}
        {isCheckingOut && (
          <section className="animate-fade-in space-y-6">
            <div className="px-2">
              <h3 className="font-black text-[10px] uppercase text-gray-400 tracking-[0.2em] mb-4">Select Payment Method</h3>
              
              <div className="space-y-4">
                {/* UPI Options */}
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setSelectedPayment('gpay')}
                    className={`p-4 rounded-3xl border transition-all flex flex-col items-center gap-2 ${
                      selectedPayment === 'gpay' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-100 dark:border-white/5 bg-white dark:bg-navy-800'
                    }`}
                  >
                    <img src="https://www.gstatic.com/images/branding/googlepay/2x/googlepay_mark_800dp.png" alt="GPay" className="h-6 object-contain" />
                    <span className="text-[10px] font-bold text-gray-500">Google Pay</span>
                  </button>
                  <button 
                    onClick={() => setSelectedPayment('phonepe')}
                    className={`p-4 rounded-3xl border transition-all flex flex-col items-center gap-2 ${
                      selectedPayment === 'phonepe' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-100 dark:border-white/5 bg-white dark:bg-navy-800'
                    }`}
                  >
                    <div className="h-6 flex items-center justify-center">
                       <span className="material-icons-round text-purple-600">account_balance_wallet</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500">PhonePe</span>
                  </button>
                </div>

                {/* Card Option */}
                <div 
                  onClick={() => setSelectedPayment('visa')}
                  className={`p-6 rounded-[32px] border relative overflow-hidden transition-all cursor-pointer ${
                    selectedPayment === 'visa' ? 'border-primary ring-1 ring-primary' : 'border-transparent'
                  }`}
                >
                  <div className="absolute inset-0 bg-navy-900"></div>
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-10">
                      <span className="material-icons-round text-white/40">contactless</span>
                      <span className="text-white/60 font-bold italic tracking-tighter">VISA</span>
                    </div>
                    <div>
                      <p className="text-white/40 text-[9px] uppercase font-black tracking-widest mb-1">Jhil Shah</p>
                      <div className="flex justify-between items-end">
                        <p className="text-white text-lg font-display tracking-widest">•••• •••• •••• 4421</p>
                        <p className="text-white/60 text-[10px] font-bold">09/26</p>
                      </div>
                    </div>
                  </div>
                  {selectedPayment === 'visa' && (
                    <div className="absolute top-4 right-4 text-primary">
                      <span className="material-icons-round">check_circle</span>
                    </div>
                  )}
                </div>

                {/* Net Banking */}
                <button 
                  onClick={() => setSelectedPayment('netbanking')}
                  className={`w-full p-6 rounded-3xl border flex items-center justify-between transition-all ${
                    selectedPayment === 'netbanking' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-100 dark:border-white/5 bg-white dark:bg-navy-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                      <span className="material-icons-round">account_balance</span>
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-black uppercase tracking-widest text-navy-900 dark:text-white">Net Banking</h4>
                      <p className="text-[10px] text-gray-500">HDFC, ICICI, SBI & others</p>
                    </div>
                  </div>
                  <span className="material-icons-round text-gray-300">chevron_right</span>
                </button>
              </div>

              <button className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] mt-10 shadow-2xl shadow-primary/30 active:scale-95 transition-all">
                Authorize ₹{total.toLocaleString()}
              </button>
            </div>
          </section>
        )}

        {/* Programme Section */}
        <section className="bg-white dark:bg-navy-800 rounded-[40px] p-8 shadow-sm border border-gray-100 dark:border-navy-900/50">
          <h3 className="font-black text-[10px] uppercase text-gray-400 mb-6 tracking-[0.2em]">Your Itinerary</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <span className="material-icons-round">brush</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-navy-900 dark:text-white">Mehendi Ceremony</h4>
                <p className="text-[10px] text-gray-500">Today, 4:00 PM • The Courtyard</p>
              </div>
              <span className="material-icons-round text-gray-300">chevron_right</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <span className="material-icons-round">music_note</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-navy-900 dark:text-white">The Sangeet Night</h4>
                <p className="text-[10px] text-gray-500">Today, 8:00 PM • Ballroom</p>
              </div>
              <span className="material-icons-round text-gray-300">chevron_right</span>
            </div>
          </div>
        </section>

        {/* Settings */}
        <section className="bg-white dark:bg-navy-800 rounded-[40px] p-8 shadow-sm border border-gray-100 dark:border-navy-900/50">
          <h3 className="font-black text-[10px] uppercase text-gray-400 mb-6 tracking-[0.2em]">App Settings</h3>
          <ul className="space-y-6">
            <li className="flex justify-between items-center text-sm font-medium text-navy-900 dark:text-white">
              <div className="flex items-center gap-3">
                <span className="material-icons-round text-gray-400">notifications</span>
                <span>Push Notifications</span>
              </div>
              <div className="w-10 h-5 bg-primary rounded-full relative shadow-inner">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </li>
            <li className="flex items-center gap-3 text-red-500 text-sm font-bold pt-4 cursor-pointer group">
              <span className="material-icons-round group-hover:-translate-x-1 transition-transform">logout</span>
              <span>Leave the App</span>
            </li>
          </ul>
        </section>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ProfileScreen;
