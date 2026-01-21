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
  font-size: 13px;
  color: #000;
  font-weight: 600;
  font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
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
  font-size: 19px;
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
  font-size: 16px;
  font-weight: 600;
  color: #000;
  flex: 1;
  font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
`;

const HeaderRight = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #000;
  font-size: 17px;
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
  font-size: 13px;
  flex-shrink: 0;
  font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
`;

const SenderName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #000;
  font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
`;

const MessageBubble = styled.div<{ $isMine: boolean; $hasProfile: boolean }>`
  background: #ffffff;
  border-radius: 12px;
  padding: 10px 14px;
  max-width: 80%;
  font-size: 14px;
  color: #000;
  word-wrap: break-word;
  white-space: pre-wrap;
  font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
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
  font-size: 17px;
  font-weight: 700;
  color: #000;
  text-align: center;
  padding: 0 24px;
  font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
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
  font-size: 15px;
  width: 100%;
  transition: background 0.2s;
  font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
  
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
  font-size: 17px;
  font-weight: 700;
  color: #000;
  font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
`;

const TeamInfoNumber = styled.div`
  font-size: 34px;
  font-weight: 700;
  color: #4da6ff;
  font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
`;


const TeamInfoBottom = styled.div`
  background: #ffffff;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TeamInfoResult = styled.div`
  font-size: 14px;
  color: #000;
  text-align: center;
  margin-bottom: 8px;
  font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
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
  font-size: 14px;
  color: #999;
  font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
`;

const InputIcon = styled.button`
  background: none;
  border: none;
  color: #888;
  font-size: 19px;
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
  
  // 카톡 제목 결정: script 끝에 [xxx] 패턴이 있으면 xxx를 톡방 이름으로 설정 (xxx는 어떤 이름이든 가능)
  const getChatTitle = (): string => {
    // 모든 메시지의 script를 확인
    for (const msg of messages) {
      const script = msg.message || (msg as any).text || '';
      // script 끝에 [xxx] 패턴이 있는지 확인
      const match = script.match(/\[([^\]]+)\]\s*$/);
      if (match) {
        return match[1]; // [xxx]에서 xxx 부분 반환
      }
    }
    // 패턴이 없으면 기본값
    return '몰입캠프 2분반';
  };
  
  const chatTitle = getChatTitle();
  
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
    // msg 객체의 구조 확인: text 또는 message 필드 사용
    const charId = msg.characterId || (msg as any).sender;
    const script = msg.message || (msg as any).text || '';
    const msgType = msg.type || (msg as any).type || '';
    const align = isHero(charId) ? 'right' : 'left';
    const characterName = getCharacterNameFromId(charId);
    const characterInitial = characterName.charAt(0);
    
    // 이전 메시지 확인
    const prevMsg = index > 0 ? messages[index - 1] : null;
    const prevCharId = prevMsg ? (prevMsg.characterId || (prevMsg as any).sender) : null;
    const prevType = prevMsg ? (prevMsg.type || (prevMsg as any).type || '') : '';
    
    // 연속 메시지 판단: 같은 사람이고 이전 메시지도 카톡 타입이면 연속
    const isConsecutive = prevMsg && 
      prevCharId === charId && 
      prevType?.startsWith('카톡') && 
      msgType?.startsWith('카톡');
    
    // [xx] 패턴 추출 함수
    const getChatTitleFromScript = (scriptText: string): string | null => {
      const match = scriptText.match(/\[([^\]]+)\]\s*$/);
      return match ? match[1] : null;
    };
    
    // 현재 메시지와 이전 메시지의 [xx] 패턴 확인
    const currentChatTitle = getChatTitleFromScript(script);
    const prevChatTitle = prevMsg ? getChatTitleFromScript(prevMsg.message || (prevMsg as any).text || '') : null;
    
    // [xx] 패턴이 연속인지 확인 (둘 다 있고 같으면 연속)
    const isChatTitleConsecutive = currentChatTitle && prevChatTitle && currentChatTitle === prevChatTitle;
    
    // MessageHeader는 연속 메시지가 아니거나, [xx] 패턴이 연속이 아닐 때만 표시
    const shouldShowHeader = !isConsecutive || !isChatTitleConsecutive;
    
    const messageHeader = shouldShowHeader ? (
      <MessageHeader key={`header-${index}`} style={{ alignSelf: align === 'right' ? 'flex-end' : 'flex-start' }}>
        <ProfileImage>{characterInitial}</ProfileImage>
        <SenderName>{characterName}</SenderName>
      </MessageHeader>
    ) : null;
    
    // script의 시작 부분에 따라 다른 컴포넌트 렌더링
    let content = null;
    let displayText = script;
    
    // 메시지 끝에 있는 [xxx] 패턴(톡방 이름) 제거 함수
    const removeChatTitlePattern = (text: string): string => {
      // 메시지 끝에 [xxx] 패턴이 있으면 제거 (xxx는 어떤 이름이든 가능)
      return text.replace(/\s*\[([^\]]+)\]\s*$/, '');
    };
    
    if (script.startsWith('[image]')) {
      // 이미지 메시지
      let imagePath = script.replace('[image]', '').trim();
      // 이미지 경로에서도 [xxx] 패턴 제거
      imagePath = removeChatTitlePattern(imagePath);
      // 경로가 /로 시작하지 않으면 / 추가
      if (imagePath && !imagePath.startsWith('/')) {
        imagePath = '/' + imagePath;
      }
      // 한글 파일명을 위한 URL 인코딩 (경로 부분은 인코딩하지 않고 파일명만 인코딩)
      const pathParts = imagePath.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const dirPath = pathParts.slice(0, -1).join('/');
      const encodedPath = dirPath + '/' + encodeURIComponent(fileName);
      
      content = (
        <MessageImage key={`image-${index}`} $align={align}>
          <ImageContent 
            src={encodedPath || '/characters/default.png'} 
            alt="이미지"
            onError={(e) => {
              console.error('이미지 로드 실패:', encodedPath, '원본 경로:', imagePath);
              // 인코딩된 경로가 실패하면 원본 경로로 재시도
              if ((e.target as HTMLImageElement).src !== imagePath) {
                (e.target as HTMLImageElement).src = imagePath;
              } else {
                // 이미지 로드 실패 시 기본 이미지 표시
                (e.target as HTMLImageElement).src = '/characters/default.png';
              }
            }}
            onLoad={() => {
              console.log('이미지 로드 성공:', encodedPath);
            }}
          />
        </MessageImage>
      );
    } else if (script.startsWith('[뽑기_시작]')) {
      // MinigameNotification
      displayText = script.replace('[뽑기_시작]', '');
      // 메시지 끝에 있는 [xxx] 패턴 제거
      displayText = removeChatTitlePattern(displayText);
      content = (
        <MinigameNotification key={`notification-${index}`} style={{ alignSelf: align === 'right' ? 'flex-end' : 'flex-start' }}>
          <FlagsContainer>
            <Flag 
              src={(() => {
                // 인생네컷.png와 동일한 방식으로 경로 처리
                let imagePath = '/icon/자리뽑기_flag.png';
                // 경로가 /로 시작하지 않으면 / 추가
                if (imagePath && !imagePath.startsWith('/')) {
                  imagePath = '/' + imagePath;
                }
                // 한글 파일명을 위한 URL 인코딩 (경로 부분은 인코딩하지 않고 파일명만 인코딩)
                const pathParts = imagePath.split('/');
                const fileName = pathParts[pathParts.length - 1];
                const dirPath = pathParts.slice(0, -1).join('/');
                return dirPath + '/' + encodeURIComponent(fileName);
              })()}
              alt="깃발" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                console.error('깃발 이미지 로드 실패:', target.src, '원본 경로:', '/icon/자리뽑기_flag.png');
                // 인코딩된 경로가 실패하면 원본 경로로 재시도
                if (target.src !== '/icon/자리뽑기_flag.png') {
                  target.src = '/icon/자리뽑기_flag.png';
                } else {
                  // 이미지 로드 실패 시 기본 이미지 표시
                  target.src = '/characters/default.png';
                }
              }}
              onLoad={() => {
                console.log('깃발 이미지 로드 성공');
              }}
            />
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
      // 메시지 끝에 있는 [xxx] 패턴 제거
      displayText = removeChatTitlePattern(displayText);
      content = (
        <TeamInfoCard key={`teamcard-${index}`} $align={align}>
          <TeamInfoTop>
            <TeamInfoText>
              <TeamInfoLabel>나의 팀은</TeamInfoLabel>
              <TeamInfoNumber>4팀</TeamInfoNumber>
            </TeamInfoText>
            <FlagsContainer>
              <Flag 
                src={(() => {
                  // 인생네컷.png와 동일한 방식으로 경로 처리
                  let imagePath = '/icon/자리뽑기_flag.png';
                  // 경로가 /로 시작하지 않으면 / 추가
                  if (imagePath && !imagePath.startsWith('/')) {
                    imagePath = '/' + imagePath;
                  }
                  // 한글 파일명을 위한 URL 인코딩 (경로 부분은 인코딩하지 않고 파일명만 인코딩)
                  const pathParts = imagePath.split('/');
                  const fileName = pathParts[pathParts.length - 1];
                  const dirPath = pathParts.slice(0, -1).join('/');
                  return dirPath + '/' + encodeURIComponent(fileName);
                })()}
                alt="깃발" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  console.error('깃발 이미지 로드 실패:', target.src, '원본 경로:', '/icon/자리뽑기_flag.png');
                  // 인코딩된 경로가 실패하면 원본 경로로 재시도
                  if (target.src !== '/icon/자리뽑기_flag.png') {
                    target.src = '/icon/자리뽑기_flag.png';
                  } else {
                    // 이미지 로드 실패 시 기본 이미지 표시
                    target.src = '/characters/default.png';
                  }
                }}
                onLoad={() => {
                  console.log('깃발 이미지 로드 성공');
                }}
              />
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
      // 메시지 끝에 있는 [xxx] 패턴 제거
      displayText = removeChatTitlePattern(displayText);
      content = (
        <MessageBubble key={`bubble-${index}`} $isMine={isHero(charId)} $hasProfile={true} style={{ alignSelf: align === 'right' ? 'flex-end' : 'flex-start' }}>
          {displayText}
        </MessageBubble>
      );
    }
    
    return (
      <div key={`message-${index}`} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {shouldShowHeader && messageHeader}
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
            <ChatTitle>{chatTitle}</ChatTitle>
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
