import DrawCard from '../../DrawCard.js';

export default class CloudTheMind extends DrawCard {
    static id = 'cloud-the-mind';

    setupCardAbilities() {
        this.ability.playOnlyIf((ctx) => ctx.player.anyCardsInPlay((card) => card.hasTrait('shugenja')));

        this.ability
            .constant()
            .appliesTo(($subject) => $subject.attachedCharacter())
            .modifiers(($modifier) => [$modifier.blank()])
            .addPrinted();
    }
}
