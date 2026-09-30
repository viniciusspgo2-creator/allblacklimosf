(() => {
    'use strict';

    const body = document.body;
    const header = document.querySelector('[data-header]');
    const menuToggle = document.querySelector('.menu-toggle');
    const navigation = document.querySelector('.primary-nav');
    const submenuToggle = document.querySelector('.submenu-toggle');
    const megaMenu = document.querySelector('.mega-menu');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobileBreakpoint = window.matchMedia('(max-width: 920px)');
    const languageSwitcher = document.querySelector('[data-language-switcher]');
    const languageTrigger = languageSwitcher?.querySelector('.language-switcher__trigger');
    const languageButtons = languageSwitcher?.querySelectorAll('[data-language]') || [];
    const languageFlag = languageSwitcher?.querySelector('[data-language-flag]');
    const languageCode = languageSwitcher?.querySelector('[data-language-code]');

    const languageOptions = {
        en: { code: 'EN' },
        fr: { code: 'FR' },
        de: { code: 'DE' },
        es: { code: 'ES' },
        pt: { code: 'PT' },
    };

    const activeLanguage = () => {
        let saved = 'en';
        try {
            saved = window.localStorage.getItem('abl_language') || 'en';
        } catch (error) {
            saved = 'en';
        }
        return languageOptions[saved] ? saved : 'en';
    };

    const updateLanguageDisplay = (language) => {
        const option = languageOptions[language] || languageOptions.en;
        const activeButton = [...languageButtons].find((button) => button.dataset.language === language);
        if (languageFlag && activeButton?.dataset.flagSrc) languageFlag.src = activeButton.dataset.flagSrc;
        if (languageCode) languageCode.textContent = option.code;
        languageButtons.forEach((button) => {
            const isActive = button.dataset.language === language;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
    };

    const closeLanguageMenu = () => {
        languageSwitcher?.classList.remove('is-open');
        languageTrigger?.setAttribute('aria-expanded', 'false');
    };

    languageTrigger?.addEventListener('click', () => {
        const willOpen = !languageSwitcher?.classList.contains('is-open');
        languageSwitcher?.classList.toggle('is-open', willOpen);
        languageTrigger.setAttribute('aria-expanded', String(willOpen));
    });

    languageButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const language = button.dataset.language || 'en';
            closeLanguageMenu();
            updateLanguageDisplay(language);
            window.AllBlackI18n?.apply(language);
        });
    });

    document.addEventListener('click', (event) => {
        if (languageSwitcher && !languageSwitcher.contains(event.target)) closeLanguageMenu();
    });

    const setSubmenuState = (open) => {
        if (!submenuToggle || !megaMenu) return;
        submenuToggle.setAttribute('aria-expanded', String(open));
        megaMenu.classList.toggle('is-open', open);
    };

    const setMenuState = (open) => {
        if (!menuToggle || !navigation) return;
        menuToggle.classList.toggle('is-active', open);
        navigation.classList.toggle('is-open', open);
        menuToggle.setAttribute('aria-expanded', String(open));
        menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        navigation.setAttribute('aria-hidden', mobileBreakpoint.matches ? String(!open) : 'false');
        body.classList.toggle('menu-open', open);
        if (!open) setSubmenuState(false);
    };

    menuToggle?.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeLanguageMenu();
        setMenuState(!navigation?.classList.contains('is-open'));
    });

    submenuToggle?.addEventListener('click', (event) => {
        if (!mobileBreakpoint.matches) return;
        event.preventDefault();
        event.stopPropagation();
        setSubmenuState(!megaMenu?.classList.contains('is-open'));
    });

    navigation?.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            if (mobileBreakpoint.matches) setMenuState(false);
        });
    });

    navigation?.addEventListener('click', (event) => {
        if (mobileBreakpoint.matches && event.target === navigation) setMenuState(false);
    });

    document.addEventListener('click', (event) => {
        if (!mobileBreakpoint.matches || !navigation?.classList.contains('is-open')) return;
        if (!navigation.contains(event.target) && !menuToggle?.contains(event.target)) setMenuState(false);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setSubmenuState(false);
            setMenuState(false);
            closeLanguageMenu();
            menuToggle?.focus();
        }
    });

    const handleBreakpointChange = (event) => {
        setMenuState(false);
        if (!event.matches) setSubmenuState(false);
        navigation?.setAttribute('aria-hidden', event.matches ? 'true' : 'false');
    };

    if (typeof mobileBreakpoint.addEventListener === 'function') {
        mobileBreakpoint.addEventListener('change', handleBreakpointChange);
    } else if (typeof mobileBreakpoint.addListener === 'function') {
        mobileBreakpoint.addListener(handleBreakpointChange);
    }

    navigation?.setAttribute('aria-hidden', mobileBreakpoint.matches ? 'true' : 'false');

    const initialLanguage = activeLanguage();
    try {
        updateLanguageDisplay(initialLanguage);
        window.AllBlackI18n?.apply(initialLanguage);
    } catch (error) {
        updateLanguageDisplay('en');
    }

    let scrollFrame = null;
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.append(progress);

    const updateScrollUI = () => {
        const top = window.scrollY || document.documentElement.scrollTop;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = scrollable > 0 ? Math.min(top / scrollable, 1) : 0;
        header?.classList.toggle('is-scrolled', top > 22);
        progress.style.transform = `scaleX(${ratio})`;
        scrollFrame = null;
    };

    window.addEventListener('scroll', () => {
        if (scrollFrame === null) scrollFrame = window.requestAnimationFrame(updateScrollUI);
    }, { passive: true });
    updateScrollUI();

    document.querySelectorAll('[data-accordion]').forEach((accordion) => {
        const items = [...accordion.querySelectorAll('.faq-item')];
        items.forEach((item) => {
            const trigger = item.querySelector('.faq-question');
            trigger?.addEventListener('click', () => {
                const willOpen = !item.classList.contains('is-open');
                items.forEach((other) => {
                    other.classList.remove('is-open');
                    other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
                });
                if (willOpen) {
                    item.classList.add('is-open');
                    trigger.setAttribute('aria-expanded', 'true');
                }
            });
        });
    });

    const revealElements = document.querySelectorAll('[data-reveal]');
    if (reducedMotion || !('IntersectionObserver' in window)) {
        revealElements.forEach((element) => element.classList.add('is-visible'));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealElements.forEach((element) => revealObserver.observe(element));
    }

    const videos = [...document.querySelectorAll('video[autoplay]')];
    const loadVideo = (video) => {
        if (video.dataset.loaded === 'true' || reducedMotion) return;
        video.querySelectorAll('source[data-src]').forEach((source) => {
            source.src = source.dataset.src || '';
            source.removeAttribute('data-src');
        });
        video.dataset.loaded = 'true';
        video.load();
        const playback = video.play();
        if (playback && typeof playback.catch === 'function') playback.catch(() => {});
    };

    const lazyVideos = [...document.querySelectorAll('[data-lazy-video]')];
    if ('IntersectionObserver' in window && !reducedMotion) {
        const videoObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                loadVideo(entry.target);
                observer.unobserve(entry.target);
            });
        }, { rootMargin: '320px 0px' });
        lazyVideos.forEach((video) => videoObserver.observe(video));
    } else if (!reducedMotion) {
        lazyVideos.forEach(loadVideo);
    }

    if (reducedMotion) {
        videos.forEach((video) => {
            video.pause();
            video.removeAttribute('autoplay');
        });
    }
    const syncVideos = () => {
        videos.forEach((video) => {
            if (document.hidden || reducedMotion) {
                video.pause();
            } else {
                const playback = video.play();
                if (playback && typeof playback.catch === 'function') playback.catch(() => {});
            }
        });
    };
    document.addEventListener('visibilitychange', syncVideos);

    const bookingForm = document.querySelector('[data-booking-form]');
    if (bookingForm) {
        const pickupDateDisplay = bookingForm.querySelector('#pickup_date_display');
        const pickupDate = bookingForm.querySelector('#pickup_date');
        const pickupDatePicker = bookingForm.querySelector('#pickup_date_picker');
        const pickupDateTrigger = bookingForm.querySelector('[data-date-picker-trigger]');
        const pickupHour = bookingForm.querySelector('#pickup_hour');
        const pickupMinute = bookingForm.querySelector('#pickup_minute');
        const pickupPeriod = bookingForm.querySelector('#pickup_period');
        const pickupTime = bookingForm.querySelector('#pickup_time');
        const bookingNotice = document.querySelector('#booking_notice');
        const bookingNoticeDialog = bookingNotice?.querySelector('.booking-notice-modal__dialog');
        const bookingTimeZone = 'America/Los_Angeles';
        const minimumAdvanceMs = 12 * 60 * 60 * 1000;
        let noticeReturnFocus = null;
        let noticeCloseTimer = null;

        const pad2 = (value) => String(value).padStart(2, '0');

        const zonedParts = (date) => {
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: bookingTimeZone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hourCycle: 'h23',
            });
            const values = {};
            formatter.formatToParts(date).forEach((part) => {
                if (part.type !== 'literal') values[part.type] = part.value;
            });
            return {
                year: Number(values.year),
                month: Number(values.month),
                day: Number(values.day),
                hour: Number(values.hour),
                minute: Number(values.minute),
                second: Number(values.second),
            };
        };

        const zoneOffsetMs = (date) => {
            const parts = zonedParts(date);
            const wholeSecondEpoch = Math.floor(date.getTime() / 1000) * 1000;
            const wallAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
            return wallAsUtc - wholeSecondEpoch;
        };

        const zonedWallTimeToEpoch = (parts) => {
            const wallAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, 0);
            let epoch = wallAsUtc;
            for (let pass = 0; pass < 3; pass += 1) {
                const next = wallAsUtc - zoneOffsetMs(new Date(epoch));
                if (Math.abs(next - epoch) < 1000) {
                    epoch = next;
                    break;
                }
                epoch = next;
            }
            const roundTrip = zonedParts(new Date(epoch));
            if (
                roundTrip.year !== parts.year
                || roundTrip.month !== parts.month
                || roundTrip.day !== parts.day
                || roundTrip.hour !== parts.hour
                || roundTrip.minute !== parts.minute
            ) return null;
            return epoch;
        };

        const parseUsDate = (value) => {
            const trimmed = String(value || '').trim();
            let month;
            let day;
            let year;
            const compact = trimmed.match(/^(\d{2})(\d{2})(\d{4})$/);
            const separated = trimmed.match(/^(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{4})$/);
            if (compact) {
                month = Number(compact[1]);
                day = Number(compact[2]);
                year = Number(compact[3]);
            } else if (separated) {
                month = Number(separated[1]);
                day = Number(separated[2]);
                year = Number(separated[3]);
            } else {
                return null;
            }

            const test = new Date(Date.UTC(year, month - 1, day));
            if (
                year < 2000
                || test.getUTCFullYear() !== year
                || test.getUTCMonth() !== month - 1
                || test.getUTCDate() !== day
            ) return null;

            return { year, month, day };
        };

        const isoFromDateParts = (parts) => `${parts.year}-${pad2(parts.month)}-${pad2(parts.day)}`;
        const usFromDateParts = (parts) => `${pad2(parts.month)}/${pad2(parts.day)}/${parts.year}`;

        const syncDateValue = ({ normalize = false, showError = false } = {}) => {
            if (!pickupDateDisplay || !pickupDate) return null;
            const raw = pickupDateDisplay.value.trim();
            if (raw === '') {
                pickupDate.value = '';
                pickupDateDisplay.setCustomValidity('');
                return null;
            }

            const parts = parseUsDate(raw);
            if (!parts) {
                pickupDate.value = '';
                pickupDateDisplay.setCustomValidity(showError ? 'Enter a valid date in MM/DD/YYYY format.' : '');
                return null;
            }

            pickupDateDisplay.setCustomValidity('');
            pickupDate.value = isoFromDateParts(parts);
            if (normalize) pickupDateDisplay.value = usFromDateParts(parts);
            if (pickupDatePicker) pickupDatePicker.value = pickupDate.value;
            return parts;
        };

        const syncTimeValue = () => {
            if (!pickupHour || !pickupMinute || !pickupPeriod || !pickupTime) return null;
            const hour12 = Number(pickupHour.value);
            const minute = Number(pickupMinute.value);
            const period = pickupPeriod.value;
            if (!hour12 || pickupMinute.value === '' || !['AM', 'PM'].includes(period)) {
                pickupTime.value = '';
                return null;
            }
            const hour = period === 'PM' ? (hour12 % 12) + 12 : hour12 % 12;
            pickupTime.value = `${pad2(hour)}:${pad2(minute)}`;
            return { hour, minute };
        };

        const currentSanFranciscoDate = zonedParts(new Date());
        const currentDateIso = isoFromDateParts(currentSanFranciscoDate);
        if (pickupDatePicker) {
            pickupDatePicker.min = currentDateIso;
            pickupDatePicker.max = `${currentSanFranciscoDate.year + 2}-${pad2(currentSanFranciscoDate.month)}-${pad2(currentSanFranciscoDate.day)}`;
        }

        const selectedPickupEpoch = ({ showDateError = false } = {}) => {
            const dateParts = syncDateValue({ normalize: false, showError: showDateError });
            const timeParts = syncTimeValue();
            if (!dateParts || !timeParts) return null;
            return zonedWallTimeToEpoch({ ...dateParts, ...timeParts });
        };

        const openBookingNotice = () => {
            if (!bookingNotice) return;
            if (noticeCloseTimer) {
                window.clearTimeout(noticeCloseTimer);
                noticeCloseTimer = null;
            }
            noticeReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : pickupPeriod;
            bookingNotice.hidden = false;
            bookingNotice.setAttribute('aria-hidden', 'false');
            document.body.classList.add('booking-notice-open');
            window.requestAnimationFrame(() => {
                bookingNotice.classList.add('is-visible');
                bookingNoticeDialog?.focus();
            });
        };

        const closeBookingNotice = () => {
            if (!bookingNotice || bookingNotice.hidden) return;
            bookingNotice.classList.remove('is-visible');
            document.body.classList.remove('booking-notice-open');
            bookingNotice.setAttribute('aria-hidden', 'true');
            const finish = () => {
                bookingNotice.hidden = true;
                noticeCloseTimer = null;
                noticeReturnFocus?.focus?.();
            };
            if (reducedMotion) {
                finish();
            } else {
                noticeCloseTimer = window.setTimeout(finish, 180);
            }
        };

        const isSelectedPickupTooSoon = () => {
            const epoch = selectedPickupEpoch();
            return epoch !== null && epoch < Date.now() + minimumAdvanceMs;
        };

        const maybeWarnAboutLeadTime = () => {
            if (isSelectedPickupTooSoon()) openBookingNotice();
        };

        pickupDateDisplay?.addEventListener('input', () => {
            pickupDateDisplay.setCustomValidity('');
            syncDateValue();
        });

        pickupDateDisplay?.addEventListener('blur', () => {
            const parts = syncDateValue({ normalize: true, showError: pickupDateDisplay.value.trim() !== '' });
            if (parts) maybeWarnAboutLeadTime();
        });

        pickupDateTrigger?.addEventListener('click', () => {
            if (!pickupDatePicker) return;
            try {
                if (typeof pickupDatePicker.showPicker === 'function') {
                    pickupDatePicker.showPicker();
                } else {
                    pickupDatePicker.focus();
                    pickupDatePicker.click();
                }
            } catch (error) {
                pickupDatePicker.focus();
                pickupDatePicker.click();
            }
        });

        pickupDatePicker?.addEventListener('change', () => {
            if (!pickupDatePicker.value || !pickupDateDisplay || !pickupDate) return;
            const [year, month, day] = pickupDatePicker.value.split('-').map(Number);
            const parts = { year, month, day };
            pickupDateDisplay.value = usFromDateParts(parts);
            pickupDateDisplay.setCustomValidity('');
            pickupDate.value = pickupDatePicker.value;
            maybeWarnAboutLeadTime();
        });

        [pickupHour, pickupMinute, pickupPeriod].forEach((control) => {
            control?.addEventListener('change', () => {
                syncTimeValue();
                if (pickupHour?.value && pickupMinute?.value !== '' && pickupPeriod?.value) maybeWarnAboutLeadTime();
            });
        });

        bookingNotice?.querySelectorAll('[data-booking-notice-close]').forEach((control) => {
            control.addEventListener('click', closeBookingNotice);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && bookingNotice && !bookingNotice.hidden) closeBookingNotice();
        });

        bookingForm.addEventListener('submit', (event) => {
            const dateParts = syncDateValue({ normalize: true, showError: true });
            syncTimeValue();
            if (!dateParts) {
                event.preventDefault();
                event.stopImmediatePropagation();
                pickupDateDisplay?.reportValidity();
                return;
            }

            const pickupEpoch = selectedPickupEpoch({ showDateError: true });
            if (pickupEpoch === null) return;
            if (pickupEpoch < Date.now() + minimumAdvanceMs) {
                event.preventDefault();
                event.stopImmediatePropagation();
                openBookingNotice();
            }
        });
    }

    document.querySelectorAll('[data-submit-form]').forEach((form) => {
        form.addEventListener('submit', () => {
            const button = form.querySelector('button[type="submit"]');
            if (!button || !form.checkValidity()) return;
            button.disabled = true;
            button.dataset.originalLabel = button.innerHTML;
            button.innerHTML = '<span>Sending…</span><i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>';
        });
    });
})();
