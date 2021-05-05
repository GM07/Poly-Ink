# Fonctionalités



### Outil - Sceau de peinture

**Critères d'acceptabilité**

- [x] Il est possible de sélectionner l'outil Sceau de Peinture avec la touche `B`.
- [x] Le sceau de peinture prend en compte les attributs de la couleur principale.
- [x] Il est possible de colorer une région de pixels qui sont contigus et qui partagent une même couleur.
- [x] Le coloriage de *pixels contigus* se fait avec le bouton gauche de la souris.
- [x] Il est possible de colorer une région de pixels non contigus et qui partagent une même couleur.
- [x] Le coloriage de *pixels non contigus* se fait avec le bouton droit de la souris.
- [x] Il est possible de définir un pourcentage (absolu) de tolérance pour la comparaison de couleurs.
- [x] L’algorithme de remplissage doit tolérer un écart lors de la comparaison de couleurs en fonction du pourcentage de tolérance.
- [x] Les attributs modifiables par l'utilisateur sont vérifiés avant d'être appliqués (validation).

**Autres commentaires**
- Beau travail


### Téléversement sur Imgur

**Critères d'acceptabilité**

- [x] Il est possible de téléverser un dessin sur Imgur via une fenêtre d'export de fichier.
- [x] Il est possible d'ouvrir la fenêtre d'export avec le raccourci `CTRL + E`.
- [x] Une seule fenêtre modale parmi: (sauvegarder, carrousel et exporter) peut être affichée en même temps (pas de _stack_ non plus).
- [x] Les différents raccourcis ne sont pas disponibles lorsque cette fenêtre est affichée.
- [x] Il est possible de téléverser une image en format JPG.
- [x] Il est possible de téléverser une image en format PNG.
- [x] Il est possible d'appliquer un filtre à l'image téléversée.
- [x] Un choix d'au moins 5 filtres _sensiblement_ différents est offert.
- [x] Les différents filtres sont clairement identifiés pour leur sélection.
- [x] Un seul filtre est appliqué à l'image exportée.
- [x] Il doit être possible d'annuler le filtre appliqué en choisissant l'option _Aucun filtre_.
- [x] Il est possible de voir une vignette de prévisualisation de l'image à téléverser.
- [x] L'utilisateur est avisé de l'adresse URL publique de l'image lorsque le téléversement vers Imgur réussit.

**Autres commentaires**
- Beau travail


### Sauvegarde automatique et continuer dessin

**Critères d'acceptabilité**

- [x] Il est possible de faire une sauvegarde automatique du dessin pendant son édition.
- [x] La sauvegarde automatique est déclenchée après le chargement d'un dessin (à partir du serveur ou continuation d'un dessin sauvegardé automatiquement).
- [x] La sauvegarde automatique est déclenchée après toute modification au dessin (création de nouveau dessin, ouverture de dessin, modification de la surface de dessin).
- [x] La sauvegarde est locale au fureteur seulement.
- [x] La sauvegarde automatique a lieu sans intervention de l'utilisateur.
- [x] Un dessin sauvegardé automatiquement n'a pas de nom ou d'étiquettes.
- [x] Il est possible de charger le dernier dessin sauvegardé par le système de sauvegarde automatique.
- [x] Il est possible de voir l'option _Continuer un dessin_ dans le point d'entrée de l'application seulement s'il y a un dessin sauvegardé.
- [x] L'utilisateur est amené à la vue de dessin avec le dessin déjà chargé sur la surface de dessin si l'option _Continuer un dessin_.
- [x] Une recharge de page (touche `F5`) doit déclencher le chargement automatique (aucune perte de travail)

**Autres commentaires**
- Beau travail

### Manipulations de sélections et presse-papier

**Critères d'acceptabilité**

- [x] Il est possible de copier une sélection avec le raccourci `CTRL + C`.
- [x] Le contenu du presse-papier est remplacé par la sélection lors d'un copiage.
- [x] Il est possible de couper une sélection avec le raccourci `CTRL + X`.
- [x] Le contenu du presse-papier est remplacé par la sélection active lors d'un coupage.
- [x] Les pixels de la surface de dessin sous une sélection sont remplacés par des pixels blancs lors d'un coupage.
- [x] Il est possible de coller ce qui se trouve dans le presse-papier avec le raccourci `CTRL + V`.
- [x] Les pixels créés par un collage sont positionés sur le coin suppérieur gauche.
- [x] Les pixels créés par un collage sont automatiquement sélectionnés.
- [x] Le contenu du presse-papier n’est pas affecté par un collage.
- [x] Il est possible de supprimer une sélection avec le raccourci `DELETE`.
- [x] Les pixels de la surface de dessin sous une sélection sont remplacés par des pixels blancs lors d'une suppression.
- [x] Les actions couper, copier, coller et supprimer sont aussi accessibles via la barre latérale à travers des boutons.
- [x] Les actions couper, copier et supprimer ne sont pas disponibles sans une sélection courante.
- [x] L'action coller n'est pas disponible si le presse-papier est vide.
c

### Redimensionnement d'une sélection

**Critères d'acceptabilité**

- [x] Il est possible d’effectuer un redimensionnement sur un axe avec les points de contrôle des côtés.
- [x] Il est possible d'effectuer un redimensionnement sur deux axes avec les points de contrôle des coins.
- [x] Il est possible d'effectuer le même redimensionnement sur les deux axes si la touche `SHIFT` est maintenue.
- [x] Le redimensionnement d’une boite englobante, via ses points de contrôle, entraine le redimensionnement de son contenu.
- [x] Il est possible d’utiliser le redimensionnement pour créer un effet miroir sur la sélection.
- [x] Toutes les modifications apportés à la même sélection sont considérés comme 1 seule action.

### Grille

**Critères d'acceptabilité**

- [x] Il est possible de faire afficher (et de masquer) une grille superposée à la surface de dessin.
- [x] Il est possible de faire afficher (et de masquer) la grille avec la touche `G`.
- [x] L’origine de la grille est le coin supérieur gauche de la surface.
- [x] Il est possible de définir une valeur d'opacité pour la grille.
- [x] La valeur d'opacité minimale devra être facilement visible.
- [x] Il est possible de définir la taille des carrés composant la grille en pixels.
- [x] Il est possible d'augmenter la taille des carrés de la grille au prochain multiple de 5 avec le raccourci `+` ou `=`.
- [x] Il est possible de diminuer la taille des carrés de la grille au prochain multiple de 5 avec le raccourci `-`.
- [x] La grille est superposée à la surface de dessin et son contenu.
- [x] Les attributs modifiables par l'utilisateur sont vérifiés avant d'être appliqués (validation).
- [x] La grille n'est pas présente lorsque le dessin est sauvegardé, exporté ou envoyé par courriel.

### Magnétisme (surface de dessin)

**Critères d'acceptabilité**

- [x] Il est possible d'activer ou désactiver l'option Magnétisme avec la touche `M`.
- [x] Il est possible de choisir un des quatre coins de la boîte englobante comme ancrage pour l'alignement sur la grille.
- [x] Il est possible de choisir un des quatre points de contrôle de la boîte englobante comme ancrage pour l'alignement sur la grille.
- [x] Il est possible de choisir le centre boîte englobante comme ancrage pour l'alignement sur la grille.
- [x] Un déplacement avec la souris aligne la sélection avec l'intersection de la grille la plus proche en X et Y.
- [x] Un déplacement avec les touches directionnelles aligne la sélection avec l'intersection de la grille la plus proche en X et Y.
- [x] Le magnétisme ne nécessite pas que la grille soit visible pour fonctionner.
### Outil - Étampe

**Critères d'acceptabilité**

- [x] Il est possible d’ajouter des étampes sur la surface de dessin.
- [x] Si l'étampe dépasse la limite de la surface, elle n'est dessinée que partiellement.
- [x] Il est possible de sélectionner l'outil étampe avec la touche `D`.
- [x] Il est possible de voir une prévisualisation de l'étampe qui remplace le pointeur de la souris.
- [x] La prévisualisation de l'étampe doit être de la même taille et orientation que l'étampe à déposer.
- [x] Il est possible de définir un facteur de mise à échelle pour l’étampe.
- [x] Il est possible de définir l’angle d’orientation de l’étampe.
- [x] Il est possible de modifier l’angle d’orientation de l'étampe via la roulette de la souris.
- [x] Il est possible de faire passer la rotation par cran de roulette de 15 à 1 degré avec la touche `ALT`.
- [x] Un minimum de 5 étampes _sensiblement_ différentes doivent être disponibles pour sélection.
- [x] Les différentes étampes sont clairement identifiées pour leur sélection.
- [x] Les attributs modifiables par l'utilisateur sont vérifiés avant d'être appliqués (validation).

**Autres commentaires**

- Petits bugs: 
    - On doit bouger la souris pour avoir la prévisualisation la première fois
    - Lorsqu'on tourne manuellement le slider de rotation et qu'on passe ensuite à une rotation avec la roulette la rotation par cran de roulette est de 1 degré

### Outil - Texte

**Critères d'acceptabilité**

- [x] Il est possible d’écrire des chaines de caractères.
- [x] Il est possible de sélectionner l'outil Texte avec la touche `T`.
- [x] Un indicateur visuel indique la position du curseur dans le texte.
- [x] Il est possible de se déplacer dans le texte avec les touches `flèches`.
- [x] Il est possible de faire des retours à la ligne avec la touche `ENTER`.
- [x] Il est possible de supprimer le caractère suivant avec la touche `DELETE`.
- [x] Il est possible de supprimer le caractère précédant avec la touche `BACKSPACE`.
- [x] Il est possible d'annuler l'édition du texte avec la touche `ESCAPE`.
- [x] Tous les autres raccourcis sont ignorés pendant l'édition du texte.
- [x] Le texte est coloré avec la couleur principale de l'application.
- [x] Il est possible de choisir la police du texte (minimum 5 polices différentes).
- [x] Il est possible de définir la taille de la police.
- [x] Il est possible de mettre toute la chaine en gras.
- [x] Il est possible de mettre toute la chaine en italique.
- [x] Il est possible d’aligner le texte à gauche, au centre ou à droite.
- [x] Les attributs s’appliquent à l’entièreté de la chaine de caractères.
- [x] Les attributs sont modifiables pendant l'édition du texte.
- [x] Cliquer à l'extérieur de la zone de texte confirme la création du texte.
- [x] Sélectionner un autre outil confirme la création du texte.
- [x] Il est possible de voir seulement le texte présent sur la surface de dessin.
- [x] Les attributs modifiables par l'utilisateur sont vérifiés avant d'être appliqués (validation).

**Autres commentaires**
 

### Outil - Sélection par lasso polygonal

**Critères d'acceptabilité**

- [x] Il est possible d'activer le lasso polygonal avec la touche `V`.
- [x] Le traçage du polygone de sélection se fait comme l'outil ligne: segment de prévisualisation , gestion des touches `SHIFT`, `ESCAPE`, `BACKSPACE`.
- [x] Le traçage du polygone de sélection se termine en faisant un simple clic dans un rayon de 20 pixels autour le point initial.
- [x] Le polygone de sélection a un minimum de trois segments.
- [x] L'outil ne permet pas d'ajouter un segment qui croiserait un autre.
- [x] Une rétroaction visuelle est présente si l'outil se trouve à une position invalide d'ajout de segment.
- [x] Lorsque la boucle est fermée, le périmètre du polygone devient un contour de sélection. 
- [x] Le contour de sélection est encadré dans une boite englobante (la plus petite possible).

**Autres commentaires**
- On peut tracer 2 segments superposés (après ça on est incapable de continuer le tracé du polygone)

# Assurance qualité


## Qualité des classes

### Les valeurs par défaut des attributs de la classe sont initialisés de manière consistante (soit dans le constructeur partout, soit à la définition)
- [slider.ts] startAngle et endAngle initialisés différemment

L33: lasso.service.ts(105)# Qualité générale

- L41: Avoir une logique pour organiser les méthodes dans une classe (public d'abord et private en bas par exemple)
- L45: Ne pas utiliser `document.getElementBy*`
- L47: tslint rule disabled: pas bonne justification (`server-communication.service.ts:52` Une interface avec un attribut optionnel règle ce problème)
- L48: Pas toujours utilisé
