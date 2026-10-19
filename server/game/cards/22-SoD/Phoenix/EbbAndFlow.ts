import { CardType, Players, Trait } from '../../../Constants.js';
import { blank, gainAllAbilities, switchBaseSkills } from '../../../effects.js';
import { cardLastingEffect, joint, loseFate, noAction } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';
import { canSwitchSkills } from '../../switchSkills.js';

export default class EbbAndFlow extends DrawCard {
    static id = 'ebb-and-flow';

    public override setupCardAbilities() {
        this.conflictAction('Switch a character\'s skills')
            .target({
                name: 'mine',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating() && card.hasTrait(Trait.Shugenja)
            }, noAction())
            .target({
                name: 'opponents',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating() && canSwitchSkills(card)
            }, cardLastingEffect({
                effect: switchBaseSkills()
            }))
            .chatText((context) => msg`switch ${context.targets.opponents}'s military and political skill`)
            .afterwardsIf((context) => context.player.fate > 0 && loseFate({ spend: true }).canAffect(context.player, context))
            .onAffinity(Trait.Water, {
                activePromptTitle: 'Pay 1 fate to swap abilities?',
                chatText: (context) => msg`swap the abilities of ${context.targets.mine} and ${context.targets.opponents}`
            })
            .gameAction(joint([
                loseFate({ spend: true }),
                cardLastingEffect((context) => ({
                    target: context.targets.mine,
                    effect: [
                        blank(),
                        gainAllAbilities(context.targets.opponents, true)
                    ]
                })),
                cardLastingEffect((context) => ({
                    target: context.targets.opponents,
                    effect: [
                        blank(),
                        gainAllAbilities(context.targets.mine, true)
                    ]
                }))
            ]));
    }
}
