import type { GameEvent } from '../types/game.types';
import { chapterId, characterId, characterImageId, backgroundImageId, backgroundSoundId, effectSoundId } from './constants';

// 새로운 형식의 스크립트 데이터
export const gameEvents: Record<string, GameEvent> = {
  // ----------------------------------------------------------------
  // Scene 1-1: init() - 시작 (도훈의 방)
  // ----------------------------------------------------------------
  'chapter1_scene1': {
    chapter_id: chapterId.chapter1,
    next_scene_id: 'chapter1_scene2',
    event: 1,
    scenario: [
      {
        script: 'init()',
        type: '전환',
        character_image_id: { all: characterImageId.nobody },
        id: 'chapter1_scene1_0',
        index: 0,
      },
      {
        script: '📧 [합격 메일]이 도착했습니다.', // [시스템] 제거
        type: 'narration', // 시스템 메시지는 내레이션 처리
        background_image_id: backgroundImageId.dohoon_room,
        background_sound_id: backgroundSoundId.alert,
        id: 'chapter1_scene1_1',
        index: 1,
      },
      {
        script: '모니터 화면에 "제 14회 KAIST 몰입캠프 합격"이라는 글자가 떠 있다.', // [해설]
        type: 'narration',
        background_image_id: backgroundImageId.dohoon_room_monitor,
        id: 'chapter1_scene1_2',
        index: 2,
      },
      {
        script: '휴, 다행이다. 이번 방학은 헛되이 보내지 않겠어.', // [도훈의 독백] -> type: think
        character_id: characterId.hero,
        type: 'think',
        id: 'chapter1_scene1_3',
        index: 3,
      },
      {
        script: '내 목표는 오로지 하나. 코딩 실력 향상.',
        character_id: characterId.hero,
        type: 'think',
        id: 'chapter1_scene1_4',
        index: 4,
      },
      {
        script: '연애? 그런 비효율적인 프로세스는 내 메모리에 할당하지 않는다.',
        character_id: characterId.hero,
        type: 'think',
        id: 'chapter1_scene1_5',
        index: 5,
      },
      {
        script: '남들에게 피해 안 주고, 조용히 알고리즘이나 깎다가 오는 거야. 완벽해.',
        character_id: characterId.hero,
        type: 'think',
        id: 'chapter1_scene1_6',
        index: 6,
      },
      {
        script: '카톡이 울린다.', // [카톡]
        type: 'text',
        effect_sound_id: effectSoundId.kakao_alert,
        id: 'chapter1_scene1_7',
        index: 7,
      },
      {
        script: '[message]안녕하세요! 2분반 여러분 환영합니다. 내일 오전 11시까지 카이마루(북측 식당) 앞으로 모여주세요!', // [운영진]
        character_id: characterId.manager,
        type: '카톡',
        id: 'chapter1_scene1_8',
        index: 8,
      },
      {
        script: '내일 11시 집합이라... 일찍 자고 일찍 일어나야 겠다', // [도훈의 독백]
        character_id: characterId.hero,
        type: 'think',
        background_image_id: backgroundImageId.dohoon_room,
        id: 'chapter1_scene1_9',
        index: 9,
      },

    ],
  },

  // ----------------------------------------------------------------
  // Scene 1-2: Broadcast Receiver - 착각 (카이마루 앞)
  // ----------------------------------------------------------------
  'chapter1_scene2': {
    chapter_id: chapterId.chapter1,
    next_scene_id: 'chapter1_scene3',
    event: 2,
    scenario: [
      {
        script: '',
        type: '전환',
        character_image_id: { all: characterImageId.nobody },
        id: 'chapter1_scene2_0',
        index: 10,
      },
      {
        script: '11시 집합인데 긴장해서 10시에 와버렸다. TimeLimit 설정을 너무 넉넉하게 잡았나.', // [도훈의 독백]
        character_id: characterId.hero,
        type: 'think',
        background_image_id: backgroundImageId.kaimaru_front,
        background_sound_id: backgroundSoundId.morning_ambience,
        id: 'chapter1_scene2_1',
        index: 1,
      },
      {
        script: '아는 사람 마주치면 피곤한데... 일단 안으로 들어가자.',
        character_id: characterId.hero,
        type: 'think',
        id: 'chapter1_scene2_2',
        index: 2,
      },
      {
        script: '그때, 뒤에서 누군가 도훈을 부른다', // (해설 - 괄호 안의 지문)
        type: 'narration',
        id: 'chapter1_scene2_3',
        index: 3,
      },
      {
        script: '저기요! 학생증 떨어뜨리셨어요!', // [지수]
        character_id: characterId.jisoo,
        character_image_id: { 2: characterImageId.jisoo_hello },
        type: 'text',
        id: 'chapter1_scene2_4',
        index: 4,
      },
      {
        script: '학생증에 적힐 이름을 입력하세요:', // [시스템]
        type: 'input',
        id: 'chapter1_scene2_5',
        index: 5,
      },
      {
        script: '여기요, 이도훈 님? 어! 혹시 몰입캠프 오셨어요?', // [지수]
        character_id: characterId.jisoo,
        character_image_id: { 2: characterImageId.jisoo_smile },
        type: 'text',
        id: 'chapter1_scene2_6',
        index: 6,
      },
      {
        script: '아... 네, 감사합니다.', // [도훈]
        character_id: characterId.hero,
        type: 'text',
        id: 'chapter1_scene2_7',
        index: 7,
      },
      {
        script: '와 대박! 저돈데! 전 1분반 한지수예요. 반갑습니당!', // [지수]
        character_id: characterId.jisoo,
        character_image_id: { 2: characterImageId.jisoo_smile },
        type: 'text',
        id: 'chapter1_scene2_8',
        index: 8,
      },
      {
        script: '근데 몇 살이세요?',
        character_id: characterId.jisoo,
        type: 'text',
        id: 'chapter1_scene2_9',
        index: 9,
      },
      {
        script: '스물넷입니다.', // [도훈]
        character_id: characterId.hero,
        type: 'text',
        id: 'chapter1_scene2_10',
        index: 10,
      },
      {
        script: '아, 오빠네! 저 스물하나예요. 말 놔도 되죠? 오빠 안녕!', // [지수]
        character_id: characterId.jisoo,
        character_image_id: { 2: characterImageId.jisoo_hello },
        type: 'text',
        id: 'chapter1_scene2_11',
        index: 11,
      },
      {
        script: '오... 오빠? 만난 지 1분 만에 반말 모드 활성화라고?', // [도훈의 독백]
        character_id: characterId.hero,
        type: 'think',
        effect_sound_id: effectSoundId.shock,
        id: 'chapter1_scene2_12',
        index: 12,
      },
      {
        script: '이 친화력은 뭐지? 혹시... 나한테 관심 있나?',
        character_id: characterId.hero,
        type: 'think',
        id: 'chapter1_scene2_13',
        index: 13,
      },
      {
        script: '이성적인 호감이 아니고서야 이렇게 급발진할 리가...',
        character_id: characterId.hero,
        type: 'think',
        id: 'chapter1_scene2_14',
        index: 14,
      },
      {
        script: '(깔깔 웃으며) 뭐야, 오빠 왜 이렇게 당황해? 귀엽게 ㅋㅋㅋ', // [지수]
        character_id: characterId.jisoo,
        character_image_id: { 2: characterImageId.jisoo_smile },
        type: 'text',
        id: 'chapter1_scene2_15',
        index: 15,
      },
      {
        script: "'귀엽다'까지 나왔다. 이건 True다. 내 인생에도 봄날이...", // [도훈의 독백]
        character_id: characterId.hero,
        type: 'think',
        background_sound_id: backgroundSoundId.romantic,
        id: 'chapter1_scene2_16',
        index: 16,
      },
      {
        script: '그때, 문이 열리고 다른 학생들이 우르르 들어온다', // (해설 - 괄호 안의 지문)
        type: 'narration',
        background_sound_id: backgroundSoundId.noise,
        id: 'chapter1_scene2_17',
        index: 17,
      },
      {
        script: '(도훈을 지나쳐 뛰어가며) 어!! 안녕하세요~! 몰입캠프시죠? 여기예요 여기!', // [지수]
        character_id: characterId.jisoo,
        character_image_id: { 2: characterImageId.jisoo_hello },
        type: 'text',
        id: 'chapter1_scene2_18',
        index: 18,
      },
      {
        script: '와, 짐 무겁죠? 제가 들어드릴까요? 저 1분반 한지수예요! 말 놔도 되죠?!',
        character_id: characterId.jisoo,
        type: 'text',
        id: 'chapter1_scene2_19',
        index: 19,
      },
      {
        script: '...아. Unicast가 아니라 Broadcast였구나.', // [도훈의 독백]
        character_id: characterId.hero,
        type: 'think',
        background_sound_id: backgroundSoundId.comical_fail,
        id: 'chapter1_scene2_20',
        index: 20,
      },
      {
        script: '나한테만 보낸 패킷이 아니었어.',
        character_id: characterId.hero,
        type: 'think',
        id: 'chapter1_scene2_21',
        index: 21,
      },
      {
        script: '그래, 나랑은 다른 세상 사람이다. 기대하지 말자. Expectation = Null.',
        character_id: characterId.hero,
        type: 'think',
        id: 'chapter1_scene2_22',
        index: 22,
      },
    ],
  },
  // ----------------------------------------------------------------
  // Scene 1-3: Dark_Mode - 짝꿍
  // ----------------------------------------------------------------
  'chapter1_scene3': {
    chapter_id: chapterId.chapter1,
    next_scene_id: 'chapter1_scene4_intro',
    event: 3,
    scenario: [
      {
        script: '',
        type: '전환',
        character_image_id: { all: characterImageId.nobody },
        id: 'chapter1_scene3_0',
        index: 23,
      },
      {
        script: '오후 2시 20분. 강의실에 사람들이 많이 있다.',
        character_id: characterId.hero,
        character_image_id: { 2: characterImageId.nobody },
        type: 'think',
        background_image_id: backgroundImageId.classroom_dohee,
        background_sound_id: backgroundSoundId.typing_noise,
        id: 'chapter1_scene3_1',
        index: 1,
      },
      {
        script: '내 앞자리에 후드티를 푹 눌러쓴 여자가 앉아있다. 주변 온도가 2도는 낮아 보인다.',
        character_id: characterId.hero,
        type: 'think',
        id: 'chapter1_scene3_2',
        index: 2,
      },
      {
        script: '저분은... 포스가 장난 아닌데. 접근 금지(`Access Denied`) 구역이다.',
        character_id: characterId.hero,
        type: 'think',
        id: 'chapter1_scene3_3',
        index: 3,
      },
      {
        script: '어?... [솔의 눈]?',
        character_id: characterId.hero,
        type: 'think',
        background_image_id: backgroundImageId.dohee_can_closeup,
        id: 'chapter1_scene3_4',
        index: 4,
      },
      {
        script: '(뒤에서 소근소근) 야, 동휘야. 저기 앞자리 여자분 혼자 계시는데 말 걸어볼까? 예쁘실 것 같은데.',
        character_id: characterId.myeongseong,
        character_image_id: { 2: characterImageId.dohee_access_denied },
        type: 'text',
        background_image_id: backgroundImageId.classroom,
        id: 'chapter1_scene3_5',
        index: 5,
      },
      {
        script: '미쳤냐? 딱 봐도 건드리면 문다. 그냥 앞이나 봐.',
        character_id: characterId.donghwi,
        type: 'text',
        id: 'chapter1_scene3_6',
        index: 6,
      },
      {
        script: '자~ 이제 1주차 짝꿍 배정하겠습니다!',
        character_id: characterId.manager,
        character_image_id: { 2: characterImageId.manager },
        background_image_id: backgroundImageId.classroom_back,
        type: 'text',
        id: 'chapter1_scene3_7',
        index: 7,
      },
      {
        script: '이도훈 님은... 탁한진 님!',
        character_id: characterId.manager,
        type: 'text',
        id: 'chapter1_scene3_8',
        index: 8,
      },
      {
        script: '휴, 다행이다. 저 앞자리 분이랑만 안 걸리면 돼.',
        character_id: characterId.hero,
        type: 'think',
        id: 'chapter1_scene3_9',
        index: 9,
      },
      {
        script: '(다크서클 가득한 눈으로) ...안녕하세요. 저희 안드로이드 스튜디오 쓰죠?',
        character_id: characterId.hanjin,
        character_image_id: { 2: characterImageId.hanjin },
        type: 'text',
        id: 'chapter1_scene3_10',
        index: 10,
      },
      {
        script: '전 백엔드 짤 테니까 그쪽이 UI 하실래요?',
        character_id: characterId.hanjin,
        type: 'text',
        id: 'chapter1_scene3_11',
        index: 11,
      },
      {
        script: '아, 네. 일단 기획부터 하시죠',
        character_id: characterId.hero,
        type: 'text',
        id: 'chapter1_scene3_12',
        index: 12,
      },
      {
        script: '그렇게 남자 둘의 칙칙한 코딩이 시작되었다.',
        character_id: characterId.hero,
        type: 'think',
        id: 'chapter1_scene3_13',
        index: 13,
      },
    ],
  },

  // ----------------------------------------------------------------
  // Scene 1-4 (Part 1): 회식 시작 ~ 편의점 선택지
  // ----------------------------------------------------------------
  'chapter1_scene4_intro': {
    chapter_id: chapterId.chapter1,
    next_scene_id: '',
    event: 4,
    scenario: [
      {
        script: '',
        type: '전환',
        character_image_id: { all: characterImageId.nobody },
        id: 'chapter1_scene4_intro_0',
        index: 14,
      },
      {
        script: '여러분! 코딩하느라 힘드시죠? 오늘 회식입니다! 다들 나오세요!',
        character_id: characterId.manager,
        character_image_id: { 2: characterImageId.manager },
        type: 'text',
        background_image_id: backgroundImageId.classroom_back,
        background_sound_id: backgroundSoundId.party_noise,
        id: 'chapter1_scene4_intro_1',
        index: 1,
      },
      {
        script: '아... 귀찮은데. `Skip` 버튼 없나. 그냥 대충 먹고 가야겠다.',
        character_id: characterId.hero,
        character_image_id: { 2: characterImageId.nobody },
        type: 'think',
        id: 'chapter1_scene4_intro_2',
        index: 2,
      },
      {
        script: '',
        type: '전환',
        character_image_id: { all: characterImageId.nobody },
        id: 'chapter1_scene4_intro_3',
        index: 3,
      },
      {
        script: '(시간 경과. 시끌벅적한 술자리)',
        type: 'narration',
        background_image_id: backgroundImageId.restaurant_inside,
        id: 'chapter1_scene4_intro_4',
        index: 4,
      },
      {
        script: '할 얘기도 다 떨어졌고, 기 빨린다. 슬슬 탈출각을...',
        character_id: characterId.hero,
        type: 'think',
        id: 'chapter1_scene4_intro_5',
        index: 5,
      },
      {
        script: '자자! 분위기 전환 겸 자리 한 번 섞겠습니다! 카톡방에서 제비뽑기 확인하세요!',
        character_id: characterId.manager,
        type: 'text',
        id: 'chapter1_scene4_intro_6',
        index: 6,
      },
      {
        script: '[뽑기_시작]팀 나누기가 시작됐어요',
        character_id: characterId.manager,
        type: '카톡',
        id: 'chapter1_scene4_intro_7',
        index: 7,
      },
      {
        script: '[뽑기]나의 팀은 4팀입니다.',
        type: '카톡',
        character_id: characterId.hero,
        id: 'chapter1_scene4_intro_8',
        index: 8,
      },
      {
        script: '[뽑기]나의 팀은 4팀입니다.',
        type: '카톡',
        character_id: characterId.dohee,
        id: 'chapter1_scene4_intro_9',
        index: 9,
      },
      {
        script: '...망했다. 어제 그 \'솔의 눈\' 그녀다.',
        character_id: characterId.hero,
        character_image_id: { 2: characterImageId.dohee_access_denied },
        type: 'think',
        id: 'chapter1_scene4_intro_10',
        index: 10,
      },
      {
        script: '모자 벗으니까... 꽤 예쁘네. 아니, 예쁜 정도가 아닌데?',
        character_id: characterId.hero,
        character_image_id: { 2: characterImageId.dohee_basic },
        type: 'think',
        id: 'chapter1_scene4_intro_11',
        index: 11,
      },
      {
        script: '하지만 표정이 \'말 걸면 죽임\'이다.',
        character_id: characterId.hero,
        type: 'think',
        id: 'chapter1_scene4_intro_12',
        index: 12,
      },
      {
        script: '그래, 없는 사람 취급해 주는 게 최고의 배려다. `Invisible` 모드 유지.',
        character_id: characterId.hero,
        type: 'think',
        id: 'chapter1_scene4_intro_13',
        index: 13,
      },
      {
        script: '(주변 남자들이 도희에게 몰려든다)',
        type: 'narration',
        id: 'chapter1_scene4_intro_14',
        index: 14,
      },
      {
        script: '도희 님! 술 잘 못하시죠? 여기 초코우유 사 왔어요!',
        character_id: characterId.myeongseong,
        character_image_id: { 2: characterImageId.dohee_boring },
        type: 'text',
        id: 'chapter1_scene4_intro_15',
        index: 15,
      },
      {
        script: '여대생들은 이런 거 좋아하신다면서요? 달달한 거 드세요!',
        character_id: characterId.donghwi,
        type: 'text',
        id: 'chapter1_scene4_intro_16',
        index: 16,
      },
      {
        script: '(작게 한숨을 쉬며) ...아, 네. 감사합니다.',
        character_id: characterId.dohee,
        type: 'text',
        id: 'chapter1_scene4_intro_17',
        index: 17,
      },
      {
        script: '(초코우유를 구석으로 밀어둔다)',
        type: 'narration',
        id: 'chapter1_scene4_intro_18',
        index: 18,
      },
      {
        script: '엄청 귀찮아 보이네.',
        character_id: characterId.hero,
        type: 'think',
        id: 'chapter1_scene4_intro_19',
        index: 19,
      },
      {
        script: '표정을 보니 단 건 질색인 눈치인데... 다들 헛다리 짚고 있군.',
        character_id: characterId.hero,
        type: 'think',
        id: 'chapter1_scene4_intro_20',
        index: 20,
      },
      {
        script: '도희가 자리에서 일어난다',
        type: 'narration',
        id: 'chapter1_scene4_intro_21',
        index: 21,
      },
      {
        script: '화장실 좀 다녀올게요.',
        character_id: characterId.dohee,
        type: 'text',
        id: 'chapter1_scene4_intro_22',
        index: 22,
      },
      {
        script: '나도 이틈에 바람이나 좀 쐬고 와야겠다.',
        character_id: characterId.hero,
        type: 'think',
        id: 'chapter1_scene4_intro_23',
        index: 23,
      },
      {
        script: '',
        type: '전환',
        character_image_id: { all: characterImageId.nobody },
        id: 'chapter1_scene4_intro_24',
        index: 24,
      },
      {
        script: '저기 편의점에 가야겠다',
        character_id: characterId.hero,
        type: 'think',
        background_image_id: backgroundImageId.convenience_store_outside,
        id: 'chapter1_scene4_intro_25',
        index: 25,
      },
      {
        script: '...너 도훈이라고 했나?',
        character_id: characterId.dohee,
        character_image_id: { 2: characterImageId.dohee_basic },
        type: 'text',
        id: 'chapter1_scene4_intro_26',
        index: 26,
      },
      {
        script: '깜짝이야! 고도희?',
        character_id: characterId.hero,
        type: 'think',
        id: 'chapter1_scene4_intro_27',
        index: 27,
      },
      {
        script: '어... 네.',
        character_id: characterId.hero,
        type: 'text',
        id: 'chapter1_scene4_intro_28',
        index: 28,
      },
      {
        script: '안 들어가고 뭐 해? 나 편의점 갈 건데 같이 갈래?',
        character_id: characterId.dohee,
        type: 'text',
        id: 'chapter1_scene4_intro_29',
        index: 29,
      },
      {
        script: '(엉겁결에) 아, 네.',
        character_id: characterId.hero,
        type: 'text',
        id: 'chapter1_scene4_intro_30',
        index: 30,
      },
      {
        script: '',
        type: '전환',
        character_image_id: { all: characterImageId.nobody },
        id: 'chapter1_scene4_intro_31',
        index: 31,
      },
      {
        script: '도희가 계산대 앞에 섰다.',
        character_id: characterId.hero,
        character_image_id: { 2: characterImageId.dohee_basic },
        background_image_id: backgroundImageId.convenience_store_inside,
        type: 'think',
        id: 'chapter1_scene4_intro_32',
        index: 32,
      },
      {
        script: '뭔가 하나 건네줘야 할 타이밍인가.',
        character_id: characterId.hero,
        type: 'think',
        id: 'chapter1_scene4_intro_33',
        index: 33,
      },
      {
        script: '센스라는 걸 발휘해 보자',
        character_id: characterId.hero,
        type: 'think',
        options: [
          {
            id: 'opt_sol',
            text: '[솔의 눈] "이거 드시던데요."',
            score_list: [{ id: 'score_dohee_sol', character_id: characterId.dohee, score: 2 }],
            nextSceneId: 'chapter1_scene4_reaction_sol',
          },
          {
            id: 'opt_drink',
            text: '[숙취해소제] "술 깨는 데엔 이게 최고죠."',
            score_list: [{ id: 'score_dohee_drink', character_id: characterId.dohee, score: 1 }],
            nextSceneId: 'chapter1_scene4_reaction_drink',
          },
          {
            id: 'opt_milk',
            text: '[초코우유] "여자분들은 단 거 좋아하시잖아요."',
            score_list: [{ id: 'score_dohee_milk', character_id: characterId.dohee, score: -1 }],
            nextSceneId: 'chapter1_scene4_reaction_milk',
          },
        ],
        id: 'chapter1_scene4_intro_34',
        index: 34,
      },
    ],
  },

  // ----------------------------------------------------------------
  // Scene 1-4 (Branch A): 솔의 눈 선택 (Best)
  // ----------------------------------------------------------------
  'chapter1_scene4_reaction_sol': {
    chapter_id: chapterId.chapter1,
    next_scene_id: 'chapter1_scene4_table', // 테이블 대화로 이동
    event: 4,
    scenario: [
      {
        script: '(무심하게 솔의 눈을 집어 건넨다) 이거 드시던데요.',
        character_id: characterId.hero,
        character_image_id: { 2: characterImageId.dohee_basic },
        type: 'text',
        id: 'scene4_sol_1',
        index: 1,
      },
      {
        script: '...어? 뭐야. 너 뭘 좀 아는구나?',
        character_id: characterId.dohee,
        character_image_id: { 2: characterImageId.dohee_smile },
        type: 'text',
        id: 'scene4_sol_2',
        index: 2,
      },
      {
        script: '다들 초코우유만 들이밀어서 속 느글거려 죽는 줄 알았는데.',
        character_id: characterId.dohee,
        type: 'text',
        id: 'scene4_sol_3',
        index: 3,
      },
      {
        script: '고마워. 잘 마실게.',
        character_id: characterId.dohee,
        type: 'text',
        background_sound_id: backgroundSoundId.romantic_intro,
        id: 'scene4_sol_4',
        index: 4,
      },
      {
        script: '🌲 [호감도 대폭 상승] 도희가 당신을 "말이 통하는 사람"으로 인식합니다.',
        type: 'narration',
        id: 'scene4_sol_5',
        index: 5,
      },
    ],
  },

  // ----------------------------------------------------------------
  // Scene 1-4 (Branch B): 숙취해소제 선택 (Normal)
  // ----------------------------------------------------------------
  'chapter1_scene4_reaction_drink': {
    chapter_id: chapterId.chapter1,
    next_scene_id: 'chapter1_scene4_table', // 테이블 대화로 이동
    event: 4,
    scenario: [
      {
        script: '술 깨는 데엔 이게 최고죠.',
        character_id: characterId.hero,
        character_image_id: { 2: characterImageId.dohee_basic },
        type: 'text',
        id: 'scene4_drink_1',
        index: 1,
      },
      {
        script: '오, 현실적이네. 고마워. 내일 코딩하려면 정신 차려야지.',
        character_id: characterId.dohee,
        type: 'text',
        id: 'scene4_drink_2',
        index: 2,
      },
      {
        script: '[호감도 +1] 무난한 선택입니다.',
        type: '시스템',
        id: 'scene4_drink_3',
        index: 3,
      },
    ],
  },

  // ----------------------------------------------------------------
  // Scene 1-4 (Branch C): 초코우유 선택 (Bad)
  // ----------------------------------------------------------------
  'chapter1_scene4_reaction_milk': {
    chapter_id: chapterId.chapter1,
    next_scene_id: 'chapter1_scene4_table', // 테이블 대화로 이동
    event: 4,
    scenario: [
      {
        script: '여자분들은 단 거 좋아하시잖아요.',
        character_id: characterId.hero,
        type: 'text',
        id: 'scene4_milk_1',
        index: 1,
      },
      {
        script: '(미간을 찌푸리며) ...아. 너도 똑같구나.',
        character_id: characterId.dohee,
        character_image_id: { 2: characterImageId.dohee_annoyed },
        type: 'text',
        effect_sound_id: effectSoundId.disappointed,
        id: 'scene4_milk_2',
        index: 2,
      },
      {
        script: '나 단 거 안 좋아해. 마음만 받을게.',
        character_id: characterId.dohee,
        type: 'text',
        id: 'scene4_milk_3',
        index: 3,
      },
      {
        script: '💔 [호감도 감소] 도희가 실망했습니다.',
        type: '시스템',
        id: 'scene4_milk_4',
        index: 4,
      },
    ],
  },

  // ----------------------------------------------------------------
  // Scene 1-4 (Table): 편의점 앞 테이블 대화
  // ----------------------------------------------------------------
  'chapter1_scene4_table': {
    chapter_id: chapterId.chapter1,
    next_scene_id: 'chapter1_scene4_outro',
    event: 4,
    scenario: [
      {
        script: '(두 사람은 편의점 앞 플라스틱 테이블에 잠시 걸터앉는다. 캔 따는 소리가 경쾌하게 들린다.)',
        type: 'narration',
        character_image_id: { 2: characterImageId.dohee_side_smile },
        background_image_id: backgroundImageId.convenience_store_outside,
        effect_sound_id: effectSoundId.can_open,
        id: 'scene4_table_1',
        index: 1,
      },
      {
        script: '(캔을 따며) 사실 아까 엄청 고민했어요.',
        character_id: characterId.hero,
        type: 'text',
        id: 'scene4_table_2',
        index: 2,
      },
      {
        script: '(음료를 마시다 말고) 뭘?',
        character_id: characterId.dohee,
        type: 'text',
        id: 'scene4_table_3',
        index: 3,
      },
      {
        script: '이게 2+1 행사 상품이더라고요. 하나를 더 가져와서 제가 두 개를 마실지, 아니면 그냥 깔끔하게 하나씩 마실지.',
        character_id: characterId.hero,
        type: 'text',
        id: 'scene4_table_4',
        index: 4,
      },
      {
        script: '(황당하다는 듯) 보통은 남은 하나를 킵해두거나 나한테 더 주지 않아?',
        character_id: characterId.dohee,
        type: 'text',
        id: 'scene4_table_5',
        index: 5,
      },
      {
        script: '에이, 솔의 눈 두 캔은 치사량이죠. 그건 암살 시도나 마찬가지라 참았습니다.',
        character_id: characterId.hero,
        type: 'text',
        id: 'scene4_table_6',
        index: 6,
      },
      {
        script: '(풉, 하고 웃음이 터지며) 뭐야 그게. 나 이거 좋아한다니까?',
        character_id: characterId.dohee,
        type: 'text',
        id: 'scene4_table_7',
        index: 7,
      },
      {
        script: '아... 근데 두 개는 좀 힘들긴 하겠다. 머리 띵해서.',
        character_id: characterId.dohee,
        type: 'text',
        id: 'scene4_table_8',
        index: 8,
      },
      {
        script: '그쵸? 지금 딱 숲속에서 숨 쉬는 기분인데, 두 개 마시면 아마 나무가 됐을지도 몰라요.',
        character_id: characterId.hero,
        type: 'text',
        id: 'scene4_table_9',
        index: 9,
      },
      {
        script: '(입가에 미소를 띤 채 도훈을 본다) 너 되게 조용해 보였는데, 은근히 엉뚱한 소리 잘 하네.',
        character_id: characterId.dohee,
        type: 'text',
        id: 'scene4_table_10',
        index: 10,
      },
      {
        script: '술기운 빌려서 하는 거죠, 뭐. 아, 바람 시원하다.',
        character_id: characterId.hero,
        type: 'text',
        id: 'scene4_table_11',
        index: 11,
      },
      {
        script: '(하늘을 보며) 지금 들어가지 말고 그냥 여기서 노상이나 깔까요?',
        character_id: characterId.hero,
        type: 'text',
        id: 'scene4_table_12',
        index: 12,
      },
      {
        script: '(키득거리며) 참나, 객기 부리지 마. 너 얼굴 빨개.',
        character_id: characterId.dohee,
        type: 'text',
        id: 'scene4_table_13',
        index: 13,
      },
      {
        script: '그래도... 바람 쐬니까 좀 살 것 같긴 하다.',
        character_id: characterId.dohee,
        type: 'text',
        id: 'scene4_table_14',
        index: 14,
      },
      {
        script: '(잠시 정적이 흐르지만, 어색하지 않다. 도희가 캔을 가볍게 흔들며 먼저 일어난다.)',
        type: 'narration',
        id: 'scene4_table_15',
        index: 15,
      },
      {
        script: '가자. 너무 오래 비우면 애들이 우리 도망간 줄 알겠다.',
        character_id: characterId.dohee,
        type: 'text',
        id: 'scene4_table_16',
        index: 16,
      },
      {
        script: '(따라 일어나며) 오해받으면 억울하니까 가야죠.',
        character_id: characterId.hero,
        type: 'text',
        id: 'scene4_table_17',
        index: 17,
      },
    ],
  },

  // ----------------------------------------------------------------
  // Scene 1-4 (Outro): 편의점 이후 ~ 2차 분기점
  // ----------------------------------------------------------------
  'chapter1_scene4_outro': {
    chapter_id: chapterId.chapter1,
    next_scene_id: '', // 여기서 다시 갈림
    event: 4,
    scenario: [
      {
        script: '편의점에 갔다가 다시 자리로 돌아왔다',
        character_id: characterId.hero,
        character_image_id: { 2: characterImageId.nobody },
        type: 'think',
        background_image_id: backgroundImageId.restaurant_inside,
        id: 'scene4_outro_1',
        index: 1,
      },
      {
        script: '자, 1차 끝났습니다! 집 갈 사람은 가고, 2차 갈 사람들은 생생맥주로 이동~!',
        character_id: characterId.manager,
        character_image_id: { 2: characterImageId.manager },
        type: 'text',
        id: 'scene4_outro_2',
        index: 2,
      },
      {
        script: '(도훈을 쳐다보며) 너는? 갈 거야?',
        character_id: characterId.dohee,
        character_image_id: { 2: characterImageId.dohee_basic },
        type: 'text',
        options: [
          {
            id: 'opt_go_party',
            text: '간다.',
            score_list: [{ id: 'score_dohee_party', character_id: characterId.dohee, score: 1 }],
            nextSceneId: 'chapter1_scene5_party', // 2차 회식 씬으로
          },
          {
            id: 'opt_go_dorm',
            text: '안 간다.',
            score_list: [],
            nextSceneId: 'chapter1_scene5_dorm', // 기숙사 씬으로
          },
        ],
        id: 'scene4_outro_3',
        index: 3,
      },
    ],
  },

  // ----------------------------------------------------------------
  // Scene 1-5 (Route A): 2차를 간다 - 파티
  // ----------------------------------------------------------------
  'chapter1_scene5_party': {
    chapter_id: chapterId.chapter1,
    next_scene_id: 'chapter1_scene5_debug',
    event: 5,
    scenario: [
      {
        script: '안 갈 수가 없었다',
        character_id: characterId.hero,
        type: 'think',
        background_image_id: backgroundImageId.second_restaurant_inside,
        background_sound_id: backgroundSoundId.party_noise,
        id: 'scene5_party_1',
        index: 1,
      },
      {
        script: '저렇게 예쁜 분이 물어보는데 안 간다고 할 수 있는 사람이 있을까?',
        character_id: characterId.hero,
        type: 'think',
        id: 'scene5_party_2',
        index: 2,
      },
      {
        script: '우리 다 같이 술 게임이나 할까요? 같은 그림 찾기 어때요?',
        character_id: characterId.wonyoung,
        type: 'text',
        id: 'scene5_party_3',
        index: 3,
      },
      {
        script: '🎮 미니게임 [카드 게임 - 같은 그림 찾기]이 시작됩니다!',
        type: '시스템',
        id: 'scene5_party_4',
        index: 4,
      },
      {
        script: '(성공 시: 술을 적게 마심 / 실패 시: 벌주 원샷)',
        type: 'narration',
        id: 'scene5_party_5',
        index: 5,
      },
      {
        script: '🎮 미니게임 [카드 게임 - 같은 그림 찾기]',
        type: 'game',
        game: {
          game_id: 'card_game',
          game_name: '카드 게임 - 같은 그림 찾기',
          win_scene_id: 'chapter1_scene5_party_win',
          lose_scene_id: 'ending_scene1',
        },
        id: 'scene5_party_6',
        index: 6,
      },
    ],
  },

  // ----------------------------------------------------------------
  // Scene 1-5 (Route A - Win): 미니게임 승리 후
  // ----------------------------------------------------------------
  'chapter1_scene5_party_win': {
    chapter_id: chapterId.chapter1,
    next_scene_id: 'chapter1_scene5_debug',
    event: 5,
    scenario: [
      {
        script: '미니게임 승리!',
        type: '시스템',
        id: 'scene5_party_win_0',
        index: 0,
      },
      {
        script: '술게임을 잘해버린 탓에 고도희가 많이 마셨다.',
        type: 'think',
        id: 'scene5_party_win_1',
        index: 1,
      },
      {
        script: '(얼굴이 발그레하다) 으... 나 좀 취한 것 같아. 머리 아파.',
        character_id: characterId.dohee,
        character_image_id: { 2: characterImageId.dohee_drunken },
        type: 'text',
        background_image_id: backgroundImageId.second_restaurant_inside,
        background_sound_id: backgroundSoundId.party_noise,
        id: 'scene5_party_win_2',
        index: 2,
      },
      {
        script: '괜찮아요? 기숙사까지 데려다줄게요.',
        character_id: characterId.hero,
        type: 'text',
        id: 'scene5_party_win_3',
        index: 3,
      },
      {
        script: '...그래 줄래? 혼자 가는건 힘들 것 같아서.',
        character_id: characterId.dohee,
        type: 'text',
        id: 'scene5_party_win_4',
        index: 4,
      },
      {
        script: '밤공기를 맞으며 도희와 나란히 걷는다. 그녀가 묵묵히 걷다가 작게 "고맙다"고 중얼거렸다.',
        type: 'narration',
        background_image_id: backgroundImageId.night_street,
        background_sound_id: backgroundSoundId.romantic,
        id: 'scene5_party_win_5',
        index: 5,
      },
      {
        script: '💖 [호감도 대폭 상승]',
        type: '시스템',
        id: 'scene5_party_win_6',
        index: 6,
      },
    ],
  },

  // ----------------------------------------------------------------
  // Ending Scene 1: 미니게임 실패 - BAD ENDING
  // ----------------------------------------------------------------
  'ending_scene1': {
    chapter_id: chapterId.chapter1,
    next_scene_id: '',
    event: 99,
    scenario: [
      {
        script: '으윽... 세상이 돈다. System.exit(0)...',
        character_id: characterId.hero,
        character_image_id: { 2: characterImageId.nobody },
        type: 'think',
        background_image_id: backgroundImageId.second_restaurant_inside,
        background_sound_id: backgroundSoundId.comical_fail,
        id: 'ending_scene1_1',
        index: 1,
      },
      {
        script: '',
        type: '전환',
        character_image_id: { all: characterImageId.nobody },
        id: 'ending_scene1_2',
        index: 2,
      },
      {
        script: '(다음 날 아침) 눈을 뜨니 기억이 없다. 실수한 것 같다. 퇴소각이다...',
        type: 'narration',
        background_image_id: backgroundImageId.dohoon_room,
        background_sound_id: backgroundSoundId.morning_ambience,
        id: 'ending_scene1_3',
        index: 3,
      },
      {
        script: '[BAD ENDING]',
        type: '시스템',
        id: 'ending_scene1_4',
        index: 4,
      },
    ],
  },

  // ----------------------------------------------------------------
  // Scene 1-5 (Route B): 2차를 안 간다 - 기숙사
  // ----------------------------------------------------------------
  'chapter1_scene5_dorm': {
    chapter_id: chapterId.chapter1,
    next_scene_id: 'chapter1_scene5_debug',
    event: 5,
    scenario: [
      {
        script: '도희! 넌 가는 거지? 에이~ 2분반 예쁜이가 빠지면 섭섭하지!',
        character_id: characterId.myeongseong,
        type: 'text',
        background_image_id: backgroundImageId.restaurant_inside,
        id: 'scene5_dorm_1',
        index: 1,
      },
      {
        script: '전 먼저 들어가 보겠습니다. 내일 봬요.',
        character_id: characterId.hero,
        type: 'text',
        id: 'scene5_dorm_2',
        index: 2,
      },
      {
        script: '',
        type: '전환',
        character_image_id: { all: characterImageId.nobody },
        id: 'scene5_dorm_3',
        index: 3,
      },
      {
        script: '(다음 날 아침)',
        type: 'narration',
        background_image_id: backgroundImageId.dohoon_room,
        background_sound_id: backgroundSoundId.morning_ambience,
        id: 'scene5_dorm_4',
        index: 4,
      },
      {
        script: '단톡방에 [인생네컷] 사진이 올라왔습니다.',
        type: 'narration',
        id: 'scene5_dorm_5',
        index: 5,
      },
      {
        script: '[image]/icon/인생네컷.png',
        type: '카톡',
        character_id: characterId.myeongseong,
        id: 'scene5_dorm_6',
        index: 6,
      },
      {
        script: '[message]오늘 너무 재밌었어요. 조심히 들어가세요! ',
        type: '카톡',
        character_id: characterId.hanjin,
        id: 'scene5_dorm_7',
        index: 7,
      },
      {
        script: '[message]조심히 들어가세요~~',
        character_id: characterId.manager,
        type: '카톡',
        id: 'scene5_dorm_8',
        index: 8,
      },
      {
        script: '사진 속 도희가 환하게 웃고 있다.',
        character_id: characterId.hero,
        type: 'think',
        overlay_image_id: '/icon/인생네컷.png',
        id: 'scene5_dorm_7',
        index: 9,
      },
      {
        script: '...재밌었나 보네. 표정이 좋네.',
        character_id: characterId.hero,
        type: 'think',
        id: 'scene5_dorm_8',
        index: 10,
      },
      {
        script: '갈 걸 그랬나? 조금 아쉽다. Rollback 하고 싶지만 이미 늦었다.',
        character_id: characterId.hero,
        type: 'think',
        id: 'scene5_dorm_9',
        index: 11,
      },
      {
        script: '',
        type: '전환',
        character_image_id: { all: characterImageId.nobody },
        id: 'scene5_dorm_10',
        index: 12,
      }
    ],
  },

  // ----------------------------------------------------------------
  // Scene 1-5: Debug - 구세주
  // ----------------------------------------------------------------
  'chapter1_scene5_debug': {
    chapter_id: chapterId.chapter1,
    next_scene_id: 'chapter1_scene6_commit',
    event: 5,
    scenario: [
      {
        script: '어제 술 마신 게 아직도 안 깨네. 물이나 마시러 가자.',
        character_id: characterId.hero,
        type: 'think',
        background_image_id: backgroundImageId.krafton_passageway_day,
        background_sound_id: backgroundSoundId.morning_ambience,
        id: 'scene5_debug_1',
        index: 1,
      },
      {
        script: '(머리를 쥐어뜯으며) 으아아앙... 왜 안 되냐고... 나한테 왜 이래 ㅠㅠ',
        character_id: characterId.jisoo,
        character_image_id: { 2: characterImageId.jisoo_hard },
        type: 'text',
        id: 'scene5_debug_2',
        index: 2,
      },
      {
        script: '못 본 척 지나가야지',
        character_id: characterId.hero,
        type: 'think',
        id: 'scene5_debug_3',
        index: 3,
      },
      {
        script: '어! 도훈 오빠다! ㅠㅠ 오빠 잘 만났다. 나 좀 살려줘!!',
        character_id: characterId.jisoo,
        character_image_id: { 2: characterImageId.jisoo_begging },
        type: 'text',
        id: 'scene5_debug_4',
        index: 4,
      },
      {
        script: '저 물 마시러 나온 건데요... 그리고 저 안드로이드 잘 모르는데.',
        character_id: characterId.hero,
        type: 'text',
        id: 'scene5_debug_5',
        index: 5,
      },
      {
        script: '(울먹이며) 거짓말! 오빠 잘하는 거 다 알아. 이거 빨간 줄 좀 봐주라. 응?',
        character_id: characterId.jisoo,
        type: 'text',
        id: 'scene5_debug_6',
        index: 6,
      },
      {
        script: '안 고쳐지면 나 오늘 밤새워야 해...',
        character_id: characterId.jisoo,
        type: 'text',
        id: 'scene5_debug_7',
        index: 7,
      },
      {
        script: '(한숨) ...줘 봐요.',
        character_id: characterId.hero,
        type: 'text',
        id: 'scene5_debug_8',
        index: 8,
      },
      {
        script: '도훈은 익숙하게 Ctrl + Alt + S를 누르고 로그를 훑어본다.',
        type: 'narration',
        id: 'scene5_debug_9',
        index: 9,
      },
      {
        script: '그냥 안드로이드 스튜디오가 가끔 멍청해질 때가 있어서 그래.',
        character_id: characterId.hero,
        type: 'text',
        id: 'scene5_debug_10',
        index: 10,
      },
      {
        script: '(타닥, 탁. Sync Project with Gradle Files을 클릭한다)',
        character_id: characterId.hero,
        type: 'think',
        id: 'scene5_debug_11',
        index: 11,
      },
      {
        script: '자, 됐죠?',
        character_id: characterId.hero,
        type: 'text',
        id: 'scene5_debug_12',
        index: 12,
      },
      {
        script: '어? 어?? 빨간 줄 다 없어졌다!!',
        character_id: characterId.jisoo,
        character_image_id: { 2: characterImageId.jisoo_smile },
        type: 'text',
        id: 'scene5_debug_13',
        index: 13,
      },
      {
        script: '헐... 오빠 뭐야? 방금 뭐 한 거야? 마법사야?',
        character_id: characterId.jisoo,
        type: 'text',
        id: 'scene5_debug_14',
        index: 14,
      },
      {
        script: '그냥 싱크 다시 맞춘 거야. 고장 안 났으니까 걱정 말고 해.',
        character_id: characterId.hero,
        type: 'text',
        id: 'scene5_debug_15',
        index: 15,
      },
      {
        script: '그럼 난 이만.',
        character_id: characterId.hero,
        type: 'text',
        id: 'scene5_debug_16',
        index: 16,
      },
      {
        script: '(뒤에서 외치며) 와... 진짜 멋있다... 고마워 오빠!!! 내가 밥 살게!!!',
        character_id: characterId.jisoo,
        type: 'text',
        id: 'scene5_debug_17',
        index: 17,
      },
      {
        script: '그날 이후, 4일차, 5일차, 6일차... 지수는 틈만 나면 "오빠!" 하고 찾아오기 시작했다.',
        type: 'narration',
        character_image_id: { 2: characterImageId.jisoo_hello },
        id: 'scene5_debug_18',
        index: 18,
      },
      {
        script: '그리고 그 모습을, 도희가 멀리서 조용히 지켜보고 있었다.',
        type: 'narration',
        character_image_id: { 2: characterImageId.dohee_basic },
        id: 'scene5_debug_19',
        index: 19,
      },
      {
        script: '. . .',
        character_id: characterId.dohee,
        type: 'text',
        id: 'scene5_debug_20',
        index: 20,
      },
      {
        script: '',
        type: '전환',
        character_image_id: { all: characterImageId.nobody },
        id: 'scene5_debug_21',
        index: 21,
      }
    ],
  },

  // ----------------------------------------------------------------
  // Scene 1-6: Commit - 결과 발표
  // ----------------------------------------------------------------
  'chapter1_scene6_commit': {
    chapter_id: chapterId.chapter1,
    next_scene_id: '',
    event: 6,
    scenario: [
      {
        script: '자, 대망의 1주차 금픽 발표가 있겠습니다!',
        character_id: characterId.manager,
        character_image_id: { 2: characterImageId.manager },
        type: 'text',
        background_image_id: backgroundImageId.classroom_back,
        id: 'scene6_commit_0',
        index: 0,
      },
      {
        script: '이번 주 우승 팀은... 고도희, 임유진 조! 이도훈, 탁한진 조!',
        character_id: characterId.manager,
        type: 'text',
        id: 'scene6_commit_1',
        index: 1,
      },
      {
        script: '',
        type: '전환',
        character_image_id: { all: characterImageId.nobody },
        id: 'scene6_commit_2',
        index: 2,
      },
      {
        script: '발표가 끝나고 강당을 나오는데 지수가 싱긋 웃으며 다가온다.',
        type: 'narration',
        background_image_id: backgroundImageId.krafton_auditorium_entry,
        id: 'scene6_commit_3',
        index: 3,
      },
      {
        script: '도훈 오빠! 축하해! 우리 조 오빠 덕분에 금픽 됐어~',
        character_id: characterId.jisoo,
        character_image_id: { 2: characterImageId.jisoo_smile },
        type: 'text',
        id: 'scene6_commit_4',
        index: 4,
      },
      {
        script: '오빠가 안 도와줬으면 나 완성도 못 했을 거야 ㅠㅠ',
        character_id: characterId.jisoo,
        type: 'text',
        id: 'scene6_commit_5',
        index: 5,
      },
      {
        script: '(머쓱하게 목을 긁으며) 별말씀을... 네가 잘해서 된 거지.',
        character_id: characterId.hero,
        type: 'text',
        id: 'scene6_commit_6',
        index: 6,
      },
      {
        script: '(지수가 도훈의 옆을 스쳐 지나간다. 은은한 샴푸 향기가 난다)',
        type: 'narration',
        id: 'scene6_commit_7',
        index: 7,
      },
      {
        script: '어... 내가 좋아하는 향이다.',
        character_id: characterId.hero,
        type: 'think',
        id: 'scene6_commit_8',
        index: 8,
      },
      {
        script: '심박수가 살짝 올라갔다. 위험해.',
        character_id: characterId.hero,
        type: 'think',
        id: 'scene6_commit_9',
        index: 9,
      },
      {
        script: '(그때, 뒤에서 팔짱을 낀 도희가 다가온다)',
        type: 'narration',
        character_image_id: { 2: characterImageId.dohee_annoyed },
        id: 'scene6_commit_10',
        index: 10,
      },
      {
        script: '야. 너 내 룸메랑 어떻게 아는 사이냐?',
        character_id: characterId.dohee,
        type: 'text',
        id: 'scene6_commit_11',
        index: 11,
      },
      {
        script: '어? 둘이 룸메였어?',
        character_id: characterId.hero,
        type: 'text',
        id: 'scene6_commit_12',
        index: 12,
      },
      {
        script: '그래. 밤마다 기숙사에서 "2분반 안경 쓴 오빠가 코딩 개잘한다", "손가락이 섹시하다(?)" 어찌나 떠들어대던지.',
        character_id: characterId.dohee,
        type: 'text',
        id: 'scene6_commit_13',
        index: 13,
      },
      {
        script: '그게 너였구나? 덕분에 내가 아주 시끄러워서 잠을 못 잤어.',
        character_id: characterId.dohee,
        type: 'text',
        id: 'scene6_commit_14',
        index: 14,
      },
      {
        script: '예...? 전 그냥 코드만 봐줬는데요.',
        character_id: characterId.hero,
        type: 'text',
        id: 'scene6_commit_15',
        index: 15,
      },
      {
        script: '(한 발짝 다가오며)',
        type: 'narration',
        id: 'scene6_commit_16',
        index: 16,
      },
      {
        script: '그게 문제라고. 이 삭막한 공대에서, 밤새우는 여자애 코드 봐주는 거?',
        character_id: characterId.dohee,
        character_image_id: { 2: characterImageId.dohee_annoyed },
        type: 'text',
        id: 'scene6_commit_17',
        index: 17,
      },
      {
        script: '이 바닥에선 그거 플러팅(Flirting)이야. 알고나 있어?',
        character_id: characterId.dohee,
        type: 'text',
        id: 'scene6_commit_18',
        index: 18,
      },
      {
        script: '...뭐, 실력은 인정하지만.',
        character_id: characterId.dohee,
        character_image_id: { 2: characterImageId.dohee_basic },
        type: 'text',
        id: 'scene6_commit_19',
        index: 19,
      },
      {
        script: '아... 죄송합니다? 제가 의도한 건 아닌데...',
        character_id: characterId.hero,
        type: 'text',
        id: 'scene6_commit_20',
        index: 20,
      },
      {
        script: '(피식 웃으며 주머니에서 [솔의 눈]을 꺼내 도훈의 가슴팍에 툭 친다)',
        type: 'narration',
        character_image_id: { 2: characterImageId.dohee_smile },
        id: 'scene6_commit_21',
        index: 21,
      },
      {
        script: '사과하지 말고, 이거나 마셔.',
        character_id: characterId.dohee,
        type: 'text',
        id: 'scene6_commit_22',
        index: 22,
      },
      {
        script: '지수 더 이상 헷갈리게 하지 말고',
        character_id: characterId.dohee,
        type: 'text',
        id: 'scene6_commit_23',
        index: 23,
      },
      {
        script: '(얼떨떨하게 캔을 받아든다)',
        type: 'narration',
        id: 'scene6_commit_24',
        index: 24,
      },
      {
        script: '...이걸 나한테?',
        character_id: characterId.hero,
        type: 'text',
        id: 'scene6_commit_25',
        index: 25,
      },
      {
        script: '착각하지 마. 그냥 남아서 주는 거니까.',
        character_id: characterId.dohee,
        character_image_id: { 2: characterImageId.dohee_smile },
        type: 'text',
        id: 'scene6_commit_26',
        index: 26,
      },
      {
        script: '(도희는 뒤도 안 돌아보고 쿨하게 걸어간다)',
        character_image_id: { 2: characterImageId.nobody },
        type: 'narration',
        id: 'scene6_commit_27',
        index: 27,
      },
      {
        script: '...뭐지, 이 상황?',
        character_id: characterId.hero,
        type: 'think',
        id: 'scene6_commit_28',
        index: 28,
      },
      {
        script: '손에 쥐어진 솔의 눈이 차갑다.',
        character_id: characterId.hero,
        type: 'think',
        id: 'scene6_commit_29',
        index: 29,
      },
      {
        script: '하지만 기분은 나쁘지 않다.',
        character_id: characterId.hero,
        type: 'think',
        id: 'scene6_commit_30',
        index: 30,
      },
      {
        script: '1주차 종료. Save Point에 도달했습니다. 2주차 스토리를 로드하시겠습니까?',
        type: '시스템',
        id: 'scene6_commit_31',
        index: 31,
      },
    ],
  },
};

// 하위 호환성을 위한 변환 함수 (기존 Scene 형식으로 변환)
import type { Scene, Dialogue } from '../types/game.types';

export const convertEventToScene = (event: GameEvent): Scene => {
  const dialogues: Dialogue[] = event.scenario.map((item) => {
    // character_image_id가 객체 형태이므로 Dialogue의 characterImage는 undefined로 설정
    // (하위 호환성을 위한 변환이므로 실제로는 사용되지 않음)
    let characterImage: string | undefined = undefined;
    if (item.character_image_id) {
      // 객체 형태인 경우 첫 번째 값 사용 (하위 호환성)
      if (item.character_image_id[2]) {
        characterImage = item.character_image_id[2];
      } else if (item.character_image_id[1]) {
        characterImage = item.character_image_id[1];
      } else if (item.character_image_id[3]) {
        characterImage = item.character_image_id[3];
      } else if (item.character_image_id.all) {
        characterImage = item.character_image_id.all;
      }
    }
    
    return {
      id: item.id,
      character: item.character_id,
      text: item.script,
      background: item.background_image_id,
      characterImage,
      bgm: item.background_sound_id,
      sfx: item.effect_sound_id,
      choices: item.options,
    };
  });

  return {
    id: event.next_scene_id,
    dialogues,
  };
};

// 기존 형식의 스크립트 (하위 호환성)
export const gameScript: Record<string, Scene> = {};

// 이벤트를 씬으로 변환하여 저장
Object.keys(gameEvents).forEach((eventId) => {
  const event = gameEvents[eventId];
  const scene = convertEventToScene(event);
  gameScript[event.next_scene_id] = scene;
});
