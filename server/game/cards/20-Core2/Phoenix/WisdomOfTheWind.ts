import { CardTypes, Durations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class WisdomOfTheWind extends DrawCard {
    static id = 'wisdom-of-the-wind';

    setupCardAbilities() {
        this.action({
            title: 'Honor or dishonor a character',
            effect: 'honor or dishonor {0}',
            condition: (context) =>
                context.game.isDuringConflict() &&
                context.player.cardsInPlay.some((card: DrawCard) => card.hasTrait('shugenja')),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card: DrawCard) => card.isParticipating(),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.chooseAction({
                        options: {
                            'Honor this character': {
                                action: AbilityDsl.actions.honor(),
                                message: '{0} chooses to honor {1}'
                            },
                            'Dishonor this character': {
                                action: AbilityDsl.actions.dishonor(),
                                message: '{0} chooses to dishonor {1}'
                            }
                        }
                    }),
                    AbilityDsl.actions.onAffinity(context => ({
                        trait: 'air',
                        gameAction: AbilityDsl.actions.cardLastingEffect({
                            target: context.target,
                            effect: AbilityDsl.effects.modifyGlory(2),
                            duration: Durations.UntilEndOfConflict
                        }),
                        effect: 'give {0} +2 glory',
                        effectArgs: () => [context.target]
                    }))
                ])
            }
        });
    }
}
