# AGENTS.md — Nur Combinator
5. **İstikrar**
   Süreçlerin oturduğu, kalitenin ve sürdürülebilirliğin güçlendiği evre.

6. **Yaygınlaştırma**
   Faydanın daha geniş alanlara ulaştığı, çoğaltıldığı ve kalıcı etkinin hedeflendiği evre.

## Landing Page Canonical Structure

The homepage / landing page should generally follow this structure:

1. Header
2. Hero
3. Project Signal visual card
4. Model section
5. Stage map section
6. Audience section
7. 12-week flow section
8. Final CTA
9. Footer

## Canonical Copy

Hero headline:

> İyi niyetli projeler için yalnızca hız değil, istikamet.

Hero supporting copy:

> Nur Combinator; Risale-i Nur, ilim, eğitim, etik ve açık kaynak fayda üreten projelerin evresini tespit eder, ihtiyaçlarını netleştirir ve doğru mentor, ekip ve kaynaklarla buluşturur.

Model section headline:

> Klasik hızlandırıcı değil. İhtiyaçları dolaşıma sokan bir bağ dokusu.

Stage section headline:

> Gelir merdiveni değil; hizmetin olgunlaşma çizgisi.

Final CTA headline:

> Projenin hangi evrede olduğunu gör. İhtiyacını ilan et. Doğru insanlarla buluş.

Main CTA labels:

- Projeni Konumlandır
- Başvuru Yolculuğunu Başlat
- Mentor Olarak Katıl
- Connect’e Başla

## Engineering Rules

- Do not break existing routes.
- Do not remove authentication, data, or backend logic unless explicitly instructed.
- Do not introduce OAuth unless explicitly instructed.
- Do not add pricing or payment flows unless explicitly instructed.
- Do not invent real partners, real metrics, real testimonials, or real institutional claims.
- Static illustrative metrics are allowed only when clearly used as UI placeholders.
- Keep all pages responsive.
- Prefer component-based implementation.
- Use Tailwind consistently.
- Use shadcn/ui components where useful, but avoid default-looking shadcn layouts.
- Use lucide-react icons if already available or easy to install.
- Keep accessibility in mind: semantic HTML, readable contrast, focus states, and button labels.
- Do not leave broken links or dead CTAs without clear placeholders.

## Motion Rules

If motion is used:

- Keep it subtle.
- Use short entrance animations.
- Use gentle hover elevation.
- Avoid excessive scroll animations.
- Do not create childish or distracting motion.

## Reporting Rules

After every implementation task, report:

1. Files changed
2. Summary of implementation
3. What was not touched
4. Checklist status
5. Any risk or recommended follow-up
