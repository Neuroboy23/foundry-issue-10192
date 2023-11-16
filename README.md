Demonstrates the issue described in https://github.com/foundryvtt/foundryvtt/issues/10192.

The file [weapon-data-model.js](weapon-data-model.js) defines the equivalent the TypeScript type below, using a [`UnionField`](union-field.js). The contrived use case is that a `weapon` Item can have a defined `prerequisite` that is either a structured `object` or a `string`.

```ts
type WeaponDataModel = {
    prerequisite: string | {
        attribute: "strength" | "intelligence" | "dexterity";
        minimum: number;
    };
};
```

I have more complex cases like this in my data models for situations where the system is full-featured enough to process rules of some forms but does not have programmatic support for other forms of rules. Those unsupported rules are simply captured as text, and it's up to the user to apply it as appropriate during gameplay. However, this is just one case. In other cases, the system is fully capable of processing every type of rule, but there is more than one possible rule structure.

Here's what I observe with this code:

When a new `weapon` Item is constructed, everything is correct. The Item is constructed with the correct initial value `{attribute: "strength", minimum: 8}`. The sheet is opened, and the `<select>` and `<input>` elements on the sheet are correctly initialized to the correct values.

The bad behavior happens when you edit either of the `attribute` or `minimum` fields on the sheet. As shown in the logs I am producing, the `UnionField` is producing all the correct values for the critical `toObject`, `_cast` and `_cleanType` calls. After `UnionField` does its work, the `preUpdateItem` event is fired, and the `changes` parameter indicates a correct new value for `system.prerequisite` that is a structured object with both the `attribute` and `minimum` fields. __However, the next thing I see from my logs is that `WeaponDataModel` is constructed with a data object that only includes a single field -- the same field that was edited in the UI. All other fields are missing.__

```txt
UnionField._cast: args: {
    value: {
        attribute: 'intelligence',
        minimum: 8
    }
}

UnionField._cast: result: {
    attribute: 'intelligence',
    minimum: 8
}

UnionField._cleanType: args: {
    data: {
        attribute: 'intelligence',
        minimum: 8
    },
    …
}

UnionField._cleanType: result: {
    attribute: 'intelligence',
    minimum: 8
}

Hooks.preUpdateItem: args: {
    item: …,
    changes: {
        system: {
            prerequisite: {
                attribute: 'intelligence',
                minimum: 8
            }
        }
    },
    …
}

======== ALL THE ABOVE SEEMS CORRECT; THE STUFF BELOW IS BAD ========

WeaponDataModel.constructor: args: {
    data: {
        prerequisite: {
            attribute: 'intelligence'        <==== the `minimum` field is missing!!!
        }
    },
    …
}

UnionField._cast: args: {
    value: {
        attribute: 'intelligence'
    }
}

UnionField._cast: result: {
    attribute: 'intelligence'
}

UnionField._cleanType: args: {
    data: {
        attribute: 'intelligence'
    },
    …
}

Error: could not find type to match data: {
    "attribute": "intelligence"
}
    at UnionField._cleanType (union-field.js:55:19)
    at UnionField.clean (commons.js:5039:19)
    at SchemaField._cleanType (commons.js:5358:28)
    at SchemaField.clean (commons.js:5039:19)
    at WeaponDataModel.cleanData (commons.js:7008:26)
    at WeaponDataModel._initializeSource (commons.js:6995:31)
    at new DataModel (commons.js:6871:21)
    at new WeaponDataModel (weapon-data-model.js:71:9)
    at TypeDataField.initialize (commons.js:6666:26)
    at Item._initialize (commons.js:7037:29)
```
