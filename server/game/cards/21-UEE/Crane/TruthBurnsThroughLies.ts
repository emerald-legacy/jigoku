import AbilityDsl from '../../../abilitydsl.js';
import { AbilityTypes, CardTypes } from '../../../Constants.js';
import DrawCard from '../../../drawcard.js';
import type { ActionProps } from '../../../Interfaces.js';

export default class TruthBurnsThroughLies extends DrawCard {
    static id = 'truth-burns-through-lies';

    setupCardAbilities() {
        this.attachmentConditions({ trait: ['courtier', 'magistrate'] });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Dishonor a character',
                condition: (context) => context.source.isParticipating(),
                target: {
                    cardType: CardTypes.Character,
                    cardCondition: (card, context) =>
                        card.isParticipating() &&
                        (context.source.hasTrait('magistrate')
                            ? card.printedCost <= context.source.printedCost
                            : card.printedCost < context.source.printedCost),
                    gameAction: AbilityDsl.actions.dishonor()
                }
            } as ActionProps<this>)
        });
    }
}
