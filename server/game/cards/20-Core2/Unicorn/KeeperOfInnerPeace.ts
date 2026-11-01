import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { isOpponentsRingOrCardEffect } from '../../effectSource.js';

export default class KeeperOfInnerPeace extends DrawCard {
    static id = 'keeper-of-inner-peace';

    override setupCardAbilities() {
        this.reaction('Add fate to a character')
            .when({
                onMoveFate: (event, context) =>
                    !context.source.bowed &&
                    (event.fate ?? 0) > 0 &&
                    event.origin?.type === CardType.Character &&
                    'controller' in event.origin &&
                    event.origin.controller === context.player &&
                    (event.context?.source.isRing() || isOpponentsRingOrCardEffect(context.player, event.context))
            })
            .placeFate((context) => ({ target: context.event.origin?.isCard() ? context.event.origin : [] }));
    }
}
