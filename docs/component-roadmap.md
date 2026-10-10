# Frontend component roadmap

This inventory follows the approved PRD. Component APIs are presentational unless they receive an explicit server action or data callback. Payload and server code remain responsible for authorization, validation, attempt persistence, scoring, payment capture, and audit records.

## Shared navigation and public content — built

| Components                                                                                                                                                                                                                     | Location                         | PRD connection                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------- | ------------------------------ |
| `Button`, `ButtonLink`                                                                                                                                                                                                         | `src/components/ui`              | Shared actions                 |
| `SiteHeader`, `CatalogMegaMenu`, `Breadcrumbs`, `SiteFooter`                                                                                                                                                                   | `src/components/navigation`      | Navigation rules, public pages |
| `TestCard`, `CategoryTile`, `TestSearch`                                                                                                                                                                                       | `src/components/navigation`      | Home and category pages        |
| `RichTextContent`, `HeroSection`, `TestFactsTable`, `SectionCards`, `WorkedExample`, `ScoringExplainer`, `FAQList`, `CourseCTA`, `TestimonialStrip`, `Disclaimer`, `FreshnessLog`, `EmbeddedQuizShell`, `ContentBlockRenderer` | `src/components/content`         | FP-1–FP-3, FP-8, DF-10         |
| `CourseOverview`, `SyllabusOutline`, `SampleLesson`, `PriceAndAccessPanel`, `CourseCTA`                                                                                                                                        | `src/features/public/components` | Course page, access tiers      |
| `BreadcrumbListJsonLd`, `FAQPageJsonLd`, `CourseJsonLd`                                                                                                                                                                        | `src/features/public/components` | FP-8                           |

The home page, category page, practice guide, and course outline currently use clearly labeled fixtures from `src/mocks/testPrepData.ts`. The public demo routes do not query Payload or require a database. Mock pages are marked `noindex`.

## Quiz and simulation UI — built

| Components                                                                                                                                                                                              | Location                                        | PRD connection                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | -------------------------------- |
| `QuestionCard` registry: `mcq_single`, `mcq_multi`, `numeric_entry`, `text_entry`, `image_mcq`, `passage_group`, `memorization`, `likert`, `sjt_rank`, `grammar_select`, `attention_detail`, `sequence` | `src/features/quiz/components/QuestionCard.tsx` | QE-1, QE-11                      |
| `toQuizQuestionDTO`                                                                                                                                                                                     | `src/features/quiz/toQuizQuestionDTO.ts`        | Safe learner question delivery   |
| `QuizFrame`, `QuizInstructions`, `QuizProgress`, `QuizTimer`, `QuestionNavigator`, `QuizControls`, `PreSubmitReview`, `SectionTransition`, `SimulationShell`, `QuizUtilities`, `CalculatorPad`          | `src/features/quiz/components`                  | QE-2–QE-5, QE-9–QE-10, SM-3–SM-4 |
| `ScoreSummary`, `SectionScoreBreakdown`, `WeakestSectionCTA`, `AnswerFeedback`, `QuestionReviewCard`, `ErrorTypeGroups`, `TimePaceTable`, `ReviewFilters`                                               | `src/features/quiz/components/Results.tsx`      | FP-5, SM-5–SM-6, DF-1–DF-2       |

`QuizQuestionDTO` is the presentation boundary. `toQuizQuestionDTO` builds an explicit object and does not copy `answer`, `explanation`, `itemData`, or private option diagnostics. Timed/simulation loaders still need to enforce approval and access before calling it. The timer displays from a server-provided deadline and calls an expiry callback; the server still validates and submits the attempt.

## Learner, course player, and account UI — built

| Components                                                                                                    | Location                          | PRD connection    |
| ------------------------------------------------------------------------------------------------------------- | --------------------------------- | ----------------- |
| `DashboardHeading`, `OwnedCourses`, `OwnedCourseCard`, `ReadinessIndicator`, `SectionMastery`, `TestDatePlan` | `src/features/learner/components` | DB-1–DB-4, DF-4   |
| `CoursePlayerOutline`, `ContinueLearning`, `LessonContent`, `DrillRecommendation`                             | `src/features/learner/components` | CP-1–CP-4         |
| `RoadmapChecklist`                                                                                            | `src/features/learner/components` | DF-6              |
| `AccessExpiryBanner`, `ExpiredAccessState`, locked lesson upgrade disclosure                                  | `src/features/learner/components` | TR-4–TR-8         |
| `ReceiptList`, `AccountDataControls`                                                                          | `src/features/learner/components` | AU-5, PAY-5–PAY-6 |

## Authentication and checkout UI — built

| Components                                                               | Location                           | PRD connection     |
| ------------------------------------------------------------------------ | ---------------------------------- | ------------------ |
| `AuthPanel`, `EmailPasswordForm`, `MagicLinkForm`, `SetPasswordForm`     | `src/features/auth/components`     | AU-1–AU-2          |
| `OrderSummary`, `CouponCodeForm`, `PayPalButtonsRegion`, `PaymentStatus` | `src/features/checkout/components` | PAY-1–PAY-4, PAY-8 |
| `RefundRequestForm`, `ExtensionRequestForm`, `RequestConfirmation`       | `src/features/checkout/components` | PAY-5, DF-8        |

## Editorial and operations UI — built

| Components                                                                 | Location                      | PRD connection     |
| -------------------------------------------------------------------------- | ----------------------------- | ------------------ |
| `WorkflowStatus`, `EditorialWorkflowPanel`, `ContentReviewQueue`           | `src/features/cms/components` | CMS-2              |
| `QuestionImportForm`, `ImportValidationReport`                             | `src/features/cms/components` | CMS-3              |
| `QuestionAuthoringPreview`, `QuestionTagSummary`                           | `src/features/cms/components` | CMS-4              |
| `AdminSearchForm`, `OrdersTable`, `EntitlementActionForm`, `AuditLogTable` | `src/features/cms/components` | CMS-7–CMS-8, TR-11 |

Payload Admin provides the collection CRUD screens for CMS-1. The custom components above are reusable UI pieces and do not replace Payload access rules or workflow hooks.

## Integration work still needed

- Replace the demo category, practice guide, and course fixture reads with approved server loaders after client approval. Add learner dashboard, account, and checkout route loaders at that point too.
- Put simulation routes in the separate `(simulation)` root layout so they do not render the public header or footer.
- Implement authenticated server actions and APIs for login, data export/deletion, account/entitlement checks, attempt save/resume, scoring, refund requests, and extension requests.
- Add server validation and persistence for question imports, editorial state changes, audit events, and preview URLs.
- Integrate PayPal JS SDK and the server-side order/capture/webhook flow only after backend approval.
- Define and validate the type-specific `itemData` schema before adding editor fields for each item's special configuration. The PRD lists item types but does not define the JSON shape for those fields.

## Safety and rendering rules

- Use Server Components for public CMS pages and pass only approved, published content to them.
- Keep protected routes and mutations behind server-side authentication and entitlement checks.
- Never send question answer keys or protected explanations to timed/simulation clients before submit.
- Use keyboard-operable alternatives for ranking, visible focus, semantic labels, and reduced-motion support.
