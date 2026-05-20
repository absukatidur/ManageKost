// ─── DASHBOARD PAGE ───
async function renderDashboard() {
  const data = await api('/dashboard');
  const s = data.stats;
  const el = document.getElementById('page-content');
  el.innerHTML = '';
  const page = cloneTpl('tpl-dashboard-page');

  // Date text
  page.querySelector('[data-bind="dateText"]').textContent =
    new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + ' · Data dari database';

  // Navigation actions
  page.querySelector('[data-action="create-order"]').onclick = () => navigate('order');
  page.querySelector('[data-action="view-orders"]').onclick = () => navigate('order');
  page.querySelector('[data-action="view-rooms"]').onclick = () => navigate('manajemen-kamar');

  // Stat cards
  const statsSlot = page.querySelector('[data-slot="stats"]');
  [
    { icon: 'door-open', cls: 'ic-blue', label: 'Kamar Kosong', value: s.empty, sub: 'Siap disewa' },
    { icon: 'check-circle', cls: 'ic-green', label: 'Kamar Terisi', value: s.occupied, sub: `dari ${s.totalRooms} kamar` },
    { icon: 'wrench', cls: 'ic-red', label: 'Perbaikan', value: s.maintenance, sub: 'Dalam proses' },
    { icon: 'banknote', cls: 'ic-green', label: 'Total Pendapatan', value: fmtRupiah(s.totalRev), sub: 'Bulan ini', small: true },
    { icon: 'clock', cls: 'ic-amber', label: 'Invoice Pending', value: fmtRupiah(s.pendingInv), sub: `${s.pendingOrders} invoice`, small: true },
  ].forEach(sd => {
    const card = cloneTpl('tpl-stat-card');
    card.querySelector('.icon-wrap').classList.add(sd.cls);
    card.querySelector('.icon-wrap i').setAttribute('data-lucide', sd.icon);
    card.querySelector('.label').textContent = sd.label;
    const v = card.querySelector('.value');
    v.textContent = sd.value;
    if (sd.small) v.style.fontSize = '18px';
    card.querySelector('.sub').textContent = sd.sub;
    statsSlot.appendChild(card);
  });

  // Chart bars
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul'];
  const revData = [12, 18, 14, 22, 19, 25, 28];
  const maxRev = Math.max(...revData);
  const chartSlot = page.querySelector('[data-slot="chart"]');
  revData.forEach((v, i) => {
    const bar = cloneTpl('tpl-chart-bar');
    bar.querySelector('.chart-bar').style.height = Math.round(v / maxRev * 100) + '%';
    bar.querySelector('.chart-bar').title = fmtRupiah(v * 1000000);
    bar.querySelector('.chart-bar-label').textContent = months[i];
    chartSlot.appendChild(bar);
  });

  // Recent orders
  const ordersSlot = page.querySelector('[data-slot="recent-orders"]');
  data.recentOrders.forEach(o => {
    const row = cloneTpl('tpl-recent-order-row');
    row.querySelector('.ro-customer').textContent = o.customer;
    row.querySelector('.ro-id').textContent = o.id;
    row.querySelector('.ro-room').textContent = o.room;
    row.querySelector('.ro-status').innerHTML = statusBadge(o.status);
    ordersSlot.appendChild(row);
  });

  // Activity log
  const icons = { order: 'file-text', room: 'door-open', customer: 'user', invoice: 'send', repair: 'wrench' };
  const colors = { order: 'ic-blue', room: 'ic-green', customer: 'ic-purple', invoice: 'ic-amber', repair: 'ic-red' };
  const logsSlot = page.querySelector('[data-slot="recent-logs"]');
  data.recentLogs.slice(0, 5).forEach(l => {
    const item = cloneTpl('tpl-activity-item');
    item.querySelector('.act-dot').classList.add(colors[l.type] || 'ic-gray');
    item.querySelector('.act-dot i').setAttribute('data-lucide', icons[l.type] || 'circle');
    item.querySelector('.act-title').textContent = l.action;
    item.querySelector('.act-detail').textContent = l.detail;
    item.querySelector('.act-time').textContent = l.time;
    logsSlot.appendChild(item);
  });

  // Legend
  const legendSlot = page.querySelector('[data-slot="legend"]');
  [
    { color: 'var(--green-400)', text: `Terisi (${s.occupied})` },
    { color: 'var(--blue-400)', text: `Kosong (${s.empty})` },
    { color: 'var(--red-400)', text: `Perbaikan (${s.maintenance})` },
  ].forEach(ld => {
    const li = cloneTpl('tpl-legend-item');
    li.querySelector('.legend-dot').style.background = ld.color;
    li.querySelector('.legend-text').textContent = ld.text;
    legendSlot.appendChild(li);
  });

  // Room overview grid
  const roomSlot = page.querySelector('[data-slot="room-overview"]');
  data.rooms.forEach(r => {
    const cell = cloneTpl('tpl-room-cell');
    cell.classList.add(r.status);
    cell.querySelector('.room-num').textContent = r.id;
    cell.querySelector('.room-type').textContent = r.type;
    cell.onclick = () => showRoomDetail(r.id);
    roomSlot.appendChild(cell);
  });

  el.appendChild(page);
}
