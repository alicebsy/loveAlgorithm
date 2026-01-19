import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { characterId } from '../../data/constants';
import { useGameStore } from '../../store/gameStore';

interface KakaoTalkMessage {
  message: string;
  characterName?: string;
  type?: string;
  characterId?: string;
}

interface KakaoTalkModalProps {
  messages: KakaoTalkMessage[];
  onClose?: () => void;
  onTeamView?: () => void;
  currentType?: string;
  currentCharacterId?: string;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  pointer-events: none;
  backdrop-filter: blur(4px);
`;

const PhoneContainer = styled.div`
  width: 300px;
  height: 534px;
  background: #000;
  border-radius: 35px;
  padding: 16px 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  position: relative;
  pointer-events: auto;
`;

const PhoneScreen = styled.div`
  width: 100%;
  height: 100%;
  background: #ABC0D1;
  border-radius: 25px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const StatusBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #ABC0D1;
  font-size: 17px;
  color: #000;
  font-weight: 600;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #ABC0D1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  gap: 12px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #000;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChatTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #000;
  flex: 1;
`;

const HeaderRight = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #000;
  font-size: 22px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChatArea = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  overflow-x: hidden;
  background: #ABC0D1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  flex-direction: row;
`;

const ProfileImage = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #4da6ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  font-size: 17px;
  flex-shrink: 0;
`;

const SenderName = styled.div`
  font-size: 17px;
  font-weight: 600;
  color: #000;
`;

const MessageBubble = styled.div<{ $isMine: boolean; $hasProfile: boolean }>`
  background: #ffffff;
  border-radius: 12px;
  padding: 10px 14px;
  max-width: 80%;
  font-size: 18px;
  color: #000;
  word-wrap: break-word;
  white-space: pre-wrap;
`;

const MessageImage = styled.div<{ $align?: 'left' | 'right' }>`
  margin: 4px 0;
  max-width: 80%;
  align-self: ${(props) => (props.$align === 'right' ? 'flex-end' : 'flex-start')}; 
`;

const ImageContent = styled.img`
  width: 100%;
  max-width: 200px;
  border-radius: 12px;
  object-fit: contain;
  background: #f5f5f5;
`;

const MinigameNotification = styled.div`
  background: #e3f4fc;
  border-radius: 16px;
  padding: 24px 0 0 0;
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  overflow: hidden;
  min-height: 359px;
  max-width: 80%;
`;

const FlagsContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
`;

const Flag = styled.img`
  width: 60px;
  height: 84px;
  object-fit: contain;
`;

const MinigameTitle = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #000;
  text-align: center;
  padding: 0 24px;
`;

const MinigameDescription = styled.div`
  background: #ffffff;
  border-radius: 0;
  padding: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  margin-bottom: 0px;
  margin-top: auto;
`;

const TeamViewButton = styled.button<{ $disabled: boolean }>`
  background: #f6f7f8;
  color: #000000;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 19px;
  width: 100%;
  transition: background 0.2s;
  
  &:hover {
    background: #e8e9ea;
  }
  
  &:active {
    background: #f6f7f8;
  }
  
  &:focus {
    background: #f6f7f8;
    outline: none;
  }
`;

const TeamInfoCard = styled.div<{ $align?: 'left' | 'right' }>`
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  margin: 16px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  align-self: ${(props) => (props.$align === 'right' ? 'flex-end' : 'flex-start')};
  max-width: 80%;
  flex-shrink: 0;
`;

const TeamInfoTop = styled.div`
  background: #e8f4f8;
  padding: 32px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const TeamInfoText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TeamInfoLabel = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #000;
`;

const TeamInfoNumber = styled.div`
  font-size: 43px;
  font-weight: 700;
  color: #4da6ff;
`;


const TeamInfoBottom = styled.div`
  background: #ffffff;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TeamInfoResult = styled.div`
  font-size: 18px;
  color: #000;
  text-align: center;
  margin-bottom: 8px;
`;

const InputArea = styled.div`
  height: 50px;
  background: #ffffff;
  border-top: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
`;

const InputField = styled.div`
  flex: 1;
  padding: 7px 14px;
  background: #f5f5f5;
  border-radius: 20px;
  font-size: 18px;
  color: #999;
`;

const InputIcon = styled.button`
  background: none;
  border: none;
  color: #888;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const KakaoTalkModal = ({ messages, onClose, onTeamView }: KakaoTalkModalProps) => {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const { heroName } = useGameStore();
  
  // character_id로부터 이름 가져오기
  const getCharacterNameFromId = (charId?: string): string => {
    if (!charId) return '운영진';
    if (charId === characterId.hero) return heroName;
    return charId;
  };
  
  // characterId가 hero인지 확인
  const isHero = (charId?: string) => charId === characterId.hero;
  
  // 메시지가 추가되면 자동으로 스크롤
  useEffect(() => {
    if (chatAreaRef.current) {
      const scrollTimer = setTimeout(() => {
        if (chatAreaRef.current) {
          chatAreaRef.current.scrollTo({
            top: chatAreaRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 300);
      
      return () => clearTimeout(scrollTimer);
    }
  }, [messages]);
  
  const handleTeamViewClick = () => {
    if (isButtonClicked) return;
    if (onTeamView) {
      onTeamView();
      setIsButtonClicked(true);
    }
  };
  
  // 메시지 렌더링 함수
  const renderMessage = (msg: KakaoTalkMessage, index: number) => {
    const charId = msg.characterId;
    const script = msg.message || '';
    const align = isHero(charId) ? 'right' : 'left';
    const characterName = getCharacterNameFromId(charId);
    const characterInitial = characterName.charAt(0);
    
    // MessageHeader는 항상 먼저 생성
    const messageHeader = (
      <MessageHeader key={`header-${index}`} style={{ alignSelf: align === 'right' ? 'flex-end' : 'flex-start' }}>
        <ProfileImage>{characterInitial}</ProfileImage>
        <SenderName>{characterName}</SenderName>
      </MessageHeader>
    );
    
    // script의 시작 부분에 따라 다른 컴포넌트 렌더링
    let content = null;
    let displayText = script;
    
    if (script.startsWith('[image]')) {
      // 이미지 메시지
      const imagePath = script.replace('[image]', '').trim();
      content = (
        <MessageImage key={`image-${index}`} $align={align}>
          <ImageContent 
            src={imagePath || '/characters/default.png'} 
            alt="이미지"
            onError={(e) => {
              // 이미지 로드 실패 시 기본 이미지 표시
              (e.target as HTMLImageElement).src = '/characters/default.png';
            }}
          />
        </MessageImage>
      );
    } else if (script.startsWith('[뽑기_시작]')) {
      // MinigameNotification
      displayText = script.replace('[뽑기_시작]', '');
      content = (
        <MinigameNotification key={`notification-${index}`} style={{ alignSelf: align === 'right' ? 'flex-end' : 'flex-start' }}>
          <FlagsContainer>
            <Flag src="public/icon/자리뽑기_flag.png" alt="깃발" />
          </FlagsContainer>
          <MinigameTitle>{displayText}</MinigameTitle>
          <MinigameDescription>
            <div>팀 나누기 시작! 누가 같은 팀인지 확인해보세요.</div>
            <TeamViewButton onClick={handleTeamViewClick} $disabled={isButtonClicked} disabled={isButtonClicked}>
              내 팀 보기
            </TeamViewButton>
          </MinigameDescription>
        </MinigameNotification>
      );
    } else if (script.startsWith('[뽑기]')) {
      // TeamInfoCard
      displayText = script.replace('[뽑기]', '');
      content = (
        <TeamInfoCard key={`teamcard-${index}`} $align={align}>
          <TeamInfoTop>
            <TeamInfoText>
              <TeamInfoLabel>나의 팀은</TeamInfoLabel>
              <TeamInfoNumber>4팀</TeamInfoNumber>
            </TeamInfoText>
            <FlagsContainer>
              <Flag src="public/icon/자리뽑기_flag.png" alt="깃발" />
            </FlagsContainer>
          </TeamInfoTop>
          <TeamInfoBottom>
            <TeamInfoResult>
              팀 나누기 결과 나는 4팀입니다.
            </TeamInfoResult>
          </TeamInfoBottom>
        </TeamInfoCard>
      );
    } else {
      // MessageBubble (일반 메시지 - [message]로 시작하거나 태그가 없음)
      if (script.startsWith('[message]')) {
        displayText = script.replace('[message]', '');
      }
      content = (
        <MessageBubble key={`bubble-${index}`} $isMine={isHero(charId)} $hasProfile={true} style={{ alignSelf: align === 'right' ? 'flex-end' : 'flex-start' }}>
          {displayText}
        </MessageBubble>
      );
    }
    
    return (
      <div key={`message-${index}`} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {messageHeader}
        {content}
      </div>
    );
  };

  return (
    <Overlay onClick={onClose}>
      <PhoneContainer onClick={(e) => e.stopPropagation()}>
        <PhoneScreen>
          <StatusBar>
            <span>2:07</span>
            <span></span>
            <span>📶🔋 89%</span>
          </StatusBar>
          <Header>
            <BackButton onClick={onClose}>←</BackButton>
            <ChatTitle>몰입캠프 2분반</ChatTitle>
            <HeaderRight>
              <IconButton>🔍</IconButton>
              <IconButton>☰</IconButton>
            </HeaderRight>
          </Header>
          <ChatArea ref={chatAreaRef}>
            {/* 동적으로 추가되는 모든 메시지들 */}
            {messages.map((msg, index) => renderMessage(msg, index))}
          </ChatArea>
          <InputArea>
            <InputIcon>+</InputIcon>
            <InputField>메시지 입력</InputField>
            <InputIcon>#</InputIcon>
          </InputArea>
        </PhoneScreen>
      </PhoneContainer>
    </Overlay>
  );
};
