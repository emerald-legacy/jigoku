import { CardType, Duration, Phase } from '../../../Constants.js';
import { cardCannot } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class ObstinateWitchHunter extends DrawCard {
    static id = 'obstinate-witch-hunter';

    public setupCardAbilities() {
        this.forcedReaction('Can\'t be discarded or remove fate')
            .when({
                onPhaseStarted: (event, context) =>
                    event.phase === Phase.Fate &&
                    context.game.findAnyCardsInPlay(
                        (card) =>
                            card.type === CardType.Character &&
                            card.isFaceup() &&
                            card !== context.source &&
                            (card.isTainted || card.hasTrait('shadowlands'))
                    ).length > 0
            })
            .cardLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: [cardCannot('removeFate'), cardCannot('discardFromPlay')]
            })
            .chatText('stop him being discarded or losing fate in this phase');
    }
}
