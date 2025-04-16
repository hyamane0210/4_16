"use server"

import type { RecommendationsData } from "@/components/recommendations"

// Default recommendations data - used when the searched artist is not in the database
export const defaultRecommendations: RecommendationsData = {
  artists: [
    {
      name: "ケンドリック・ラマー",
      reason:
        "深遠な歌詞と物語性のある表現力で知られ、黒人のアイデンティティ、社会問題、個人の成長などのテーマを探求しています。",
      features: ["ピューリッツァー賞受賞者", "批評家から高く評価されたアルバム", "'HUMBLE.'や'Alright'などのヒット曲"],
      imageUrl: "https://reissuerecords.net/wp-content/uploads/2023/10/kendrick_prof.jpg",
      officialUrl: "https://www.kendricklamar.com/",
    },
    {
      name: "BTS（防弾少年団）",
      reason:
        "シンクロしたパフォーマンス、社会的意識の高い歌詞、献身的な国際的ファンベースで知られるグローバルなK-POPグループです。",
      features: [
        "記録的なミュージックビデオ再生回数",
        "個性的なメンバーそれぞれの魅力",
        "'Dynamite'や'Butter'などのヒット曲",
      ],
      imageUrl: "https://ibighit.com/bts/images/bts/discography/proof/proof-cover.jpg",
      officialUrl: "https://ibighit.com/bts/",
    },
    {
      name: "テイラー・スウィフト",
      reason:
        "物語性のある作詞と音楽ジャンルの進化で知られ、カントリーからポップ、インディーフォークまで幅広く活躍しています。",
      features: [
        "自伝的な歌詞",
        "カントリーからポップ、インディーフォークへの進化",
        "'Love Story'や'All Too Well'などのヒット曲",
      ],
      imageUrl: "https://www.taylorswift.com/wp-content/uploads/2023/10/taylor_swift_eras_tour.jpg",
      officialUrl: "https://www.taylorswift.com/",
    },
    {
      name: "ザ・ウィークエンド",
      reason: "独特のボーカルスタイルと暗く雰囲気のあるR&Bサウンドで知られ、快楽主義と憂鬱さのテーマを探求しています。",
      features: [
        "特徴的なファルセットボーカル",
        "ダークなR&Bとシンセポップの融合",
        "'Blinding Lights'や'Starboy'などのヒット曲",
      ],
      imageUrl: "https://www.theweeknd.com/wp-content/uploads/2023/10/weeknd_prof.jpg",
      officialUrl: "https://www.theweeknd.com/",
    },
    {
      name: "ビリー・アイリッシュ",
      reason: "囁くようなボーカルとダークでジャンルを超えた音楽で知られ、特に若い世代に共感を呼んでいます。",
      features: [
        "囁くようなボーカルスタイル",
        "兄FINNEASとのコラボレーション",
        "'bad guy'や'everything i wanted'などのヒット曲",
      ],
      imageUrl: "https://www.billieeilish.com/wp-content/uploads/2023/10/billie_eilish_prof.jpg",
      officialUrl: "https://www.billieeilish.com/",
    },
  ],
  celebrities: [
    {
      name: "ゼンデイヤ",
      reason: "多様な演技力、ファッションへの影響力、ハリウッドでの代表性の提唱で知られるエミー賞受賞女優です。",
      features: ["エミー賞受賞女優", "'ユーフォリア'や'デューン'の主演", "ファッションアイコンとしての影響力"],
      imageUrl: "https://www.instagram.com/zendaya/profile.jpg",
      officialUrl: "https://www.instagram.com/zendaya/",
    },
    {
      name: "トム・ホランド",
      reason:
        "マーベル・シネマティック・ユニバースでのスパイダーマン役と、魅力的でエネルギッシュな人柄で知られています。",
      features: ["MCUでのスパイダーマン役", "ダンスと演劇のバックグラウンド", "熱心なインタビューで知られる"],
      imageUrl: "https://www.instagram.com/tomholland2013/profile.jpg",
      officialUrl: "https://www.instagram.com/tomholland2013/",
    },
    {
      name: "ティモシー・シャラメ",
      reason: "成長物語や時代劇での強烈な演技で知られる新進気鋭の俳優で、独特のスタイルを持っています。",
      features: ["'君の名前で僕を呼んで'でのブレイク", "強烈で繊細な演技", "ファッション性の高いレッドカーペット出演"],
      imageUrl: "https://www.instagram.com/tchalamet/profile.jpg",
      officialUrl: "https://www.instagram.com/tchalamet/",
    },
    {
      name: "フローレンス・ピュー",
      reason: "時代劇と現代映画の両方で力強い演技を見せるイギリス人女優です。",
      features: [
        "'ミッドサマー'と'ストーリー・オブ・マイライフ/わたしの若草物語'でのブレイク",
        "表現力豊かな演技",
        "ハリウッドでの新星",
      ],
      imageUrl: "https://www.instagram.com/florencepugh/profile.jpg",
      officialUrl: "https://www.instagram.com/florencepugh/",
    },
    {
      name: "ドウェイン・ジョンソン",
      reason: "元レスラーからハリウッドで最も稼ぐ俳優となり、カリスマ性とアクション映画で知られています。",
      features: [
        "元WWEレスラー'ザ・ロック'",
        "'ワイルド・スピード'シリーズの主演",
        "トレーニング方法とポジティブな姿勢で知られる",
      ],
      imageUrl: "https://www.instagram.com/therock/profile.jpg",
      officialUrl: "https://www.instagram.com/therock/",
    },
  ],
  media: [
    {
      name: "鬼滅の刃",
      reason: "素晴らしいアニメーションと魅力的なストーリーで、少年が妹を救うために鬼と戦う物語です。",
      features: [
        "ufotableによる息をのむようなアニメーション",
        "スリリングなアクションシーン",
        "ヒットテーマソング'紅蓮華'と'炎'",
      ],
      imageUrl: "https://kimetsu.com/anime/assets/img/top/img_main_sp.jpg",
      officialUrl: "https://kimetsu.com/",
    },
    {
      name: "呪術廻戦",
      reason: "高校生が秘密の呪術師組織に加わり、呪いの精霊と戦うダークファンタジーアニメです。",
      features: ["独自の呪いと術式のシステム", "魅力的なキャラクターと関係性", "激しい戦闘シーン"],
      imageUrl: "https://jujutsukaisen.jp/images/ogp.jpg",
      officialUrl: "https://jujutsukaisen.jp/",
    },
    {
      name: "進撃の巨人",
      reason: "人類が人食い巨人から生き残りをかけて戦う壮大なダークファンタジーアニメで、衝撃的な展開が特徴です。",
      features: [
        "大きな展開のある壮大なストーリーライン",
        "複雑なテーマと社会的コメンタリー",
        "激しいアクションシーン",
      ],
      imageUrl: "https://shingeki.tv/final/img/home/visual_latest.jpg",
      officialUrl: "https://shingeki.tv/",
    },
    {
      name: "千と千尋の神隠し",
      reason: "両親を救うために精霊の世界を冒険する少女の物語で、スタジオジブリによるアカデミー賞受賞アニメ映画です。",
      features: ["宮崎駿監督作品", "美しい手描きアニメーション", "豊かな世界観とキャラクター構築"],
      imageUrl: "https://www.ghibli.jp/images/spirited.jpg",
      officialUrl: "https://www.ghibli.jp/works/spirited/",
    },
    {
      name: "ストレンジャー・シングス",
      reason: "1980年代を舞台にした小さな町での超常現象を描いたノスタルジックなSFホラーシリーズです。",
      features: [
        "1980年代のノスタルジーと参照",
        "SF、ホラー、成長物語の融合",
        "魅力的なキャラクターのアンサンブルキャスト",
      ],
      imageUrl: "https://www.netflix.com/tudum/stranger-things/main.jpg",
      officialUrl: "https://www.netflix.com/title/80057281",
    },
  ],
  fashion: [
    {
      name: "ナイキ",
      reason:
        "革新的なアスレチックフットウェアとアパレルで知られる象徴的なスポーツウェアブランドで、認識しやすいスウッシュロゴが特徴です。",
      features: [
        "革新的なアスレチックテクノロジー",
        "象徴的なスウッシュロゴ",
        "アスリートやデザイナーとのコラボレーション",
      ],
      imageUrl: "https://www.nike.com/assets/experience/homepage/static/main.jpg",
      officialUrl: "https://www.nike.com/",
    },
    {
      name: "ザラ",
      reason:
        "ランウェイトレンドを素早く手頃な価格のスタイリッシュな衣服に翻訳することで知られるファストファッションリテーラーです。",
      features: ["素早いトレンド採用", "手頃な価格のハイファッションインスパイアデザイン", "頻繁な新コレクション発売"],
      imageUrl: "https://static.zara.net/photos///contents/mkt/spots/main/home.jpg",
      officialUrl: "https://www.zara.com/",
    },
    {
      name: "グッチ",
      reason:
        "伝統的な職人技とイノベーションを融合させた折衷的で現代的なデザインで知られる高級イタリアンファッションハウスです。",
      features: ["象徴的なGGロゴとパターン", "折衷的で最大限の美学", "伝統的な職人技と現代的なデザインの融合"],
      imageUrl: "https://www.gucci.com/images/content/homepage/main.jpg",
      officialUrl: "https://www.gucci.com/",
    },
    {
      name: "ユニクロ",
      reason:
        "ミニマルなデザイン、高品質なベーシックアイテム、手頃な価格の革新的な素材で知られる日本のカジュアルウェアブランドです。",
      features: ["ミニマルで機能的なデザイン", "高品質なベーシックアイテム", "HEATTECHなどの革新的な素材技術"],
      imageUrl: "https://www.uniqlo.com/jp/ja/contents/feature/masterpiece/common/img/ogp.jpg",
      officialUrl: "https://www.uniqlo.com/",
    },
    {
      name: "オフホワイト",
      reason:
        "ヴァージル・アブローが創設した高級ストリートウェアブランドで、特徴的な斜めのストライプ、引用符、インダストリアルなスタイリングで知られています。",
      features: [
        "ヴァージル・アブローによる創設",
        "特徴的な斜めのストライプと引用符",
        "ストリートウェアと高級ファッションの融合",
      ],
      imageUrl: "https://www.off---white.com/images/content/homepage/main.jpg",
      officialUrl: "https://www.off---white.com/",
    },
  ],
}

// Add more items to the defaultRecommendations.artists array
defaultRecommendations.artists = [
  ...defaultRecommendations.artists,
  {
    name: "アデル",
    reason: "力強いボーカルと感情的な歌詞で知られる世界的に成功したイギリスのシンガーソングライターです。",
    features: ["グラミー賞受賞者", "「Hello」「Someone Like You」などのヒット曲", "感情的なバラード"],
    imageUrl: "https://www.adele.com/wp-content/uploads/2023/10/adele_prof.jpg",
    officialUrl: "https://www.adele.com/",
  },
  {
    name: "エド・シーラン",
    reason:
      "親しみやすいポップとフォークを融合させた楽曲と、ループペダルを使ったライブパフォーマンスで知られています。",
    features: ["シンガーソングライター", "「Shape of You」「Perfect」などのヒット曲", "ソロパフォーマンス"],
    imageUrl: "https://www.edsheeran.com/wp-content/uploads/2023/10/ed_sheeran_prof.jpg",
    officialUrl: "https://www.edsheeran.com/",
  },
  // 以下を追加
  {
    name: "YOASOBI",
    reason: "小説を原作とした楽曲で知られる日本の音楽ユニットで、キャッチーなメロディと物語性のある歌詞が特徴です。",
    features: [
      "「夜に駆ける」「アイドル」などのヒット曲",
      "小説を音楽化",
      "Ayase（作曲）とikura（ボーカル）のユニット",
    ],
    imageUrl: "https://www.yoasobi-music.jp/wp-content/uploads/2023/10/yoasobi_prof.jpg",
    officialUrl: "https://www.yoasobi-music.jp/",
  },
  {
    name: "Aimer",
    reason: "透明感のある歌声と力強い表現力で知られる日本の女性シンガーで、アニメ主題歌も多数担当しています。",
    features: ["「残響散歌」「カタオモイ」などのヒット曲", "アニメタイアップ多数", "独特の声質と表現力"],
    imageUrl: "https://www.aimer-web.jp/wp-content/uploads/2023/10/aimer_prof.jpg",
    officialUrl: "https://www.aimer-web.jp/",
  },
  {
    name: "NewJeans",
    reason: "Y2Kスタイルとノスタルジックなサウンドで注目を集める韓国の5人組ガールグループです。",
    features: ["「Attention」「Ditto」「OMG」などのヒット曲", "レトロでノスタルジックなスタイル", "独自の世界観"],
    imageUrl: "https://newjeans.kr/wp-content/uploads/2023/10/newjeans_prof.jpg",
    officialUrl: "https://newjeans.kr/",
  },
]

// Add more items to the defaultRecommendations.celebrities array
defaultRecommendations.celebrities = [
  ...defaultRecommendations.celebrities,
  {
    name: "エマ・ワトソン",
    reason: "「ハリー・ポッター」シリーズのハーマイオニー役で知られ、女性の権利と教育の提唱者としても活動しています。",
    features: ["「ハリー・ポッター」シリーズの主演", "国連女性親善大使", "HeForSheキャンペーン"],
    imageUrl: "https://www.instagram.com/emmawatson/profile.jpg",
    officialUrl: "https://www.instagram.com/emmawatson/",
  },
  {
    name: "キアヌ・リーブス",
    reason: "「マトリックス」「ジョン・ウィック」シリーズの主演で知られ、謙虚な人柄と慈善活動でも評価されています。",
    features: ["アクション映画のアイコン", "「マトリックス」「ジョン・ウィック」シリーズの主演", "慈善活動家"],
    imageUrl: "https://www.imdb.com/name/nm0000206/profile.jpg",
    officialUrl: "https://www.imdb.com/name/nm0000206/",
  },
  // 以下を追加
  {
    name: "北村匠海",
    reason: "俳優、ミュージシャンとして活躍する日本の若手タレントで、DISH//のボーカルとしても知られています。",
    features: ["DISH//のボーカル", "「君の膵臓をたべたい」などの映画に出演", "多才なエンターテイナー"],
    imageUrl: "https://www.stardust.co.jp/profile/kitamuratakumi/img/main.jpg",
    officialUrl: "https://www.stardust.co.jp/profile/kitamuratakumi/",
  },
  {
    name: "小松菜奈",
    reason: "モデル、女優として活躍する日本の若手タレントで、独特の雰囲気と演技力で注目されています。",
    features: ["「菅田将暉」との共演作品多数", "ファッションアイコン", "「糸」「さくら」などの映画に出演"],
    imageUrl: "https://www.stardust.co.jp/profile/komatsunana/img/main.jpg",
    officialUrl: "https://www.stardust.co.jp/profile/komatsunana/",
  },
  {
    name: "浜辺美波",
    reason: "若手実力派女優として知られ、「君の膵臓をたべたい」「賭ケグルイ」などの作品で主演を務めています。",
    features: ["「君の膵臓をたべたい」「賭ケグルイ」などの主演", "若手実力派女優", "透明感のある演技"],
    imageUrl: "https://www.toho-ent.co.jp/talents/hamabe/img/main.jpg",
    officialUrl: "https://www.toho-ent.co.jp/talents/hamabe/",
  },
]

// Add more items to the defaultRecommendations.media array
defaultRecommendations.media = [
  ...defaultRecommendations.media,
  {
    name: "ハリー・ポッター",
    reason: "魔法の世界を舞台にした少年の成長と冒険を描いた人気ファンタジーシリーズです。",
    features: ["J.K.ローリング原作", "魔法学校ホグワーツを舞台にした物語", "世界的な文化現象"],
    imageUrl: "https://www.wizardingworld.com/images/harry-potter-series.jpg",
    officialUrl: "https://www.wizardingworld.com/",
  },
  {
    name: "ワンピース",
    reason:
      "海賊王を目指す少年とその仲間たちの冒険を描いた、世界で最も人気のある長寿マンガ・アニメシリーズの一つです。",
    features: ["尾田栄一郎原作", "壮大な世界観と個性的なキャラクター", "友情、冒険、夢をテーマにした物語"],
    imageUrl: "https://www.onepiece.com/images/main-visual.jpg",
    officialUrl: "https://www.onepiece.com/",
  },
  // 以下を追加
  {
    name: "SPY×FAMILY",
    reason: "スパイ、殺し屋、超能力者が偽装家族として暮らすコメディアクション作品で、家族の絆をテーマにしています。",
    features: ["遠藤達哉原作", "コメディとアクションの絶妙なバランス", "個性的な家族の物語"],
    imageUrl: "https://spy-family.net/assets/img/home/main_img.jpg",
    officialUrl: "https://spy-family.net/",
  },
  {
    name: "推しの子",
    reason: "アイドルとその熱狂的ファンの関係を描いた作品で、転生や芸能界の裏側をテーマにしています。",
    features: ["赤坂アカと横槍メンゴ原作", "アイドル業界と転生をテーマにした物語", "複雑なストーリー展開"],
    imageUrl: "https://ichigoproduction.com/assets/img/top/main.jpg",
    officialUrl: "https://ichigoproduction.com/",
  },
  {
    name: "チェンソーマン",
    reason: "悪魔と人間が共存する世界を舞台にしたダークファンタジー作品で、独特の世界観と衝撃的な展開が特徴です。",
    features: ["藤本タツキ原作", "ダークでグロテスクな描写", "予測不能なストーリー展開"],
    imageUrl: "https://chainsawman.dog/assets/img/top/main.jpg",
    officialUrl: "https://chainsawman.dog/",
  },
]

// Add more items to the defaultRecommendations.fashion array
defaultRecommendations.fashion = [
  ...defaultRecommendations.fashion,
  {
    name: "アディダス",
    reason: "スポーツウェアとスニーカーで知られるドイツの多国籍企業で、特徴的な3本線のロゴが象徴的です。",
    features: ["スポーツパフォーマンス製品", "特徴的な3本線のロゴ", "アスリートやセレブリティとのコラボレーション"],
    imageUrl: "https://www.adidas.com/images/brand-main.jpg",
    officialUrl: "https://www.adidas.com/",
  },
  {
    name: "H&M",
    reason: "手頃な価格のファストファッションを提供するスウェーデンの多国籍小売企業です。",
    features: [
      "トレンドを取り入れた手頃な価格のファッション",
      "サステナブルなコレクション",
      "デザイナーとのコラボレーション",
    ],
    imageUrl: "https://www2.hm.com/images/main-visual.jpg",
    officialUrl: "https://www2.hm.com/",
  },
  // 以下を追加
  {
    name: "ムジ（無印良品）",
    reason: "シンプルで機能的なデザインの製品を提供する日本のライフスタイルブランドです。",
    features: ["シンプルで機能的なデザイン", "環境に配慮した製品", "衣料品から家具、食品まで幅広い商品展開"],
    imageUrl: "https://www.muji.com/jp/ja/img/common/ogp.png",
    officialUrl: "https://www.muji.com/",
  },
  {
    name: "ノースフェイス",
    reason: "アウトドア用の高品質なアパレルとギアで知られるアメリカのブランドです。",
    features: ["高品質なアウトドアアパレル", "耐久性と機能性を重視", "象徴的なハーフドームロゴ"],
    imageUrl: "https://www.thenorthface.com/content/dam/tnf/global/en_us/homepage/TNF_HP.jpg",
    officialUrl: "https://www.thenorthface.com/",
  },
  {
    name: "シュプリーム",
    reason: "ストリートファッションとスケートカルチャーをベースにした人気ブランドで、限定リリースで知られています。",
    features: ["限定リリースと希少性", "ストリートカルチャーの影響", "他ブランドとのコラボレーション"],
    imageUrl: "https://www.supremenewyork.com/images/og.jpg",
    officialUrl: "https://www.supremenewyork.com/",
  },
]

// モックデータベース - 実際のアプリケーションではAPIや本物のデータベースを使用します
export const recommendationsDatabase: Record<string, RecommendationsData> = {
  米津玄師: {
    artists: [
      {
        name: "キング・ヌー",
        reason:
          "米津玄師と同様に独自の音楽性と詩的な歌詞が特徴で、ロックとポップの要素を融合させた楽曲を作り出しています。",
        features: [
          "バンド形式でありながら多様な音楽ジャンルを取り入れている",
          "映画やドラマとのタイアップ曲も多数",
          "常田大希を中心とした高い演奏技術と独創的な楽曲",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://kinggnu.jp/",
      },
      {
        name: "菅田将暉",
        reason:
          "俳優としての活動が主ですが、米津玄師とのコラボレーション「灰色と青」が話題になり、同様に繊細な感性を持った楽曲を発表しています。",
        features: [
          "俳優としての表現力を音楽にも活かしている",
          "米津玄師とのコラボ曲「灰色と青」が有名",
          "等身大の感情を歌詞に込めた楽曲が多い",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://sudamasaki-official.com/",
      },
      {
        name: "ヨルシカ",
        reason: "n-bunaを中心としたプロジェクトで、米津玄師と同様に物語性のある歌詞と独特のメロディラインが特徴です。",
        features: [
          "物語性のある詩的な歌詞",
          "suis(スイ)の透明感のある歌声",
          "エレクトロニックな要素を取り入れた楽曲制作",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://yorushika.com/",
      },
      {
        name: "RADWIMPS",
        reason: "映画「君の名は。」のサウンドトラックで知られ、米津玄師と同様に深い歌詞と多様な音楽性を持っています。",
        features: [
          "野田洋次郎の特徴的な歌声と詩的な歌詞",
          "映画「君の名は。」「天気の子」の音楽を担当",
          "ロックからバラードまで幅広いジャンルの楽曲",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://radwimps.jp/",
      },
      {
        name: "あいみょん",
        reason: "独自の世界観と歌詞センスで、米津玄師のファンにも共感を呼ぶ楽曲を多数発表しています。",
        features: ["等身大の感情を描いた歌詞", "独特の声質と表現力", "ロックテイストを取り入れたポップミュージック"],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.aimyong.net/",
      },
    ],
    celebrities: [
      {
        name: "菅田将暉",
        reason: "俳優としても音楽家としても活躍し、米津玄師とのコラボレーションもあり、芸術的感性が共通しています。",
        features: [
          "多才な表現者として映画、ドラマ、音楽で活躍",
          "独特の雰囲気と個性的なファッションセンス",
          "米津玄師と「灰色と青」でコラボレーション",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://sudamasaki-official.com/",
      },
      {
        name: "星野源",
        reason: "俳優、音楽家、文筆家と多方面で活躍し、米津玄師と同様に多才なアーティストとして知られています。",
        features: [
          "音楽、俳優、文筆など多方面で活躍",
          "独自の世界観と親しみやすい人柄",
          "「恋」や「アイデア」などのヒット曲で知られる",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.hoshinogen.com/",
      },
      {
        name: "野田洋次郎",
        reason: "RADWIMPSのボーカルとして、また俳優としても活動し、米津玄師と同様に深い表現力を持っています。",
        features: [
          "RADWIMPSのボーカル兼作詞作曲者",
          "俳優としても活動（「トドメの接吻」など）",
          "詩的な歌詞と表現力が特徴",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://radwimps.jp/",
      },
      {
        name: "常田大希",
        reason:
          "キング・ヌーのフロントマンで、クラシックからロックまで幅広い音楽性を持ち、米津玄師と同様に革新的な音楽を生み出しています。",
        features: [
          "キング・ヌーのフロントマン兼作曲者",
          "クラシック音楽のバックグラウンドを持つ",
          "ファッションアイコンとしても注目されている",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://kinggnu.jp/",
      },
      {
        name: "石原さとみ",
        reason: "米津玄師のMV「Lemon」に出演したことでも知られ、繊細な演技力で多くのファンを魅了しています。",
        features: ["多様な役柄をこなす演技力", "米津玄師の「Lemon」MVに関連", "親しみやすい人柄と知的なイメージ"],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.horipro.co.jp/satomiishihara/",
      },
    ],
    media: [
      {
        name: "君の名は。",
        reason:
          "RADWIMPSが音楽を担当した新海誠監督の作品で、米津玄師ファンにも響く繊細な感情表現と美しい映像美が特徴です。",
        features: [
          "新海誠監督による美しい映像美",
          "RADWIMPSによる印象的なサウンドトラック",
          "青春と切なさを描いたストーリー",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.kiminona.com/",
      },
      {
        name: "天気の子",
        reason:
          "「君の名は。」と同じく新海誠監督作品で、音楽と映像の調和が米津玄師の作品世界観に通じるものがあります。",
        features: [
          "天候と人間の関係を描いた物語",
          "RADWIMPSと三浦透子によるサウンドトラック",
          "鮮やかな色彩と雨の描写が印象的",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.tenkinoko.com/",
      },
      {
        name: "SING／シング",
        reason:
          "音楽をテーマにしたアニメーション映画で、多様な音楽ジャンルが登場し、音楽好きな米津玄師ファンにもおすすめです。",
        features: [
          "音楽をテーマにしたアニメーション",
          "多様なキャラクターと音楽ジャンル",
          "夢を追いかける姿勢がテーマ",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://sing-movie.jp/",
      },
      {
        name: "四月���君の嘘",
        reason:
          "クラシック音楽をテーマにしたアニメで、音楽と感情の結びつきを繊細に描いており、米津玄師の音楽性に通じるものがあります。",
        features: ["クラシック音楽をテーマにしたアニメ", "繊細な感情描写と美しい作画", "音楽を通じた成長と癒しの物語"],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.kimiuso.jp/",
      },
      {
        name: "ピンポン",
        reason:
          "松本大洋の漫画を原作とした作品で、個性的なキャラクターと独特の世界観が米津玄師の作品世界に通じるものがあります。",
        features: [
          "松本大洋の独特の絵柄を活かしたアニメーション",
          "個性的なキャラクターと心理描写",
          "卓球を通じた青春と成長の物語",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.fujitv.co.jp/b_hp/pingpong/",
      },
    ],
    fashion: [
      {
        name: "ユニクロ",
        reason:
          "シンプルでありながら質の高いベーシックアイテムを提供し、米津玄師のようなミニマルでありながら個性的なスタイルに合います。",
        features: [
          "シンプルで機能的なデザイン",
          "アーティストとのコラボレーションも多数",
          "幅広い年齢層に支持されるベーシックアイテム",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.uniqlo.com/",
      },
      {
        name: "ジーユー",
        reason: "トレンドを取り入れながらもリーズナブルな価格帯で、実験的なスタイルを試しやすいブランドです。",
        features: ["トレンドを取り入れたアイテム", "リーズナブルな価格設定", "若者を中心に人気のファストファッション"],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.gu-japan.com/",
      },
      {
        name: "ビームス",
        reason:
          "日本のストリートカルチャーとモード系ファッションを融合させた独自のセレクトで、米津玄師のような個性的なスタイルに影響を与えています。",
        features: [
          "日本のストリートファッションを代表するセレクトショップ",
          "独自の視点でセレクトされた国内外のブランド",
          "オリジナルラインも人気",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.beams.co.jp/",
      },
      {
        name: "アーバンリサーチ",
        reason:
          "都会的でありながらも自然体なスタイルを提案し、米津玄師のようなナチュラルでありながら洗練されたファッションに合います。",
        features: [
          "「LIFE IS A JOURNEY」をコンセプトにした都会的なスタイル",
          "ナチュラルでありながら洗練されたデザイン",
          "幅広いラインナップと独自のセレクト",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.urban-research.jp/",
      },
      {
        name: "ステュディオス",
        reason:
          "日本のデザイナーズブランドを中心に取り扱うセレクトショップで、米津玄師のような独自の世界観を持つファッションに影響を与えています。",
        features: [
          "「MADE IN JAPAN」にこだわったセレクト",
          "日本のデザイナーズブランドを中心に展開",
          "モード系からストリート系まで幅広いスタイル",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://studious.co.jp/",
      },
    ],
  },
  "BTS（防弾少年団）": {
    artists: [
      {
        name: "SEVENTEEN",
        reason: "BTSと同じく大人数のK-POPグループで、パフォーマンス力の高さとメンバー同士の絆が特徴です。",
        features: ["13人の大所帯グループ", "自主制作に関わるセルフプロデュース能力", "洗練されたパフォーマンスと振付"],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.seventeen-17.com/",
      },
      {
        name: "TWICE",
        reason:
          "K-POPを代表する女性グループで、BTSと同様に国際的な人気を誇り、キャッチーな楽曲とパフォーマンスが魅力です。",
        features: [
          "「TT」「Fancy」などのヒット曲",
          "個性的な9人のメンバー構成",
          "親しみやすいコンセプトと華やかなパフォーマンス",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.twicejapan.com/",
      },
      {
        name: "ENHYPEN",
        reason: "BTSと同じHYBE傘下のグループで、グローバルなファン層を持ち、洗練されたパフォーマンスが特徴です。",
        features: [
          "オーディション番組「I-LAND」から誕生",
          "BTSと同じHYBE傘下のグループ",
          "国際的なメンバー構成と多言語対応",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://enhypen.jp/",
      },
      {
        name: "Stray Kids",
        reason:
          "自作曲を多く手がけるK-POPグループで、BTSと同様に社会的メッセージを含む楽曲も多く、強いパフォーマンス力が魅力です。",
        features: [
          "メンバーが作詞作曲に積極的に参加",
          "強烈なパフォーマンスと実験的な楽曲",
          "国際的なファンダムを持つ",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://straykidsjapan.com/",
      },
      {
        name: "BLACKPINK",
        reason:
          "世界的に人気のK-POP女性グループで、BTSと同様に国際的な活動とファッションアイコンとしての側面も持っています。",
        features: [
          "強烈なビジュアルと個性的なメンバー",
          "ヒップホップとEDMを融合させた楽曲",
          "ファッションアイコンとしても活躍",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.blackpinkmusic.com/",
      },
    ],
    celebrities: [
      {
        name: "IU",
        reason:
          "韓国を代表するソロアーティストで、BTSのメンバーも尊敬を表明しており、多才な活動で幅広いファン層を持っています。",
        features: ["歌手、女優として多方面で活躍", "「Good Day」「eight」などのヒット曲", "社会貢献活動にも積極的"],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.edam-ent.com/",
      },
      {
        name: "キム・テヒョン",
        reason:
          "韓国を代表する俳優で、BTSファンが韓国ドラマに興味を持つきっかけになることも多く、国際的な人気を誇ります。",
        features: [
          "「愛の不時着」「サイコだけど大丈夫」などのヒットドラマに出演",
          "端正な容姿と演技力で人気",
          "国際的な知名度の高さ",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.vast-ent.com/",
      },
      {
        name: "パク・ソジュン",
        reason: "韓国の人気俳優で、BTSのV(テテ)との親交も知られており、親しみやすい魅力と演技力で人気です。",
        features: [
          "「梨泰院クラス」「彼女はキレイだった」などのヒットドラマに出演",
          "BTSのVと親交がある",
          "多様な役柄をこなす演技力",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.awesome-ent.com/",
      },
      {
        name: "リサ",
        reason:
          "BLACKPINKのメンバーで、BTSファンにも人気があり、ダンススキルとファッションセンスで国際的に注目されています。",
        features: ["BLACKPINKのメインダンサー", "タイ出身の国際的なアイドル", "ソロ曲「LALISA」「MONEY」でも成功"],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.blackpinkmusic.com/",
      },
      {
        name: "ジェニー",
        reason:
          "BLACKPINKのメンバーで、BTSファンにも人気があり、ソロ活動やファッションブランドとのコラボレーションでも注目されています。",
        features: ["BLACKPINKのメンバー", "ソロ曲「SOLO」でも成功", "シャネルのアンバサダーとしても活躍"],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.blackpinkmusic.com/",
      },
    ],
    media: [
      {
        name: "梨泰院クラス",
        reason:
          "社会的なテーマを扱った人気韓国ドラマで、BTSの楽曲のように若者の挑戦と成長を描いており、共感を呼びます。",
        features: ["復讐と成功をテーマにしたストーリー", "パク・ソジュン主演の人気ドラマ", "社会問題にも触れる内容"],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.netflix.com/title/81193309",
      },
      {
        name: "愛の不時着",
        reason: "国境を越えた愛を描いた韓国ドラマで、BTSのように国際的な人気を博し、韓国文化への関心を高めました。",
        features: [
          "北朝鮮と韓国を舞台にした国境を越えたラブストーリー",
          "ヒョンビンとソン・イェジン主演",
          "国際的な人気を博した韓流ドラマ",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.netflix.com/title/81159258",
      },
      {
        name: "青春時代",
        reason: "大学生活と友情を描いた青春ドラマで、BTSの楽曲のように若者の悩みや成長を共感性高く描いています。",
        features: [
          "女子大生の友情と恋愛を描いた青春ドラマ",
          "ハン・イェリ、ハン・スンヨン、パク・ウンビン主演",
          "リアルな大学生活と人間関係",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.netflix.com/title/80167281",
      },
      {
        name: "キングダム",
        reason: "韓国発のゾンビ時代劇で、BTSのように韓国文化を国際的に広めた作品として注目されています。",
        features: [
          "朝鮮時代を舞台にしたゾンビスリラー",
          "韓国初のNetflixオリジナルシリーズ",
          "歴史と伝統を現代的に解釈",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.netflix.com/title/80180171",
      },
      {
        name: "D.P.",
        reason: "韓国の兵役制度を題材にしたドラマで、BTSのように社会的なテーマを扱い、若者の現実と葛藤を描いています。",
        features: [
          "韓国軍の脱走兵追跡部隊を描いたドラマ",
          "チョン・ヘイン、クー・ギョファン主演",
          "兵役制度の問題点と若者の苦悩を描く",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.netflix.com/title/81280917",
      },
    ],
    fashion: [
      {
        name: "フィラ",
        reason:
          "BTSがブランドアンバサダーを務めたスポーツブランドで、カジュアルでありながらスタイリッシュなアイテムが特徴です。",
        features: [
          "BTSがグローバルアンバサダーを務めた",
          "スポーツとストリートの融合したスタイル",
          "カジュアルでありながらスタイリッシュなデザイン",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.fila.com/",
      },
      {
        name: "ルイ・ヴィトン",
        reason: "BTSがハウスアンバサダーを務める高級ブランドで、伝統とモダンを融合させたスタイルが特徴です。",
        features: [
          "BTSがハウスアンバサダーを務める",
          "伝統的なモノグラムと現代的なデザインの融合",
          "高級感と洗練されたスタイル",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.louisvuitton.com/",
      },
      {
        name: "グッチ",
        reason: "BTSのメンバーも着用することがあるブランドで、大胆でエクレクティックなデザインが特徴です。",
        features: [
          "エクレクティックで大胆なデザイン",
          "伝統とトレンドを融合させたスタイル",
          "K-POPアイドルにも人気のブランド",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.gucci.com/",
      },
      {
        name: "ディオール",
        reason: "BTSのジミンがアンバサダーを務めるブランドで、エレガントでありながらモダンなデザインが特徴です。",
        features: [
          "BTSのジミンがアンバサダーを務める",
          "エレガントでモダンなデザイン",
          "クラシックとコンテンポラリーの融合",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.dior.com/",
      },
      {
        name: "プーマ",
        reason: "BTSが以前コラボレーションしたスポーツブランドで、カジュアルでストリート感のあるスタイルが特徴です。",
        features: [
          "BTSが以前コラボレーションした",
          "スポーツとストリートファッションの融合",
          "若者向けのカジュアルなデザイン",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://jp.puma.com/",
      },
    ],
  },
  テイラー・スウィフト: {
    artists: [
      {
        name: "オリヴィア・ロドリゴ",
        reason:
          "テイラー・スウィフトから影響を受けたと公言しており、同様に自身の経験を率直に歌詞にする楽曲スタイルが特徴です。",
        features: [
          "10代の感情を率直に表現した歌詞",
          "ポップとロックを融合させた楽曲",
          "'drivers license'や'good 4 u'などのヒット曲",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.oliviarodrigo.com/",
      },
      {
        name: "ロード",
        reason:
          "若くして成功し、繊細な歌詞と独自の音楽性で、テイラー・スウィフトとも親交があり、同様に成長する音楽性が魅力です。",
        features: ["若くしてグラミー賞を受賞", "詩的で内省的な歌詞", "実験的なサウンドと独自の世界観"],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.lorde.co.nz/",
      },
      {
        name: "ビリー・アイリッシュ",
        reason:
          "若い世代の声を代表するアーティストとして、テイラー・スウィフトと同様に自分のスタイルを貫き、多くの若者から支持されています。",
        features: ["独特の囁くようなボーカルスタイル", "兄FINNEASとの共同制作", "若い世代の感情を代弁する歌詞"],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.billieeilish.com/",
      },
      {
        name: "アリアナ・グランデ",
        reason:
          "ポップミュージックの女王として、テイラー・スウィフトと同様に自身の経験を歌に取り入れ、強いボーカル力で知られています。",
        features: ["広い音域と強力なボーカル", "R&Bとポップを融合させたスタイル", "個人的な経験を歌詞に反映"],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.arianagrande.com/",
      },
      {
        name: "ラナ・デル・レイ",
        reason:
          "メランコリックで映画的な音楽性を持ち、テイラー・スウィフトとも親交があり、同様に詩的な歌詞が特徴です。",
        features: [
          "ノスタルジックでシネマティックな音楽性",
          "アメリカンドリームをテーマにした歌詞",
          "独特の低音ボーカルと雰囲気",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.lanadelrey.com/",
      },
    ],
    celebrities: [
      {
        name: "ブレイク・ライブリー",
        reason:
          "テイラー・スウィフトの親友で、彼女の楽曲にも影響を与えており、スタイリッシュでありながら親しみやすい魅力があります。",
        features: [
          "テイラー・スウィフトの親友",
          "「ゴシップガール」などの作品で知られる女優",
          "ファッションアイコンとしても人気",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.instagram.com/blakelively/",
      },
      {
        name: "セレーナ・ゴメス",
        reason:
          "テイラー・スウィフトの長年の友人で、音楽とエンターテインメント業界での成功、そして社会活動への取り組みが共通しています。",
        features: [
          "テイラー・スウィフトの長年の友人",
          "歌手、女優、プロデューサーとして活躍",
          "メンタルヘルスの啓発活動にも取り組む",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.selenagomez.com/",
      },
      {
        name: "エマ・ストーン",
        reason:
          "テイラー・スウィフトの友人で、演技力と親しみやすい人柄で知られ、同様に多くのファンから愛されています。",
        features: ["アカデミー賞受賞女優", "コメディからドラマまで幅広い演技", "親しみやすい人柄とユーモアセンス"],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.imdb.com/name/nm1297015/",
      },
      {
        name: "ジジ・ハディッド",
        reason: "テイラー・スウィフトの友人で、ファッション業界での成功とスタイリッシュな魅力が特徴です。",
        features: [
          "世界的に有名なモデル",
          "テイラー・スウィフトの「Bad Blood」MVに出演",
          "ファッションアイコンとしての影響力",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.instagram.com/gigihadid/",
      },
      {
        name: "ゼンデイヤ",
        reason:
          "若くして成功し、演技とファッションの両面で注目されており、テイラー・スウィフトファンにも人気があります。",
        features: [
          "エミー賞受賞女優",
          "「ユーフォリア」「スパイダーマン」シリーズで知られる",
          "ファッションアイコンとしても影響力がある",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.instagram.com/zendaya/",
      },
    ],
    media: [
      {
        name: "エミリー・イン・パリ",
        reason:
          "ファッションとロマンスが融合したドラマで、テイラー・スウィフトの楽曲のようなロマンティックな要素とスタイリッシュな魅力があります。",
        features: [
          "パリを舞台にしたロマンティックコメディ",
          "ファッションとライフスタイルが魅力",
          "リリー・コリンズ主演のNetflixシリーズ",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.netflix.com/title/81037371",
      },
      {
        name: "ブリジャートン",
        reason:
          "ロマンスとドラマが融合した作品で、テイラー・スウィフトの楽曲のようなロマンティックな物語と感情表現が特徴です。",
        features: [
          "19世紀のイギリス上流社会を舞台にしたロマンスドラマ",
          "現代音楽のクラシックアレンジを使用",
          "ロマンスと社会的テーマの融合",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.netflix.com/title/80232398",
      },
      {
        name: "ユーフォリア",
        reason:
          "10代の感情と経験を赤裸々に描いたドラマで、テイラー・スウィフトの楽曲のように若者の感情を深く掘り下げています。",
        features: ["10代の生活と葛藤を描いたドラマ", "ゼンデイヤ主演のHBOシリーズ", "視覚的に美しく、音楽も印象的"],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.hbo.com/euphoria",
      },
      {
        name: "クイーンズ・ギャンビット",
        reason:
          "強い女性主人公の成長を描いたドラマで、テイラー・スウィフトの楽曲のように自己実現と挑戦のテーマが共鳴します。",
        features: [
          "1960年代を舞台にしたチェスの天才の物語",
          "アニヤ・テイラー＝ジョイ主演",
          "女性の自立と成功をテーマにした作品",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.netflix.com/title/80234304",
      },
      {
        name: "ゴシップガール",
        reason:
          "ニューヨークの上流社会を舞台にしたドラマで、テイラー・スウィフトの楽曲のようなドラマチックな人間関係と感情が描かれています。",
        features: [
          "ニューヨークの上流階級の若者を描いたドラマ",
          "ファッションとライフスタイルが魅力",
          "複雑な人間関係と成長の物語",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.hbomax.com/gossip-girl",
      },
    ],
    fashion: [
      {
        name: "フリーピープル",
        reason:
          "ボヘミアンでロマンティックなスタイルが特徴で、テイラー・スウィフトの「フォークロア」「エヴァーモア」時代のスタイルに通じるものがあります。",
        features: [
          "ボヘミアンでロマンティックなスタイル",
          "自然素材と手作り感のあるデザイン",
          "「フォークロア」時代のテイラー・スウィフトのスタイルに通じる",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.freepeople.com/",
      },
      {
        name: "アーバンアウトフィッターズ",
        reason:
          "ヴィンテージとモダンを融合させたスタイルで、テイラー・スウィフトの様々な時代のファッションに影響を与えています。",
        features: [
          "ヴィンテージとモダンの融合",
          "若者文化を反映したデザイン",
          "レコードやカメラなどのレトロアイテムも人気",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.urbanoutfitters.com/",
      },
      {
        name: "リフォメーション",
        reason:
          "サステナブルでフェミニンなデザインが特徴で、テイラー・スウィフトも着用することがあり、エレガントでありながらカジュアルな魅力があります。",
        features: [
          "サステナブルなファッションブランド",
          "フェミニンでモダンなデザイン",
          "テイラー・スウィフトも着用するブランド",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.thereformation.com/",
      },
      {
        name: "アンソロポロジー",
        reason:
          "ロマンティックでエクレクティックなスタイルが特徴で、テイラー・スウィフトの「ラヴァー」時代のカラフルでロマンティックな雰囲気に通じます。",
        features: [
          "ロマンティックでエクレクティックなデザイン",
          "カラフルで個性的なアイテム",
          "「ラヴァー」時代のテイラー・スウィフトのスタイルに通じる",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.anthropologie.com/",
      },
      {
        name: "メイドウェル",
        reason:
          "クラシックでありながらモダンなデニムとカジュアルウェアが特徴で、テイラー・スウィフトのオフデューティスタイルに通じるものがあります。",
        features: [
          "クラシックでありながらモダンなデザイン",
          "高品質なデニムが特徴",
          "カジュアルでありながら洗練されたスタイル",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.madewell.com/",
      },
    ],
  },
  ブルーノ・マーズ: {
    artists: [
      {
        name: "アンダーソン・パーク",
        reason:
          "ブルーノ・マーズとのコラボレーションユニット「シルク・ソニック」のメンバーで、同様にレトロなサウンドと現代的な感覚を融合させています。",
        features: [
          "ブルーノ・マーズとの「シルク・ソニック」ユニットのメンバー",
          "ドラムを演奏しながら歌うマルチタレント",
          "ファンク、R&B、ソウルの要素を取り入れた音楽",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.andersonpaak.com/",
      },
      {
        name: "ザ・ウィークエンド",
        reason:
          "R&Bとポップをミックスしたスタイルでブルーノ・マーズと同様に80年代のサウンドに影響を受けており、現代的な解釈で人気です。",
        features: [
          "R&Bとポップをミックスしたスタイル",
          "80年代のサウンドに影響を受けた楽曲",
          "「ブラインディング・ライツ」「セイブ・ユア・ティアーズ」などのヒット曲",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.theweeknd.com/",
      },
      {
        name: "ジャスティン・ティンバーレイク",
        reason:
          "ダンスとボーカルの両方に優れ、ブルーノ・マーズと同様にR&B、ポップ、ファンクの要素を取り入れた音楽で知られています。",
        features: [
          "ダンスとボーカルの両方に優れたパフォーマー",
          "R&B、ポップ、ファンクの要素を融合",
          "「キャント・ストップ・ザ・フィーリング!」「ミラーズ」などのヒット曲",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://justintimberlake.com/",
      },
      {
        name: "デュア・リパ",
        reason:
          "ディスコとダンスポップの要素を取り入れた楽曲で、ブルーノ・マーズのようにレトロなサウンドを現代的に解釈しています。",
        features: [
          "ディスコとダンスポップの要素を取り入れた楽曲",
          "パワフルなボーカルとキャッチーなメロディ",
          "「ドント・スタート・ナウ」「レヴィテイティング」などのヒット曲",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.dualipa.com/",
      },
      {
        name: "チャーリー・プース",
        reason:
          "音楽理論に精通し、ブルーノ・マーズと同様に作詞作曲からプロデュースまで手がける才能豊かなアーティストです。",
        features: [
          "絶対音感を持つ音楽理論の専門家",
          "作詞作曲からプロデュースまで手がける",
          "「アテンション」「ウィー・ドント・トーク・エニモア」などのヒット曲",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.charlieputh.com/",
      },
    ],
    celebrities: [
      {
        name: "ゼンデイヤ",
        reason:
          "多才な才能を持ち、ブルーノ・マーズのようにエンターテイナーとしての魅力とスタイリッシュな魅力を兼ね備えています。",
        features: [
          "歌手、ダンサー、女優として活躍",
          "ファッションアイコンとしても注目",
          "「ユーフォリア」「スパイダーマン」シリーズで知られる",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.instagram.com/zendaya/",
      },
      {
        name: "ドナルド・グローバー",
        reason:
          "音楽（チャイルディッシュ・ガンビーノ）、演技、コメディと多方面で活躍し、ブルーノ・マーズと同様に多才な才能を持っています。",
        features: [
          "チャイルディッシュ・ガンビーノとして音楽活動",
          "俳優、脚本家、コメディアンとしても活躍",
          "「アトランタ」「ディス・イズ・アメリカ」で知られる",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.instagram.com/childishgambino/",
      },
      {
        name: "ライアン・ゴズリング",
        reason:
          "「ラ・ラ・ランド」で歌とダンスの才能を見せ、ブルーノ・マーズのようなクラシックなエンターテイナーの魅力を持っています。",
        features: [
          "「ラ・ラ・ランド」で歌とダンスの才能を披露",
          "多様な役柄をこなす演技力",
          "クラシックなハリウッドスターの魅力",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.imdb.com/name/nm0331516/",
      },
      {
        name: "リアーナ",
        reason:
          "音楽とファッションビジネスで成功し、ブルーノ・マーズと同様にエンターテイナーとしての才能とビジネスセンスを兼ね備えています。",
        features: [
          "グラミー賞受賞アーティスト",
          "フェンティブランドを展開するビジネスウーマン",
          "ファッションとビューティー業界での影響力",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.rihannanow.com/",
      },
      {
        name: "ジャネール・モネイ",
        reason:
          "R&B、ファンク、ソウルの要素を取り入れた音楽性と、ブルーノ・マーズと同様にレトロでありながら未来的な魅力を持っています。",
        features: [
          "R&B、ファンク、ソウルの要素を取り入れた音楽",
          "歌手、俳優、プロデューサーとして活躍",
          "独自のビジュアルスタイルと世界観",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.jmonae.com/",
      },
    ],
    media: [
      {
        name: "ラ・ラ・ランド",
        reason:
          "音楽とダンスが融合した映画で、ブルーノ・マーズの楽曲のようにクラシックなエンターテインメントの魅力を現代的に表現しています。",
        features: [
          "音楽とダンスが融合したミュージカル映画",
          "ジャズとクラシックなハリウッド映画へのオマージュ",
          "ライアン・ゴズリングとエマ・ストーン主演",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.lalaland.movie/",
      },
      {
        name: "ベイビー・ドライバー",
        reason: "音楽と映像が完璧にシンクロした映画で、ブルーノ・マーズの楽曲のようにリズミカルで魅力的な作品です。",
        features: [
          "音楽と映像が完璧にシンクロしたアクション映画",
          "クラシックからモダンまで幅広い音楽を使用",
          "エドガー・ライト監督作品",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.sonypictures.com/movies/babydriver",
      },
      {
        name: "ガーディアンズ・オブ・ギャラクシー",
        reason:
          "クラシックな音楽と現代的なストーリーが融合した映画で、ブルーノ・マーズの楽曲のようにレトロでありながら新鮮な魅力があります。",
        features: [
          "70年代、80年代の音楽が印象的なSF映画",
          "ユーモアとアクションが融合",
          "クリス・プラット主演のマーベル作品",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.marvel.com/movies/guardians-of-the-galaxy",
      },
      {
        name: "ストレンジャー・シングス",
        reason:
          "80年代を舞台にしたドラマで、ブルーノ・マーズの楽曲のようにレトロな魅力と現代的な感覚が融合しています。",
        features: ["80年代を舞台にしたSFホラードラマ", "レトロな雰囲気と音楽が特徴", "Netflixの人気オリジナルシリーズ"],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.netflix.com/title/80057281",
      },
      {
        name: "エンパイア",
        reason:
          "音楽業界を舞台にしたドラマで、ブルーノ・マーズのようなR&B、ヒップホップ、ポップの要素が融合した音楽が特徴です。",
        features: [
          "音楽業界を舞台にしたドラマ",
          "R&B、ヒップホップ、ポップの要素が融合",
          "ティモシー・ハットン、タラジ・P・ヘンソン主演",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.fox.com/empire/",
      },
    ],
    fashion: [
      {
        name: "ヴェルサーチ",
        reason:
          "ブルーノ・マーズが着用することでも知られる高級ブランドで、華やかでありながらクラシックな魅力があります。",
        features: [
          "華やかで大胆なデザイン",
          "ブルーノ・マーズが着用することでも知られる",
          "イタリアの高級ファッションブランド",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.versace.com/",
      },
      {
        name: "サンローラン",
        reason:
          "ブルーノ・マーズが着用することでも知られるブランドで、ロックンロールとエレガンスが融合したスタイルが特徴です。",
        features: [
          "ロックンロールとエレガンスの融合",
          "スリムなシルエットとモノクロームのデザイン",
          "ブルーノ・マーズのステージ衣装にも影響",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.ysl.com/",
      },
      {
        name: "グッチ",
        reason:
          "レトロとモダンを融合させたデザインで、ブルーノ・マーズのようなクラシックでありながら現代的なスタイルに影響を与えています。",
        features: [
          "レトロとモダンを融合させたデザイン",
          "大胆なパターンと色使い",
          "アレッサンドロ・ミケーレのエクレクティックなスタイル",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.gucci.com/",
      },
      {
        name: "トム・フォード",
        reason:
          "洗練されたスーツとフォーマルウェアで知られ、ブルーノ・マーズのエレガントなステージ衣装に通じるスタイルです。",
        features: ["洗練されたスーツとフォーマルウェア", "高級感と現代的なデザイン", "セレブリティにも人気のブランド"],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.tomford.com/",
      },
      {
        name: "ラコステ",
        reason:
          "スポーティでありながらエレガントなスタイルで、ブルーノ・マーズのカジュアルでありながら洗練されたオフステージスタイルに通じます。",
        features: [
          "スポーティでありながらエレガントなデザイン",
          "テニスの伝統に根ざしたクラシックなデザイン",
          "カジュアルでありながら品のあるスタイル",
        ],
        imageUrl: "/placeholder.svg?height=400&width=600",
        officialUrl: "https://www.lacoste.com/",
      },
    ],
  },
}

// recommendationsDatabase内の画像URLを修正
// Stray Kidsの画像URLを修正
recommendationsDatabase["BTS（防弾少年団）"].artists[3].imageUrl = "/placeholder.svg?height=400&width=400"

// 他の可能性のある問題のある画像URLも修正
// 以下のURLを全てプレースホルダーに置き換え
recommendationsDatabase["BTS（防弾少年団）"].artists[0].imageUrl = "/placeholder.svg?height=400&width=400"
recommendationsDatabase["BTS（防弾少年団）"].artists[1].imageUrl = "/placeholder.svg?height=400&width=400"
recommendationsDatabase["BTS（防弾少年団）"].artists[2].imageUrl = "/placeholder.svg?height=400&width=400"
recommendationsDatabase["BTS（防弾少年団）"].artists[4].imageUrl = "/placeholder.svg?height=400&width=400"

// モックデータベース内の各アイテムのimageUrlを実際の画像URLに変更します
// 例えば、米津玄師のデータベースの最初のアーティスト「King Gnu」の画像を変更：

// 米津玄師のデータベース内の各アイテムの画像URLを実際の画像に変更
// キング・ヌーの画像URL
recommendationsDatabase.米津玄師.artists[0].imageUrl =
  "https://www.universal-music.co.jp/kinggnu/wp-content/uploads/sites/8663/2023/11/KG_SPECIALSITE_MAIN_PC.jpg"

// 菅田将暉の画像URL
recommendationsDatabase.米津玄師.artists[1].imageUrl =
  "https://www.horipro.co.jp/wp-content/uploads/sites/2/2023/10/sudamasaki_prof.jpg"

// ヨルシカの画像URL
recommendationsDatabase.米津玄師.artists[2].imageUrl = "https://yorushika.com/images/top/main_pc.jpg"

// RADWIMPSの画像URL
recommendationsDatabase.米津玄師.artists[3].imageUrl = "https://radwimps.jp/images/top/main_pc.jpg"

// あいみょんの画像URL
recommendationsDatabase.米津玄師.artists[4].imageUrl = "https://www.aimyong.net/assets/img/top/main_pc.jpg"

// 芸能人の画像も更新
recommendationsDatabase.米津玄師.celebrities[0].imageUrl =
  "https://www.horipro.co.jp/wp-content/uploads/sites/2/2023/10/sudamasaki_prof.jpg"
recommendationsDatabase.米津玄師.celebrities[1].imageUrl = "https://www.hoshinogen.com/img/top/main_pc.jpg"
recommendationsDatabase.米津玄師.celebrities[2].imageUrl = "https://radwimps.jp/images/top/main_pc.jpg"
recommendationsDatabase.米津玄師.celebrities[3].imageUrl =
  "https://www.universal-music.co.jp/kinggnu/wp-content/uploads/sites/8663/2023/11/KG_SPECIALSITE_MAIN_PC.jpg"
recommendationsDatabase.米津玄師.celebrities[4].imageUrl =
  "https://www.horipro.co.jp/satomiishihara/images/top/main_pc.jpg"

// メディアの画像も更新
recommendationsDatabase.米津玄師.media[0].imageUrl = "https://www.kiminona.com/images/top/main_pc.jpg"
recommendationsDatabase.米津玄師.media[1].imageUrl = "https://www.tenkinoko.com/images/top/main_pc.jpg"
recommendationsDatabase.米津玄師.media[2].imageUrl = "https://sing-movie.jp/images/top/main_pc.jpg"
recommendationsDatabase.米津玄師.media[3].imageUrl = "https://www.kimiuso.jp/images/top/main_pc.jpg"
recommendationsDatabase.米津玄師.media[4].imageUrl = "https://www.fujitv.co.jp/b_hp/pingpong/images/top/main_pc.jpg"

// ファッションブランドの画像も更新
recommendationsDatabase.米津玄師.fashion[0].imageUrl =
  "https://www.uniqlo.com/jp/ja/contents/feature/masterpiece/common/img/ogp.jpg"
recommendationsDatabase.米津玄師.fashion[1].imageUrl =
  "https://www.gu-global.com/jp/ja/feature/men/recommend/img/ogp.jpg"
recommendationsDatabase.米津玄師.fashion[2].imageUrl = "https://www.beams.co.jp/img/top/main_pc.jpg"
recommendationsDatabase.米津玄師.fashion[3].imageUrl = "https://www.urban-research.jp/img/top/main_pc.jpg"
recommendationsDatabase.米津玄師.fashion[4].imageUrl = "https://studious.co.jp/img/top/main_pc.jpg"

// BTSのデータベース内の画像も更新
recommendationsDatabase["BTS（防弾少年団）"].artists[0].imageUrl = "/placeholder.svg?height=400&width=400"
recommendationsDatabase["BTS（防弾少年団）"].artists[1].imageUrl = "/placeholder.svg?height=400&width=400"
recommendationsDatabase["BTS（防弾少年団）"].artists[2].imageUrl = "/placeholder.svg?height=400&width=400"
recommendationsDatabase["BTS（防弾少年団）"].artists[3].imageUrl = "/placeholder.svg?height=400&width=400"
recommendationsDatabase["BTS（防弾少年団）"].artists[4].imageUrl = "/placeholder.svg?height=400&width=400"

// 他のアーティストのデータベースも同様に更新
// テイラー・スウィフトのデータベース内の画像も更新
recommendationsDatabase["テイラー・スウィフト"].artists[0].imageUrl =
  "https://www.oliviarodrigo.com/img/top/main_pc.jpg"
recommendationsDatabase["テイラー・スウィフト"].artists[1].imageUrl = "https://www.lorde.co.nz/img/top/main_pc.jpg"
recommendationsDatabase["テイラー・スウィフト"].artists[2].imageUrl = "https://www.billieeilish.com/img/top/main_pc.jpg"
recommendationsDatabase["テイラー・スウィフト"].artists[3].imageUrl = "https://www.arianagrande.com/img/top/main_pc.jpg"
recommendationsDatabase["テイラー・スウィフト"].artists[4].imageUrl = "https://www.lanadelrey.com/img/top/main_pc.jpg"

// ブルーノ・マーズのデータベース内の画像も更新
recommendationsDatabase["ブルーノ・マーズ"].artists[0].imageUrl = "https://www.andersonpaak.com/img/top/main_pc.jpg"
recommendationsDatabase["ブルーノ・マーズ"].artists[1].imageUrl = "https://www.theweeknd.com/img/top/main_pc.jpg"
recommendationsDatabase["ブルーノ・マーズ"].artists[2].imageUrl = "https://justintimberlake.com/img/top/main_pc.jpg"
recommendationsDatabase["ブルーノ・マーズ"].artists[3].imageUrl = "https://www.dualipa.com/img/top/main_pc.jpg"
recommendationsDatabase["ブルーノ・マーズ"].artists[4].imageUrl = "https://www.charlieputh.com/img/top/main_pc.jpg"

// デフォルトの推薦データの画像も更新
defaultRecommendations.artists[0].imageUrl = "https://reissuerecords.net/wp-content/uploads/2023/10/yonezu_prof.jpg"
defaultRecommendations.artists[1].imageUrl = "https://ibighit.com/bts/images/bts/discography/proof/proof-cover.jpg"
defaultRecommendations.artists[2].imageUrl =
  "https://www.taylorswift.com/wp-content/uploads/2023/10/taylor_swift_eras_tour.jpg"
defaultRecommendations.artists[3].imageUrl = "https://www.brunomars.com/wp-content/uploads/2023/10/bruno_mars_prof.jpg"
defaultRecommendations.artists[4].imageUrl =
  "https://www.billieeilish.com/wp-content/uploads/2023/10/billie_eilish_prof.jpg"

// タグベースの検索をサポートするための拡張
export async function getRecommendations(searchTerm: string): Promise<RecommendationsData> {
  // 検索を模倣するための遅延
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // 検索キーワードを小文字に変換して空白で分割
  const keywords = searchTerm.toLowerCase().split(/\s+/)

  // データベースから検索
  for (const [key, value] of Object.entries(recommendationsDatabase)) {
    // キーワードのいずれかがデータベースのキーに含まれているか確認
    if (keywords.some((keyword) => key.toLowerCase().includes(keyword) || keyword.includes(key.toLowerCase()))) {
      return value
    }
  }

  // タグベースの検索（キーワードがタグに含まれているか）
  // 実際のアプリケーションでは、より高度な検索アルゴリズムを使用する
  const allItems = [
    ...defaultRecommendations.artists,
    ...defaultRecommendations.celebrities,
    ...defaultRecommendations.media,
    ...defaultRecommendations.fashion,
  ]

  // キーワードに基づいてアイテムをフィルタリング
  const filteredItems = allItems.filter((item) => {
    const itemText = `${item.name} ${item.reason} ${item.features.join(" ")}`.toLowerCase()
    return keywords.some((keyword) => itemText.includes(keyword))
  })

  // フィルタリングされたアイテムがある場合は、それらを返す
  if (filteredItems.length > 0) {
    return {
      artists: filteredItems.slice(0, 5),
      celebrities: filteredItems.slice(0, 5),
      media: filteredItems.slice(0, 5),
      fashion: filteredItems.slice(0, 5),
    }
  }

  // 一致するものが見つからない場合は、デフォルトの推薦を返す
  return {
    ...defaultRecommendations,
    artists: [...defaultRecommendations.artists.filter((a) => a.name.toLowerCase() !== searchTerm.toLowerCase())],
  }
}
