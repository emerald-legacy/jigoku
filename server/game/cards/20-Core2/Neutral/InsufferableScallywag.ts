import AbilityDsl from '../../../abilitydsl.js';
import { dishonor, sendHome } from '../../../GameActions/GameActions.js';
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
            .target({
                name: CHARACTER,
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) =>
                    card.glory > context.source.glory && card.isParticipating()
            })
            .select({
                name: 'select',
                dependsOn: CHARACTER,
                player: Players.Opponent
            }, {
                'Dishonor this character': dishonor(theTarget),
                'Move this character home': sendHome(theTarget)
            });
    }
}
