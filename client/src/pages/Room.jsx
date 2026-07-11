import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api.js";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import socket from "../services/socket";
import { useAuth } from "../context/AuthContext";

function Room() {
    const { roomId } = useParams();
    const { user } = useAuth();

    const [usersCount, setUsersCount] = useState(1);
    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState("// Start coding...");
    const [connected, setConnected] = useState(false);

    // AI States
    const [review, setReview] = useState("");
    const [loadingReview, setLoadingReview] = useState(false);

    // Chat & UI States
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState("ai"); // "ai" or "chat"

    // Refs for chat auto-scrolling and input focus
    const messagesEndRef = useRef(null);
    const chatInputRef = useRef(null);

    // Auto-scroll & Auto-focus effect
    useEffect(() => {
        if (activeTab === "chat") {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

            // Auto-focus the chat input after a brief delay to ensure it's rendered
            setTimeout(() => {
                chatInputRef.current?.focus();
            }, 100);
        }
    }, [messages, activeTab]);

    useEffect(() => {
        socket.connect();

        socket.on("connect", () => {
            setConnected(true);
            socket.emit("join-room", roomId);
        });

        socket.on("users-count", (count) => {
            setUsersCount(count);
        });

        socket.on("receive-code", (incomingCode) => {
            setCode(incomingCode);
        });

        socket.on("receive-language", (incomingLanguage) => {
            setLanguage(incomingLanguage);
        });

        socket.on("receive-chat-message", (chatMessage) => {
            setMessages((prev) => {
                const newMessages = [...prev, chatMessage];
                if (newMessages.length > 100) return newMessages.slice(newMessages.length - 100);
                return newMessages;
            });
        });

        socket.on("disconnect", () => {
            setConnected(false);
        });

        const fetchRoom = async () => {
            try {
                const response = await api.get(`/rooms/${roomId}`);

                setCode(
                    response.data.code ||
                    "// Start coding..."
                );

                setLanguage(
                    response.data.language ||
                    "javascript"
                );

                setMessages(
                    response.data.messages || []
                );

            } catch (error) {
                console.error(error);
            }
        };

        fetchRoom();

        return () => {

            socket.off("connect");

            socket.off("disconnect");

            socket.off("users-count");

            socket.off("receive-code");

            socket.off("receive-language");

            socket.off("receive-chat-message");

            socket.disconnect();

        };
    }, [roomId]);

    useEffect(() => {
        const timeout = setTimeout(async () => {
            try {
                await api.put(`/rooms/${roomId}/code`, { code });
            } catch (error) {
                console.error(error);
            }
        }, 2000);
        return () => clearTimeout(timeout);
    }, [code, roomId]);

    useEffect(() => {
        const timeout = setTimeout(async () => {
            try {
                await api.put(`/rooms/${roomId}/language`, { language });
            } catch (error) {
                console.error(error);
            }
        }, 1000);
        return () => clearTimeout(timeout);
    }, [language, roomId]);

    const handleLanguageChange = (e) => {
        const selectedLanguage = e.target.value;
        setLanguage(selectedLanguage);
        socket.emit("language-change", {
            roomId,
            language: selectedLanguage,
        });
    };

    const handleReview = async () => {
        try {
            setLoadingReview(true);
            const response = await api.post("/ai/review", { code, language });
            setReview(response.data.review);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingReview(false);
        }
    };

    const copyRoomId = () => {
        navigator.clipboard.writeText(roomId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const sendMessage = () => {
        if (!message.trim()) return;

        socket.emit(
            "send-chat-message",
            {
                roomId,
                sender: user?.username || "Anonymous",
                senderId: user?._id,
                avatar: user?.avatar || "",
                message
            }
        );

        setMessage("");
    };

    const getInitials = (name) => {
        if (!name) return "U";
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return parts[0][0].toUpperCase();
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans relative selection:bg-blue-500/30">
            {/* Minimalist Dark Header */}
            <header className="relative z-10 flex items-center justify-between px-6 py-4 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800">
                <div className="flex items-center gap-5">
                    <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                        DevMate AI
                    </h1>
                    <div className="h-5 w-[1px] bg-zinc-800 hidden sm:block"></div>

                    {/* Room ID & Copy Button */}
                    <div className="hidden sm:flex items-center gap-3">
                        <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Room</span>
                        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-md overflow-hidden shadow-inner">
                            <span className="text-sm font-mono text-zinc-300 px-3 py-1">
                                {roomId}
                            </span>
                            <button
                                onClick={copyRoomId}
                                className={`px-2.5 py-1.5 border-l border-zinc-800 transition-colors flex items-center justify-center ${copied ? "bg-emerald-500/10 text-emerald-400" : "hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300"
                                    }`}
                                title="Copy Room Code"
                            >
                                {copied ? (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                    {/* Status Badge */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-medium border transition-colors ${connected ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}>
                        <span className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-400 animate-pulse" : "bg-red-500"}`}></span>
                        {connected ? "Live" : "Offline"}
                    </div>

                    {/* Users Badge */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span>{usersCount}</span>
                    </div>
                </div>
            </header>

            {/* Main Layout */}
            <main className="relative z-10 p-4 lg:p-6 h-[calc(100vh-73px)]">
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-full max-w-[1800px] mx-auto">

                    {/* Editor Workspace */}
                    <div className="flex-1 flex flex-col bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden group">

                        <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 border-b border-zinc-800">
                            <div className="relative">
                                <select
                                    value={language}
                                    onChange={handleLanguageChange}
                                    className="appearance-none bg-zinc-800 text-zinc-200 border border-zinc-700 px-4 py-1.5 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer transition-all hover:bg-zinc-700"
                                >
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="java">Java</option>
                                    <option value="cpp">C++</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>

                            <button
                                onClick={handleReview}
                                disabled={loadingReview}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loadingReview ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        Review Code
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="flex-1 w-full relative">
                            <Editor
                                height="100%"
                                language={language}
                                theme="vs-dark"
                                value={code}
                                options={{
                                    minimap: { enabled: false },
                                    padding: { top: 20 },
                                    fontSize: 15,
                                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                    scrollBeyondLastLine: false,
                                    smoothScrolling: true,
                                    cursorBlinking: "smooth",
                                }}
                                onChange={(value) => {
                                    setCode(value);
                                    socket.emit("code-change", { roomId, code: value });
                                }}
                            />
                        </div>
                    </div>

                    {/* Tabbed Sidebar */}
                    <div className="w-full lg:w-[400px] xl:w-[450px] flex flex-col bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden shrink-0">

                        {/* Tab Headers */}
                        <div className="flex border-b border-zinc-800 bg-zinc-900/50">
                            <button
                                onClick={() => setActiveTab("ai")}
                                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-all ${activeTab === "ai"
                                        ? "text-blue-400 border-b-2 border-blue-500 bg-zinc-800/30"
                                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/20"
                                    }`}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                AI Insights
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab("chat");
                                    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
                                }}
                                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-all ${activeTab === "chat"
                                        ? "text-blue-400 border-b-2 border-blue-500 bg-zinc-800/30"
                                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/20"
                                    }`}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Room Chat
                            </button>
                        </div>

                        {/* TAB 1: AI Insights Content */}
                        {activeTab === "ai" && (
                            <div className="flex-1 overflow-auto p-5 text-sm leading-relaxed prose prose-invert prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-a:text-blue-400 max-w-none">
                                {loadingReview ? (
                                    <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-4">
                                        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                                        <p className="animate-pulse">Analyzing your code structure...</p>
                                    </div>
                                ) : review ? (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <ReactMarkdown>{review}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500 px-4">
                                        <div className="w-16 h-16 mb-4 rounded-full bg-zinc-800/50 flex items-center justify-center border border-zinc-700/50">
                                            <span className="text-2xl opacity-50">🤖</span>
                                        </div>
                                        <p>Your AI assistant is resting.</p>
                                        <p className="mt-1 text-xs text-zinc-600">Click "Review Code" to get suggestions, detect bugs, or refactor your logic.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 2: REAL-TIME CHAT */}
                        {activeTab === "chat" && (
                            <div className="flex-1 flex flex-col overflow-hidden bg-zinc-950/40 relative">

                                {/* Chat Message Stream */}
                                <div className="flex-1 overflow-y-auto p-5 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                                    {messages.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in duration-700">
                                            <div className="w-20 h-20 mb-6 rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 shadow-xl flex items-center justify-center transform -rotate-6">
                                                <span className="text-4xl">💬</span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-zinc-200 mb-2">Start the conversation</h3>
                                            <p className="text-sm text-zinc-500 max-w-[260px] leading-relaxed">
                                                Collaborate with your teammates in real time. Share snippets, discuss logic, or drop an update.
                                            </p>
                                        </div>
                                    ) : (
                                        messages.map((msg) => {
                                            const isMe = String(msg.senderId) === String(user?._id);
                                            const messageText = msg.text;

                                            return (
                                                <div
                                                    key={msg._id ?? msg.createdAt}
                                                    className={`flex gap-3 w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                                                >
                                                    {/* Avatar Block */}
                                                    <div className="shrink-0 flex flex-col items-center">
                                                        <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700/50 flex items-center justify-center overflow-hidden shadow-sm relative">
                                                            {/* Base layer: Initials */}
                                                            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-zinc-400 tracking-wider">
                                                                {getInitials(msg.sender)}
                                                            </span>

                                                            {/* Top layer: Image (hides itself on error revealing initials) */}
                                                            {msg.avatar && (
                                                                <img
                                                                    src={msg.avatar}
                                                                    alt={msg.sender}
                                                                    className="relative z-10 w-full h-full object-cover"
                                                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Message Content */}
                                                    <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                                                        <div className={`flex items-baseline gap-2 mb-1.5 px-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                                            <span className="text-[13px] font-semibold text-zinc-300">
                                                                {isMe ? 'You' : msg.sender}
                                                            </span>
                                                            <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider">
                                                                {formatTime(msg.createdAt)}
                                                            </span>
                                                        </div>

                                                        <div
                                                            className={`px-4 py-2.5 text-[14px] leading-relaxed shadow-sm transition-all hover:shadow-md ${isMe
                                                                    ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-2xl rounded-tr-sm"
                                                                    : "bg-zinc-800/80 backdrop-blur-sm border border-zinc-700/50 text-zinc-200 rounded-2xl rounded-tl-sm hover:bg-zinc-800"
                                                                }`}
                                                        >
                                                            <p className="break-words whitespace-pre-wrap">{messageText}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                    {/* Auto-scroll anchor */}
                                    <div ref={messagesEndRef} className="h-1" />
                                </div>

                                {/* Sticky Input Section */}
                                <div className="p-4 bg-zinc-900/60 backdrop-blur-xl border-t border-zinc-800/60 shrink-0 relative z-10">
                                    <div className="relative flex items-end gap-2 bg-zinc-950/50 border border-zinc-700/60 rounded-2xl p-1.5 focus-within:border-blue-500/60 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-inner">
                                        <input
                                            ref={chatInputRef}
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    sendMessage();
                                                }
                                            }}
                                            placeholder="Message your team..."
                                            className="w-full bg-transparent border-none outline-none text-zinc-200 px-3 py-2 text-[14px] placeholder:text-zinc-600"
                                            autoComplete="off"
                                        />
                                        <button
                                            onClick={sendMessage}
                                            disabled={!message.trim()}
                                            className="p-2.5 rounded-xl bg-blue-600 text-white transition-all hover:bg-blue-500 active:scale-95 disabled:opacity-40 disabled:hover:bg-blue-600 disabled:cursor-not-allowed group shrink-0"
                                            title="Send Message"
                                        >
                                            <svg className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9-2-9-11-9 11 9 2zm0 0v-8" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                            </div>
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
}

export default Room;