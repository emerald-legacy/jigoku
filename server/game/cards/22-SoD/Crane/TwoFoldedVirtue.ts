import { msg } from '../../../GameChat.js';
import { delayedEffect, modifyMilitarySkill } from '../../../effects.js';
import { cardLastingEffect, gainHonor, multiple, playerLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { CardType, Players } from '../../../Constants.js';

export default class TwoFoldedVirtue extends DrawCard {
    static id = 'two-folded-virtue';

    setupCardAbilities() {
        this.action('Increase a character\'s military skill')
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating() && (card.hasTrait('bushi') || card.hasTrait('scout'))
            }, multiple([
                cardLastingEffect((context) => ({
                    effect: modifyMilitarySkill(2),
                    target: context.target
                })),
                playerLastingEffect((context) => ({
                    targetController: context.player,
                    effect: delayedEffect({
                        when: {
                            afterConflict: (event) =>
                                context.player === event.conflict.loser
                        },
                        gameAction: gainHonor({ target: context.player }),
                        message: () => msg`${context.player} gains 1 honor due to the delayed effect of ${context.source}`
                    })
                }))
            ]))
            .chatText((context) => msg`grant +2${'military'} to ${context.chatTarget()} and, if they lose the current conflict, gain 1 honor`);
    }
}
