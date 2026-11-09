import { initCommon, initForm, mountStage, $, $$ } from './common.js';
initCommon({ introMs: 3300 });
const form = $('#qform');
initForm(form, d => `Hi Sultan Barber, I found your sample website and I'd like to ask for a time.\nName: ${d.name}\nPreferred time: ${d.area || '-'}\nService: ${d.service || '-'}\nNotes: ${d.details}`);
// menu list buttons mirror the form pick buttons
$$('.menu button').forEach(b => b.addEventListener('click', () => {
  const t = $(`.pick [data-pick="${b.dataset.pick}"]`); t.click(); const on = t.getAttribute('aria-pressed') === 'true'; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
}));
$$('.pick button').forEach(b => b.addEventListener('click', () => { const m = $(`.menu [data-pick="${b.dataset.pick}"]`); const on = b.getAttribute('aria-pressed') === 'true'; m.classList.toggle('on', on); m.setAttribute('aria-pressed', on); }));
import('./scene.js').then(m => mountStage($('#pole'), m.default, { cam: [0, .5, 13], fov: 32, slider: '#spin' })).catch(() => $('#pole').classList.add('nogl'));
