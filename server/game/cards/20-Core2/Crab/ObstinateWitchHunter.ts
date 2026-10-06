import { CardType, Duration, Phases } from '../../../Constants.js';
import { cardCannot } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class ObstinateWitchHunter extends DrawCard {
    static id = 'obstinate-witch-hunter';

    public setupCardAbilities() {
        this.forcedReaction('Can\'t be discarded or remove fate')
            .when({
                onPhaseStarted: (event, context) =>
                    event.phase === Phases.Fate &&
                    context.game.findAnyCardsInPlay(
                        (card) =>
                            card.type === CardType.Character &&
                            card.isFaceup() &&
                            card !== context.source &&
                            (card.isTainted || card.hasTrait('shadowlands'))
                    ).length > 0
            })
            .gameAction(cardLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: [cardCannot('removeFate'), cardCannot('discardFromPlay')]
            }))
            .effect('stop him being discarded or losing fate in this phase');
    }
}
