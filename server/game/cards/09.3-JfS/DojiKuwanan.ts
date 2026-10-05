import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, ConflictType } from '../../Constants.js';

class DojiKuwanan extends DrawCard {
    static id = 'doji-kuwanan';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.delayedEffect({
                condition: (context) =>
                    context.player.cardsInPlay.find((card) => card.name === 'Doji Hotaru'),
                message: '{1} is discarded from play as its controller controls {0}',
                messageArgs: (context) => [
                    context.source,
                    context.player.cardsInPlay.find((card) => card.name === 'Doji Hotaru')
                ],
                gameAction: AbilityDsl.actions.discardFromPlay((context) => ({
                    target: context.player.cardsInPlay.find((card) => card.name === 'Doji Hotaru')
                }))
            })
        });
        this.action('Bow a participating character with lower military skill')
            .condition((context) =>
                context.game.isDuringConflict(ConflictType.Military) && context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card.getMilitarySkill() < context.source.getMilitarySkill() && card.isParticipating()
            }, AbilityDsl.actions.bow());
    }
}


export default DojiKuwanan;
