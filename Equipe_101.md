# Feedback Équipe 101

## Fonctionnalités


### Annuler-refaire

**Critères d'acceptabilité**

- [x] Il est possible d’annuler la dernière action réalisée.
- [x] La fonction d’annulation de dernière action peut être appelée un nombre illimité de fois.
- [x] Toutes les modifications apportés à la même sélection sont considérés comme 1 seule action.
- [x] Il est possible de refaire toutes les actions annulées, une à la fois, dans l’ordre inverse.
- [x] Une nouvelle action élimine la pile des actions annulées pouvant être refaite.
- [x] Annuler et Refaire sont accessible via la barre latérale.
- [x] Si l'action Annuler ou Refaire est indisponible, il doit être impossible de choisir respectivement l'action Annuler ou Refaire via la barre latérale.
- [x] Les deux options (annuler-refaire) devront être désactivées lorsqu’un outil est en cours d’utilisation.
- [x] Il est possible d'annuler une action avec le raccourci `CTRL + Z`.
- [x] Il est possible de refaire une action avec le raccourci `CTRL + SHIFT + Z`.

**Autres commentaires**
- Bon travail


### Outil - Pipette

**Critères d'acceptabilité**

- [x] Il est possible de sélectionner l'outil Pinceau avec la touche `I`.
- [x] La couleur saisie est celle du pixel sous le pointeur de la souris.
- [x] Il est possible de saisir et d’assigner la couleur d'un point à la couleur principale.
- [x] Il est possible de saisir et d’assigner la couleur d'un point à la couleur secondaire.
- [x] Le changement de la couleur principale se fait avec un clic gauche.
- [x] Le changement de la couleur secondaire se fait avec un clic droit.
- [x] Si le pointeur se retrouve hors de la surface de dessin, le cercle de prévisualisation n’est pas affiché.
- [x] Lorsque le pointeur se trouve près d’une frontière de la surface de dessin, les pixels hors surface n’ont pas à être dessinés.
- [x] Le cercle de prévisualisation est présent dans le panneau d’attributs.
- [x] Le cercle de prévisualisation met en évidence le pixel sous le pointeur de la souris.
- [x] Le cercle de prévisualisation est mis à jour lors du mouvement de la souris.

**Autres commentaires**
- Bon travail


### Outil - Aérosol

**Critères d'acceptabilité**

- [x] Il est possible d'utiliser l'aérosol.
- [x] Il est possible de sélectionner l'outil Aérosol avec la touche `A`.
- [x] Il est possible de définir le nombre d'émissions par seconde.
- [x] L'émission de peinture se fait à intervalle régulier.
- [x] Le motif de vaporisation change à chaque émission.
- [x] Il est possible de définir le diamètre du jet.
- [x] Il est possible de définir le diamètre des gouttelettes du jet.
- [x] Les attributs modifiables par l'utilisateur sont vérifiés avant d'être appliqués (validation).

**Autres commentaires**
- Bon travail
- Les icônes d'aerosol et pipette ont l'air désactivées. Si possible les rendre un peu plus foncées


### Outil - Polygone

**Critères d'acceptabilité**

- [x] Il est possible de créer des polygones.
- [x] Il est possible de sélectionner l'outil Polygone avec la touche `3`.
- [x] Un glisser-déposer permet de créer un périmètre circulaire.
- [x] La forme à créer est inscrite dans le périmètre.
- [x] La forme à créer occupe la plus grande aire possible dans le périmètre.
- [x] La forme est dessinée et mise à jour en temps réel.
- [x] Si le pointeur de la souris quite la surface de dessin, le périmètre continue d’être affiché au complet.
- [x] Il est possible de définir l’épaisseur du trait de contour.
- [x] Il est possible de choisir le type de tracé (*Contour*, *Plein* ou *Plein avec contour*).
- [x] L’intérieur d’une forme est dessiné avec la couleur principale.
- [x] Le contour d’une forme est dessiné avec la couleur secondaire.
- [x] Il est possible de définir le nombre de côtés du polygone à créer (minumum 3, maximum 12).
- [x] Les polygones dessinés sont réguliers et convexes.
- [x] Les attributs modifiables par l'utilisateur sont vérifiés avant d'être appliqués (validation).

**Autres commentaires**
- Bon travail

### Outil - Sélection par rectangle et ellipse

**Critères d'acceptabilité**
- [x] Il est possible de sélectionner l'outil Sélection par Rectangle avec la touche `R`.
- [x] Il est possible de forcer l'outil Sélection par Rectangle en forme carré avec la touche `SHIFT`.
- [x] Il est possible de sélectionner l'outil Sélection par Ellipse avec la touche `S`.
- [x] Il est possible de forcer l'outil Sélection Ellipse en forme de cercle avec la touche `SHIFT`.
- [x] L'utilisation de la touche d'échappement (`ESC`) annule la sélection en entier.
- [x] Il est possible de sélectionner toute la surface de dessin avec le raccourci `CTRL + A`.
- [x] Il est possible de sélectionner toute la surface de dessin avec un bouton dans la barre latérale.
- [x] Il est possible de sélectionner un ou plusieurs pixels avec un rectangle ou un ellipse de sélection.
- [x] Un rectangle ou un ellipse de sélection s’effectue avec un glisser-déposer.
- [x] L’affichage du rectangle et l'ellipse de sélection est en tout temps mis à jour pendant le glisser-déposer.
- [x] Le rectangle et l'ellipse de sélection résultent en une boîte englobante seulement à la fin du glisser-déposer.
- [x] La boite englobante doit être minimale, peu importe son orientation.
- [x] La boite englobante a 8 points de contrôle.
- [x] La sélection est en tout temps mise à jour pendant le glisser-déposer.
- [x] Un pixel est sélectionné si la sélection est en collision avec.
- [x] La région de pixels sélectionnée est entourée d'une boîte pointillé (Sélect. rectangle) ou d'une forme ronde pointillé (Sélect. ellipse).
- [x] La sélection inclut toujours les pixels de l'arrière-plan.
- [x] La région de sélection ne peut jamais dépasser la zone de dessin, même si la souris dépasse cette zone.



### Exporter le dessin

**Critères d'acceptabilité**

- [x] Il est possible d'exporter le dessin localement via une fenêtre d'export de fichier.
- [x] Il est possible d'ouvrir la fenêtre d'export avec le raccourci `CTRL + E`.
- [x] Une seule fenêtre modale parmi: (sauvegarder, carrousel et exporter) peut être affichée en même temps (pas de _stack_ non plus).
- [x] Les différent raccourcis ne sont pas disponibles lorsque cette fenêtre est affichée.
- [x] Il est possible d'exporter une image en format JPG.
- [x] Il est possible d'exporter une image en format PNG.
- [x] Il est possible d'appliquer un filtre à l'image exportée.
- [x] Un choix d'au moins 5 filtres _sensiblement_ différents est offert.
- [x] Les différents filtres sont clairement identifiés pour leur sélection.
- [x] Un seul filtre est appliqué à l'image exportée.
- [x] Il doit être possible d'annuler le filtre appliqué en choisissant l'option _Aucun filtre_
- [x] Il est possible d'entrer un nom pour le fichier exporté.
- [x] Il est possible de voir une vignette de prévisualisation de l'image à exporter.
- [x] Un bouton de confirmation doit être présent pour exporter l'image.


### Déplacement d'une sélection

**Critères d'acceptabilité**

- [x] Il est possible de déplacer une sélection avec un glisser-déposer avec le bouton gauche de la souris.
- [x] La sélection suite le pointeur de la souris en tout temps.
- [x] Le point de sélection sous le pointeur de la souris doit rester le même.
- [x] Il est possible de déplacer une sélection avec les touches directionnelles (flèches) du clavier.
- [x] La sélection est déplacée de 3 pixels dans la direction de la touche appuyée.
- [x] Il est possible de déplacer la sélection de manière continue si au moins une touche est maintenue appuyée pendant 500 ms.
- [x] La sélection est déplacée de 3 pixels dans la direction de la touche appuyée à chaque 100 ms pendant un déplacement continu.
- [x] Il est possible de déplacer la sélection dans plusieurs directions en même temps.
- [x] Toutes les modifications apportés à la même sélection sont considérés comme 1 seule action.
### Sauvegarder le dessin sur serveur

**Critères d'acceptabilité**

- [x] Il est possible de sauvegarder le dessin sur un serveur via une fenêtre de sauvegarde.
- [x] Il est possible de sauvegarder le dessin dans le format de votre choix.
- [x] Il est possible d'ouvrir la fenêtre de sauvegarde avec le raccourci `CTRL + S`.
- [x] Une seule fenêtre modale parmi: (sauvegarder, ouvrir et exporter) peut être affichée en même temps (pas de _stack_ non plus)
- [x] Les différent raccourcis ne sont pas disponibles lorsque cette fenêtre est affichée.
- [x] Il est possible d'associer un nom au dessin à sauvegarder.
- [x] Il est possible d'associer zéro ou plusieurs étiquettes au dessin.
- [x] Il est possible d'enlever les étiquettes si elles sont choisies dans la fenêtre.
- [x] Il est possible de sauvegarder des dessins avec le même nom et avec les mêmes étiquettes (cette condition simultanément ou non) dans le serveur.
- [x] Les règles de validation pour les étiquettes sont clairement présentées dans l'interface.
- [x] Des vérifications (client ET serveur) sont présentes pour la sauvegarde. _Vérification minimale: nom non vide et étiquettes valides_
- [x] S'il est impossible de sauvegarder le dessin, l'utilisateur se fait mettre au courant avec un message pertinent (message d'erreur).
- [x] Un bouton de confirmation doit être présent pour sauvegarder le dessin.
- [x] La modale de sauvegarde (ou du moins le bouton de confirmation) est mise non disponbile lorsque le dessin est en pleine sauvegarde.

**Autres commentaires**

- Toutes les méthodes publiques doivent être explicitement testées (ex: `generatePreviewData`, `show` )

### Carrousel de dessins

**Critères d'acceptabilité**

- [x] Il est possible de voir les dessins sauvegardés sur un serveur via le carrousel de dessins.
- [ ] Il est possible d'ouvrir la fenêtre du carrousel avec le raccourci `CTRL + G`.
- [x] Le carrousel doit présenter 3 fiches à la fois.
- [x] Le carrousel doit gérer les cas oũ moins de 3 dessins sont disponibles.
- [x] Il est possible de faire défiler le carrousel en boucle avec les touches du clavier.
- [x] Il est possible de faire défiler le carrousel en boucle avec des boutons présents dans l'interface.
- [x] Une seule fenêtre modale parmi: (sauvegarder, carrousel et exporter) peut être affichée en même temps (pas de _stack_ non plus).
- [x] Les différent raccourcis ne sont pas disponibles lorsque cette fenêtre est affichée.
- [x] Chaque fiche de dessin comporte un nom, des étiquettes (s'il y en a) et un aperçu du dessin en format réduit.
- [x] Le nom, les étiquettes et l'aperçu doivent être ceux qui ont été définis lorsque l'utilisateur les a sauvegardé.
- [x] Lors des requêtes pour charger les dessins dans la liste, un élément de chargement doit indiquer que la requête est en cours.
- [x] La liste doit être chargeable sans délai excessif.
- [x] Il est possible de filtrer les dessins par leurs étiquettes. Voir la carte **Filtrage par étiquettes**.
- [x] Il est possible de charger un dessin en cliquant sur sa fiche.
- [x] Si un dessin choisi ne peut pas être ouvert, l'utilisateur doit être invité à choisir un autre via la même fenêtre modale.
- [ ] Si un dessin présent non-vide est sur la zone de travail, l'utilisateur doit recevoir une alerte confirmant ou non vouloir abandonner ses changements.
- [x] Il est possible de supprimer un dessin à l'aide d'un bouton de suppression.
- [x] Lorsqu'un dessin est supprimé, le carrousel doit se mettre automatiquement à jour et ne doit plus contenir ce dessin .
- [x] Si un dessin choisi ne peut pas être supprimé, l'utilisateur doit être informé de la raison et le carrousel doit être mis à jour.
- [x] Lorsqu'un dessin est sauvegardé, _au moins à_ la prochaine ouverture, le carrousel doit pouvoir afficher le nouveau dessin sauvegardé.
- [x] Les anciens paramètres d'ouverture ne sont plus visibles lors de la réouverture du carrousel (les paramètres sont remis à leur état original). _ie: pas de filtre d'activé_

**Autres commentaires**

- Le raccourci ctrl-G ne marche pas dans la main page
- L'utilisateur reçoit une alerte même quand le dessin est vide
- Toutes les méthodes publiques doivent être explicitement testées (ex: `updateDrawingContent`)

### Base de données

**Critères d'acceptabilité**

- [x] Il est possible de sauvegarder le nom et les tags d'un nouveau dessin sur une base de données MongoDB.
- [x] La base de données est à distance et non localement sur la machine du serveur.
- [x] Lorsqu'un dessin est supprimé par un utilisateur, la base de données est mise à jour.
- [x] Le client est capable de récupérer l'information d'un ou plusieurs dessins à partir de la base de données.
- [x] La récupération de données se fait à partir de la base de données et non des fichiers locaux.
- [x] Si la base de données contient des informations sur des dessins non-existants sur le serveur, ces dessins ne sont pas montrés à l'utilisateur.

**Autres commentaires**

### Filtrage par étiquettes

**Critères d'acceptabilité**

- [x] Il doit être possible de filtrer les dessins en utilisant des étiquettes.
- [x] Pour chaque dessin de la liste, les étiquettes, si présentes, doivent toutes être visibles (via un mécanisme de votre choix).
- [x] Le filtrage par étiquette - Lorsque vide, tous les dessins doivent être possibles d'être chargés. _ie: pas d'étiquette, pas de filtre_.
- [x] Le filtrage par étiquette - Lorsqu'une étiquette est sélectionnée pour filtrage, seulement les dessins sur le serveur avec cette étiquette sont visibles dans le carrousel.
- [x] Le filtrage par étiquette - Lorsque mutliples étiquettes sont sélectionnées pour filtrage, seulement les dessins sur le serveur qui contiennent au moins une des étiquettes doivent être visibles dans la liste (_OU_ logique).
- [x] Il doit être possible d'accéder à tous les dessins du carrousel, pour un critère de recherche donné.
- [x] Si aucun dessin n'est trouvable par les étiquettes sélectionnées, l'utilisateur doit en être informé.
- [x] Les anciens paramètres d'ouverture ne sont plus visibles lors de la réouverture du carrousel (les paramètres sont remis à leur état original). _ie: pas de filtre d'activé_
## Assurance qualité

## Qualité des classes

### La classe minimise l'accessibilité des membres (public/private/protected)
- [*.component.ts] Tous vos ViewChild sont publics


### Les valeurs par défaut des attributs de la classe sont initialisés de manière consistante (soit dans le constructeur partout, soit à la définition)
- [export-drawing.component.ts] `filterMap` et `exportPreview` ne sont pas initialisés de la même manière
- [color-palette.component] `selectedPosition` et `selectedColorChangeHexSubscription`
- [color-slider.component.ts] `hueChangeFromHexSubscription` Attributs initialisés différemment
- [color.service.ts] 


## Qualités des fonctions

### Utilisation d'interfaces ou de classe pour des paramètres pouvant être regroupé logiquement.
- [shortcut-key.ts] Regrouper les arguments du constructeur dans une interface


### Tous les paramètres de fonction sont utilisés
- [drawing.controller.ts] Beaucoup de paramètres non utilisés

### QA
L30: drawing.ts vs math.ts
L35: tool.ts(23), line.service.ts(67, 155)
# Qualité générale

- L39: le dossier color-picker est en dehors de l'app
- L40: Pas de style dans le html (ex: `carrousel.component.ts`)
- L42: Uniformisez la langue utilisée pour les commentaires
- L41: Avoir une logique pour organiser les méthodes dans une classe (public d'abord et private en bas par exemple)
- L43: Code commenté
- L45: Ne pas utiliser l'objet `Object`
- L47: tslint rules disabled sans justifications
- L48: Pas toujours utilisé
