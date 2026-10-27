/**
 * M4EX Scheduler — Mission for Excellence
 * JavaScript Application Logic
 */

// --- Application State ---
const state = {
  currentBatch: '',
  currentDay: 'Friday',
  classes: [], // Array of { id, type: 'compulsory'|'extra'|'test', day, duration, subject, teacher, topic, compulsoryFor, attendanceStyle, isOptional }
  onlineNoticeText: 'If anyone needs to attend class in online mode, link is provided in the description of this group.',
  viewMode: 'chat', // 'chat' or 'raw'
  mobileView: 'edit', // 'edit' or 'preview'
  theme: (typeof localStorage !== 'undefined' && localStorage.getItem('m4ex_theme')) || 'dark'
};

// --- Preset Data ---
const BATCH_OPTIONS = [
  '12th A1 batch',
  '12th A2 batch',
  '11th B1 batch',
  '11th B2 batch',
  '10th C1 batch',
  '10th C2 batch',
  '9th class',
  '8th class'
];

const SAMPLE_SCHEDULE = {
  batch: '12th A2 batch',
  day: 'Friday',
  classes: [
    {
      id: 'sample-e1',
      type: 'extra',
      day: 'Friday',
      duration: '1–2 PM',
      subject: 'Chemistry',
      teacher: 'Sumit Sir',
      topic: 'Doubt Class',
      compulsoryFor: 'Parth',
      attendanceStyle: 'compulsory_welcome'
    },
    {
      id: 'sample-e2',
      type: 'extra',
      day: 'Friday',
      duration: '2–4 PM',
      subject: 'Chemistry',
      teacher: 'Sumit Sir',
      topic: 'Electrochemistry Doubt Class',
      compulsoryFor: 'Adhiraj',
      attendanceStyle: 'compulsory_welcome'
    },
    {
      id: 'sample-e3',
      type: 'extra',
      day: 'Friday',
      duration: '4–5 PM',
      subject: 'Physics',
      teacher: 'Sumit Sir',
      topic: 'Wave Optics Class',
      compulsoryFor: 'Khushi',
      attendanceStyle: 'for_only'
    },
    {
      id: 'sample-c1',
      type: 'compulsory',
      day: 'Friday',
      duration: '4.00-5:10PM',
      subject: 'Maths',
      teacher: 'Nitin Sir',
      topic: '',
      compulsoryFor: '',
      attendanceStyle: 'compulsory_welcome'
    },
    {
      id: 'sample-c2',
      type: 'compulsory',
      day: 'Friday',
      duration: '5:15-7.00PM',
      subject: 'Physics',
      teacher: 'Nitin Sir',
      topic: '',
      compulsoryFor: '',
      attendanceStyle: 'compulsory_welcome'
    },
    {
      id: 'sample-c3',
      type: 'compulsory',
      day: 'Friday',
      duration: '7.00-8.00PM',
      subject: 'Chemistry',
      teacher: "Neelam Ma'am",
      topic: '',
      compulsoryFor: '',
      attendanceStyle: 'compulsory_welcome'
    },
    {
      id: 'sample-t1',
      type: 'test',
      isOptional: false,
      day: 'Friday',
      duration: '2.00-3.30PM',
      subject: 'Math',
      topic: 'AoI, Differential eq, LPP'
    }
  ]
};

// --- DOM Elements ---
let dom = {};

function initDom() {
  if (typeof document === 'undefined') return;
  dom = {
    // Screens
    welcomeScreen: document.getElementById('welcomeScreen'),
    builderScreen: document.getElementById('builderScreen'),

    // Initial Batch Selection
    batchSelectInitial: document.getElementById('batchSelectInitial'),
    batchTilesGrid: document.getElementById('batchTilesGrid'),
    btnProceedToBuilder: document.getElementById('btnProceedToBuilder'),
    activeBatchPill: document.getElementById('activeBatchPill'),
    activeBatchName: document.getElementById('activeBatchName'),
    btnSwitchBatch: document.getElementById('btnSwitchBatch'),
    btnThemeToggle: document.getElementById('btnThemeToggle'),

    // Day Selector
    dayPillsContainer: document.getElementById('dayPillsContainer'),

    // Top Bar Actions
    btnLoadExample: document.getElementById('btnLoadExample'),
    btnClearSchedule: document.getElementById('btnClearSchedule'),

    // Online Notice Input
    inputOnlineNoticeText: document.getElementById('inputOnlineNoticeText'),

    // Add Action Buttons
    btnOpenCompulsoryModal: document.getElementById('btnOpenCompulsoryModal'),
    btnOpenExtraModal: document.getElementById('btnOpenExtraModal'),
    btnOpenTestModal: document.getElementById('btnOpenTestModal'),
    scheduleEmptyView: document.getElementById('scheduleEmptyView'),
    emptyDayTitle: document.getElementById('emptyDayTitle'),
    unifiedClassList: document.getElementById('unifiedClassList'),

    // Modal
    classModal: document.getElementById('classModal'),
    modalTypeTabs: document.getElementById('modalTypeTabs'),
    btnCloseModal: document.getElementById('btnCloseModal'),
    btnCancelModal: document.getElementById('btnCancelModal'),
    classForm: document.getElementById('classForm'),
    editClassId: document.getElementById('editClassId'),
    classCategory: document.getElementById('classCategory'),
    btnSaveClass: document.getElementById('btnSaveClass'),

    // Form Inputs
    inputDay: document.getElementById('inputDay'),
    inputDuration: document.getElementById('inputDuration'),
    inputSubject: document.getElementById('inputSubject'),
    customSubjectWrapper: document.getElementById('customSubjectWrapper'),
    inputCustomSubject: document.getElementById('inputCustomSubject'),
    teacherGroup: document.getElementById('teacherGroup'),
    inputTeacher: document.getElementById('inputTeacher'),
    customTeacherWrapper: document.getElementById('customTeacherWrapper'),
    inputCustomTeacher: document.getElementById('inputCustomTeacher'),

    // Extra Fields
    extraFieldsContainer: document.getElementById('extraFieldsContainer'),
    inputTopic: document.getElementById('inputTopic'),
    inputCompulsoryFor: document.getElementById('inputCompulsoryFor'),

    // Test Specific Fields
    testFieldsContainer: document.getElementById('testFieldsContainer'),
    inputTestTopic: document.getElementById('inputTestTopic'),
    inputIsOptionalTest: document.getElementById('inputIsOptionalTest'),

    // Preview & Sharing
    tabFormatted: document.getElementById('tabFormatted'),
    tabRawText: document.getElementById('tabRawText'),
    whatsappChatContainer: document.getElementById('whatsappChatContainer'),
    rawTextContainer: document.getElementById('rawTextContainer'),
    previewFormattedText: document.getElementById('previewFormattedText'),
    rawTextOutput: document.getElementById('rawTextOutput'),
    previewTimestamp: document.getElementById('previewTimestamp'),
    btnShareWhatsApp: document.getElementById('btnShareWhatsApp'),
    btnCopyText: document.getElementById('btnCopyText'),
    toastNotification: document.getElementById('toastNotification'),
    toastMessage: document.getElementById('toastMessage'),

    // Mobile View Controls
    builderGrid: document.querySelector('.builder-grid'),
    btnMobileTabEdit: document.getElementById('btnMobileTabEdit'),
    btnMobileTabPreview: document.getElementById('btnMobileTabPreview'),
    mobileTotalCountBadge: document.getElementById('mobileTotalCountBadge'),
    mobileFloatingBar: document.getElementById('mobileFloatingBar'),
    mobileBarEditContent: document.getElementById('mobileBarEditContent'),
    mobileBarPreviewContent: document.getElementById('mobileBarPreviewContent'),
    mobileFloatingCount: document.getElementById('mobileFloatingCount'),
    mobileFloatingBatch: document.getElementById('mobileFloatingBatch'),
    btnFloatingPreview: document.getElementById('btnFloatingPreview'),
    btnFloatingBack: document.getElementById('btnFloatingBack'),
    btnFloatingShare: document.getElementById('btnFloatingShare'),
    metaThemeColor: document.getElementById('metaThemeColor')
  };
}

// --- Initialization ---
function init() {
  initDom();
  applyTheme(state.theme);
  setupEventListeners();
  loadSavedState();
  updateTimestamp();
}

// --- Theme Management ---
function applyTheme(theme) {
  state.theme = theme;
  if (typeof document !== 'undefined') {
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(`theme-${theme}`);
    const metaTheme = document.getElementById('metaThemeColor');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#0a0e17' : '#f4f6fa');
    }
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('m4ex_theme', theme);
  }
}

function toggleTheme() {
  const newTheme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
}

// --- Event Listeners Setup ---
function setupEventListeners() {
  // Theme Toggle
  dom.btnThemeToggle.addEventListener('click', toggleTheme);

  // Interactive Batch Tiles Grid
  if (dom.batchTilesGrid) {
    dom.batchTilesGrid.addEventListener('click', (e) => {
      const tile = e.target.closest('.batch-tile');
      if (!tile) return;
      const batch = tile.getAttribute('data-batch');
      selectBatchTile(batch);
    });
  }

  // Initial Batch Selection Dropdown
  dom.batchSelectInitial.addEventListener('change', () => {
    selectBatchTile(dom.batchSelectInitial.value);
  });

  dom.btnProceedToBuilder.addEventListener('click', () => {
    const batch = dom.batchSelectInitial.value;
    if (batch) {
      selectBatch(batch);
    }
  });

  // Switch Batch Button
  dom.btnSwitchBatch.addEventListener('click', () => {
    switchToWelcomeScreen();
  });

  // Day Selection Pills
  dom.dayPillsContainer.addEventListener('click', (e) => {
    const pill = e.target.closest('.day-pill');
    if (!pill) return;
    const selectedDay = pill.getAttribute('data-day');
    setScheduleDay(selectedDay);
  });

  // Open Modal Buttons
  dom.btnOpenCompulsoryModal.addEventListener('click', () => openModal('compulsory'));
  dom.btnOpenExtraModal.addEventListener('click', () => openModal('extra'));
  dom.btnOpenTestModal.addEventListener('click', () => openModal('test'));

  // Close Modal
  dom.btnCloseModal.addEventListener('click', closeModal);
  dom.btnCancelModal.addEventListener('click', closeModal);
  dom.classModal.addEventListener('click', (e) => {
    if (e.target === dom.classModal) closeModal();
  });

  // Form Subject Custom toggle
  dom.inputSubject.addEventListener('change', () => {
    if (dom.inputSubject.value === 'custom') {
      dom.customSubjectWrapper.classList.remove('hidden');
      dom.inputCustomSubject.required = true;
      dom.inputCustomSubject.focus();
    } else {
      dom.customSubjectWrapper.classList.add('hidden');
      dom.inputCustomSubject.required = false;
    }
  });

  // Form Teacher Custom toggle
  dom.inputTeacher.addEventListener('change', () => {
    if (dom.inputTeacher.value === 'custom') {
      dom.customTeacherWrapper.classList.remove('hidden');
      dom.inputCustomTeacher.required = true;
      dom.inputCustomTeacher.focus();
    } else {
      dom.customTeacherWrapper.classList.add('hidden');
      dom.inputCustomTeacher.required = false;
    }
  });

  // Modal Category Tabs Switcher
  if (dom.modalTypeTabs) {
    dom.modalTypeTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.modal-type-btn');
      if (!btn) return;
      const type = btn.getAttribute('data-type');
      if (type) {
        setModalCategory(type);
      }
    });
  }

  // Quick Preset Chips (Duration)
  document.querySelectorAll('.preset-chip[data-time]').forEach(chip => {
    chip.addEventListener('click', () => {
      triggerHaptic(10);
      dom.inputDuration.value = chip.getAttribute('data-time');
      highlightActiveChips();
    });
  });

  // Dynamic Chip Highlighting on Manual Duration Input
  if (dom.inputDuration) {
    dom.inputDuration.addEventListener('input', highlightActiveChips);
  }

  // Class Form Submit
  dom.classForm.addEventListener('submit', handleFormSubmit);

  // Tabs
  dom.tabFormatted.addEventListener('click', () => switchViewMode('chat'));
  dom.tabRawText.addEventListener('click', () => switchViewMode('raw'));

  // Sharing Actions
  dom.btnShareWhatsApp.addEventListener('click', shareOnWhatsApp);
  dom.btnCopyText.addEventListener('click', copyScheduleText);
  if (dom.btnDownloadTxt) {
    dom.btnDownloadTxt.addEventListener('click', downloadScheduleTxt);
  }

  // Example & Clear buttons
  dom.btnLoadExample.addEventListener('click', loadSampleSchedule);
  dom.btnClearSchedule.addEventListener('click', confirmClearSchedule);

  // Online Notice Input Listener
  if (dom.inputOnlineNoticeText) {
    dom.inputOnlineNoticeText.addEventListener('input', () => {
      state.onlineNoticeText = dom.inputOnlineNoticeText.value;
      saveState();
      renderSchedule();
    });
  }

  // Close Modal on Backdrop Click
  if (dom.classModal) {
    dom.classModal.addEventListener('click', (e) => {
      if (e.target === dom.classModal) {
        closeModal();
      }
    });
  }

  // Touch Drag-to-Dismiss on Mobile Bottom Sheet
  let sheetTouchStartY = 0;
  const sheetHandle = document.querySelector('.modal-sheet-handle');
  const modalHeader = document.querySelector('.modal-header');

  const onSheetTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      sheetTouchStartY = e.touches[0].clientY;
    }
  };

  const onSheetTouchEnd = (e) => {
    if (e.changedTouches && e.changedTouches[0]) {
      const touchEndY = e.changedTouches[0].clientY;
      if (touchEndY - sheetTouchStartY > 50) {
        triggerHaptic(15);
        closeModal();
      }
    }
  };

  if (sheetHandle) {
    sheetHandle.addEventListener('touchstart', onSheetTouchStart, { passive: true });
    sheetHandle.addEventListener('touchend', onSheetTouchEnd, { passive: true });
    sheetHandle.addEventListener('click', () => closeModal());
  }
  if (modalHeader) {
    modalHeader.addEventListener('touchstart', onSheetTouchStart, { passive: true });
    modalHeader.addEventListener('touchend', onSheetTouchEnd, { passive: true });
  }

  // Keyboard shortcut (Escape to close modal)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !dom.classModal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Mobile View Switcher Listeners
  if (dom.btnMobileTabEdit) {
    dom.btnMobileTabEdit.addEventListener('click', () => switchMobileView('edit'));
  }
  if (dom.btnMobileTabPreview) {
    dom.btnMobileTabPreview.addEventListener('click', () => switchMobileView('preview'));
  }
  if (dom.btnMobileBackToEdit) {
    dom.btnMobileBackToEdit.addEventListener('click', () => switchMobileView('edit'));
  }
  if (dom.btnFloatingPreview) {
    dom.btnFloatingPreview.addEventListener('click', () => switchMobileView('preview'));
  }
  if (dom.btnFloatingBack) {
    dom.btnFloatingBack.addEventListener('click', () => switchMobileView('edit'));
  }
  if (dom.btnFloatingCopy) {
    dom.btnFloatingCopy.addEventListener('click', copyScheduleText);
  }
  if (dom.btnFloatingShare) {
    dom.btnFloatingShare.addEventListener('click', shareOnWhatsApp);
  }
}

// --- Mobile Haptic Feedback ---
function triggerHaptic(duration = 15) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(duration);
    } catch (_) {}
  }
}

// --- Highlight Active Chips in Modal ---
function highlightActiveChips() {
  if (!dom.inputDuration) return;

  const currentDuration = dom.inputDuration.value.trim();
  document.querySelectorAll('.preset-chip[data-time]').forEach(chip => {
    if (chip.getAttribute('data-time') === currentDuration) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });
}

// --- Navigation & Views ---
function switchMobileView(view) {
  state.mobileView = view;
  triggerHaptic(10);
  if (!dom.builderGrid) return;
  
  if (view === 'preview') {
    dom.builderGrid.classList.remove('mobile-view-edit');
    dom.builderGrid.classList.add('mobile-view-preview');
    if (dom.btnMobileTabEdit) dom.btnMobileTabEdit.classList.remove('active');
    if (dom.btnMobileTabPreview) dom.btnMobileTabPreview.classList.add('active');
    if (dom.mobileBarEditContent) dom.mobileBarEditContent.classList.add('hidden');
    if (dom.mobileBarPreviewContent) dom.mobileBarPreviewContent.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    dom.builderGrid.classList.remove('mobile-view-preview');
    dom.builderGrid.classList.add('mobile-view-edit');
    if (dom.btnMobileTabEdit) dom.btnMobileTabEdit.classList.add('active');
    if (dom.btnMobileTabPreview) dom.btnMobileTabPreview.classList.remove('active');
    if (dom.mobileBarEditContent) dom.mobileBarEditContent.classList.remove('hidden');
    if (dom.mobileBarPreviewContent) dom.mobileBarPreviewContent.classList.add('hidden');
  }
}

function selectBatchTile(batch) {
  triggerHaptic(10);
  if (dom.batchTilesGrid) {
    dom.batchTilesGrid.querySelectorAll('.batch-tile').forEach(tile => {
      if (tile.getAttribute('data-batch') === batch) {
        tile.classList.add('selected');
      } else {
        tile.classList.remove('selected');
      }
    });
  }
  if (dom.batchSelectInitial) {
    dom.batchSelectInitial.value = batch || '';
  }
  if (dom.btnProceedToBuilder) {
    dom.btnProceedToBuilder.disabled = !batch;
  }
}

function selectBatch(batch) {
  state.currentBatch = batch;
  dom.activeBatchName.textContent = batch;
  dom.activeBatchPill.classList.remove('hidden');

  dom.welcomeScreen.classList.add('hidden');
  dom.builderScreen.classList.remove('hidden');

  switchMobileView('edit');
  if (dom.mobileFloatingBatch) {
    dom.mobileFloatingBatch.textContent = batch;
  }

  saveState();
  renderSchedule();
}

function switchToWelcomeScreen() {
  dom.welcomeScreen.classList.remove('hidden');
  dom.builderScreen.classList.add('hidden');
  dom.activeBatchPill.classList.add('hidden');
  if (state.currentBatch) {
    selectBatchTile(state.currentBatch);
  }
}

function setScheduleDay(day) {
  triggerHaptic(8);
  state.currentDay = day;
  document.querySelectorAll('.day-pill').forEach(pill => {
    if (pill.getAttribute('data-day') === day) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });
  saveState();
  renderSchedule();
}

function switchViewMode(mode) {
  state.viewMode = mode;
  if (mode === 'chat') {
    dom.tabFormatted.classList.add('active');
    dom.tabRawText.classList.remove('active');
    dom.whatsappChatContainer.classList.remove('hidden');
    dom.rawTextContainer.classList.add('hidden');
  } else {
    dom.tabFormatted.classList.remove('active');
    dom.tabRawText.classList.add('active');
    dom.whatsappChatContainer.classList.add('hidden');
    dom.rawTextContainer.classList.remove('hidden');
  }
}

// --- Modal Handlers ---
function setModalCategory(category) {
  triggerHaptic(8);
  dom.classCategory.value = category;

  if (dom.modalTypeTabs) {
    dom.modalTypeTabs.querySelectorAll('.modal-type-btn').forEach(btn => {
      if (btn.getAttribute('data-type') === category) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  if (category === 'compulsory') {
    dom.teacherGroup.classList.remove('hidden');
    dom.inputTeacher.required = true;
    dom.extraFieldsContainer.classList.add('hidden');
    dom.testFieldsContainer.classList.add('hidden');
    dom.inputTopic.required = false;
    dom.inputCompulsoryFor.required = false;
  } else if (category === 'extra') {
    dom.teacherGroup.classList.remove('hidden');
    dom.inputTeacher.required = true;
    dom.extraFieldsContainer.classList.remove('hidden');
    dom.testFieldsContainer.classList.add('hidden');
    dom.inputTopic.required = true;
    dom.inputCompulsoryFor.required = true;
  } else if (category === 'test') {
    dom.teacherGroup.classList.add('hidden');
    dom.inputTeacher.required = false;
    dom.extraFieldsContainer.classList.add('hidden');
    dom.testFieldsContainer.classList.remove('hidden');
    dom.inputTopic.required = false;
    dom.inputCompulsoryFor.required = false;
  }
}

function openModal(category, editId = null) {
  setModalCategory(category);
  dom.editClassId.value = editId || '';

  // Pre-fill fields
  if (editId) {
    const item = state.classes.find(c => c.id === editId);
    if (item) {
      dom.inputDay.value = item.day || state.currentDay;
      dom.inputDuration.value = item.duration || '';

      // Subject
      if (['Physics', 'Chemistry', 'Maths', 'Biology'].includes(item.subject)) {
        dom.inputSubject.value = item.subject;
        dom.customSubjectWrapper.classList.add('hidden');
        dom.inputCustomSubject.value = '';
      } else {
        dom.inputSubject.value = 'custom';
        dom.customSubjectWrapper.classList.remove('hidden');
        dom.inputCustomSubject.value = item.subject || '';
      }

      // Teacher (for classes)
      if (item.teacher) {
        if (["Nitin Sir", "Neelam Ma'am", "Ankit Sir", "Shweta Mam", "Sumit Sir", "Abhijit Sir"].includes(item.teacher)) {
          dom.inputTeacher.value = item.teacher;
          dom.customTeacherWrapper.classList.add('hidden');
          dom.inputCustomTeacher.value = '';
        } else {
          dom.inputTeacher.value = 'custom';
          dom.customTeacherWrapper.classList.remove('hidden');
          dom.inputCustomTeacher.value = item.teacher || '';
        }
      }

      // Extra fields
      dom.inputTopic.value = item.topic || '';
      dom.inputCompulsoryFor.value = item.compulsoryFor || '';
      const styleRadio = dom.classForm.querySelector(`input[name="attendanceStyle"][value="${item.attendanceStyle || 'compulsory_welcome'}"]`);
      if (styleRadio) styleRadio.checked = true;

      // Test fields
      if (item.type === 'test') {
        dom.inputTestTopic.value = item.topic || '';
        dom.inputIsOptionalTest.checked = !!item.isOptional;
      }

      if (dom.btnSaveClass) {
        dom.btnSaveClass.textContent = 'Update Class';
      }
    }
  } else {
    // Reset form for fresh entry
    dom.classForm.reset();
    dom.inputDay.value = state.currentDay;
    dom.customSubjectWrapper.classList.add('hidden');
    dom.customTeacherWrapper.classList.add('hidden');
    dom.inputCustomSubject.value = '';
    dom.inputCustomTeacher.value = '';
    dom.inputTestTopic.value = '';
    dom.inputIsOptionalTest.checked = false;
    dom.editClassId.value = '';
    if (dom.btnSaveClass) {
      dom.btnSaveClass.textContent = 'Save Class';
    }
  }

  dom.classModal.classList.remove('hidden');
  document.body.classList.add('modal-open');
  triggerHaptic(12);
  highlightActiveChips();

  // Avoid sudden keyboard jump on touch/phone screens
  const isTouchDevice = (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0));
  if (!isTouchDevice && window.innerWidth > 640) {
    dom.inputDuration.focus();
  }
}

function closeModal() {
  document.body.classList.remove('modal-open');
  dom.classModal.classList.add('hidden');
  dom.classForm.reset();
  dom.editClassId.value = '';
  highlightActiveChips();
}

function handleFormSubmit(e) {
  e.preventDefault();

  const category = dom.classCategory.value;
  const editId = dom.editClassId.value;

  const day = dom.inputDay.value;
  const duration = dom.inputDuration.value.trim();
  
  // Subject
  let subject = dom.inputSubject.value;
  if (subject === 'custom') {
    subject = dom.inputCustomSubject.value.trim() || 'Custom Subject';
  }

  // Teacher (only if not test)
  let teacher = '';
  if (category !== 'test') {
    teacher = dom.inputTeacher.value;
    if (teacher === 'custom') {
      teacher = dom.inputCustomTeacher.value.trim() || 'Teacher';
    }
  }

  // Extra details or Test details
  let topic = '';
  let compulsoryFor = '';
  let attendanceStyle = 'compulsory_welcome';
  let isOptional = false;

  if (category === 'extra') {
    topic = dom.inputTopic.value.trim();
    compulsoryFor = dom.inputCompulsoryFor.value.trim();
    const styleChecked = dom.classForm.querySelector('input[name="attendanceStyle"]:checked');
    if (styleChecked) {
      attendanceStyle = styleChecked.value;
    }
  } else if (category === 'test') {
    topic = dom.inputTestTopic.value.trim();
    isOptional = dom.inputIsOptionalTest.checked;
  }

  if (editId) {
    // Update existing item
    const index = state.classes.findIndex(c => c.id === editId);
    if (index !== -1) {
      state.classes[index] = {
        ...state.classes[index],
        day,
        duration,
        subject,
        teacher,
        topic,
        compulsoryFor,
        attendanceStyle,
        isOptional
      };
    }
    showToast(category === 'test' ? 'Test updated successfully!' : 'Class updated successfully!');
  } else {
    // Add new item
    const newClass = {
      id: (category === 'test' ? 'test_' : 'class_') + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      type: category,
      day,
      duration,
      subject,
      teacher,
      topic,
      compulsoryFor,
      attendanceStyle,
      isOptional
    };
    state.classes.push(newClass);
    showToast(category === 'test' ? (isOptional ? 'Optional test added!' : 'Compulsory test added!') : 'Class added to schedule!');
  }

  // Sync day if schedule day was changed in class form
  if (day && day !== state.currentDay) {
    setScheduleDay(day);
  }

  // Ensure classes are always maintained in chronological order
  state.classes.sort((a, b) => parseStartTimeInMinutes(a.duration) - parseStartTimeInMinutes(b.duration));

  closeModal();
  saveState();
  renderSchedule();
}

// --- Class Actions (Edit, Delete, Duplicate) ---
function deleteClass(id) {
  triggerHaptic(20);
  state.classes = state.classes.filter(c => c.id !== id);
  saveState();
  renderSchedule();
  showToast('Class removed.');
}

function duplicateClass(id) {
  const item = state.classes.find(c => c.id === id);
  if (!item) return;

  const clone = {
    ...item,
    id: (item.type === 'test' ? 'test_' : 'class_') + Date.now() + '_' + Math.random().toString(36).substr(2, 4)
  };
  state.classes.push(clone);
  state.classes.sort((a, b) => parseStartTimeInMinutes(a.duration) - parseStartTimeInMinutes(b.duration));

  saveState();
  renderSchedule();
  showToast('Class duplicated in chronological order!');
}

function moveClass(id, direction) {
  const index = state.classes.findIndex(c => c.id === id);
  if (index === -1) return;

  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= state.classes.length) return;

  const temp = state.classes[index];
  state.classes[index] = state.classes[targetIndex];
  state.classes[targetIndex] = temp;

  saveState();
  renderSchedule();
}

// --- Chronological Time Parsing & Sorting ---
function parseStartTimeInMinutes(durationStr) {
  if (!durationStr || typeof durationStr !== 'string') return 9999;
  const str = durationStr.trim();

  // Split on range separators: hyphen, en-dash, em-dash, or 'to'
  const parts = str.split(/\s*(?:[-–—]|to)\s*/i);
  const startPart = parts[0] ? parts[0].trim() : '';
  const endPart = parts[1] ? parts[1].trim() : '';

  // Check AM/PM in start and end
  const startMeridianMatch = startPart.match(/(am|pm)/i);
  const endMeridianMatch = endPart ? endPart.match(/(am|pm)/i) : null;

  let meridian = startMeridianMatch ? startMeridianMatch[1].toLowerCase() : null;

  // Parse hour and minute from startPart (e.g. '4.00', '4:15', '1', '12', '12:30')
  const timeMatch = startPart.match(/^(\d{1,2})(?:[:.](\d{1,2}))?/);
  if (!timeMatch) return 9999;

  let hour = parseInt(timeMatch[1], 10);
  let min = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;

  // If no explicit meridian on start, deduce from endPart or default heuristics
  if (!meridian) {
    if (endMeridianMatch) {
      const endMeridian = endMeridianMatch[1].toLowerCase();
      const endTimeMatch = endPart.match(/^(\d{1,2})/);
      const endHour = endTimeMatch ? parseInt(endTimeMatch[1], 10) : 12;

      if (endMeridian === 'am') {
        meridian = 'am';
      } else if (endMeridian === 'pm') {
        if (hour === 12) {
          meridian = 'pm'; // 12 PM (noon)
        } else if (endHour === 12 && hour < 12) {
          meridian = 'am'; // e.g. 10 - 12 PM (10 AM to 12 PM)
        } else if (hour > endHour) {
          meridian = 'am'; // e.g. 11 - 1 PM (11 AM to 1 PM)
        } else {
          meridian = 'pm'; // e.g. 1 - 2 PM, 4 - 5 PM
        }
      }
    } else {
      // Default heuristics for coaching institute schedules
      if (hour >= 1 && hour <= 6) meridian = 'pm';
      else if (hour >= 7 && hour <= 11) meridian = 'am';
      else if (hour === 12) meridian = 'pm';
      else meridian = 'am';
    }
  }

  // Convert to 24-hr format (minutes from midnight 00:00)
  if (meridian === 'pm' && hour < 12) {
    hour += 12;
  } else if (meridian === 'am' && hour === 12) {
    hour = 0;
  }

  return hour * 60 + min;
}

function sortByChronologicalTime(items) {
  return [...items].sort((a, b) => {
    const timeA = parseStartTimeInMinutes(a.duration);
    const timeB = parseStartTimeInMinutes(b.duration);
    if (timeA !== timeB) {
      return timeA - timeB;
    }
    return (a.subject || '').localeCompare(b.subject || '');
  });
}

// --- Text Schedule Generation (Exact WhatsApp format) ---
function generateScheduleText() {
  const batch = state.currentBatch || '12th A2 batch';
  const day = state.currentDay || 'Friday';

  // Filter extra, compulsory classes and tests - all sorted chronologically by start time
  const extraClasses = sortByChronologicalTime(state.classes.filter(c => c.type === 'extra'));
  const compulsoryClasses = sortByChronologicalTime(state.classes.filter(c => c.type === 'compulsory'));
  const tests = sortByChronologicalTime(state.classes.filter(c => c.type === 'test'));
  const compulsoryTests = tests.filter(t => !t.isOptional);
  const optionalTests = tests.filter(t => t.isOptional);

  const lines = [];

  // Header line: 🔸 Friday Schedule (*12th A2 Batch*)
  // Note: in WhatsApp, *12th A2 Batch* renders as bold text inside parentheses!
  lines.push(`🔸 ${day} Schedule (*${batch}*)`);

  // Extra classes section
  if (extraClasses.length > 0) {
    lines.push(''); // Blank line before section
    lines.push('🔰 Extra Classes');
    lines.push(''); // Blank line after section header

    extraClasses.forEach((cls) => {
      // Format: ⭕ *1–2 PM* Chemistry Doubt Class with Sumit Sir (Compulsory for *Parth*) Others are also welcome.
      // or: ⭕ *4–5 PM* Physics Wave Optics Class with Sumit Sir (For *Khushi*)
      const durationStr = `*${cls.duration}*`;
      const topicStr = cls.topic ? ` ${cls.topic}` : '';
      
      let studentStr = '';
      if (cls.compulsoryFor) {
        if (cls.attendanceStyle === 'for_only') {
          studentStr = ` (For *${cls.compulsoryFor}*)`;
        } else {
          studentStr = ` (Compulsory for *${cls.compulsoryFor}*) Others are also welcome.`;
        }
      }

      const itemLine = `⭕ ${durationStr} ${cls.subject}${topicStr} with ${cls.teacher}${studentStr}`;
      lines.push(itemLine);
      lines.push(''); // Empty line between items as shown in image
    });
  }

  // Compulsory classes section
  if (compulsoryClasses.length > 0) {
    // If extra classes didn't just add a trailing empty line, ensure empty line
    if (lines[lines.length - 1] !== '') {
      lines.push('');
    }
    
    lines.push('🔰 Compulsory Class');
    lines.push(''); // Blank line after section header

    compulsoryClasses.forEach((cls) => {
      // Format: ⭕ *4.00-5:10PM*  Maths Compulsory class with Nitin Sir (OFFLINE + ONLINE)
      const durationStr = `*${cls.duration}*`;
      const itemLine = `⭕ ${durationStr}  ${cls.subject} Compulsory class with ${cls.teacher} (OFFLINE + ONLINE)`;
      lines.push(itemLine);
      lines.push(''); // Empty line between items
    });
  }

  // Compulsory Tests section (from reference image)
  if (compulsoryTests.length > 0) {
    if (lines[lines.length - 1] !== '') {
      lines.push('');
    }
    
    lines.push('🔰 Compulsory Test');
    lines.push(''); // Blank line after section header

    compulsoryTests.forEach((t) => {
      // Format: 🔲 *2.00-3.30PM*  *Compulsory Math Test* Topic 🔲 *AoI* 🔲 *Differential eq* 🔲 *LPP*
      const durationStr = `*${t.duration}*`;
      let topicFormatted = '';
      if (t.topic) {
        const topicItems = t.topic.split(',').map(s => s.trim()).filter(Boolean);
        if (topicItems.length > 0) {
          topicFormatted = ' Topic ' + topicItems.map(tp => `🔲 *${tp}*`).join(' ');
        }
      }
      const itemLine = `🔲 ${durationStr}  *Compulsory ${t.subject} Test*${topicFormatted}`;
      lines.push(itemLine);
      lines.push('');
    });

    // Compulsory Test Official Instructions (from reference image)
    lines.push('‼️ Plz reply with "Offline / Online / No"  As per choice of mode of exam you wish to write tomorrow.');
    lines.push('');
    lines.push("🔲  Greater Noida based students must give reason, if they are opting for Online by Calling Ashwini Ma'am (9999293920) , Else they will not be allowed to give the test in ONLINE MODE.");
    lines.push('');
    lines.push('🔲  All students opting for "NO" must also give reason by Calling Ashwini Ma\'am (9999293920).');
    lines.push('');
  }

  // Optional Tests section
  if (optionalTests.length > 0) {
    if (lines[lines.length - 1] !== '') {
      lines.push('');
    }
    
    lines.push('🔰 Optional Test');
    lines.push(''); // Blank line after section header

    optionalTests.forEach((t) => {
      // Format: 🔲 *2.00-3.30PM*  *Optional Math Test* Topic 🔲 *AoI* 🔲 *Differential eq*
      const durationStr = `*${t.duration}*`;
      let topicFormatted = '';
      if (t.topic) {
        const topicItems = t.topic.split(',').map(s => s.trim()).filter(Boolean);
        if (topicItems.length > 0) {
          topicFormatted = ' Topic ' + topicItems.map(tp => `🔲 *${tp}*`).join(' ');
        }
      }
      const itemLine = `🔲 ${durationStr}  *Optional ${t.subject} Test*${topicFormatted}`;
      lines.push(itemLine);
      lines.push('');
    });
  }

  // If no classes or tests added yet, provide a friendly placeholder
  if (extraClasses.length === 0 && compulsoryClasses.length === 0 && tests.length === 0) {
    lines.push('');
    lines.push('No classes or tests scheduled yet. Click "+ Add Compulsory Class", "+ Add Extra Class", or "+ Add Test" to build schedule.');
  }

  // Always append Online Notice Message (as shown in reference image)
  const noticeMsg = (state.onlineNoticeText !== undefined 
    ? state.onlineNoticeText 
    : 'If anyone needs to attend class in online mode, link is provided in the description of this group.'
  ).trim();

  if (noticeMsg) {
    if (lines.length > 0 && lines[lines.length - 1] !== '') {
      lines.push('');
    }
    lines.push(`📌 ${noticeMsg}`);
  }

  // Trim trailing empty line if any
  while (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
  }

  return lines.join('\n');
}

// Convert WhatsApp Markdown (*bold*) to HTML for simulated WhatsApp bubble preview
function formatWhatsAppToHtml(rawText) {
  if (!rawText) return '';

  // Escape HTML characters
  let escaped = rawText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Convert *bold* to <strong>bold</strong>
  // Avoid replacing asterisks that are part of other things
  escaped = escaped.replace(/\*([^*\n\r]+)\*/g, '<strong>$1</strong>');

  return escaped;
}

// --- Render UI ---
function renderSchedule() {
  const sortedClasses = sortByChronologicalTime(state.classes);

  // Update empty state day title
  if (dom.emptyDayTitle) {
    dom.emptyDayTitle.textContent = state.currentDay || 'Today';
  }

  // Update mobile counters
  const totalClasses = sortedClasses.length;
  if (dom.mobileTotalCountBadge) dom.mobileTotalCountBadge.textContent = totalClasses;
  if (dom.mobileFloatingCount) {
    dom.mobileFloatingCount.textContent = totalClasses === 1 ? '1 class' : `${totalClasses} classes`;
  }
  if (dom.mobileFloatingBatch) {
    dom.mobileFloatingBatch.textContent = state.currentBatch || 'Schedule';
  }

  // Render unified list or empty view
  if (totalClasses === 0) {
    if (dom.scheduleEmptyView) dom.scheduleEmptyView.classList.remove('hidden');
    if (dom.unifiedClassList) {
      dom.unifiedClassList.classList.add('hidden');
      dom.unifiedClassList.innerHTML = '';
    }
  } else {
    if (dom.scheduleEmptyView) dom.scheduleEmptyView.classList.add('hidden');
    if (dom.unifiedClassList) {
      dom.unifiedClassList.classList.remove('hidden');
      dom.unifiedClassList.innerHTML = sortedClasses.map((cls, idx) => createClassCardHtml(cls, idx)).join('');
    }
  }

  // Generate Schedule Text
  const rawScheduleText = generateScheduleText();
  if (dom.rawTextOutput) dom.rawTextOutput.value = rawScheduleText;
  if (dom.previewFormattedText) dom.previewFormattedText.innerHTML = formatWhatsAppToHtml(rawScheduleText);

  // Update day indicator dots across entire week
  updateDayDots();

  // Attach card event listeners
  attachCardActionListeners();
}

function updateDayDots() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  days.forEach(day => {
    const dot = document.querySelector(`.day-dot[data-day-dot="${day}"]`);
    if (dot) {
      const hasClasses = state.classes.some(c => (c.day || state.currentDay) === day);
      if (hasClasses) {
        dot.classList.add('has-classes');
      } else {
        dot.classList.remove('has-classes');
      }
    }
  });
}

function getSubjectBadgeClass(subject) {
  const s = (subject || '').toLowerCase();
  if (s.includes('physics')) return 'badge-physics';
  if (s.includes('chemistry')) return 'badge-chemistry';
  if (s.includes('math')) return 'badge-maths';
  if (s.includes('bio')) return 'badge-biology';
  return 'badge-custom';
}

function createClassCardHtml(cls, index) {
  const subjectClass = getSubjectBadgeClass(cls.subject);
  const orderNum = typeof index === 'number' ? `<span class="chrono-order-pill" title="Order #${index + 1}">#${index + 1}</span>` : '';
  const clockIcon = `<svg class="clock-icon" viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;

  let categoryBadge = '';
  let cardTypeClass = '';
  let detailsHtml = '';

  if (cls.type === 'compulsory') {
    cardTypeClass = 'compulsory-card';
    categoryBadge = `<span class="category-pill pill-compulsory">📘 Compulsory</span>`;
    detailsHtml = `
      <div class="class-card-details">
        ${escapeHtml(cls.subject)} with <strong>${escapeHtml(cls.teacher)}</strong>
      </div>
      <div class="class-card-meta">
        <span class="mode-tag">📶 OFFLINE + ONLINE</span>
      </div>
    `;
  } else if (cls.type === 'extra') {
    cardTypeClass = 'extra-card';
    categoryBadge = `<span class="category-pill pill-extra">⭐ Extra</span>`;
    detailsHtml = `
      <div class="class-card-details">
        <strong>${escapeHtml(cls.topic || 'Doubt Class')}</strong> with ${escapeHtml(cls.teacher)}
      </div>
      ${cls.compulsoryFor ? `
        <div class="class-card-meta">
          <span class="student-tag">👤 ${cls.attendanceStyle === 'for_only' ? 'For' : 'Compulsory for'} <strong>${escapeHtml(cls.compulsoryFor)}</strong></span>
        </div>
      ` : ''}
    `;
  } else if (cls.type === 'test') {
    cardTypeClass = 'test-card';
    const isOptional = !!cls.isOptional;
    categoryBadge = `<span class="category-pill pill-test ${isOptional ? 'pill-test-opt' : ''}">📝 ${isOptional ? 'Optional Test' : 'Compulsory Test'}</span>`;
    detailsHtml = `
      <div class="class-card-details">
        <strong>${isOptional ? 'Optional' : 'Compulsory'} ${escapeHtml(cls.subject)} Test</strong>
        ${cls.topic ? `<span class="test-topics-preview"> — Topics: <em>${escapeHtml(cls.topic)}</em></span>` : ''}
      </div>
    `;
  }

  return `
    <div class="class-card ${cardTypeClass}" data-id="${cls.id}">
      <div class="class-card-left">
        <div class="class-card-info">
          <div class="class-card-time-row">
            ${orderNum}
            <span class="time-pill">${clockIcon} ${escapeHtml(cls.duration)}</span>
            <span class="subject-badge ${subjectClass}">${escapeHtml(cls.subject)}</span>
            ${categoryBadge}
          </div>
          ${detailsHtml}
        </div>
      </div>

      <div class="class-card-actions">
        <button type="button" class="btn-card-action edit" data-action="edit" title="Edit">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button type="button" class="btn-card-action delete" data-action="delete" title="Delete">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    </div>
  `;
}

function attachCardActionListeners() {
  document.querySelectorAll('.class-card').forEach(card => {
    const id = card.getAttribute('data-id');
    const item = state.classes.find(c => c.id === id);
    if (!item) return;

    const btnEdit = card.querySelector('[data-action="edit"]');
    const btnDelete = card.querySelector('[data-action="delete"]');

    if (btnEdit) {
      btnEdit.addEventListener('click', () => openModal(item.type, id));
    }
    if (btnDelete) {
      btnDelete.addEventListener('click', () => deleteClass(id));
    }
  });
}

// --- WhatsApp Share, Copy & Download ---
function shareOnWhatsApp() {
  const text = generateScheduleText();
  if (!text) {
    showToast('Schedule is empty!');
    return;
  }

  triggerHaptic(20);

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const encodedText = encodeURIComponent(text);

  if (isMobile) {
    // Open native WhatsApp app directly on smartphones
    const appUrl = `whatsapp://send?text=${encodedText}`;
    const webUrl = `https://api.whatsapp.com/send?text=${encodedText}`;

    const startTime = Date.now();
    window.location.href = appUrl;

    // Fallback to web URL if WhatsApp app protocol is not handled
    setTimeout(() => {
      if (Date.now() - startTime < 1500) {
        window.open(webUrl, '_blank');
      }
    }, 700);
  } else {
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
  }
}

function copyScheduleText() {
  const text = generateScheduleText();
  if (!text) return;

  triggerHaptic(15);

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard! Ready to paste into WhatsApp.');
    }).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  dom.rawTextOutput.select();
  document.execCommand('copy');
  showToast('Copied to clipboard!');
}

function downloadScheduleTxt() {
  const text = generateScheduleText();
  const filename = `M4EX_${state.currentBatch.replace(/\s+/g, '_')}_${state.currentDay}.txt`;
  
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`Downloaded ${filename}`);
}

// --- Sample Schedule & Clear ---
function loadSampleSchedule() {
  state.currentBatch = SAMPLE_SCHEDULE.batch;
  state.currentDay = SAMPLE_SCHEDULE.day;
  state.classes = JSON.parse(JSON.stringify(SAMPLE_SCHEDULE.classes));
  // Sort sample classes in chronological order
  state.classes.sort((a, b) => parseStartTimeInMinutes(a.duration) - parseStartTimeInMinutes(b.duration));

  state.onlineNoticeText = 'If anyone needs to attend class in online mode, link is provided in the description of this group.';
  if (dom.inputOnlineNoticeText) {
    dom.inputOnlineNoticeText.value = state.onlineNoticeText;
  }

  // Sync pills and inputs
  dom.activeBatchName.textContent = state.currentBatch;
  dom.batchSelectInitial.value = state.currentBatch;
  selectBatchTile(state.currentBatch);
  setScheduleDay(state.currentDay);

  saveState();
  renderSchedule();
  showToast('Sample schedule loaded in chronological order!');
}

function confirmClearSchedule() {
  if (state.classes.length === 0) return;
  if (confirm('Are you sure you want to clear all classes from this schedule?')) {
    state.classes = [];
    saveState();
    renderSchedule();
    showToast('Schedule cleared.');
  }
}

// --- LocalStorage State Persistence ---
function saveState() {
  if (typeof localStorage === 'undefined') return;
  try {
    const data = {
      currentBatch: state.currentBatch,
      currentDay: state.currentDay,
      classes: state.classes,
      onlineNoticeText: state.onlineNoticeText
    };
    localStorage.setItem('m4ex_scheduler_data', JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

function loadSavedState() {
  if (typeof localStorage === 'undefined') {
    switchToWelcomeScreen();
    return;
  }
  try {
    const raw = localStorage.getItem('m4ex_scheduler_data');
    if (raw) {
      const data = JSON.parse(raw);
      if (data.currentBatch) {
        state.currentBatch = data.currentBatch;
        state.currentDay = data.currentDay || 'Friday';
        state.classes = Array.isArray(data.classes) ? data.classes : [];
        if (data.onlineNoticeText !== undefined) {
          state.onlineNoticeText = data.onlineNoticeText;
          if (dom.inputOnlineNoticeText) dom.inputOnlineNoticeText.value = state.onlineNoticeText;
        }
        selectBatch(state.currentBatch);
        selectBatchTile(state.currentBatch);
        setScheduleDay(state.currentDay);
        return;
      }
    }
  } catch (err) {
    console.error('Failed to load from localStorage:', err);
  }

  // Default initial view
  switchToWelcomeScreen();
}

// --- Toast & Utility Helpers ---
let toastTimeout = null;
function showToast(message) {
  if (!dom.toastMessage || !dom.toastNotification) return;
  dom.toastMessage.textContent = message;
  dom.toastNotification.classList.remove('hidden');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    dom.toastNotification.classList.add('hidden');
  }, 2800);
}

function updateTimestamp() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  if (dom.previewTimestamp) {
    dom.previewTimestamp.textContent = `${hours}:${minutes} ${ampm}`;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Run on page load (in browser only)
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', init);
}

// Safe export for Node.js / Vercel
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { state, generateScheduleText };
}
