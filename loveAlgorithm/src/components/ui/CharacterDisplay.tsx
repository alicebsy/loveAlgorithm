import styled from 'styled-components';

interface CharacterDisplayProps {
  characterImage?: string;
  characterName?: string;
  notCharacter?: boolean;
  location?: 1 | 2 | 3;
}

const CharacterContainer = styled.div<{ $location: 1 | 2 | 3 }>`
  position: fixed;
  bottom: 0;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  max-width: 80%;
  max-height: 100vh;

  ${(props) => {
    if (props.$location === 1) {
      // 왼쪽 - 간격 줄이기 (25% → 20%)
      return `
        left: 20%;
        transform: translateX(-50%);
        justify-content: center;
      `;
    } else if (props.$location === 3) {
      // 오른쪽 - 간격 줄이기 (25% → 20%)
      return `
        right: 20%;
        transform: translateX(50%);
        justify-content: center;
      `;
    } else {
      // 가운데 (기본값)
      return `
        left: 50%;
        transform: translateX(-50%);
        justify-content: center;
      `;
    }
  }}
`;

const CharacterImage = styled.img<{ $visible: boolean }>`
  max-width: 100%;
  max-height: 100vh;
  object-fit: contain;
  object-position: bottom;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
`;

export const CharacterDisplay = ({ characterImage, characterName, notCharacter, location = 2 }: CharacterDisplayProps) => {
  // nobody이거나 notCharacter이거나 이미지가 없으면 표시하지 않음
  if (notCharacter || !characterImage || characterImage.includes('nobody') || characterName === 'nobody') {
    return null;
  }

  return (
    <CharacterContainer $location={location}>
      <CharacterImage src={characterImage} alt={characterName || 'Character'} $visible={!!characterImage} />
    </CharacterContainer>
  );
};

