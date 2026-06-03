import { CardType, Duration, Location, Phases } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import BaseCard from '../../../BaseCard.js';
import DrawCard from '../../../DrawCard.js';

export default class ObstinateWitchHunter extends DrawCard {
    static id = 'obstinate-witch-hunter';

    public setupCardAbilities() {
        this.forcedReaction({
            title: 'Can\'t be discarded or remove fate',
            when: {
                onPhaseStarted: (event, context) =>
                    event.phase === Phases.Fate &&
                    context.game.allCards.some(
                        (card: BaseCard) =>
                            card instanceof DrawCard &&
                            card.type === CardType.Character &&
                            card.location === Location.PlayArea &&
                            card.isFaceup() &&
                            card !== context.source &&
                            (card.isTainted || card.hasTrait('shadowlands'))
                    )
            },
            effect: 'stop him being discarded or losing fate in this phase',
            gameAction: AbilityDsl.actions.cardLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: [AbilityDsl.effects.cardCannot('removeFate'), AbilityDsl.effects.cardCannot('discardFromPlay')]
            })
        });
    }
}
