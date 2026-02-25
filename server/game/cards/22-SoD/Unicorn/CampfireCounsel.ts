import { CardTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class CampfireCounsel extends DrawCard {
    static id = 'campfire-counsel';

    setupCardAbilities() {
        this.action({
            title: 'Ready a character',
            condition: context => context.game.isDuringConflict(),
            cost: AbilityDsl.costs.sacrificeSelf(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.printedCost <= 3,
                gameAction: AbilityDsl.actions.ready()
            },
            then: context => ({
                thenCondition: () => !context.player.isCharacterTraitInPlay('storyteller'),
                gameAction: AbilityDsl.actions.dishonor({
                    target: context.target
                }),
                message: '{3} is dishonored',
                messageArgs: _thenContext => [context.target]
            })
        });
    }
}
