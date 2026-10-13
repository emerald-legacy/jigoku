import * as costs from '../../costs/index.js';
import DrawCard from '../../DrawCard.js';
import { nameCardType, revealCount, takeUpToTwoOfNamedType } from '../nameCardTypeAndTake.js';

class TestOfSkill extends DrawCard {
    static id = 'test-of-skill';

    setupCardAbilities() {
        this.action('Reveal cards and take ones matching named type')
            .condition((context) => context.player.conflictDeck.length >= revealCount(context, 'duelist'))
            .cost(costs.revealCardsOf((context) => context.player.conflictDeck.slice(0, revealCount(context, 'duelist'))))
            .cost(nameCardType())
            .deckSearch((context) => takeUpToTwoOfNamedType(context, 'duelist'))
            .chatText('take cards into their hand')
            .cannotBeMirrored();
    }
}


export default TestOfSkill;
