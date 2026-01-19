import styled from 'styled-components';

interface LocationTimeDisplayProps {
  where?: string;
  when?: string;
}

const Container = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 5;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #fff;
  font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
`;

const Location = styled.div`
  background: rgba(0, 0, 0, 0.6);
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  border-left: 3px solid #ffd700;
`;

const Time = styled.div`
  background: rgba(0, 0, 0, 0.6);
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  border-left: 3px solid #4caf50;
`;

export const LocationTimeDisplay = ({ where, when }: LocationTimeDisplayProps) => {
  if (!where && !when) return null;

  return (
    <Container>
      {where && <Location>📍 {where}</Location>}
      {when && <Time>🕐 {when}</Time>}
    </Container>
  );
};

