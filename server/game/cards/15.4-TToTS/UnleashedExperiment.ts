import DrawCard from '../../DrawCard.js';

export default class UnleashedExperiment extends DrawCard {
    static id = 'unleashed-experiment';

    setupCardAbilities() {
        this.ability
            .dire()
            .affects(($a) => $a.self())
            .effects(($mod) => [$mod.loseAllNonKeywordAbilities()])
            .addPrinted();

        this.ability
            .constant()
            .affects(($a) => $a.self())
            .effects(($mod) => [$mod.honorCostToDeclare(2)])
            .addPrinted();
    }
}
