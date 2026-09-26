// The third named project is an additional portfolio record; existing records stay intact.
if (Array.isArray(window.SPF_PROJECTS) && !window.SPF_PROJECTS.some(item => item.id === 'I34')) {
  window.SPF_PROJECTS.push({
    id: 'I34', status: 'inventory', statusLabel: 'محل متابعة',
    title: 'مشروع تطوير مركز الاتصال', description: 'مشروع تطوير مركز الاتصال.',
    owner: 'المديرية العامة لخدمات المتعاملين', horizon: '', impact: 'تطوير مركز الاتصال', document: ''
  });
}
