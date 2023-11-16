import { UnionField } from "./union-field.js";

export class WeaponDataModel extends foundry.abstract.DataModel {

    static defineSchema() {

        // THIS WORKS FINE:
        // return {
        //     prerequisite: new foundry.data.fields.SchemaField(
        //         {
        //             attribute: new foundry.data.fields.StringField({
        //                 required: true,
        //                 nullable: false,
        //                 blank: false,
        //                 choices: ["strength", "intelligence", "dexterity"]
        //             }),
        //             minimum: new foundry.data.fields.NumberField({
        //                 required: true,
        //                 nullable: false
        //             })
        //         },
        //         {
        //             required: true,
        //             nullable: false,
        //             initial: {
        //                 attribute: "strength",
        //                 minimum: 8
        //             }
        //         }
        //     )
        // };

        // THIS DOES NOT (same SchemaField, but inside a UnionField)
        return {
            prerequisite: new UnionField(
                [
                    new foundry.data.fields.StringField({
                        required: true,
                        nullable: false,
                        blank: false
                    }),
                    new foundry.data.fields.SchemaField({
                        attribute: new foundry.data.fields.StringField({
                            required: true,
                            nullable: false,
                            blank: false,
                            choices: ["strength", "intelligence", "dexterity"]
                        }),
                        minimum: new foundry.data.fields.NumberField({
                            required: true,
                            nullable: false
                        })
                    })
                ],
                {
                    required: true,
                    nullable: false,
                    initial: {
                        attribute: "strength",
                        minimum: 8
                    }
                }
            )
        };


    }

    constructor(data, options) {
        console.warn("WeaponDataModel.constructor: args:", { data, options });
        super(data, options);
    }

}
