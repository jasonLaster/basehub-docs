import { fragmentOn, fragmentOnRecursiveCollection } from '@/.basehub'
import { CalloutFragment } from '@/app/_components/article/callout'
import { HeadingWithIconFragment } from '@/app/_components/article/heading-with-icon'
import { CardsGridFragment } from '@/app/_components/article/cards-grid'
import { StepperFragment } from '@/app/_components/article/stepper'

/* -------------------------------------------------------------------------------------------------
 * Article
 * -----------------------------------------------------------------------------------------------*/

export const ArticleMetaFragment = fragmentOn('ArticleComponent', {
  _id: true,
  _title: true,
  _slug: true,
  _sys: {
    lastModifiedAt: true,
  },
  titleSidebarOverride: true,
  body: {
    __typename: true,
  },
})

export type ArticleMetaFragment = fragmentOn.infer<typeof ArticleMetaFragment>

export const ArticleBodyFragment = fragmentOn('BodyRichText', {
  content: true,
  toc: true,
  blocks: {
    __typename: true,
    on_CalloutComponent: CalloutFragment,
    on_HeadingWithIconComponent: HeadingWithIconFragment,
    on_CardsGridComponent: CardsGridFragment,
    on_StepperComponent: StepperFragment,
  },
})

export const ArticleFragment = fragmentOn('ArticleComponent', {
  ...ArticleMetaFragment,
  body: {
    ...ArticleMetaFragment.body,
    readingTime: true,
    json: ArticleBodyFragment,
  },
})

export type ArticleFragment = fragmentOn.infer<typeof ArticleFragment>

export const ArticleMetaFragmentRecursive = fragmentOnRecursiveCollection(
  'ArticleComponent',
  ArticleMetaFragment,
  {
    levels: 5,
    recursiveKey: 'children',
  }
)

export type ArticleMetaFragmentRecursive = fragmentOn.infer<
  typeof ArticleMetaFragmentRecursive
>

/* -------------------------------------------------------------------------------------------------
 * Page
 * -----------------------------------------------------------------------------------------------*/

export const PageFragment = fragmentOn('PagesItem', {
  _id: true,
  _slug: true,
  articles: { items: ArticleMetaFragmentRecursive },
})

export type PageFragment = fragmentOn.infer<typeof PageFragment>

export const pageBySlug = (slug: string | undefined) => {
  return fragmentOn('Pages', {
    __args: {
      first: 1,
      ...(slug && {
        filter: { _sys_slug: { eq: slug } },
      }),
    },
    items: PageFragment,
  })
}
