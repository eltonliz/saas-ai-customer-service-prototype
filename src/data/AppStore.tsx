import { createContext, useContext, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import type { AppContextValue, BusinessLine, Channel, Conversation, KnowledgeDocument, KnowledgeGap, Message, Ticket, AfterSale } from "../types";
import * as M from "./mockData";

interface AppStoreState {
  appContext: Omit<AppContextValue, "portal">;
  setTenantId: Dispatch<SetStateAction<string>>;
  setMerchantId: Dispatch<SetStateAction<string>>;
  setStoreId: Dispatch<SetStateAction<string>>;
  setBusinessLine: Dispatch<SetStateAction<BusinessLine>>;
  setUserId: Dispatch<SetStateAction<string>>;
  setChannel: Dispatch<SetStateAction<Channel>>;
  // mutable local state for interactions
  conversations: Conversation[];
  messages: Message[];
  tickets: Ticket[];
  knowledgeDocs: KnowledgeDocument[];
  knowledgeGaps: KnowledgeGap[];
  afterSales: AfterSale[];
  updateConversation: (id: string, patch: Partial<Conversation>) => void;
  addMessage: (msg: Message) => void;
  updateTicket: (id: string, patch: Partial<Ticket>) => void;
  addTicket: (ticket: Ticket) => void;
  updateKnowledgeDoc: (id: string, patch: Partial<KnowledgeDocument>) => void;
  updateKnowledgeGap: (id: string, patch: Partial<KnowledgeGap>) => void;
  addKnowledgeGap: (gap: KnowledgeGap) => void;
  addKnowledgeDoc: (doc: KnowledgeDocument) => void;
  updateAfterSale: (id: string, patch: Partial<AfterSale>) => void;
  addAfterSale: (as: AfterSale) => void;
}

const AppStoreContext = createContext<AppStoreState | null>(null);

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be inside AppStoreProvider");
  return ctx;
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [tenantId, setTenantId] = useState("tenant-1");
  const [merchantId, setMerchantId] = useState("merchant-1");
  const [storeId, setStoreId] = useState("store-1");
  const [businessLine, setBusinessLine] = useState<BusinessLine>("直播");
  const [userId, setUserId] = useState("user-1");
  const [channel, setChannel] = useState<Channel>("APP");

  const [conversations, setConversations] = useState<Conversation[]>(() => structuredClone(M.conversations));
  const [messages, setMessages] = useState<Message[]>(() => structuredClone(M.conversationMessages));
  const [tickets, setTickets] = useState<Ticket[]>(() => structuredClone(M.tickets));
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDocument[]>(() => structuredClone(M.knowledgeDocuments));
  const [knowledgeGaps, setKnowledgeGaps] = useState<KnowledgeGap[]>(() => structuredClone(M.knowledgeGaps));
  const [afterSales, setAfterSales] = useState<AfterSale[]>(() => structuredClone(M.afterSales));

  const state: AppStoreState = useMemo(
    () => ({
      appContext: {
        currentTenantId: tenantId,
        currentMerchantId: merchantId,
        currentStoreId: storeId,
        currentBusinessLine: businessLine,
        currentUserId: userId,
        currentChannel: channel,
      },
      setTenantId,
      setMerchantId,
      setStoreId,
      setBusinessLine,
      setUserId,
      setChannel,
      conversations,
      messages,
      tickets,
      knowledgeDocs,
      knowledgeGaps,
      afterSales,
      updateConversation: (id, patch) =>
        setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c))),
      addMessage: (msg) => setMessages((prev) => [...prev, msg]),
      updateTicket: (id, patch) =>
        setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t))),
      addTicket: (ticket) => setTickets((prev) => [...prev, ticket]),
      updateKnowledgeDoc: (id, patch) =>
        setKnowledgeDocs((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d))),
      updateKnowledgeGap: (id, patch) =>
        setKnowledgeGaps((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g))),
      addKnowledgeGap: (gap) =>
        setKnowledgeGaps((prev) => [...prev, gap]),
      addKnowledgeDoc: (doc) =>
        setKnowledgeDocs((prev) => [...prev, doc]),
      updateAfterSale: (id, patch) =>
        setAfterSales((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a))),
      addAfterSale: (as) => setAfterSales((prev) => [...prev, as]),
    }),
    [tenantId, merchantId, storeId, businessLine, userId, channel, conversations, messages, tickets, knowledgeDocs, knowledgeGaps, afterSales],
  );

  return <AppStoreContext.Provider value={state}>{children}</AppStoreContext.Provider>;
}
