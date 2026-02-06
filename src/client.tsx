import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';

interface Message {
  id: string;
  text: string | { response: string } | any;
  timestamp: number;
  isAI?: boolean;
}

interface ChatInitResponse {
  id: string;
}

interface ChatResponse {
  messages: Message[];
}

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #eef5fb;
  font-family: 'Noto Sans TC', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1f2a44;
  position: relative;
  padding-bottom: 40px;

  &::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      radial-gradient(circle at 10% 20%, rgba(0, 119, 200, 0.08), transparent 45%),
      radial-gradient(circle at 80% 0%, rgba(24, 159, 184, 0.1), transparent 40%),
      radial-gradient(circle at 50% 80%, rgba(14, 102, 183, 0.08), transparent 40%);
    pointer-events: none;
    z-index: 0;
  }
`;

const PageBody = styled.main`
  flex: 1;
  width: min(1200px, 100%);
  margin: 0 auto;
  padding: 24px 16px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
  z-index: 1;
`;

const Header = styled.header`
  width: 100%;
  background: linear-gradient(120deg, #0077c8 0%, #189fb8 55%, #24c7c8 100%);
  color: white;
  padding: 32px 24px 40px;
  box-shadow: 0 20px 45px rgba(0, 80, 120, 0.2);
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: url('https://www.transparenttextures.com/patterns/asfalt-dark.png');
    opacity: 0.08;
  }

  .top-bar {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    opacity: 0.9;
    margin-bottom: 12px;
    position: relative;
    z-index: 1;
  }

  .hero {
    position: relative;
    z-index: 1;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .logo {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: white;
    color: #0077c8;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
  }

  .agency {
    font-size: 0.95rem;
    letter-spacing: 0.08em;
    margin: 0;
    text-transform: uppercase;
    opacity: 0.85;
  }

  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin: 4px 0 0 0;
  }

  .lead {
    margin-top: 16px;
    font-size: 1rem;
    line-height: 1.6;
    max-width: 760px;
    color: rgba(255, 255, 255, 0.95);
  }

  .hero-actions {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .hero-actions a {
    padding: 10px 16px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    color: white;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9rem;
    transition: background 0.2s ease;
  }

  .hero-actions a:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-top: 32px;
  position: relative;
  z-index: 1;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(6px);

  .label {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.85;
  }

  .value {
    margin-top: 6px;
    font-size: 1.8rem;
    font-weight: 700;
  }

  .subtext {
    font-size: 0.85rem;
    opacity: 0.85;
    margin-top: 4px;
  }
`;

const IntroSection = styled.section`
  background: white;
  border-radius: 20px;
  padding: 28px;
  border: 1px solid #dbe7f5;
  box-shadow: 0 20px 40px rgba(15, 66, 109, 0.08);
`;

const SectionHeading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;

  p {
    font-size: 0.85rem;
    letter-spacing: 0.12em;
    color: #0e84c6;
    text-transform: uppercase;
    margin: 0;
  }

  h3 {
    font-size: 1.4rem;
    margin: 4px 0 0;
  }

  span {
    font-size: 0.9rem;
    color: #59728c;
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
`;

const SummaryCard = styled.div`
  border: 1px solid #e3edf7;
  border-radius: 16px;
  padding: 18px;
  background: linear-gradient(180deg, #f7fbff 0%, #ffffff 100%);

  h4 {
    margin: 0 0 8px;
    font-size: 1.05rem;
    color: #0e5783;
  }

  p {
    margin: 0 0 12px;
    font-size: 0.92rem;
    color: #4a5e74;
    line-height: 1.5;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  li {
    font-size: 0.9rem;
    color: #1f2a44;
    display: flex;
    justify-content: space-between;
  }

  li span {
    color: #6b7d92;
  }
`;

const Badge = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  font-weight: 600;
`;

const SourceLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;

  a {
    text-decoration: none;
    font-size: 0.9rem;
    color: #0e84c6;
    border: 1px solid #cde3f6;
    padding: 8px 14px;
    border-radius: 999px;
    transition: all 0.2s ease;
  }

  a:hover {
    background: #e7f4ff;
  }
`;

const ChatShell = styled.section`
  background: white;
  border-radius: 20px;
  border: 1px solid #dbe7f5;
  box-shadow: 0 20px 40px rgba(15, 66, 109, 0.08);
  display: flex;
  flex-direction: column;
  height: 60vh;
  min-height: 480px;
`;

const ChatHeader = styled.div`
  padding: 20px 28px;
  border-bottom: 1px solid #e3edf7;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;

  p {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #0e84c6;
    margin: 0;
  }

  h3 {
    margin: 4px 0 0;
    font-size: 1.2rem;
  }

  span {
    font-size: 0.85rem;
    color: #5f738b;
  }
`;

const ChatContainer = styled.div`
  flex: 1;
  padding: 24px 28px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f7fbff;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c8d9ec;
    border-radius: 4px;
  }
`;

const MessageBubble = styled.div<{ isAI?: boolean }>`
  background: ${props => (props.isAI ? '#e6f2ff' : '#ffffff')};
  border: 1px solid ${props => (props.isAI ? '#b5d7ff' : '#e1e7ef')};
  align-self: ${props => (props.isAI ? 'flex-end' : 'flex-start')};
  padding: 12px 16px;
  border-radius: 16px;
  max-width: 80%;
  box-shadow: 0 6px 16px rgba(15, 66, 109, 0.05);
`;

const MessageContent = styled.div<{ isAI?: boolean }>`
  color: ${props => (props.isAI ? '#0f406d' : '#1f2a44')};
  font-size: 0.95rem;
  line-height: 1.5;
  word-break: break-word;
`;

const LoadingMessage = styled(MessageBubble)`
  background: #d1ecff;
  border-color: #9acdf5;
  align-self: flex-end;

  .loading-text {
    color: #0f406d;
    font-weight: 600;

    &::after {
      content: '...';
      animation: dots 1.5s steps(4, end) infinite;
      margin-left: 2px;
    }
  }

  @keyframes dots {
    0%, 20% { opacity: 0.2; }
    40% { opacity: 1; }
    100% { opacity: 0.2; }
  }
`;

const InputContainer = styled.div`
  padding: 20px 28px 24px;
  display: flex;
  gap: 12px;
  border-top: 1px solid #e3edf7;
  background: white;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #c8d9ec;
  border-radius: 999px;
  outline: none;
  font-size: 0.95rem;
  background: #f7fbff;
  color: #1f2a44;

  &:focus {
    border-color: #0e84c6;
    box-shadow: 0 0 0 3px rgba(14, 132, 198, 0.15);
  }

  &::placeholder {
    color: #7c8ea8;
  }
`;

const Button = styled.button<{ variant?: 'secondary' }>`
  padding: 12px 18px;
  border-radius: 999px;
  border: none;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  background: ${props => (props.variant === 'secondary' ? '#eef3f8' : '#0e84c6')};
  color: ${props => (props.variant === 'secondary' ? '#1f2a44' : 'white')};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 16px rgba(14, 132, 198, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const Footer = styled.footer`
  width: 100%;
  margin-top: 32px;
  text-align: center;
  font-size: 0.85rem;
  color: #5f738b;
  line-height: 1.6;

  a {
    color: #0e84c6;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;



const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('精神疾病的醫療代碼是多少？');
  const [chatStateId, setChatStateId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch('/chat/init', { method: 'POST' })
      .then(res => res.json() as Promise<ChatInitResponse>)
      .then(data => {
        setChatStateId(data.id);
        return fetch(`/chat/${data.id}`);
      })
      .then(res => res.json() as Promise<ChatResponse>)
      .then(data => setMessages(data.messages))
      .catch(console.error);
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatStateId) return;

    try {
      setIsLoading(true);
      const userMessage: Message = {
        id: crypto.randomUUID(),
        text: newMessage,
        timestamp: Date.now(),
        isAI: false
      };
      
      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');

      const response = await fetch(`/chat/${chatStateId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newMessage }),
      });
      const data = await response.json() as { messages: Message[] };
      
      if (data.messages && Array.isArray(data.messages)) {
        const aiMessage = data.messages[1];
        if (aiMessage) {
          setMessages(prev => [...prev, aiMessage]);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    if (!chatStateId) return;

    try {
      await fetch(`/chat/${chatStateId}`, { method: 'DELETE' });
      setMessages([]);
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <>
      <Global
        styles={css`
          .css-nldioq {
            background: #dff1ff !important;
            color: #0f406d;
          }
        `}
      />
      <AppContainer>
      <Header>
        <div className="top-bar">
          <span>全民健康保險｜National Health Insurance</span>
          <span>中文版｜English</span>
        </div>
        <div className="hero">
          <div className="brand">
            <div className="logo">NHI</div>
            <div>
              <p className="agency">衛生福利部中央健康保險署</p>
              <h1>健保支付點數智慧諮詢平台</h1>
            </div>
            <Badge>Beta</Badge>
          </div>
          <p className="lead">
            透過 Cloudflare AutoRAG 與 Workers AI，串接醫事服務支付標準、醫療服務給付規定與法規資料，協助醫療院所與民眾即時掌握健保支付點數資訊。
          </p>
          <div className="hero-actions">
            <a href="https://www.nhi.gov.tw/ch/mp-1.html" target="_blank" rel="noreferrer">健保署官網</a>
            <a href="https://www.nhi.gov.tw/ch/cp-2226-9747-1.html" target="_blank" rel="noreferrer">支付標準下載</a>
            <a href="https://developers.cloudflare.com/autorag/" target="_blank" rel="noreferrer">AutoRAG 架構說明</a>
          </div>
        </div>
        <StatsGrid>
          <StatCard>
            <div className="label">支付項目</div>
            <div className="value">12,584</div>
            <div className="subtext">醫事服務支付標準條目</div>
          </StatCard>
          <StatCard>
            <div className="label">最新更新</div>
            <div className="value">{new Date().toLocaleDateString('zh-TW')}</div>
            <div className="subtext">同步衛福部公告</div>
          </StatCard>
          <StatCard>
            <div className="label">模型</div>
            <div className="value">Workers AI</div>
            <div className="subtext">AutoRAG + Durable Objects</div>
          </StatCard>
        </StatsGrid>
      </Header>

      <PageBody>
        <IntroSection>
          <SectionHeading>
            <div>
              <p>資料與治理</p>
              <h3>RAG 參考來源</h3>
            </div>
            <span>最後更新：{new Date().toLocaleDateString('zh-TW')}</span>
          </SectionHeading>
          <SummaryGrid>
            <SummaryCard>
              <h4>醫事服務支付標準</h4>
              <p>依照醫療服務類別切分為多個 chunk，保留條文與點數欄位，確保回覆可追溯。</p>
              <ul>
                <li>手術處置 <span>4,316 筆</span></li>
                <li>檢查檢驗 <span>3,208 筆</span></li>
                <li>護理衛教 <span>1,122 筆</span></li>
              </ul>
            </SummaryCard>
            <SummaryCard>
              <h4>專科／部門支付點數</h4>
              <p>整合各醫療科別參考點數，提供民眾與院所快速查詢門診、急診與住院成本。</p>
              <ul>
                <li>內兒婦科 <span>涵蓋 24 科別</span></li>
                <li>重大傷病 <span>依分級呈現</span></li>
                <li>DRG 規則 <span>同步整理</span></li>
              </ul>
            </SummaryCard>
            <SummaryCard>
              <h4>法規／公告</h4>
              <p>結合衛福部及健保署公告，於回答中附上最新修訂依據與連結。</p>
              <ul>
                <li>健保法規 <span>30 份</span></li>
                <li>支付標準函釋 <span>58 則</span></li>
                <li>政策新聞 <span>即時更新</span></li>
              </ul>
            </SummaryCard>
          </SummaryGrid>
          <SourceLinks>
            <a href="https://www.nhi.gov.tw/ch/mp-1.html" target="_blank" rel="noreferrer">健保署入口網</a>
            <a href="https://www.nhi.gov.tw/ch/np-711-1.html" target="_blank" rel="noreferrer">醫療院所專區</a>
            <a href="https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0060001" target="_blank" rel="noreferrer">全民健康保險法</a>
            <a href="https://www.nhi.gov.tw/ch/cp-1895-285-1.html" target="_blank" rel="noreferrer">新聞與公告</a>
          </SourceLinks>
        </IntroSection>

        <ChatShell>
          <ChatHeader>
            <div>
              <p>諮詢視窗</p>
              <h3>提出關於健保支付點數的問題</h3>
            </div>
            <span>模型：Cloudflare Workers AI gpt-oss-120b + AutoRAG</span>
          </ChatHeader>
          <ChatContainer>
            {messages.map(message => {
              let content: string;
              if (typeof message.text === 'string') {
                content = message.text;
              } else if (message.text && typeof message.text === 'object') {
                const obj = message.text as any;
                if (obj.response) {
                  content = obj.response;
                } else if (obj.text) {
                  content = obj.text;
                } else if (obj.message) {
                  content = obj.message;
                } else {
                  content = JSON.stringify(obj);
                }
              } else {
                content = String(message.text);
              }

              return (
                <MessageBubble key={message.id} isAI={message.isAI}>
                  <MessageContent isAI={message.isAI}>{content}</MessageContent>
                </MessageBubble>
              );
            })}
            {isLoading && (
              <LoadingMessage isAI>
                <div className="loading-text">模型檢索中</div>
              </LoadingMessage>
            )}
          </ChatContainer>
          <InputContainer>
            <Input
              value={newMessage}
              onChange={handleInputChange}
              placeholder="例如：精神疾病的醫療代碼是多少？"
              disabled={isLoading}
            />
            <Button onClick={sendMessage} disabled={isLoading}>
              送出諮詢
            </Button>
            <Button variant="secondary" onClick={clearChat} disabled={isLoading}>
              清除對話
            </Button>
          </InputContainer>
        </ChatShell>
      </PageBody>

      <Footer>
        <div>本示範運行於 Cloudflare Workers、Durable Objects 以及 AutoRAG，僅供健保支付點數資訊查詢與教學使用。</div>
        <div>資料來源：衛生福利部中央健康保險署公開資訊、衛福部法規資料庫。原始碼：<a href="https://github.com/hcyuser/nhi-rag-bot" target="_blank" rel="noreferrer">GitHub</a></div>
      </Footer>
      </AppContainer>
    </>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}