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

        this.reaction({
            title: 'Gain 1 honor',
            when: {
                afterConflict: (event, context) => context.source.attachedCharacter && context.source.attachedCharacter.isParticipating() &&
                    event.conflict.winner === context.source.attachedCharacter.controller && context.source.attachedCharacter.isDishonored
            },
            gameAction: AbilityDsl.actions.gainHonor()
        });
    }
}
