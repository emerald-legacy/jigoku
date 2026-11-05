import * as costs from '../../../costs/index.js';
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

    public override setupCardAbilities() {
        this.conflictAction('Dishonor or send a character home')
            .cost(costs.removeFateFromSelf())
            .target({
                name: CHARACTER,
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card.glory > context.source.glory &&
                    !!context.player.opponent &&
                    card.isParticipatingFor(context.player.opponent)
            })
            .select({
                name: 'select',
                dependsOn: CHARACTER,
                player: (context) => context.targets[CHARACTER].controller === context.player ? Players.Self : Players.Opponent
            }, {
                'Dishonor this character': dishonor(theTarget),
                'Move this character home': sendHome(theTarget)
            });
    }
}
