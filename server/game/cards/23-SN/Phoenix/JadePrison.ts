import DrawCard from '../../../DrawCard.js';
import { reduceCost } from '../../../effects.js';
import { bow } from '../../../GameActions/GameActions.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Location, Players } from '../../../Constants.js';
import { controlsShugenja } from '../../controlsShugenja.js';

export default class JadePrison extends DrawCard {
    static id = 'jade-prison';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            condition: (context) => context.player.hasAffinity('earth', context),
            effect: reduceCost({ amount: 1, match: (card, source) => card === source })
        });

        this.reaction('Bow a character that just readied')
            .when({
                onCardReadied: (event, context) =>
                    event.card.type === CardType.Character && event.card.controller === context.player.opponent &&
                    (event.card.hasSomeTrait('corrupt', 'shadowlands') || event.card.isTainted)
            })
            .gameAction(bow((context) => ({ target: context.event.card })));
    }

    canPlay(context: AbilityContext, playType: string) {
        if(!controlsShugenja(context.player)) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}
