import React, { useEffect, useMemo, useRef, useState } from "react";
import api from "../api/axios";
import {
  Send,
  RefreshCcw,
  Search,
  UserCircle,
} from "lucide-react";

const AdminSupportPage = () => {
  const [chats, setChats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [search, setSearch] = useState("");

  const bottomRef = useRef(null);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const res = await api.get("/support/admin/chats");

      if (res.data?.success) {
        setChats(res.data.chats || []);
      }
    } catch {
      alert("Failed to load support chats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, []);

  const groupedChats = useMemo(() => {
    return chats.reduce((acc, item) => {
      const userId = item.userId?._id || item.userId;
      if (!userId) return acc;

      if (!acc[userId]) {
        acc[userId] = {
          user: item.userId,
          messages: [],
        };
      }

      acc[userId].messages.push(item);
      return acc;
    }, {});
  }, [chats]);

  const users = useMemo(() => {
    return Object.values(groupedChats)
      .map((item) => {
        const messages = [...item.messages].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        return {
          ...item,
          messages,
          lastMessage: messages[messages.length - 1],
          unreadCount: messages.filter(
            (msg) => msg.sender === "user" && !msg.isReadByAdmin
          ).length,
        };
      })
      .filter((item) => {
        const keyword = search.toLowerCase();
        const name =
          item.user?.name ||
          item.user?.username ||
          item.user?.email ||
          "user";

        return name.toLowerCase().includes(keyword);
      })
      .sort(
        (a, b) =>
          new Date(b.lastMessage?.createdAt || 0) -
          new Date(a.lastMessage?.createdAt || 0)
      );
  }, [groupedChats, search]);

  const selectedMessages = useMemo(() => {
    if (!selectedUser) return [];

    return [...(groupedChats[selectedUser]?.messages || [])].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  }, [groupedChats, selectedUser]);

  const selectedUserData = selectedUser
    ? groupedChats[selectedUser]?.user
    : null;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedMessages.length, selectedUser]);

  const sendReply = async () => {
    const text = reply.trim();

    if (!text || !selectedUser || replyLoading) return;

    const tempMessage = {
      _id: `temp-${Date.now()}`,
      userId: selectedUser,
      sender: "admin",
      message: text,
      createdAt: new Date().toISOString(),
      isTemp: true,
    };

    setChats((prev) => [...prev, tempMessage]);
    setReply("");

    try {
      setReplyLoading(true);

      const res = await api.post(`/support/admin/reply/${selectedUser}`, {
        message: text,
      });

      if (res.data?.success) {
        await fetchChats();
      }
    } catch {
      alert("Reply failed");
      setChats((prev) => prev.filter((msg) => msg._id !== tempMessage._id));
      setReply(text);
    } finally {
      setReplyLoading(false);
    }
  };

  const getUserName = (user) => {
    return user?.name || user?.username || user?.email || "User";
  };

  const getInitial = (user) => {
    return getUserName(user).charAt(0).toUpperCase();
  };

  return (
    <div className="h-screen bg-slate-50 p-3 md:p-5 overflow-hidden">
      <div className="h-full max-w-6xl mx-auto flex flex-col gap-4">
        <div className="shrink-0 bg-slate-950 text-white rounded-3xl p-4 md:p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-yellow-300 text-sm font-semibold">
              Admin Support
            </p>
            <h1 className="text-xl md:text-2xl font-bold mt-1">
              Support Messages
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              User aur admin communication manage karein.
            </p>
          </div>

          <button
            onClick={fetchChats}
            disabled={loading}
            className="bg-white/10 px-4 py-2 rounded-xl flex items-center gap-2 text-sm hover:bg-white/15 disabled:opacity-60"
          >
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden h-full flex flex-col">
            <div className="shrink-0 p-4 border-b border-slate-200">
              <h2 className="font-bold text-slate-900 mb-3">Users</h2>

              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search user..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-slate-900"
                />
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2">
              {users.length > 0 ? (
                users.map((item) => {
                  const userId = item.user?._id || item.user;

                  return (
                    <button
                      key={userId}
                      onClick={() => setSelectedUser(userId)}
                      className={`w-full text-left p-3 rounded-2xl border transition ${
                        selectedUser === userId
                          ? "bg-slate-950 text-white border-slate-950"
                          : "bg-slate-50 text-slate-900 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center font-bold shrink-0 ${
                            selectedUser === userId
                              ? "bg-white text-slate-950"
                              : "bg-slate-900 text-white"
                          }`}
                        >
                          {getInitial(item.user)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold truncate">
                              {getUserName(item.user)}
                            </p>

                            {item.unreadCount > 0 && (
                              <span className="min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                                {item.unreadCount}
                              </span>
                            )}
                          </div>

                          <p className="text-xs opacity-70 truncate mt-1">
                            {item.lastMessage?.message || "No message"}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <p className="text-sm text-slate-500 text-center py-10">
                  No support messages.
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden h-full min-h-0">
            {selectedUser ? (
              <div className="flex flex-col h-full min-h-0">
                <div className="shrink-0 border-b border-slate-200 px-4 md:px-5 py-3 flex items-center gap-3 bg-white">
                  <div className="h-10 w-10 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold shrink-0">
                    {getInitial(selectedUserData)}
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-bold text-slate-950 truncate">
                      {getUserName(selectedUserData)}
                    </h2>
                    <p className="text-xs text-slate-500 truncate">
                      {selectedUserData?.email || "Support conversation"}
                    </p>
                  </div>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 bg-slate-50">
                  {selectedMessages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`flex ${
                        msg.sender === "admin"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                          msg.sender === "admin"
                            ? "bg-slate-950 text-white rounded-br-md"
                            : "bg-white border border-slate-200 text-slate-900 rounded-bl-md"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">
                          {msg.message}
                        </p>

                        <p className="text-[10px] opacity-60 mt-1 text-right">
                          {new Date(msg.createdAt).toLocaleString()}
                          {msg.isTemp ? " • Sending..." : ""}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div ref={bottomRef} />
                </div>

                <div className="shrink-0 p-3 md:p-4 border-t border-slate-200 bg-white">
                  <div className="flex gap-2">
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendReply();
                        }
                      }}
                      placeholder="Type reply..."
                      rows={1}
                      className="flex-1 max-h-28 resize-none border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-slate-900 text-sm"
                    />

                    <button
                      onClick={sendReply}
                      disabled={!reply.trim() || replyLoading}
                      className="px-4 md:px-5 rounded-2xl bg-slate-950 text-white flex items-center gap-2 disabled:opacity-50"
                    >
                      <Send size={17} />
                      {replyLoading ? "Sending..." : "Send"}
                    </button>
                  </div>

                  <p className="mt-2 text-[11px] text-slate-400">
                    Enter se send hoga, Shift + Enter se new line.
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <UserCircle size={58} />
                <p className="mt-3 text-sm">Select user chat</p>
                <p className="text-xs mt-1">User select karke reply bhejein.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSupportPage;