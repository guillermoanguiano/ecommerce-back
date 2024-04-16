export interface Product {
    id?: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
}

export type CloudinaryResult = {
    imageUrl: string;
    imagePublicId: string;
}