# Templates d'emails automatiques - WebElec

Collection de templates d'emails pour différents scénarios.

---

## 1. Email de confirmation standard (Demande de démo)

**Utilisé pour :** Toutes les demandes de démonstration (non urgentes)

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        color: white;
        padding: 30px;
        text-align: center;
        border-radius: 8px 8px 0 0;
      }
      .content {
        background: #ffffff;
        padding: 30px;
        border: 1px solid #e5e7eb;
      }
      .footer {
        background: #f9fafb;
        padding: 20px;
        text-align: center;
        border-radius: 0 0 8px 8px;
        font-size: 14px;
        color: #6b7280;
      }
      .highlight {
        background: #dbeafe;
        padding: 15px;
        border-left: 4px solid #3b82f6;
        margin: 20px 0;
      }
      .btn {
        display: inline-block;
        background: #3b82f6;
        color: white;
        padding: 12px 30px;
        text-decoration: none;
        border-radius: 6px;
        margin: 20px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>WebElec</h1>
        <p>Solutions électriques professionnelles</p>
      </div>

      <div class="content">
        <p>Bonjour {{NOM_CLIENT}},</p>

        <p>
          Nous vous remercions pour votre demande de démonstration de
          <strong>WebElec</strong>.
        </p>

        <div class="highlight">
          <p><strong>✅ Votre demande a bien été enregistrée</strong></p>
          <p>
            Notre équipe vous recontactera dans les
            <strong>24 heures</strong> pour organiser votre démonstration
            personnalisée.
          </p>
        </div>

        <p>En attendant, voici ce que WebElec peut vous apporter :</p>
        <ul>
          <li>📸 Gestion centralisée de vos chantiers et photos</li>
          <li>📋 Conformité RGIE automatisée</li>
          <li>📄 Génération de documents professionnels</li>
          <li>⚡ Interface moderne et intuitive</li>
        </ul>

        <p style="text-align: center;">
          <a href="https://landing-page-webelec.vercel.app/" class="btn"
            >Découvrir WebElec</a
          >
        </p>

        <p>
          <strong>Besoin d'aide immédiate ?</strong><br />
          Contactez-nous directement au
          <a href="tel:+32497506536">+32 497 50 65 36</a>
        </p>

        <p>
          À très bientôt,<br />
          <strong>L'équipe WebElec</strong>
        </p>
      </div>

      <div class="footer">
        <p>
          <strong>WebElec</strong><br />
          Support : support@webelec.be<br />
          Tél : +32 497 50 65 36<br />
          Web :
          <a href="https://landing-page-webelec.vercel.app/"
            >landing-page-webelec.vercel.app</a
          >
        </p>

        <p style="font-size: 12px; margin-top: 15px;">
          © 2024 WebElec. Tous droits réservés.<br />
          Email automatique - Ne pas répondre à ce message, nous vous
          contacterons directement.
        </p>
      </div>
    </div>
  </body>
</html>
```

---

## 2. Email de confirmation URGENTE

**Utilisé pour :** Demandes urgentes (panne, danger, urgence détectée par l'IA)

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        color: white;
        padding: 30px;
        text-align: center;
        border-radius: 8px 8px 0 0;
      }
      .content {
        background: #ffffff;
        padding: 30px;
        border: 1px solid #e5e7eb;
      }
      .footer {
        background: #f9fafb;
        padding: 20px;
        text-align: center;
        border-radius: 0 0 8px 8px;
        font-size: 14px;
        color: #6b7280;
      }
      .urgent {
        background: #fee2e2;
        padding: 20px;
        border-left: 4px solid #dc2626;
        margin: 20px 0;
      }
      .btn-urgent {
        display: inline-block;
        background: #dc2626;
        color: white;
        padding: 15px 40px;
        text-decoration: none;
        border-radius: 6px;
        margin: 20px 0;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>⚡ WebElec - Demande Urgente</h1>
        <p>Intervention rapide</p>
      </div>

      <div class="content">
        <p>Bonjour {{NOM_CLIENT}},</p>

        <div class="urgent">
          <h2 style="color: #dc2626; margin-top: 0;">
            🚨 DEMANDE URGENTE ENREGISTRÉE
          </h2>
          <p><strong>Notre équipe a été immédiatement alertée.</strong></p>
          <p>
            Nous vous contacterons dans les <strong>2 heures maximum</strong>.
          </p>
        </div>

        <p>
          Votre demande concernant : <strong>{{TYPE_INTERVENTION}}</strong> a
          été classée comme urgente et traitée en priorité.
        </p>

        <p><strong>⏱️ Actions immédiates :</strong></p>
        <ul>
          <li>✅ Demande enregistrée à {{HEURE_RECEPTION}}</li>
          <li>📱 Équipe technique alertée</li>
          <li>🔔 Vous serez contacté sous 2h</li>
        </ul>

        <p style="text-align: center;">
          <a href="tel:+32497506536" class="btn-urgent"
            >📞 Appeler maintenant<br />+32 497 50 65 36</a
          >
        </p>

        <p
          style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b;"
        >
          <strong
            >⚠️ En cas d'urgence absolue (danger immédiat, risque d'incendie,
            électrocution) :</strong
          ><br />
          Appelez immédiatement le <strong>+32 497 50 65 36</strong> ou les
          services d'urgence au <strong>112</strong>.
        </p>

        <p>
          Nous mettons tout en œuvre pour intervenir le plus rapidement
          possible.
        </p>

        <p>
          Cordialement,<br />
          <strong>L'équipe d'intervention WebElec</strong>
        </p>
      </div>

      <div class="footer">
        <p>
          <strong>WebElec - Service d'urgence</strong><br />
          Support : support@webelec.be<br />
          Urgences : +32 497 50 65 36 (24/7)<br />
          Web :
          <a href="https://landing-page-webelec.vercel.app/"
            >landing-page-webelec.vercel.app</a
          >
        </p>

        <p style="font-size: 12px; margin-top: 15px;">
          © 2024 WebElec. Tous droits réservés.
        </p>
      </div>
    </div>
  </body>
</html>
```

---

## 3. Email de notification interne (pour vous)

**Utilisé pour :** Alerter l'équipe d'une nouvelle demande urgente

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: "Courier New", monospace;
        background: #1f2937;
        color: #f9fafb;
        padding: 20px;
      }
      .container {
        max-width: 800px;
        margin: 0 auto;
        background: #111827;
        border: 2px solid #dc2626;
        border-radius: 8px;
        padding: 30px;
      }
      .header {
        background: #dc2626;
        color: white;
        padding: 20px;
        margin: -30px -30px 20px -30px;
        border-radius: 6px 6px 0 0;
      }
      .section {
        background: #1f2937;
        padding: 15px;
        margin: 15px 0;
        border-left: 4px solid #3b82f6;
      }
      .urgent {
        color: #fca5a5;
        font-weight: bold;
      }
      .data {
        color: #60a5fa;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 15px 0;
      }
      td {
        padding: 8px;
        border-bottom: 1px solid #374151;
      }
      td:first-child {
        color: #9ca3af;
        width: 150px;
      }
      td:last-child {
        color: #f9fafb;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 style="margin: 0;">🚨 ALERTE - Nouvelle demande URGENTE</h1>
        <p style="margin: 10px 0 0 0;">WebElec - Système d'automatisation</p>
      </div>

      <div class="section">
        <h2 class="urgent">⚠️ NIVEAU D'URGENCE : {{URGENCE}}</h2>
        <p>Score : <span class="data">{{SCORE_URGENCE}}/10</span></p>
        <p>Mots-clés détectés : <span class="data">{{MOTS_CLES}}</span></p>
      </div>

      <div class="section">
        <h3>👤 INFORMATIONS CLIENT</h3>
        <table>
          <tr>
            <td>Nom</td>
            <td class="data">{{NOM_CLIENT}}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td class="data">{{EMAIL_CLIENT}}</td>
          </tr>
          <tr>
            <td>Téléphone</td>
            <td class="data">{{TELEPHONE_CLIENT}}</td>
          </tr>
          <tr>
            <td>Entreprise</td>
            <td class="data">{{ENTREPRISE}}</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <h3>📋 DÉTAILS DE LA DEMANDE</h3>
        <table>
          <tr>
            <td>Type</td>
            <td class="data">{{TYPE_DEMANDE}}</td>
          </tr>
          <tr>
            <td>Type de travaux</td>
            <td class="data">{{TYPE_TRAVAUX}}</td>
          </tr>
          <tr>
            <td>Adresse</td>
            <td class="data">{{ADRESSE}}</td>
          </tr>
          <tr>
            <td>Délai</td>
            <td class="data">{{DELAI}}</td>
          </tr>
        </table>

        <p><strong>Description :</strong></p>
        <p style="background: #374151; padding: 15px; border-radius: 4px;">
          {{DESCRIPTION}}
        </p>
      </div>

      <div class="section">
        <h3>📧 EMAIL ORIGINAL</h3>
        <table>
          <tr>
            <td>Sujet</td>
            <td>{{SUJET_EMAIL}}</td>
          </tr>
          <tr>
            <td>Reçu le</td>
            <td>{{DATE_RECEPTION}}</td>
          </tr>
          <tr>
            <td>Sentiment</td>
            <td class="data">{{SENTIMENT}}</td>
          </tr>
          <tr>
            <td>Langue</td>
            <td class="data">{{LANGUE}}</td>
          </tr>
        </table>

        <p><strong>Contenu complet :</strong></p>
        <div
          style="background: #374151; padding: 15px; border-radius: 4px; max-height: 300px; overflow-y: auto;"
        >
          <pre style="margin: 0; white-space: pre-wrap; color: #d1d5db;">
{{CONTENU_EMAIL}}</pre
          >
        </div>
      </div>

      <div class="section" style="border-left-color: #10b981;">
        <h3 style="color: #10b981;">✅ ACTIONS AUTOMATIQUES EFFECTUÉES</h3>
        <ul>
          <li>✅ Email de confirmation envoyé au client</li>
          <li>✅ Données sauvegardées dans Google Sheets</li>
          <li>✅ Vous recevez cette alerte email</li>
          <li>✅ Email marqué comme traité dans Gmail</li>
        </ul>
      </div>

      <div
        style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #374151;"
      >
        <p style="color: #fca5a5; font-size: 18px; font-weight: bold;">
          ⚡ ACTION REQUISE : Contacter le client rapidement !
        </p>
        <p>
          <a
            href="tel:{{TELEPHONE_CLIENT}}"
            style="display: inline-block; background: #dc2626; color: white; padding: 15px 40px; text-decoration: none; border-radius: 6px; margin: 10px;"
          >
            📞 Appeler {{NOM_CLIENT}}
          </a>
        </p>
        <p>
          <a
            href="mailto:{{EMAIL_CLIENT}}"
            style="display: inline-block; background: #3b82f6; color: white; padding: 15px 40px; text-decoration: none; border-radius: 6px; margin: 10px;"
          >
            ✉️ Répondre par email
          </a>
        </p>
      </div>

      <div
        style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #374151; color: #6b7280; font-size: 12px; text-align: center;"
      >
        <p>
          Email automatique généré par n8n - WebElec<br />
          Workflow : Gestion automatique des demandes<br />
          Heure de traitement : {{HEURE_TRAITEMENT}}
        </p>
      </div>
    </div>
  </body>
</html>
```

---

## 4. Template version texte simple (pour SMS/WhatsApp futur)

```js
🔔 Nouvelle demande WebElec

Client : {{NOM_CLIENT}}
Tel : {{TELEPHONE_CLIENT}}
Email : {{EMAIL_CLIENT}}

Urgence : {{URGENCE}} ({{SCORE_URGENCE}}/10)

Type : {{TYPE_DEMANDE}}
Description : {{DESCRIPTION}}

Action : Contacter rapidement !
```

---

## 5. Email de suivi automatique (après 48h sans réponse)

### À implémenter dans une version future du workflow

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 30px;
        text-align: center;
        border-radius: 8px 8px 0 0;
      }
      .content {
        background: #ffffff;
        padding: 30px;
        border: 1px solid #e5e7eb;
      }
      .footer {
        background: #f9fafb;
        padding: 20px;
        text-align: center;
        border-radius: 0 0 8px 8px;
        font-size: 14px;
        color: #6b7280;
      }
      .highlight {
        background: #d1fae5;
        padding: 15px;
        border-left: 4px solid #10b981;
        margin: 20px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>WebElec</h1>
        <p>Relance de votre demande</p>
      </div>

      <div class="content">
        <p>Bonjour {{NOM_CLIENT}},</p>

        <p>
          Il y a quelques jours, vous avez manifesté votre intérêt pour une
          démonstration de <strong>WebElec</strong>.
        </p>

        <div class="highlight">
          <p><strong>🤔 Avez-vous toujours besoin d'aide ?</strong></p>
          <p>
            Nous souhaitons nous assurer que votre demande a bien été traitée.
          </p>
        </div>

        <p>
          Si vous souhaitez toujours organiser une démonstration, n'hésitez pas
          à :
        </p>
        <ul>
          <li>📞 Nous appeler au <strong>+32 497 50 65 36</strong></li>
          <li>✉️ Répondre à cet email</li>
          <li>
            📅
            <a href="https://calendly.com/webelec"
              >Réserver un créneau directement</a
            >
          </li>
        </ul>

        <p>Nous restons à votre disposition pour toute question.</p>

        <p>
          Cordialement,<br />
          <strong>L'équipe WebElec</strong>
        </p>
      </div>

      <div class="footer">
        <p>
          <strong>WebElec</strong><br />
          Support : support@webelec.be<br />
          Tél : +32 497 50 65 36
        </p>

        <p style="font-size: 12px; margin-top: 15px;">
          Si vous ne souhaitez plus recevoir de messages,
          <a href="#">cliquez ici</a>.
        </p>
      </div>
    </div>
  </body>
</html>
```

---

## 6. Variables disponibles dans n8n

Pour personnaliser les templates dans n8n, utilisez ces variables :

### Données client

- `{{ $json.client_nom }}` - Nom du client
- `{{ $json.client_email }}` - Email du client
- `{{ $json.client_telephone }}` - Téléphone (peut être null)
- `{{ $json.ai_analysis.client.entreprise }}` - Nom de l'entreprise

### Données de la demande

- `{{ $json.urgence }}` - Niveau d'urgence (urgent/moyen/faible)
- `{{ $json.score_urgence }}` - Score 1-10
- `{{ $json.type_demande }}` - Type de demande (demo)
- `{{ $json.description_demande }}` - Résumé de la demande
- `{{ $json.ai_analysis.demande.type_travaux }}` - Type de travaux
- `{{ $json.ai_analysis.demande.adresse }}` - Adresse du chantier
- `{{ $json.ai_analysis.demande.delai }}` - Délai souhaité

### Données email

- `{{ $json.subject }}` - Sujet de l'email
- `{{ $json.body }}` - Corps de l'email
- `{{ $json.fromEmail }}` - Email expéditeur
- `{{ $json.receivedDate }}` - Date de réception
- `{{ $json.ai_analysis.sentiment }}` - Sentiment (positif/neutre/négatif)
- `{{ $json.ai_analysis.langue }}` - Langue détectée

### Données système

- `{{ $now.format('DD/MM/YYYY HH:mm') }}` - Date/heure actuelle
- `{{ $json.messageId }}` - ID unique de l'email

---

## 7. Personnalisation des templates

### Comment modifier un template dans n8n

1. Ouvrir le workflow
2. Cliquer sur le node **Send Auto Reply** (ou **Send Urgent Notification**)
3. Dans le champ **Message**, modifier le HTML
4. Utiliser les variables `{{ }}` pour insérer des données dynamiques
5. Tester avec **Execute Node**
6. Sauvegarder

### Bonnes pratiques

- ✅ Toujours tester les emails avant activation
- ✅ Vérifier l'affichage sur mobile
- ✅ Garder un ton professionnel mais chaleureux
- ✅ Inclure toujours les coordonnées de contact
- ✅ Respecter le RGPD (lien de désinscription)
- ✅ Utiliser des couleurs cohérentes avec votre marque

---

#### Templates créés pour WebElec - 2025
