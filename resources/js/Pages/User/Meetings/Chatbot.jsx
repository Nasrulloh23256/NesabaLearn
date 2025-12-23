import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { usePage } from "@inertiajs/react";
import UserLayout from "../../../Layouts/UserLayout";

const introMessage = `Hai! Saya siap membantu seputar artikel ilmiah, jurnal, dan OJS. Ajukan pertanyaan Anda, misalnya tentang format artikel, proses submit di OJS, atau tips lolos review.

Contoh: "Bagaimana cara submit artikel di OJS?"`;

const mapMessage = (item) => {
  if (!item) {
    return {
      id: `msg-${Date.now()}`,
      from: "bot",
      text: "",
      time: new Date().toISOString(),
    };
  }

  const role = item.role ?? item.from ?? "assistant";
  return {
    id: item.id ?? `msg-${Date.now()}`,
    from: role === "assistant" || role === "bot" ? "bot" : "user",
    text: item.message ?? item.text ?? "",
    time: item.created_at ?? item.time ?? new Date().toISOString(),
  };
};

const mergeConversation = (conversation, fallbackMessage) => {
  if (!conversation) return null;
  return {
    id: conversation.id,
    title: conversation.title || "Percakapan Baru",
    last_message: conversation.last_message || fallbackMessage || "",
    last_time: conversation.last_time || conversation.updated_at || new Date().toISOString(),
    updated_at: conversation.updated_at,
  };
};

export default function ChatbotPage() {
  const { props } = usePage();
  const initialConversations = props?.conversations ?? [];
  const initialActiveId = props?.activeConversationId ?? null;
  const initialMessages = props?.messages ?? [];
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState(initialActiveId);
  const [messages, setMessages] = useState(initialMessages.map(mapMessage));
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const filteredConversations = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return conversations;
    return conversations.filter((conv) =>
      (conv.title || "").toLowerCase().includes(keyword) ||
      (conv.last_message || "").toLowerCase().includes(keyword),
    );
  }, [conversations, search]);

  const handleSend = async (event, quickPrompt) => {
    event.preventDefault();
    const trimmed = (quickPrompt ?? input).trim();
    if (!trimmed) return;
    if (isSending) return;
    const tempMessage = {
      id: `temp-${Date.now()}`,
      from: "user",
      text: trimmed,
      time: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMessage]);
    setInput("");
    setIsSending(true);

    try {
      const response = await window.axios.post(
        "/user/chatbot/ask",
        { message: trimmed, conversation_id: activeId },
      );
      const reply = response?.data?.reply;
      const conv = response?.data?.conversation;
      const newMessages = (response?.data?.messages || []).map(mapMessage);
      const lastText = newMessages.length > 0
        ? newMessages[newMessages.length - 1].text
        : reply || trimmed;

      if (conv?.id) {
        setActiveId(conv.id);
        setConversations((prev) => {
          const next = prev.filter((c) => c.id !== conv.id);
          return [mergeConversation(conv, lastText), ...next].filter(Boolean);
        });
      }

      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m.id !== tempMessage.id);
        return [
          ...withoutTemp,
          ...newMessages,
          ...(newMessages.length === 0
            ? [
                {
                  id: `bot-${Date.now()}`,
                  from: "bot",
                  text: reply || "Maaf, saya belum punya jawaban yang tepat.",
                  time: new Date().toISOString(),
                },
              ]
            : []),
        ];
      });
    } catch (error) {
      const status = error?.response?.status;
      let message = "Maaf, terjadi kendala. Silakan coba lagi.";
      if (status === 419) {
        message = "Sesi Anda habis. Silakan refresh halaman lalu coba lagi.";
      } else if (status === 401 || status === 403) {
        message = "Akses ditolak. Silakan login kembali.";
      }
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempMessage.id),
        {
          id: `bot-${Date.now()}`,
          from: "bot",
          text: message,
          time: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSelectConversation = async (conversationId) => {
    if (!conversationId || conversationId === activeId) return;
    setActiveId(conversationId);
    setOpenMenuId(null);
    setEditingId(null);
    try {
      const response = await window.axios.get(`/user/chatbot/conversations/${conversationId}`);
      const loaded = response?.data?.messages || [];
      setMessages(loaded.map(mapMessage));
    } catch (error) {
      setMessages([]);
    }
  };

  const handleCreateConversation = async () => {
    try {
      const response = await window.axios.post("/user/chatbot/conversations", {});
      const conv = response?.data?.conversation;
      if (!conv) return;
      setConversations((prev) => [mergeConversation(conv, ""), ...prev].filter(Boolean));
      setActiveId(conv.id);
      setMessages([]);
      setOpenMenuId(null);
      setEditingId(null);
    } catch (error) {
      // abaikan
    }
  };

  const handleRename = async (conversationId) => {
    const title = editingTitle.trim();
    if (!title) return;
    try {
      const response = await window.axios.put(
        `/user/chatbot/conversations/${conversationId}`,
        { title },
      );
      const conv = response?.data?.conversation;
      if (!conv) return;
      setConversations((prev) =>
        prev.map((c) => (c.id === conv.id ? mergeConversation(conv, c.last_message) : c)).filter(Boolean),
      );
      setEditingId(null);
      setEditingTitle("");
    } catch (error) {
      // abaikan
    }
  };

  const handleDelete = async (conversationId) => {
    if (!window.confirm("Hapus riwayat chat ini?")) return;
    try {
      await window.axios.delete(`/user/chatbot/conversations/${conversationId}`);
      const remaining = conversations.filter((c) => c.id !== conversationId);
      setConversations(remaining);
      if (conversationId === activeId) {
        const next = remaining[0];
        setActiveId(next?.id ?? null);
        if (next?.id) {
          handleSelectConversation(next.id);
        } else {
          setMessages([]);
        }
      }
    } catch (error) {
      // abaikan
    }
  };

  const formatListTime = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
    }) + " " + date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };

  const formatChatTime = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <UserLayout>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mx-auto max-w-6xl"
      >
        <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
          <aside className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4 h-fit lg:order-first order-last">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Riwayat Chat</p>
              <p className="text-sm text-slate-500">Semua percakapan tersimpan.</p>
            </div>
            <div className="relative">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#04BBFD]/40 dark:border-slate-700 dark:bg-slate-800"
                placeholder="Cari riwayat..."
              />
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                className="pointer-events-none absolute right-3 top-2.5 text-slate-400"
              >
                <path
                  fill="currentColor"
                  d="M15.5 14h-.79l-.28-.27a6 6 0 1 0-.71.71l.27.28v.79l4.25 4.25l1.5-1.5zm-6 0a4 4 0 1 1 0-8a4 4 0 0 1 0 8"
                />
              </svg>
            </div>
            <div className="space-y-2 text-sm max-h-[45vh] overflow-y-auto pr-1">
              {filteredConversations.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-xs text-slate-400 text-center">
                  Tidak ada riwayat.
                </div>
              )}
              {filteredConversations.map((conv) => {
                const isActive = conv.id === activeId;
                const isEditing = conv.id === editingId;
                return (
                  <div
                    key={conv.id}
                    className={`group relative rounded-2xl border px-4 py-2 transition ${
                      isActive
                        ? "border-transparent bg-gradient-to-r from-[#04BBFD]/15 to-[#FB00FF]/15 text-slate-900"
                        : "border-slate-200 text-slate-600 hover:border-[#04BBFD]/40"
                    }`}
                    onClick={() => handleSelectConversation(conv.id)}
                  >
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          value={editingTitle}
                          onChange={(event) => setEditingTitle(event.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#04BBFD]/40"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setEditingId(null);
                              setEditingTitle("");
                            }}
                            className="rounded-full px-3 py-1 text-xs text-slate-500 hover:text-slate-700"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleRename(conv.id);
                            }}
                            className="rounded-full bg-slate-900 px-3 py-1 text-xs text-white"
                          >
                            Simpan
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="block font-semibold text-sm truncate">{conv.title}</span>
                          <span className="text-xs text-slate-500">{formatListTime(conv.last_time)}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setOpenMenuId((prev) => (prev === conv.id ? null : conv.id));
                          }}
                          className="opacity-0 group-hover:opacity-100 transition text-slate-400 hover:text-slate-600"
                          aria-label="Menu"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M12 7a2 2 0 1 0-2-2a2 2 0 0 0 2 2m0 2a2 2 0 1 0 2 2a2 2 0 0 0-2-2m0 6a2 2 0 1 0 2 2a2 2 0 0 0-2-2"
                            />
                          </svg>
                        </button>
                      </div>
                    )}

                    {openMenuId === conv.id && !isEditing && (
                      <div className="absolute right-3 top-12 z-10 w-40 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setEditingId(conv.id);
                            setEditingTitle(conv.title);
                            setOpenMenuId(null);
                          }}
                          className="w-full rounded-lg px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-100"
                        >
                          Ganti nama
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setOpenMenuId(null);
                            handleDelete(conv.id);
                          }}
                          className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-rose-500 hover:bg-rose-50"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M9 3h6l1 2h5v2H3V5h5zm1 6h2v9h-2zm4 0h2v9h-2zM7 9h2v9H7z"
                            />
                          </svg>
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={handleCreateConversation}
              className="w-full rounded-2xl border border-dashed border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-[#04BBFD]/50 hover:text-[#04BBFD] dark:border-slate-700"
            >
              Percakapan Baru
            </button>
          </aside>

          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col h-[70vh] sm:h-[75vh] lg:h-[80vh]">
            <header className="flex flex-col items-start gap-3 border-b border-slate-100 px-4 py-4 sm:px-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
              <div>
                <h1 className="text-2xl font-semibold">Chatbot AI</h1>
                <p className="text-sm text-slate-500">Tanyakan artikel atau editorial kapan pun.</p>
              </div>
              <button
                type="button"
                onClick={(event) => handleSend(event, "Apa itu artikel ilmiah?")}
                className="w-full sm:w-auto rounded-full bg-gradient-to-r from-[#04BBFD] to-[#FB00FF] px-4 py-2 text-xs font-semibold text-white shadow"
              >
                Apa itu artikel ilmiah?
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 space-y-4">
              {messages.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800">
                  {introMessage}
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    msg.from === "bot"
                      ? "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                      : "border-transparent bg-gradient-to-r from-[#04BBFD]/20 to-[#FB00FF]/20 text-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold">{msg.from === "bot" ? "Chatbot" : "Anda"}</span>
                    <span>{formatChatTime(msg.time)}</span>
                  </div>
                  <p className="whitespace-pre-line text-slate-700 dark:text-slate-100">{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="border-t border-slate-100 px-4 py-4 sm:px-6 dark:border-slate-800">
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-[#04BBFD]/40 dark:border-slate-700 dark:bg-slate-900 sm:flex-row sm:items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" className="text-slate-400">
                  <path fill="currentColor" d="M2 21L23 12L2 3v7l15 2l-15 2z" />
                </svg>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 border-none bg-transparent py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
                  placeholder="Tulis pertanyaan Anda di sini..."
                />
                <button
                  type="submit"
                  disabled={isSending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#04BBFD] to-[#FB00FF] px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90 disabled:opacity-60 sm:w-auto"
                >
                  {isSending ? "Mengirim..." : "Kirim Pertanyaan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </UserLayout>
  );
}
