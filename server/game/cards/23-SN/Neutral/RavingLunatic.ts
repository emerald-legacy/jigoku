import DrawCard from '../../../DrawCard.js';
import { Players, CardType } from '../../../Constants.js';
import { gainAbility, modifyMilitarySkill } from '../../../effects.js';
import { injure } from '../../../GameActions/GameActions.js';

export default class RavingLunatic extends DrawCard {
    static id = 'raving-lunatic';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => !!(context.player.opponent && context.player.opponent.showBid % 2 === 1),
            effect: gainAbility.action('Injure a character', (ability) => ability
                .condition((context) => context.source.isParticipating())
                .target({
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    cardCondition: (card) => card.isParticipating()
                }, injure((context) => ({
                    target: [context.target, context.source]
                }))))
        });

        this.persistentEffect({
            condition: (context) => !!(context.player.opponent && context.player.opponent.showBid % 2 === 0),
            effect: modifyMilitarySkill(2)
        });
    }
}
