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
                cardCondition: card => card.isParticipating() && (card.hasTrait('bushi') || card.hasTrait('scout'))
            }, multiple([
                cardLastingEffect(context => ({
                    effect: modifyMilitarySkill(2),
                    target: context.target
                })),
                playerLastingEffect(context => ({
                    targetController: context.player,
                    effect: delayedEffect({
                        when: {
                            afterConflict: (event) =>
                                context.player === event.conflict.loser
                        },
                        gameAction: gainHonor({ target: context.player }),
                        message: '{0} gains 1 honor due to the delayed effect of {1}',
                        messageArgs: [context.player, context.source]
                    })
                }))
            ]))
            .chatText('grant +2{1} to {0} and, if they lose the current conflict, gain 1 honor', () => ['military']);
    }
}
