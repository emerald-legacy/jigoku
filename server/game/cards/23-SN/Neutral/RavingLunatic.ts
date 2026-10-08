import DrawCard from '../../../DrawCard.js';
import { AbilityType, Players, CardType } from '../../../Constants.js';
import { gainAbility, modifyMilitarySkill } from '../../../effects.js';
import { injure } from '../../../GameActions/GameActions.js';
import { type ResolvedAbilityContext } from '../../../AbilityContext.js';

export default class RavingLunatic extends DrawCard {
    static id = 'raving-lunatic';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => !!(context.player.opponent && context.player.opponent.showBid % 2 === 1),
            effect: gainAbility(AbilityType.Action, {
                title: 'Injure a character',
                condition: (context) => context.source.isParticipating(),
                target: {
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    cardCondition: (card) => card.isParticipating(),
                    gameAction: injure((context: ResolvedAbilityContext<DrawCard, DrawCard>) => ({
                        target: [context.target, context.source]
                    }))
                }
            })
        });

        this.persistentEffect({
            condition: (context) => !!(context.player.opponent && context.player.opponent.showBid % 2 === 0),
            effect: modifyMilitarySkill(2)
        });
    }
}
