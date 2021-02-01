export enum ColorToolConstants {
    TOOL_ID = 'COULEUR',
    TOOL_TITLE = 'Couleur',
    INFO_BUBBLE = 'Couleur (???)',
    ICON_NAME = 'palette',
}

export enum PencilToolConstants {
    TOOL_ID = 'PENCIL',
    TOOL_TITLE = 'Crayon',
    INFO_BUBBLE = 'Crayon (C)',
    ICON_NAME = 'pencil',
}
export enum AerosolToolConstants {
    TOOL_ID = 'AEROSOL',
    TOOL_TITLE = 'Aerosol',
    INFO_BUBLE = 'Aerosol (A)',
    ICON_NAME = 'spray',
}
export enum RectangleToolConstants {
    TOOL_ID = 'RECTANGLE',
    TOOL_TITLE = 'Rectangle',
    INFO_BUBBLE = 'Rectangle (1)',
    ICON_NAME = 'rectangle',
}

export enum EllipseToolConstants {
    TOOL_ID = 'ELLIPSE',
    TOOL_TITLE = 'Ellipse',
    INFO_BUBBLE = 'Ellipse (2)',
    ICON_NAME = 'ellipse',
}
export enum PolygoneToolConstants {
    TOOL_ID = 'POLYGONE',
    TOOL_TITLE = 'Polygone',
    INFO_BUBBLE = 'Polygone (3)',
    ICON_NAME = 'polygone',
}

export enum LineToolConstants {
    TOOL_ID = 'LINE',
    TOOL_TITLE = 'Ligne',
    INFO_BUBBLE = 'Ligne (L)',
    ICON_NAME = 'line',
}

export enum TextToolConstants {
    TOOL_ID = 'TEXT',
    TOOL_TITLE = 'Texte',
    INFO_BUBBLE = 'Texte (T)',
    ICON_NAME = 'text',
}

export enum FillToolConstants {
    TOOL_ID = 'FILL',
    TOOL_TITLE = 'Sceau de peinture',
    INFO_BUBBLE = 'Sceau de peinture (B)',
    ICON_NAME = 'bucket',
}

export enum EraserToolConstants {
    TOOL_ID = 'RASER',
    TOOL_TITLE = 'Efface',
    INFO_BUBBLE = 'Efface (E)',
    ICON_NAME = 'eraser',
}

export enum StampToolConstants {
    TOOL_ID = 'STAMP',
    TOOL_TITLE = 'Étampe',
    INFO_BUBBLE = 'Étampe (D)',
    ICON_NAME = 'stamp',
}

export enum EyeDropperToolConstants {
    TOOL_ID = 'EYE_DROPPER',
    TOOL_TITLE = 'Pipette',
    INFO_BUBBLE = 'Pipette (I)',
    ICON_NAME = 'eye-dropper',
}

export enum RectangleSelectionToolConstants {
    TOOL_ID = 'RECTANGLE_SELECTION',
    TOOL_TITLE = 'Séléction rectangulaire',
    INFO_BUBBLE = 'Séléction rectangulaire (R)',
    ICON_NAME = 'rectangle-selection',
}

export enum EllipseSelectionToolConstants {
    TOOL_ID = 'ELLIPSE_SELECTION',
    TOOL_TITLE = 'Ellipse de séléction',
    INFO_BUBBLE = 'Ellipse de séléction (S)',
    ICON_NAME = 'ellipse-selection',
}

export enum LassoToolConstants {
    TOOL_ID = 'LASSO',
    TOOL_TITLE = 'Lasso polygonal',
    INFO_BUBBLE = 'Lasso polygonal (V)',
    ICON_NAME = 'lasso',
}

export enum SaveFileToolConsants {
    TOOL_ID = 'SAVE_FILE',
    TOOL_TITLE = 'Sauvegarder',
    INFO_BUBBLE = 'Sauvegarder (Ctr-S)',
    ICON_NAME = 'save',
}

export enum ExportFileToolConstants {
    TOOL_ID = 'EXPORT_FILE',
    TOOL_TITLE = 'Exporter',
    INFO_BUBBLE = 'Exporter (Ctr-E)',
    ICON_NAME = 'export',
}

export const TOP_TOOLS_CONSTANTS = [
    ColorToolConstants,
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

export const BOTTOM_TOOLS_CONSTANTS = [SaveFileToolConsants, ExportFileToolConstants];
