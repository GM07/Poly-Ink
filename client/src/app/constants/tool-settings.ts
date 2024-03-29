export abstract class ToolSettingsConst {
    static readonly MIN_WIDTH: number = 1;
    static readonly MAX_WIDTH: number = 50;
    static readonly MIN_ERASER_WIDTH: number = 5;
    static readonly MAX_DROPLETS_WIDTH: number = 5;
    static readonly MIN_DROPLETS_WIDTH: number = 0.5;
    static readonly MIN_AREA_WIDTH: number = 5;
    static readonly MAX_AREA_WIDTH: number = 100;
    static readonly MIN_EMISSIONS_PER_SECOND: number = 5;
    static readonly MAX_EMISSIONS_PER_SECOND: number = 200;

    // Eraser
    static readonly DEFAULT_ERASER_WIDTH: number = 25;

    // Pencil
    static readonly DEFAULT_PENCIL_WIDTH: number = 12;

    // Line
    static readonly DEFAULT_LINE_WIDTH: number = 6;
    static readonly DEFAULT_LINE_JUNCTION_WIDTH: number = 10;

    // Line Drawer
    static readonly MINIMUM_DISTANCE_TO_CLOSE_PATH: number = 20;
    static readonly LINE_DRAWER_ANGLE_STEPS: number = Math.PI / (2 * 2);

    // Polygon
    static readonly MAX_NUM_EDGES: number = 12;
    static readonly MIN_NUM_EDGES: number = 3;

    // Aerosol
    static readonly DEFAULT_AEROSOL_AREA_DIAMETER: number = 30;
    static readonly DEFAULT_AEROSOL_EMISSIONS_PER_SECOND: number = 100;
    static readonly DEFAULT_AEROSOL_SPRAY_INTERVAL: number = 10;
    static readonly MAX_AEROSOL_SPRAY_INTERVAL: number = 20;

    // Eye dropper
    static readonly EYE_DROPPER_PREVIEW_WIDTH: number = 11;

    static readonly LINE_DEFAULT_DIAMETER_JUNCTION: number = 10;
    static readonly LINE_DEFAULT_WIDTH: number = 6;

    // Stamp
    static readonly STAMP_MIN_VALUE: number = 0.1;
    static readonly STAMP_MAX_VALUE: number = 5;
    static readonly STAMP_MIN_ANGLE: number = 0;
    static readonly STAMP_MAX_ANGLE: number = 2 * Math.PI;
    static readonly STAMP_DEFAULT_SIZE: number = 50;
    static readonly STAMP_ANGLE_STEP: number = 15;
    // Bucket
    static readonly BUCKET_MIN_TOLERANCE: number = 0;
    static readonly BUCKET_MAX_TOLERANCE: number = 100;
    static readonly BUCKET_DEFAULT_TOLERANCE: number = 20;

    // Selection
    static readonly BORDER_WIDTH: number = 2;
    static readonly LINE_DASH: number = 8;

    // Grid
    static readonly GRID_MIN_SIZE: number = 25;
    static readonly GRID_MAX_SIZE: number = 75;
    static readonly GRID_DEFAULT_OPACITY: number = 0.5;
    static readonly GRID_MIN_OPACITY: number = 0.4;
    static readonly GRID_MAX_OPACITY: number = 1.0;
    static readonly GRID_STEP: number = 5;
}
