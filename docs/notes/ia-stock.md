# Synthèse fonctionnelle et points de réutilisation possibles

## Aperçu général

L’application est un front **Next.js** pour PME d’électricité.  
Fonctionnalités :

- Extraction & QA sur PDF  
- Assistant IA du stock  
- CRUD Prisma/SQLite  
- Module RGIE (quiz + double vérification)  
- Plan d’implantation A4 drag & drop  
- Pages : accueil, IA, gestion, propositions, RGIE, implantation

---

## Architecture IA PDF

Composant **app/ai-pdf/page.tsx** :

- Envoi de question vers **/api/ai/pdf**  
- États : chargement, erreur, réponse  

L’API :

- Lit `public/certification.pdf`  
- Extrait le texte via `parsePDF`  
- Interroge OpenAI  
- Gère les erreurs PDF introuvable / extraction impossible

### Extraction PDF réutilisable

`lib/pdf-helper.ts` :

- Encapsule `pdfreader`  
- Renvoie texte + nombre de pages  
- Réutilisable tel quel dans Next.js ou Node

---

## Modèle de données (stock)

Prisma/SQLite :

- Installations  
- Items de stock  
- Propositions de commande  
- Statuts  

Relations :

- StockItem ↔ Installation  
- OrderProposal ↔ ProposalItem  

---

## Réutilisation dans webelec-saas

### Assistant PDF

- Copier **app/ai-pdf/page.tsx**  
- Le connecter à votre API `/api/ai/pdf`  
- Garder logique d’état + UX (Ctrl+Entrée)

Backend :

- Copier **app/api/ai/pdf/route.ts**  
- Modifier chemin PDF + clé OpenAI  
- `parsePDF` reste plug-and-play

### Assistant stock

- Même pattern : textarea → POST → réponse IA  
- UI réutilisable entièrement

### Base Prisma & CRUD

- Copier le schéma Prisma  
- Générer + créer la base :

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
