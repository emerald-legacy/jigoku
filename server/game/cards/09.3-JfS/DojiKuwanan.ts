import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes } from '../../Constants.js';

class DojiKuwanan extends DrawCard {
    static id = 'doji-kuwanan';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.delayedEffect({
                condition: (context: AbilityContext) =>
                    context.player && context.player.cardsInPlay.find((card: any) => card.name === 'Doji Hotaru'),
                message: '{1} is discarded from play as its controller controls {0}',
                messageArgs: (context: AbilityContext) => [
                    context.source,
                    context.player.cardsInPlay.find((card: any) => card.name === 'Doji Hotaru')
                ],
                gameAction: AbilityDsl.actions.discardFromPlay((context: AbilityContext) => ({
                    target: context.player.cardsInPlay.find((card: any) => card.name === 'Doji Hotaru')
                }))
            })
        });
        this.action({
            title: 'Bow a participating character with lower military skill',
            condition: (context) =>
                context.source.game.isDuringConflict('military') && context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card: any, context: any) =>
                    card.getMilitarySkill() < context.source.getMilitarySkill() && card.isParticipating(),
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}


export default DojiKuwanan;
