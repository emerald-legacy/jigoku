import DrawCard from '../../../DrawCard.js';
import { reduceCost } from '../../../effects.js';
import { CardType, Location, Players, Element } from '../../../Constants.js';
import { controlsShugenja } from '../../controlsShugenja.js';

export default class JadePrison extends DrawCard {
    static id = 'jade-prison';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            condition: (context) => context.player.hasAffinity(Element.Earth, context),
            effect: reduceCost({ amount: 1, match: (card, source) => card === source })
        });

        this.reaction('Bow a character that just readied')
            .when({
                onCardReadied: (event, context) =>
                    event.card.type === CardType.Character && event.card.controller === context.player.opponent &&
                    (event.card.hasSomeTrait('corrupt', 'shadowlands') || event.card.isTainted)
            })
            .playOnlyIf((context) => controlsShugenja(context.player))
            .bow((context) => ({ target: context.event.card }));
    }
}
