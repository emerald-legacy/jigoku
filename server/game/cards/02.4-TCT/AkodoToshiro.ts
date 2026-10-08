import DrawCard from '../../DrawCard.js';
import { cardCannot, delayedEffect, modifyMilitarySkill } from '../../effects.js';
import { cardLastingEffect, discardFromPlay, multiple } from '../../GameActions/GameActions.js';
import { Duration, Location } from '../../Constants.js';

class AkodoToshiro extends DrawCard {
    static id = 'akodo-toshiro';

    setupCardAbilities() {
        this.action('Gain +5/+0 and provinces can\'t be broken')
            .condition(context => context.source.isAttacking())
            .gameAction(multiple([
                cardLastingEffect(() => ({
                    target: this.game.provinceCards,
                    targetLocation: Location.Provinces,
                    effect: cardCannot('break')
                })),
                cardLastingEffect(context => ({
                    target: context.source,
                    effect: modifyMilitarySkill(5)
                })),
                cardLastingEffect(context => ({
                    target: context.source,
                    duration: Duration.UntilEndOfRound,
                    effect: delayedEffect({
                        when: {
                            onConflictFinished: () => !context.player.cardsInPlay.some((card) => card.hasTrait('commander'))
                        },
                        message: '{0} is discarded due to his delayed effect',
                        messageArgs: [context.source],
                        gameAction: discardFromPlay()
                    })
                }))
            ]))
            .chatText('gain +5/+0 - provinces cannot be broken during this conflict');
    }
}


export default AkodoToshiro;
