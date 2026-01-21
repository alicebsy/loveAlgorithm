    // ==========================================
    // [Chapter 2] 2주차 데이터 로딩
    // ==========================================
    private void loadChapter2() {
        List<Scene> scenes = new ArrayList<>();
        List<Script> scripts = new ArrayList<>();
        List<Option> options = new ArrayList<>();

        // ------------------------------------------------------
        // 1. Scene 생성
        // ------------------------------------------------------
        Scene s2_1 = createScene("chapter2_scene1", "chapter2", 1, "Conflict - 새로운 파트너", "chapter2_scene2");
        Scene s2_1_win = createScene("chapter2_scene1_win", "chapter2", 1, "리팩토링 성공", "chapter2_scene2");
        Scene s2_1_lose = createScene("chapter2_scene1_lose", "chapter2", 1, "리팩토링 실패", "chapter2_scene2");
        Scene s2_2 = createScene("chapter2_scene2", "chapter2", 2, "Missing_Component - 아픈 도희", null);
        Scene s2_2_dohee = createScene("chapter2_scene2_dohee", "chapter2", 2, "죽 배달 (도희 루트)", "chapter2_scene3");
        Scene s2_2_bad = createScene("chapter2_scene2_bad", "chapter2", 2, "꼰대 문자 (BAD ENDING)", null);
        Scene s2_2_sera = createScene("chapter2_scene2_sera", "chapter2", 2, "안 보낸다 (세라 루트)", "chapter2_scene3");
        Scene s2_3 = createScene("chapter2_scene3", "chapter2", 3, "Exception_Handling - 오리연못의 비밀", "chapter2_scene4");
        Scene s2_3_result1 = createScene("chapter2_scene3_result1", "chapter2", 3, "선택 1 - 당황/사과", "chapter2_scene4");
        Scene s2_3_result2 = createScene("chapter2_scene3_result2", "chapter2", 3, "선택 2 - 팩트 폭력/어색함", "chapter2_scene4");
        Scene s2_3_result3 = createScene("chapter2_scene3_result3", "chapter2", 3, "선택 3 - 소심한 직구", "chapter2_scene4");
        Scene s2_4 = createScene("chapter2_scene4", "chapter2", 4, "Deadlock - 발표 3시간 전", null);
        Scene s2_4_jisoo = createScene("chapter2_scene4_jisoo", "chapter2", 4, "지수를 도와준다", null);
        Scene s2_4_sera = createScene("chapter2_scene4_sera", "chapter2", 4, "세라와 마무리한다 (세라 True Route)", "chapter3_scene1");

        scenes.addAll(List.of(s2_1, s2_1_win, s2_1_lose, s2_2, s2_2_dohee, s2_2_bad, s2_2_sera,
                s2_3, s2_3_result1, s2_3_result2, s2_3_result3, s2_4, s2_4_jisoo, s2_4_sera));
        sceneRepository.saveAll(scenes);
        sceneRepository.flush();

        // ------------------------------------------------------
        // 2. Script 데이터 생성 (대본)
        // ------------------------------------------------------

        // --- Scene 2-1: Conflict - 새로운 파트너 ---
        scripts.add(createScript(s2_1, 0, ScriptType.valueOf("전환"), null, "", null, "{\"all\":\"nobody\"}", null, null, null));
        scripts.add(createScript(s2_1, 1, ScriptType.NARRATION, null, "1주차가 끝나고 팀이 리셋되었다. 이번 2주차 파트너는 포스텍에서 온 '천세라'.", "classroom.png", null, "typing_noise", null, null));
        scripts.add(createScript(s2_1, 2, ScriptType.THINK, "hero", "소문으로는 성격이 보통이 아니라던데.", null, null, null, null, null));
        scripts.add(createScript(s2_1, 3, ScriptType.THINK, "hero", "뭐야, 얘 뭔데 나 팔짱 끼고 흝어봐", null, "{\"2\":\"sera_거만_crossedarm.png\"}", null, null, null));
        scripts.add(createScript(s2_1, 4, ScriptType.TEXT, "sera", "안녕, 이도훈? 너 개발 좀 한다며?", null, null, null, null, null));
        scripts.add(createScript(s2_1, 5, ScriptType.TEXT, "sera", "1주차 금픽... 뭐 운이 좋았겠지. 이번엔 나한테 묻어가면 되니까, 방해만 하지 마.", null, null, null, null, null));
        scripts.add(createScript(s2_1, 6, ScriptType.TEXT, "hero", "...반갑습니다. 기획부터 잡죠.", null, null, null, null, null));
        scripts.add(createScript(s2_1, 7, ScriptType.NARRATION, null, "(잠시 후, 개발 시작)", null, null, null, null, null));
        scripts.add(createScript(s2_1, 8, ScriptType.NARRATION, null, "`git push` 알림이 도착했습니다. (Author: Sera_Chun)", null, null, null, null, null));
        scripts.add(createScript(s2_1, 9, ScriptType.THINK, "hero", "벌써 구현을 다 했다고? 속도가 비정상적인데. 코드를 확인해보자.", null, null, null, null, null));
        scripts.add(createScript(s2_1, 10, ScriptType.THINK, "hero", "...이게 뭐야.", null, null, null, null, null));
        scripts.add(createScript(s2_1, 11, ScriptType.TEXT, "hero", "세라 님, 여기 주석 보이세요?", null, null, null, null, null));
        scripts.add(createScript(s2_1, 12, ScriptType.NARRATION, null, "// 요청하신 '게임 저장 기능'에 대한 구현 예시를 아래와 같이 생성하였습니다.", null, null, null, null, null));
        scripts.add(createScript(s2_1, 13, ScriptType.TEXT, "hero", "이거 지우지도 않고 커밋했어요? 그리고 이 함수는 왜 이 파일에 들어가 있어요?", null, null, null, null, null));
        scripts.add(createScript(s2_1, 14, ScriptType.TEXT, "sera", "(움찔하며) 아, 돌아가면 장땡이지! 기능 구현 다 됐잖아!", null, "{\"2\":\"sera_annoy_sitting.png\"}", null, null, null));
        scripts.add(createScript(s2_1, 15, ScriptType.TEXT, "sera", "요즘 누가 촌스럽게 한 줄 한 줄 다 짜? AI 써서 생산성 높이는 게 능력이야!", null, null, null, null, null));
        scripts.add(createScript(s2_1, 16, ScriptType.TEXT, "hero", "유지보수는요? 이 코드 나중에 에러 터지면 디버깅 불가능합니다. 비키세요. 제가 엎습니다.", null, null, null, null, null));
        scripts.add(createScript(s2_1, 17, ScriptType.TEXT, "sera", "(얼굴이 빨개져서) 야! 왜 바꿔! 내 코드가 어디가 어때서!", null, null, null, null, null));
        scripts.add(createScript(s2_1, 18, ScriptType.valueOf("시스템"), null, "🎮 미니게임 [스파게티 코드 리팩토링]이 시작됩니다!", null, null, "keyboard_typing", null, null));
        
        Script s2_1_19 = createScript(s2_1, 19, ScriptType.valueOf("game"), null, "🎮 미니게임 [스파게티 코드 리팩토링]", null, null, null, null, null);
        // game_config는 Script 엔티티에 JSON으로 저장되어야 함
        s2_1_19.setGameConfig("{\"game_id\":\"refactor_game\",\"game_name\":\"스파게티 코드 리팩토링\",\"win_scene_id\":\"chapter2_scene1_win\",\"lose_scene_id\":\"chapter2_scene1_lose\"}");
        scripts.add(s2_1_19);

        // --- Scene 2-1 Win: 리팩토링 성공 ---
        scripts.add(createScript(s2_1_win, 1, ScriptType.TEXT, "hero", "(안경을 고쳐 쓰며) 끝났습니다. 기능은 그대로고, 로직만 정리했습니다.", "lab.png", "{\"2\":\"nobody\"}", null, null, null));
        scripts.add(createScript(s2_1_win, 2, ScriptType.TEXT, "sera", "(모니터를 보며) ...흥.", null, "{\"2\":\"sera_칭찬부끄.png\"}", null, null, null));
        scripts.add(createScript(s2_1_win, 3, ScriptType.TEXT, "sera", "뭐... 확실히 가독성은 좀 괜찮아지긴 했네. 인정.", null, null, null, null, null));
        scripts.add(createScript(s2_1_win, 4, ScriptType.TEXT, "hero", "그리고, 아까 AI 쓴 거요. 마냥 나쁜 건 아닌 것 같네요. 초안 잡는 속도는 빨랐으니까.", null, null, null, null, null));
        scripts.add(createScript(s2_1_win, 5, ScriptType.TEXT, "hero", "덕분에 야근 안 하고 끝난 건 고맙습니다.", null, null, null, null, null));
        scripts.add(createScript(s2_1_win, 6, ScriptType.TEXT, "sera", "뭐, 뭐래... 당연한 걸 가지고.", null, null, null, null, null));
        scripts.add(createScript(s2_1_win, 7, ScriptType.THINK, null, "귀끝이 약간 빨개졌다.", null, null, null, null, null));

        // --- Scene 2-1 Lose: 리팩토링 실패 ---
        scripts.add(createScript(s2_1_lose, 0, ScriptType.valueOf("전환"), null, "", null, "{\"all\":\"nobody\"}", null, null, null));
        scripts.add(createScript(s2_1_lose, 1, ScriptType.NARRATION, null, "코드가 너무 복잡해서 리팩토링에 실패했다.", "lab.png", null, null, null, null));
        scripts.add(createScript(s2_1_lose, 2, ScriptType.TEXT, "sera", "흥, 역시 내 코드가 최고지.", null, "{\"2\":\"sera_거만_crossedarm.png\"}", null, null, null));

        // --- Scene 2-2: Missing_Component - 아픈 도희 ---
        scripts.add(createScript(s2_2, 0, ScriptType.valueOf("전환"), null, "", null, "{\"all\":\"nobody\"}", null, null, null));
        scripts.add(createScript(s2_2, 1, ScriptType.THINK, "hero", "반대편 창가 쪽이 허전하다. 그 검은 후드티가 안 보인다.", "classroom.png", null, null, null, null));
        scripts.add(createScript(s2_2, 2, ScriptType.TEXT, "hero", "저기, 세라 님. 도희 씨 왜 안 나와요?", null, null, null, null, null));
        scripts.add(createScript(s2_2, 3, ScriptType.TEXT, "sera", "아, 걔? 몸살 났대. 열이 39도라나 뭐라나.", null, "{\"2\":\"sera_staring_monitor.png\"}", null, null, null));
        scripts.add(createScript(s2_2, 4, ScriptType.TEXT, "sera", "...왜? 연락이라도 해보게?", null, "{\"2\":\"sera_lookingme_monitor.png\"}", null, null, null));
        
        Script s2_2_5 = createScript(s2_2, 5, ScriptType.THINK, "hero", "센스라는 걸 발휘해 보자", null, null, null, null, null);
        scripts.add(s2_2_5);
        // Options 추가
        Option opt_dohee_soup = createOption(s2_2_5, "opt_dohee_soup", "🍲 죽을 배달시켜 준다", "chapter2_scene2_dohee");
        options.add(opt_dohee_soup);
        Option opt_dohee_bad = createOption(s2_2_5, "opt_dohee_bad", "📱 \"몸 관리 좀 잘하지 ㅉㅉ\"", "chapter2_scene2_bad");
        options.add(opt_dohee_bad);
        Option opt_sera_ignore = createOption(s2_2_5, "opt_sera_ignore", "🙅‍♂️ 안 보낸다", "chapter2_scene2_sera");
        options.add(opt_sera_ignore);

        // --- Scene 2-2 Dohee: 죽 배달 (도희 루트) ---
        scripts.add(createScript(s2_2_dohee, 1, ScriptType.valueOf("카톡"), "hero", "[image]/icon/본죽_기프티콘.png", null, null, null, null, null));
        scripts.add(createScript(s2_2_dohee, 2, ScriptType.valueOf("카톡"), "hero", "아프다 들었어요.", null, null, null, null, null));
        scripts.add(createScript(s2_2_dohee, 3, ScriptType.valueOf("카톡"), "hero", "이거 먹고 얼른 나아요, 프로젝트 펑크 내지 말고.", null, null, null, null, null));
        scripts.add(createScript(s2_2_dohee, 4, ScriptType.valueOf("카톡"), "도희", "...뭐야. 고마워. 잘 먹을게.", null, null, null, null, null));
        scripts.add(createScript(s2_2_dohee, 5, ScriptType.valueOf("전환"), null, "", null, "{\"all\":\"nobody\"}", null, null, null));
        scripts.add(createScript(s2_2_dohee, 6, ScriptType.NARRATION, null, "(그 날 저녁, 기숙사 방)", "jisoo_room.png", null, null, null, null));
        scripts.add(createScript(s2_2_dohee, 7, ScriptType.TEXT, "jisoo", "(도희의 죽 빈 그릇을 보며) 어? 언니, 너 죽 시켰어? 잘했네!", null, "{\"3\":\"jisoo_smile.png\"}", null, null, null));
        scripts.add(createScript(s2_2_dohee, 8, ScriptType.TEXT, "도희", "아니, 누가 보내줬어. 우리반 안경 걔가.", null, "{\"1\":\"dohee_happy.png\"}", null, null, null));
        scripts.add(createScript(s2_2_dohee, 9, ScriptType.TEXT, "jisoo", "(표정이 굳으며) ...도훈 오빠가?", null, "{\"3\":\"jisoo_basic.png\"}", null, null, null));
        scripts.add(createScript(s2_2_dohee, 10, ScriptType.TEXT, "jisoo", "오빠는 나한텐 그런 거 안 보내주던데... 좋겠네 언니는.", null, null, null, null, null));
        scripts.add(createScript(s2_2_dohee, 11, ScriptType.NARRATION, null, "지수의 표정이 좋지 않다.", null, null, null, null, null));
        scripts.add(createScript(s2_2_dohee, 12, ScriptType.valueOf("시스템"), null, "[호감도 상승] 도희의 호감도가 상승했습니다.", null, null, null, null, null));
        scripts.add(createScript(s2_2_dohee, 13, ScriptType.valueOf("시스템"), null, "[호감도 하락] 지수의 호감도가 하락했습니다.", null, null, null, null, null));

        // --- Scene 2-2 Bad: 꼰대 문자 (BAD ENDING) ---
        scripts.add(createScript(s2_2_bad, 1, ScriptType.valueOf("카톡"), "hero", "ㅉㅉ 몸 관리도 실력입니다. 팀원들 민폐 끼치지 말고 푹 쉬세요. [도희]", null, null, null, null, null));
        scripts.add(createScript(s2_2_bad, 2, ScriptType.valueOf("카톡"), "도희", "뭐?", null, null, null, null, null));
        scripts.add(createScript(s2_2_bad, 3, ScriptType.valueOf("시스템"), null, "🚨 [치명적 오류] 룸메이트 지수가 이 톡을 봤습니다.", null, null, null, null, null));
        scripts.add(createScript(s2_2_bad, 4, ScriptType.valueOf("카톡"), "jisoo", "오빠... 실망이야. 사람이 어떻게 그래? [지수]", null, null, null, null, null));
        scripts.add(createScript(s2_2_bad, 5, ScriptType.valueOf("전환"), null, "", null, "{\"all\":\"nobody\"}", null, null, null));
        scripts.add(createScript(s2_2_bad, 6, ScriptType.NARRATION, null, "(다음 날)", "classroom.png", null, null, null, null));
        scripts.add(createScript(s2_2_bad, 7, ScriptType.NARRATION, null, "모든 분반에 \"2분반 이도훈 인성 터짐\"이라고 소문이 났다. 아무도 나와 팀을 하려 하지 않는다.", null, null, null, null, null));
        scripts.add(createScript(s2_2_bad, 8, ScriptType.valueOf("시스템"), null, "[GAME OVER] - 사회적 매장 엔딩", null, null, null, null, null));

        // --- Scene 2-2 Sera: 안 보낸다 (세라 루트) ---
        scripts.add(createScript(s2_2_sera, 0, ScriptType.valueOf("전환"), null, "", null, "{\"all\":\"nobody\"}", null, null, null));
        scripts.add(createScript(s2_2_sera, 1, ScriptType.TEXT, "hero", "아뇨, 뭐. 알아서 쉬겠죠. 우리 코드나 짭시다.", "lab.png", null, null, null, null));
        scripts.add(createScript(s2_2_sera, 2, ScriptType.THINK, "hero", "걱정되긴 한데 나중에 연락해야지", null, null, null, null, null));
        scripts.add(createScript(s2_2_sera, 3, ScriptType.TEXT, "sera", "흐음~ 뭐야? 보낼 듯이 굴더니. 꽤 냉정하네?", null, "{\"2\":\"sera_lean_chin.png\"}", null, null, null));
        scripts.add(createScript(s2_2_sera, 4, ScriptType.TEXT, "sera", "그래, 집중해. 딴 데 한눈팔지 말고 나만 보라고. 프로젝트 말이야.", null, null, null, null, null));
        scripts.add(createScript(s2_2_sera, 5, ScriptType.THINK, "hero", "방금 '나만 보라고' 한 거 맞나? 기분 탓인가.", null, null, null, null, null));

        // --- Scene 2-3: Exception_Handling - 오리연못의 비밀 ---
        scripts.add(createScript(s2_3, 0, ScriptType.valueOf("전환"), null, "", null, "{\"all\":\"nobody\"}", null, null, null));
        scripts.add(createScript(s2_3, 1, ScriptType.NARRATION, null, "낮의 햇살이 너무 강렬하다. 기숙사로 돌아가는 길, KAIST의 명물 오리연못 앞을 지나가던 도훈.", "kaist_pond.png", null, "morning_ambience", null, null));
        scripts.add(createScript(s2_3, 2, ScriptType.NARRATION, null, "연못에서 누군가 쭈그려 앉아 있다. 세라다.", null, null, null, null, null));
        scripts.add(createScript(s2_3, 3, ScriptType.NARRATION, null, "(거위에게 소시지를 떼어주며, 혀 짧은 소리로)", null, "{\"2\":\"sera_pond.png\"}", null, null, null));
        scripts.add(createScript(s2_3, 4, ScriptType.TEXT, "sera", "\"마이쪄? 우쭈쭈... 마이 먹어라 우리 애기들.\"", null, null, null, null, null));
        scripts.add(createScript(s2_3, 5, ScriptType.TEXT, "sera", "\"있지, 어떤 눈매 더러운 안경 쓴 남자 오면 확 쪼아버려. 알았지?\"", null, null, null, null, null));
        scripts.add(createScript(s2_3, 6, ScriptType.TEXT, "sera", "\"감히 내 코드를 싹 다 갈아엎어? 보면 엉덩이를 확 물어버려!\"", null, null, null, null, null));
        scripts.add(createScript(s2_3, 7, ScriptType.TEXT, "hero", "거위한테 살인 청부라니, 너무한 거 아닙니까?", null, null, null, null, null));
        scripts.add(createScript(s2_3, 8, ScriptType.TEXT, "sera", "(화들짝 놀라며) 히익?!", null, "{\"2\":\"sera_surprised.png\"}", null, null, null));
        scripts.add(createScript(s2_3, 9, ScriptType.NARRATION, null, "세라가 놀라서 일어나려다 다리에 쥐가 났다.", null, null, null, null, null));
        scripts.add(createScript(s2_3, 10, ScriptType.NARRATION, null, "몸이 연못 쪽으로 기우뚱한다.", null, null, null, null, null));
        scripts.add(createScript(s2_3, 11, ScriptType.TEXT, "hero", "조심해요!", null, null, null, null, null));
        scripts.add(createScript(s2_3, 12, ScriptType.NARRATION, null, "다행히 넘어지기 전에 가방끈을 낚아챘다.", null, null, null, null, null));
        scripts.add(createScript(s2_3, 13, ScriptType.TEXT, "sera", "아, 안 넘어지거든?! 그리고 이거 거위한테 주는 거 아니야! 그냥 남아서 버리려던 거야!", null, "{\"2\":\"sera_annoy_shy.png\"}", null, null, null));
        scripts.add(createScript(s2_3, 14, ScriptType.THINK, null, "손에 든 소시지는 누가 봐도 방금 산 새것이다", null, null, null, null, null));
        
        Script s2_3_15 = createScript(s2_3, 15, ScriptType.THINK, "hero", "소심한 도훈의 '거리두기'와 대응", null, null, null, null, null);
        scripts.add(s2_3_15);
        // Options 추가
        Option opt_sera_apologize = createOption(s2_3_15, "opt_sera_apologize", "잡고 있던 가방끈을 놓는다", "chapter2_scene3_result1");
        options.add(opt_sera_apologize);
        Option opt_sera_fact = createOption(s2_3_15, "opt_sera_fact", "\"버리는 거 치고는... 2+1 스티커가 너무 선명한데요.\"", "chapter2_scene3_result2");
        options.add(opt_sera_fact);
        Option opt_sera_direct = createOption(s2_3_15, "opt_sera_direct", "\"다리에 쥐 났다면서요... 혼자 설 수 있을 때까지 잡고 있을게요.\"", "chapter2_scene3_result3");
        options.add(opt_sera_direct);

        // --- Scene 2-3 Result 1: 선택 1 - 당황/사과 ---
        scripts.add(createScript(s2_3_result1, 0, ScriptType.valueOf("전환"), null, "", null, "{\"all\":\"nobody\"}", null, null, null));
        scripts.add(createScript(s2_3_result1, 1, ScriptType.TEXT, "hero", "아, 죄송합니다! 제가 너무 세게 잡아당겼죠? 다리는 괜찮아요?", "kaist_pond.png", null, null, null, null));
        scripts.add(createScript(s2_3_result1, 2, ScriptType.TEXT, "sera", "(오히려 가방끈을 놓으니까 휘청하며) 야! 갑자기 놓으면 어떡해!", null, "{\"2\":\"sera_surprised.png\"}", null, null, null));
        scripts.add(createScript(s2_3_result1, 3, ScriptType.TEXT, "hero", "아, 그게... 너무 가까운 것 같아서...", null, null, null, null, null));
        scripts.add(createScript(s2_3_result1, 4, ScriptType.TEXT, "hero", "저, 그리고 아까 '우쭈쭈' 하시는 거 다 들었는데, 못 들은 걸로 할게요. 제 메모리에서 방금 강제 종료(Kill Process) 시켰습니다.", null, null, null, null, null));
        scripts.add(createScript(s2_3_result1, 5, ScriptType.TEXT, "sera", "악!! 하지 마! 강제 종료고 뭐고 다 잊어버려!!", null, "{\"2\":\"sera_annoy_shy.png\"}", null, null, null));
        scripts.add(createScript(s2_3_result1, 6, ScriptType.valueOf("시스템"), null, "💥 [세라]가 당신의 당황한 모습에 오히려 더 부끄러워합니다.", null, null, null, null, null));

        // --- Scene 2-3 Result 2: 선택 2 - 팩트 폭력/어색함 ---
        scripts.add(createScript(s2_3_result2, 0, ScriptType.valueOf("전환"), null, "", null, "{\"all\":\"nobody\"}", null, null, null));
        scripts.add(createScript(s2_3_result2, 1, ScriptType.TEXT, "hero", "버리시는 것자치고는... 포장지가 너무 빳빳한데요. 편의점 2+1 스티커도 방금 붙인 것처럼 깨끗하고...", "kaist_pond.png", null, null, null, null));
        scripts.add(createScript(s2_3_result2, 2, ScriptType.TEXT, "sera", "아, 아니라고! 내가 먹으려다가... 맛없어서 주는 거야!", null, "{\"2\":\"sera_shy_front.png\"}", null, null, null));
        scripts.add(createScript(s2_3_result2, 3, ScriptType.TEXT, "hero", "거짓말... 세라 님 거짓말할 때 안경 도수가 안 맞는 사람처럼 눈 깜빡임 횟수 늘어나는 거 알아요? 거위 주려고 산 거 맞으면서...", null, null, null, null, null));
        scripts.add(createScript(s2_3_result2, 4, ScriptType.TEXT, "sera", "...이 씨... 너 진짜 눈치 없는 척하는 거야, 아니면 진짜 성격이 꼬인 거야?!", null, null, null, null, null));
        scripts.add(createScript(s2_3_result2, 5, ScriptType.TEXT, "hero", "(조금 용기를 내서) ...착한 것 같다고 말하려던 건데... 코드는 사나워도, 사람은... 다정한 것 같아서요.", null, null, null, null, null));
        scripts.add(createScript(s2_3_result2, 6, ScriptType.valueOf("시스템"), null, "🔍 [세라]가 당신의 뜬금없는 칭찬에 '에러'가 발생했습니다. (Log: Insight +10)", null, "{\"2\":\"sera_shy_facecover.png\"}", null, null, null));

        // --- Scene 2-3 Result 3: 선택 3 - 소심한 직구 ---
        scripts.add(createScript(s2_3_result3, 0, ScriptType.valueOf("전환"), null, "", null, "{\"all\":\"nobody\"}", null, null, null));
        scripts.add(createScript(s2_3_result3, 1, ScriptType.TEXT, "hero", "(가방끈을 꽉 쥔 채 고개를 돌리며) 다리에 쥐 났다면서요. 지금 놓으면 연못에 빠질 게 뻔한데... 혼자 제대로 설 수 있을 때까지 그냥 이러고 있을게요.", "kaist_pond.png", null, null, null, null));
        scripts.add(createScript(s2_3_result3, 2, ScriptType.TEXT, "sera", "(도훈의 뒤통수를 보며) ...너, 팔 안 아파?", null, "{\"2\":\"sera_칭찬부끄.png\"}", null, null, null));
        scripts.add(createScript(s2_3_result3, 3, ScriptType.TEXT, "hero", "아파요. 근데... 세라 님 연못에 빠지면 제가 건져야 하잖아요. 저 운동 부족이라... 세라 님 무게 감당 못 해서 같이 빠질지도 몰라요. 그러니까... 움직이지 마요.", null, null, null, null, null));
        scripts.add(createScript(s2_3_result3, 4, ScriptType.TEXT, "sera", "...누가 건져달래? ...그리고, 고마워.", null, "{\"2\":\"sera_shy_front.png\"}", null, null, null));
        scripts.add(createScript(s2_3_result3, 5, ScriptType.TEXT, "hero", "뭐라고요? 거위 소리 때문에 잘 안 들리는데... 한 번만 더 말해주면 안 돼요?", null, null, null, null, null));
        scripts.add(createScript(s2_3_result3, 6, ScriptType.TEXT, "sera", "안 해!! 바보야!!", null, "{\"2\":\"sera_shy_facecover.png\"}", null, null, null));
        scripts.add(createScript(s2_3_result3, 7, ScriptType.valueOf("시스템"), null, "💓 [세라]의 심박수가 임계치를 초과했습니다. (Log: Heartbeat > 120bpm)", null, null, null, null, null));

        // --- Scene 2-4: Deadlock - 발표 3시간 전 ---
        scripts.add(createScript(s2_4, 0, ScriptType.valueOf("전환"), null, "", null, "{\"all\":\"nobody\"}", null, null, null));
        scripts.add(createScript(s2_4, 1, ScriptType.THINK, "hero", "발표까지 3시간. 마무리는 거의 다 됐는데, 갑자기 지수가 찾아왔다.", "lab.png", null, "typing_noise", null, null));
        scripts.add(createScript(s2_4, 2, ScriptType.TEXT, "jisoo", "도훈 오빠... 저 좀 도와줘요 ㅠㅠ", null, "{\"1\":\"jisoo_begging.png\"}", null, null, null));
        scripts.add(createScript(s2_4, 3, ScriptType.TEXT, "jisoo", "자꾸 NullPointerException이 떠서 앱이 꺼져. 우리 조 팀원들은 다 멘붕이야...", null, null, null, null, null));
        scripts.add(createScript(s2_4, 4, ScriptType.TEXT, "jisoo", "오빠밖에 없어 제발...", null, null, null, null, null));
        scripts.add(createScript(s2_4, 5, ScriptType.TEXT, "sera", "(날카로운 눈빛으로) 야, 이도훈. 어디 가?", null, "{\"3\":\"sera_거만_crossedarm.png\"}", null, null, null));
        scripts.add(createScript(s2_4, 6, ScriptType.TEXT, "sera", "우리 거 PPT 마무리해야지. 지금 남 도와줄 시간 있어? 책임감 무엇?", null, null, null, null, null));
        
        Script s2_4_7 = createScript(s2_4, 7, ScriptType.THINK, "hero", "누구를 선택하지?", null, null, null, null, null);
        scripts.add(s2_4_7);
        // Options 추가
        Option opt_help_jisoo = createOption(s2_4_7, "opt_help_jisoo", "💻 지수를 도와준다", "chapter2_scene4_jisoo");
        options.add(opt_help_jisoo);
        Option opt_finish_sera = createOption(s2_4_7, "opt_finish_sera", "📝 세라와 마무리한다", "chapter2_scene4_sera");
        options.add(opt_finish_sera);

        // --- Scene 2-4 Jisoo: 지수를 도와준다 ---
        scripts.add(createScript(s2_4_jisoo, 0, ScriptType.valueOf("전환"), null, "", null, "{\"all\":\"nobody\"}", null, null, null));
        scripts.add(createScript(s2_4_jisoo, 1, ScriptType.TEXT, "hero", "미안, 금방 갔다 올게. 저거 해결 안 되면 지수네 조 발표 못 해.", "lab.png", null, null, null, null));
        scripts.add(createScript(s2_4_jisoo, 2, ScriptType.TEXT, "jisoo", "오빠 진짜 최고야! 생명의 은인!", null, "{\"1\":\"jisoo_smile.png\"}", null, null, null));
        scripts.add(createScript(s2_4_jisoo, 3, ScriptType.TEXT, "sera", "하... 진짜 짜증 나. 맘대로 해!", null, "{\"3\":\"sera_거만_crossedarm.png\"}", null, null, null));
        scripts.add(createScript(s2_4_jisoo, 4, ScriptType.valueOf("전환"), null, "", null, "{\"all\":\"nobody\"}", null, null, null));
        scripts.add(createScript(s2_4_jisoo, 5, ScriptType.NARRATION, null, "지수의 코드를 고쳐주고 돌아왔다.", "classroom.png", null, null, null, null));
        scripts.add(createScript(s2_4_jisoo, 6, ScriptType.TEXT, "sera", "다 했니? 자원봉사자 나셨네. 빨리 앉기나 해.", null, "{\"2\":\"sera_annoy_sitting.png\"}", null, null, null));
        scripts.add(createScript(s2_4_jisoo, 7, ScriptType.valueOf("시스템"), null, "💔 세라 호감도 하락 / 💚 지수 호감도 대폭 상승", null, null, null, null, null));

        // --- Scene 2-4 Sera: 세라와 마무리한다 (세라 True Route) ---
        scripts.add(createScript(s2_4_sera, 0, ScriptType.valueOf("전환"), null, "", null, "{\"all\":\"nobody\"}", null, null, null));
        scripts.add(createScript(s2_4_sera, 1, ScriptType.TEXT, "hero", "미안하다 지수야. 지금은 우리 조가 먼저야. 다른 잘 하는 분한테 여쭤봐.", "classroom.png", null, null, null, null));
        scripts.add(createScript(s2_4_sera, 2, ScriptType.TEXT, "jisoo", "...알았어. 나 갈게 오빠.", null, "{\"2\":\"jisoo_삐짐.png\"}", null, null, null));
        scripts.add(createScript(s2_4_sera, 3, ScriptType.THINK, null, "지수가 삐진 듯하다", null, null, null, null, null));
        scripts.add(createScript(s2_4_sera, 4, ScriptType.TEXT, "sera", "...흥, 당연한 선택이지. 어디 가기만 해 봐.", null, "{\"2\":\"sera_칭찬부끄.png\"}", null, null, null));
        scripts.add(createScript(s2_4_sera, 5, ScriptType.valueOf("전환"), null, "", null, "{\"all\":\"nobody\"}", null, null, null));
        scripts.add(createScript(s2_4_sera, 6, ScriptType.NARRATION, null, "(3시간 뒤, 발표 자료 완성)", "lab.png", null, null, null, null));
        scripts.add(createScript(s2_4_sera, 7, ScriptType.TEXT, "hero", "완벽하네요. 이번 프로젝트, 세라 님이 AI 초안 잘 잡아준 덕분에 퀄리티 높게 나왔습니다.", null, null, null, null, null));
        scripts.add(createScript(s2_4_sera, 8, ScriptType.TEXT, "hero", "고생 많았어요. 끝까지 잘해봅시다.", null, null, null, null, null));
        scripts.add(createScript(s2_4_sera, 9, ScriptType.TEXT, "sera", "...너도. 너도 꽤 고생했어.", null, "{\"2\":\"sera_shy_front.png\"}", null, null, null));
        scripts.add(createScript(s2_4_sera, 10, ScriptType.TEXT, "sera", "나 혼자였으면... 이렇게 못 했을 거야.", null, null, null, null, null));
        scripts.add(createScript(s2_4_sera, 11, ScriptType.TEXT, "sera", "고마워, 짝궁.", null, null, null, null, null));
        scripts.add(createScript(s2_4_sera, 12, ScriptType.valueOf("시스템"), null, "💖 [세라]와의 관계에 진전이 생겼습니다.", null, null, null, null, null));
        scripts.add(createScript(s2_4_sera, 13, ScriptType.valueOf("시스템"), null, "2주차 종료. 3주차로 이어집니다.", null, null, null, null, null));

        // Script 저장
        scriptRepository.saveAllAndFlush(scripts);
        
        // Option 저장
        if (!options.isEmpty()) {
            optionRepository.saveAllAndFlush(options);
        }
        
        sceneRepository.flush();

        System.out.println(">>> Chapter 2 데이터 로딩 완료");
    }

    // Option 생성 헬퍼 메서드
    private Option createOption(Script script, String optionId, String text, String nextSceneId) {
        Option option = new Option();
        option.setId(optionId);
        option.setScript(script);
        option.setText(text);
        option.setNextSceneId(nextSceneId);
        return option;
    }
