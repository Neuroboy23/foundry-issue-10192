export class WeaponSheet extends ItemSheet {

    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "systems/foundry-issue-10192/weapon-sheet.html";
        return options;
    }

}
