import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';
import { Players, CardTypes } from '../../Constants.js';

class Unmask extends DrawCard {
    static id = 'unmask';

    setupCardAbilities() {
        this.action({
            title: 'Discard a character\'s status token and set skills to printed value',
            condition: (context: AbilityContext) => !!(context.player.opponent && context.player.showBid > context.player.opponent.showBid),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: (card: any) => card.isParticipating(),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.discardStatusToken((context: AbilityContext) => ({ target: context.target.statusTokens })),
                    AbilityDsl.actions.cardLastingEffect((context: AbilityContext) => ({
                        effect: [
                            AbilityDsl.effects.setMilitarySkill(context.target.printedMilitarySkill),
                            AbilityDsl.effects.setPoliticalSkill(context.target.printedPoliticalSkill)
                        ]
                    }))
                ])
            },
            gameAction: AbilityDsl.actions.gainHonor((context: AbilityContext) => ({ amount: 2, target: context.target.controller })),
            effect: 'discard all status tokens on {0} and set its skill to its printed value until the end of the conflict. {1} gains 2 honor.',
            effectArgs: (context: AbilityContext) => context.target.controller
        });
    }
}


export default Unmask;
