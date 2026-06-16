import { Video, VideoOff, Mic, MicOff, Monitor, Phone, PhoneOff, Video as CamIcon } from 'lucide-react';
import {  Users } from 'lucide-react';
import { Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw} from 'lucide-react';
import { FileText, Upload, CheckCircle, Clock } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Link } from 'react-router-dom';
import { Bell, Calendar, TrendingUp, AlertCircle, PlusCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CollaborationRequestCard } from '../../components/collaboration/CollaborationRequestCard';
import { InvestorCard } from '../../components/investor/InvestorCard';
import { useAuth } from '../../context/AuthContext';
import { CollaborationRequest } from '../../types';
import { getRequestsForEntrepreneur } from '../../data/collaborationRequests';
import { investors } from '../../data/users';

export const EntrepreneurDashboard: React.FC = () => {
  // Milestone 6: Security States
  const [password, setPassword] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState("entrepreneur");

  // Helper to calculate password strength
  const getPasswordStrength = () => {
    if (!password) return { text: "Enter Password", color: "bg-gray-200", width: "w-0", textColor: "text-gray-400" };
    if (password.length < 6) return { text: "Weak", color: "bg-rose-500", width: "w-1/3", textColor: "text-rose-600" };
    if (password.length < 10) return { text: "Medium", color: "bg-amber-500", width: "w-2/3", textColor: "text-amber-600" };
    return { text: "Strong & Secure", color: "bg-emerald-500", width: "w-full", textColor: "text-emerald-600" };
  };
  const strength = getPasswordStrength();
  const { user } = useAuth();
  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>([]);
  const [recommendedInvestors] = useState(investors.slice(0, 3));
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  useEffect(() => {
    if (user) {
      // Load collaboration requests
      const requests = getRequestsForEntrepreneur(user.id);
      setCollaborationRequests(requests);
    }
  }, [user]);
  
  const handleRequestStatusUpdate = (requestId: string, status: 'accepted' | 'rejected') => {
    setCollaborationRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === requestId ? { ...req, status } : req
      )
    );
  };
  
  if (!user) return null;
  
  const pendingRequests = collaborationRequests.filter(req => req.status === 'pending');
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
          <p className="text-gray-600">Here's what's happening with your startup today</p>
        </div>
        
        <Link to="/investors">
          <Button
            leftIcon={<PlusCircle size={18} />}
          >
            Find Investors
          </Button>
        </Link>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary-50 border border-primary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Bell size={20} className="text-primary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-700">Pending Requests</p>
                <h3 className="text-xl font-semibold text-primary-900">{pendingRequests.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-secondary-50 border border-secondary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 rounded-full mr-4">
                <Users size={20} className="text-secondary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-700">Total Connections</p>
                <h3 className="text-xl font-semibold text-secondary-900">
                  {collaborationRequests.filter(req => req.status === 'accepted').length}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-accent-50 border border-accent-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-accent-100 rounded-full mr-4">
                <Calendar size={20} className="text-accent-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-accent-700">Upcoming Meetings</p>
                <h3 className="text-xl font-semibold text-accent-900">2</h3>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-success-50 border border-success-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <TrendingUp size={20} className="text-success-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-success-700">Profile Views</p>
                <h3 className="text-xl font-semibold text-success-900">24</h3>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collaboration requests */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Collaboration Requests</h2>
              <Badge variant="primary">{pendingRequests.length} pending</Badge>
            </CardHeader>
            <CardBody>
              {collaborationRequests.length > 0 ? (
                <div className="space-y-4">
                  {collaborationRequests.map(request => (
                    <CollaborationRequestCard
                      key={request.id}
                      request={request}
                      onStatusUpdate={handleRequestStatusUpdate}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <AlertCircle size={24} className="text-gray-500" />
                  </div>
                  <p className="text-gray-600">No collaboration requests yet</p>
                  <p className="text-sm text-gray-500 mt-1">When investors are interested in your startup, their requests will appear here</p>
                </div>
              )}
            </CardBody>
          </Card>
          {/* Milestone 3: Video Calling Section */}
<div className="bg-white p-6 rounded-xl shadow-sm mt-6">
  <div className="flex justify-between items-center mb-4">
    <div>
      <h3 className="text-lg font-semibold text-gray-900">Virtual Meeting Room</h3>
      <p className="text-xs text-gray-500 mt-0.5">Connect instantly with investors via WebRTC Mock</p>
    </div>
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isInCall ? 'bg-green-100 text-green-800 animate-pulse' : 'bg-gray-100 text-gray-800'}`}>
      {isInCall ? '● Live' : 'Disconnected'}
    </span>
  </div>

  {/* Video Screen Simulation */}
  <div className="relative w-full h-64 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100 shadow-inner">
    {isInCall ? (
      <>
        {/* Remote Stream Mock (Investor View) */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-slate-800">
          {isScreenSharing ? (
            <div className="text-center flex flex-col items-center">
              <Monitor className="w-10 h-10 text-primary-400 mb-2 animate-bounce" />
              <p className="text-xs text-primary-300 font-medium">You are sharing your screen...</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-2 shadow-md">MR</div>
              <p className="text-sm font-semibold text-white">Michael Rodriguez (Investor)</p>
              <p className="text-xs text-gray-400">Streaming active...</p>
            </div>
          )}
        </div>

        {/* Local Stream Mock (Your Small Cam View) */}
        {!isVideoOff && (
          <div className="absolute bottom-3 right-3 w-24 h-32 bg-slate-700 rounded-lg border-2 border-white shadow-lg flex flex-col items-center justify-center overflow-hidden">
            <CamIcon className="w-6 h-6 text-gray-400 mb-1" />
            <span className="text-[10px] text-white font-medium">Sarah (You)</span>
          </div>
        )}
      </>
    ) : (
      <div className="text-center p-6 flex flex-col items-center">
        <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-3">
          <Video className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-gray-400">No active meeting video feed</p>
      </div>
    )}
  </div>

  {/* Control Buttons Panel */}
  <div className="flex justify-center items-center gap-3 mt-4">
    {isInCall ? (
      <>
        {/* Audio Toggle */}
        <button 
          onClick={() => setIsMuted(!isMuted)} 
          className={`p-2.5 rounded-full border transition-all ${isMuted ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
          title={isMuted ? "Unmute Mic" : "Mute Mic"}
        >
          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Video Toggle */}
        <button 
          onClick={() => setIsVideoOff(!isVideoOff)} 
          className={`p-2.5 rounded-full border transition-all ${isVideoOff ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
          title={isVideoOff ? "Turn Camera On" : "Turn Camera Off"}
        >
          {isVideoOff ? <VideoOff className="w-4 h-4" /> : <CamIcon className="w-4 h-4" />}
        </button>

        {/* Screen Share */}
        <button 
          onClick={() => setIsScreenSharing(!isScreenSharing)} 
          className={`p-2.5 rounded-full border transition-all ${isScreenSharing ? 'bg-primary-50 border-primary-200 text-primary-600' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
          title="Share Screen"
        >
          <Monitor className="w-4 h-4" />
        </button>

        {/* End Call Button */}
        <button 
          onClick={() => {
            setIsInCall(false);
            setIsScreenSharing(false);
          }} 
          className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-xl text-xs transition-colors shadow-sm ml-2 flex items-center gap-1.5"
        >
          <PhoneOff className="w-3.5 h-3.5" /> End Call
        </button>
      </>
    ) : (
      /* Start Call Button */
      <button 
        onClick={() => setIsInCall(true)} 
        className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-5 py-2.5 rounded-xl text-xs transition-colors shadow-sm flex items-center gap-2"
      >
        <Phone className="w-4 h-4" /> Start Video Call (Investor Room)
      </button>
    )}
  </div>
</div>
           <div className="bg-white p-6 rounded-xl shadow-sm mt-6">
  <div className="flex justify-between items-center mb-4">
    <div>
      <h3 className="text-lg font-semibold text-gray-900">Meeting Scheduling Calendar</h3>
      <p className="text-xs text-gray-500 mt-0.5">Manage availability slots & confirmed meetings</p>
    </div>
    <button 
      onClick={() => {
        const title = prompt("Enter availability slot title (e.g., 'Available for Mentorship'):");
        if (title) alert(`Availability slot '${title}' added successfully!`);
      }}
      className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors shadow-sm"
    >
      + Add Availability Slot
    </button>
  </div>

  <FullCalendar
    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
    initialView="dayGridMonth"
    headerToolbar={{
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek'
    }}
    editable={true}
    selectable={true}
    selectMirror={true}
    dayMaxEvents={true}
    contentHeight={320}
    
    // Requirement 3: Display confirmed meetings on dashboard
    initialEvents={[
      { 
        id: '1', 
        title: 'Confirmed: TechWave AI Investment Discussion', 
        start: new Date().toISOString().split('T')[0] + 'T10:00:00',
        end: new Date().toISOString().split('T')[0] + 'T11:00:00',
        backgroundColor: '#10b981', // Green for confirmed
        borderColor: '#10b981'
      },
      { 
        id: '2', 
        title: 'Confirmed: Jennifer Lee Sync', 
        start: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T14:30:00',
        backgroundColor: '#10b981',
        borderColor: '#10b981'
      }
    ]}

    // Requirement 1: Modify/Add slot on click
    select={(selectInfo) => {
      const title = prompt('Send Meeting Request / Add Availability Slot:');
      let calendarApi = selectInfo.view.calendar;
      calendarApi.unselect();

      if (title) {
        calendarApi.addEvent({
          id: String(Date.now()),
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay,
          backgroundColor: '#3b82f6', // Blue for requests/slots
          borderColor: '#3b82f6'
        });
        alert(`Meeting request for "${title}" sent / slot saved!`);
      }
    }}

    // Requirement 2: Accept/Decline / Action on click
    eventClick={(clickInfo) => {
      const action = confirm(`Meeting: "${clickInfo.event.title}"\n\nClick OK to Accept/Keep, or Cancel to Decline/Delete.`);
      if (!action) {
        clickInfo.event.remove();
        alert('Meeting request declined and removed.');
      } else {
        alert('Meeting details viewed/confirmed.');
      }
    }}
  />
</div>
{/* Milestone 5: Payment Section (Refined High-Visibility UI) */}
        <div className="bg-white p-6 rounded-xl shadow-sm mt-6 border border-gray-100">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-indigo-600" />
              <div className="relative group cursor-help">
  <h3 className="text-base font-semibold text-gray-900 tracking-tight flex items-center gap-1.5">
    Financial Ledger
    <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full font-bold">Guide 💡</span>
  </h3>
  <p className="text-xs text-gray-500">Track escrow deposits and investment rounds</p>
  
  {/* Walkthrough Tooltip Box */}
  <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-gray-900 text-white text-[11px] p-3 rounded-lg shadow-xl z-50 w-64 pointer-events-none transition-all border border-gray-800">
    <p className="font-bold text-indigo-400 mb-1">➔ Step 1: Financial Hub</p>
    <p className="text-gray-300 leading-relaxed">Yahan aap real-time wallet balance dekh sakte hain, mock deposits simulate kar sakte hain, aur transaction history check kar sakte hain.</p>
  </div>
</div>
            </div>
            {/* Wallet Balance Display */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2 text-right">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Wallet Balance</span>
              <span className="text-lg font-bold text-gray-900">$1,250,000</span>
            </div>
          </div>

          {/* Action Simulation Buttons */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button 
              onClick={() => alert("Simulation: Initiating secure deposit channel...")}
              className="flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors shadow-sm"
            >
              <ArrowDownLeft className="w-3.5 h-3.5" /> Deposit
            </button>
            <button 
              onClick={() => alert("Simulation: Setting up secure withdrawal routing...")}
              className="flex items-center justify-center gap-1.5 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium py-2 px-3 border border-gray-200 rounded-lg transition-all"
            >
              <ArrowUpRight className="w-3.5 h-3.5" /> Withdraw
            </button>
            <button 
              onClick={() => alert("Simulation Mock Flow: Investor 'Robert Torres' triggered a $500,000 Milestone Seed Transfer!")}
              className="flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold py-2 px-3 border border-indigo-200/60 rounded-lg transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Trigger Deal Flow
            </button>
          </div>

          {/* Option 2: Transaction History Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Sender / Receiver</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {[
                  { party: "TechWave AI Round (Robert T.)", type: "Incoming", amount: "+$500,000", status: "Success", color: "text-emerald-700 bg-emerald-100/80 border-emerald-300" },
                  { party: "Legal Escrow Verification", type: "Outgoing", amount: "-$12,500", status: "Success", color: "text-emerald-700 bg-emerald-100/80 border-emerald-300" },
                  { party: "Nexus Seed Milestone B", type: "Incoming", amount: "+$750,000", status: "Pending", color: "text-amber-800 bg-amber-100 border-amber-300" },
                ].map((tx, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 font-medium text-gray-800">
                      <div className="font-semibold text-gray-900">{tx.party}</div>
                      <span className="text-[10px] text-gray-400 font-normal">{tx.type}</span>
                    </td>
                    <td className={`py-3 font-bold text-sm ${tx.amount.startsWith('+') ? 'text-emerald-600' : 'text-gray-700'}`}>
                      {tx.amount}
                    </td>
                    <td className="py-3 text-right">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${tx.color} shadow-sm`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
       
        {/* Recommended investors */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Recommended Investors</h2>
              <Link to="/investors" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </CardHeader>
            
            <CardBody className="space-y-4">
              {recommendedInvestors.map(investor => (
                <InvestorCard
                  key={investor.id}
                  investor={investor}
                  showActions={false}
                />
              ))}
            </CardBody>
          </Card>
          {/* Milestone 4: Document Processing Chamber (New Refined Code) */}
        <div className="bg-white p-6 rounded-xl shadow-sm mt-6 border border-gray-100/80">
          {/* Header Section */}
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-semibold text-gray-900 tracking-tight">Document Chamber</h3>
              <p className="text-xs text-gray-500">Manage deals, termsheets & contracts</p>
            </div>
          </div>

          {/* Upgraded Documents List with Perfect Centering */}
          <div className="space-y-3">
            {[
              { 
                name: "Seed_Funding_TermSheet_TechWave.pdf", 
                status: "In Review", 
                color: "bg-amber-50 text-amber-800 border-amber-200/60",
                icon: <Clock className="w-3 h-3 text-amber-600 flex-shrink-0" />
              },
              { 
                name: "NDA_Agreement_Michael_Rodriguez.pdf", 
                status: "Signed", 
                color: "bg-green-50 text-green-800 border-green-200/60",
                icon: <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
              },
            ].map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-2.5 bg-gray-50/60 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 overflow-hidden mr-3">
                  <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-xs font-medium text-gray-700 truncate">{doc.name}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1.5 border ${doc.color} flex-shrink-0`}>
                  {doc.icon}
                  {doc.status}
                </span>
              </div>
            ))}
          </div>

          {/* Enhanced Upload Area */}
          <div className="mt-4 p-5 border-2 border-dashed border-gray-200 rounded-xl text-center hover:border-indigo-500 hover:bg-indigo-50/30 transition-all duration-200 cursor-pointer group">
            <Upload className="w-5 h-5 text-gray-400 mx-auto mb-2 group-hover:text-indigo-500 transition-colors" />
            <p className="text-xs font-semibold text-gray-600 group-hover:text-indigo-600 transition-colors">Click to upload contract or PDF</p>
            <p className="text-[10px] text-gray-400 mt-1">PDF, DOCX up to 10MB</p>
          </div>

          {/* E-Signature Pad with Improved Text Visibility */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <label className="text-xs font-semibold text-gray-700 block mb-2">E-Signature Mockup Pad</label>
            <div className="w-full h-20 bg-gray-50/80 border border-gray-200 rounded-xl flex items-center justify-center relative group overflow-hidden">
              <span className="text-[11px] text-gray-500 font-medium px-4 text-center group-hover:opacity-0 transition-opacity">
                Click inside this container to simulate secure digital signature
              </span>
              <button 
                onClick={() => alert("Document digitally signed with encrypted E-Signature token successfully!")}
                className="absolute hidden group-hover:flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white text-[11px] font-medium px-4 py-2 rounded-lg transition-all shadow-md active:scale-95"
              >
                Sign Document Securely
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
      {/* Milestone 6: Security & Access Gateway (Premium Polish) */}
        <div className="bg-white p-6 rounded-xl shadow-sm mt-6 border border-gray-100 col-span-full">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <div className="relative group cursor-help">
  <h3 className="text-base font-semibold text-gray-900 tracking-tight flex items-center gap-1.5">
    Security & Access Gateway
    <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full font-bold">Guide </span>
  </h3>
  <p className="text-xs text-gray-500">Manage credentials & simulation layers</p>
  
  {/* Walkthrough Tooltip Box */}
  <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-gray-900 text-white text-[11px] p-3 rounded-lg shadow-xl z-50 w-64 pointer-events-none transition-all border border-gray-800">
    <p className="font-bold text-rose-400 mb-1">➔ Step 2: Security Validation</p>
    <p className="text-gray-300 leading-relaxed">Yahan user password strength audit check kar sakta hy, 2FA OTP simulation test kar sakta hy, aur role access toggle kar sakta hy.</p>
  </div>
</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Live Password Audit */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Live Password Audit</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Type mock password..." 
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg pl-3 pr-20 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <span className={`absolute right-3 top-2.5 text-[10px] font-bold ${strength.textColor}`}>
                  {strength.text}
                </span>
              </div>
              {/* Progress Bar Container */}
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-1">
                <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`}></div>
              </div>
            </div>

            {/* Multi-Step 2FA Gateway */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Multi-Step 2FA Gateway</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 2FA Code (e.g. 76589)" 
                  className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button 
                  type="button"
                  onClick={() => alert(otp === "76589" ? "2FA Verified Successfully!" : "Invalid Simulation Code.")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 rounded-lg transition-colors shadow-sm"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>

          {/* Persona Sandbox */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-2">Live Persona Sandbox</label>
            <select 
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full md:w-64 text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 text-gray-700 font-medium transition-colors"
            >
              <option value="entrepreneur">Entrepreneur Workspace (Active)</option>
              <option value="investor">Investor Monitor View</option>
            </select>
          </div>
        </div>

    </div>
  );
};
