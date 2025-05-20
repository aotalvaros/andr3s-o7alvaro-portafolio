export interface MarsPhotosResponse {
    id: number;
    sol: number;
    camera: {
        id: number;
        name: string;
        full_name: string;
    };
    img_src: string;
    earth_date: string;
    rover: {
        id: number;
        name: string;
        landing_date: string;
        launch_date: string;
        status: string;
    };
}