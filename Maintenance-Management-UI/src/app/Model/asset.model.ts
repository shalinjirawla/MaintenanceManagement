export class Asset {
    id!: number;
    assetName!: string;
    description!: string;
    model!: string;
    serialNumber!: string;
    category!: string;
    location!: string;
    purchaseDate!: Date;
    warrantyExpiration!: Date;
    condition!: string;
    assetImage!:string;
    hadadmin!:number;
    selected?: boolean;
}
