const STORAGE_KEY = 'phdc_auction_data';
const BACKUP_WARNING_DAYS = 7;
const ITEM_LIST_ROWS_PER_PAGE = 18;
const DATE_FORMAT = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
const TIME_FORMAT = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });
const MODAL_FOCUS_SELECTOR = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ');

const ui = {
  activeView: 'overview',
  selectedDocumentType: 'bidSheet',
  selectedLayoutBlockId: null,
  dragState: null,
  csvImport: null,
  modal: null,
  storageError: ''
};

const SAMPLE_DONOR_ROWS = [
  ['Nina Lopez', 'Mission Books', 'nina@missionbooks.example', '415-555-0101', '214 Valencia St', 'Can provide logo art if needed'],
  ['Daniel Wu', 'Bay Ceramics Studio', 'daniel@bayceramics.example', '415-555-0102', '85 14th St', 'Prefers a mailed thank-you letter'],
  ['Priya Shah', 'Marina Bistro', 'priya@marinabistro.example', '415-555-0103', '500 Chestnut St', 'Gift certificate expires in one year']
];

const SAMPLE_ITEM_ROWS = [
  ['101', 'Signed cookbook set', 'Three signed cookbooks from local chefs.', 'Mission Books', 'Books', '80', '25', '5', ''],
  ['102', 'Private wheel-throwing lesson', 'Two-hour pottery lesson for two people.', 'Bay Ceramics Studio', 'Art', '140', '50', '10', ''],
  ['103', 'Dinner for four', 'Chef tasting menu with wine pairing.', 'Marina Bistro', 'Dining', '220', '80', '10', '300']
];

function defaultThankYouBody() {
  return [
    'Dear {DONOR_NAME},',
    '',
    'Thank you for supporting {EVENT_NAME}.',
    '',
    'We are grateful for the following donation(s):',
    '{ITEM_LIST}',
    '',
    'Estimated total value: {TOTAL_VALUE}',
    '',
    'With appreciation,',
    '{SIGNER_NAME}'
  ].join('\n');
}

function dateInputValueDaysFromNow(days) {
  const value = new Date();
  value.setDate(value.getDate() + days);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function createSampleAuctionState() {
  const base = createDefaultState();
  const donors = SAMPLE_DONOR_ROWS.map((row) => ({
    id: generateId(),
    name: row[0],
    business: row[1],
    email: row[2],
    phone: row[3],
    address: row[4],
    notes: row[5]
  }));
  const donorByBusiness = new Map(donors.map((donor) => [donor.business, donor]));
  const items = SAMPLE_ITEM_ROWS.map((row) => ({
    id: generateId(),
    lotNumber: row[0],
    title: row[1],
    description: row[2],
    donorId: donorByBusiness.get(row[3]) ? donorByBusiness.get(row[3]).id : '',
    category: row[4],
    fmv: toMoney(row[5]),
    startingBid: toMoney(row[6]),
    increment: toMoney(row[7]),
    buyNow: toMoney(row[8]),
    status: 'available'
  }));
  const soldItem = items.find((item) => item.lotNumber === '101');
  const winners = soldItem ? [{
    id: generateId(),
    itemId: soldItem.id,
    winnerName: 'Alex Kim',
    paddleNumber: '27',
    winningBid: 55,
    isPaid: false
  }] : [];
  if (soldItem) {
    soldItem.status = 'sold';
  }

  return {
    ...base,
    settings: {
      ...base.settings,
      orgName: 'Neighborhood Arts Council',
      eventName: 'Spring Benefit Auction',
      eventDate: dateInputValueDaysFromNow(60),
      bidSheetHeaderText: 'Sample data for exploring the app. Replace with your own event details.',
      itemListHeaderText: 'Preview how the public-facing item list will look.',
      thankYouHeaderText: 'Thank You for Supporting Our Auction',
      thankYouSignature: 'Maya Hernandez, Auction Chair'
    },
    donors,
    items,
    winners,
    categories: uniqueStrings(items.map((item) => item.category)),
    meta: {
      lastSavedAt: '',
      lastBackupAt: '',
      seedMode: 'sample'
    }
  };
}

function defaultLayouts() {
  return {
    bidSheet: {
      name: 'Bid Sheet',
      blocks: [
        blockField('lotLeft', 'Lot', 'item.lotNumber', { x: 4, y: 3, w: 16, h: 4, showLabel: false, fontSize: 20, fontWeight: 700 }),
        blockField('lotRight', 'Lot', 'item.lotNumber', { x: 80, y: 3, w: 16, h: 4, showLabel: false, fontSize: 20, fontWeight: 700, align: 'right' }),
        blockImage('logo', { x: 39, y: 3, w: 22, h: 10, visible: true }),
        blockField('eventHeading', 'Event heading', 'computed.eventHeading', { x: 18, y: 14, w: 64, h: 5, showLabel: false, fontSize: 22, fontWeight: 700, align: 'center' }),
        blockField('eventDate', 'Event date', 'computed.eventDate', { x: 24, y: 20, w: 52, h: 3, showLabel: false, fontSize: 13, align: 'center' }),
        blockField('headerNote', 'Header note', 'settings.bidSheetHeaderText', { x: 16, y: 24, w: 68, h: 4, showLabel: false, fontSize: 12, align: 'center' }),
        blockField('donorInfo', 'Donated by', 'computed.donorBlock', { x: 8, y: 30, w: 84, h: 7, multiline: true }),
        blockField('itemTitle', 'Item title', 'item.title', { x: 8, y: 39, w: 84, h: 6, showLabel: false, fontSize: 26, fontWeight: 700 }),
        blockField('description', 'Description', 'item.description', { x: 8, y: 46, w: 84, h: 13, multiline: true }),
        blockField('fmv', 'Estimated value', 'item.fmv', { x: 8, y: 61, w: 26, h: 6, format: 'currency' }),
        blockField('startingBid', 'Starting bid', 'item.startingBid', { x: 37, y: 61, w: 26, h: 6, format: 'currency' }),
        blockField('increment', 'Minimum increment', 'item.increment', { x: 66, y: 61, w: 26, h: 6, format: 'currency' }),
        blockField('buyNow', 'Buy now', 'item.buyNow', { x: 66, y: 69, w: 26, h: 6, format: 'currency' }),
        blockTable('bidTable', 'Bid table', 'bidTable', { x: 8, y: 70, w: 84, h: 21 }),
        blockField('footerNote', 'Footer note', 'settings.bidSheetFooterText', { x: 12, y: 94, w: 76, h: 3, showLabel: false, fontSize: 12, align: 'center' })
      ]
    },
    itemList: {
      name: 'Item and Donor Price List',
      blocks: [
        blockImage('logo', { x: 38, y: 4, w: 24, h: 12, visible: true }),
        blockField('eventHeading', 'Heading', 'computed.eventHeading', { x: 15, y: 18, w: 70, h: 5, showLabel: false, fontSize: 24, fontWeight: 700, align: 'center' }),
        blockField('eventDate', 'Date', 'computed.eventDate', { x: 24, y: 24, w: 52, h: 3, showLabel: false, fontSize: 13, align: 'center' }),
        blockField('headerNote', 'Header note', 'settings.itemListHeaderText', { x: 10, y: 29, w: 80, h: 4, showLabel: false, fontSize: 12, align: 'center' }),
        blockTable('itemTable', 'Price list table', 'itemTable', { x: 6, y: 35, w: 88, h: 52 }),
        blockField('footerNote', 'Footer note', 'settings.itemListFooterText', { x: 10, y: 90, w: 60, h: 3, showLabel: false, fontSize: 12, align: 'left' }),
        blockField('pageIndicator', 'Page indicator', 'computed.pageIndicator', { x: 72, y: 90, w: 18, h: 3, showLabel: false, fontSize: 12, align: 'right' })
      ]
    },
    thankYou: {
      name: 'Thank-You Letter',
      blocks: [
        blockImage('logo', { x: 38, y: 4, w: 24, h: 12, visible: false }),
        blockField('heading', 'Letter heading', 'settings.thankYouHeaderText', { x: 14, y: 19, w: 72, h: 5, showLabel: false, fontSize: 22, fontWeight: 700, align: 'center' }),
        blockField('donorAddress', 'Mailing block', 'computed.donorAddressBlock', { x: 10, y: 27, w: 44, h: 11, multiline: true, visible: false }),
        blockField('letterBody', 'Letter body', 'computed.thankYouBody', { x: 10, y: 41, w: 80, h: 32, multiline: true, showLabel: false, fontSize: 16 }),
        blockField('signature', 'Signature', 'settings.thankYouSignature', { x: 10, y: 78, w: 40, h: 5, showLabel: false, fontSize: 16 })
      ]
    }
  };
}

function baseBlock(id, label, kind, options = {}) {
  return {
    id,
    label,
    kind,
    x: clampNumber(options.x, 0, 0, 100),
    y: clampNumber(options.y, 0, 0, 100),
    w: clampNumber(options.w, 20, 4, 100),
    h: clampNumber(options.h, 6, 2, 100),
    visible: options.visible !== false,
    showLabel: options.showLabel !== false,
    multiline: options.multiline === true,
    format: options.format || 'text',
    align: options.align || 'left',
    fontSize: clampNumber(options.fontSize, 14, 8, 48),
    fontWeight: clampNumber(options.fontWeight, 500, 400, 800)
  };
}

function blockField(id, label, source, options = {}) {
  return { ...baseBlock(id, label, 'field', options), source };
}

function blockText(id, label, text, options = {}) {
  return { ...baseBlock(id, label, 'text', options), text };
}

function blockImage(id, options = {}) {
  return { ...baseBlock(id, 'Logo', 'image', options), showLabel: false };
}

function blockTable(id, label, tableType, options = {}) {
  return { ...baseBlock(id, label, 'table', options), tableType, showLabel: false };
}

function createDefaultState() {
  return {
    settings: {
      orgName: '',
      eventName: '',
      eventDate: '',
      logo: null,
      bidLineCount: 10,
      bidSheetHeaderText: '',
      bidSheetFooterText: '',
      itemListHeaderText: '',
      itemListFooterText: '',
      thankYouHeaderText: '',
      thankYouBodyText: defaultThankYouBody(),
      thankYouSignature: '',
      layouts: defaultLayouts()
    },
    donors: [],
    items: [],
    winners: [],
    categories: [],
    meta: {
      lastSavedAt: '',
      lastBackupAt: '',
      seedMode: 'blank'
    }
  };
}

function toText(value) {
  return typeof value === 'string' ? value : '';
}

function toMoney(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function clampNumber(value, fallback, min, max) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, parsed));
}

function normalizeBlock(block) {
  if (!block || typeof block !== 'object') {
    return null;
  }
  if (block.kind === 'image') {
    return blockImage(block.id || generateId(), {
      x: block.x,
      y: block.y,
      w: block.w,
      h: block.h,
      visible: block.visible
    });
  }
  if (block.kind === 'table') {
    return blockTable(block.id || generateId(), toText(block.label) || 'Table', toText(block.tableType) || 'itemTable', block);
  }
  if (block.kind === 'text') {
    return blockText(block.id || generateId(), toText(block.label) || 'Text', toText(block.text), block);
  }
  return blockField(block.id || generateId(), toText(block.label) || 'Field', toText(block.source), block);
}

function cloneBlock(block) {
  return { ...block };
}

function isLegacyItemListFooterBlock(block) {
  return block.id === 'footerNote'
    && block.x === 10
    && block.y === 90
    && block.w === 80
    && block.h === 3
    && block.align === 'center';
}

function mergeLayoutBlocks(defaultBlocks, rawBlocks) {
  const defaultIds = new Set(defaultBlocks.map((block) => block.id));
  const rawById = new Map(rawBlocks.map((block) => [block.id, block]));
  const mergedDefaults = defaultBlocks.map((block) => rawById.get(block.id) || cloneBlock(block));
  const extraBlocks = rawBlocks.filter((block) => !defaultIds.has(block.id));
  return [...mergedDefaults, ...extraBlocks];
}

function normalizeLayouts(rawLayouts) {
  const defaults = defaultLayouts();
  const safeLayouts = {};

  Object.keys(defaults).forEach((key) => {
    const rawLayout = rawLayouts && typeof rawLayouts[key] === 'object' ? rawLayouts[key] : null;
    const rawBlocks = rawLayout && Array.isArray(rawLayout.blocks)
      ? rawLayout.blocks.map(normalizeBlock).filter(Boolean)
      : [];
    const migratedBlocks = key === 'itemList'
      ? rawBlocks.map((block) => (isLegacyItemListFooterBlock(block)
        ? cloneBlock(defaults.itemList.blocks.find((defaultBlock) => defaultBlock.id === 'footerNote'))
        : block))
      : rawBlocks;
    safeLayouts[key] = {
      name: defaults[key].name,
      blocks: migratedBlocks.length
        ? mergeLayoutBlocks(defaults[key].blocks.map(cloneBlock), migratedBlocks)
        : defaults[key].blocks.map(cloneBlock)
    };
  });

  return safeLayouts;
}

function normalizeState(raw) {
  const base = createDefaultState();
  if (!raw || typeof raw !== 'object') {
    return base;
  }

  const settings = raw.settings && typeof raw.settings === 'object' ? raw.settings : {};
  const legacyBidSheet = settings.bidSheet && typeof settings.bidSheet === 'object' ? settings.bidSheet : {};

  const donorList = Array.isArray(raw.donors) ? raw.donors : [];
  const itemList = Array.isArray(raw.items) ? raw.items : [];
  const winnerList = Array.isArray(raw.winners) ? raw.winners : [];
  const rawSeedMode = toText(raw.meta && raw.meta.seedMode);
  const seedMode = rawSeedMode === 'sample'
    ? 'sample'
    : rawSeedMode === 'blank'
      ? 'blank'
      : (donorList.length || itemList.length || winnerList.length ? 'user' : 'blank');

  return {
    settings: {
      orgName: toText(settings.orgName),
      eventName: toText(settings.eventName),
      eventDate: toText(settings.eventDate),
      logo: typeof settings.logo === 'string' ? settings.logo : null,
      bidLineCount: clampNumber(settings.bidLineCount ?? legacyBidSheet.lineCount, 10, 6, 30),
      bidSheetHeaderText: toText(settings.bidSheetHeaderText || legacyBidSheet.headerText),
      bidSheetFooterText: toText(settings.bidSheetFooterText || legacyBidSheet.footer || legacyBidSheet.footerText),
      itemListHeaderText: toText(settings.itemListHeaderText || (settings.listPrint && settings.listPrint.headerText)),
      itemListFooterText: toText(settings.itemListFooterText || (settings.listPrint && settings.listPrint.footerText)),
      thankYouHeaderText: toText(settings.thankYouHeaderText || (settings.thankYou && settings.thankYou.headerText)),
      thankYouBodyText: toText(settings.thankYouBodyText || settings.thankYouTemplate || (settings.thankYou && settings.thankYou.template)) || defaultThankYouBody(),
      thankYouSignature: toText(settings.thankYouSignature || (settings.thankYou && settings.thankYou.signatureName)),
      layouts: normalizeLayouts(settings.layouts)
    },
    donors: donorList.map((donor) => ({
      id: toText(donor.id) || generateId(),
      name: toText(donor.name),
      business: toText(donor.business),
      email: toText(donor.email),
      phone: toText(donor.phone),
      address: toText(donor.address),
      notes: toText(donor.notes)
    })),
    items: itemList.map((item) => ({
      id: toText(item.id) || generateId(),
      lotNumber: toText(item.lotNumber),
      title: toText(item.title),
      description: toText(item.description),
      donorId: toText(item.donorId),
      category: toText(item.category),
      fmv: toMoney(item.fmv),
      startingBid: toMoney(item.startingBid),
      increment: toMoney(item.increment),
      buyNow: toMoney(item.buyNow),
      status: toText(item.status) === 'sold' ? 'sold' : 'available'
    })),
    winners: winnerList.map((winner) => ({
      id: toText(winner.id) || generateId(),
      itemId: toText(winner.itemId),
      winnerName: toText(winner.winnerName),
      paddleNumber: toText(winner.paddleNumber),
      winningBid: toMoney(winner.winningBid) || 0,
      isPaid: winner.isPaid === true
    })),
    categories: uniqueStrings(Array.isArray(raw.categories) ? raw.categories : []),
    meta: {
      lastSavedAt: toText(raw.meta && raw.meta.lastSavedAt),
      lastBackupAt: toText(raw.meta && raw.meta.lastBackupAt),
      seedMode
    }
  };
}

function uniqueStrings(values) {
  return Array.from(new Set(values.map((value) => toText(value).trim()).filter(Boolean)))
    .sort((left, right) => left.localeCompare(right, undefined, { sensitivity: 'base' }));
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? normalizeState(JSON.parse(saved)) : createSampleAuctionState();
  } catch (error) {
    return createDefaultState();
  }
}

let state = loadState();
let saveTimer = null;
let pendingSave = null;

function persistState(message, options = {}) {
  const { skipRender = false, preserveSeedMode = false } = options;
  if (!preserveSeedMode && state.meta.seedMode === 'sample') {
    state.meta.seedMode = 'user';
  }
  state.meta.lastSavedAt = new Date().toISOString();

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    ui.storageError = '';
    if (!skipRender) {
      renderSaveStatus(message || 'Saved');
      renderSidebar();
      renderBannerFromState();
    }
    return true;
  } catch (error) {
    const isQuotaError = error && (
      error.name === 'QuotaExceededError'
      || error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
      || error.code === 22
      || error.code === 1014
    );
    ui.storageError = isQuotaError
      ? 'Storage full. Download a backup and remove the logo or older data to free space.'
      : 'This browser could not save the latest change locally.';
    if (!skipRender) {
      renderSaveStatus('Save failed');
      showBanner('error', ui.storageError);
    }
    return false;
  }
}

function flushPendingSave(overrideOptions = {}) {
  if (saveTimer) {
    clearTimeout(saveTimer);
    const pending = pendingSave;
    saveTimer = null;
    pendingSave = null;
    return persistState(pending.message, { ...pending.options, ...overrideOptions });
  }
  return false;
}

function saveState(message, options = {}) {
  clearTimeout(saveTimer);
  pendingSave = { message, options };
  saveTimer = setTimeout(() => {
    saveTimer = null;
    pendingSave = null;
    persistState(message, options);
  }, 140);
}

function generateId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  return `${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-5)}`;
}

function formatCurrency(value) {
  if (value === null || value === undefined || value === '') {
    return '';
  }
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return '';
  }
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(amount);
}

function formatDate(value) {
  if (!value) {
    return '';
  }
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? value : DATE_FORMAT.format(parsed);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeComparable(value) {
  return toText(value).trim().toLowerCase();
}

function donorLabelFromRecord(donor) {
  if (!donor) {
    return '';
  }
  if (donor.business && donor.name) {
    return `${donor.business} (${donor.name})`;
  }
  return donor.business || donor.name;
}

function donorLookup() {
  return new Map(state.donors.map((donor) => [donor.id, donor]));
}

function donorLabel(donorId, donorsById = null) {
  const donor = donorsById ? donorsById.get(donorId) : state.donors.find((entry) => entry.id === donorId);
  return donorLabelFromRecord(donor);
}

function donorAddress(donorId) {
  const donor = state.donors.find((entry) => entry.id === donorId);
  return donor ? donor.address : '';
}

function itemCountsByDonor() {
  const counts = new Map();
  state.items.forEach((item) => {
    if (!item.donorId) {
      return;
    }
    counts.set(item.donorId, (counts.get(item.donorId) || 0) + 1);
  });
  return counts;
}

function countItemsForDonor(donorId, counts = null) {
  if (counts) {
    return counts.get(donorId) || 0;
  }
  return state.items.filter((item) => item.donorId === donorId).length;
}

function duplicateLots() {
  const map = new Map();
  state.items.forEach((item) => {
    const key = normalizeComparable(item.lotNumber);
    if (!key) {
      return;
    }
    map.set(key, (map.get(key) || 0) + 1);
  });
  return Array.from(map.entries()).filter(([, count]) => count > 1).map(([lot]) => lot);
}

function hasData() {
  return state.donors.length > 0 || state.items.length > 0 || state.winners.length > 0;
}

function isSampleMode() {
  return state.meta.seedMode === 'sample';
}

function renderSaveStatus(message) {
  const savedAt = state.meta.lastSavedAt ? TIME_FORMAT.format(new Date(state.meta.lastSavedAt)) : '';
  document.getElementById('saveStatus').textContent = savedAt ? `${message} at ${savedAt}` : message;
}

function showBanner(type, message, actions = []) {
  const banner = document.getElementById('banner');
  banner.hidden = false;
  banner.className = `banner ${type}`;
  banner.replaceChildren();

  const content = document.createElement('div');
  content.className = 'banner__content';

  const text = document.createElement('div');
  text.className = 'banner__message';
  text.textContent = message;
  content.append(text);

  if (actions.length) {
    const row = document.createElement('div');
    row.className = 'button-row banner__actions';
    actions.forEach((action) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = action.primary ? 'button button--primary button--small' : 'button button--small';
      button.dataset.onboardingAction = action.action;
      button.textContent = action.label;
      row.append(button);
    });
    content.append(row);
  }

  banner.append(content);
}

function clearBanner() {
  const banner = document.getElementById('banner');
  banner.hidden = true;
  banner.className = 'banner';
  banner.replaceChildren();
}

function renderBannerFromState() {
  if (ui.storageError) {
    showBanner('error', ui.storageError);
    return;
  }

  if (isSampleMode()) {
    showBanner(
      'success',
      'You are looking at sample auction data. Explore freely, then start with a blank auction before importing your real event.',
      [
        { action: 'start-blank', label: 'Start blank auction', primary: true },
        { action: 'jump-data', label: 'Open data tools' }
      ]
    );
    return;
  }

  const staleBackup = state.meta.lastBackupAt
    ? Math.floor((Date.now() - new Date(state.meta.lastBackupAt).getTime()) / (1000 * 60 * 60 * 24)) >= BACKUP_WARNING_DAYS
    : false;

  if (hasData() && !state.meta.lastBackupAt) {
    showBanner('warning', 'This browser is saving automatically, but you have not downloaded a backup yet.');
    return;
  }

  if (staleBackup) {
    showBanner('warning', 'Your last backup is more than a week old. Download a fresh one before printing or checkout.');
    return;
  }

  clearBanner();
}

function focusableElements(container) {
  return Array.from(container.querySelectorAll(MODAL_FOCUS_SELECTOR))
    .filter((element) => !element.hidden && element.getAttribute('aria-hidden') !== 'true');
}

function openModal(modalId, initialFocusId, trigger = document.activeElement) {
  const modal = document.getElementById(modalId);
  if (!modal) {
    return;
  }
  ui.modal = {
    id: modalId,
    returnFocus: trigger instanceof HTMLElement ? trigger : null
  };
  modal.hidden = false;
  const preferred = initialFocusId ? modal.querySelector(`#${initialFocusId}`) : null;
  const focusTarget = preferred instanceof HTMLElement ? preferred : focusableElements(modal)[0];
  if (focusTarget) {
    focusTarget.focus();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) {
    return;
  }
  modal.hidden = true;
  if (ui.modal && ui.modal.id === modalId) {
    const { returnFocus } = ui.modal;
    ui.modal = null;
    if (returnFocus && returnFocus.isConnected) {
      window.requestAnimationFrame(() => returnFocus.focus());
    }
  }
}

function handleModalKeydown(event) {
  if (!ui.modal) {
    return;
  }

  const modal = document.getElementById(ui.modal.id);
  if (!modal || modal.hidden) {
    return;
  }

  if (event.key === 'Escape') {
    event.preventDefault();
    closeModal(ui.modal.id);
    return;
  }

  if (event.key !== 'Tab') {
    return;
  }

  const focusables = focusableElements(modal);
  if (!focusables.length) {
    event.preventDefault();
    return;
  }

  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (!modal.contains(document.activeElement)) {
    event.preventDefault();
    first.focus();
    return;
  }
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
    return;
  }
  if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function switchView(view) {
  ui.activeView = view;
  document.querySelectorAll('.view').forEach((section) => {
    section.classList.toggle('is-active', section.id === `view-${view}`);
  });
  document.querySelectorAll('.nav-link').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.view === view);
  });
}

function samplePreviewTable(title, subtitle, headers, rows) {
  return `
    <div class="sample-preview-card">
      <h4>${escapeHtml(title)}</h4>
      <p class="muted">${escapeHtml(subtitle)}</p>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function csvExampleConfig(type) {
  if (type === 'donors') {
    return {
      title: 'Donor CSV Example',
      subtitle: 'These are the columns and sample rows the donor importer expects.',
      headers: ['Contact Name', 'Business', 'Email', 'Phone', 'Address', 'Notes'],
      rows: SAMPLE_DONOR_ROWS,
      templateAction: 'download-donor-template',
      templateLabel: 'Download donor template'
    };
  }
  return {
    title: 'Item CSV Example',
    subtitle: 'These are the columns and sample rows the item importer expects.',
    headers: ['Lot Number', 'Title', 'Description', 'Donor', 'Category', 'FMV', 'Starting Bid', 'Minimum Increment', 'Buy Now'],
    rows: SAMPLE_ITEM_ROWS,
    templateAction: 'download-item-template',
    templateLabel: 'Download item template'
  };
}

function renderCsvExampleIntro() {
  const wrap = document.getElementById('csvExampleWrap');
  if (!ui.csvImport) {
    wrap.innerHTML = '';
    return;
  }
  const example = csvExampleConfig(ui.csvImport.type);
  wrap.innerHTML = `
    <div class="note-card csv-example-card">
      <h3>Need an example first?</h3>
      <p class="muted">Use the sample auction if you want to explore the whole app, or match your spreadsheet to these example rows.</p>
      <div class="button-row">
        <button class="button button--primary" type="button" data-onboarding-action="load-sample">Load sample auction</button>
        <button class="button" type="button" data-onboarding-action="${example.templateAction}">${example.templateLabel}</button>
      </div>
      ${samplePreviewTable(example.title, example.subtitle, example.headers, example.rows.slice(0, 2))}
    </div>
  `;
}

function renderGettingStarted() {
  const empty = !hasData();
  const sampleMode = isSampleMode();
  const heroActions = document.getElementById('heroActions');
  const overviewIntroText = document.getElementById('overviewIntroText');
  document.getElementById('clearAllDataButton').textContent = sampleMode ? 'Remove sample and start blank' : 'Clear all auction data';

  if (empty) {
    overviewIntroText.textContent = 'This auction is blank right now. Load the sample auction or start entering your own donors and items.';
    heroActions.innerHTML = `
      <button class="button button--primary" type="button" data-onboarding-action="load-sample">Load sample auction</button>
      <button class="button" type="button" data-onboarding-action="jump-donors">Add donors</button>
      <button class="button" type="button" data-onboarding-action="jump-data">Open data tools</button>
    `;
    return;
  }

  if (sampleMode) {
    overviewIntroText.textContent = 'This browser is currently showing the sample auction so you can explore the full workflow before using your own event data.';
    heroActions.innerHTML = `
      <button class="button button--primary" type="button" data-onboarding-action="start-blank">Start blank auction</button>
      <button class="button" type="button" data-onboarding-action="jump-documents">Explore documents</button>
      <button class="button" type="button" data-onboarding-action="jump-data">Open data tools</button>
    `;
    return;
  }

  overviewIntroText.textContent = 'Everything below is your live auction data for this browser. Update donors, items, layouts, and winners as you work.';
  heroActions.innerHTML = `
    <button class="button button--primary" type="button" data-onboarding-action="jump-donors">Add donors</button>
    <button class="button" type="button" data-onboarding-action="jump-items">Add items</button>
    <button class="button" type="button" data-onboarding-action="jump-documents">Open documents</button>
  `;
}

function renderSidebar() {
  document.getElementById('sidebarEventName').textContent =
    state.settings.eventName || state.settings.orgName || 'Event not named yet';
  document.getElementById('sidebarEventDate').textContent =
    state.settings.eventDate ? formatDate(state.settings.eventDate) : 'Choose an event date in Home.';
  document.getElementById('sidebarBackup').textContent =
    state.meta.lastBackupAt ? `Last backup: ${formatDate(state.meta.lastBackupAt.slice(0, 10))}` : 'No backup downloaded yet.';
  const duplicateLotNumbers = duplicateLots();

  const items = [
    {
      ok: Boolean(state.settings.orgName && state.settings.eventName && state.settings.eventDate),
      title: 'Event details are set',
      note: state.settings.eventName ? 'Organization, event name, and date are ready.' : 'Set the event name and date in Home.'
    },
    {
      ok: state.donors.length > 0,
      title: 'Donors entered',
      note: state.donors.length ? `${state.donors.length} donor record(s) saved.` : 'Add donors before thank-you letters.'
    },
    {
      ok: state.items.length > 0,
      title: 'Items entered',
      note: state.items.length ? `${state.items.length} lot(s) saved.` : 'Add items before printing bid sheets.'
    },
    {
      ok: duplicateLotNumbers.length === 0,
      title: 'Lot numbers are unique',
      note: duplicateLotNumbers.length === 0 ? 'No duplicate lots found.' : `Duplicates found: ${duplicateLotNumbers.join(', ')}.`
    },
    {
      ok: Boolean(state.meta.lastBackupAt),
      title: 'Backup downloaded',
      note: state.meta.lastBackupAt ? 'A backup file exists.' : 'Use Data to download a backup.'
    }
  ];

  document.getElementById('sidebarChecklist').innerHTML = items.map((item) => `
    <div class="checklist-item ${item.ok ? 'ok' : 'warn'}">
      <div class="checklist-dot"></div>
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <div class="muted">${escapeHtml(item.note)}</div>
      </div>
    </div>
  `).join('');
}

function renderOverview(syncInputs = true) {
  renderGettingStarted();
  document.getElementById('overviewDonorCount').textContent = String(state.donors.length);
  document.getElementById('overviewDonorNote').textContent = state.donors.length
    ? `${state.donors.filter((donor) => donor.email || donor.phone).length} include contact details.`
    : 'No donor records yet.';
  document.getElementById('overviewItemCount').textContent = String(state.items.length);
  document.getElementById('overviewItemNote').textContent = state.items.length
    ? `${state.items.filter((item) => !item.donorId).length} item(s) still need a donor link.`
    : 'No auction items yet.';
  document.getElementById('overviewSoldCount').textContent = String(state.winners.length);
  document.getElementById('overviewSoldNote').textContent = state.winners.length
    ? `${state.winners.filter((winner) => winner.isPaid).length} marked paid.`
    : 'No winners recorded yet.';
  document.getElementById('overviewRaisedTotal').textContent =
    formatCurrency(state.winners.reduce((sum, winner) => sum + winner.winningBid, 0)) || '$0.00';

  if (syncInputs) {
    document.getElementById('orgName').value = state.settings.orgName;
    document.getElementById('eventName').value = state.settings.eventName;
    document.getElementById('eventDate').value = state.settings.eventDate;
  }
  renderLogoPreview();

  const missingDonorCount = state.items.filter((item) => !item.donorId).length;
  const missingPricingCount = state.items.filter((item) => item.startingBid === null || item.increment === null).length;
  const donorsById = donorLookup();
  const orphanedDonorCount = state.items.filter((item) => item.donorId && !donorsById.has(item.donorId)).length;
  const duplicateLotNumbers = duplicateLots();
  const issues = [];

  if (!state.items.length) {
    issues.push({ type: 'warning', title: 'No items yet', note: 'Enter at least one item before heading to Documents.' });
  }
  if (missingDonorCount) {
    issues.push({ type: 'warning', title: `${missingDonorCount} item(s) need a donor`, note: 'Linking donors makes bid sheets and thank-you letters more useful.' });
  }
  if (missingPricingCount) {
    issues.push({ type: 'warning', title: `${missingPricingCount} item(s) need pricing`, note: 'Add starting bids and minimum increments before printing bid sheets.' });
  }
  if (orphanedDonorCount) {
    issues.push({ type: 'error', title: `${orphanedDonorCount} item(s) reference a deleted donor`, note: 'Edit these items to clear or reassign the donor link.' });
  }
  if (duplicateLotNumbers.length) {
    issues.push({ type: 'error', title: 'Duplicate lot numbers found', note: `Lots ${duplicateLotNumbers.join(', ')} appear more than once.` });
  }
  if (!issues.length) {
    issues.push({ type: 'success', title: 'No major issues found', note: 'Refresh the document preview before printing the final set.' });
  }

  document.getElementById('overviewIssues').innerHTML = issues.map((issue) => `
    <div class="issue-card ${issue.type}">
      <strong>${escapeHtml(issue.title)}</strong>
      <p class="muted">${escapeHtml(issue.note)}</p>
    </div>
  `).join('');
}

function renderLogoPreview() {
  const wrap = document.getElementById('logoPreview');
  if (state.settings.logo) {
    wrap.innerHTML = `<img src="${escapeHtml(state.settings.logo)}" alt="Uploaded logo preview">`;
  } else {
    wrap.innerHTML = '<div class="muted">No logo uploaded yet.</div>';
  }
}

function populateDonorAndCategoryOptions() {
  const donorSelect = document.getElementById('itemDonor');
  const itemCategorySelect = document.getElementById('itemCategory');
  const itemCategoryFilter = document.getElementById('itemCategoryFilter');
  const documentCategoryFilter = document.getElementById('documentCategoryFilter');
  const donorsById = donorLookup();
  const donorValue = donorSelect.value;
  const itemCategoryValue = itemCategorySelect.value;
  const filterValue = itemCategoryFilter.value;
  const documentFilterValue = documentCategoryFilter.value;

  donorSelect.innerHTML = ['<option value="">No donor linked yet</option>']
    .concat(
      state.donors
        .slice()
        .sort((left, right) => donorLabel(left.id, donorsById).localeCompare(donorLabel(right.id, donorsById), undefined, { sensitivity: 'base' }))
        .map((donor) => `<option value="${escapeHtml(donor.id)}">${escapeHtml(donorLabel(donor.id, donorsById) || donor.name)}</option>`)
    )
    .join('');

  const categories = uniqueStrings([...state.categories, ...state.items.map((item) => item.category)]);
  const categoryOptions = ['<option value="">No category</option>']
    .concat(categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`))
    .join('');
  const filterOptions = ['<option value="">All categories</option>']
    .concat(categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`))
    .join('');

  itemCategorySelect.innerHTML = categoryOptions;
  itemCategoryFilter.innerHTML = filterOptions;
  documentCategoryFilter.innerHTML = filterOptions;

  donorSelect.value = donorValue;
  itemCategorySelect.value = itemCategoryValue;
  itemCategoryFilter.value = filterValue;
  documentCategoryFilter.value = documentFilterValue;

  renderCategoryList(categories);
}

function renderCategoryList(categories) {
  const wrap = document.getElementById('categoryList');
  if (!categories.length) {
    wrap.innerHTML = '<div class="empty-state">No categories yet.</div>';
    return;
  }

  wrap.innerHTML = categories.map((category) => `
    <span class="category-chip">
      ${escapeHtml(category)}
      <button class="button button--small" type="button" data-category-remove="${escapeHtml(category)}">Remove</button>
    </span>
  `).join(' ');
}

function renderDonorForm(donor = null) {
  document.getElementById('donorId').value = donor ? donor.id : '';
  document.getElementById('donorName').value = donor ? donor.name : '';
  document.getElementById('donorBusiness').value = donor ? donor.business : '';
  document.getElementById('donorEmail').value = donor ? donor.email : '';
  document.getElementById('donorPhone').value = donor ? donor.phone : '';
  document.getElementById('donorAddress').value = donor ? donor.address : '';
  document.getElementById('donorNotes').value = donor ? donor.notes : '';
}

function renderDonorTable() {
  const search = normalizeComparable(document.getElementById('donorSearch').value);
  const sort = document.getElementById('donorSort').value;
  const donorItemCounts = itemCountsByDonor();
  const donors = state.donors.filter((donor) => {
    if (!search) {
      return true;
    }
    return [donor.name, donor.business, donor.email, donor.phone]
      .map(normalizeComparable)
      .some((value) => value.includes(search));
  });

  donors.sort((left, right) => {
    if (sort === 'business') {
      return (left.business || left.name).localeCompare(right.business || right.name, undefined, { sensitivity: 'base' });
    }
    if (sort === 'items') {
      return countItemsForDonor(right.id, donorItemCounts) - countItemsForDonor(left.id, donorItemCounts)
        || left.name.localeCompare(right.name, undefined, { sensitivity: 'base' });
    }
    return left.name.localeCompare(right.name, undefined, { sensitivity: 'base' });
  });

  const wrap = document.getElementById('donorTableWrap');
  if (!donors.length) {
    wrap.innerHTML = '<div class="empty-state">No donors match this search yet.</div>';
    return;
  }

  wrap.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name / Address</th>
            <th>Business</th>
            <th>Contact</th>
            <th>Items</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${donors.map((donor) => `
            <tr>
              <td><strong>${escapeHtml(donor.name)}</strong><br><span class="muted">${escapeHtml(donor.address || '')}</span></td>
              <td>${escapeHtml(donor.business || '')}</td>
              <td>${escapeHtml([donor.email, donor.phone].filter(Boolean).join(' | ') || '—')}</td>
              <td>${countItemsForDonor(donor.id, donorItemCounts)}</td>
              <td>
                <div class="button-row">
                  <button class="button button--small" type="button" data-donor-edit="${escapeHtml(donor.id)}">Edit</button>
                  <button class="button button--small button--danger" type="button" data-donor-delete="${escapeHtml(donor.id)}">Delete</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function nextLotNumber() {
  const values = state.items
    .map((item) => Number.parseInt(item.lotNumber, 10))
    .filter((value) => Number.isFinite(value));
  return values.length ? String(Math.max(...values) + 1) : '1';
}

function renderItemForm(item = null) {
  document.getElementById('itemId').value = item ? item.id : '';
  document.getElementById('itemLotNumber').value = item ? item.lotNumber : nextLotNumber();
  document.getElementById('itemTitle').value = item ? item.title : '';
  document.getElementById('itemDonor').value = item ? item.donorId : '';
  document.getElementById('itemCategory').value = item ? item.category : '';
  document.getElementById('itemDescription').value = item ? item.description : '';
  document.getElementById('itemFmv').value = item && item.fmv !== null ? String(item.fmv) : '';
  document.getElementById('itemStartingBid').value = item && item.startingBid !== null ? String(item.startingBid) : '';
  document.getElementById('itemIncrement').value = item && item.increment !== null ? String(item.increment) : '';
  document.getElementById('itemBuyNow').value = item && item.buyNow !== null ? String(item.buyNow) : '';
}

function renderItemTable() {
  const search = normalizeComparable(document.getElementById('itemSearch').value);
  const category = document.getElementById('itemCategoryFilter').value;
  const sort = document.getElementById('itemSort').value;
  const donorsById = donorLookup();
  const items = state.items.filter((item) => {
    if (category && item.category !== category) {
      return false;
    }
    if (!search) {
      return true;
    }
    return [item.lotNumber, item.title, donorLabel(item.donorId, donorsById), item.category]
      .map(normalizeComparable)
      .some((value) => value.includes(search));
  });

  items.sort((left, right) => {
    if (sort === 'title') {
      return left.title.localeCompare(right.title, undefined, { sensitivity: 'base' });
    }
    if (sort === 'donor') {
      return donorLabel(left.donorId, donorsById).localeCompare(donorLabel(right.donorId, donorsById), undefined, { sensitivity: 'base' });
    }
    if (sort === 'value') {
      return (right.fmv || 0) - (left.fmv || 0);
    }
    const leftLot = Number.parseInt(left.lotNumber, 10);
    const rightLot = Number.parseInt(right.lotNumber, 10);
    if (Number.isFinite(leftLot) && Number.isFinite(rightLot)) {
      return leftLot - rightLot;
    }
    return left.lotNumber.localeCompare(right.lotNumber, undefined, { numeric: true, sensitivity: 'base' });
  });

  const wrap = document.getElementById('itemTableWrap');
  if (!items.length) {
    wrap.innerHTML = '<div class="empty-state">No items match this search yet.</div>';
    return;
  }

  wrap.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Lot</th>
            <th>Item</th>
            <th>Donor</th>
            <th>Category</th>
            <th>Pricing</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((item) => `
            <tr>
              <td><strong>${escapeHtml(item.lotNumber || '—')}</strong></td>
              <td><strong>${escapeHtml(item.title)}</strong><br><span class="muted">${escapeHtml(item.description ? item.description.slice(0, 90) : 'No description yet.')}</span></td>
              <td>${escapeHtml(donorLabel(item.donorId, donorsById) || '—')}</td>
              <td>${item.category ? `<span class="category-chip">${escapeHtml(item.category)}</span>` : '<span class="muted">—</span>'}</td>
              <td>
                <div>Start: ${escapeHtml(formatCurrency(item.startingBid) || '—')}</div>
                <div>Increment: ${escapeHtml(formatCurrency(item.increment) || '—')}</div>
              </td>
              <td><span class="status-chip ${escapeHtml(item.status)}">${escapeHtml(item.status === 'sold' ? 'Sold' : 'Available')}</span></td>
              <td>
                <div class="button-row">
                  <button class="button button--small" type="button" data-item-edit="${escapeHtml(item.id)}">Edit</button>
                  <button class="button button--small button--danger" type="button" data-item-delete="${escapeHtml(item.id)}">Delete</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function selectedCategoryFilter() {
  return document.getElementById('documentCategoryFilter').value;
}

function filteredItemsForDocuments() {
  const category = selectedCategoryFilter();
  return state.items
    .filter((item) => !category || item.category === category)
    .slice()
    .sort((left, right) => {
      const leftLot = Number.parseInt(left.lotNumber, 10);
      const rightLot = Number.parseInt(right.lotNumber, 10);
      if (Number.isFinite(leftLot) && Number.isFinite(rightLot)) {
        return leftLot - rightLot;
      }
      return left.lotNumber.localeCompare(right.lotNumber, undefined, { numeric: true, sensitivity: 'base' });
    });
}

function donorForItem(item) {
  return donorForItemFromLookup(item, donorLookup());
}

function donorForItemFromLookup(item, donorsById) {
  if (!item || !item.donorId) {
    return null;
  }
  return donorsById.get(item.donorId) || null;
}

function buildDocumentContexts(documentType, includeAll, donorsById = donorLookup()) {
  if (documentType === 'itemList') {
    const items = filteredItemsForDocuments();
    if (!items.length) {
      return [];
    }
    const pageCount = Math.ceil(items.length / ITEM_LIST_ROWS_PER_PAGE);
    const pages = [];
    for (let start = 0; start < items.length; start += ITEM_LIST_ROWS_PER_PAGE) {
      pages.push({
        items: items.slice(start, start + ITEM_LIST_ROWS_PER_PAGE),
        pageNumber: pages.length + 1,
        pageCount,
        donorsById
      });
    }
    return includeAll ? pages : pages.slice(0, 1);
  }
  if (documentType === 'thankYou') {
    const eligibleItems = filteredItemsForDocuments();
    const itemsByDonor = new Map();
    eligibleItems.forEach((item) => {
      const donorItems = itemsByDonor.get(item.donorId) || [];
      donorItems.push(item);
      itemsByDonor.set(item.donorId, donorItems);
    });
    const donors = state.donors
      .map((donor) => ({ donor, items: itemsByDonor.get(donor.id) || [], donorsById }))
      .filter((entry) => entry.items.length > 0);
    return includeAll ? donors : donors.slice(0, 1);
  }
  const items = filteredItemsForDocuments();
  const contexts = items.map((item) => ({ item, donor: donorForItemFromLookup(item, donorsById), donorsById }));
  return includeAll ? contexts : contexts.slice(0, 1);
}

function fillThankYouTemplate(donor, items) {
  const itemList = items
    .map((item) => `- ${item.title}${item.fmv !== null ? ` (Estimated value: ${formatCurrency(item.fmv)})` : ''}`)
    .join('\n');
  const totalValue = items.reduce((sum, item) => sum + (item.fmv || 0), 0);
  return (state.settings.thankYouBodyText || defaultThankYouBody())
    .replaceAll('{DONOR_NAME}', donor.name)
    .replaceAll('{DONOR_BUSINESS}', donor.business || donor.name)
    .replaceAll('{EVENT_NAME}', state.settings.eventName || state.settings.orgName || 'our event')
    .replaceAll('{ITEM_LIST}', itemList)
    .replaceAll('{TOTAL_VALUE}', formatCurrency(totalValue) || '$0.00')
    .replaceAll('{SIGNER_NAME}', state.settings.thankYouSignature || state.settings.orgName || 'Auction Team');
}

function documentFieldValue(source, context) {
  if (!source) {
    return '';
  }

  const item = context.item || null;
  const donor = context.donor || (item ? donorForItemFromLookup(item, context.donorsById || donorLookup()) : null);

  switch (source) {
    case 'item.lotNumber':
      return item ? item.lotNumber : '';
    case 'item.title':
      return item ? item.title : '';
    case 'item.description':
      return item ? item.description : '';
    case 'item.fmv':
      return item && item.fmv !== null ? formatCurrency(item.fmv) : '';
    case 'item.startingBid':
      return item && item.startingBid !== null ? formatCurrency(item.startingBid) : '';
    case 'item.increment':
      return item && item.increment !== null ? formatCurrency(item.increment) : '';
    case 'item.buyNow':
      return item && item.buyNow !== null ? formatCurrency(item.buyNow) : '';
    case 'settings.bidSheetHeaderText':
      return state.settings.bidSheetHeaderText;
    case 'settings.bidSheetFooterText':
      return state.settings.bidSheetFooterText;
    case 'settings.itemListHeaderText':
      return state.settings.itemListHeaderText;
    case 'settings.itemListFooterText':
      return state.settings.itemListFooterText;
    case 'settings.thankYouHeaderText':
      return state.settings.thankYouHeaderText;
    case 'settings.thankYouSignature':
      return state.settings.thankYouSignature;
    case 'computed.eventHeading':
      return [state.settings.orgName, state.settings.eventName].filter(Boolean).join(' — ');
    case 'computed.eventDate':
      return formatDate(state.settings.eventDate);
    case 'computed.pageIndicator':
      if (!context.pageNumber || !context.pageCount) {
        return '';
      }
      return `Page ${context.pageNumber} of ${context.pageCount}`;
    case 'computed.donorBlock':
      if (!donor) {
        return '';
      }
      return [donor.business || donor.name, donor.address].filter(Boolean).join('\n');
    case 'computed.donorAddressBlock':
      if (!context.donor) {
        return '';
      }
      return [context.donor.business || context.donor.name, context.donor.address].filter(Boolean).join('\n');
    case 'computed.thankYouBody':
      if (!context.donor || !context.items) {
        return '';
      }
      return fillThankYouTemplate(context.donor, context.items);
    default:
      return '';
  }
}

function fontStyle(block) {
  return [
    `font-size:${block.fontSize}px`,
    `font-weight:${block.fontWeight}`,
    `text-align:${block.align}`,
    block.multiline ? 'white-space:pre-wrap' : 'white-space:nowrap'
  ].join(';');
}

function blockFrameStyle(block) {
  return [
    `left:${block.x}%`,
    `top:${block.y}%`,
    `width:${block.w}%`,
    `height:${block.h}%`
  ].join(';');
}

function layoutBlocksForCurrentType() {
  return state.settings.layouts[ui.selectedDocumentType].blocks;
}

function selectedLayoutBlock() {
  return layoutBlocksForCurrentType().find((block) => block.id === ui.selectedLayoutBlockId) || null;
}

function renderLayoutCanvas() {
  const canvas = document.getElementById('layoutCanvas');
  const contexts = buildDocumentContexts(ui.selectedDocumentType, false, donorLookup());
  const sampleContext = contexts[0] || {};
  const blocks = layoutBlocksForCurrentType();

  canvas.innerHTML = blocks.map((block) => {
    const classes = [
      'layout-block',
      block.kind === 'table' ? 'layout-block--table' : '',
      block.id === ui.selectedLayoutBlockId ? 'is-selected' : ''
    ].filter(Boolean).join(' ');
    let content = '';
    if (block.kind === 'image') {
      content = state.settings.logo
        ? '<div class="layout-block__content">Logo</div>'
        : '<div class="layout-block__content muted">Logo placeholder</div>';
    } else if (block.kind === 'table') {
      content = '<div class="layout-table-placeholder" aria-hidden="true"></div>';
    } else if (block.kind === 'text') {
      content = `<div class="layout-block__content">${escapeHtml(block.text || 'Custom text')}</div>`;
    } else {
      const value = documentFieldValue(block.source, sampleContext) || '(empty)';
      const shown = block.showLabel && block.label ? `${block.label}: ${value}` : value;
      content = `<div class="layout-block__content">${escapeHtml(shown)}</div>`;
    }
    return `
      <div
        class="${classes}"
        style="${blockFrameStyle(block)};${fontStyle(block)};"
        data-layout-block="${escapeHtml(block.id)}"
      >
        <div class="layout-block__meta">${escapeHtml(block.kind === 'table' ? block.label : block.label || block.kind)}</div>
        ${content}
      </div>
    `;
  }).join('');
}

function renderInspector() {
  const block = selectedLayoutBlock();
  const wrap = document.getElementById('layoutInspector');
  if (!block) {
    wrap.className = 'inspector-empty';
    wrap.innerHTML = 'Select a block on the layout canvas.';
    return;
  }

  wrap.className = 'stack';
  wrap.innerHTML = `
    <label class="field">
      <span>Block label</span>
      <input data-inspector="label" type="text" value="${escapeHtml(block.label)}">
    </label>
    ${block.kind === 'text' ? `
      <label class="field">
        <span>Text content</span>
        <textarea data-inspector="text">${escapeHtml(block.text)}</textarea>
      </label>
    ` : ''}
    ${block.kind === 'field' ? `
      <label class="field field--checkbox">
        <input data-inspector="showLabel" type="checkbox" ${block.showLabel ? 'checked' : ''}>
        <span>Show the label on the page</span>
      </label>
    ` : ''}
    <label class="field field--checkbox">
      <input data-inspector="visible" type="checkbox" ${block.visible ? 'checked' : ''}>
      <span>Visible on the page</span>
    </label>
    <div class="form-grid">
      <label class="field">
        <span>X</span>
        <input data-inspector="x" type="number" min="0" max="100" step="0.1" value="${block.x}">
      </label>
      <label class="field">
        <span>Y</span>
        <input data-inspector="y" type="number" min="0" max="100" step="0.1" value="${block.y}">
      </label>
      <label class="field">
        <span>Width</span>
        <input data-inspector="w" type="number" min="4" max="100" step="0.1" value="${block.w}">
      </label>
      <label class="field">
        <span>Height</span>
        <input data-inspector="h" type="number" min="2" max="100" step="0.1" value="${block.h}">
      </label>
      <label class="field">
        <span>Font size</span>
        <input data-inspector="fontSize" type="number" min="8" max="48" step="1" value="${block.fontSize}">
      </label>
      <label class="field">
        <span>Alignment</span>
        <select data-inspector="align">
          <option value="left" ${block.align === 'left' ? 'selected' : ''}>Left</option>
          <option value="center" ${block.align === 'center' ? 'selected' : ''}>Center</option>
          <option value="right" ${block.align === 'right' ? 'selected' : ''}>Right</option>
        </select>
      </label>
    </div>
    ${block.kind === 'text' ? '<button class="button button--danger" id="removeSelectedTextBlockButton" type="button">Remove this text block</button>' : ''}
    <div class="muted">Drag the block on the canvas for coarse placement. Use these inputs for precise positioning.</div>
  `;
}

function renderDocumentPreview() {
  const allContexts = buildDocumentContexts(ui.selectedDocumentType, true, donorLookup());
  const contexts = allContexts.slice(0, 1);
  const wrap = document.getElementById('documentPreview');
  const summary = document.getElementById('documentPreviewSummary');
  if (!contexts.length) {
    wrap.innerHTML = '<div class="empty-state">No data yet for this document type.</div>';
    summary.textContent = 'This uses the same layout data that printing uses.';
    return;
  }

  wrap.innerHTML = contexts.map((context) => renderDocumentPage(ui.selectedDocumentType, context, true)).join('');

  if (ui.selectedDocumentType === 'bidSheet') {
    summary.textContent = `${allContexts.length} bid sheet(s) will print with this layout.`;
  } else if (ui.selectedDocumentType === 'itemList') {
    const itemCount = allContexts.reduce((count, context) => count + context.items.length, 0);
    summary.textContent = `${itemCount} item row(s) across ${allContexts.length} page(s) will print in the price list.`;
  } else {
    summary.textContent = `${allContexts.length} thank-you letter(s) will print with this layout.`;
  }
}

function renderDocumentPage(documentType, context, previewMode) {
  const blocks = state.settings.layouts[documentType].blocks;
  return `
    <div class="${previewMode ? 'preview-page' : 'print-page'}">
      ${blocks.filter((block) => block.visible).map((block) => renderOutputBlock(block, context, previewMode)).join('')}
    </div>
  `;
}

function renderOutputBlock(block, context, previewMode) {
  const className = previewMode ? 'preview-block' : 'print-block';
  const style = `${blockFrameStyle(block)};${fontStyle(block)};`;
  if (block.kind === 'image') {
    if (!state.settings.logo) {
      return '';
    }
    return `<div class="${className}" style="${style}"><img src="${escapeHtml(state.settings.logo)}" alt="Logo" style="max-width:100%;max-height:100%;display:block;margin:auto;"></div>`;
  }

  if (block.kind === 'table') {
    const tableMarkup = block.tableType === 'itemTable'
      ? renderItemListTable(context.items || [], context.donorsById || donorLookup())
      : renderBidTable(context.item || null);
    return `<div class="${className}" style="${style}">${tableMarkup}</div>`;
  }

  const rawValue = block.kind === 'text' ? block.text : documentFieldValue(block.source, context);
  const displayValue = block.showLabel && block.label && block.kind === 'field'
    ? `${block.label}: ${rawValue}`
    : rawValue;

  if (!displayValue) {
    return '';
  }

  return `<div class="${className}" style="${style}">${escapeHtml(displayValue)}</div>`;
}

function renderBidTable(item) {
  const lineCount = clampNumber(state.settings.bidLineCount, 10, 6, 30);
  const rows = [];
  const openingBid = item && item.startingBid !== null ? formatCurrency(item.startingBid) : 'Opening bid';
  for (let index = 0; index < lineCount; index += 1) {
    rows.push(`<tr><td>${index === 0 ? escapeHtml(openingBid) : '&nbsp;'}</td><td>&nbsp;</td></tr>`);
  }
  return `
    <table class="preview-table">
      <thead>
        <tr>
          <th>Amount</th>
          <th>Bidder name or number</th>
        </tr>
      </thead>
      <tbody>${rows.join('')}</tbody>
    </table>
  `;
}

function renderItemListTable(items, donorsById) {
  return `
    <table class="preview-table">
      <thead>
        <tr>
          <th>Lot</th>
          <th>Item</th>
          <th>Donor</th>
          <th>Category</th>
          <th>FMV</th>
          <th>Start</th>
        </tr>
      </thead>
      <tbody>
        ${items.map((item) => `
          <tr>
            <td>${escapeHtml(item.lotNumber)}</td>
            <td>${escapeHtml(item.title)}</td>
            <td>${escapeHtml(donorLabel(item.donorId, donorsById) || '—')}</td>
            <td>${escapeHtml(item.category || '—')}</td>
            <td>${escapeHtml(formatCurrency(item.fmv) || '—')}</td>
            <td>${escapeHtml(formatCurrency(item.startingBid) || '—')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderDocumentsView(syncInputs = true) {
  document.getElementById('documentTypeSelect').value = ui.selectedDocumentType;
  document.getElementById('bidLineCountField').hidden = ui.selectedDocumentType !== 'bidSheet';
  document.getElementById('bidLineCount').disabled = ui.selectedDocumentType !== 'bidSheet';
  if (syncInputs) {
    document.getElementById('bidLineCount').value = String(state.settings.bidLineCount);
    document.getElementById('bidSheetHeaderText').value = state.settings.bidSheetHeaderText;
    document.getElementById('bidSheetFooterText').value = state.settings.bidSheetFooterText;
    document.getElementById('itemListHeaderText').value = state.settings.itemListHeaderText;
    document.getElementById('itemListFooterText').value = state.settings.itemListFooterText;
    document.getElementById('thankYouHeaderText').value = state.settings.thankYouHeaderText;
    document.getElementById('thankYouBodyText').value = state.settings.thankYouBodyText;
    document.getElementById('thankYouSignature').value = state.settings.thankYouSignature;
  }
  renderLayoutCanvas();
  renderInspector();
  renderDocumentPreview();
}

function renderCheckout() {
  const totalRaised = state.winners.reduce((sum, winner) => sum + winner.winningBid, 0);
  const paid = state.winners.filter((winner) => winner.isPaid).reduce((sum, winner) => sum + winner.winningBid, 0);
  document.getElementById('checkoutSoldCount').textContent = String(state.winners.length);
  document.getElementById('checkoutRaisedTotal').textContent = formatCurrency(totalRaised) || '$0.00';
  document.getElementById('checkoutPaidTotal').textContent = formatCurrency(paid) || '$0.00';
  document.getElementById('checkoutOutstandingTotal').textContent = formatCurrency(totalRaised - paid) || '$0.00';
  renderCheckoutSearchResults();
  renderWinnerList();
}

function renderCheckoutSearchResults() {
  const query = normalizeComparable(document.getElementById('checkoutSearch').value);
  const wrap = document.getElementById('checkoutSearchResults');
  const soldItemIds = new Set(state.winners.map((winner) => winner.itemId));
  const donorsById = donorLookup();
  if (!query) {
    wrap.innerHTML = '<div class="empty-state">Start typing a lot number or title.</div>';
    return;
  }

  const matches = state.items.filter((item) => {
    if (soldItemIds.has(item.id)) {
      return false;
    }
    return [item.lotNumber, item.title].map(normalizeComparable).some((value) => value.includes(query));
  }).slice(0, 12);

  if (!matches.length) {
    wrap.innerHTML = '<div class="empty-state">No unsold item matches that search.</div>';
    return;
  }

  wrap.innerHTML = matches.map((item) => `
    <div class="search-card">
      <div class="lot-pill">${escapeHtml(item.lotNumber)}</div>
      <div>
        <strong>${escapeHtml(item.title)}</strong><br>
        <span class="muted">${escapeHtml(donorLabel(item.donorId, donorsById) || 'No donor linked')} | Start ${escapeHtml(formatCurrency(item.startingBid) || '—')}</span>
      </div>
      <button class="button button--primary button--small" type="button" data-record-winner="${escapeHtml(item.id)}">Record winner</button>
    </div>
  `).join('');
}

function renderWinnerList() {
  const query = normalizeComparable(document.getElementById('winnerSearch').value);
  const filter = document.getElementById('winnerFilter').value;
  const itemsById = new Map(state.items.map((item) => [item.id, item]));
  const winners = state.winners.filter((winner) => {
    if (filter === 'paid' && !winner.isPaid) {
      return false;
    }
    if (filter === 'unpaid' && winner.isPaid) {
      return false;
    }
    if (!query) {
      return true;
    }
    const item = itemsById.get(winner.itemId);
    return [winner.winnerName, winner.paddleNumber, item ? item.title : '', item ? item.lotNumber : '']
      .map(normalizeComparable)
      .some((value) => value.includes(query));
  }).sort((left, right) => {
    const leftItem = itemsById.get(left.itemId);
    const rightItem = itemsById.get(right.itemId);
    return (leftItem ? leftItem.lotNumber : '').localeCompare(rightItem ? rightItem.lotNumber : '', undefined, { numeric: true, sensitivity: 'base' });
  });

  const wrap = document.getElementById('winnerList');
  if (!winners.length) {
    wrap.innerHTML = '<div class="empty-state">No winners recorded yet.</div>';
    return;
  }

  wrap.innerHTML = winners.map((winner) => {
    const item = itemsById.get(winner.itemId);
    return `
      <div class="winner-card ${winner.isPaid ? 'paid' : ''}">
        <div class="lot-pill">${escapeHtml(item ? item.lotNumber : '—')}</div>
        <div>
          <strong>${escapeHtml(item ? item.title : 'Unknown item')}</strong><br>
          <span class="muted">${escapeHtml(winner.winnerName)}${winner.paddleNumber ? ` (#${escapeHtml(winner.paddleNumber)})` : ''} | ${escapeHtml(formatCurrency(winner.winningBid) || '—')}</span>
        </div>
        <div class="button-row">
          <button class="button button--small" type="button" data-edit-winner="${escapeHtml(winner.id)}">Edit</button>
          <button class="button button--small" type="button" data-toggle-paid="${escapeHtml(winner.id)}">${winner.isPaid ? 'Mark unpaid' : 'Mark paid'}</button>
          <button class="button button--small button--danger" type="button" data-remove-winner="${escapeHtml(winner.id)}">Remove</button>
        </div>
      </div>
    `;
  }).join('');
}

function openWinnerModal(itemId, existingWinner = null, trigger = document.activeElement) {
  const item = state.items.find((entry) => entry.id === itemId);
  if (!item) {
    return;
  }
  document.getElementById('winnerModalError').hidden = true;
  document.getElementById('winnerModalError').textContent = '';
  document.getElementById('winnerModalTitle').textContent = existingWinner ? 'Edit winner' : 'Record winner';
  document.getElementById('winnerRecordId').value = existingWinner ? existingWinner.id : '';
  document.getElementById('winnerItemId').value = item.id;
  document.getElementById('winnerModalContext').textContent = `Lot ${item.lotNumber}: ${item.title}`;
  document.getElementById('winnerName').value = existingWinner ? existingWinner.winnerName : '';
  document.getElementById('winnerPaddle').value = existingWinner ? existingWinner.paddleNumber : '';
  document.getElementById('winnerAmount').value = existingWinner ? String(existingWinner.winningBid) : (item.startingBid !== null ? String(item.startingBid) : '');
  document.getElementById('winnerPaid').checked = existingWinner ? existingWinner.isPaid : false;
  openModal('winnerModal', 'winnerName', trigger);
}

function closeWinnerModal() {
  closeModal('winnerModal');
}

function showWinnerModalError(message) {
  const el = document.getElementById('winnerModalError');
  el.textContent = message;
  el.hidden = false;
}

function saveWinner() {
  const winnerRecordId = document.getElementById('winnerRecordId').value;
  const itemId = document.getElementById('winnerItemId').value;
  const winnerName = document.getElementById('winnerName').value.trim();
  const winningBid = toMoney(document.getElementById('winnerAmount').value);
  if (!winnerName) {
    showWinnerModalError('Winner name is required.');
    return;
  }
  if (winningBid === null || winningBid <= 0) {
    showWinnerModalError('Final amount must be greater than zero.');
    return;
  }

  const winnerRecord = {
    id: winnerRecordId || generateId(),
    itemId,
    winnerName,
    paddleNumber: document.getElementById('winnerPaddle').value.trim(),
    winningBid,
    isPaid: document.getElementById('winnerPaid').checked
  };
  const existingIndex = state.winners.findIndex((winner) => winner.id === winnerRecord.id || (!winnerRecordId && winner.itemId === itemId));
  if (existingIndex >= 0) {
    state.winners[existingIndex] = winnerRecord;
  } else {
    state.winners = state.winners.filter((winner) => winner.itemId !== itemId);
    state.winners.push(winnerRecord);
  }

  const item = state.items.find((entry) => entry.id === itemId);
  if (item) {
    item.status = 'sold';
  }

  closeWinnerModal();
  document.getElementById('checkoutSearch').value = '';
  renderCheckout();
  renderItemTable();
  renderOverview();
  saveState('Winner saved');
}

function exportJson() {
  downloadBlob(new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }), `auction-backup-${new Date().toISOString().slice(0, 10)}.json`);
  state.meta.lastBackupAt = new Date().toISOString();
  saveState('Backup downloaded');
}

function exportHtmlArchive() {
  const embeddedJson = JSON.stringify(state, null, 2);
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(state.settings.eventName || state.settings.orgName || 'Auction Archive')}</title>
  <style>
    body { font-family: Georgia, serif; max-width: 980px; margin: 0 auto; padding: 2rem; line-height: 1.5; }
    h1, h2 { margin-bottom: 0.4rem; }
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    th, td { border: 1px solid #cbd5e1; padding: 0.45rem; text-align: left; }
    th { background: #edf2f7; }
    .meta { color: #475569; margin-bottom: 1.2rem; }
  </style>
</head>
<body>
  <h1>${escapeHtml(state.settings.eventName || state.settings.orgName || 'Auction Archive')}</h1>
  <div class="meta">${escapeHtml(formatDate(state.settings.eventDate) || 'No event date set')}</div>
  <h2>Items</h2>
  <table>
    <thead>
      <tr><th>Lot</th><th>Title</th><th>Donor</th><th>Winner</th><th>Winning Bid</th></tr>
    </thead>
    <tbody>
      ${state.items.map((item) => {
        const winner = state.winners.find((entry) => entry.itemId === item.id);
        return `<tr><td>${escapeHtml(item.lotNumber)}</td><td>${escapeHtml(item.title)}</td><td>${escapeHtml(donorLabel(item.donorId) || '—')}</td><td>${escapeHtml(winner ? winner.winnerName : '')}</td><td>${escapeHtml(winner ? formatCurrency(winner.winningBid) : '')}</td></tr>`;
      }).join('')}
    </tbody>
  </table>
  <h2>Embedded Data</h2>
  <p>This file contains a complete JSON snapshot below. Use the buttons to copy it or download it as a JSON backup.</p>
  <p>
    <button id="copyArchiveJson" type="button">Copy JSON snapshot</button>
    <button id="downloadArchiveJson" type="button">Download JSON backup</button>
  </p>
  <pre id="archiveJson">${escapeHtml(embeddedJson)}</pre>
  <script>
    const archiveJson = document.getElementById('archiveJson').textContent || '';
    document.getElementById('copyArchiveJson').addEventListener('click', async () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(archiveJson);
          alert('JSON snapshot copied to the clipboard.');
          return;
        } catch (error) {
          // Fall back to the download guidance below.
        }
      }
      alert('Clipboard copy is not available in this browser. Use the download button instead.');
    });
    document.getElementById('downloadArchiveJson').addEventListener('click', () => {
      const blob = new Blob([archiveJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'auction-archive-data.json';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    });
  </script>
</body>
</html>`.trim();
  downloadBlob(new Blob([html], { type: 'text/html' }), `auction-archive-${new Date().toISOString().slice(0, 10)}.html`);
  state.meta.lastBackupAt = new Date().toISOString();
  saveState('Archive downloaded');
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function generateCsv(headers, rows) {
  const escape = (value) => {
    let text = String(value ?? '');
    if (/^[=+\-@]/.test(text)) {
      text = `'${text}`;
    }
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  return '\uFEFF' + [headers.map(escape).join(','), ...rows.map((row) => row.map(escape).join(','))].join('\n');
}

function exportCsv(type) {
  if (type === 'donors') {
    const donorItemCounts = itemCountsByDonor();
    const rows = state.donors.map((donor) => [donor.name, donor.business, donor.email, donor.phone, donor.address, donor.notes, countItemsForDonor(donor.id, donorItemCounts)]);
    downloadBlob(new Blob([generateCsv(['Contact Name', 'Business', 'Email', 'Phone', 'Address', 'Notes', 'Item Count'], rows)], { type: 'text/csv' }), 'auction-donors.csv');
    return;
  }
  if (type === 'winners') {
    const itemsById = new Map(state.items.map((item) => [item.id, item]));
    const rows = state.winners.map((winner) => {
      const item = itemsById.get(winner.itemId);
      return [item ? item.lotNumber : '', item ? item.title : '', winner.winnerName, winner.paddleNumber, winner.winningBid, winner.isPaid ? 'Yes' : 'No'];
    });
    downloadBlob(new Blob([generateCsv(['Lot Number', 'Item', 'Winner', 'Paddle', 'Winning Bid', 'Paid'], rows)], { type: 'text/csv' }), 'auction-winners.csv');
    return;
  }
  const donorsById = donorLookup();
  const winnersByItemId = new Map(state.winners.map((winner) => [winner.itemId, winner]));
  const rows = state.items.map((item) => {
    const winner = winnersByItemId.get(item.id);
    return [item.lotNumber, item.title, item.description, donorLabel(item.donorId, donorsById), item.category, item.fmv ?? '', item.startingBid ?? '', item.increment ?? '', item.buyNow ?? '', winner ? winner.winnerName : '', winner ? winner.winningBid : '', winner && winner.isPaid ? 'Yes' : 'No'];
  });
  downloadBlob(new Blob([generateCsv(['Lot Number', 'Title', 'Description', 'Donor', 'Category', 'FMV', 'Starting Bid', 'Minimum Increment', 'Buy Now', 'Winner', 'Winning Bid', 'Paid'], rows)], { type: 'text/csv' }), 'auction-items.csv');
}

function downloadTemplate(type) {
  if (type === 'donors') {
    downloadBlob(new Blob([generateCsv(['Contact Name', 'Business', 'Email', 'Phone', 'Address', 'Notes'], [['Sample Donor', 'Example Bookshop', 'donor@example.org', '415-555-0100', '123 Example St', 'Replace this sample row before importing']])], { type: 'text/csv' }), 'donor-template.csv');
    return;
  }
  downloadBlob(new Blob([generateCsv(['Lot Number', 'Title', 'Description', 'Donor', 'Category', 'FMV', 'Starting Bid', 'Minimum Increment', 'Buy Now'], [['1', 'Sample Gift Basket', 'Replace this sample row before importing', 'Example Bookshop', 'Gift basket', '150', '40', '10', '']])], { type: 'text/csv' }), 'item-template.csv');
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field.trim());
      field = '';
    } else if (char === '\n') {
      row.push(field.trim());
      if (row.some((cell) => cell !== '')) {
        rows.push(row);
      }
      row = [];
      field = '';
    } else if (char !== '\r') {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field.trim());
    if (row.some((cell) => cell !== '')) {
      rows.push(row);
    }
  }
  return rows;
}

function detectCsvColumns(headers, type) {
  const normalized = headers.map((header) => normalizeComparable(header).replace(/[^a-z0-9]/g, ''));
  const patterns = type === 'donors'
    ? {
        name: ['name', 'contactname', 'contact', 'donorname'],
        business: ['business', 'businessname', 'company', 'organization'],
        email: ['email', 'mail'],
        phone: ['phone', 'tel'],
        address: ['address', 'street', 'mailing'],
        notes: ['notes', 'note', 'comments']
      }
    : {
        lotNumber: ['lot', 'lotnumber', 'itemnumber'],
        title: ['title', 'itemtitle', 'name'],
        description: ['description', 'desc', 'details'],
        donor: ['donor', 'business'],
        category: ['category', 'type'],
        fmv: ['fmv', 'value', 'fairmarketvalue'],
        startingBid: ['startingbid', 'startbid', 'start'],
        increment: ['increment', 'bidincrement'],
        buyNow: ['buynow', 'buyprice']
      };

  const mapping = {};
  Object.entries(patterns).forEach(([field, options]) => {
    const matchIndex = normalized.findIndex((value) => options.some((option) => value.includes(option)));
    if (matchIndex >= 0) {
      mapping[field] = matchIndex;
    }
  });
  return mapping;
}

function donorImportKey(name, business) {
  const normalizedName = normalizeComparable(name);
  if (!normalizedName) {
    return '';
  }
  return `${normalizedName}::${normalizeComparable(business)}`;
}

function itemImportKey(item, donorsById) {
  const normalizedTitle = normalizeComparable(item.title);
  if (!normalizedTitle) {
    return '';
  }
  const donor = donorsById ? donorsById.get(item.donorId) : null;
  const donorPart = donor
    ? normalizeComparable(donor.name) + '::' + normalizeComparable(donor.business)
    : normalizeComparable(item.donorId);
  return [
    normalizedTitle,
    donorPart,
    normalizeComparable(item.category)
  ].join('::');
}

function mergeImportedText(existingValue, importedValue) {
  return importedValue ? importedValue : existingValue;
}

function mergeImportedMoney(existingValue, importedValue) {
  return importedValue !== null ? importedValue : existingValue;
}

function findExistingDonorForImport(donor, donorsByKey) {
  const exactKey = donorImportKey(donor.name, donor.business);
  if (exactKey && donorsByKey.has(exactKey)) {
    return donorsByKey.get(exactKey);
  }
  const nameMatches = state.donors.filter((entry) => normalizeComparable(entry.name) === normalizeComparable(donor.name));
  if (nameMatches.length === 1) {
    return nameMatches[0];
  }
  return null;
}

function mergeImportedDonor(existing, imported) {
  existing.name = imported.name;
  existing.business = mergeImportedText(existing.business, imported.business);
  existing.email = mergeImportedText(existing.email, imported.email);
  existing.phone = mergeImportedText(existing.phone, imported.phone);
  existing.address = mergeImportedText(existing.address, imported.address);
  existing.notes = mergeImportedText(existing.notes, imported.notes);
}

function findExistingItemForImport(item, itemsByLot, itemsByKey, donorsById) {
  const lotKey = normalizeComparable(item.lotNumber);
  if (lotKey && itemsByLot.has(lotKey)) {
    return itemsByLot.get(lotKey);
  }
  const key = itemImportKey(item, donorsById);
  return key && itemsByKey.has(key) ? itemsByKey.get(key) : null;
}

function itemImportKeysMatch(left, right, donorsById) {
  const leftKey = itemImportKey(left, donorsById);
  const rightKey = itemImportKey(right, donorsById);
  return Boolean(leftKey && rightKey && leftKey === rightKey);
}

function hasConflictingImportedLot(item, itemsByLot, donorsById) {
  const lotKey = normalizeComparable(item.lotNumber);
  if (!lotKey) {
    return false;
  }
  const existingItem = itemsByLot.get(lotKey);
  return Boolean(existingItem && !itemImportKeysMatch(existingItem, item, donorsById));
}

function mergeImportedItem(existing, imported) {
  existing.lotNumber = mergeImportedText(existing.lotNumber, imported.lotNumber);
  existing.title = imported.title;
  existing.description = mergeImportedText(existing.description, imported.description);
  existing.donorId = mergeImportedText(existing.donorId, imported.donorId);
  existing.category = mergeImportedText(existing.category, imported.category);
  existing.fmv = mergeImportedMoney(existing.fmv, imported.fmv);
  existing.startingBid = mergeImportedMoney(existing.startingBid, imported.startingBid);
  existing.increment = mergeImportedMoney(existing.increment, imported.increment);
  existing.buyNow = mergeImportedMoney(existing.buyNow, imported.buyNow);
}

function openCsvModal(type, trigger = document.activeElement) {
  ui.csvImport = { type, headers: [], rows: [], mapping: {} };
  document.getElementById('csvModalTitle').textContent = type === 'donors' ? 'Import donors CSV' : 'Import items CSV';
  document.getElementById('csvFileInput').value = '';
  document.getElementById('csvStatus').textContent = 'Choose a CSV file to preview. Blank cells keep existing values when a matching record is updated.';
  renderCsvExampleIntro();
  document.getElementById('csvMappingWrap').innerHTML = '';
  document.getElementById('csvPreviewWrap').innerHTML = '';
  document.getElementById('confirmCsvImportButton').disabled = true;
  openModal('csvModal', 'csvFileInput', trigger);
}

function closeCsvModal() {
  document.getElementById('csvExampleWrap').innerHTML = '';
  closeModal('csvModal');
}

function renderCsvMapping() {
  const fields = ui.csvImport.type === 'donors'
    ? [['name', 'Contact name'], ['business', 'Business'], ['email', 'Email'], ['phone', 'Phone'], ['address', 'Address'], ['notes', 'Notes']]
    : [['lotNumber', 'Lot number'], ['title', 'Item title'], ['description', 'Description'], ['donor', 'Donor'], ['category', 'Category'], ['fmv', 'FMV'], ['startingBid', 'Starting bid'], ['increment', 'Minimum increment'], ['buyNow', 'Buy now']];

  document.getElementById('csvMappingWrap').innerHTML = `
    <div class="form-grid">
      ${fields.map(([field, label]) => `
        <label class="field">
          <span>${escapeHtml(label)}</span>
          <select id="csv-map-${field}">
            <option value="">Skip</option>
            ${ui.csvImport.headers.map((header, index) => `<option value="${index}" ${ui.csvImport.mapping[field] === index ? 'selected' : ''}>${escapeHtml(header)}</option>`).join('')}
          </select>
        </label>
      `).join('')}
    </div>
  `;

  document.getElementById('csvPreviewWrap').innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>${ui.csvImport.headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${ui.csvImport.rows.slice(0, 5).map((row) => `<tr>${ui.csvImport.headers.map((_, index) => `<td>${escapeHtml(row[index] || '')}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function validateDonorRecord(donor) {
  if (!donor.name) {
    return 'Contact name is required.';
  }
  return '';
}

function validateItemRecord(item, existingId = '') {
  if (!item.lotNumber) {
    return 'Lot number is required.';
  }
  if (!item.title) {
    return 'Item title is required.';
  }
  const duplicate = state.items.find((entry) => normalizeComparable(entry.lotNumber) === normalizeComparable(item.lotNumber) && entry.id !== existingId);
  if (duplicate) {
    return `Lot number ${item.lotNumber} is already in use.`;
  }
  return '';
}

function updateEventSettings() {
  state.settings.orgName = document.getElementById('orgName').value.trim();
  state.settings.eventName = document.getElementById('eventName').value.trim();
  state.settings.eventDate = document.getElementById('eventDate').value;
  renderSidebar();
  renderOverview(false);
  renderDocumentsView(false);
  saveState('Settings saved');
}

function updateDocumentSettings() {
  state.settings.bidLineCount = clampNumber(document.getElementById('bidLineCount').value, 10, 6, 30);
  state.settings.bidSheetHeaderText = document.getElementById('bidSheetHeaderText').value.trim();
  state.settings.bidSheetFooterText = document.getElementById('bidSheetFooterText').value.trim();
  state.settings.itemListHeaderText = document.getElementById('itemListHeaderText').value.trim();
  state.settings.itemListFooterText = document.getElementById('itemListFooterText').value.trim();
  state.settings.thankYouHeaderText = document.getElementById('thankYouHeaderText').value.trim();
  // Preserve intentional blank lines and indentation in the letter template.
  state.settings.thankYouBodyText = document.getElementById('thankYouBodyText').value;
  state.settings.thankYouSignature = document.getElementById('thankYouSignature').value.trim();
  renderDocumentsView(false);
  saveState('Document settings saved');
}

function handleLogoUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) {
    return;
  }
  if (file.size > 1024 * 1024) {
    showBanner('error', 'Please use a logo smaller than 1 MB.');
    event.target.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    state.settings.logo = typeof reader.result === 'string' ? reader.result : null;
    renderLogoPreview();
    renderDocumentsView();
    saveState('Logo saved');
  };
  reader.readAsDataURL(file);
}

function upsertDonor(event) {
  event.preventDefault();
  const donorId = document.getElementById('donorId').value;
  const donor = {
    id: donorId || generateId(),
    name: document.getElementById('donorName').value.trim(),
    business: document.getElementById('donorBusiness').value.trim(),
    email: document.getElementById('donorEmail').value.trim(),
    phone: document.getElementById('donorPhone').value.trim(),
    address: document.getElementById('donorAddress').value.trim(),
    notes: document.getElementById('donorNotes').value.trim()
  };
  const error = validateDonorRecord(donor);
  if (error) {
    showBanner('error', error);
    return;
  }
  const index = state.donors.findIndex((entry) => entry.id === donor.id);
  if (index >= 0) {
    state.donors[index] = donor;
  } else {
    state.donors.push(donor);
  }
  renderDonorForm();
  populateDonorAndCategoryOptions();
  renderDonorTable();
  renderItemTable();
  renderOverview();
  renderDocumentsView();
  saveState('Donor saved');
}

function upsertItem(event) {
  event.preventDefault();
  const itemId = document.getElementById('itemId').value;
  const item = {
    id: itemId || generateId(),
    lotNumber: document.getElementById('itemLotNumber').value.trim(),
    title: document.getElementById('itemTitle').value.trim(),
    donorId: document.getElementById('itemDonor').value,
    category: document.getElementById('itemCategory').value,
    description: document.getElementById('itemDescription').value.trim(),
    fmv: toMoney(document.getElementById('itemFmv').value),
    startingBid: toMoney(document.getElementById('itemStartingBid').value),
    increment: toMoney(document.getElementById('itemIncrement').value),
    buyNow: toMoney(document.getElementById('itemBuyNow').value),
    status: state.winners.some((winner) => winner.itemId === itemId) ? 'sold' : 'available'
  };
  const error = validateItemRecord(item, itemId);
  if (error) {
    showBanner('error', error);
    return;
  }
  const index = state.items.findIndex((entry) => entry.id === item.id);
  if (index >= 0) {
    state.items[index] = item;
  } else {
    state.items.push(item);
  }
  state.categories = uniqueStrings([...state.categories, item.category]);
  renderItemForm();
  populateDonorAndCategoryOptions();
  renderItemTable();
  renderOverview();
  renderDocumentsView();
  renderCheckout();
  saveState('Item saved');
}

function startLayoutDrag(event) {
  const target = event.target.closest('[data-layout-block]');
  if (!target) {
    if (ui.selectedLayoutBlockId) {
      ui.selectedLayoutBlockId = null;
      renderLayoutCanvas();
      renderInspector();
    }
    return;
  }
  const blockId = target.dataset.layoutBlock;
  ui.selectedLayoutBlockId = blockId;
  const block = selectedLayoutBlock();
  const canvasRect = document.getElementById('layoutCanvas').getBoundingClientRect();
  ui.dragState = {
    blockId,
    startX: event.clientX,
    startY: event.clientY,
    startBlockX: block.x,
    startBlockY: block.y,
    canvasRect,
    pointerId: event.pointerId,
    pointerTarget: target,
    blockElement: target
  };
  target.setPointerCapture(event.pointerId);
  document.querySelector('#layoutCanvas .is-selected')?.classList.remove('is-selected');
  target.classList.add('is-selected');
  renderInspector();
}

function handleLayoutDrag(event) {
  if (!ui.dragState) {
    return;
  }
  const block = layoutBlocksForCurrentType().find((entry) => entry.id === ui.dragState.blockId);
  if (!block) {
    return;
  }
  const dx = ((event.clientX - ui.dragState.startX) / ui.dragState.canvasRect.width) * 100;
  const dy = ((event.clientY - ui.dragState.startY) / ui.dragState.canvasRect.height) * 100;
  block.x = clampNumber(ui.dragState.startBlockX + dx, block.x, 0, 100 - block.w);
  block.y = clampNumber(ui.dragState.startBlockY + dy, block.y, 0, 100 - block.h);
  ui.dragState.blockElement.style.left = `${block.x}%`;
  ui.dragState.blockElement.style.top = `${block.y}%`;
  const inspectorX = document.querySelector('[data-inspector="x"]');
  const inspectorY = document.querySelector('[data-inspector="y"]');
  if (inspectorX) {
    inspectorX.value = String(block.x);
  }
  if (inspectorY) {
    inspectorY.value = String(block.y);
  }
}

function stopLayoutDrag(event) {
  if (!ui.dragState) {
    return;
  }
  const block = layoutBlocksForCurrentType().find((entry) => entry.id === ui.dragState.blockId);
  const moved = block && (block.x !== ui.dragState.startBlockX || block.y !== ui.dragState.startBlockY);
  if (event && event.pointerId === ui.dragState.pointerId && ui.dragState.pointerTarget.hasPointerCapture(event.pointerId)) {
    ui.dragState.pointerTarget.releasePointerCapture(event.pointerId);
  }
  ui.dragState = null;
  renderLayoutCanvas();
  renderInspector();
  if (moved) {
    renderDocumentPreview();
    saveState('Layout updated');
  }
}

function updateSelectedBlockSetting(setting, value, options = {}) {
  const { rerenderInspector = true } = options;
  const block = selectedLayoutBlock();
  if (!block) {
    return;
  }
  if (setting === 'showLabel' || setting === 'visible') {
    block[setting] = value;
  } else if (['x', 'y', 'w', 'h', 'fontSize'].includes(setting)) {
    let bounds;
    if (setting === 'fontSize') {
      bounds = [8, 48];
    } else if (setting === 'x') {
      bounds = [0, 100 - block.w];
    } else if (setting === 'y') {
      bounds = [0, 100 - block.h];
    } else if (setting === 'w') {
      bounds = [4, 100 - block.x];
    } else if (setting === 'h') {
      bounds = [2, 100 - block.y];
    }
    block[setting] = clampNumber(value, block[setting], bounds[0], bounds[1]);
  } else {
    block[setting] = value;
  }
  renderLayoutCanvas();
  if (rerenderInspector) {
    renderInspector();
  }
  renderDocumentPreview();
  saveState('Layout updated');
}

function addCustomTextBlock() {
  const blocks = layoutBlocksForCurrentType();
  const newBlock = blockText(generateId(), 'Custom text', 'Edit this note', { x: 12, y: 12, w: 40, h: 8, multiline: true });
  blocks.push(newBlock);
  ui.selectedLayoutBlockId = newBlock.id;
  renderDocumentsView();
  saveState('Text block added');
}

function resetCurrentLayout() {
  if (!window.confirm(`Reset the ${state.settings.layouts[ui.selectedDocumentType].name} layout to its default positions?`)) {
    return;
  }
  state.settings.layouts[ui.selectedDocumentType] = defaultLayouts()[ui.selectedDocumentType];
  ui.selectedLayoutBlockId = null;
  renderDocumentsView();
  saveState('Layout reset');
}

function removeSelectedTextBlock() {
  const block = selectedLayoutBlock();
  if (!block || block.kind !== 'text') {
    return;
  }
  if (!window.confirm('Remove this custom text block?')) {
    return;
  }
  state.settings.layouts[ui.selectedDocumentType].blocks = layoutBlocksForCurrentType().filter((entry) => entry.id !== block.id);
  ui.selectedLayoutBlockId = null;
  renderDocumentsView();
  saveState('Text block removed');
}

function printCurrentDocumentSet() {
  const contexts = buildDocumentContexts(ui.selectedDocumentType, true, donorLookup());
  if (!contexts.length) {
    showBanner('warning', 'There is no data available for this document type yet.');
    return;
  }
  document.getElementById('printRoot').innerHTML = contexts.map((context) => renderDocumentPage(ui.selectedDocumentType, context, false)).join('');
  window.print();
}

function loadSampleAuction() {
  if (hasData() && !isSampleMode() && !window.confirm('Replace the current auction data in this browser with the sample auction?')) {
    return;
  }
  state = createSampleAuctionState();
  ui.selectedLayoutBlockId = null;
  ui.activeView = 'overview';
  ui.storageError = '';
  renderAll();
  saveState('Sample data loaded', { preserveSeedMode: true });
  showBanner('success', 'Sample auction loaded. Explore the app, then clear it later from Data when you are ready for your real event.');
}

function startBlankAuction() {
  const message = isSampleMode()
    ? 'Remove the sample auction and start with a blank auction in this browser?'
    : 'Clear all auction data from this browser and start with a blank auction?';
  if (hasData() && !window.confirm(message)) {
    return;
  }
  state = createDefaultState();
  ui.selectedLayoutBlockId = null;
  ui.activeView = 'overview';
  ui.storageError = '';
  renderAll();
  saveState('Blank auction ready', { preserveSeedMode: true });
  showBanner('success', 'You are now starting with a blank auction.');
}

function clearAllData() {
  startBlankAuction();
}

function handleOnboardingAction(action) {
  if (action === 'load-sample') {
    if (ui.modal) {
      closeModal(ui.modal.id);
    }
    loadSampleAuction();
    return;
  }
  if (action === 'start-blank') {
    if (ui.modal) {
      closeModal(ui.modal.id);
    }
    startBlankAuction();
    return;
  }
  if (action === 'jump-donors') {
    switchView('donors');
    return;
  }
  if (action === 'jump-items') {
    switchView('items');
    return;
  }
  if (action === 'jump-documents') {
    switchView('documents');
    return;
  }
  if (action === 'jump-data') {
    switchView('data');
    return;
  }
  if (action === 'download-donor-template') {
    downloadTemplate('donors');
    return;
  }
  if (action === 'download-item-template') {
    downloadTemplate('items');
  }
}

function handleJsonImport(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = normalizeState(JSON.parse(String(reader.result || '')));
      if (!window.confirm('Replace the current auction data in this browser with this backup?')) {
        return;
      }
      state = imported;
      ui.selectedLayoutBlockId = null;
      ui.storageError = '';
      renderAll();
      saveState('Backup restored');
      showBanner('success', 'Backup restored successfully.');
    } catch (error) {
      showBanner('error', 'That file could not be read as a valid auction backup.');
    } finally {
      event.target.value = '';
    }
  };
  reader.readAsText(file);
}

function handleCsvFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file || !ui.csvImport) {
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const rows = parseCsv(String(reader.result || ''));
    if (rows.length < 2) {
      document.getElementById('csvStatus').textContent = 'This CSV needs a header row and at least one data row.';
      document.getElementById('confirmCsvImportButton').disabled = true;
      return;
    }
    ui.csvImport.headers = rows[0];
    ui.csvImport.rows = rows.slice(1);
    ui.csvImport.mapping = detectCsvColumns(ui.csvImport.headers, ui.csvImport.type);
    document.getElementById('csvStatus').textContent = `${ui.csvImport.rows.length} row(s) ready to review. Blank cells keep existing values when a matching record is updated.`;
    document.getElementById('confirmCsvImportButton').disabled = false;
    renderCsvMapping();
  };
  reader.readAsText(file);
}

function applyCsvImport() {
  if (!ui.csvImport) {
    return;
  }
  const fields = ui.csvImport.type === 'donors'
    ? ['name', 'business', 'email', 'phone', 'address', 'notes']
    : ['lotNumber', 'title', 'description', 'donor', 'category', 'fmv', 'startingBid', 'increment', 'buyNow'];
  const mapping = {};
  fields.forEach((field) => {
    const element = document.getElementById(`csv-map-${field}`);
    if (element && element.value !== '') {
      mapping[field] = Number(element.value);
    }
  });

  if (ui.csvImport.type === 'donors' && mapping.name === undefined) {
    showBanner('error', 'Contact name is required for donor import.');
    return;
  }
  if (ui.csvImport.type === 'items' && mapping.title === undefined) {
    showBanner('error', 'Item title is required for item import.');
    return;
  }

  const summary = { added: 0, updated: 0, skipped: 0 };
  let importMessageType = 'success';
  let importMessageNote = '';
  if (ui.csvImport.type === 'donors') {
    const donorsByKey = new Map(
      state.donors
        .map((donor) => [donorImportKey(donor.name, donor.business), donor])
        .filter(([key]) => key)
    );
    ui.csvImport.rows.forEach((row) => {
      const donor = {
        id: generateId(),
        name: toText(row[mapping.name]).trim(),
        business: mapping.business !== undefined ? toText(row[mapping.business]).trim() : '',
        email: mapping.email !== undefined ? toText(row[mapping.email]).trim() : '',
        phone: mapping.phone !== undefined ? toText(row[mapping.phone]).trim() : '',
        address: mapping.address !== undefined ? toText(row[mapping.address]).trim() : '',
        notes: mapping.notes !== undefined ? toText(row[mapping.notes]).trim() : ''
      };
      if (!donor.name) {
        summary.skipped += 1;
        return;
      }
      const existingDonor = findExistingDonorForImport(donor, donorsByKey);
      if (existingDonor) {
        const previousKey = donorImportKey(existingDonor.name, existingDonor.business);
        mergeImportedDonor(existingDonor, donor);
        if (previousKey) {
          donorsByKey.delete(previousKey);
        }
        donorsByKey.set(donorImportKey(existingDonor.name, existingDonor.business), existingDonor);
        summary.updated += 1;
        return;
      }
      state.donors.push(donor);
      donorsByKey.set(donorImportKey(donor.name, donor.business), donor);
      summary.added += 1;
    });
  } else {
    const donorsById = donorLookup();
    const itemsByLot = new Map(
      state.items
        .map((item) => [normalizeComparable(item.lotNumber), item])
        .filter(([key]) => key)
    );
    const itemsByKey = new Map(
      state.items
        .map((item) => [itemImportKey(item, donorsById), item])
        .filter(([key]) => key)
    );
    const conflictingLots = new Set();
    let nextLot = Number.parseInt(nextLotNumber(), 10) || 1;
    ui.csvImport.rows.forEach((row) => {
      const title = mapping.title !== undefined ? toText(row[mapping.title]).trim() : '';
      if (!title) {
        summary.skipped += 1;
        return;
      }

      let donorId = '';
      let pendingDonor = null;
      if (mapping.donor !== undefined) {
        const donorName = toText(row[mapping.donor]).trim();
        if (donorName) {
          let donor = state.donors.find((entry) => [entry.name, entry.business].map(normalizeComparable).includes(normalizeComparable(donorName)));
          if (!donor) {
            donor = { id: generateId(), name: donorName, business: '', email: '', phone: '', address: '', notes: '' };
            pendingDonor = donor;
          }
          donorId = donor.id;
        }
      }

      const importedItem = {
        id: generateId(),
        lotNumber: mapping.lotNumber !== undefined ? toText(row[mapping.lotNumber]).trim() : '',
        title,
        description: mapping.description !== undefined ? toText(row[mapping.description]).trim() : '',
        donorId,
        category: mapping.category !== undefined ? toText(row[mapping.category]).trim() : '',
        fmv: mapping.fmv !== undefined ? toMoney(row[mapping.fmv]) : null,
        startingBid: mapping.startingBid !== undefined ? toMoney(row[mapping.startingBid]) : null,
        increment: mapping.increment !== undefined ? toMoney(row[mapping.increment]) : null,
        buyNow: mapping.buyNow !== undefined ? toMoney(row[mapping.buyNow]) : null,
        status: 'available'
      };

      if (pendingDonor) {
        donorsById.set(pendingDonor.id, pendingDonor);
      }

      if (hasConflictingImportedLot(importedItem, itemsByLot, donorsById)) {
        if (pendingDonor) {
          donorsById.delete(pendingDonor.id);
        }
        conflictingLots.add(importedItem.lotNumber);
        summary.skipped += 1;
        return;
      }

      if (pendingDonor) {
        state.donors.push(pendingDonor);
      }

      const existingItem = findExistingItemForImport(importedItem, itemsByLot, itemsByKey, donorsById);
      if (existingItem) {
        const previousLotKey = normalizeComparable(existingItem.lotNumber);
        const previousItemKey = itemImportKey(existingItem, donorsById);
        mergeImportedItem(existingItem, importedItem);
        if (previousLotKey) {
          itemsByLot.delete(previousLotKey);
        }
        if (previousItemKey) {
          itemsByKey.delete(previousItemKey);
        }
        if (normalizeComparable(existingItem.lotNumber)) {
          itemsByLot.set(normalizeComparable(existingItem.lotNumber), existingItem);
        }
        const updatedItemKey = itemImportKey(existingItem, donorsById);
        if (updatedItemKey) {
          itemsByKey.set(updatedItemKey, existingItem);
        }
        summary.updated += 1;
        return;
      }

      importedItem.lotNumber = importedItem.lotNumber || String(nextLot);
      state.items.push(importedItem);
      itemsByLot.set(normalizeComparable(importedItem.lotNumber), importedItem);
      itemsByKey.set(itemImportKey(importedItem, donorsById), importedItem);
      nextLot += 1;
      summary.added += 1;
    });
    if (conflictingLots.size) {
      importMessageType = 'warning';
      importMessageNote = ` Conflicting lot numbers skipped: ${Array.from(conflictingLots).join(', ')}.`;
    }
  }

  state.categories = uniqueStrings([...state.categories, ...state.items.map((item) => item.category)]);
  closeCsvModal();
  renderAll();
  const label = ui.csvImport.type === 'donors' ? 'donor' : 'item';
  saveState(`Imported ${summary.added + summary.updated} row(s)`);
  showBanner(importMessageType, `${summary.added + summary.updated} ${label} row(s) processed: ${summary.added} added, ${summary.updated} updated, ${summary.skipped} skipped.${importMessageNote}`);
}

function removeDonor(donorId) {
  const linkedCount = countItemsForDonor(donorId);
  const confirmed = window.confirm(linkedCount
    ? `This donor is linked to ${linkedCount} item(s). Delete the donor and leave those items without a donor?`
    : 'Delete this donor?');
  if (!confirmed) {
    return;
  }
  state.items.forEach((item) => {
    if (item.donorId === donorId) {
      item.donorId = '';
    }
  });
  state.donors = state.donors.filter((donor) => donor.id !== donorId);
  renderAll();
  saveState('Donor deleted');
}

function removeItem(itemId) {
  const hasWinner = state.winners.some((winner) => winner.itemId === itemId);
  const confirmed = window.confirm(hasWinner
    ? 'This item has a recorded winner. Delete the item and remove that winner too?'
    : 'Delete this item?');
  if (!confirmed) {
    return;
  }
  state.items = state.items.filter((item) => item.id !== itemId);
  state.winners = state.winners.filter((winner) => winner.itemId !== itemId);
  renderAll();
  saveState('Item deleted');
}

function removeCategory(category) {
  const linked = state.items.filter((item) => item.category === category).length;
  if (!window.confirm(linked ? `Remove category "${category}" from ${linked} item(s)?` : `Remove category "${category}"?`)) {
    return;
  }
  state.items.forEach((item) => {
    if (item.category === category) {
      item.category = '';
    }
  });
  state.categories = state.categories.filter((entry) => entry !== category);
  renderAll();
  saveState('Category removed');
}

function renumberLots() {
  if (!state.items.length) {
    return;
  }
  if (!window.confirm('Renumber lots starting at 1 in the current lot order?')) {
    return;
  }
  state.items
    .slice()
    .sort((left, right) => left.lotNumber.localeCompare(right.lotNumber, undefined, { numeric: true, sensitivity: 'base' }))
    .forEach((item, index) => {
      item.lotNumber = String(index + 1);
    });
  renderAll();
  saveState('Lots renumbered');
}

function toggleWinnerPaid(winnerId) {
  const winner = state.winners.find((entry) => entry.id === winnerId);
  if (!winner) {
    return;
  }
  winner.isPaid = !winner.isPaid;
  renderCheckout();
  renderOverview();
  saveState('Winner updated');
}

function removeWinner(winnerId) {
  if (!window.confirm('Remove this winner record?')) {
    return;
  }
  const winner = state.winners.find((entry) => entry.id === winnerId);
  if (!winner) {
    return;
  }
  const item = state.items.find((entry) => entry.id === winner.itemId);
  if (item) {
    item.status = 'available';
  }
  state.winners = state.winners.filter((entry) => entry.id !== winnerId);
  renderCheckout();
  renderItemTable();
  renderOverview();
  saveState('Winner removed');
}

function renderAll() {
  renderSaveStatus('Saved');
  renderSidebar();
  renderBannerFromState();
  renderOverview();
  populateDonorAndCategoryOptions();
  renderDonorForm();
  renderDonorTable();
  renderItemForm();
  renderItemTable();
  renderDocumentsView();
  renderCheckout();
  switchView(ui.activeView);
}

document.querySelectorAll('.nav-link').forEach((button) => {
  button.addEventListener('click', () => switchView(button.dataset.view));
});

document.querySelectorAll('[data-jump-view]').forEach((button) => {
  button.addEventListener('click', () => switchView(button.dataset.jumpView));
});

document.getElementById('banner').addEventListener('click', (event) => {
  const action = event.target.closest('[data-onboarding-action]')?.dataset.onboardingAction;
  if (action) {
    handleOnboardingAction(action);
  }
});

['heroActions'].forEach((id) => {
  document.getElementById(id).addEventListener('click', (event) => {
    const action = event.target.closest('[data-onboarding-action]')?.dataset.onboardingAction;
    if (action) {
      handleOnboardingAction(action);
    }
  });
});

document.getElementById('quickBackupButton').addEventListener('click', exportJson);
document.getElementById('removeLogoButton').addEventListener('click', () => {
  state.settings.logo = null;
  document.getElementById('logoUpload').value = '';
  renderLogoPreview();
  renderDocumentsView();
  saveState('Logo removed');
});

['orgName', 'eventName', 'eventDate'].forEach((id) => {
  document.getElementById(id).addEventListener('input', updateEventSettings);
  document.getElementById(id).addEventListener('change', updateEventSettings);
});
document.getElementById('logoUpload').addEventListener('change', handleLogoUpload);

document.getElementById('donorForm').addEventListener('submit', upsertDonor);
document.getElementById('clearDonorButton').addEventListener('click', () => renderDonorForm());
document.getElementById('donorSearch').addEventListener('input', renderDonorTable);
document.getElementById('donorSort').addEventListener('change', renderDonorTable);
document.getElementById('donorTableWrap').addEventListener('click', (event) => {
  const editId = event.target.getAttribute('data-donor-edit');
  const deleteId = event.target.getAttribute('data-donor-delete');
  if (editId) {
    renderDonorForm(state.donors.find((donor) => donor.id === editId));
  }
  if (deleteId) {
    removeDonor(deleteId);
  }
});

document.getElementById('itemForm').addEventListener('submit', upsertItem);
document.getElementById('clearItemButton').addEventListener('click', () => renderItemForm());
document.getElementById('renumberLotsButton').addEventListener('click', renumberLots);
document.getElementById('itemSearch').addEventListener('input', renderItemTable);
document.getElementById('itemCategoryFilter').addEventListener('change', renderItemTable);
document.getElementById('itemSort').addEventListener('change', renderItemTable);
document.getElementById('addCategoryButton').addEventListener('click', () => {
  const input = document.getElementById('newCategory');
  const value = input.value.trim();
  if (!value) {
    return;
  }
  state.categories = uniqueStrings([...state.categories, value]);
  input.value = '';
  populateDonorAndCategoryOptions();
  saveState('Category saved');
});
document.getElementById('categoryList').addEventListener('click', (event) => {
  const category = event.target.getAttribute('data-category-remove');
  if (category) {
    removeCategory(category);
  }
});
document.getElementById('itemTableWrap').addEventListener('click', (event) => {
  const editId = event.target.getAttribute('data-item-edit');
  const deleteId = event.target.getAttribute('data-item-delete');
  if (editId) {
    renderItemForm(state.items.find((item) => item.id === editId));
  }
  if (deleteId) {
    removeItem(deleteId);
  }
});

document.getElementById('documentTypeSelect').addEventListener('change', (event) => {
  ui.selectedDocumentType = event.target.value;
  ui.selectedLayoutBlockId = null;
  renderDocumentsView();
});
document.getElementById('documentCategoryFilter').addEventListener('change', renderDocumentsView);
['bidLineCount', 'bidSheetHeaderText', 'bidSheetFooterText', 'itemListHeaderText', 'itemListFooterText', 'thankYouHeaderText', 'thankYouBodyText', 'thankYouSignature']
  .forEach((id) => {
    document.getElementById(id).addEventListener('input', updateDocumentSettings);
    document.getElementById(id).addEventListener('change', updateDocumentSettings);
  });
document.getElementById('layoutCanvas').addEventListener('pointerdown', startLayoutDrag);
document.addEventListener('pointermove', handleLayoutDrag);
document.addEventListener('pointerup', stopLayoutDrag);
document.getElementById('layoutInspector').addEventListener('input', (event) => {
  const field = event.target.getAttribute('data-inspector');
  if (!field) {
    return;
  }
  if (event.target.type === 'checkbox') {
    updateSelectedBlockSetting(field, event.target.checked, { rerenderInspector: false });
  } else {
    updateSelectedBlockSetting(field, event.target.value, { rerenderInspector: false });
  }
});
document.getElementById('layoutInspector').addEventListener('change', (event) => {
  const field = event.target.getAttribute('data-inspector');
  if (!field) {
    return;
  }
  if (event.target.type === 'checkbox') {
    updateSelectedBlockSetting(field, event.target.checked);
  } else {
    updateSelectedBlockSetting(field, event.target.value);
  }
});
document.getElementById('layoutInspector').addEventListener('click', (event) => {
  if (event.target.id === 'removeSelectedTextBlockButton') {
    removeSelectedTextBlock();
  }
});
document.getElementById('addTextBlockButton').addEventListener('click', addCustomTextBlock);
document.getElementById('resetLayoutButton').addEventListener('click', resetCurrentLayout);
document.getElementById('refreshPreviewButton').addEventListener('click', renderDocumentsView);
document.getElementById('printDocumentButton').addEventListener('click', printCurrentDocumentSet);

document.getElementById('checkoutSearch').addEventListener('input', renderCheckoutSearchResults);
document.getElementById('winnerSearch').addEventListener('input', renderWinnerList);
document.getElementById('winnerFilter').addEventListener('change', renderWinnerList);
document.getElementById('checkoutSearchResults').addEventListener('click', (event) => {
  const itemId = event.target.getAttribute('data-record-winner');
  if (itemId) {
    openWinnerModal(itemId, null, event.target.closest('button'));
  }
});
document.getElementById('winnerList').addEventListener('click', (event) => {
  const editId = event.target.getAttribute('data-edit-winner');
  const toggleId = event.target.getAttribute('data-toggle-paid');
  const removeId = event.target.getAttribute('data-remove-winner');
  if (editId) {
    const winner = state.winners.find((entry) => entry.id === editId);
    if (winner) {
      openWinnerModal(winner.itemId, winner, event.target.closest('button'));
    }
  }
  if (toggleId) {
    toggleWinnerPaid(toggleId);
  }
  if (removeId) {
    removeWinner(removeId);
  }
});
document.getElementById('closeWinnerModalButton').addEventListener('click', closeWinnerModal);
document.getElementById('saveWinnerButton').addEventListener('click', saveWinner);
document.getElementById('winnerModal').addEventListener('click', (event) => {
  if (event.target.id === 'winnerModal') {
    closeWinnerModal();
  }
});

document.getElementById('exportJsonButton').addEventListener('click', exportJson);
document.getElementById('importJsonButton').addEventListener('click', () => document.getElementById('jsonImportInput').click());
document.getElementById('jsonImportInput').addEventListener('change', handleJsonImport);
document.getElementById('exportHtmlButton').addEventListener('click', exportHtmlArchive);
document.getElementById('importDonorsCsvButton').addEventListener('click', (event) => openCsvModal('donors', event.currentTarget));
document.getElementById('importItemsCsvButton').addEventListener('click', (event) => openCsvModal('items', event.currentTarget));
document.getElementById('downloadDonorTemplateButton').addEventListener('click', () => downloadTemplate('donors'));
document.getElementById('downloadItemTemplateButton').addEventListener('click', () => downloadTemplate('items'));
document.getElementById('exportDonorsCsvButton').addEventListener('click', () => exportCsv('donors'));
document.getElementById('exportItemsCsvButton').addEventListener('click', () => exportCsv('items'));
document.getElementById('exportWinnersCsvButton').addEventListener('click', () => exportCsv('winners'));
document.getElementById('clearAllDataButton').addEventListener('click', clearAllData);

document.getElementById('closeCsvModalButton').addEventListener('click', closeCsvModal);
document.getElementById('csvModal').addEventListener('click', (event) => {
  if (event.target.id === 'csvModal') {
    closeCsvModal();
  }
});
document.getElementById('csvExampleWrap').addEventListener('click', (event) => {
  const action = event.target.closest('[data-onboarding-action]')?.dataset.onboardingAction;
  if (action) {
    handleOnboardingAction(action);
  }
});
document.getElementById('csvFileInput').addEventListener('change', handleCsvFile);
document.getElementById('confirmCsvImportButton').addEventListener('click', applyCsvImport);
document.addEventListener('keydown', handleModalKeydown);
window.addEventListener('beforeunload', () => {
  if (saveTimer) {
    flushPendingSave({ skipRender: true });
  }
});

renderAll();
