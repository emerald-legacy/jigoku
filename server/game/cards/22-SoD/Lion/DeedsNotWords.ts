import { msg } from '../../../GameChat.js';
import { CardType, Players } from '../../../Constants.js';
import { delayedEffect, modifyMilitarySkill } from '../../../effects.js';
import {
    cardLastingEffect,
    chooseAction,
    claimImperialFavor,
    conditional,
    honor,
    joint,
    loseImperialFavor,
    multiple,
    noAction,
    playerLastingEffect
} from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class DeedsNotWords extends DrawCard {
    static id = 'deeds-not-words';

    override setupCardAbilities() {
        this.conflictAction('Give a character +2 mil')
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating()
            }, multiple([
                cardLastingEffect({
                    effect: modifyMilitarySkill(2)
                }),
                playerLastingEffect((context) => ({
                    target: Players.Self,
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
            .gameAction(conditional((context) => ({
                condition: context.player.imperialFavor !== '',
                trueGameAction: chooseAction({
                    choices: {
                        'Discard the Imperial Favor': joint([
                            loseImperialFavor({ target: context.player }),
                            honor({ target: context.target })
                        ]),
                        Done: noAction()
                    }
                })
            })))
            .chatText((context) => msg`give ${context.chatTarget()} +2${'military'}`);
    }
}
