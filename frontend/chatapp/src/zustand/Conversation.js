import { create } from "zustand";

export const useConversation = create((set) => ({
    selectedConversation: null,
    setSelectedConversation: (selectedConversation) => set({ selectedConversation }),

    messages: [],
    setMessages: (messages) => set({ messages }),
}));

const handleConversationClick = (setSelectedConversation, item, selectedConversation) => {
    console.log(item);
    setSelectedConversation(item, () => {
    });
    console.log(selectedConversation);
};

export default handleConversationClick;
