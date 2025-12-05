# Instructions GitHub Copilot – Projet Électricité & RGIE

Tu es Copilot pour un projet Next.js dédié aux électriciens belges et au RGIE 2025.  
L’objectif : produire du code fiable, clair et conforme aux pratiques du métier.

---

## 1. Contexte métier

Schémas unifilaires, circuits, protections, sections, tableaux, RGIE Livre 1,
ERP artisan, IoT, diagnostics, tableaux électriques.

---

## 2. Style général

- Code propre, rigoureux, sans magie.
- Aucun article RGIE inventé.
- async/await toujours utilisé correctement.
- Server/Client strict.

---

## 3. Next.js

App Router, pages/layouts, API routes, Server Components,
Actions serveur pour logique électrique.

---

## 4. TypeScript

Types orientés métier : CircuitType, ProtectionType, SectionMM2,
RgieArticle, MeasurementESP32, IoTDevice.

Pas de `any`.

---

## 5. UI

shadcn/ui prioritaire, Tailwind clair, responsive.

---

## 6. Spécificités RGIE

Respecter les sections standard, circuits spécialisés,
différentiels adéquats, articles existants.

---

## 7. Ce qu’il faut éviter

Schémas approximatifs, valeurs au hasard, inventions, mélange server/client, dépendances inutiles.

---

## Interdictions

- Ne jamais générer de code basé sur des suppositions.
- Ne jamais proposer de classes Tailwind inexistantes.
- Ne pas utiliser fetch côté client si un Server Component suffit.
- Ne jamais créer un hook personnalisé si un hook React natif suffit.
- Ne pas réécrire un fichier complet si une correction locale suffit.
- Ne pas créer d’API Route si une Server Action est plus adaptée.
