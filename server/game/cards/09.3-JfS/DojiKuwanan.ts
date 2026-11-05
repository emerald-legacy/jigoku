import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { delayedEffect } from '../../effects.js';
import { bow, discardFromPlay } from '../../GameActions/GameActions.js';
import { CardType, ConflictType } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';

function hotaru(context: AbilityContext) {
    return context.player.cardsInPlay.find((card) => card.name === 'Doji Hotaru');
}

class DojiKuwanan extends DrawCard {
    static id = 'doji-kuwanan';

    override setupCardAbilities() {
        this.persistentEffect({
            effect: delayedEffect({
                condition: (context) => !!hotaru(context),
                message: (context) => msg`${hotaru(context)} is discarded from play as its controller controls ${context.source}`,
                gameAction: discardFromPlay((context) => ({
                    target: hotaru(context)
                }))
            })
        });
        this.action('Bow a participating character with lower military skill')
            .condition((context) =>
                context.game.isDuringConflict(ConflictType.Military) && context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card.militarySkill < context.source.militarySkill && card.isParticipating()
            }, bow());
    }
}


export default DojiKuwanan;
