import { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
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
        this.forcedReaction({
            title: 'Discard fate and characters',
            when: {
                onPhaseStarted: (event, context) =>
                    event.phase === Phases.Fate &&
                    context.source.parent &&
                    !context.source.parent.bowed &&
                    context.source.parent.getFate() > 0
            },
            effect: 'discard all characters without fate and remove 1 fate from each character with fate',
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.discardFromPlay((context) => ({
                    target: cardsInPlay(context, (c) => c.getFate() === 0)
                })),
                AbilityDsl.actions.removeFate((context) => ({
                    target: cardsInPlay(context, (c) => c.getFate() !== 0)
                }))
            ])
        });
    }
}
