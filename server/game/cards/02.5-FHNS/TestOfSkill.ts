import * as costs from '../../costs/index.js';
import DrawCard from '../../DrawCard.js';
import { nameCardType, revealCount, takeUpToTwoOfNamedType } from '../nameCardTypeAndTake.js';

class TestOfSkill extends DrawCard {
    static id = 'test-of-skill';

    setupCardAbilities() {
        this.action('Reveal cards and take ones matching named type')
            .cost(costs.revealCardsOf((context) => context.player.conflictDeck.slice(0, revealCount(context, 'duelist'))))
            .cost(nameCardType())
            .condition((context) => context.player.conflictDeck.length >= revealCount(context, 'duelist'))
            .handler((context) => takeUpToTwoOfNamedType(context, context.costs.reveal ?? [], context.costs.namedCardType))
            .chatText('take cards into their hand')
            .cannotBeMirrored();
    }
}


export default TestOfSkill;
