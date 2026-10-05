import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, CardType } from '../../Constants.js';
import { honorTransferMessage } from '../honorTransferMessage.js';

class CriminalContacts extends DrawCard {
    static id = 'criminal-contacts';

    setupCardAbilities() {
        this.action('Discard a fate from a character')
            .cost(AbilityDsl.costs.optionalHonorTransferFromOpponentCost())
            .condition(context => !!(context.player.opponent && context.player.showBid > context.player.opponent.showBid))
            .target({
                name: 'myCharacter',
                cardType: CardType.Character
            }, AbilityDsl.actions.removeFate())
            .target({
                name: 'oppCharacter',
                player: Players.Opponent,
                cardType: CardType.Character,
                optional: true,
                hideIfNoLegalTargets: true,
                cardCondition: (_card, context) => Boolean(context.costs.optionalHonorTransferFromOpponentCostPaid)
            }, AbilityDsl.actions.removeFate())
            .effect('discard a fate from {1}{2}', (context) => [
                context.targets.myCharacter,
                honorTransferMessage(context, context.targets.oppCharacter, (name) => 'discard a fate from ' + name)
            ]);
    }
}


export default CriminalContacts;
