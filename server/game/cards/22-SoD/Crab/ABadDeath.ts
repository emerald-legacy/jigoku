import { CardTypes, Players, TargetModes } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class ABadDeath extends DrawCard {
    static id = 'a-bad-death';

    public setupCardAbilities() {
        this.reaction({
            title: 'Sacrifice a character to dishonor characters',
            when: {
                afterConflict: (event, context) => event.conflict.loser === context.player && !!context.player.opponent
            },
            cost: AbilityDsl.costs.dishonorAndSacrifice({
                cardType: CardTypes.Character,
                cardCondition: (card: DrawCard) => card.isParticipating()
            }),
            cannotTargetFirst: true,
            target: {
                mode: TargetModes.UpToVariable,
                numCardsFunc: (context) => context.costs.dishonorAndSacrificeStateWhenChosen?.hasTrait('berserker') ? 2 : 1,
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card: any) => card.isParticipating(),
                gameAction: AbilityDsl.actions.dishonor()
            },
            then: (context: any) => ({
                message: '{0} draws a card',
                gameAction: AbilityDsl.actions.draw({
                    target: context.player,
                    amount: 1
                })
            })
        });
    }
}
