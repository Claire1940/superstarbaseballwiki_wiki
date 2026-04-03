import type { LucideIcon } from 'lucide-react'
import { BookOpen, Tag, Gamepad2, Target, Wind, Sparkles, Shield, Bell } from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'codes' -> t('nav.codes')
	path: string // URL 路径，如 '/codes'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'guide', path: '/guide', icon: BookOpen, isContentType: true },
	{ key: 'codes', path: '/codes', icon: Tag, isContentType: true },
	{ key: 'roblox', path: '/roblox', icon: Gamepad2, isContentType: true },
	{ key: 'hitting', path: '/hitting', icon: Target, isContentType: true },
	{ key: 'pitching', path: '/pitching', icon: Wind, isContentType: true },
	{ key: 'styles', path: '/styles', icon: Sparkles, isContentType: true },
	{ key: 'fielding', path: '/fielding', icon: Shield, isContentType: true },
	{ key: 'updates', path: '/updates', icon: Bell, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/' -> []

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
