import DrawCard from '../../DrawCard.js';

export default class UnleashedExperiment extends DrawCard {
    static id = 'unleashed-experiment';

    setupCardAbilities() {
        this.ability
            .dire()
            .appliesTo(($subject) => $subject.self())
            .modifiers(($modifier) => [$modifier.loseAllNonKeywordAbilities()])
            .addPrinted();

        this.ability
            .constant()
            .appliesTo(($subject) => $subject.self())
            .modifiers(($modifier) => [$modifier.honorCostToDeclare(2)])
            .addPrinted();
    }
}
