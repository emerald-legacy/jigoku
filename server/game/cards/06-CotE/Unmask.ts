import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';

class Unmask extends DrawCard {
    static id = 'unmask';

    setupCardAbilities() {
        this.action('Discard a character\'s status token and set skills to printed value')
            .condition((context) => !!(context.player.opponent && context.player.showBid > context.player.opponent.showBid))
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.multiple([
                AbilityDsl.actions.discardStatusToken((context) => ({ target: context.target?.statusTokens })),
                AbilityDsl.actions.cardLastingEffect((context) => ({
                    effect: [
                        AbilityDsl.effects.setMilitarySkill(context.target?.printedMilitarySkill ?? 0),
                        AbilityDsl.effects.setPoliticalSkill(context.target?.printedPoliticalSkill ?? 0)
                    ]
                }))
            ]))
            .gameAction(AbilityDsl.actions.gainHonor((context) => ({ amount: 2, target: context.target?.controller })))
            .effect('discard all status tokens on {0} and set its skill to its printed value until the end of the conflict. {1} gains 2 honor.', (context) => context.target?.controller ?? '');
    }
}


export default Unmask;
