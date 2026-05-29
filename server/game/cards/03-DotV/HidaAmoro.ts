import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Players } from '../../Constants.js';

class HidaAmoro extends DrawCard {
    static id = 'hida-amoro';

    setupCardAbilities() {
        this.forcedReaction({
            title: 'Sacrifice a character',
            when: {
                onConflictPass: () => true
            },
            limit: AbilityDsl.limit.perPhase(Infinity),
            effect: 'force {1} to sacrifice a character',
            effectArgs: (context) => context.event.conflict.attackingPlayer,
            gameAction: AbilityDsl.actions.selectCard((context) => ({
                player: context.event.conflict.attackingPlayer === context.player ? Players.Self : Players.Opponent,
                activePromptTitle: 'Choose a character to sacrifice',
                cardType: CardTypes.Character,
                cardCondition: (card) => card.controller === context.event.conflict.attackingPlayer,
                message: '{0} sacrifices {1} to {2}',
                messageArgs: (card) => [context.event.conflict.attackingPlayer, card, context.source],
                gameAction: AbilityDsl.actions.sacrifice()
            }))
        });
    }
}


export default HidaAmoro;
