import Analytics from '../src/analytics'
import { setToStorage } from '../src/common/storage'

export default defineBackground(() => {
	console.log('New Tab Background Script Loaded')
	browser.runtime.onInstalled.addListener(async (details) => {
		if (details.reason === 'install') {
			await setToStorage('showWelcomeModal', true)

			const manifest = browser.runtime.getManifest()

			Analytics.featureUsed('Installed', {
				version: manifest.version,
			})
		} else if (details.reason === 'update') {
			// Track update event
			const manifest = browser.runtime.getManifest()
			const previousVersion = details.previousVersion || 'unknown'

			Analytics.featureUsed('Updated', {
				version: manifest.version,
				previousVersion,
			})
		}
	})

	browser.runtime.onStartup.addListener(() => {
		// Track extension startup
		Analytics.featureUsed('Startup')
	})
})
