import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class AncestralKabuto extends DrawCard {
    static id = 'ancestral-kabuto';

    public setupCardAbilities() {
        this.attachmentConditions({ trait: 'bushi' });

        this.whileAttached({
            match: (card: DrawCard) => card.isDishonored,
            effect: AbilityDsl.effects.setGlory(0)
        });

        this.reaction('Gain 1 honor')
            .when({
                afterConflict: (event, context) => context.source.parentCharacter && context.source.parentCharacter.isParticipating() &&
                    event.conflict.winner === context.source.parentCharacter.controller && context.source.parentCharacter.isDishonored
            })
            .gameAction(AbilityDsl.actions.gainHonor());
    }
}
