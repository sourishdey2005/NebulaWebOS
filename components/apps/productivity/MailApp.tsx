
import React, { useState } from 'react';
import { Mail, Star, Trash2, Send, Archive, Inbox, File, Plus } from 'lucide-react';

export const MailApp: React.FC = () => {
  const [emails] = useState([
    { id: 1, sender: 'Nebula Team', subject: 'Welcome to Nebula OS', preview: 'Thanks for trying out the latest version...', time: '10:30 AM', unread: true },
    { id: 2, sender: 'Google Security', subject: 'Security Alert', preview: 'New sign-in detected on your account...', time: 'Yesterday', unread: false },
    { id: 3, sender: 'Newsletter', subject: 'Weekly Tech Digest', preview: 'Top stories: AI taking over OS development...', time: 'Yesterday', unread: false },
  ]);
  const [selectedEmail, setSelectedEmail] = useState(emails[0]);

  return (
    <div className="flex h-full bg-white text-slate-800">
        {/* Sidebar */}
        <div className="w-48 bg-gray-50 border-r border-gray-200 flex flex-col p-2">
            <button className="flex items-center gap-2 p-3 bg-blue-600 text-white rounded-lg mb-4 hover:bg-blue-700 transition-colors font-medium">
                <Plus size={18} /> Compose
            </button>
            <div className="space-y-1">
                <button className="w-full flex items-center justify-between px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                    <div className="flex items-center gap-3"><Inbox size={16} /> Inbox</div>
                    <span className="text-xs font-bold">1</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm">
                    <Star size={16} /> Starred
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm">
                    <Send size={16} /> Sent
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm">
                    <Archive size={16} /> Archive
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm">
                    <Trash2 size={16} /> Trash
                </button>
            </div>
        </div>

        {/* List */}
        <div className="w-72 border-r border-gray-200 bg-white overflow-y-auto">
            {emails.map(email => (
                <div 
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${selectedEmail.id === email.id ? 'bg-blue-50' : ''} ${email.unread ? 'font-semibold' : ''}`}
                >
                    <div className="flex justify-between mb-1">
                        <span className="text-sm truncate">{email.sender}</span>
                        <span className="text-xs text-gray-500">{email.time}</span>
                    </div>
                    <div className="text-sm mb-1 truncate">{email.subject}</div>
                    <div className="text-xs text-gray-500 truncate font-normal">{email.preview}</div>
                </div>
            ))}
        </div>

        {/* View */}
        <div className="flex-1 flex flex-col bg-white">
            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold mb-2">{selectedEmail.subject}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                            {selectedEmail.sender[0]}
                        </div>
                        <div>
                            <span className="font-bold text-gray-900">{selectedEmail.sender}</span>
                            <span className="text-gray-400 mx-1">&lt;sender@example.com&gt;</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 text-gray-400">
                    <button className="p-2 hover:bg-gray-100 rounded-full"><Star size={18} /></button>
                    <button className="p-2 hover:bg-gray-100 rounded-full"><Archive size={18} /></button>
                    <button className="p-2 hover:bg-gray-100 rounded-full"><Trash2 size={18} /></button>
                </div>
            </div>
            <div className="flex-1 p-8 text-gray-800 leading-relaxed">
                <p>Hi User,</p>
                <br />
                <p>{selectedEmail.preview}</p>
                <p>This is a simulated email client within Nebula OS.</p>
                <br />
                <p>Best,<br/>The Nebula Team</p>
            </div>
        </div>
    </div>
  );
};
