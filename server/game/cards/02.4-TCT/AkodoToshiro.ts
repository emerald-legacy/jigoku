import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { cardCannot, delayedEffect, modifyMilitarySkill } from '../../effects.js';
import { cardLastingEffect, discardFromPlay, multiple } from '../../GameActions/GameActions.js';
import { Duration, Location, RestrictionType } from '../../Constants.js';

class AkodoToshiro extends DrawCard {
    static id = 'akodo-toshiro';

    setupCardAbilities() {
        this.action('Gain +5/+0 and provinces can\'t be broken')
            .condition((context) => context.source.isAttacking())
            .gameAction(multiple([
                cardLastingEffect(() => ({
                    target: this.game.provinceCards,
                    targetLocation: Location.Provinces,
                    effect: cardCannot(RestrictionType.Break)
                })),
                cardLastingEffect((context) => ({
                    target: context.source,
                    effect: modifyMilitarySkill(5)
                })),
                cardLastingEffect((context) => ({
                    target: context.source,
                    duration: Duration.UntilEndOfRound,
                    effect: delayedEffect({
                        when: {
                            onConflictFinished: () => !context.player.cardsInPlay.some((card) => card.hasTrait('commander'))
                        },
                        message: () => msg`${context.source} is discarded due to his delayed effect`,
                        gameAction: discardFromPlay()
                    })
                }))
            ]))
            .chatText('gain +5/+0 - provinces cannot be broken during this conflict');
    }
}


export default AkodoToshiro;
