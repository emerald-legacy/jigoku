import { msg } from '../../../GameChat.js';
import { CardType, Players } from '../../../Constants.js';
import { delayedEffect, modifyMilitarySkill } from '../../../effects.js';
import {
    cardLastingEffect,
    claimImperialFavor,
    honor,
    joint,
    loseImperialFavor,
    playerLastingEffect,
    sequential
} from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class DeedsNotWords extends DrawCard {
    static id = 'deeds-not-words';

    setupCardAbilities() {
        this.action('Give a character +2 mil')
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating()
            }, sequential([
                cardLastingEffect({
                    effect: modifyMilitarySkill(2)
                }),
                playerLastingEffect((context) => ({
                    targetController: context.player,
                    effect: delayedEffect({
                        when: {
                            afterConflict: (event) =>
                                context.player === event.conflict.winner
                        },
                        gameAction: claimImperialFavor(() => ({ target: context.player })),
                        message: () => msg`${context.player} claims the Imperial Favor due to the delayed effect of ${context.source}`
                    })
                }))
            ]))
            .chatText('give {0} +2{1}', () => ['military'])
            .afterwardsIf((context) => context.player.imperialFavor !== '')
            .select({}, {
                'Discard the Imperial Favor': joint([
                    loseImperialFavor((context) => ({ target: context.player })),
                    honor((context) => ({ target: context.target }))
                ]),
                Done: () => true
            });
    }
}
