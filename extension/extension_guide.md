# Guide d'Installation de l'Extension Ultimate Job Tool Companion

L'extension **Ultimate Job Tool Companion** est conçue pour fonctionner de pair avec l'application Web. Elle synchronise automatiquement les informations du poste actif dans votre tableau de bord et vous aide à remplir les formulaires de candidature sur les plateformes de recrutement (Lever, Greenhouse, Workday, LinkedIn, Indeed, etc.) avec vos documents personnalisés.

---

## 🛠️ Étape 1 : Charger l'extension dans votre navigateur

Comme cette extension est développée sur mesure pour votre application locale, elle n'est pas publiée sur le Chrome Web Store. Vous devez la charger en mode développeur.

### Pour Google Chrome, Brave, Microsoft Edge ou Opera :

1. Ouvrez votre navigateur et accédez à la page des extensions :
   - Sur Chrome/Brave : `chrome://extensions/`
   - Sur Edge : `edge://extensions/`
2. En haut à droite, activez l'option **Mode développeur** (Developer mode).
3. Cliquez sur le bouton **Charger le dossier non empaqueté** (Load unpacked) situé en haut à gauche.
4. Sélectionnez le dossier `extension/` de votre projet. Puisque votre projet tourne sous **WSL2** et votre navigateur sous **Windows**, vous pouvez accéder aux fichiers WSL directement dans le sélecteur de dossier Windows en entrant le chemin réseau suivant :
   - `\\wsl.localhost\Ubuntu\home\koukou\HELPDESK\Job_prompt_generator\ultimate-job-tool\extension`
   - *(Ajustez le nom de la distribution si vous n'utilisez pas "Ubuntu", par exemple `\\wsl.localhost\Debian\...` ou `\\wsl$\Ubuntu\...`)*
5. L'extension **Ultimate Job Tool Companion** apparaît désormais dans votre liste d'extensions !
6. *Astuce :* Épinglez l'extension dans votre barre d'outils pour y avoir un accès permanent.

---

## 📂 Étape 2 : Icône de l'extension

L'icône `icon128.png` a déjà été automatiquement générée et placée dans le sous-dossier `extension/icons/`. Votre navigateur l'affichera directement.

---

## 🚀 Étape 3 : Comment l'utiliser

### 1. Synchronisation (Local et Vercel)
L'extension est pré-configurée pour fonctionner à la fois sur votre serveur local WSL (port `3001`) et sur votre déploiement de production Vercel (grâce aux motifs d'écoute `http://localhost:3000/*`, `http://localhost:3001/*` et `https://*.vercel.app/*`).

1. Ouvrez l'application Ultimate Job Tool, soit en local sur `http://localhost:3001`, soit sur votre lien **Vercel** de production.
2. Allez sur le **Tableau de Bord** et sélectionnez une de vos candidatures pour l'activer.
3. L'extension détecte instantanément l'application active et se synchronise en arrière-plan.
4. Cliquez sur l'icône de l'extension dans votre barre d'outils pour vérifier que le titre et l'entreprise s'affichent correctement.

### 2. Configuration du Profil Autofill
1. Cliquez sur l'icône de l'extension ou ouvrez le panneau latéral.
2. Déroulez la section **Profil Personnel (Autofill)**.
3. Remplissez vos véritables informations personnelles (Prénom, Nom, LinkedIn, GitHub, etc.).
4. Cliquez sur **Sauvegarder**. Ces informations resteront enregistrées localement dans votre navigateur pour préserver votre vie privée tout en permettant le remplissage automatique.

### 3. Remplissage des Formulaires de Candidature
1. Rendez-vous sur la page de candidature d'une offre d'emploi (par exemple, sur Greenhouse, Lever ou Workday).
2. Un petit bouton flottant avec l'icône d'Ultimate Job Tool apparaît en bas à droite de votre écran.
3. Cliquez sur ce bouton pour ouvrir le **panneau latéral (sidebar)**. Vous y retrouverez :
   - Les informations sur le poste synchronisé.
   - Les documents générés par l'IA (Lettres de motivation) avec des raccourcis "Copier" et "Télécharger".
   - Un bouton **Autoremplir le Formulaire**.
4. Cliquez sur **Autoremplir le Formulaire** : l'extension va automatiquement remplir votre nom, e-mail, téléphone, profils sociaux et injecter la lettre de motivation correspondante dans le champ dédié.

---

## 🔒 Limite de sécurité du navigateur et Contournement (Drag & Drop)

**IMPORTANT :** Pour des raisons de sécurité, les navigateurs modernes interdisent strictement aux extensions de téléverser automatiquement des fichiers locaux (comme votre CV PDF personnalisé) dans les formulaires d'envoi.

**La solution simple de l'extension :**
Lorsque vous cliquez sur **Autoremplir**, l'extension peut déclencher le téléchargement automatique de votre document de candidature dans votre dossier `Téléchargements` local.
Il vous suffit ensuite de faire un **glisser-déposer (Drag & Drop)** du fichier depuis la barre de téléchargement de votre navigateur directement sur la zone de dépôt (Resume/CV) du formulaire d'emploi.
