# A11y manual verification checklist

Прогнать после завершения Phase 6. Если что-то fail — открыть gap-план.

## Chrome DevTools Lighthouse (mobile, simulated throttling)

- [ ] Accessibility = 100
- [ ] Performance ≥ 90
- [ ] Best Practices ≥ 95
- [ ] CLS = 0
- [ ] LCP ≤ 1.5s на simulated Slow 4G/3G

## axe DevTools extension

- [ ] 0 critical
- [ ] 0 serious
- [ ] 0 moderate (допустимо, но проверить — не наш ли код)

## Keyboard

- [ ] Tab от старта (без boot) → проходит в порядке: `cd about` → `cd projects` → `cd contact` → ссылки About → ссылки Projects cards → ссылки+button Contact
- [ ] Shift+Tab возвращает в обратном порядке
- [ ] Focus-ring виден на ВСЕХ элементах, включая **активную** команду навбара (инвертированная) — там outline должен быть в цвете bg
- [ ] Никаких focus-trap'ов

## Screen reader (NVDA / VoiceOver)

- [ ] Boot sequence (первый визит): слышно пошаговые строки через aria-live
- [ ] Нав читается только как `cd about / cd projects / cd contact` (без `guest@portfolio:~$` и без separator `|`)
- [ ] About читается полным именем «Suvorov Denis» один раз (не побуквенно)
- [ ] Contact: каждый ряд как пара — `email, erkobraxx@gmail.com, Copy to clipboard button`
- [ ] TG-мокап: читается как `Dialog preview for marketplace-kwork bot, image`

## prefers-reduced-motion (DevTools Rendering)

- [ ] Активировать `prefers-reduced-motion: reduce`
- [ ] Очистить localStorage key `portfolio:boot-shown` и refresh — **boot пропускается**
- [ ] Scanline drift остановлен (scanlines видны, но не движутся)
- [ ] Cursor blink остановлен (курсор виден, статичный)
- [ ] TypedText в About показывает имя целиком мгновенно
- [ ] Когда веб-видео добавятся: autoplay выключен, видны `controls` и overlay «click to play»

## localStorage / boot

- [ ] Первый визит (пустой localStorage, no reduced-motion) — boot играется ~2.5с
- [ ] Клик / Esc / любая клавиша / `[ skip ]` → немедленный пропуск
- [ ] После boot key `portfolio:boot-shown = "1"` в DevTools → Application → Local Storage
- [ ] Рефреш → boot не играется
- [ ] Очистить ключ → boot снова играется

## Copy email

- [ ] Клик `[copy]` на email → копируется в буфер (Ctrl+V в URL → `erkobraxx@gmail.com`)
- [ ] Label ненадолго меняется на `[copied]`
- [ ] Aria-live: SR озвучивает «Copied to clipboard»

## View Source

- [ ] `Ctrl+U` на dev-странице: подстрока `erkobraxx@gmail.com` одной строкой НЕ найдена (обфускация работает)
