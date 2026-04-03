'use client'

import { useEffect, useState, Suspense, lazy } from 'react'
import {
  Activity,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ClipboardCheck,
  Download,
  ExternalLink,
  Gamepad2,
  Gift,
  Hand,
  Keyboard,
  RotateCcw,
  Sparkles,
  Shield,
  Star,
  Swords,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { useMessages } from 'next-intl'
import { VideoFeature } from '@/components/home/VideoFeature'
import { LatestGuidesAccordion } from '@/components/home/LatestGuidesAccordion'
import { NativeBannerAd, AdBanner } from '@/components/ads'
import { SidebarAd } from '@/components/ads/SidebarAd'
import { scrollToSection } from '@/lib/scrollToSection'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import type { ContentItemWithType } from '@/lib/getLatestArticles'
import type { ModuleLinkMap } from '@/lib/buildModuleLinkMap'

// Lazy load heavy components
const HeroStats = lazy(() => import('@/components/home/HeroStats'))
const FAQSection = lazy(() => import('@/components/home/FAQSection'))
const CTASection = lazy(() => import('@/components/home/CTASection'))

// Loading placeholder
const LoadingPlaceholder = ({ height = 'h-64' }: { height?: string }) => (
  <div className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`} />
)

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined
  children: React.ReactNode
  className?: string
  locale: string
}) {
  if (linkData) {
    const href = locale === 'en' ? linkData.url : `/${locale}${linkData.url}`
    return (
      <Link
        href={href}
        className={`${className || ''} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    )
  }
  return <>{children}</>
}

// Match Guide Accordion sub-component (needs its own state)
function MatchGuideSection({ t, moduleLinkMap, locale }: { t: any; moduleLinkMap: ModuleLinkMap; locale: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="match-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12 scroll-reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium">
            <Gamepad2 className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
            {t.modules.superstarBaseball7v7MatchGuide.eyebrow}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <LinkedTitle linkData={moduleLinkMap['superstarBaseball7v7MatchGuide']} locale={locale}>
              {t.modules.superstarBaseball7v7MatchGuide.title}
            </LinkedTitle>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            {t.modules.superstarBaseball7v7MatchGuide.subtitle}
          </p>
          <p className="text-muted-foreground text-sm max-w-3xl mx-auto mt-3">
            {t.modules.superstarBaseball7v7MatchGuide.intro}
          </p>
        </div>

        {/* Accordion Items */}
        <div className="scroll-reveal space-y-3">
          {t.modules.superstarBaseball7v7MatchGuide.items.map((item: any, index: number) => (
            <div key={index} className="border border-border rounded-xl overflow-hidden hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left bg-white/5 hover:bg-white/10 transition-colors"
              >
                <span className="font-semibold text-base pr-4">{item.question}</span>
                <ChevronDown
                  className={`flex-shrink-0 w-5 h-5 text-[hsl(var(--nav-theme-light))] transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5 pt-2 bg-[hsl(var(--nav-theme)/0.03)] border-t border-border">
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[]
  moduleLinkMap: ModuleLinkMap
  locale: string
}

export default function HomePageClient({ latestArticles, moduleLinkMap, locale }: HomePageClientProps) {
  const t = useMessages() as any
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://superstarbaseballwiki.wiki'

  // Structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: "Superstar Baseball Wiki",
        description: "Complete Superstar Baseball Wiki covering codes, styles, batting, pitching, controls, spins, and beginner guides for the anime-inspired Roblox baseball game.",
        image: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Superstar Baseball - Anime-Inspired 7v7 Roblox Baseball",
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: "Superstar Baseball Wiki",
        alternateName: "Superstar Baseball",
        url: siteUrl,
        description: "Complete Superstar Baseball Wiki resource hub for codes, styles, batting, pitching, controls, spins, and beginner guides",
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Superstar Baseball Wiki - Anime-Inspired 7v7 Roblox Baseball",
        },
        sameAs: [
          'https://www.roblox.com/games/101432174163538/Superstar-Baseball',
          'https://discord.com/invite/zDSNPg33Pj',
          'https://www.roblox.com/communities/10302151/Metavision',
        ],
      },
      {
        '@type': 'VideoGame',
        name: "Superstar Baseball",
        gamePlatform: ['Roblox'],
        applicationCategory: 'Game',
        genre: ['Sports', 'Baseball', 'Competitive', 'Anime'],
        numberOfPlayers: {
          minValue: 2,
          maxValue: 14,
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: 'https://www.roblox.com/games/101432174163538/Superstar-Baseball',
        },
      },
    ],
  }

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-reveal-visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 左侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ left: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x600" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600} />
      </aside>

      {/* 右侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ right: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x300" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300} />
      </aside>

      {/* 广告位 1: 移动端横幅 Sticky */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-6">
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.hero.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => scrollToSection('superstar-baseball-codes')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-lg transition-colors"
              >
                <Download className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/101432174163538/Superstar-Baseball"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* 广告位 2: 原生横幅 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ''} />

      {/* Video Section */}
      <section className="px-4 py-12">
        <div className="scroll-reveal container mx-auto max-w-4xl">
          <div className="relative rounded-2xl overflow-hidden">
            <VideoFeature
              videoId="Y8l3biRbmGA"
              title="SHOHEI OHTANI Takes Over SUPERSTAR BASEBALL!"
              posterImage="/images/hero.webp"
            />
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={30} />

      {/* 广告位 3: 标准横幅 728×90 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Tools Grid - 16 Navigation Cards */}
      <section className="px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.tools.title}{' '}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              // 映射卡片索引到 section ID
              const sectionIds = [
                'superstar-baseball-codes', 'beginner-guide', 'controls', 'batting-guide',
                'pitching-guide', 'spins-guide', 'offensive-styles', 'defensive-styles',
                'how-to-hit-home-runs', 'fielding-guide', 'best-pitch-types', 'how-to-get-more-spins',
                'coins-guide', 'roles-guide', 'match-guide', 'solo-queue-tips'
              ]
              const sectionId = sectionIds[index]

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group p-6 rounded-xl border border-border
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-12 h-12 rounded-lg mb-4
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors">
                    <DynamicIcon
                      name={card.icon}
                      className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* 广告位 4: 方形广告 300×250 */}
      <AdBanner type="banner-300x250" adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250} />

      {/* Module 1: Superstar Baseball Codes */}
      <section id="superstar-baseball-codes" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium">
              <Download className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
              {t.modules.superstarBaseballCodes.eyebrow}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['superstarBaseballCodes']} locale={locale}>
                {t.modules.superstarBaseballCodes.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.superstarBaseballCodes.subtitle}
            </p>
          </div>

          {/* Active Codes Grid */}
          <div className="scroll-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {t.modules.superstarBaseballCodes.activeCodes.map((item: any, index: number) => (
              <div key={index} className="p-5 bg-white/5 border border-[hsl(var(--nav-theme)/0.3)] rounded-xl hover:border-[hsl(var(--nav-theme)/0.6)] hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)] transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400">
                    <Check className="w-3 h-3" />
                    {t.modules.superstarBaseballCodes.activeLabel}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.category}</span>
                </div>
                <p className="font-mono font-bold text-xl text-[hsl(var(--nav-theme-light))] mb-2 tracking-wider">{item.code}</p>
                <p className="text-sm text-muted-foreground">{item.reward}</p>
              </div>
            ))}
          </div>

          {/* How to Redeem */}
          <div className="scroll-reveal p-6 bg-white/5 border border-border rounded-xl mb-8">
            <div className="flex items-center gap-2 mb-5">
              <BookOpen className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-lg">{t.modules.superstarBaseballCodes.redeemTitle}</h3>
            </div>
            <ol className="space-y-3">
              {t.modules.superstarBaseballCodes.redeemSteps.map((step: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center text-xs font-bold text-[hsl(var(--nav-theme-light))]">{index + 1}</span>
                  <span className="text-sm text-muted-foreground pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Expired Codes */}
          <div className="scroll-reveal">
            <h3 className="text-base font-semibold mb-3 text-muted-foreground">{t.modules.superstarBaseballCodes.expiredSectionTitle}</h3>
            <div className="flex flex-wrap gap-2">
              {t.modules.superstarBaseballCodes.expiredCodes.map((item: any, index: number) => (
                <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/5 border border-border text-sm font-mono text-muted-foreground line-through opacity-60">
                  {item.code}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 广告位 5: 中型横幅 468×60 */}
      <AdBanner type="banner-468x60" adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60} />

      {/* Module 2: Superstar Baseball Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium">
              <BookOpen className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
              {t.modules.superstarBaseballBeginnerGuide.eyebrow}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['superstarBaseballBeginnerGuide']} locale={locale}>
                {t.modules.superstarBaseballBeginnerGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.superstarBaseballBeginnerGuide.subtitle}
            </p>
          </div>

          {/* Steps */}
          <div className="scroll-reveal space-y-4 mb-10">
            {t.modules.superstarBaseballBeginnerGuide.steps.map((step: any, index: number) => (
              <div key={index} className="flex gap-4 p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                  <span className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    <LinkedTitle linkData={moduleLinkMap[`superstarBaseballBeginnerGuide::steps::${index}`]} locale={locale}>
                      {step.title}
                    </LinkedTitle>
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Tips */}
          <div className="scroll-reveal p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-lg">{t.modules.superstarBaseballBeginnerGuide.quickTipsTitle}</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.superstarBaseballBeginnerGuide.quickTips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />

      {/* Module 3: Superstar Baseball Controls */}
      <section id="controls" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium">
              <Keyboard className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
              {t.modules.superstarBaseballControls.eyebrow}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['superstarBaseballControls']} locale={locale}>
                {t.modules.superstarBaseballControls.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.superstarBaseballControls.intro}
            </p>
          </div>

          {/* Controls Table */}
          <div className="scroll-reveal overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-semibold text-[hsl(var(--nav-theme-light))]">Action</th>
                  <th className="text-left p-4 text-sm font-semibold text-[hsl(var(--nav-theme-light))]">Role</th>
                  <th className="text-left p-4 text-sm font-semibold text-[hsl(var(--nav-theme-light))]">Input</th>
                  <th className="text-left p-4 text-sm font-semibold text-[hsl(var(--nav-theme-light))] hidden md:table-cell">Description</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.superstarBaseballControls.controls.map((ctrl: any, index: number) => (
                  <tr key={index} className={`border-b border-border hover:bg-white/5 transition-colors ${index % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                    <td className="p-4 font-semibold text-sm">{ctrl.action}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full border ${
                        ctrl.role === 'Batter' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                        : ctrl.role === 'Pitcher' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                        : 'bg-green-500/10 border-green-500/30 text-green-400'
                      }`}>{ctrl.role}</span>
                    </td>
                    <td className="p-4">
                      <kbd className="px-2 py-1 rounded bg-white/10 border border-border text-xs font-mono font-bold text-[hsl(var(--nav-theme-light))]">{ctrl.input}</kbd>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">{ctrl.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Module 4: Superstar Baseball Batting Guide */}
      <section id="batting-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium">
              <TrendingUp className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
              {t.modules.superstarBaseballBattingGuide.eyebrow}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['superstarBaseballBattingGuide']} locale={locale}>
                {t.modules.superstarBaseballBattingGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.superstarBaseballBattingGuide.subtitle}
            </p>
          </div>

          {/* Steps */}
          <div className="scroll-reveal space-y-4">
            {t.modules.superstarBaseballBattingGuide.steps.map((step: any, index: number) => (
              <div key={index} className="flex gap-4 p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                  <span className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    <LinkedTitle linkData={moduleLinkMap[`superstarBaseballBattingGuide::steps::${index}`]} locale={locale}>
                      {step.title}
                    </LinkedTitle>
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Module 5: Superstar Baseball Pitching Guide */}
      <section id="pitching-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium">
              <Target className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
              {t.modules.superstarBaseballPitchingGuide.eyebrow}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['superstarBaseballPitchingGuide']} locale={locale}>
                {t.modules.superstarBaseballPitchingGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.superstarBaseballPitchingGuide.subtitle}
            </p>
            <p className="text-muted-foreground text-sm max-w-3xl mx-auto mt-3">
              {t.modules.superstarBaseballPitchingGuide.intro}
            </p>
          </div>

          {/* Pitch Type Cards */}
          <div className="scroll-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.modules.superstarBaseballPitchingGuide.items.map((item: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)] transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-base">{item.title}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] font-mono font-semibold whitespace-nowrap">
                    {item.stat}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                <ul className="space-y-1.5">
                  {item.highlights.map((hl: string, hi: number) => (
                    <li key={hi} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      {hl}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 6: Superstar Baseball Spins Guide */}
      <section id="spins-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium">
              <RotateCcw className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
              {t.modules.superstarBaseballSpinsGuide.eyebrow}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['superstarBaseballSpinsGuide']} locale={locale}>
                {t.modules.superstarBaseballSpinsGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.superstarBaseballSpinsGuide.subtitle}
            </p>
            <p className="text-muted-foreground text-sm max-w-3xl mx-auto mt-3">
              {t.modules.superstarBaseballSpinsGuide.intro}
            </p>
          </div>

          {/* Spin Type Cards */}
          <div className="scroll-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.modules.superstarBaseballSpinsGuide.items.map((item: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)] transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-base">{item.title}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] font-semibold whitespace-nowrap">
                    {item.stat}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                <ul className="space-y-1.5">
                  {item.highlights.map((hl: string, hi: number) => (
                    <li key={hi} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      {hl}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: Superstar Baseball Offensive Styles */}
      <section id="offensive-styles" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium">
              <Swords className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
              {t.modules.superstarBaseballOffensiveStyles.eyebrow}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['superstarBaseballOffensiveStyles']} locale={locale}>
                {t.modules.superstarBaseballOffensiveStyles.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.superstarBaseballOffensiveStyles.subtitle}
            </p>
          </div>

          {/* Tier Grid */}
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-5">
            {t.modules.superstarBaseballOffensiveStyles.tiers.map((tier: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)] transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black border-2 flex-shrink-0 ${
                    tier.tier === 'S' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                    : tier.tier === 'A' ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                    : tier.tier === 'B' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                    : 'bg-slate-500/20 border-slate-500/50 text-slate-400'
                  }`}>
                    {tier.tier}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{tier.label}</h3>
                    <span className="text-sm text-[hsl(var(--nav-theme-light))] font-mono font-semibold">{tier.chance} chance</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{tier.summary}</p>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Best for</p>
                  <ul className="space-y-1.5">
                    {tier.bestFor.map((bf: string, bi: number) => (
                      <li key={bi} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        {bf}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 8: Superstar Baseball Defensive Styles */}
      <section id="defensive-styles" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium">
              <Shield className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
              {t.modules.superstarBaseballDefensiveStyles.eyebrow}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['superstarBaseballDefensiveStyles']} locale={locale}>
                {t.modules.superstarBaseballDefensiveStyles.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.superstarBaseballDefensiveStyles.subtitle}
            </p>
          </div>

          {/* Tier Grid */}
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-5">
            {t.modules.superstarBaseballDefensiveStyles.tiers.map((tier: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)] transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black border-2 flex-shrink-0 ${
                    tier.tier === 'S' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                    : tier.tier === 'A' ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                    : tier.tier === 'B' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                    : 'bg-slate-500/20 border-slate-500/50 text-slate-400'
                  }`}>
                    {tier.tier}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{tier.label}</h3>
                    <span className="text-sm text-[hsl(var(--nav-theme-light))] font-mono font-semibold">{tier.chance} chance</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{tier.summary}</p>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Best for</p>
                  <ul className="space-y-1.5">
                    {tier.bestFor.map((bf: string, bi: number) => (
                      <li key={bi} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        {bf}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 9: Superstar Baseball How to Hit Home Runs */}
      <section id="how-to-hit-home-runs" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium">
              <Trophy className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
              {t.modules.superstarBaseballHowToHitHomeRuns.eyebrow}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['superstarBaseballHowToHitHomeRuns']} locale={locale}>
                {t.modules.superstarBaseballHowToHitHomeRuns.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.superstarBaseballHowToHitHomeRuns.subtitle}
            </p>
            <p className="text-muted-foreground text-sm max-w-3xl mx-auto mt-3">
              {t.modules.superstarBaseballHowToHitHomeRuns.intro}
            </p>
          </div>

          {/* Steps */}
          <div className="scroll-reveal space-y-4">
            {t.modules.superstarBaseballHowToHitHomeRuns.steps.map((step: any, index: number) => (
              <div key={index} className="flex gap-4 p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                  <span className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    <LinkedTitle linkData={moduleLinkMap[`superstarBaseballHowToHitHomeRuns::steps::${index}`]} locale={locale}>
                      {step.title}
                    </LinkedTitle>
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 10: Superstar Baseball Fielding Guide */}
      <section id="fielding-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium">
              <Hand className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
              {t.modules.superstarBaseballFieldingGuide.eyebrow}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['superstarBaseballFieldingGuide']} locale={locale}>
                {t.modules.superstarBaseballFieldingGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.superstarBaseballFieldingGuide.subtitle}
            </p>
            <p className="text-muted-foreground text-sm max-w-3xl mx-auto mt-3">
              {t.modules.superstarBaseballFieldingGuide.intro}
            </p>
          </div>

          {/* Steps */}
          <div className="scroll-reveal space-y-4">
            {t.modules.superstarBaseballFieldingGuide.steps.map((step: any, index: number) => (
              <div key={index} className="flex gap-4 p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                  <span className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    <LinkedTitle linkData={moduleLinkMap[`superstarBaseballFieldingGuide::steps::${index}`]} locale={locale}>
                      {step.title}
                    </LinkedTitle>
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 11: Superstar Baseball Best Pitch Types */}
      <section id="best-pitch-types" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium">
              <Activity className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
              {t.modules.superstarBaseballBestPitchTypes.eyebrow}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['superstarBaseballBestPitchTypes']} locale={locale}>
                {t.modules.superstarBaseballBestPitchTypes.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.superstarBaseballBestPitchTypes.subtitle}
            </p>
            <p className="text-muted-foreground text-sm max-w-3xl mx-auto mt-3">
              {t.modules.superstarBaseballBestPitchTypes.intro}
            </p>
          </div>

          {/* Pitch Types Comparison Table */}
          <div className="scroll-reveal overflow-x-auto mb-10">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border bg-[hsl(var(--nav-theme)/0.05)]">
                  <th className="text-left p-4 text-sm font-semibold text-[hsl(var(--nav-theme-light))]">{t.modules.superstarBaseballBestPitchTypes.tableHeaders.pitch}</th>
                  <th className="text-left p-4 text-sm font-semibold text-[hsl(var(--nav-theme-light))]">{t.modules.superstarBaseballBestPitchTypes.tableHeaders.speedRange}</th>
                  <th className="text-left p-4 text-sm font-semibold text-[hsl(var(--nav-theme-light))] hidden sm:table-cell">{t.modules.superstarBaseballBestPitchTypes.tableHeaders.movement}</th>
                  <th className="text-left p-4 text-sm font-semibold text-[hsl(var(--nav-theme-light))]">{t.modules.superstarBaseballBestPitchTypes.tableHeaders.bestFor}</th>
                  <th className="text-left p-4 text-sm font-semibold text-[hsl(var(--nav-theme-light))] hidden md:table-cell">{t.modules.superstarBaseballBestPitchTypes.tableHeaders.difficulty}</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.superstarBaseballBestPitchTypes.pitchRows.map((row: any, index: number) => (
                  <tr key={index} className={`border-b border-border hover:bg-white/5 transition-colors ${index % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                    <td className="p-4 font-bold text-sm text-[hsl(var(--nav-theme-light))]">{row.pitch}</td>
                    <td className="p-4">
                      <kbd className="px-2 py-1 rounded bg-white/10 border border-border text-xs font-mono font-semibold">{row.speedRange}</kbd>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground hidden sm:table-cell">{row.movement}</td>
                    <td className="p-4 text-sm text-muted-foreground">{row.bestFor}</td>
                    <td className="p-4 hidden md:table-cell">
                      <span className={`text-xs px-2 py-1 rounded-full border ${
                        row.difficulty === 'Low'
                          ? 'bg-green-500/10 border-green-500/30 text-green-400'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      }`}>{row.difficulty}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pitch Selection Tips */}
          <div className="scroll-reveal p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-lg">{t.modules.superstarBaseballBestPitchTypes.notesTitle}</h3>
            </div>
            <ul className="space-y-3">
              {t.modules.superstarBaseballBestPitchTypes.notes.map((note: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Module 12: Superstar Baseball How to Get More Spins */}
      <section id="how-to-get-more-spins" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium">
              <Gift className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
              {t.modules.superstarBaseballHowToGetMoreSpins.eyebrow}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['superstarBaseballHowToGetMoreSpins']} locale={locale}>
                {t.modules.superstarBaseballHowToGetMoreSpins.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.superstarBaseballHowToGetMoreSpins.subtitle}
            </p>
            <p className="text-muted-foreground text-sm max-w-3xl mx-auto mt-3">
              {t.modules.superstarBaseballHowToGetMoreSpins.intro}
            </p>
          </div>

          {/* Checklist Items */}
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.superstarBaseballHowToGetMoreSpins.items.map((item: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)] transition-all duration-300">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.4)] flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                  </div>
                  <h3 className="font-bold text-base leading-snug">{item.label}</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-11">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 13: Superstar Baseball Coins Guide */}
      <section id="coins-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium">
              <Star className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
              {t.modules.superstarBaseballCoinsGuide.eyebrow}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['superstarBaseballCoinsGuide']} locale={locale}>
                {t.modules.superstarBaseballCoinsGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.superstarBaseballCoinsGuide.subtitle}
            </p>
            <p className="text-muted-foreground text-sm max-w-3xl mx-auto mt-3">
              {t.modules.superstarBaseballCoinsGuide.intro}
            </p>
          </div>

          {/* Coins Guide Cards */}
          <div className="scroll-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.modules.superstarBaseballCoinsGuide.items.map((item: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)] transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.3)] flex items-center justify-center">
                    <Star className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                  </div>
                  <h3 className="font-bold text-base">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                <ul className="space-y-1.5">
                  {item.highlights.map((hl: string, hi: number) => (
                    <li key={hi} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      {hl}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 14: Superstar Baseball Roles Guide */}
      <section id="roles-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium">
              <Users className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
              {t.modules.superstarBaseballRolesGuide.eyebrow}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['superstarBaseballRolesGuide']} locale={locale}>
                {t.modules.superstarBaseballRolesGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.superstarBaseballRolesGuide.subtitle}
            </p>
            <p className="text-muted-foreground text-sm max-w-3xl mx-auto mt-3">
              {t.modules.superstarBaseballRolesGuide.intro}
            </p>
          </div>

          {/* Roles Cards */}
          <div className="scroll-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.modules.superstarBaseballRolesGuide.items.map((item: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)] transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.3)] flex items-center justify-center">
                    <Users className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                  </div>
                  <h3 className="font-bold text-base">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                <ul className="space-y-1.5">
                  {item.highlights.map((hl: string, hi: number) => (
                    <li key={hi} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      {hl}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 15: Superstar Baseball 7v7 Match Guide */}
      <MatchGuideSection t={t} moduleLinkMap={moduleLinkMap} locale={locale} />

      {/* Module 16: Superstar Baseball Solo Queue Tips */}
      <section id="solo-queue-tips" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium">
              <ClipboardCheck className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
              {t.modules.superstarBaseballSoloQueueTips.eyebrow}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['superstarBaseballSoloQueueTips']} locale={locale}>
                {t.modules.superstarBaseballSoloQueueTips.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.superstarBaseballSoloQueueTips.subtitle}
            </p>
            <p className="text-muted-foreground text-sm max-w-3xl mx-auto mt-3">
              {t.modules.superstarBaseballSoloQueueTips.intro}
            </p>
          </div>

          {/* Solo Queue Checklist */}
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.superstarBaseballSoloQueueTips.items.map((item: any, index: number) => (
              <div key={index} className="flex items-start gap-3 p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)] transition-all duration-300">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.4)] flex items-center justify-center mt-0.5">
                  <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))]" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">{t.footer.description}</p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/invite/zDSNPg33Pj"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/communities/10302151/Metavision"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/games/101432174163538/Superstar-Baseball"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t.footer.copyright}</p>
              <p className="text-xs text-muted-foreground">{t.footer.disclaimer}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
