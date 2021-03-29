interface ImgurDataResponse {
    link: string;
    name: string;
    type: string;
}

export interface ImgurResponse {
    data: ImgurDataResponse;
    status: string;
    success: boolean;
}