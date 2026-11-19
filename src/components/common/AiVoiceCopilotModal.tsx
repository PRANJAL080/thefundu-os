"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  X,
  Smartphone,
  Tag,
  FileText,
  Eye,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  RotateCcw,
  Bot,
  User,
  Zap,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/lib/store";
import { Device } from "@/lib/types";
import { formatINR, getGradeBadgeColor, getStatusBadgeColor } from "@/lib/utils";
import { processAiStoreQuery, AiCopilotResponse } from "@/lib/aiCopilotEngine";
import { useRouter } from "next/navigation";

interface MessageItem {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  response?: AiCopilotResponse;
}

interface AiVoiceCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDeviceProfile?: (device: Device) => void;
  onPrintSticker?: (device: Device) => void;
  onGenerateInvoice?: (device: Device) => void;
}

export function AiVoiceCopilotModal({
  isOpen,
  onClose,
  onOpenDeviceProfile,
  onPrintSticker,
  onGenerateInvoice,
}: AiVoiceCopilotModalProps) {
  const router = useRouter();
  const { devices, sales, purchases, buybacks, warehouses, showToast } = useApp();

  const [inputQuery, setInputQuery] = useState("");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceSpeechEnabled, setVoiceSpeechEnabled] = useState(true);
  const [speechLanguage, setSpeechLanguage] = useState<"hi-IN" | "en-IN">("hi-IN");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome-1",
          sender: "ai",
          text: "Namaste! Main **TheFundu AI Voice & Hindi Copilot** hoon. Aap mujhse bolkar (Mic) ya type karke store stock, pricing, handsets, ya daily sales ke bare me kuch bhi pooch sakte hain.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isListening, interimTranscript]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      stopListening();
      window.speechSynthesis?.cancel();
    }
  }, [isOpen]);

  // Web Speech Synthesis (Text-to-Speech)
  const speakHindiText = (text: string) => {
    if (!voiceSpeechEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    try {
      window.speechSynthesis.cancel();
      // Clean markdown tags for natural speech
      const clean = text.replace(/[*_#`[\]()]/g, "").trim();
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = speechLanguage;

      // Prefer Indian English / Hindi voices if installed in browser
      const voices = window.speechSynthesis.getVoices();
      const indianVoice = voices.find(
        (v) => v.lang.includes("hi") || v.lang.includes("IN") || v.name.includes("India")
      );
      if (indianVoice) {
        utterance.voice = indianVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("TTS error:", e);
    }
  };

  // Web Speech Recognition (Speech-to-Text)
  const startListening = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast("Aapka browser Speech Recognition support nahi karta. Please type karein.", "error");
      return;
    }

    try {
      window.speechSynthesis?.cancel();
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = speechLanguage;

      recognition.onstart = () => {
        setIsListening(true);
        setInterimTranscript("");
      };

      recognition.onresult = (event: any) => {
        let currentInterim = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        if (currentInterim) {
          setInterimTranscript(currentInterim);
        }

        if (finalTranscript) {
          setInputQuery(finalTranscript);
          setInterimTranscript("");
          handleExecuteQuery(finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        setInterimTranscript("");
        if (event.error === "not-allowed") {
          showToast("Microphone permission denied. Browser settings me mic allow karein.", "error");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript("");
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Mic start error:", err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimTranscript("");
  };

  const handleExecuteQuery = async (queryToRun: string) => {
    const q = queryToRun.trim();
    if (!q) return;

    stopListening();
    setIsProcessing(true);

    const userMsg: MessageItem = {
      id: "u-" + Date.now(),
      sender: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");

    try {
      // 1. Process via local high-speed Hindi/Hinglish engine
      const localResult = processAiStoreQuery(q, {
        devices,
        sales,
        purchases,
        buybacks,
        warehouses,
      });

      // 2. Optionally ping Gemini API in background ONLY for generic or open-ended advice if local engine didn't match devices/actions
      let finalAnswer = localResult.answerHindi;
      let finalSpoken = localResult.spokenHindi;

      if (!localResult.devices?.length && !localResult.navigation && !localResult.stats) {
        try {
          const res = await fetch("/api/ai/copilot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: q,
              storeSummary: {
                inStockCount: devices.filter((d) => d.status === "In Stock").length,
                totalDevices: devices.length,
                sampleDevices: devices.slice(0, 15).map((d) => ({
                  brand: d.brand,
                  model: d.model,
                  storage: d.storage,
                  price: d.costs.sellingPrice,
                  status: d.status,
                })),
              },
            }),
          });
          const data = await res.json();
          if (!data.fallback && data.answerHindi) {
            finalAnswer = data.answerHindi;
            finalSpoken = data.answerHindi.slice(0, 160);
          }
        } catch (err) {
          // Silently use localResult
        }
      }

      const aiMsg: MessageItem = {
        id: "ai-" + Date.now(),
        sender: "ai",
        text: finalAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        response: {
          ...localResult,
          answerHindi: finalAnswer,
          spokenHindi: finalSpoken,
        },
      };

      setMessages((prev) => [...prev, aiMsg]);
      speakHindiText(finalSpoken);
    } finally {
      setIsProcessing(false);
    }
  };

  const starterChips = [
    "Apple ke 128GB wale phone dikhao",
    "Sabse sasta aur sabse mehenga phone kaun sa hai?",
    "Lucknow store me total stock aur valuation kitni hai?",
    "85% se zyada battery health wale iPhone",
    "Naya phone add karne ka page kholo",
    "Pichle hafte kitni sales aur buybacks huye?",
  ];

  if (!isOpen) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="3xl">
      <div className="relative flex flex-col w-full h-[80vh] max-h-[720px] -m-6 overflow-hidden bg-white dark:bg-slate-900">
          
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-violet-50/80 via-white to-slate-50/80 dark:from-violet-950/30 dark:via-slate-900 dark:to-slate-900 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-sm">
                <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    TheFundu AI Voice & Hindi Copilot
                  </h3>
                  <Badge variant="success" size="sm" className="text-[10px] py-0 px-1.5">
                    Live Store Intelligence
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Speak in Hindi / Hinglish or type queries (Stock, Pricing, Handsets, Invoices)
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <button
                type="button"
                onClick={() => setSpeechLanguage(speechLanguage === "hi-IN" ? "en-IN" : "hi-IN")}
                className="px-2 py-1 text-[11px] font-semibold rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                title="Switch Speech Recognition Language"
              >
                {speechLanguage === "hi-IN" ? "🇮🇳 Hindi (हिन्दी)" : "🇮🇳 English (IN)"}
              </button>

              {/* TTS Toggle */}
              <button
                type="button"
                onClick={() => {
                  setVoiceSpeechEnabled(!voiceSpeechEnabled);
                  if (voiceSpeechEnabled) window.speechSynthesis?.cancel();
                }}
                className={`p-1.5 rounded-lg border transition-colors ${
                  voiceSpeechEnabled
                    ? "bg-violet-50 border-violet-200 text-violet-700 dark:bg-violet-950/50 dark:border-violet-800 dark:text-violet-300"
                    : "border-slate-200 text-slate-400 dark:border-slate-800 hover:bg-slate-100"
                }`}
                title={voiceSpeechEnabled ? "Voice Speech ON (Click to Mute)" : "Voice Speech Muted (Click to Enable)"}
              >
                {voiceSpeechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>

              {/* Reset Chat */}
              <button
                type="button"
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  setMessages([]);
                }}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Clear Chat History"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "ai" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300 mt-0.5">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    m.sender === "user"
                      ? "bg-violet-600 text-white rounded-tr-xs"
                      : "bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 rounded-tl-xs shadow-xs"
                  }`}
                >
                  <p className="whitespace-pre-line font-medium">{m.text}</p>

                  {/* Summary Metric Chips */}
                  {m.response?.stats && (
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {m.response.stats.map((st, i) => (
                        <div
                          key={i}
                          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-center"
                        >
                          <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate">
                            {st.label}
                          </span>
                          <span className="block text-xs font-bold text-fundu-700 dark:text-fundu-400 mt-0.5">
                            {st.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Navigation Shortcut Button */}
                  {m.response?.navigation && (
                    <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          onClose();
                          router.push(m.response!.navigation!.href);
                        }}
                        className="w-full text-xs flex items-center justify-center gap-1.5 h-8 font-semibold"
                      >
                        <span>{m.response.navigation.label}</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}

                  {/* Matching Handsets Cards */}
                  {m.response?.devices && m.response.devices.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        <span>Matching Smartphones ({m.response.devices.length})</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1">
                        {m.response.devices.slice(0, 6).map((dev) => (
                          <div
                            key={dev.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 transition-all shadow-xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={
                                  dev.images?.[0] ||
                                  "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=120&q=80"
                                }
                                alt={dev.model}
                                className="h-10 w-10 rounded-lg object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                                    {dev.brand} {dev.model}
                                  </span>
                                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
                                    {dev.id.replace("TFD-2026-", "Fun-")}
                                  </span>
                                  {(() => {
                                    const st = getStatusBadgeColor(dev.status);
                                    return (
                                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${st.bg} ${st.text} ${st.border}`}>
                                        <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                                        {dev.status}
                                      </span>
                                    );
                                  })()}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                                  <span>{dev.storage}</span>
                                  <span>•</span>
                                  <span>IMEI: {dev.imei1.slice(0, 8)}...</span>
                                  {dev.batteryHealth && (
                                    <>
                                      <span>•</span>
                                      <span className="text-emerald-600 font-semibold">
                                        ⚡ {dev.batteryHealth}%
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-800">
                              <span className="font-bold text-xs text-fundu-700 dark:text-fundu-400">
                                {formatINR(dev.costs.sellingPrice)}
                              </span>

                              <div className="flex items-center gap-1">
                                {onOpenDeviceProfile && (
                                  <button
                                    onClick={() => {
                                      onClose();
                                      onOpenDeviceProfile(dev);
                                    }}
                                    className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                                    title="View Device Dossier"
                                  >
                                    <Eye className="h-3.5 w-3.5" />
                                  </button>
                                )}
                                {onPrintSticker && (
                                  <button
                                    onClick={() => {
                                      onClose();
                                      onPrintSticker(dev);
                                    }}
                                    className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                                    title="Print Thermal Barcode Sticker"
                                  >
                                    <Tag className="h-3.5 w-3.5" />
                                  </button>
                                )}
                                {onGenerateInvoice && dev.status === "In Stock" && (
                                  <button
                                    onClick={() => {
                                      onClose();
                                      onGenerateInvoice(dev);
                                    }}
                                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-md transition-colors"
                                    title="Generate Tax Invoice"
                                  >
                                    <FileText className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <span
                    className={`block text-[9px] mt-1.5 ${
                      m.sender === "user" ? "text-violet-200" : "text-slate-400"
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>

                {m.sender === "user" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 mt-0.5">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Listening Live Equalizer Banner */}
            {isListening && (
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 animate-pulse">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white animate-bounce">
                  <Mic className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-violet-900 dark:text-violet-200">
                    Listening... Boliye, sun raha hoon!
                  </p>
                  <p className="text-[11px] text-violet-600 dark:text-violet-400 italic">
                    {interimTranscript || "Kuch bhi boliye (e.g. 'Apple ke 128GB phone kitne hain')..."}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={stopListening}
                  className="text-xs border-violet-300 text-violet-700 h-7 px-2"
                >
                  Stop
                </Button>
              </div>
            )}

            {/* Processing loader */}
            {isProcessing && (
              <div className="flex items-center gap-2 text-xs text-slate-500 py-1">
                <Sparkles className="h-3.5 w-3.5 animate-spin text-violet-600" />
                <span>AI analyzing store ledger...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Starter Chips */}
          <div className="px-5 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-[10px] font-bold text-slate-400 shrink-0 uppercase tracking-wider">
              Ideas:
            </span>
            {starterChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleExecuteQuery(chip)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-all shrink-0 whitespace-nowrap shadow-2xs"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input & Mic Bar */}
          <div className="p-3.5 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleExecuteQuery(inputQuery);
              }}
              className="flex items-center gap-2"
            >
              {/* Mic Button */}
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all shadow-xs shrink-0 ${
                  isListening
                    ? "bg-rose-600 text-white animate-pulse ring-4 ring-rose-200 dark:ring-rose-900"
                    : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700"
                }`}
                title={isListening ? "Stop Listening" : "Speak in Hindi / Hinglish (Microphone)"}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>

              {/* Text Input */}
              <Input
                ref={inputRef}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={
                  isListening
                    ? "Sun raha hoon... Boliye..."
                    : "Hindi ya English me poochiye (e.g. 'Apple ke saste phone dikhao')..."
                }
                className="h-10 text-xs rounded-xl flex-1 focus:ring-violet-500"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputQuery.trim() || isProcessing}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-violet-600 dark:hover:bg-violet-700 disabled:opacity-40 transition-colors shrink-0 shadow-xs"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
    </Dialog>
  );
}
