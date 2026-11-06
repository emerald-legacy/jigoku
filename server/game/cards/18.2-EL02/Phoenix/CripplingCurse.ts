import type { AbilityContext } from '../../../AbilityContext.js';
import { Phase } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

function charactersInPlay(context: AbilityContext, predicate: (card: DrawCard) => boolean) {
    return context.player.charactersInPlay
        .filter(predicate)
        .concat(context.player.opponent?.charactersInPlay.filter(predicate) ?? []);
}

export default class CripplingCurse extends DrawCard {
    static id = 'crippling-curse';

    override setupCardAbilities() {
        this.forcedReaction('Discard fate and characters')
            .when({
                onPhaseStarted: (event, context) =>
                    event.phase === Phase.Fate &&
                    context.source.parentCharacter &&
                    !context.source.parentCharacter.bowed &&
                    context.source.parentCharacter.getFate() > 0
            })
            .discardFromPlay((context) => ({
                target: charactersInPlay(context, (c) => c.getFate() === 0)
            }))
            .removeFate((context) => ({
                target: charactersInPlay(context, (c) => c.getFate() !== 0)
            }))
            .chatText('discard all characters without fate and remove 1 fate from each character with fate');
    }
}
