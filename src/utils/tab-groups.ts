import browser from 'webextension-polyfill'

interface TabGroupOptions {
	title?: string
	color?: 'Blue'
}

export async function openUrlsInTabGroup(
	urls: string[],
	options: TabGroupOptions = {}
): Promise<void> {
	try {
		if (!browser.tabs || typeof (browser.tabs as any).group !== 'function') {
			for (const url of urls) {
				await browser.tabs.create({ url, active: false })
			}
			return
		}

		const tabs: browser.Tabs.Tab[] = []

		for (const url of urls) {
			const tab = await browser.tabs.create({
				url,
				active: false,
			})
			if (tab.id) {
				tabs.push(tab)
			}
		}

        if (tabs.length > 0 && tabs.every(tab => tab.id)) {
			const tabIds = tabs.map(tab => tab.id).filter((id): id is number => typeof id === 'number')
			
			const groupId = await (browser.tabs as any).group({
				tabIds: tabIds
			})

			if (typeof (browser.tabGroups as any)?.update === 'function') {
				await (browser.tabGroups as any).update(groupId, {
					title: options.title || 'Bookmarks',
					color: options.color || 'blue'
				})
			}

			if (tabs[0]?.id) {
				await browser.tabs.update(tabs[0].id, { active: true })
			}
		}
	} catch (error) {
		console.error('Error creating tab group:', error)
		for (const url of urls) {
			await browser.tabs.create({ url, active: false })
		}
	}
}

export async function openBookmarkFolderInTabGroup(
	bookmarks: Array<{ url: string; title?: string }>,
	folderTitle?: string
): Promise<void> {
	const urls = bookmarks.map(bookmark => bookmark.url).filter(Boolean)
	if (urls.length > 0) {
		await openUrlsInTabGroup(urls, {
			title: folderTitle || 'Bookmark Folder',
			color: 'Blue'
		})
	}
}
