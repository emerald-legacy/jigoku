import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Duration, Location } from '../../Constants.js';

class AkodoToshiro extends DrawCard {
    static id = 'akodo-toshiro';

    setupCardAbilities() {
        this.action({
            title: 'Gain +5/+0 and provinces can\'t be broken',
            condition: context => context.source.isAttacking(),
            effect: 'gain +5/+0 - provinces cannot be broken during this conflict',
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.cardLastingEffect(() => ({
                    target: this.game.provinceCards,
                    targetLocation: Location.Provinces,
                    effect: AbilityDsl.effects.cardCannot('break')
                })),
                AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.source,
                    effect: AbilityDsl.effects.modifyMilitarySkill(5)
                })),
                AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.source,
                    duration: Duration.UntilEndOfRound,
                    effect: AbilityDsl.effects.delayedEffect({
                        when: {
                            onConflictFinished: () => !context.player.cardsInPlay.some((card: DrawCard) => card.hasTrait('commander'))
                        },
                        message: '{0} is discarded due to his delayed effect',
                        messageArgs: [context.source],
                        gameAction: AbilityDsl.actions.discardFromPlay()
                    })
                }))
            ])
        });
    }
}


export default AkodoToshiro;
