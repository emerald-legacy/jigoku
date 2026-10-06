import type { AbilityContext } from '../../../AbilityContext.js';
import { discardFromPlay, multiple, removeFate } from '../../../GameActions/GameActions.js';
import { Phases } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

function cardsInPlay(context: AbilityContext, predicate: (card: DrawCard) => boolean) {
    return context.player.cardsInPlay
        .filter(predicate)
        .concat(context.player.opponent?.cardsInPlay.filter(predicate) ?? []);
}

export default class CripplingCurse extends DrawCard {
    static id = 'crippling-curse';

    setupCardAbilities() {
        this.forcedReaction('Discard fate and characters')
            .when({
                onPhaseStarted: (event, context) =>
                    event.phase === Phases.Fate &&
                    context.source.parentCharacter &&
                    !context.source.parentCharacter.bowed &&
                    context.source.parentCharacter.getFate() > 0
            })
            .gameAction(multiple([
                discardFromPlay((context) => ({
                    target: cardsInPlay(context, (c) => c.getFate() === 0)
                })),
                removeFate((context) => ({
                    target: cardsInPlay(context, (c) => c.getFate() !== 0)
                }))
            ]))
            .effect('discard all characters without fate and remove 1 fate from each character with fate');
    }
}
