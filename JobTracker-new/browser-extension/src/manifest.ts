import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
  manifest_version: 3,
  name: 'JobTracker Capture Assistant',
  version: '0.1.0',
  description: 'Capture, sync, and enrich job applications directly from the web.',
  action: {
    default_popup: 'popup.html',
    default_title: 'JobTracker'
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module'
  },
  permissions: ['storage', 'activeTab', 'scripting', 'tabs'],
  host_permissions: ['<all_urls>'],
  icons: {
    '16': 'icons/icon16.png',
    '32': 'icons/icon32.png',
    '48': 'icons/icon48.png',
    '128': 'icons/icon128.png'
  },
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['src/content/index.ts'],
      run_at: 'document_idle'
    }
  ],
  web_accessible_resources: [
    {
      resources: ['assets/*'],
      matches: ['<all_urls>']
    }
  ]
});
