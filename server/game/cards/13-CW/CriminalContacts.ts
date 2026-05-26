import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, CardTypes } from '../../Constants.js';

class CriminalContacts extends DrawCard {
    static id = 'criminal-contacts';

    setupCardAbilities() {
        this.action({
            title: 'Discard a fate from a character',
            cost: AbilityDsl.costs.optionalHonorTransferFromOpponentCost(),
            condition: context => context.player.opponent && context.player.showBid > context.player.opponent.showBid,
            targets: {
                myCharacter: {
                    cardType: CardTypes.Character,
                    gameAction: AbilityDsl.actions.removeFate()
                },
                oppCharacter: {
                    player: Players.Opponent,
                    cardType: CardTypes.Character,
                    optional: true,
                    hideIfNoLegalTargets: true,
                    cardCondition: (card, context) => context.costs.optionalHonorTransferFromOpponentCostPaid,
                    gameAction: AbilityDsl.actions.removeFate()
                }
            },
            effect: 'discard a fate from {1}{2}',
            effectArgs: context => [context.targets.myCharacter, this.buildString(context)]
        });
    }

    buildString(context: any) {
        if(context.targets.oppCharacter && !Array.isArray(context.targets.oppCharacter)) {
            let target = context.targets.oppCharacter;
            return '.  ' + context.player.opponent.name + ' gives ' + context.player.name + ' 1 honor to discard a fate from ' + target.name;
        }
        return '';
    }
}


export default CriminalContacts;
