import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class AsakoMaezawa extends DrawCard {
    static id = 'asako-maezawa';

    setupCardAbilities() {
        this.action({
            title: 'Double a character\'s base political skill',
            condition: (context: AbilityContext) => (context.source as DrawCard).isParticipating() && !!context.player.opponent && (
                context.player.cardsInPlay.reduce((myTotal: number, card: any) => myTotal + (card.isParticipating() && !card.bowed ? card.getGlory() : 0), 0) >
                context.player.opponent.cardsInPlay.reduce((oppTotal: number, card: any) => oppTotal + (card.isParticipating() && !card.bowed ? card.getGlory() : 0), 0)
            ),
            target: {
                cardType: CardType.Character,
                cardCondition: (card: any) => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    effect: AbilityDsl.effects.modifyBasePoliticalSkillMultiplier(2)
                })
            },
            effect: 'double {0}\'s base {1} skill',
            effectArgs: () => ['political']
        });
    }
}


export default AsakoMaezawa;
