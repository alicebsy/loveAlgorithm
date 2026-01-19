import styled from 'styled-components';

interface CharacterDisplayProps {
  characterImage?: string;
  characterName?: string;
  notCharacter?: boolean;
}

const CharacterContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  max-width: 80%;
  max-height: 100vh;
`;

const CharacterImage = styled.img<{ $visible: boolean }>`
  max-width: 100%;
  max-height: 100vh;
  object-fit: contain;
  object-position: bottom;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
`;

export const CharacterDisplay = ({ characterImage, characterName, notCharacter }: CharacterDisplayProps) => {
  // nobody이거나 notCharacter이거나 이미지가 없으면 표시하지 않음
  if (notCharacter || !characterImage || characterImage.includes('nobody') || characterName === 'nobody') {
    return null;
  }

  return (
    <CharacterContainer>
      <CharacterImage src={characterImage} alt={characterName || 'Character'} $visible={!!characterImage} />
    </CharacterContainer>
  );
};

