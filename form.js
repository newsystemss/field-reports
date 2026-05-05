const APPS_SCRIPT_URL = '';

const form = document.getElementById('brief-form');
const steps = document.querySelectorAll('.form-step');
const progressSteps = document.querySelectorAll('.progress .step');

let hasSubmitted = false;

let highestStepReached = 1;

function goToStep(n) {
  if (n > highestStepReached) highestStepReached = n;

  steps.forEach(s => s.classList.remove('active'));
  progressSteps.forEach(s => {
    const stepNum = parseInt(s.dataset.step);
    s.classList.remove('active', 'completed', 'future', 'locked');
    s.removeAttribute('aria-current');
    if (stepNum === n) {
      s.classList.add('active');
      s.setAttribute('aria-current', 'step');
    } else if (n === 3 || hasSubmitted) {
      s.classList.add('locked');
    } else if (stepNum <= highestStepReached) {
      s.classList.add('completed');
    } else {
      s.classList.add('future');
    }
  });

  const target = document.querySelector(`.form-step[data-step="${n}"]`);
  if (target) target.classList.add('active');

  if (n <= 2 && !hasSubmitted) {
    form.style.display = '';
    const submitBtn = form.querySelector('.btn-submit');
    if (submitBtn) {
      submitBtn.disabled = false;
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateStep(stepNum) {
  const step = document.querySelector(`.form-step[data-step="${stepNum}"]`);
  const fields = step.querySelectorAll('.field');
  let valid = true;
  let firstInvalid = null;

  fields.forEach(field => {
    const input = field.querySelector('input[required], textarea[required]');
    if (!input) return;

    field.classList.remove('invalid');

    if (!input.value.trim()) {
      field.classList.add('invalid');
      valid = false;
      if (!firstInvalid) firstInvalid = input;
    } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      field.classList.add('invalid');
      valid = false;
      if (!firstInvalid) firstInvalid = input;
    }
  });

  if (firstInvalid) {
    firstInvalid.focus();
  }

  return valid;
}

// Progress step navigation
document.querySelectorAll('.progress button.step').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('completed') && !btn.classList.contains('locked')) {
      goToStep(parseInt(btn.dataset.step));
    }
  });
});

// Next buttons
document.querySelectorAll('.btn-next').forEach(btn => {
  btn.addEventListener('click', () => {
    const currentStep = parseInt(btn.closest('.form-step').dataset.step);
    if (validateStep(currentStep)) {
      goToStep(parseInt(btn.dataset.next));
    }
  });
});

// Back buttons
document.querySelectorAll('.btn-back').forEach(btn => {
  btn.addEventListener('click', () => {
    goToStep(parseInt(btn.dataset.back));
  });
});

// Auto-expand textareas
document.querySelectorAll('textarea').forEach(textarea => {
  textarea.style.overflow = 'hidden';

  function autoResize() {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  textarea.addEventListener('input', autoResize);
});

// Clear validation on input
document.querySelectorAll('.field input, .field textarea').forEach(input => {
  input.addEventListener('input', () => {
    input.closest('.field').classList.remove('invalid');
  });
});

// Submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (hasSubmitted) return;
  if (!validateStep(2)) return;

  hasSubmitted = true; // Set before await to prevent double-submit race
  const submitBtn = form.querySelector('.btn-submit');
  submitBtn.disabled = true;

  const data = {
    _token: 'ns-fieldreports-2026',
    firstName: document.getElementById('firstName').value.trim(),
    lastName: document.getElementById('lastName').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    twitter: document.getElementById('twitter').value.trim(),
    instagram: document.getElementById('instagram').value.trim(),
    website: document.getElementById('website').value.trim(),
    company: document.getElementById('company').value.trim(),
    referral: document.getElementById('referral').value.trim(),
    question: document.getElementById('question').value.trim(),
    methods: document.getElementById('methods').value.trim(),
    links: document.getElementById('links').value.trim(),
    format: document.getElementById('format').value.trim(),
    learnings: document.getElementById('learnings').value.trim(),
    outcomes: document.getElementById('outcomes').value.trim(),
    other: document.getElementById('other').value.trim(),
  };

  try {
    if (APPS_SCRIPT_URL) {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.error) {
        throw new Error(result.error);
      }
    }
    goToStep(3);
    form.style.display = 'none';
  } catch (err) {
    hasSubmitted = false;
    submitBtn.disabled = false;
    const detail = err && err.message ? err.message : 'Unknown error';
    alert('Something went wrong: ' + detail + '\n\nPlease try again or email stadium@newsystems.ca directly.');
  }
});
