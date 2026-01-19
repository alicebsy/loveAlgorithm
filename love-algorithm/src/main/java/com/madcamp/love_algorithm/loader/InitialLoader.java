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
    // 새로 추가된 리포지토리 (반드시 생성되어 있어야 함)
    private final OptionRepository optionRepository;
    private final OptionScoreRepository optionScoreRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {

    // 1. 기존 데이터 초기화 (외래키 제약조건 때문에 자식 테이블부터 삭제)
        optionScoreRepository.deleteAll();
        optionRepository.deleteAll();
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

        // Scene 4 (분기점들)
        // intro에서 선택지가 발생하므로 nextSceneId는 null일 수도 있지만, 기본값으로 첫 번째 분기를 넣어두거나 null 처리
        Scene s1_4_intro = createScene("chapter1_scene4_intro", "chapter1", 4, "회식 시작", null);

        // 선택지에 따라 이동할 Scene들
        Scene s1_4_sol = createScene("chapter1_scene4_reaction_sol", "chapter1", 5, "솔의눈 선택", "chapter1_scene4_outro");
        Scene s1_4_drink = createScene("chapter1_scene4_reaction_drink", "chapter1", 6, "숙취해소제 선택", "chapter1_scene4_outro");
        Scene s1_4_milk = createScene("chapter1_scene4_reaction_milk", "chapter1", 7, "초코우유 선택", "chapter1_scene4_outro");

        Scene s1_4_outro = createScene("chapter1_scene4_outro", "chapter1", 8, "회식 종료", null);

        scenes.addAll(List.of(s1_1, s1_2, s1_3, s1_4_intro, s1_4_sol, s1_4_drink, s1_4_milk, s1_4_outro));
        sceneRepository.saveAll(scenes); // Scene 먼저 저장 (FK 참조 위해)
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
        scripts.add(createScript(s1_1, 8, ScriptType.TEXT, "manager", "안녕하세요! 2분반 여러분 환영합니다. 내일 오전 11시까지 카이마루(북측 식당) 앞으로 모여주세요!"));
        scripts.add(createScript(s1_1, 9, ScriptType.THINK, "hero", "내일 11시 집합이라... 일찍 자고 일찍 일어나야 겠다"));

        // --- Scene 1-2: 지수와의 만남 ---
        scripts.add(createScript(s1_2, 1, ScriptType.THINK, "hero", "11시 집합인데 긴장해서 10시에 와버렸다. TimeLimit 설정을 너무 넉넉하게 잡았나."));
        scripts.add(createScript(s1_2, 2, ScriptType.THINK, "hero", "아는 사람 마주치면 피곤한데... 일단 안으로 들어가자."));
        scripts.add(createScript(s1_2, 3, ScriptType.NARRATION, null, "그때, 뒤에서 누군가 도훈을 부른다"));
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
        scripts.add(createScript(s1_2, 22, ScriptType.THINK, "hero", "그래, 나랑은 다른 세상 사람이다. 기대하지 말자. Expectation = Null."));

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
        scripts.add(createScript(s1_4_intro, 6, ScriptType.TEXT, "manager", "팀 나누기가 시작됐어요"));
        scripts.add(createScript(s1_4_intro, 7, ScriptType.TEXT, "hero", "나의 팀은 4팀입니다."));
        scripts.add(createScript(s1_4_intro, 8, ScriptType.TEXT, "dohee", "나의 팀은 4팀입니다."));
        scripts.add(createScript(s1_4_intro, 9, ScriptType.THINK, "hero", "...망했다. 어제 그 '솔의 눈' 그녀다."));
        scripts.add(createScript(s1_4_intro, 10, ScriptType.THINK, "hero", "모자 벗으니까... 꽤 예쁘네. 아니, 예쁜 정도가 아닌데?"));
        scripts.add(createScript(s1_4_intro, 11, ScriptType.THINK, "hero", "하지만 표정이 '말 걸면 죽임'이다."));
        scripts.add(createScript(s1_4_intro, 12, ScriptType.THINK, "hero", "그래, 없는 사람 취급해 주는 게 최고의 배려다. `Invisible` 모드 유지."));
        scripts.add(createScript(s1_4_intro, 13, ScriptType.NARRATION, null, "(주변 남자들이 도희에게 몰려든다)"));
        scripts.add(createScript(s1_4_intro, 14, ScriptType.TEXT, "myeongseong", "도희 님! 술 잘 못하시죠? 여기 초코우유 사 왔어요!"));
        scripts.add(createScript(s1_4_intro, 15, ScriptType.TEXT, "donghwi", "여대생들은 이런 거 좋아하신다면서요? 달달한 거 드세요!"));
        scripts.add(createScript(s1_4_intro, 16, ScriptType.TEXT, "dohee", "(작게 한숨을 쉬며) ...아, 네. 감사합니다."));
        scripts.add(createScript(s1_4_intro, 17, ScriptType.NARRATION, null, "(초코우유를 구석으로 밀어둔다)"));
        scripts.add(createScript(s1_4_intro, 18, ScriptType.THINK, "hero", "엄청 귀찮아 보이네. 하긴, 단 거 싫어하는 눈치였는데."));
        scripts.add(createScript(s1_4_intro, 19, ScriptType.NARRATION, null, "(도희가 화장실을 간다며 일어난다. 도훈도 잠시 후 바람 쐬러 나간다)"));
        scripts.add(createScript(s1_4_intro, 20, ScriptType.NARRATION, null, "(가게 앞 편의점 벤치. 도희와 마주친다)"));
        scripts.add(createScript(s1_4_intro, 21, ScriptType.TEXT, "dohee", "(담백하게) ...너 도훈이라고 했나?"));
        scripts.add(createScript(s1_4_intro, 22, ScriptType.TEXT, "hero", "어... 네."));
        scripts.add(createScript(s1_4_intro, 23, ScriptType.TEXT, "dohee", "안 들어가고 뭐 해? 나 편의점 갈 건데 같이 갈래?"));
        scripts.add(createScript(s1_4_intro, 24, ScriptType.TEXT, "hero", "(엉겁결에) 아, 네."));
        scripts.add(createScript(s1_4_intro, 25, ScriptType.THINK, null, "도희가 계산대 앞에 섰습니다. 센스 있는 아이템을 고르세요."));

        // --- Scene 1-4 Branch A: 솔의 눈 ---
        scripts.add(createScript(s1_4_sol, 1, ScriptType.TEXT, "hero", "(무심하게 솔의 눈을 집어 건넨다) 이거 드시던데요."));
        scripts.add(createScript(s1_4_sol, 2, ScriptType.TEXT, "dohee", "...어? 뭐야. 너 뭘 좀 아는구나?"));
        scripts.add(createScript(s1_4_sol, 3, ScriptType.TEXT, "dohee", "다들 초코우유만 들이밀어서 속 느글거려 죽는 줄 알았는데."));
        scripts.add(createScript(s1_4_sol, 4, ScriptType.TEXT, "dohee", "(피식 웃으며) 고마워. 잘 마실게."));
        scripts.add(createScript(s1_4_sol, 5, ScriptType.NARRATION, null, "🌲 [호감도 대폭 상승] 도희가 당신을 \"말이 통하는 사람\"으로 인식합니다."));

        // --- Scene 1-4 Branch B: 숙취해소제 ---
        scripts.add(createScript(s1_4_drink, 1, ScriptType.TEXT, "hero", "술 깨는 데엔 이게 최고죠."));
        scripts.add(createScript(s1_4_drink, 2, ScriptType.TEXT, "dohee", "오, 현실적이네. 고마워. 내일 코딩하려면 정신 차려야지."));
        scripts.add(createScript(s1_4_drink, 3, ScriptType.NARRATION, null, "[호감도 +1] 무난한 선택입니다."));

        // --- Scene 1-4 Branch C: 초코우유 ---
        scripts.add(createScript(s1_4_milk, 1, ScriptType.TEXT, "hero", "여자분들은 단 거 좋아하시잖아요."));
        scripts.add(createScript(s1_4_milk, 2, ScriptType.TEXT, "dohee", "(미간을 찌푸리며) ...아. 너도 똑같구나."));
        scripts.add(createScript(s1_4_milk, 3, ScriptType.TEXT, "dohee", "나 단 거 안 좋아해. 마음만 받을게."));
        scripts.add(createScript(s1_4_milk, 4, ScriptType.NARRATION, null, "💔 [호감도 감소] 도희가 실망했습니다."));

        // --- Scene 1-4 Outro ---
        scripts.add(createScript(s1_4_outro, 1, ScriptType.NARRATION, null, "(자리로 돌아온 후)"));
        scripts.add(createScript(s1_4_outro, 2, ScriptType.TEXT, "manager", "자, 1차 끝났습니다! 집 갈 사람은 가고, 2차 갈 사람들은 생생맥주로 이동~!"));
        scripts.add(createScript(s1_4_outro, 3, ScriptType.TEXT, "dohee", "(도훈을 쳐다보며) 너는? 갈 거야?"));

        // Script 저장
        scriptRepository.saveAll(scripts);
        sceneRepository.flush();

        // ------------------------------------------------------
        // 3. Option (선택지) & OptionScore (호감도) 데이터 생성
        // ------------------------------------------------------
        // s1_4_intro 씬에서 발생하는 선택지들입니다.

        List<Option> options = new ArrayList<>();
        List<OptionScore> scores = new ArrayList<>();

        // (1) 솔의 눈 선택지
        Option optSol = createOption(s1_4_intro, "무심하게 솔의 눈을 건넨다", "chapter1_scene4_reaction_sol");
        options.add(optSol);
        scores.add(createOptionScore(optSol, "dohee", 10)); // 도희 +10

        // (2) 숙취해소제 선택지
        Option optDrink = createOption(s1_4_intro, "숙취해소제를 건넨다", "chapter1_scene4_reaction_drink");
        options.add(optDrink);
        scores.add(createOptionScore(optDrink, "dohee", 5)); // 도희 +5

        // (3) 초코우유 선택지
        Option optMilk = createOption(s1_4_intro, "초코우유를 건넨다", "chapter1_scene4_reaction_milk");
        options.add(optMilk);
        scores.add(createOptionScore(optMilk, "dohee", -5)); // 도희 -5

        // Option과 OptionScore 저장
        optionRepository.saveAll(options);
        optionRepository.flush();
        optionScoreRepository.saveAll(scores);
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

    // [NEW] 선택지 생성 헬퍼
    private Option createOption(Scene scene, String text, String nextSceneId) {
        return Option.builder()
                .scene(scene)
                .text(text)
                .nextSceneId(nextSceneId)
                .build();
    }

    // [NEW] 호감도 점수 생성 헬퍼
    private OptionScore createOptionScore(Option option, String target, int score) {
        return OptionScore.builder()
                .option(option)
                .targetCharacterId(target)
                .score(score)
                .build();
    }
}