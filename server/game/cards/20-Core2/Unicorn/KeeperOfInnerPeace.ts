import { CardType } from '../../../Constants.js';
import BaseCard from '../../../BaseCard.js';
import DrawCard from '../../../DrawCard.js';
import Ring from '../../../Ring.js';
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
                    (event.context?.source instanceof Ring || isOpponentsRingOrCardEffect(context.player, event.context))
            })
            .placeFate((context) => ({ target: context.event.origin instanceof BaseCard ? context.event.origin : [] }));
    }
}
