import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { AbilityContext } from '../../../AbilityContext.js';

const CHARACTER = 'character';

function theTarget(context: AbilityContext) {
    return { target: context.targets[CHARACTER] };
}

export default class InsufferableScallywag extends DrawCard {
    static id = 'insufferable-scallywag';

    public setupCardAbilities() {
        this.action('Dishonor or send a character home')
            .cost(AbilityDsl.costs.removeFateFromSelf())
            .condition((context) => context.source.isParticipating())
            .target(CHARACTER, {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) =>
                    card.glory > context.source.glory && card.isParticipating()
            })
            .select('select', {
                dependsOn: CHARACTER,
                player: Players.Opponent
            }, {
                'Dishonor this character': AbilityDsl.actions.dishonor(theTarget),
                'Move this character home': AbilityDsl.actions.sendHome(theTarget)
            });
    }
}
