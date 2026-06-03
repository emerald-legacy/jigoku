import { CardType, Players, TargetMode } from '../../../Constants.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class ABadDeath extends DrawCard {
    static id = 'a-bad-death';

    public setupCardAbilities() {
        this.reaction({
            title: 'Sacrifice a character to dishonor characters',
            when: {
                afterConflict: (event, context) => event.conflict.loser === context.player && !!context.player.opponent
            },
            cost: AbilityDsl.costs.dishonorAndSacrifice({
                cardType: CardType.Character,
                cardCondition: (card: DrawCard) => card.isParticipating()
            }),
            cannotTargetFirst: true,
            target: {
                mode: TargetMode.UpToVariable,
                numCardsFunc: (context) => (context.costs.dishonorAndSacrificeStateWhenChosen as DrawCard)?.hasTrait('berserker') ? 2 : 1,
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card: any) => card.isParticipating(),
                gameAction: AbilityDsl.actions.dishonor()
            },
            then: (context: AbilityContext) => ({
                message: '{0} draws a card',
                gameAction: AbilityDsl.actions.draw({
                    target: context.player,
                    amount: 1
                })
            })
        });
    }
}
