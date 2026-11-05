import DrawCard from '../../../DrawCard.js';
import { CardType } from '../../../Constants.js';
import { gainAbility, modifyMilitarySkill } from '../../../effects.js';
import { injure } from '../../../GameActions/GameActions.js';

export default class RavingLunatic extends DrawCard {
    static id = 'raving-lunatic';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => !!(context.player.opponent && context.player.opponent.showBid % 2 === 1),
            effect: gainAbility.conflictAction('Injure a character', (ability) => ability
                .target({
                    cardType: CardType.Character,
                    cardCondition: (card, context) => !!context.player.opponent && card.isParticipatingFor(context.player.opponent)
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
