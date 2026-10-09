import { msg } from '../../../GameChat.js';
import { CardType } from '../../../Constants.js';
import { increaseCost } from '../../../effects.js';
import { bow, playerLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class CaptureTheFalseEye extends DrawCard {
    static id = 'capture-the-false-eye';

    setupCardAbilities() {
        this.conflictAction('Bow a character')
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card.isParticipating() &&
                    (context.game.currentConflict
                        ?.getCharacters(context.player)
                        .some(
                            (myCard) => myCard.hasTrait('bushi') && myCard.militarySkill >= card.militarySkill
                        ) ?? false)
            }, bow(), playerLastingEffect((context) => ({
                targetController: context.player,
                effect: increaseCost({
                    amount: 1,
                    match: (card) => card.type === CardType.Event
                })
            })))
            .chatText((context) => msg`bow ${context.chatTarget()}. For this conflict, ${context.player}'s events cost 1 more fate - did ${context.player} walk into a trap?`);
    }
}
