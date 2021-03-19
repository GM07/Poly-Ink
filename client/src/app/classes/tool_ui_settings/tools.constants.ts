export enum PencilToolConstants {
    TOOL_ID = 'PENCIL',
    TOOL_TITLE = 'Crayon',
    INFO_BUBBLE = 'Crayon (C)',
    ICON_NAME = 'pencil',
    SHORTCUT_KEY = 'c',
}
export enum AerosolToolConstants {
    TOOL_ID = 'AEROSOL',
    TOOL_TITLE = 'Aerosol',
    INFO_BUBLE = 'Aerosol (A)',
    ICON_NAME = 'spray',
    SHORTCUT_KEY = 'a',
}
export enum RectangleToolConstants {
    TOOL_ID = 'RECTANGLE',
    TOOL_TITLE = 'Rectangle',
    INFO_BUBBLE = 'Rectangle (1)',
    ICON_NAME = 'rectangle',
    SHORTCUT_KEY = '1',
}

export enum EllipseToolConstants {
    TOOL_ID = 'ELLIPSE',
    TOOL_TITLE = 'Ellipse',
    INFO_BUBBLE = 'Ellipse (2)',
    ICON_NAME = 'ellipse',
    SHORTCUT_KEY = '2',
}
export enum PolygoneToolConstants {
    TOOL_ID = 'POLYGONE',
    TOOL_TITLE = 'Polygone',
    INFO_BUBBLE = 'Polygone (3)',
    ICON_NAME = 'polygone',
    SHORTCUT_KEY = '3',
}

export enum LineToolConstants {
    TOOL_ID = 'LINE',
    TOOL_TITLE = 'Ligne',
    INFO_BUBBLE = 'Ligne (L)',
    ICON_NAME = 'line',
    SHORTCUT_KEY = 'l',
}

export enum TextToolConstants {
    TOOL_ID = 'TEXT',
    TOOL_TITLE = 'Texte',
    INFO_BUBBLE = 'Texte (T)',
    ICON_NAME = 'text',
    SHORTCUT_KEY = 't',
}

export enum FillToolConstants {
    TOOL_ID = 'FILL',
    TOOL_TITLE = 'Sceau de peinture',
    INFO_BUBBLE = 'Sceau de peinture (B)',
    ICON_NAME = 'bucket',
    SHORTCUT_KEY = 'b',
}

export enum EraserToolConstants {
    TOOL_ID = 'ERASER',
    TOOL_TITLE = 'Efface',
    INFO_BUBBLE = 'Efface (E)',
    ICON_NAME = 'eraser',
    SHORTCUT_KEY = 'e',
}

export enum StampToolConstants {
    TOOL_ID = 'STAMP',
    TOOL_TITLE = 'Étampe',
    INFO_BUBBLE = 'Étampe (D)',
    ICON_NAME = 'stamp',
    SHORTCUT_KEY = 'd',
}

export enum EyeDropperToolConstants {
    TOOL_ID = 'EYE_DROPPER',
    TOOL_TITLE = 'Pipette',
    INFO_BUBBLE = 'Pipette (I)',
    ICON_NAME = 'eye-dropper',
    SHORTCUT_KEY = 'i',
}

export enum RectangleSelectionToolConstants {
    TOOL_ID = 'RECTANGLE_SELECTION',
    TOOL_TITLE = 'Séléction rectangulaire',
    INFO_BUBBLE = 'Séléction rectangulaire (R)',
    ICON_NAME = 'rectangle-selection',
    SHORTCUT_KEY = 'r',
}

export enum EllipseSelectionToolConstants {
    TOOL_ID = 'ELLIPSE_SELECTION',
    TOOL_TITLE = 'Ellipse de séléction',
    INFO_BUBBLE = 'Ellipse de séléction (S)',
    ICON_NAME = 'ellipse-selection',
    SHORTCUT_KEY = 's',
}

export enum LassoToolConstants {
    TOOL_ID = 'LASSO',
    TOOL_TITLE = 'Lasso polygonal',
    INFO_BUBBLE = 'Lasso polygonal (V)',
    ICON_NAME = 'lasso',
    SHORTCUT_KEY = 'v',
}

export enum SaveFileToolConstants {
    TOOL_ID = 'SAVE_FILE',
    TOOL_TITLE = 'Sauvegarder',
    INFO_BUBBLE = 'Sauvegarder (Ctrl-S)',
    ICON_NAME = 'save',
}

export enum ExportFileToolConstants {
    TOOL_ID = 'EXPORT_FILE',
    TOOL_TITLE = 'Exporter',
    INFO_BUBBLE = 'Exporter (Ctrl-E)',
    ICON_NAME = 'export',
}

export enum NewDrawingConstants {
    TOOL_ID = 'NEW_DRAWING',
    TOOL_TITLE = 'Nouveau Dessin',
    INFO_BUBBLE = 'Nouveau Dessin (Ctrl-O)',
    ICON_NAME = 'new',
}

export enum RedoConstants {
    TOOL_ID = 'REDO',
    TOOL_TITLE = 'Refaire',
    INFO_BUBBLE = 'Refaire (Ctrl-Shift-Z)',
    ICON_NAME = 'redo',
}

export enum UndoConstants {
    TOOL_ID = 'UNDO',
    TOOL_TITLE = 'Annuler',
    INFO_BUBBLE = 'Annuler (Ctrl-Z)',
    ICON_NAME = 'undo',
}

export const TOP_TOOLS_CONSTANTS = [
    PencilToolConstants,
    RectangleToolConstants,
    PolygoneToolConstants,
    EllipseToolConstants,
    LineToolConstants,
    TextToolConstants,
    FillToolConstants,
    EraserToolConstants,
    StampToolConstants,
    EyeDropperToolConstants,
    RectangleSelectionToolConstants,
    EllipseSelectionToolConstants,
    LassoToolConstants,
];
export const HIGHLIGHTED_COLOR = 'rgba(148, 152, 153, 0.342)';
export const BOTTOM_TOOLS_CONSTANTS = [SaveFileToolConstants, ExportFileToolConstants];

// Source: www.flaticon.com
export const ICONS_PATHS = [
    ['bucket', 'assets/icons/bucket.svg'],
    ['ellipse-selection', 'assets/icons/ellipse-selection.svg'],
    ['ellipse', 'assets/icons/ellipse.svg'],
    ['eraser', 'assets/icons/eraser.svg'],
    ['export', 'assets/icons/export.svg'],
    ['eye-dropper', 'assets/icons/eye-dropper.svg'],
    ['lasso', 'assets/icons/lasso.svg'],
    ['line', 'assets/icons/line.svg'],
    ['polygone', 'assets/icons/polygone.svg'],
    ['rectangle-selection', 'assets/icons/rectangle-selection.svg'],
    ['rectangle', 'assets/icons/rectangle.svg'],
    ['spray', 'assets/icons/spray.svg'],
    ['stamp', 'assets/icons/stamp.svg'],
    ['save', 'assets/icons/save.svg'],
    ['text', 'assets/icons/text.svg'],
    ['pencil', 'assets/icons/pencil.svg'],
    ['new', 'assets/icons/new.svg'],
    ['redo', 'assets/icons/redo.svg'],
    ['undo', 'assets/icons/undo.svg'],
];
