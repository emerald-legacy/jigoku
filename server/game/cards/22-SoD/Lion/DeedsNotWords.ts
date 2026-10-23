import { msg } from '../../../GameChat.js';
import { CardType, EventName, Players } from '../../../Constants.js';
import { delayedEffect, modifyMilitarySkill } from '../../../effects.js';
import {
    cardLastingEffect,
    chooseAction,
    claimImperialFavor,
    conditional,
    honor,
    loseImperialFavor,
    multiple,
    noAction,
    playerLastingEffect,
    sequential
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
                        'Discard the Imperial Favor': sequential([
                            loseImperialFavor({ target: context.player }),
                            conditional({
                                // "to": only if the favor was discarded (Ikoma Yumiko's Dagger can replace it)
                                condition: (context) => context.events.some((event) =>
                                    event.is(EventName.OnDiscardFavor) && event.isFullyResolved()),
                                trueGameAction: honor({ target: context.target })
                            })
                        ]),
                        Done: noAction()
                    }
                })
            })))
            .chatText((context) => msg`give ${context.chatTarget()} +2${'military'}`);
    }
}
