import * as costs from '../../../costs/index.js';
import DrawCard from '../../../DrawCard.js';
import { nameCardType, revealCount, takeUpToTwoOfNamedType } from '../../nameCardTypeAndTake.js';

export default class WorkInProgress extends DrawCard {
    static id = 'work-in-progress';

    setupCardAbilities() {
        this.action('Reveal cards and take ones matching named type')
            .cost(costs.reveal((context) => context.player.conflictDeck.slice(0, revealCount(context, 'artisan'))))
            .cost(nameCardType())
            .condition((context) => context.player.conflictDeck.length >= revealCount(context, 'artisan'))
            .handler((context) => takeUpToTwoOfNamedType(context, context.costs.reveal ?? [], context.costs.namedCardType))
            .effect('take cards into their hand')
            .cannotBeMirrored();
    }
}
