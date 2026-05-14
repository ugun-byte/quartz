import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/ugun-byte/quartz",
      "Signal Cabinet": "https://github.com/ugun-byte/quartz",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
    Component.ConditionalRender({
      component: Component.RecentNotes({
        title: "최신 브리핑 3선",
        limit: 3,
        showTags: true,
        linkToMore: false,
        filter: (f) => String(f.slug ?? "").startsWith("signals/"),
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
    Component.ConditionalRender({
      component: Component.RecentNotes({
        title: "이 인물 관련 브리핑",
        limit: 4,
        showTags: true,
        linkToMore: false,
        filter: (f, current) => {
          const currentSlug = String(current.slug ?? "")
          const personSlug = currentSlug.startsWith("people/") ? currentSlug.split("/").pop() : null
          const tags = Array.isArray(f.frontmatter?.tags) ? f.frontmatter.tags : []
          return (
            !!personSlug &&
            String(f.slug ?? "").startsWith("signals/") &&
            tags.includes(personSlug) &&
            f.slug !== current.slug
          )
        },
      }),
      condition: (page) => String(page.fileData.slug ?? "").startsWith("people/"),
    }),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [
    Component.Graph(),
    Component.RecentNotes({
      title: "최신 브리핑",
      limit: 6,
      showTags: true,
      linkToMore: false,
      filter: (f) => String(f.slug ?? "").startsWith("signals/"),
    }),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [
    Component.Graph(),
    Component.RecentNotes({
      title: "최신 브리핑",
      limit: 6,
      showTags: true,
      linkToMore: false,
      filter: (f) => String(f.slug ?? "").startsWith("signals/"),
    }),
  ],
}
