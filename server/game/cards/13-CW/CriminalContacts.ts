import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, CardType } from '../../Constants.js';

class CriminalContacts extends DrawCard {
    static id = 'criminal-contacts';

    setupCardAbilities() {
        this.action('Discard a fate from a character')
            .cost(AbilityDsl.costs.optionalHonorTransferFromOpponentCost())
            .condition(context => !!(context.player.opponent && context.player.showBid > context.player.opponent.showBid))
            .target('myCharacter', {
                cardType: CardType.Character
            }, AbilityDsl.actions.removeFate())
            .target('oppCharacter', {
                player: Players.Opponent,
                cardType: CardType.Character,
                optional: true,
                hideIfNoLegalTargets: true,
                cardCondition: (card, context) => Boolean(context.costs.optionalHonorTransferFromOpponentCostPaid)
            }, AbilityDsl.actions.removeFate())
            .effect('discard a fate from {1}{2}', context => [context.targets.myCharacter, this.buildString(context)]);
    }

    buildString(context: AbilityContext) {
        const opponent = context.player.opponent;
        if(opponent && context.targets.oppCharacter && !Array.isArray(context.targets.oppCharacter)) {
            let target = context.targets.oppCharacter;
            return '.  ' + opponent.name + ' gives ' + context.player.name + ' 1 honor to discard a fate from ' + target.name;
        }
        return '';
    }
}


export default CriminalContacts;
