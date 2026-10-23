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
    welcomeScreen: document.getElementById('welcomeScreen'),
    builderScreen: document.getElementById('builderScreen'),
    batchSelectInitial: document.getElementById('batchSelectInitial'),
    btnProceedToBuilder: document.getElementById('btnProceedToBuilder'),
    activeBatchPill: document.getElementById('activeBatchPill'),
    activeBatchName: document.getElementById('activeBatchName'),
    btnSwitchBatch: document.getElementById('btnSwitchBatch'),
    btnThemeToggle: document.getElementById('btnThemeToggle'),

    // Day Selector
    dayPillsContainer: document.getElementById('dayPillsContainer'),

    // Builder Class Lists
    extraClassList: document.getElementById('extraClassList'),
    compulsoryClassList: document.getElementById('compulsoryClassList'),
    testList: document.getElementById('testList'),
    extraEmptyMsg: document.getElementById('extraEmptyMsg'),
    compulsoryEmptyMsg: document.getElementById('compulsoryEmptyMsg'),
    testEmptyMsg: document.getElementById('testEmptyMsg'),
    extraCountBadge: document.getElementById('extraCountBadge'),
    compulsoryCountBadge: document.getElementById('compulsoryCountBadge'),
    testCountBadge: document.getElementById('testCountBadge'),

    // Top Bar Actions
    btnLoadExample: document.getElementById('btnLoadExample'),
    btnClearSchedule: document.getElementById('btnClearSchedule'),

    // Online Notice Input
    inputOnlineNoticeText: document.getElementById('inputOnlineNoticeText'),

    // Add Action Buttons
    btnOpenCompulsoryModal: document.getElementById('btnOpenCompulsoryModal'),
    btnOpenExtraModal: document.getElementById('btnOpenExtraModal'),
    btnOpenTestModal: document.getElementById('btnOpenTestModal'),

    // Modal
    classModal: document.getElementById('classModal'),
    modalTitle: document.getElementById('modalTitle'),
    modalTypeEmoji: document.getElementById('modalTypeEmoji'),
    btnCloseModal: document.getElementById('btnCloseModal'),
    btnCancelModal: document.getElementById('btnCancelModal'),
    classForm: document.getElementById('classForm'),
    editClassId: document.getElementById('editClassId'),
    classCategory: document.getElementById('classCategory'),

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
    compulsoryNoteBanner: document.getElementById('compulsoryNoteBanner'),

    // Test Specific Fields
    testFieldsContainer: document.getElementById('testFieldsContainer'),
    inputTestTopic: document.getElementById('inputTestTopic'),
    inputIsOptionalTest: document.getElementById('inputIsOptionalTest'),
    testNoteBanner: document.getElementById('testNoteBanner'),

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
    btnDownloadTxt: document.getElementById('btnDownloadTxt'),
    toastNotification: document.getElementById('toastNotification'),
    toastMessage: document.getElementById('toastMessage')
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

  // Initial Batch Selection
  dom.batchSelectInitial.addEventListener('change', () => {
    dom.btnProceedToBuilder.disabled = !dom.batchSelectInitial.value;
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

  // Quick Preset Chips (Duration)
  document.querySelectorAll('.chip-btn[data-time]').forEach(chip => {
    chip.addEventListener('click', () => {
      dom.inputDuration.value = chip.getAttribute('data-time');
    });
  });

  // Quick Preset Chips (Topic)
  document.querySelectorAll('.chip-topic').forEach(chip => {
    chip.addEventListener('click', () => {
      dom.inputTopic.value = chip.getAttribute('data-topic');
    });
  });

  // Quick Preset Chips (Test Topic)
  document.querySelectorAll('.chip-test-topic').forEach(chip => {
    chip.addEventListener('click', () => {
      dom.inputTestTopic.value = chip.getAttribute('data-topic');
    });
  });

  // Class Form Submit
  dom.classForm.addEventListener('submit', handleFormSubmit);

  // Tabs
  dom.tabFormatted.addEventListener('click', () => switchViewMode('chat'));
  dom.tabRawText.addEventListener('click', () => switchViewMode('raw'));

  // Sharing Actions
  dom.btnShareWhatsApp.addEventListener('click', shareOnWhatsApp);
  dom.btnCopyText.addEventListener('click', copyScheduleText);
  dom.btnDownloadTxt.addEventListener('click', downloadScheduleTxt);

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

  // Keyboard shortcut (Escape to close modal)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !dom.classModal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

// --- Navigation & Views ---
function selectBatch(batch) {
  state.currentBatch = batch;
  dom.activeBatchName.textContent = batch;
  dom.activeBatchPill.classList.remove('hidden');

  dom.welcomeScreen.classList.add('hidden');
  dom.builderScreen.classList.remove('hidden');

  saveState();
  renderSchedule();
}

function switchToWelcomeScreen() {
  dom.welcomeScreen.classList.remove('hidden');
  dom.builderScreen.classList.add('hidden');
  dom.activeBatchPill.classList.add('hidden');
  if (state.currentBatch) {
    dom.batchSelectInitial.value = state.currentBatch;
    dom.btnProceedToBuilder.disabled = false;
  }
}

function setScheduleDay(day) {
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
function openModal(category, editId = null) {
  dom.classCategory.value = category;
  dom.editClassId.value = editId || '';

  if (category === 'compulsory') {
    dom.modalTitle.textContent = editId ? 'Edit Compulsory Class' : 'Add Compulsory Class';
    dom.modalTypeEmoji.textContent = '📘';
    dom.teacherGroup.classList.remove('hidden');
    dom.inputTeacher.required = true;
    dom.extraFieldsContainer.classList.add('hidden');
    dom.compulsoryNoteBanner.classList.remove('hidden');
    dom.testFieldsContainer.classList.add('hidden');
    dom.testNoteBanner.classList.add('hidden');
    dom.inputTopic.required = false;
    dom.inputCompulsoryFor.required = false;
  } else if (category === 'extra') {
    dom.modalTitle.textContent = editId ? 'Edit Extra Class' : 'Add Extra Class';
    dom.modalTypeEmoji.textContent = '⭐';
    dom.teacherGroup.classList.remove('hidden');
    dom.inputTeacher.required = true;
    dom.extraFieldsContainer.classList.remove('hidden');
    dom.compulsoryNoteBanner.classList.add('hidden');
    dom.testFieldsContainer.classList.add('hidden');
    dom.testNoteBanner.classList.add('hidden');
    dom.inputTopic.required = true;
    dom.inputCompulsoryFor.required = true;
  } else if (category === 'test') {
    dom.modalTitle.textContent = editId ? 'Edit Test' : 'Add Test';
    dom.modalTypeEmoji.textContent = '📝';
    dom.teacherGroup.classList.add('hidden');
    dom.inputTeacher.required = false;
    dom.extraFieldsContainer.classList.add('hidden');
    dom.compulsoryNoteBanner.classList.add('hidden');
    dom.testFieldsContainer.classList.remove('hidden');
    dom.testNoteBanner.classList.remove('hidden');
    dom.inputTopic.required = false;
    dom.inputCompulsoryFor.required = false;
  }

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
  }

  dom.classModal.classList.remove('hidden');
  dom.inputDuration.focus();
}

function closeModal() {
  dom.classModal.classList.add('hidden');
  dom.classForm.reset();
  dom.editClassId.value = '';
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

  closeModal();
  saveState();
  renderSchedule();
}

// --- Class Actions (Edit, Delete, Move) ---
function deleteClass(id) {
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
    id: 'class_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)
  };
  state.classes.push(clone);
  saveState();
  renderSchedule();
  showToast('Class duplicated!');
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

// --- Text Schedule Generation (Exact WhatsApp format) ---
function generateScheduleText() {
  const batch = state.currentBatch || '12th A2 batch';
  const day = state.currentDay || 'Friday';

  // Filter extra, compulsory classes and tests
  const extraClasses = state.classes.filter(c => c.type === 'extra');
  const compulsoryClasses = state.classes.filter(c => c.type === 'compulsory');
  const tests = state.classes.filter(c => c.type === 'test');
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
  const extraClasses = state.classes.filter(c => c.type === 'extra');
  const compulsoryClasses = state.classes.filter(c => c.type === 'compulsory');
  const tests = state.classes.filter(c => c.type === 'test');

  // Update counters
  dom.extraCountBadge.textContent = extraClasses.length;
  dom.compulsoryCountBadge.textContent = compulsoryClasses.length;
  if (dom.testCountBadge) dom.testCountBadge.textContent = tests.length;

  // Render Extra Classes List
  if (extraClasses.length === 0) {
    dom.extraEmptyMsg.classList.remove('hidden');
    dom.extraClassList.innerHTML = '';
  } else {
    dom.extraEmptyMsg.classList.add('hidden');
    dom.extraClassList.innerHTML = extraClasses.map(cls => createClassCardHtml(cls)).join('');
  }

  // Render Compulsory Classes List
  if (compulsoryClasses.length === 0) {
    dom.compulsoryEmptyMsg.classList.remove('hidden');
    dom.compulsoryClassList.innerHTML = '';
  } else {
    dom.compulsoryEmptyMsg.classList.add('hidden');
    dom.compulsoryClassList.innerHTML = compulsoryClasses.map(cls => createClassCardHtml(cls)).join('');
  }

  // Render Tests List
  if (dom.testList && dom.testEmptyMsg) {
    if (tests.length === 0) {
      dom.testEmptyMsg.classList.remove('hidden');
      dom.testList.innerHTML = '';
    } else {
      dom.testEmptyMsg.classList.add('hidden');
      dom.testList.innerHTML = tests.map(cls => createClassCardHtml(cls)).join('');
    }
  }

  // Generate Schedule Text
  const rawScheduleText = generateScheduleText();
  dom.rawTextOutput.value = rawScheduleText;
  dom.previewFormattedText.innerHTML = formatWhatsAppToHtml(rawScheduleText);

  // Attach card event listeners
  attachCardActionListeners();
}

function getSubjectBadgeClass(subject) {
  const s = subject.toLowerCase();
  if (s.includes('physics')) return 'badge-physics';
  if (s.includes('chemistry')) return 'badge-chemistry';
  if (s.includes('math')) return 'badge-maths';
  if (s.includes('bio')) return 'badge-biology';
  return 'badge-custom';
}

function createClassCardHtml(cls) {
  const subjectClass = getSubjectBadgeClass(cls.subject);

  // Special card formatting for Test
  if (cls.type === 'test') {
    const isOptional = !!cls.isOptional;
    const testLabel = isOptional ? 'Optional Test' : 'Compulsory Test';
    const badgeClass = isOptional ? 'badge-test-optional' : 'badge-test-compulsory';

    return `
      <div class="class-card test-card" data-id="${cls.id}">
        <div class="class-card-left">
          <span class="class-card-bullet">🔲</span>
          <div class="class-card-info">
            <div class="class-card-time-row">
              <span class="time-pill">${escapeHtml(cls.duration)}</span>
              <span class="subject-badge ${subjectClass}">${escapeHtml(cls.subject)}</span>
              <span class="${badgeClass}">${testLabel}</span>
            </div>
            
            <div class="class-card-details">
              <strong>${testLabel}</strong>
              ${cls.topic ? ` — Topics: <em>${escapeHtml(cls.topic)}</em>` : ''}
            </div>
          </div>
        </div>

        <div class="class-card-actions">
          <button type="button" class="btn-card-action edit" data-action="edit" title="Edit">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button type="button" class="btn-card-action duplicate" data-action="duplicate" title="Duplicate">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
          <button type="button" class="btn-card-action delete" data-action="delete" title="Delete">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    `;
  }

  const isExtra = cls.type === 'extra';

  return `
    <div class="class-card" data-id="${cls.id}">
      <div class="class-card-left">
        <span class="class-card-bullet">⭕</span>
        <div class="class-card-info">
          <div class="class-card-time-row">
            <span class="time-pill">${escapeHtml(cls.duration)}</span>
            <span class="subject-badge ${subjectClass}">${escapeHtml(cls.subject)}</span>
          </div>
          
          <div class="class-card-details">
            ${isExtra 
              ? `<strong>${escapeHtml(cls.topic || 'Class')}</strong> with ${escapeHtml(cls.teacher)}`
              : `Compulsory class with <strong>${escapeHtml(cls.teacher)}</strong>`
            }
          </div>

          <div class="class-card-meta">
            ${isExtra && cls.compulsoryFor 
              ? `<span class="student-tag">👤 For: ${escapeHtml(cls.compulsoryFor)}</span>`
              : ''
            }
            ${!isExtra 
              ? `<span class="mode-tag">📶 OFFLINE + ONLINE</span>` 
              : ''
            }
          </div>
        </div>
      </div>

      <div class="class-card-actions">
        <button type="button" class="btn-card-action edit" data-action="edit" title="Edit">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button type="button" class="btn-card-action duplicate" data-action="duplicate" title="Duplicate">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
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
    const btnDuplicate = card.querySelector('[data-action="duplicate"]');
    const btnDelete = card.querySelector('[data-action="delete"]');

    if (btnEdit) {
      btnEdit.addEventListener('click', () => openModal(item.type, id));
    }
    if (btnDuplicate) {
      btnDuplicate.addEventListener('click', () => duplicateClass(id));
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

  // Use WhatsApp Web / App share URL
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  
  // Also try Web Share API on mobile devices if supported
  if (navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    navigator.share({
      title: `${state.currentDay} Schedule (${state.currentBatch})`,
      text: text
    }).catch(() => {
      window.open(whatsappUrl, '_blank');
    });
  } else {
    window.open(whatsappUrl, '_blank');
  }
}

function copyScheduleText() {
  const text = generateScheduleText();
  if (!text) return;

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
  state.onlineNoticeText = 'If anyone needs to attend class in online mode, link is provided in the description of this group.';
  if (dom.inputOnlineNoticeText) {
    dom.inputOnlineNoticeText.value = state.onlineNoticeText;
  }

  // Sync pills and inputs
  dom.activeBatchName.textContent = state.currentBatch;
  dom.batchSelectInitial.value = state.currentBatch;
  setScheduleDay(state.currentDay);

  saveState();
  renderSchedule();
  showToast('Sample schedule loaded from example!');
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
