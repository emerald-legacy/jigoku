import { Trait } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import DrawCard from '../../../DrawCard.js';
import { nameCardType, revealCount, takeUpToTwoOfNamedType } from '../../nameCardTypeAndTake.js';

export default class WorkInProgress extends DrawCard {
    static id = 'work-in-progress';

    setupCardAbilities() {
        this.action('Reveal cards and take ones matching named type')
            .condition((context) => context.player.conflictDeck.length >= revealCount(context, Trait.Artisan))
            .cost(costs.revealCardsOf((context) => context.player.conflictDeck.slice(0, revealCount(context, Trait.Artisan))))
            .cost(nameCardType())
            .deckSearch((context) => takeUpToTwoOfNamedType(context, Trait.Artisan))
            .chatText('take cards into their hand')
            .cannotBeMirrored();
    }
}
