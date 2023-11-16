export class UnionField extends foundry.data.fields.DataField {
    #types;

    constructor(types, options) {
        super(options);
        this.#types = types;
    }


    initialize(value, model, options) {
        console.warn("UnionField.initialize: args:", { value, model, options });
        let result;
        if (value === undefined && !this.options.required) {
            result = undefined;
        }
        else if (value === null && this.options.nullable) {
            result = null;
        }
        else {
            const type = this.#getType(value, undefined);
            result = type.initialize(value, model, options);
        }
        console.warn("UnionField.initialize: result:", result);
        return result;
    }

    toObject(value) {
        console.warn("UnionField.toObject: args:", { value });
        let result;
        if (value === undefined && !this.options.required) {
            result = undefined;
        }
        else if (value === null && this.options.nullable) {
            result = null;
        }
        else {
            const type = this.#getType(value, undefined);
            result = type.toObject(value);
        }
        console.warn("UnionField.toObject: result:", result);
        return result;
    }

    _cast(value) {
        console.warn("UnionField._cast: args:", { value });
        const result = value;
        console.warn("UnionField._cast: result:", result);
        return result;
    }

    _cleanType(data, options) {
        console.warn("UnionField._cleanType: args:", { data, options });
        const type = this.#getType(data, options.source);
        if (!type) {
            throw new Error("could not find type to match data: " + JSON.stringify(data, null, 4));
        }
        const result = type._cleanType(data, options);
        console.warn("UnionField._cleanType: result:", result);
        return result;
    }

    #getType(value, source) {
        return this.#types.find(type => {
            const validationResult = type.validate(value, { source });
            return !(validationResult instanceof foundry.data.validation.DataModelValidationFailure);
        });
    }

}
