/* =============================================
   ZYNDRA MINDS — script.js
   Shared utilities + page-specific logic
   ============================================= */

/* ── CONFIG ── */
const CONFIG = {
  // Replace with your Google Apps Script Web App URL
  GAS_URL: 'https://script.google.com/macros/s/AKfycbxk132kgvB9UZ9Y46PeaETViqZweszDaikl9wL-Wjp5ualo_WFh_kvyRdFqiwaFnloq/exec',
  WHATSAPP_NUMBER: '94755131260',
  ADMIN_WA_URL: 'https://wa.me/94755131260',
};

/* ─────────────────────────────────────────────
   UTILITY FUNCTIONS
───────────────────────────────────────────── */

/** Show a toast notification */
function showToast(message, type = 'default', duration = 3500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    toast.style.transition = 'all .3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/** Set loading state on a button */
function setLoading(btn, loading, originalText) {
  if (loading) {
    btn.disabled = true;
    btn.dataset.original = btn.innerHTML;
    btn.innerHTML = `<span class="spinner"></span> Loading…`;
  } else {
    btn.disabled = false;
    btn.innerHTML = originalText || btn.dataset.original;
  }
}

/** Render star rating */
function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

/** Send data to Google Apps Script */
async function sendToGAS(action, data) {
  try {
    const payload = { action, ...data };
    const res = await fetch(CONFIG.GAS_URL, {
      method: 'POST',
      mode: 'no-cors',          // GAS requires no-cors
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return { success: true };
  } catch (err) {
    console.warn('GAS request failed:', err);
    return { success: false, error: err.message };
  }
}

/** Fetch data from Google Apps Script (GET) */
async function fetchFromGAS(action, params = {}) {
  try {
    const query = new URLSearchParams({ action, ...params }).toString();
    const res = await fetch(`${CONFIG.GAS_URL}?${query}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('GAS fetch failed, using demo data:', err);
    return null;
  }
}

/** Inject floating WhatsApp button */
function injectFloatingWA() {
  const wa = document.createElement('a');
  wa.href = CONFIG.ADMIN_WA_URL;
  wa.target = '_blank';
  wa.rel = 'noopener';
  wa.className = 'wa-float';
  wa.title = 'Chat with Admin';
  wa.innerHTML = `
    <span class="wa-pulse"></span>
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15
               -.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463
               -2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606
               .134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025
               -.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008
               -.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479
               0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306
               1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719
               2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.112.549 4.1 1.507 5.83L0 24l6.335-1.48
               A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22
               c-1.848 0-3.579-.504-5.065-1.381l-.363-.215-3.762.878.893-3.673
               -.236-.376A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10
               -4.477 10-10 10z"/>
    </svg>`;
  document.body.appendChild(wa);
}

/* ─────────────────────────────────────────────
   SESSION HELPERS
───────────────────────────────────────────── */
const Session = {
  save(phone) { localStorage.setItem('zm_phone', phone); },
  get()       { return localStorage.getItem('zm_phone'); },
  clear()     { localStorage.removeItem('zm_phone'); localStorage.removeItem('zm_role'); },
  setRole(r)  { localStorage.setItem('zm_role', r); },
  getRole()   { return localStorage.getItem('zm_role'); },
};

/* ─────────────────────────────────────────────
   DEMO DATA (used when GAS is unavailable)
───────────────────────────────────────────── */
const DEMO_TUTORS = [
  {
    id: 1,
    name: 'Priya Nanayakkara',
    subject: 'Mathematics',
    grade: 'Grade 9–11 (OL)',
    rating: 4.9,
    experience: '6 years experience',
    description: 'Expert in OL & AL Mathematics with a proven track record of helping students achieve A passes. Specialises in making complex concepts simple.',
    image: null,
    initials: 'PN',
    badge: 'Top Rated',
  },
  {
    id: 2,
    name: 'Kasun Perera',
    subject: 'Physics',
    grade: 'Grade 11–13 (AL)',
    rating: 4.8,
    experience: '8 years experience',
    description: 'AL Physics tutor with BSc from University of Colombo. Known for innovative experiments and strong theory foundations.',
    image: null,
    initials: 'KP',
    badge: null,
  },
  {
    id: 3,
    name: 'Dilini Jayawardena',
    subject: 'English Language',
    grade: 'Grade 6–11',
    rating: 4.7,
    experience: '5 years experience',
    description: 'Cambridge-certified English trainer. Focuses on spoken English, IELTS preparation, and creative writing. Batch sizes are kept small.',
    image: null,
    initials: 'DJ',
    badge: null,
  },
  {
    id: 4,
    name: 'Amara Silva',
    subject: 'Chemistry',
    grade: 'Grade 10–13 (AL)',
    rating: 5.0,
    experience: '10 years experience',
    description: 'Senior Chemistry tutor with a PhD background. Consistently produces A-grade students in AL Chemistry. Limited seats available.',
    image: null,
    initials: 'AS',
    badge: '⭐ 5.0',
  },
  {
    id: 5,
    name: 'Nuwan Fernando',
    subject: 'ICT',
    grade: 'Grade 6–13',
    rating: 4.6,
    experience: '4 years experience',
    description: 'Certified ICT educator and web developer. Covers OL/AL ICT syllabus plus practical programming skills in Python and JavaScript.',
    image: null,
    initials: 'NF',
    badge: null,
  },
  {
    id: 6,
    name: 'Sachini Rathnayake',
    subject: 'Biology',
    grade: 'Grade 10–13 (AL)',
    rating: 4.8,
    experience: '7 years experience',
    description: 'Passionate Biology teacher with a love for the subject. Uses diagrams, models, and memory techniques to help students excel.',
    image: null,
    initials: 'SR',
    badge: null,
  },
];

const DEMO_CLASSES = [
  {
    id: 'cls1',
    date: 'Monday, May 12 2025',
    time: '10:00 AM – 11:30 AM',
    topic: 'Introduction & Syllabus Overview',
    zoom: 'https://zoom.us/j/demo',
    trialClass: 1,
  },
  {
    id: 'cls2',
    date: 'Wednesday, May 14 2025',
    time: '10:00 AM – 11:30 AM',
    topic: 'Core Concepts – Session 1',
    zoom: 'https://zoom.us/j/demo',
    trialClass: 2,
  },
  {
    id: 'cls3',
    date: 'Monday, May 19 2025',
    time: '10:00 AM – 11:30 AM',
    topic: 'Advanced Topics – Session 2',
    zoom: 'https://zoom.us/j/demo',
    trialClass: 0,
  },
];

/* ─────────────────────────────────────────────
   PAGE: INDEX.HTML (Login)
───────────────────────────────────────────── */
function initLoginPage() {
  const phoneInput    = document.getElementById('phone-input');
  const continueBtn   = document.getElementById('continue-btn');
  const roleSelect    = document.getElementById('role-select');
  const learnBtn      = document.getElementById('learn-btn');
  const teachBtn      = document.getElementById('teach-btn');

  if (!continueBtn) return;

  // If already logged in, show role select immediately
  const savedPhone = Session.get();
  if (savedPhone) {
    phoneInput.value = savedPhone;
    roleSelect.style.display = 'grid';
    document.getElementById('phone-step').style.display = 'none';
  }

  continueBtn.addEventListener('click', async () => {
    const phone = phoneInput.value.trim();
    if (!phone || phone.length < 7) {
      showToast('Please enter a valid phone number.', 'error');
      phoneInput.focus();
      return;
    }

    setLoading(continueBtn, true);

    // Save to localStorage
    Session.save(phone);

    // Send to Google Apps Script (non-blocking)
    sendToGAS('login', { phone }).catch(() => {});

    await new Promise(r => setTimeout(r, 800)); // UX delay

    setLoading(continueBtn, false);
    document.getElementById('phone-step').style.display = 'none';
    roleSelect.style.display = 'grid';
    showToast('Welcome to Zyndra Minds! 🎉', 'success');
  });

  // Allow Enter key
  phoneInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') continueBtn.click();
  });

  learnBtn.addEventListener('click', () => {
    Session.setRole('student');
    window.location.href = 'tutors.html';
  });

  teachBtn.addEventListener('click', () => {
    Session.setRole('tutor');
    window.location.href = 'apply.html';
  });
}

/* ─────────────────────────────────────────────
   PAGE: TUTORS.HTML (Student Dashboard)
───────────────────────────────────────────── */
async function initTutorsPage() {
  const grid        = document.getElementById('tutors-grid');
  const modalOverlay = document.getElementById('tutor-modal');
  const searchInput = document.getElementById('search-input');
  const filterBtns  = document.querySelectorAll('.filter-chip');
  const countLabel  = document.getElementById('tutor-count');

  if (!grid) return;

  // Check login
  if (!Session.get()) {
    window.location.href = 'index.html';
    return;
  }

  // Update nav
  const navPhone = document.getElementById('nav-phone');
  if (navPhone) navPhone.textContent = '📱 ' + Session.get();

  // Load tutors (try GAS, fall back to demo)
  let tutors = DEMO_TUTORS;
  try {
    const data = await fetchFromGAS('getTutors');
    if (data && Array.isArray(data.tutors) && data.tutors.length) {
      tutors = data.tutors;
    }
  } catch (_) {}

  let filteredTutors = [...tutors];
  let activeSubject  = 'All';

  // Render grid
  function renderGrid(list) {
    if (countLabel) countLabel.textContent = `${list.length} tutors found`;
    if (!list.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-state-icon">🔍</div>
          <h3>No tutors found</h3>
          <p>Try a different search or subject filter.</p>
        </div>`;
      return;
    }
    grid.innerHTML = list.map(t => `
      <div class="tutor-card" data-id="${t.id}" tabindex="0" role="button" aria-label="View ${t.name}">
        <div class="tutor-card-img">
          ${t.image
            ? `<img src="${t.image}" alt="${t.name}" loading="lazy">`
            : `<div class="tutor-avatar-placeholder">${t.initials || t.name[0]}</div>`}
          ${t.badge ? `<div class="tutor-card-badge"><span class="badge badge-amber">${t.badge}</span></div>` : ''}
        </div>
        <div class="tutor-card-body">
          <div class="tutor-card-subject">${t.subject}</div>
          <div class="tutor-card-name">${t.name}</div>
          <div class="tutor-card-desc">${t.description}</div>
          <div class="tutor-card-footer">
            <div class="tutor-card-rating">
              <div class="stars"><span>${renderStars(t.rating)}</span></div>
              <span class="rating-num">${t.rating}</span>
            </div>
            <span class="tutor-card-exp">${t.experience}</span>
          </div>
        </div>
      </div>`).join('');

    // Attach click handlers
    grid.querySelectorAll('.tutor-card').forEach(card => {
      const handler = () => openTutorModal(tutors.find(t => t.id == card.dataset.id));
      card.addEventListener('click', handler);
      card.addEventListener('keydown', e => { if (e.key === 'Enter') handler(); });
    });
  }

  // Initial render with skeletons
  grid.innerHTML = `<div class="skeleton skeleton-card"></div>`.repeat(6);
  await new Promise(r => setTimeout(r, 600)); // Simulate load
  renderGrid(filteredTutors);

  // Search
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      filteredTutors = tutors.filter(t =>
        (activeSubject === 'All' || t.subject === activeSubject) &&
        (t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
      );
      renderGrid(filteredTutors);
    });

    // Search button
    document.getElementById('search-btn')?.addEventListener('click', () => {
      searchInput.dispatchEvent(new Event('input'));
    });
  }

  // Filter chips
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeSubject = btn.dataset.subject;
      const q = searchInput ? searchInput.value.toLowerCase() : '';
      filteredTutors = tutors.filter(t =>
        (activeSubject === 'All' || t.subject === activeSubject) &&
        (t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q))
      );
      renderGrid(filteredTutors);
    });
  });

  // ── MODAL ──
  async function openTutorModal(tutor) {
    if (!tutor) return;
    const body = document.getElementById('modal-body');
    body.innerHTML = `
      <div class="modal-tutor-header">
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px">
          <div class="modal-tutor-avatar">
            ${tutor.image ? `<img src="${tutor.image}" alt="${tutor.name}">` : tutor.initials || tutor.name[0]}
          </div>
          <div>
            <div class="modal-tutor-subject">${tutor.subject}</div>
            <div class="modal-tutor-name">${tutor.name}</div>
            <div class="modal-tutor-meta">
              <div class="stars" style="font-size:.9rem"><span>${renderStars(tutor.rating)}</span></div>
              <span class="badge badge-blue">${tutor.rating} / 5.0</span>
              <span class="badge badge-green">✓ Verified</span>
            </div>
          </div>
        </div>
        <span style="font-size:.82rem;color:var(--gray-500);font-weight:500">${tutor.experience} · ${tutor.grade || ''}</span>
      </div>
      <div class="modal-tutor-desc">${tutor.description}</div>
      <button id="free-trial-btn" class="btn btn-primary btn-full btn-lg" style="margin-bottom:24px">
        🎓 Start Free Trial (2 Classes)
      </button>
      <div class="classes-section">
        <div class="classes-title">📅 Upcoming Classes</div>
        <div id="classes-list"><div class="skeleton" style="height:70px;margin-bottom:10px"></div><div class="skeleton" style="height:70px;margin-bottom:10px"></div></div>
      </div>`;

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Track trial clicks
    let clickCount = 0;
    document.getElementById('free-trial-btn').addEventListener('click', () => {
      clickCount++;
      if (clickCount === 1) {
        showToast('Trial started! Check the classes below to join.', 'success');
        renderClasses(tutor, true);
      }
    });

    // Load classes
    await loadClasses(tutor);
  }

  async function loadClasses(tutor) {
    let classes = DEMO_CLASSES;
    try {
      const data = await fetchFromGAS('getClasses', { tutorId: tutor.id });
      if (data && Array.isArray(data.classes) && data.classes.length) {
        classes = data.classes;
      }
    } catch (_) {}
    renderClasses(tutor, false, classes);
  }

  // Track per-class zoom click count
  const zoomClicks = {};

  function renderClasses(tutor, trialMode, classes = DEMO_CLASSES) {
    const list = document.getElementById('classes-list');
    if (!list) return;

    list.innerHTML = classes.map((cls, i) => {
      const clickKey  = `zoom_${tutor.id}_${cls.id}`;
      const count     = zoomClicks[clickKey] || 0;
      const isTrial   = cls.trialClass > 0;
      const showZoom  = (trialMode && isTrial) || !isTrial;
      const showBook  = count >= 2;

      return `
        <div class="class-card">
          <div class="class-info">
            <div class="class-date">${cls.date}</div>
            <div class="class-time">${cls.time}</div>
            <div class="class-topic">${cls.topic}</div>
            ${isTrial ? `<span class="badge badge-green" style="margin-top:6px">Free Trial</span>` : ''}
          </div>
          <div class="class-actions">
            ${showBook
              ? `<button class="btn btn-amber btn-sm" data-book="${tutor.id}" data-class="${cls.id}">
                   💳 Book Now – Rs.1,000
                 </button>`
              : showZoom
                ? `<a href="${cls.zoom}" target="_blank" rel="noopener"
                      class="btn btn-green btn-sm zoom-btn" data-key="${clickKey}">
                     📹 Join Zoom
                   </a>`
                : `<button class="btn btn-outline btn-sm" disabled>
                     🔒 Login Required
                   </button>`
            }
          </div>
        </div>`;
    }).join('');

    // Track zoom clicks
    list.querySelectorAll('.zoom-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        zoomClicks[key] = (zoomClicks[key] || 0) + 1;
        if (zoomClicks[key] >= 2) {
          // Re-render to show book button
          renderClasses(tutor, trialMode, classes);
        }
      });
    });

    // Book now
    list.querySelectorAll('[data-book]').forEach(btn => {
      btn.addEventListener('click', () => showBookingBox());
    });
  }

  function showBookingBox() {
    let box = document.getElementById('booking-box');
    if (box) { box.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }

    const modal = document.getElementById('modal-body');
    box = document.createElement('div');
    box.id = 'booking-box';
    box.className = 'booking-box';
    box.innerHTML = `
      <div class="booking-title">💳 Payment Instructions</div>
      <div class="booking-info">
        <p>To confirm your booking, please make a bank transfer:</p>
        <div class="bank-detail">
          <p>🏦 <strong>Bank:</strong> Bank of Ceylon (BOC)</p>
          <p>💳 <strong>Account Number:</strong> <strong>6807410</strong></p>
          <p>💰 <strong>Amount:</strong> Rs. 1,000</p>
        </div>
        <p>After payment, send your receipt to the admin via WhatsApp:</p>
        <p style="margin-top:4px;font-size:.8rem;color:#92400E">⚠️ You will receive a class password from the admin after payment confirmation. This may take up to 24 hours.</p>
      </div>
      <button id="send-to-admin" class="btn btn-whatsapp btn-full" style="margin-top:18px">
        <svg style="width:20px;height:20px;fill:white;flex-shrink:0" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.112.549 4.1 1.507 5.83L0 24l6.335-1.48A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.848 0-3.579-.504-5.065-1.381l-.363-.215-3.762.878.893-3.673-.236-.376A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
        Send Receipt to Admin
      </button>`;
    modal.appendChild(box);
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });

    document.getElementById('send-to-admin').addEventListener('click', () => {
      const msg = encodeURIComponent("Hello! I've paid for a Zyndra Minds class. Sending my receipt now. 📎");
      window.open(`${CONFIG.ADMIN_WA_URL}?text=${msg}`, '_blank');
    });
  }

  // Close modal
  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay || e.target.closest('.modal-close')) {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    Session.clear();
    window.location.href = 'index.html';
  });
}

/* ─────────────────────────────────────────────
   PAGE: APPLY.HTML (Tutor Registration)
───────────────────────────────────────────── */
function initApplyPage() {
  const form       = document.getElementById('apply-form');
  const successMsg = document.getElementById('success-message');
  const imageInput = document.getElementById('tutor-image');
  const preview    = document.getElementById('image-preview');
  const uploadArea = document.getElementById('upload-area');

  if (!form) return;

  // Image preview
  if (imageInput) {
    imageInput.addEventListener('change', () => {
      const file = imageInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = e => {
        preview.src = e.target.result;
        preview.classList.add('show');
        uploadArea.classList.add('has-file');
        uploadArea.querySelector('.upload-text').innerHTML =
          `<strong>${file.name}</strong><br><span style="color:var(--green)">✓ Image selected</span>`;
      };
      reader.readAsDataURL(file);
    });
  }

  // Form submit
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const submitBtn = document.getElementById('submit-btn');
    setLoading(submitBtn, true);

    const name        = document.getElementById('tutor-name').value.trim();
    const subject     = document.getElementById('tutor-subject').value.trim();
    const grade       = document.getElementById('tutor-grade').value.trim();
    const email       = document.getElementById('tutor-email').value.trim();
    const phone       = document.getElementById('tutor-phone').value.trim();
    const description = document.getElementById('tutor-desc').value.trim();

    if (!name || !subject || !grade || !email || !phone) {
      showToast('Please fill in all required fields.', 'error');
      setLoading(submitBtn, false);
      return;
    }

    // Read image as base64
    let imageBase64 = '';
    const file = imageInput?.files[0];
    if (file) {
      imageBase64 = await new Promise(res => {
        const reader = new FileReader();
        reader.onload = e => res(e.target.result);
        reader.readAsDataURL(file);
      });
    }

    const payload = { name, subject, grade, email, phone, description, image: imageBase64 };

    // Send to GAS
    const result = await sendToGAS('applyTutor', payload);

    await new Promise(r => setTimeout(r, 900));
    setLoading(submitBtn, false);

    // Show success
    form.style.display = 'none';
    successMsg.classList.add('show');
  });

  // WhatsApp contact
  document.getElementById('contact-admin-btn')?.addEventListener('click', () => {
    const msg = encodeURIComponent('Hello! I\'ve just submitted my tutor application on Zyndra Minds. I\'d like to follow up. 😊');
    window.open(`${CONFIG.ADMIN_WA_URL}?text=${msg}`, '_blank');
  });

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    Session.clear();
    window.location.href = 'index.html';
  });

  // Update nav
  const phone = Session.get();
  const navPhone = document.getElementById('nav-phone');
  if (navPhone && phone) navPhone.textContent = '📱 ' + phone;
}

/* ─────────────────────────────────────────────
   INIT — detect current page and run
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  injectFloatingWA();

  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';

  if (page === 'index.html' || page === '' || page === '/') {
    initLoginPage();
  } else if (page === 'tutors.html') {
    initTutorsPage();
  } else if (page === 'apply.html') {
    initApplyPage();
  }
});
