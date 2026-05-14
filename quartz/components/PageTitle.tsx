import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const watchedPeople = [
  ["도널드 트럼프", "Donald Trump", "donald-trump"],
  ["나렌드라 모디", "Narendra Modi", "narendra-modi"],
  ["샘 올트먼", "Sam Altman", "sam-altman"],
  ["안드레이 카파시", "Andrej Karpathy", "andrej-karpathy"],
  ["얀 르쿤", "Yann LeCun", "yann-lecun"],
  ["데미스 허사비스", "Demis Hassabis", "demis-hassabis"],
  ["일론 머스크", "Elon Musk", "elon-musk"],
  ["마크 저커버그", "Mark Zuckerberg", "mark-zuckerberg"],
  ["사티아 나델라", "Satya Nadella", "satya-nadella"],
  ["순다르 피차이", "Sundar Pichai", "sundar-pichai"],
  ["팀 쿡", "Tim Cook", "tim-cook"],
  ["리사 수", "Lisa Su", "lisa-su"],
  ["젠슨 황", "Jensen Huang", "jensen-huang"],
  ["캐시 우드", "Cathie Wood", "cathie-wood"],
  ["피터 틸", "Peter Thiel", "peter-thiel"],
  ["리드 호프먼", "Reid Hoffman", "reid-hoffman"],
  ["브렛 애드콕", "Brett Adcock", "brett-adcock"],
  ["마크 레이버트", "Marc Raibert", "marc-raibert"],
  ["미스터비스트", "MrBeast", "mrbeast"],
  ["조 로건", "Joe Rogan", "joe-rogan"],
  ["크리스티아누 호날두", "Cristiano Ronaldo", "cristiano-ronaldo"],
]

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <div class={classNames(displayClass, "site-identity")}>
      <h2 class="page-title">
        <a href={baseDir}>{title}</a>
      </h2>
      <div class="site-subtitle" aria-label="관측 중인 인물 목록">
        <p class="site-subtitle-label">관측 인물</p>
        <div class="people-subtitle-list">
          {watchedPeople.map(([ko, en, slug]) => (
            <a class="person-chip" href={`${baseDir}/people/${slug}`}>
              <span class="person-ko">{ko}</span>
              <span class="person-en">{en}</span>
            </a>
          ))}
          <a class="person-chip person-chip-atlas" href={`${baseDir}/atlas/people`}>
            <span class="person-ko">전체 인물 보기</span>
            <span class="person-en">People Atlas</span>
          </a>
        </div>
      </div>
    </div>
  )
}

PageTitle.css = `
.site-identity {
  margin: 0 0 1rem 0;
}

.page-title {
  font-size: 1.55rem;
  line-height: 1.25;
  margin: 0;
  font-family: var(--titleFont);
}

.site-subtitle {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--lightgray);
}

.site-subtitle-label {
  margin: 0 0 0.4rem 0;
  color: var(--secondary);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.people-subtitle-list {
  display: flex;
  flex-direction: column;
  gap: 0.32rem;
  max-height: 22rem;
  overflow: auto;
  padding-right: 0.2rem;
}

.person-chip {
  display: block;
  padding: 0.35rem 0.45rem;
  border: 1px solid var(--lightgray);
  border-radius: 0.55rem;
  background: color-mix(in srgb, var(--light) 88%, var(--secondary) 12%);
  text-decoration: none;
}

.person-chip:hover {
  border-color: var(--secondary);
  background: color-mix(in srgb, var(--light) 78%, var(--secondary) 22%);
}

.person-chip-atlas {
  border-style: dashed;
}

.person-ko {
  display: block;
  color: var(--dark);
  font-size: 0.86rem;
  font-weight: 700;
  line-height: 1.2;
}

.person-en {
  display: block;
  color: var(--darkgray);
  font-size: 0.72rem;
  line-height: 1.2;
}

@media all and (max-width: 800px) {
  .site-identity {
    margin-bottom: 0.85rem;
  }

  .page-title {
    font-size: 1.24rem;
  }

  .site-subtitle {
    margin-top: 0.55rem;
    padding-top: 0.55rem;
  }

  .site-subtitle-label {
    margin-bottom: 0.45rem;
    font-size: 0.75rem;
  }

  .people-subtitle-list {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(9.75rem, 78vw);
    gap: 0.45rem;
    max-height: none;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0 0 0.2rem 0;
    scroll-snap-type: x proximity;
    -webkit-overflow-scrolling: touch;
  }

  .person-chip {
    min-height: 3.2rem;
    padding: 0.45rem 0.55rem;
    scroll-snap-align: start;
  }

  .person-ko {
    font-size: 0.82rem;
  }

  .person-en {
    font-size: 0.69rem;
  }
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
