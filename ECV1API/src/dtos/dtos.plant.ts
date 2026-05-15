import yup from "yup"
export const PlantReturnDTO = {
    name : yup
        .string()
        .strict()
        .required(),
    nameEN: yup.string(),
    scientificName: yup.string(),
    family: yup.string(),
    default_image: yup.string().required(),
    description: yup.string().nullable()
}

export const UserCreatedSchema = yup.object(PlantReturnDTO)
export type CreatedUSer = yup.InferType<typeof UserCreatedSchema>
