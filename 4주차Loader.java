package com.madcamp.love_algorithm.loader;

import com.madcamp.love_algorithm.entity.*;
import com.madcamp.love_algorithm.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class Week4Loader implements CommandLineRunner {

    private final SceneRepository sceneRepository;
    private final ScriptRepository scriptRepository;
    private final OptionRepository optionRepository;

    @Override
    public void run(String... args) throws Exception {
        loadChapter4();
    }

    // ==========================================
    // [Chapter 4] 4주차 데이터 로딩
    // ==========================================
    private void loadChapter4() {
        List<Scene> scenes = new ArrayList<>();
        List<Script> scripts = new ArrayList<>();
        List<Option> options = new ArrayList<>();

        // ------------------------------------------------------
        // 1. Scene 생성
        // ------------------------------------------------------
        Scene s4_1 = createScene("chapter4_scene1", "chapter4", 1, "Main Thread - 자리가 어디냐", null);
        Scene s4_1_sera = createScene("chapter4_scene1_sera", "chapter4", 1, "앞줄 (세라 옆) 선택", "chapter4_scene2");
        Scene s4_1_dohee = createScene("chapter4_scene1_dohee", "chapter4", 1, "뒷줄 (도희 옆) 선택", "chapter4_scene2");
        Scene s4_2 = createScene("chapter4_scene2", "chapter4", 2, "Broadcasting - 반팅 제안", null);
        Scene s4_2_bad_ending = createScene("chapter4_scene2_bad_ending", "chapter4", 2, "반팅에 나간다 (BAD ENDING)", null);
        Scene s4_2_true_route = createScene("chapter4_scene2_true_route", "chapter4", 2, "안 나간다 (True Route)", "chapter4_scene3");

        scenes.addAll(List.of(s4_1, s4_1_sera, s4_1_dohee, s4_2, s4_2_bad_ending, s4_2_true_route));
        sceneRepository.saveAll(scenes);
        sceneRepository.flush();

        // ------------------------------------------------------
        // 2. Script 데이터 생성 (대본)
        // ------------------------------------------------------

        // --- Scene 4-1: Main Thread - 자리가 어디냐 ---
        scripts.add(createScript(s4_1, 0, ScriptType.전환, null, "", null, "{\"all\":\"nobody\"}", null, null, null));
        scripts.add(createScript(s4_1, 1, ScriptType.NARRATION, null, "\"스타트업의 미래와 AI\"라는 주제의 마지막 강연. 이미 내용은 중요하지 않다.", "auditorium.png", null, null, null, null));
        scripts.add(createScript(s4_1, 2, ScriptType.NARRATION, null, "4주간 너무 고생해서 다들 지쳐있는 듯하다.", null, null, null, null, null));
        scripts.add(createScript(s4_1, 3, ScriptType.TEXT, "sera", "야! 이도훈! 여기 자리 맡아놨어. 앞으로 와!", null, "{\"1\":\"sera_lean_chin\"}", null, null, null));
        scripts.add(createScript(s4_1, 4, ScriptType.TEXT, "sera", "강연 끝나고 바로 질문하고 싶은데 부끄러워. 너가 대신 해줘.", null, null, null, null, null));
        scripts.add(createScript(s4_1, 5, ScriptType.THINK, "hero", "..저긴 앞자리", null, null, null, null, null));
        scripts.add(createScript(s4_1, 6, ScriptType.TEXT, "dohee", "...도훈아. 여기 뒤쪽 에어컨 잘 나와.", null, "{\"3\":\"dohee_earphone_hand_up\"}", null, null, null));
        scripts.add(createScript(s4_1, 7, ScriptType.THINK, "hero", "..저긴 뒷자리", null, null, null, null, null));
        scripts.add(createScript(s4_1, 8, ScriptType.THINK, "hero", "앞줄의 세라는 열정적인 High Performance 모드.", null, null, null, null, null));
        scripts.add(createScript(s4_1, 9, ScriptType.THINK, "hero", "뒷줄의 도희는 안정적인 Power Saving 모드.", null, null, null, null, null));
        
        Script s4_1_10 = createScript(s4_1, 10, ScriptType.THINK, "hero", "나의 리소스인 몸은 하나다. 어디에 Allocation해야 할까?", null, null, null, null, null);
        scripts.add(s4_1_10);
        
        // Options for Scene 4-1
        Option opt_sera_seat = createOption(s4_1, "opt_sera_seat", "앞줄 (세라 옆)", "chapter4_scene1_sera");
        OptionScore score_sera_seat = OptionScore.builder()
                .option(opt_sera_seat)
                .targetCharacterId("sera")
                .score(5)
                .build();
        opt_sera_seat.getOptionScores().add(score_sera_seat);
        options.add(opt_sera_seat);
        
        Option opt_dohee_seat = createOption(s4_1, "opt_dohee_seat", "뒷줄 (도희 옆)", "chapter4_scene1_dohee");
        OptionScore score_dohee_seat = OptionScore.builder()
                .option(opt_dohee_seat)
                .targetCharacterId("dohee")
                .score(5)
                .build();
        opt_dohee_seat.getOptionScores().add(score_dohee_seat);
        options.add(opt_dohee_seat);

        // --- Scene 4-1 (Branch A): 앞줄 (세라 옆) 선택 ---
        scripts.add(createScript(s4_1_sera, 0, ScriptType.전환, null, "", null, "{\"all\":\"nobody\"}", null, null, null));
        scripts.add(createScript(s4_1_sera, 1, ScriptType.THINK, "hero", "세라의 목소리가 강연장을 쩌렁쩌렁 울린다. `Volume` 조절 기능이 고장 난 게 분명하다.", "auditorium.png", null, null, null, null));
        scripts.add(createScript(s4_1_sera, 2, ScriptType.THINK, "hero", "저기 앉으면 강연 내내 귀가 따갑겠지만...", null, null, null, null, null));
        scripts.add(createScript(s4_1_sera, 3, ScriptType.THINK, "hero", "왠지 저렇게 방방 뛰는 애를 무시하면 `Unhandled Exception`이 발생할 것 같다.", null, null, null, null, null));
        scripts.add(createScript(s4_1_sera, 4, ScriptType.THINK, "hero", "그래, 가주자. '대리 질문'이 뭔진 모르겠지만.", null, null, null, null, null));
        scripts.add(createScript(s4_1_sera, 5, ScriptType.TEXT, "sera", "어...? 진짜 왔네?", null, "{\"2\":\"sera_칭찬부끄\"}", null, null, null));
        scripts.add(createScript(s4_1_sera, 6, ScriptType.TEXT, "sera", "아니, 뭐... 너도 개발자니까 궁금한 거 많을 거 아냐. 겸사겸사 좋잖아.", null, null, null, null, null));
        scripts.add(createScript(s4_1_sera, 7, ScriptType.TEXT, "hero", "\"그래서, 대체 무슨 질문을 하라고 부른 겁니까? 질문 리스트 `json`으로 줘 봐요.\"", null, null, null, null, null));
        scripts.add(createScript(s4_1_sera, 8, ScriptType.TEXT, "sera", "아 그... 'LLM 모델 파인튜닝 시 데이터 오염 방지 전략' 뭐 이런 건데...", null, null, null, null, null));
        scripts.add(createScript(s4_1_sera, 9, ScriptType.TEXT, "sera", "...나 사실 사람들 앞에서 발표는 잘하는데, 질문은 부끄러워서 못한단 말이야.", null, null, null, null, null));
        scripts.add(createScript(s4_1_sera, 10, ScriptType.TEXT, "sera", "네가 대신 손들고 물어봐 줘. 난 옆에서 고개 끄덕이고 있을 테니까.", null, null, null, null, null));
        scripts.add(createScript(s4_1_sera, 11, ScriptType.THINK, "hero", "하... 기가 막히네. 나를 지금 `Proxy Server(대리 서버)`로 쓰시겠다?", null, null, null, null, null));
        scripts.add(createScript(s4_1_sera, 12, ScriptType.THINK, "hero", "본인은 `Client` 뒤에 숨어서 요청만 보내고, `Traffic`은 내가 다 받으라는 거잖아.", null, null, null, null, null));
        scripts.add(createScript(s4_1_sera, 13, ScriptType.THINK, "hero", "평소엔 그렇게 기세등등하더니, 의외로 부끄러움이 많네", null, null, null, null, null));
        scripts.add(createScript(s4_1_sera, 14, ScriptType.THINK, "hero", "좀 귀여울지도", null, null, null, null, null));
        scripts.add(createScript(s4_1_sera, 15, ScriptType.TEXT, "hero", "수수료 비싼 거 아시죠? 이거 끝나고 맛있는 거 사셔야 합니다.", null, null, null, null, null));
        scripts.add(createScript(s4_1_sera, 16, ScriptType.TEXT, "sera", "...알았어. 사줄게. 사주면 되잖아.", null, null, null, null, null));
        scripts.add(createScript(s4_1_sera, 17, ScriptType.TEXT, "sera", "그러니까 어디 가지 말고 딱 붙어 있어. 도망가면 죽어.", null, null, null, null, null));
        scripts.add(createScript(s4_1_sera, 18, ScriptType.NARRATION, null, "옷소매를 잡은 손이 미세하게 떨린다.", null, null, null, null, null));
        scripts.add(createScript(s4_1_sera, 19, ScriptType.THINK, "hero", "이 녀석, 생각보다 훨씬 긴장했구나.", null, null, null, null, null));
        scripts.add(createScript(s4_1_sera, 20, ScriptType.THINK, "hero", "강연 끝날 때까진 이대로 잡혀 있어 줘야겠다.", null, null, null, null, null));

        // --- Scene 4-1 (Branch B): 뒷줄 (도희 옆) 선택 ---
        scripts.add(createScript(s4_1_dohee, 0, ScriptType.전환, null, "", null, "{\"all\":\"nobody\"}", null, null, null));
        scripts.add(createScript(s4_1_dohee, 1, ScriptType.THINK, "hero", "앞줄은 전쟁터다. 저 에너지를 감당할 자신이 없다.", "auditorium.png", null, null, null, null));
        scripts.add(createScript(s4_1_dohee, 2, ScriptType.THINK, "hero", "반면 뒷줄 구석 자리는... 완벽하다.", null, null, null, null, null));
        scripts.add(createScript(s4_1_dohee, 3, ScriptType.THINK, "hero", "에어컨 바람이 직통으로 오는 `Cooling System` 최적화 구역.", null, null, null, null, null));
        scripts.add(createScript(s4_1_dohee, 4, ScriptType.THINK, "hero", "무엇보다 도희 씨 옆이라면, 불필요한 연산 없이 `Idle` 상태로 쉴 수 있을 것 같다.", null, null, null, null, null));
        scripts.add(createScript(s4_1_dohee, 5, ScriptType.TEXT, "hero", "앞줄은 기 빨려서요. 여기가 명당이네요.", null, null, null, null, null));
        scripts.add(createScript(s4_1_dohee, 6, ScriptType.TEXT, "dohee", "잘 생각했어. 저 앞은 기 쎈 애들 천지야.", null, "{\"2\":\"dohee_earphone\"}", null, null, null));
        scripts.add(createScript(s4_1_dohee, 7, ScriptType.TEXT, "dohee", "여기 앉아. 에어컨 나와서 머리 식히기 딱 좋아.", null, null, null, null, null));
        scripts.add(createScript(s4_1_dohee, 8, ScriptType.TEXT, "dohee", "낄래? 강연 내용은 어차피 나중에 자료 공유될 거고.", null, "{\"2\":\"dohee_earphone_hand\"}", null, null, null));
        scripts.add(createScript(s4_1_dohee, 9, ScriptType.TEXT, "dohee", "지금 듣기 딱 좋은 노래 찾았어.", null, null, null, null, null));
        scripts.add(createScript(s4_1_dohee, 10, ScriptType.NARRATION, null, "자 손", null, "{\"2\":\"dohee_earphone_give\"}", null, null, null));
        scripts.add(createScript(s4_1_dohee, 11, ScriptType.TEXT, "hero", "...노동요입니까? 코딩할 때 듣는 거?", null, null, null, null, null));
        scripts.add(createScript(s4_1_dohee, 12, ScriptType.TEXT, "dohee", "아니. 그냥 멍때리기 좋은 거.", null, "{\"2\":\"dohee_earphone\"}", null, null, null));
        scripts.add(createScript(s4_1_dohee, 13, ScriptType.NARRATION, null, "(잔잔한 Lo-fi 음악이 귓가에 퍼진다)", null, null, "romantic", null, null));
        scripts.add(createScript(s4_1_dohee, 14, ScriptType.THINK, "hero", "음악 취향이... 나랑 완전히 `Sync` 된다.", null, null, null, null, null));
        scripts.add(createScript(s4_1_dohee, 15, ScriptType.THINK, "hero", "강연자의 목소리는 `Background Noise` 처리되어 멀어지고, 이어폰 속 선율만 선명하다.", null, null, null, null, null));
        scripts.add(createScript(s4_1_dohee, 16, ScriptType.THINK, "hero", "이 평화로운 정적... `Power Saving` 모드로 전환되는 기분이다.", null, null, null, null, null));
        scripts.add(createScript(s4_1_dohee, 17, ScriptType.TEXT, "dohee", "...졸리다.", null, null, null, null, null));
        scripts.add(createScript(s4_1_dohee, 18, ScriptType.TEXT, "dohee", "그냥 어깨 좀 빌려줘. 마지막이잖아.", null, "{\"2\":\"dohee_no_shy\"}", null, null, null));
        scripts.add(createScript(s4_1_dohee, 19, ScriptType.THINK, "hero", "`Collision Check`(충돌 감지) 완료.", null, null, null, null, null));
        scripts.add(createScript(s4_1_dohee, 20, ScriptType.THINK, "hero", "근데...방금 '마지막'이라고 했나?", null, null, null, null, null));
        scripts.add(createScript(s4_1_dohee, 21, ScriptType.THINK, "hero", "평소라면 불편해서 깨웠겠지만... 지금은 아니다.", null, null, null, null, null));
        scripts.add(createScript(s4_1_dohee, 22, ScriptType.THINK, "hero", "이 사람의 무게가 싫지 않다.", null, null, null, null, null));
        scripts.add(createScript(s4_1_dohee, 23, ScriptType.THINK, "hero", "강연 시간이 조금만 더 길었으면 좋겠다는, 비효율적인 생각이 든다.", null, null, null, null, null));

        // --- Scene 4-2: Broadcasting - 반팅 제안 ---
        scripts.add(createScript(s4_2, 0, ScriptType.전환, null, "", null, "{\"all\":\"nobody\"}", null, null, null));
        scripts.add(createScript(s4_2, 1, ScriptType.NARRATION, null, "🔔 [운영진] 님이 카톡을 보냈다", "classroom_back.png", null, null, "kakao_alert", null));
        scripts.add(createScript(s4_2, 2, ScriptType.KAKAO, "manager", "1분반이랑 반팅하실 분 (남자) (0/3)", null, null, null, null, null));
        scripts.add(createScript(s4_2, 3, ScriptType.KAKAO, "wonyoung", "@이도훈 @박성재 @최영운 희망합니다.", null, null, null, null, null));
        scripts.add(createScript(s4_2, 4, ScriptType.KAKAO, "hero", "…?", null, null, null, null, null));
        scripts.add(createScript(s4_2, 5, ScriptType.TEXT, "dohee", "너 반팅 나가?", null, "{\"1\":\"dohee_no_부탁\"}", null, null, null));
        scripts.add(createScript(s4_2, 6, ScriptType.TEXT, "sera", "야. 단톡방 뭐야? 너 진짜 나가냐? ㅡㅡ", null, "{\"2\":\"sera_annoy_sitting\"}", null, null, null));
        scripts.add(createScript(s4_2, 7, ScriptType.TEXT, "jisoo", "도훈 오빠... 오빠 미팅 나간다며? 진짜야?", null, "{\"3\":\"jisoo_삐짐\"}", null, null, null));
        scripts.add(createScript(s4_2, 8, ScriptType.TEXT, "jisoo", "나 두고... 딴 여자 만나러 가는 거야?", null, null, null, null, null));
        
        Script s4_2_9 = createScript(s4_2, 9, ScriptType.THINK, "hero", "반팅, 나갈 것인가?", "classroom_back.png", null, null, null, null);
        scripts.add(s4_2_9);
        
        // Options for Scene 4-2
        Option opt_go_meeting = createOption(s4_2, "opt_go_meeting", "나간다.", "chapter4_scene2_bad_ending");
        options.add(opt_go_meeting);
        
        Option opt_dont_go = createOption(s4_2, "opt_dont_go", "안 나간다.", "chapter4_scene2_true_route");
        options.add(opt_dont_go);

        // --- Scene 4-2 (Bad Ending): 반팅에 나간다 ---
        scripts.add(createScript(s4_2_bad_ending, 0, ScriptType.전환, null, "", null, "{\"all\":\"nobody\"}", null, null, null));
        scripts.add(createScript(s4_2_bad_ending, 1, ScriptType.TEXT, "hero", "...애들이 사정사정하는데, 쪽수만 채워주러 갔다 올게. 별일 없을 거야.", null, null, null, null, null));
        scripts.add(createScript(s4_2_bad_ending, 2, ScriptType.TEXT, "jisoo", "..아, 그래? 오빠 그런 사람이었구나. 거절 못 하는 척하면서 즐기는.", null, null, null, null, null));
        scripts.add(createScript(s4_2_bad_ending, 5, ScriptType.NARRATION, null, "(반팅 술자리)", "second_restaurant_inside.png", null, null, null, null));
        scripts.add(createScript(s4_2_bad_ending, 6, ScriptType.TEXT, "hayoung", "\"도훈 님은 무슨 일 하세요?\"", null, "{\"2\":\"hayoung\"}", null, null, null));
        scripts.add(createScript(s4_2_bad_ending, 7, ScriptType.TEXT, "hero", "\"아, 백엔드 서버 최적화랑 DB 인덱싱 합니다.\"", null, null, null, null, null));
        scripts.add(createScript(s4_2_bad_ending, 8, ScriptType.TEXT, "hayoung", "\"...아 네……재미없다\"", null, "{\"2\":\"hayoung_no_fun\"}", null, null, null));
        scripts.add(createScript(s4_2_bad_ending, 9, ScriptType.전환, null, "", null, "{\"all\":\"nobody\"}", null, null, null));
        scripts.add(createScript(s4_2_bad_ending, 10, ScriptType.NARRATION, null, "반팅은 망했다. 그리고 소문은 더 망했다.", "classroom_back.png", null, null, null, null));
        scripts.add(createScript(s4_2_bad_ending, 11, ScriptType.NARRATION, null, "\"이도훈 걔, 여자애들한테 다 여지 주더니 결국 미팅 나가더라?\"", null, null, null, null, null));
        scripts.add(createScript(s4_2_bad_ending, 12, ScriptType.NARRATION, null, "\"어장관리남이네. 최악이다.\"", null, null, null, null, null));
        scripts.add(createScript(s4_2_bad_ending, 13, ScriptType.시스템, null, "[시스템] 💀 [Garbage Collection] 대상이 되었습니다.", null, null, null, null, null));
        scripts.add(createScript(s4_2_bad_ending, 14, ScriptType.NARRATION, null, "MT 명단에서 제외되었습니다. 쓸쓸한 퇴소 엔딩.", null, null, null, null, null));

        // --- Scene 4-2 (True Route): 안 나간다 ---
        scripts.add(createScript(s4_2_true_route, 1, ScriptType.KAKAO, "hero", "\"죄송합니다. 전 관심 없습니다. 다른 분 찾으세요.\"", null, "{\"all\":\"nobody\"}", null, null, null));
        scripts.add(createScript(s4_2_true_route, 2, ScriptType.TEXT, "hero", "\"안 가. 내가 거길 왜 가냐? 귀찮아\"", null, null, null, null, null));
        scripts.add(createScript(s4_2_true_route, 3, ScriptType.TEXT, "jisoo", "진짜지?! 꺄! 역시 오빠야!", null, "{\"2\":\"jisoo_신난다\"}", null, null, null));
        scripts.add(createScript(s4_2_true_route, 4, ScriptType.TEXT, "sera", "ㅋ 잘 생각했네.", null, "{\"1\":\"sera_basic\"}", null, null, null));
        scripts.add(createScript(s4_2_true_route, 5, ScriptType.TEXT, "dohee", "잘 생각했어.", null, "{\"3\":\"dohee_no_angry\"}", null, null, null));
        scripts.add(createScript(s4_2_true_route, 6, ScriptType.THINK, "hero", "휴. 엉뚱한 Branch랑 Merge 시도했다가 Conflict 나서 인생 꼬일 뻔했네.", "classroom_back.png", null, null, null, null));

        // Script 저장
        scriptRepository.saveAllAndFlush(scripts);

        // Option 저장 (OptionScore는 cascade로 자동 저장됨)
        if (!options.isEmpty()) {
            optionRepository.saveAllAndFlush(options);
        }

        sceneRepository.flush();

        System.out.println(">>> Chapter 4 데이터 로딩 완료");
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

    private Script createScript(Scene scene, int index, ScriptType type, String speakerId, String content,
                                String backgroundImgId, String characterImgId,
                                String backgroundSoundId, String effectSoundId, String overlayImageId) {
        Script script = new Script();
        script.setId(UUID.randomUUID().toString());
        script.setScene(scene);
        script.setScriptIndex(index);
        script.setType(type);
        script.setSpeakerId(speakerId);
        script.setContent(content);
        script.setBackgroundImgId(backgroundImgId);
        script.setCharacterImgId(characterImgId);
        script.setBackgroundSoundId(backgroundSoundId);
        script.setEffectSoundId(effectSoundId);
        script.setOverlayImageId(overlayImageId);
        return script;
    }

    private Option createOption(Scene scene, String optionId, String text, String nextSceneId) {
        Option option = Option.builder()
                .scene(scene)
                .text(text)
                .nextSceneId(nextSceneId)
                .optionScores(new ArrayList<>())
                .build();
        return option;
    }
}

