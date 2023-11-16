import { WeaponDataModel } from "./weapon-data-model.js";
import { WeaponSheet } from "./weapon-sheet.js";

Hooks.on("init", () => {
    CONFIG.Item.dataModels.weapon = WeaponDataModel;
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("foundry-issue-10192", WeaponSheet, { types: [ "weapon" ], makeDefault: true });
});

Hooks.on("preUpdateItem", (item, changes, options, userId) => {
    console.warn("Hooks.preUpdateItem: args:", { item, changes, options, userId });
})
