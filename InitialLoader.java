package com.madcamp.love_algorithm.loader;

import com.madcamp.love_algorithm.entity.*;
import com.madcamp.love_algorithm.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import com.madcamp.love_algorithm.repository.UserRepository;

@Component
@RequiredArgsConstructor
public class InitialLoader implements CommandLineRunner {

    private final SceneRepository sceneRepository;
    private final ScriptRepository scriptRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {

    // 1. 기존 데이터 초기화
        scriptRepository.deleteAll();
        sceneRepository.deleteAll();

        // 2. 테스트용 유저 생성 (로그인 없이 테스트하기 위함)
        User testUser = User.builder()
                .name("도훈") // 이제 setName이 아니라 Builder나 setName 사용 가능
                .createdAt(LocalDateTime.now())
                .build();
        userRepository.save(testUser);
        userRepository.deleteAll();

        System.out.println(">>> 테스트 유저 생성 완료: ID=" + testUser.getId() + ", 이름=" + testUser.getName());


        // 2. 주차별 데이터 로딩
        loadChapter1();
        // loadChapter2();
    }

    // ==========================================
    // [Chapter 1] 1주차 데이터 로딩
    // ==========================================
    private void loadChapter1() {
        List<Scene> scenes = new ArrayList<>();
        List<Script> scripts = new ArrayList<>();

        // ------------------------------------------------------
        // 1. Scene 생성
        // ------------------------------------------------------
        Scene s1_1 = createScene("chapter1_scene1", "chapter1", 1, "합격 통보", "chapter1_scene2");
        Scene s1_2 = createScene("chapter1_scene2", "chapter1", 2, "지수와의 만남", "chapter1_scene3");
        Scene s1_3 = createScene("chapter1_scene3", "chapter1", 3, "강의실", "chapter1_scene4_intro");
        Scene s1_4_intro = createScene("chapter1_scene4_intro", "chapter1", 4, "회식 시작", null);
        Scene s1_4_sol = createScene("chapter1_scene4_reaction_sol", "chapter1", 4, "솔의눈 선택", "chapter1_scene4_table");
        Scene s1_4_drink = createScene("chapter1_scene4_reaction_drink", "chapter1", 4, "숙취해소제 선택", "chapter1_scene4_table");
        Scene s1_4_milk = createScene("chapter1_scene4_reaction_milk", "chapter1", 4, "초코우유 선택", "chapter1_scene4_table");
        Scene s1_4_table = createScene("chapter1_scene4_table", "chapter1", 4, "편의점 앞 테이블 대화", "chapter1_scene4_outro");
        Scene s1_4_outro = createScene("chapter1_scene4_outro", "chapter1", 4, "편의점 이후", null);
        Scene s1_5_party = createScene("chapter1_scene5_party", "chapter1", 5, "2차를 간다 - 파티", "chapter1_scene5_debug");
        Scene s1_5_party_win = createScene("chapter1_scene5_party_win", "chapter1", 5, "미니게임 승리 후", "chapter1_scene5_debug");
        Scene ending_scene1 = createScene("ending_scene1", "chapter1", 99, "BAD ENDING", null);
        Scene s1_5_dorm = createScene("chapter1_scene5_dorm", "chapter1", 5, "2차를 안 간다 - 기숙사", "chapter1_scene5_debug");
        Scene s1_5_debug = createScene("chapter1_scene5_debug", "chapter1", 5, "구세주", "chapter1_scene6_commit");
        Scene s1_6_commit = createScene("chapter1_scene6_commit", "chapter1", 6, "결과 발표", null);

        scenes.addAll(List.of(s1_1, s1_2, s1_3, s1_4_intro, s1_4_sol, s1_4_drink, s1_4_milk, s1_4_table, s1_4_outro, 
                s1_5_party, s1_5_party_win, ending_scene1, s1_5_dorm, s1_5_debug, s1_6_commit));
        sceneRepository.saveAll(scenes);
        sceneRepository.flush();

        // ------------------------------------------------------
        // 2. Script 데이터 생성 (대본)
        // ------------------------------------------------------

        // --- Scene 1-1: 합격 통보 ---
        scripts.add(createScript(s1_1, 1, ScriptType.NARRATION, null, "📧 [합격 메일]이 도착했습니다."));
        scripts.add(createScript(s1_1, 2, ScriptType.NARRATION, null, "모니터 화면에 \"제 14회 KAIST 몰입캠프 합격\"이라는 글자가 떠 있다."));
        scripts.add(createScript(s1_1, 3, ScriptType.THINK, "hero", "휴, 다행이다. 이번 방학은 헛되이 보내지 않겠어."));
        scripts.add(createScript(s1_1, 4, ScriptType.THINK, "hero", "내 목표는 오로지 하나. 코딩 실력 향상."));
        scripts.add(createScript(s1_1, 5, ScriptType.THINK, "hero", "연애? 그런 비효율적인 프로세스는 내 메모리에 할당하지 않는다."));
        scripts.add(createScript(s1_1, 6, ScriptType.THINK, "hero", "남들에게 피해 안 주고, 조용히 알고리즘이나 깎다가 오는 거야. 완벽해."));
        scripts.add(createScript(s1_1, 7, ScriptType.TEXT, null, "카톡이 울린다."));
        scripts.add(createScript(s1_1, 8, ScriptType.TEXT, "manager", "[message]안녕하세요! 2분반 여러분 환영합니다. 내일 오전 11시까지 카이마루(북측 식당) 앞으로 모여주세요!"));
        scripts.add(createScript(s1_1, 9, ScriptType.THINK, "hero", "내일 11시 집합이라... 일찍 자고 일찍 일어나야 겠다"));

        // --- Scene 1-2: 지수와의 만남 ---
        scripts.add(createScript(s1_2, 1, ScriptType.THINK, "hero", "11시 집합인데 긴장해서 10시에 와버렸다. TimeLimit 설정을 너무 넉넉하게 잡았나."));
        scripts.add(createScript(s1_2, 2, ScriptType.THINK, "hero", "아는 사람 마주치면 피곤한데... 일단 안으로 들어가자."));
        scripts.add(createScript(s1_2, 3, ScriptType.NARRATION, null, "그때, 뒤에서 누군가 나를 부른다"));
        scripts.add(createScript(s1_2, 4, ScriptType.TEXT, "jisoo", "저기요! 학생증 떨어뜨리셨어요!"));
        scripts.add(createScript(s1_2, 5, ScriptType.NARRATION, null, "학생증에 적힐 이름을 입력하세요:"));
        scripts.add(createScript(s1_2, 6, ScriptType.TEXT, "jisoo", "여기요, 이도훈 님? 어! 혹시 몰입캠프 오셨어요?"));
        scripts.add(createScript(s1_2, 7, ScriptType.TEXT, "hero", "아... 네, 감사합니다."));
        scripts.add(createScript(s1_2, 8, ScriptType.TEXT, "jisoo", "와 대박! 저돈데! 전 1분반 한지수예요. 반갑습니당!"));
        scripts.add(createScript(s1_2, 9, ScriptType.TEXT, "jisoo", "근데 몇 살이세요?"));
        scripts.add(createScript(s1_2, 10, ScriptType.TEXT, "hero", "스물넷입니다."));
        scripts.add(createScript(s1_2, 11, ScriptType.TEXT, "jisoo", "아, 오빠네! 저 스물하나예요. 말 놔도 되죠? 오빠 안녕!"));
        scripts.add(createScript(s1_2, 12, ScriptType.THINK, "hero", "오... 오빠? 만난 지 1분 만에 반말 모드 활성화라고?"));
        scripts.add(createScript(s1_2, 13, ScriptType.THINK, "hero", "이 친화력은 뭐지? 혹시... 나한테 관심 있나?"));
        scripts.add(createScript(s1_2, 14, ScriptType.THINK, "hero", "이성적인 호감이 아니고서야 이렇게 급발진할 리가..."));
        scripts.add(createScript(s1_2, 15, ScriptType.TEXT, "jisoo", "(깔깔 웃으며) 뭐야, 오빠 왜 이렇게 당황해? 귀엽게 ㅋㅋㅋ"));
        scripts.add(createScript(s1_2, 16, ScriptType.THINK, "hero", "'귀엽다'까지 나왔다. 이건 True다. 내 인생에도 봄날이..."));
        scripts.add(createScript(s1_2, 17, ScriptType.NARRATION, null, "그때, 문이 열리고 다른 학생들이 우르르 들어온다"));
        scripts.add(createScript(s1_2, 18, ScriptType.TEXT, "jisoo", "(도훈을 지나쳐 뛰어가며) 어!! 안녕하세요~! 몰입캠프시죠? 여기예요 여기!"));
        scripts.add(createScript(s1_2, 19, ScriptType.TEXT, "jisoo", "와, 짐 무겁죠? 제가 들어드릴까요? 저 1분반 한지수예요! 말 놔도 되죠?!"));
        scripts.add(createScript(s1_2, 20, ScriptType.THINK, "hero", "...아. Unicast가 아니라 Broadcast였구나."));
        scripts.add(createScript(s1_2, 21, ScriptType.THINK, "hero", "나한테만 보낸 패킷이 아니었어."));
        scripts.add(createScript(s1_2, 22, ScriptType.THINK, "hero", "그래, 나랑은 다른 세상 사람이다. 기대하지 말자."));
        scripts.add(createScript(s1_2, 23, ScriptType.NARRATION, null, "Expectation = Null"));

        // --- Scene 1-3: 도희와의 만남 (짝꿍) ---
        scripts.add(createScript(s1_3, 1, ScriptType.THINK, "hero", "오후 2시 20분. 강의실에 사람들이 많이 있다."));
        scripts.add(createScript(s1_3, 2, ScriptType.THINK, "hero", "내 앞자리에 후드티를 푹 눌러쓴 여자가 앉아있다. 주변 온도가 2도는 낮아 보인다."));
        scripts.add(createScript(s1_3, 3, ScriptType.THINK, "hero", "저분은... 포스가 장난 아닌데. 접근 금지(`Access Denied`) 구역이다."));
        scripts.add(createScript(s1_3, 4, ScriptType.THINK, "hero", "어?... [솔의 눈]?"));
        scripts.add(createScript(s1_3, 5, ScriptType.TEXT, "myeongseong", "(뒤에서 소근소근) 야, 동휘야. 저기 앞자리 여자분 혼자 계시는데 말 걸어볼까? 예쁘실 것 같은데."));
        scripts.add(createScript(s1_3, 6, ScriptType.TEXT, "donghwi", "미쳤냐? 딱 봐도 건드리면 문다. 그냥 앞이나 봐."));
        scripts.add(createScript(s1_3, 7, ScriptType.TEXT, "manager", "자~ 이제 1주차 짝꿍 배정하겠습니다!"));
        scripts.add(createScript(s1_3, 8, ScriptType.TEXT, "manager", "이도훈 님은... 탁한진 님!"));
        scripts.add(createScript(s1_3, 9, ScriptType.THINK, "hero", "휴, 다행이다. 저 앞자리 분이랑만 안 걸리면 돼."));
        scripts.add(createScript(s1_3, 10, ScriptType.TEXT, "hanjin", "(다크서클 가득한 눈으로) ...안녕하세요. 저희 안드로이드 스튜디오 쓰죠?"));
        scripts.add(createScript(s1_3, 11, ScriptType.TEXT, "hanjin", "전 백엔드 짤 테니까 그쪽이 UI 하실래요?"));
        scripts.add(createScript(s1_3, 12, ScriptType.TEXT, "hero", "아, 네. 일단 기획부터 하시죠"));
        scripts.add(createScript(s1_3, 13, ScriptType.THINK, "hero", "그렇게 남자 둘의 칙칙한 코딩이 시작되었다."));

        // --- Scene 1-4 Intro: 회식 & 편의점 ---
        scripts.add(createScript(s1_4_intro, 1, ScriptType.TEXT, "manager", "여러분! 코딩하느라 힘드시죠? 오늘 회식입니다! 다들 나오세요!"));
        scripts.add(createScript(s1_4_intro, 2, ScriptType.THINK, "hero", "아... 귀찮은데. `Skip` 버튼 없나. 그냥 대충 먹고 가야겠다."));
        scripts.add(createScript(s1_4_intro, 3, ScriptType.NARRATION, null, "(시간 경과. 시끌벅적한 술자리)"));
        scripts.add(createScript(s1_4_intro, 4, ScriptType.THINK, "hero", "할 얘기도 다 떨어졌고, 기 빨린다. 슬슬 탈출각을..."));
        scripts.add(createScript(s1_4_intro, 5, ScriptType.TEXT, "manager", "자자! 분위기 전환 겸 자리 한 번 섞겠습니다! 카톡방에서 제비뽑기 확인하세요!"));
        scripts.add(createScript(s1_4_intro, 6, ScriptType.TEXT, "manager", "[뽑기_시작]팀 나누기가 시작됐어요"));
        scripts.add(createScript(s1_4_intro, 7, ScriptType.TEXT, "hero", "[뽑기]나의 팀은 4팀입니다."));
        scripts.add(createScript(s1_4_intro, 8, ScriptType.TEXT, "dohee", "[뽑기]나의 팀은 4팀입니다."));
        scripts.add(createScript(s1_4_intro, 9, ScriptType.THINK, "hero", "...망했다. 어제 그 '솔의 눈' 그녀다."));
        scripts.add(createScript(s1_4_intro, 10, ScriptType.THINK, "hero", "모자 벗으니까... 꽤 예쁘네. 아니, 예쁜 정도가 아닌데?"));
        scripts.add(createScript(s1_4_intro, 11, ScriptType.THINK, "hero", "하지만 표정이 '말 걸면 죽임'이다."));
        scripts.add(createScript(s1_4_intro, 12, ScriptType.THINK, "hero", "그래, 없는 사람 취급해 주는 게 최고의 배려다. `Invisible` 모드 유지."));
        scripts.add(createScript(s1_4_intro, 13, ScriptType.NARRATION, null, "(주변 남자들이 도희에게 몰려든다)"));
        scripts.add(createScript(s1_4_intro, 14, ScriptType.TEXT, "myeongseong", "도희 님! 술 잘 못하시죠? 여기 초코우유 사 왔어요!"));
        scripts.add(createScript(s1_4_intro, 15, ScriptType.TEXT, "donghwi", "여대생들은 이런 거 좋아하신다면서요? 달달한 거 드세요!"));
        scripts.add(createScript(s1_4_intro, 16, ScriptType.TEXT, "dohee", "(작게 한숨을 쉬며) ...아, 네. 감사합니다."));
        scripts.add(createScript(s1_4_intro, 17, ScriptType.NARRATION, null, "(초코우유를 구석으로 밀어둔다)"));
        scripts.add(createScript(s1_4_intro, 18, ScriptType.THINK, "hero", "엄청 귀찮아 보이네."));
        scripts.add(createScript(s1_4_intro, 19, ScriptType.THINK, "hero", "표정을 보니 단 건 질색인 눈치인데... 다들 헛다리 짚고 있군."));
        scripts.add(createScript(s1_4_intro, 20, ScriptType.NARRATION, null, "도희가 자리에서 일어난다"));
        scripts.add(createScript(s1_4_intro, 21, ScriptType.TEXT, "dohee", "화장실 좀 다녀올게요."));
        scripts.add(createScript(s1_4_intro, 22, ScriptType.THINK, "hero", "나도 이틈에 바람이나 좀 쐬고 와야겠다."));
        scripts.add(createScript(s1_4_intro, 23, ScriptType.NARRATION, null, "저기 편의점에 가야겠다"));
        scripts.add(createScript(s1_4_intro, 24, ScriptType.TEXT, "dohee", "...너 도훈이라고 했나?"));
        scripts.add(createScript(s1_4_intro, 25, ScriptType.THINK, "hero", "깜짝이야! 고도희?"));
        scripts.add(createScript(s1_4_intro, 26, ScriptType.TEXT, "hero", "어... 네."));
        scripts.add(createScript(s1_4_intro, 27, ScriptType.TEXT, "dohee", "안 들어가고 뭐 해? 나 편의점 갈 건데 같이 갈래?"));
        scripts.add(createScript(s1_4_intro, 28, ScriptType.TEXT, "hero", "(엉겁결에) 아, 네."));
        scripts.add(createScript(s1_4_intro, 29, ScriptType.NARRATION, null, "도희가 계산대 앞에 섰다."));
        scripts.add(createScript(s1_4_intro, 30, ScriptType.THINK, "hero", "뭔가 하나 건네줘야 할 타이밍인가."));
        scripts.add(createScript(s1_4_intro, 31, ScriptType.THINK, "hero", "센스라는 걸 발휘해 보자"));

        // --- Scene 1-4 Branch A: 솔의 눈 ---
        scripts.add(createScript(s1_4_sol, 1, ScriptType.TEXT, "hero", "(무심하게 솔의 눈을 집어 건넨다) 이거 드시던데요."));
        scripts.add(createScript(s1_4_sol, 2, ScriptType.TEXT, "dohee", "...어? 뭐야. 너 뭘 좀 아는구나?"));
        scripts.add(createScript(s1_4_sol, 3, ScriptType.TEXT, "dohee", "다들 초코우유만 들이밀어서 속 느글거려 죽는 줄 알았는데."));
        scripts.add(createScript(s1_4_sol, 4, ScriptType.TEXT, "dohee", "고마워. 잘 마실게."));
        scripts.add(createScript(s1_4_sol, 5, ScriptType.NARRATION, null, "[호감도 대폭 상승] 도희가 당신을 \"말이 통하는 사람\"으로 인식합니다."));

        // --- Scene 1-4 Branch B: 숙취해소제 ---
        scripts.add(createScript(s1_4_drink, 1, ScriptType.TEXT, "hero", "술 깨는 데엔 이게 최고죠."));
        scripts.add(createScript(s1_4_drink, 2, ScriptType.TEXT, "dohee", "오, 현실적이네. 고마워. 내일 코딩하려면 정신 차려야지."));
        scripts.add(createScript(s1_4_drink, 3, ScriptType.NARRATION, null, "[호감도 +1] 무난한 선택입니다."));

        // --- Scene 1-4 Branch C: 초코우유 ---
        scripts.add(createScript(s1_4_milk, 1, ScriptType.TEXT, "hero", "여자분들은 단 거 좋아하시잖아요."));
        scripts.add(createScript(s1_4_milk, 2, ScriptType.TEXT, "dohee", "(미간을 찌푸리며) ...아. 너도 똑같구나."));
        scripts.add(createScript(s1_4_milk, 3, ScriptType.TEXT, "dohee", "나 단 거 안 좋아해. 마음만 받을게."));
        scripts.add(createScript(s1_4_milk, 4, ScriptType.NARRATION, null, "💔 [호감도 감소] 도희가 실망했습니다."));

        // --- Scene 1-4 Table: 편의점 앞 테이블 대화 ---
        scripts.add(createScript(s1_4_table, 1, ScriptType.NARRATION, null, "(두 사람은 편의점 앞 플라스틱 테이블에 잠시 걸터앉는다. 캔 따는 소리가 경쾌하게 들린다.)"));
        scripts.add(createScript(s1_4_table, 2, ScriptType.TEXT, "hero", "(캔을 따며) 사실 아까 엄청 고민했어요."));
        scripts.add(createScript(s1_4_table, 3, ScriptType.TEXT, "dohee", "(음료를 마시다 말고) 뭘?"));
        scripts.add(createScript(s1_4_table, 4, ScriptType.TEXT, "hero", "이게 2+1 행사 상품이더라고요. 하나를 더 가져와서 제가 두 개를 마실지, 아니면 그냥 깔끔하게 하나씩 마실지."));
        scripts.add(createScript(s1_4_table, 5, ScriptType.TEXT, "dohee", "(황당하다는 듯) 보통은 남은 하나를 킵해두거나 나한테 더 주지 않아?"));
        scripts.add(createScript(s1_4_table, 6, ScriptType.TEXT, "hero", "에이, 솔의 눈 두 캔은 치사량이죠. 그건 암살 시도나 마찬가지라 참았습니다."));
        scripts.add(createScript(s1_4_table, 7, ScriptType.TEXT, "dohee", "(풉, 하고 웃음이 터지며) 뭐야 그게. 나 이거 좋아한다니까?"));
        scripts.add(createScript(s1_4_table, 8, ScriptType.TEXT, "dohee", "아... 근데 두 개는 좀 힘들긴 하겠다. 머리 띵해서."));
        scripts.add(createScript(s1_4_table, 9, ScriptType.TEXT, "hero", "그쵸? 지금 딱 숲속에서 숨 쉬는 기분인데, 두 개 마시면 아마 나무가 됐을지도 몰라요."));
        scripts.add(createScript(s1_4_table, 10, ScriptType.TEXT, "dohee", "(입가에 미소를 띤 채 도훈을 본다) 너 되게 조용해 보였는데, 은근히 엉뚱한 소리 잘 하네."));
        scripts.add(createScript(s1_4_table, 11, ScriptType.TEXT, "hero", "술기운 빌려서 하는 거죠, 뭐. 아, 바람 시원하다."));
        scripts.add(createScript(s1_4_table, 12, ScriptType.TEXT, "hero", "(하늘을 보며) 지금 들어가지 말고 그냥 여기서 노상이나 깔까요?"));
        scripts.add(createScript(s1_4_table, 13, ScriptType.TEXT, "dohee", "(키득거리며) 참나, 객기 부리지 마. 너 얼굴 빨개."));
        scripts.add(createScript(s1_4_table, 14, ScriptType.TEXT, "dohee", "그래도... 바람 쐬니까 좀 살 것 같긴 하다."));
        scripts.add(createScript(s1_4_table, 15, ScriptType.NARRATION, null, "(잠시 정적이 흐르지만, 어색하지 않다. 도희가 캔을 가볍게 흔들며 먼저 일어난다.)"));
        scripts.add(createScript(s1_4_table, 16, ScriptType.TEXT, "dohee", "가자. 너무 오래 비우면 애들이 우리 도망간 줄 알겠다."));
        scripts.add(createScript(s1_4_table, 17, ScriptType.TEXT, "hero", "(따라 일어나며) 오해받으면 억울하니까 가야죠."));

        // --- Scene 1-4 Outro ---
        scripts.add(createScript(s1_4_outro, 1, ScriptType.THINK, "hero", "편의점에 갔다가 다시 자리로 돌아왔다"));
        scripts.add(createScript(s1_4_outro, 2, ScriptType.TEXT, "manager", "자, 1차 끝났습니다! 집 갈 사람은 가고, 2차 갈 사람들은 생생맥주로 이동~!"));
        scripts.add(createScript(s1_4_outro, 3, ScriptType.TEXT, "dohee", "(도훈을 쳐다보며) 너는? 갈 거야?"));

        // --- Scene 1-5 Party: 2차를 간다 - 파티 ---
        scripts.add(createScript(s1_5_party, 1, ScriptType.THINK, "hero", "안 갈 수가 없었다"));
        scripts.add(createScript(s1_5_party, 2, ScriptType.THINK, "hero", "저렇게 예쁜 분이 물어보는데 안 간다고 할 수 있는 사람이 있을까?"));
        scripts.add(createScript(s1_5_party, 3, ScriptType.TEXT, "wonyoung", "우리 다 같이 술 게임이나 할까요? 같은 그림 찾기 어때요?"));
        scripts.add(createScript(s1_5_party, 4, ScriptType.NARRATION, null, "🎮 미니게임 [카드 게임 - 같은 그림 찾기]이 시작됩니다!"));
        scripts.add(createScript(s1_5_party, 5, ScriptType.NARRATION, null, "성공 시: 술을 적게 마심 / 실패 시: 벌주 원샷"));
        scripts.add(createScript(s1_5_party, 6, ScriptType.NARRATION, null, "🎮 미니게임 [카드 게임 - 같은 그림 찾기]"));

        // --- Scene 1-5 Party Win: 미니게임 승리 후 ---
        scripts.add(createScript(s1_5_party_win, 1, ScriptType.NARRATION, null, "미니게임 승리!"));
        scripts.add(createScript(s1_5_party_win, 2, ScriptType.THINK, "hero", "술게임을 잘해버린 탓에 고도희가 많이 마셨다."));
        scripts.add(createScript(s1_5_party_win, 3, ScriptType.TEXT, "dohee", "(얼굴이 발그레하다) 으... 나 좀 취한 것 같아. 머리 아파."));
        scripts.add(createScript(s1_5_party_win, 4, ScriptType.TEXT, "hero", "괜찮아요? 기숙사까지 데려다줄게요."));
        scripts.add(createScript(s1_5_party_win, 5, ScriptType.TEXT, "dohee", "...그래 줄래? 혼자 가는건 힘들 것 같아서."));
        scripts.add(createScript(s1_5_party_win, 6, ScriptType.NARRATION, null, "밤공기를 맞으며 도희와 나란히 걷는다. 그녀가 묵묵히 걷다가 작게 \"고맙다\"고 중얼거렸다."));
        scripts.add(createScript(s1_5_party_win, 7, ScriptType.NARRATION, null, "💖 [호감도 대폭 상승]"));

        // --- Ending Scene 1: 미니게임 실패 - BAD ENDING ---
        scripts.add(createScript(ending_scene1, 1, ScriptType.THINK, "hero", "으윽... 세상이 돈다. "));
        scripts.add(createScript(ending_scene1, 2, ScriptType.NARRATION, null, "System.exit(0)"));
        scripts.add(createScript(ending_scene1, 3, ScriptType.NARRATION, null, "(다음 날 아침) 눈을 뜨니 기억이 없다. 실수한 것 같다. 퇴소각이다..."));
        scripts.add(createScript(ending_scene1, 4, ScriptType.NARRATION, null, "[BAD ENDING]"));

        // --- Scene 1-5 Dorm: 2차를 안 간다 - 기숙사 ---
        scripts.add(createScript(s1_5_dorm, 1, ScriptType.TEXT, "myeongseong", "도희! 넌 가는 거지? 에이~ 2분반 예쁜이가 빠지면 섭섭하지!"));
        scripts.add(createScript(s1_5_dorm, 2, ScriptType.TEXT, "hero", "전 먼저 들어가 보겠습니다. 내일 봬요."));
        scripts.add(createScript(s1_5_dorm, 3, ScriptType.NARRATION, null, "(다음 날 아침)"));
        scripts.add(createScript(s1_5_dorm, 4, ScriptType.NARRATION, null, "단톡방에 [인생네컷] 사진이 올라왔습니다."));
        scripts.add(createScript(s1_5_dorm, 5, ScriptType.TEXT, "myeongseong", "[image]/icon/인생네컷.png"));
        scripts.add(createScript(s1_5_dorm, 6, ScriptType.TEXT, "hanjin", "[message]오늘 너무 재밌었어요. 조심히 들어가세요! "));
        scripts.add(createScript(s1_5_dorm, 7, ScriptType.TEXT, "manager", "[message]조심히 들어가세요~~"));
        scripts.add(createScript(s1_5_dorm, 8, ScriptType.THINK, "hero", "사진 속 도희가 환하게 웃고 있다."));
        scripts.add(createScript(s1_5_dorm, 9, ScriptType.THINK, "hero", "...재밌었나 보네. 표정이 좋네."));
        scripts.add(createScript(s1_5_dorm, 10, ScriptType.THINK, "hero", "갈 걸 그랬나? 조금 아쉽다. Rollback 하고 싶지만 이미 늦었다."));

        // --- Scene 1-5 Debug: 구세주 ---
        scripts.add(createScript(s1_5_debug, 1, ScriptType.THINK, "hero", "어제 술 마신 게 아직도 안 깨네. 물이나 마시러 가자."));
        scripts.add(createScript(s1_5_debug, 2, ScriptType.TEXT, "jisoo", "(머리를 쥐어뜯으며) 으아아앙... 왜 안 되냐고... 나한테 왜 이래 ㅠㅠ"));
        scripts.add(createScript(s1_5_debug, 3, ScriptType.THINK, "hero", "못 본 척 지나가야지"));
        scripts.add(createScript(s1_5_debug, 4, ScriptType.TEXT, "jisoo", "어! 도훈 오빠다! ㅠㅠ 오빠 잘 만났다. 나 좀 살려줘!!"));
        scripts.add(createScript(s1_5_debug, 5, ScriptType.TEXT, "hero", "저 물 마시러 나온 건데요... 그리고 저 안드로이드 잘 모르는데."));
        scripts.add(createScript(s1_5_debug, 6, ScriptType.TEXT, "jisoo", "(울먹이며) 거짓말! 오빠 잘하는 거 다 알아. 이거 빨간 줄 좀 봐주라. 응?"));
        scripts.add(createScript(s1_5_debug, 7, ScriptType.TEXT, "jisoo", "안 고쳐지면 나 오늘 밤새워야 해..."));
        scripts.add(createScript(s1_5_debug, 8, ScriptType.TEXT, "hero", "(한숨) ...줘 봐요."));
        scripts.add(createScript(s1_5_debug, 9, ScriptType.NARRATION, null, "도훈은 익숙하게 Ctrl + Alt + S를 누르고 로그를 훑어본다."));
        scripts.add(createScript(s1_5_debug, 10, ScriptType.TEXT, "hero", "그냥 안드로이드 스튜디오가 가끔 멍청해질 때가 있어서 그래."));
        scripts.add(createScript(s1_5_debug, 11, ScriptType.THINK, "hero", "(타닥, 탁. Sync Project with Gradle Files을 클릭한다)"));
        scripts.add(createScript(s1_5_debug, 12, ScriptType.TEXT, "hero", "자, 됐죠?"));
        scripts.add(createScript(s1_5_debug, 13, ScriptType.TEXT, "jisoo", "어? 어?? 빨간 줄 다 없어졌다!!"));
        scripts.add(createScript(s1_5_debug, 14, ScriptType.TEXT, "jisoo", "헐... 오빠 뭐야? 방금 뭐 한 거야? 마법사야?"));
        scripts.add(createScript(s1_5_debug, 15, ScriptType.TEXT, "hero", "그냥 싱크 다시 맞춘 거야. 고장 안 났으니까 걱정 말고 해."));
        scripts.add(createScript(s1_5_debug, 16, ScriptType.TEXT, "hero", "그럼 난 이만."));
        scripts.add(createScript(s1_5_debug, 17, ScriptType.TEXT, "jisoo", "(뒤에서 외치며) 와... 진짜 멋있다... 고마워 오빠!!! 내가 밥 살게!!!"));
        scripts.add(createScript(s1_5_debug, 18, ScriptType.NARRATION, null, "그날 이후, 4일차, 5일차, 6일차... 지수는 틈만 나면 \"오빠!\" 하고 찾아오기 시작했다."));
        scripts.add(createScript(s1_5_debug, 19, ScriptType.NARRATION, null, "그리고 그 모습을, 도희가 멀리서 조용히 지켜보고 있었다."));
        scripts.add(createScript(s1_5_debug, 20, ScriptType.TEXT, "dohee", ". . ."));

        // --- Scene 1-6 Commit: 결과 발표 ---
        scripts.add(createScript(s1_6_commit, 1, ScriptType.TEXT, "manager", "자, 대망의 1주차 금픽 발표가 있겠습니다!"));
        scripts.add(createScript(s1_6_commit, 2, ScriptType.TEXT, "manager", "이번 주 우승 팀은... 고도희, 임유진 조! 이도훈, 탁한진 조!"));
        scripts.add(createScript(s1_6_commit, 3, ScriptType.NARRATION, null, "발표가 끝나고 강당을 나오는데 지수가 싱긋 웃으며 다가온다."));
        scripts.add(createScript(s1_6_commit, 4, ScriptType.TEXT, "jisoo", "도훈 오빠! 축하해! 우리 조 오빠 덕분에 금픽 됐어~"));
        scripts.add(createScript(s1_6_commit, 5, ScriptType.TEXT, "jisoo", "오빠가 안 도와줬으면 나 완성도 못 했을 거야 ㅠㅠ"));
        scripts.add(createScript(s1_6_commit, 6, ScriptType.TEXT, "hero", "(머쓱하게 목을 긁으며) 별말씀을... 네가 잘해서 된 거지."));
        scripts.add(createScript(s1_6_commit, 7, ScriptType.NARRATION, null, "(지수가 도훈의 옆을 스쳐 지나간다. 은은한 샴푸 향기가 난다)"));
        scripts.add(createScript(s1_6_commit, 8, ScriptType.THINK, "hero", "어... 내가 좋아하는 향이다."));
        scripts.add(createScript(s1_6_commit, 9, ScriptType.THINK, "hero", "심박수가 살짝 올라갔다. 위험해."));
        scripts.add(createScript(s1_6_commit, 10, ScriptType.NARRATION, null, "(그때, 뒤에서 팔짱을 낀 도희가 다가온다)"));
        scripts.add(createScript(s1_6_commit, 11, ScriptType.TEXT, "dohee", "야. 너 내 룸메랑 어떻게 아는 사이냐?"));
        scripts.add(createScript(s1_6_commit, 12, ScriptType.TEXT, "hero", "어? 둘이 룸메였어?"));
        scripts.add(createScript(s1_6_commit, 13, ScriptType.TEXT, "dohee", "그래. 밤마다 기숙사에서 \"2분반 안경 쓴 오빠가 코딩 개잘한다\", \"손가락이 섹시하다(?)\" 어찌나 떠들어대던지."));
        scripts.add(createScript(s1_6_commit, 14, ScriptType.TEXT, "dohee", "그게 너였구나? 덕분에 내가 아주 시끄러워서 잠을 못 잤어."));
        scripts.add(createScript(s1_6_commit, 15, ScriptType.TEXT, "hero", "예...? 전 그냥 코드만 봐줬는데요."));
        scripts.add(createScript(s1_6_commit, 16, ScriptType.NARRATION, null, "(한 발짝 다가오며)"));
        scripts.add(createScript(s1_6_commit, 17, ScriptType.TEXT, "dohee", "그게 문제라고. 이 삭막한 공대에서, 밤새우는 여자애 코드 봐주는 거?"));
        scripts.add(createScript(s1_6_commit, 18, ScriptType.TEXT, "dohee", "이 바닥에선 그거 플러팅(Flirting)이야. 알고나 있어?"));
        scripts.add(createScript(s1_6_commit, 19, ScriptType.TEXT, "dohee", "...뭐, 실력은 인정하지만."));
        scripts.add(createScript(s1_6_commit, 20, ScriptType.TEXT, "hero", "아... 죄송합니다? 제가 의도한 건 아닌데..."));
        scripts.add(createScript(s1_6_commit, 21, ScriptType.NARRATION, null, "(피식 웃으며 주머니에서 [솔의 눈]을 꺼내 도훈의 가슴팍에 툭 친다)"));
        scripts.add(createScript(s1_6_commit, 22, ScriptType.TEXT, "dohee", "사과하지 말고, 이거나 마셔."));
        scripts.add(createScript(s1_6_commit, 23, ScriptType.TEXT, "dohee", "지수 더 이상 헷갈리게 하지 말고"));
        scripts.add(createScript(s1_6_commit, 24, ScriptType.NARRATION, null, "(얼떨떨하게 캔을 받아든다)"));
        scripts.add(createScript(s1_6_commit, 25, ScriptType.TEXT, "hero", "...이걸 나한테?"));
        scripts.add(createScript(s1_6_commit, 26, ScriptType.TEXT, "dohee", "착각하지 마. 그냥 남아서 주는 거니까."));
        scripts.add(createScript(s1_6_commit, 27, ScriptType.NARRATION, null, "(도희는 뒤도 안 돌아보고 쿨하게 걸어간다)"));
        scripts.add(createScript(s1_6_commit, 28, ScriptType.THINK, "hero", "...뭐지, 이 상황?"));
        scripts.add(createScript(s1_6_commit, 29, ScriptType.THINK, "hero", "손에 쥐어진 솔의 눈이 차갑다."));
        scripts.add(createScript(s1_6_commit, 30, ScriptType.THINK, "hero", "하지만 기분은 나쁘지 않다."));
        scripts.add(createScript(s1_6_commit, 31, ScriptType.NARRATION, null, "1주차 종료. Save Point에 도달했습니다. 2주차 스토리를 로드하시겠습니까?"));

        // Script 저장
        scriptRepository.saveAll(scripts);
        sceneRepository.flush();
    }

    // ==========================================
    // Helper Methods
    // ==========================================

    private Scene createScene(String id, String chapterId, int seq, String title, String nextId) {
        return Scene.builder()
                .id(id)
                .chapterId(chapterId)
                .eventSeq(seq)
                .title(title)
                .defaultNextSceneId(nextId)
                .build();
    }

    private Script createScript(Scene scene, int index, ScriptType type, String speakerId, String content) {
        Script script = new Script();
        script.setId(UUID.randomUUID().toString()); // 고유 ID 생성
        script.setScene(scene);
        script.setScriptIndex(index);
        script.setType(type);
        script.setSpeakerId(speakerId);
        script.setContent(content);
        return script;
    }

}