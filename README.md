# WebElec SaaS

<div align="center">
  <img src="https://img.icons8.com/color/96/000000/electrical--v2.png" alt="Logo électricien" />
  <br />
  <b>Gestion d'activité pour artisan électricien</b>
</div>

---

## 🏗️ Architecture du projet

Schéma simplifié du fonctionnement de l'application :

```mermaid
graph TD
    Utilisateur[Utilisateur (navigateur)] --> Front(Frontend <br> Next.js / React)
    Front -->|Requêtes HTTP| Back(Backend <br> Spring Boot API)
    Back -->|Requêtes SQL| BDD[(Base de Données <br> H2 ou PostgreSQL)]
```

- **Frontend :** Next.js (React), TypeScript
- **Backend :** Spring Boot 3.5.8 (Java 21), API REST
- **Base de données :** H2 intégrée (dev) ou PostgreSQL (prod)

---

## 🚀 Mise en route rapide

### 1. Prérequis logiciels

- [Java 21 (JDK complet)](https://adoptium.net/fr/temurin/releases/?version=21)
- [Node.js 20+](https://nodejs.org/fr/download/)
- (Optionnel) PostgreSQL si besoin de données persistantes en production

### 2. Lancer le backend

```bash
cd webelec/backend
# Sous Windows :
mvnw.cmd spring-boot:run
# Sous Linux/Mac :
./mvnw spring-boot:run
```
L'API démarre sur http://localhost:8080

### 3. Lancer le frontend

```bash
cd frontend
npm install
npm run dev
```
Puis ouvre http://localhost:3000 dans ton navigateur.

**⚙️ Pour changer l'adresse du backend, édite la variable d'environnement `NEXT_PUBLIC_API_BASE` (voir fichier `.env`).**

---

## 👩‍💻 Fonctionnalités principales

- Mode sombre/clair à bascule
- Gestion des sociétés : création, affichage, suppression via panneau de test intégré
- Consommation API REST réalisée avec Spring Boot
- Structure prête à l'emploi pour rajouter de nouveaux modules (chantiers, utilisateurs...)

---

## 🧑‍🎓 Pour les débutants

- **Installe Java 21 et Node.js 20+** (lien et vérification de version plus haut).
- Lance d’abord le backend (API), puis le frontend (interface).
- Si l’interface affiche « aucune société », vérifie que l’API tourne bien.
- En cas de souci, regarde le terminal/cmd pour lire les messages d’erreur : c’est souvent parlant !
- Pour ajouter une société de test, saisis juste un nom et valide : tu la retrouveras listée instantanément.

---

## 🔌 Points techniques – Backend

- **Spring Boot 3.5.8** (Web, Data JPA, Validation)
- **Base H2** auto-configurée en développement (aucune installation supplémentaire).
- Passez facilement sur PostgreSQL en production (voir `application.yml`)
- Structure recommandée :  
    - `src/main/java/com/webelec/backend/BackendApplication.java` : point d'entrée de l'appli Spring
    - `src/main/resources` : configuration & ressources

---

## 📋 Exemple d’utilisation API (sociétés)

| Méthode | Endpoint                    | Action                         |
|---------|-----------------------------|-------------------------------|
| GET     | `/api/societes`             | Lister les sociétés           |
| POST    | `/api/societes`             | Créer une société             |
| GET     | `/api/societes/{id}`        | Détail d'une société          |
| DELETE  | `/api/societes/{id}`        | Supprimer une société         |

Exemple d’ajout depuis un terminal :
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"Test"}' http://localhost:8080/api/societes
```

---

## 🔧 Astuce – Captures d'écran

Ajoute des images dans le README pour illustrer l’application :  
```markdown
![Capture écran interface](./screenshot.png)
```
Prends une capture (Windows : Win+Shift+S) et place-la dans le dossier du projet.

---

## 🛟 Besoin d’aide ?

- Vérifie systématiquement les prérequis.
- Copie tout message d’erreur si tu bloques, pour demander de l’aide sur GitHub ou ici.
- Consulte les README additionnels dans les sous-dossiers si besoin de détails encore plus techniques.

---

## 🤝 Contribuer

Toute suggestion/correction est la bienvenue !  
Fais une « issue » ou une « pull request » pour améliorer le projet ou sa documentation.

---

**Exemple visuel attendu d’accueil :**

![Aperçu interface utilisateur](./apercu-accueil.png)

---

© WebElec SaaS — Projet open-source
