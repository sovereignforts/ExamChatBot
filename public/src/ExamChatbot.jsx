import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Zap, Calendar } from 'lucide-react';

// SAMPLE DATASET - Replace with your own data
const EXAM_DATASET = [
  {
    id: 1,
    question: "Explain the concept of inheritance in object-oriented programming",
    answer: "Inheritance is a fundamental OOP concept where a class (derived/child class) inherits properties and methods from another class (base/parent class). This promotes code reusability and establishes a hierarchical relationship. Key benefits include: (1) Code reusability - avoid writing duplicate code, (2) Polymorphism support - enables method overriding, (3) Hierarchical classification - represents real-world relationships. Types: Single, Multiple, Multilevel, Hybrid. Example: A 'Vehicle' class can be inherited by 'Car' and 'Bike' classes.",
    year: 2022,
    subject: "OOP",
    difficulty: "medium"
  },
  {
    id: 2,
    question: "What is polymorphism? Give examples",
    answer: "Polymorphism means 'many forms'. It allows objects to take multiple forms and is achieved through:\n\n1. COMPILE-TIME POLYMORPHISM (Static):\n   - Method Overloading: Same method name, different parameters\n   - Operator Overloading: Same operator behaves differently\n\n2. RUNTIME POLYMORPHISM (Dynamic):\n   - Method Overriding: Child class overrides parent method\n   - Achieved through virtual functions and inheritance\n\nExample: A 'Shape' class with draw() method can be overridden by Circle, Square, Triangle classes.",
    year: 2021,
    subject: "OOP",
    difficulty: "medium"
  },
  {
    id: 3,
    question: "Explain encapsulation and its advantages",
    answer: "Encapsulation is bundling data (variables) and methods (functions) into a single unit called a class, hiding internal details from outside world.\n\nKEY PRINCIPLES:\n- Data hiding: Use private/protected access modifiers\n- Getter/Setter methods: Control data access\n- Single Responsibility: Each class has one purpose\n\nADVANTAGES:\n1. Security: Sensitive data is protected\n2. Flexibility: Implementation can change without affecting outside code\n3. Maintainability: Easy to modify internal implementation\n4. Read-only/Write-only properties: Control access\n5. Validation: Check data before assigning\n\nExample: Bank account class keeps balance private, provides deposit() and withdraw() methods.",
    year: 2023,
    subject: "OOP",
    difficulty: "medium"
  },
  {
    id: 4,
    question: "What is abstraction? Differentiate between abstraction and encapsulation",
    answer: "ABSTRACTION: Showing only essential features while hiding unnecessary complexity. Uses abstract classes and interfaces.\n\nENCAPSULATION: Bundling data and methods into a class, controlling access using access modifiers.\n\nKEY DIFFERENCES:\n┌─────────────────┬──────────────────┬──────────────────┐\n│ Aspect          │ Abstraction       │ Encapsulation    │\n├─────────────────┼──────────────────┼──────────────────┤\n│ Focus           │ 'What to hide'    │ 'How to hide'    │\n│ Method          │ Abstract classes  │ Access modifiers │\n│ Purpose         │ Reduce complexity │ Protect data     │\n│ Implementation  │ Interfaces        │ Private members  │\n└─────────────────┴──────────────────┴──────────────────┘",
    year: 2022,
    subject: "OOP",
    difficulty: "hard"
  },
  {
    id: 5,
    question: "What is the difference between Array and ArrayList?",
    answer: "ARRAY vs ARRAYLIST:\n\nARRAY:\n- Fixed size (declared at creation)\n- Primitive & object types supported\n- Manual size management\n- Type-safe\n- Faster access (direct index)\n- Memory: Contiguous allocation\n- Syntax: int[] arr = new int[5];\n\nARRAYLIST:\n- Dynamic size (grows/shrinks automatically)\n- Only object types (not primitives)\n- Automatic size management\n- Type-safe with Generics\n- Slightly slower (internally uses array)\n- Memory: Non-contiguous\n- Syntax: ArrayList<Integer> list = new ArrayList<>();\n\nWHEN TO USE:\n- Array: When size is known and fixed\n- ArrayList: When size varies dynamically",
    year: 2020,
    subject: "Java",
    difficulty: "easy"
  }
];

export default function ExamChatbot() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "Hey there! 👋 I'm your Exam Assistant. Ask me any previous year exam question, and I'll provide detailed, exam-style answers with the year it appeared. Try asking about OOP concepts, Java, or any subject!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const searchDataset = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // Search by question similarity
    const matches = EXAM_DATASET.filter(item => {
      const questionMatch = item.question.toLowerCase().includes(lowerQuery);
      const subjectMatch = item.subject.toLowerCase().includes(lowerQuery);
      const answerMatch = item.answer.toLowerCase().includes(lowerQuery);
      return questionMatch || subjectMatch || answerMatch;
    });

    return matches;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user',
      content: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    const results = searchDataset(input);
    let botResponse;

    if (results.length > 0) {
      const topMatch = results[0];
      botResponse = {
        type: 'bot',
        content: topMatch.answer,
        metadata: {
          year: topMatch.year,
          subject: topMatch.subject,
          difficulty: topMatch.difficulty,
          matchCount: results.length
        },
        timestamp: new Date()
      };
    } else {
      botResponse = {
        type: 'bot',
        content: `Hmm, I couldn't find a direct match for "${input}" in my database. Try asking about:\n\n${EXAM_DATASET.map(q => `• ${q.question}`).join('\n')}\n\nOr ask about a specific topic like "inheritance", "polymorphism", or "arrays"!`,
        timestamp: new Date()
      };
    }

    setMessages(prev => [...prev, botResponse]);
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-purple-500/20 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              ExamMaster
            </h1>
            <p className="text-xs text-purple-300">Powered by your dataset</p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto h-[calc(100vh-180px)] overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            <div
              className={`max-w-2xl px-4 py-3 rounded-2xl backdrop-blur-sm transition-all ${
                msg.type === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 rounded-br-none shadow-lg'
                  : 'bg-gradient-to-r from-slate-700/50 to-purple-700/50 border border-purple-500/30 rounded-bl-none'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              
              {msg.metadata && (
                <div className="mt-3 pt-3 border-t border-white/20 flex flex-wrap gap-2">
                  <div className="flex items-center gap-1 text-xs bg-white/10 px-2 py-1 rounded-full">
                    <Calendar className="w-3 h-3" />
                    {msg.metadata.year}
                  </div>
                  <div className="text-xs bg-white/10 px-2 py-1 rounded-full">
                    📚 {msg.metadata.subject}
                  </div>
                  <div className="text-xs bg-white/10 px-2 py-1 rounded-full capitalize">
                    {msg.metadata.difficulty}
                  </div>
                </div>
              )}

              <span className="text-xs text-white/50 mt-2 block">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gradient-to-r from-slate-700/50 to-purple-700/50 border border-purple-500/30 px-4 py-3 rounded-2xl rounded-bl-none">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-100" />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-purple-500/20 bg-black/40 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about inheritance, polymorphism, arrays... or paste a question"
              className="flex-1 bg-slate-800/50 border border-purple-500/30 rounded-2xl px-4 py-3 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition-all"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 rounded-2xl transition-all flex items-center gap-2 font-semibold shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-purple-300/60 mt-2">💡 Tip: The more specific your question, the better the match from dataset</p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
}
