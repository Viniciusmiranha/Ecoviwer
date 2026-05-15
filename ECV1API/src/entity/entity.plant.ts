export type CategoriesType = {
    id: number
    name: string,
    nameEN: string,
    scientificName: string,
    family: string,
    familyPopular?: string | null,
    default_image: string,
    description?: string | null
}


export class CategoriesEntity {
    public id!: number
    public name!: string
    public nameEN!: string
    public scientificName!: string
    public family!: string
    public familyPopular?: string | null
    public default_image!: string
    public description?: string | null

    constructor({ id, name, nameEN, scientificName, family, familyPopular, default_image, description }: CategoriesType) {
        this.id = id,
        this.name = name,
        this.nameEN = nameEN,
        this.scientificName = scientificName,
        this.family = family,
        this.familyPopular = familyPopular,
        this.default_image = default_image,
        this.description = description
    }
}
