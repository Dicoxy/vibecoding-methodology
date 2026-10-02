# HERE — Методология (вайбкодинг)

**Дата:** 2026-10-02 · work-log — `/home/dev/projects/vibecoding/CHANGELOG.md`

**Стоим:** 02.10 принято model-independent архитектурное решение: инвариант — «Архитектор + ИИ», роли стабильны, AI-engine сменяем. Cold-start новым Orchestrator восстановил верхний контур из внешнего source of truth; выявлен drift старых role/state документов относительно нового канона.

**Дальше:** провести первый живой coding-cycle с новой связкой OpenAI/Codex по существующему циклу contract → isolated Implementer → gates/Judge → human acceptance и зафиксировать факты прохождения.

**Ждём:** 2–3 живых coding-cycle до формализации thinking protocol, adapter layer и lease/lock; PROMOTE CANDIDATE и EXPERIMENT до дополнительных кейсов не повышать.
