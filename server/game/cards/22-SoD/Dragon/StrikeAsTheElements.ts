import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import { CardTypes, Players, TargetModes } from '../../../Constants';

export default class StrikeAsTheElements extends DrawCard {
    static id = 'strike-as-the-elements';

    setupCardAbilities() {
        this.action({
            title: 'Increase a character\'s military skill',
            condition: (context) => context.game.isDuringConflict(),
            targets: {
                character: {
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: card => card.isParticipating() && card.hasTrait('monk'),
                    gameAction: AbilityDsl.actions.cardLastingEffect({
                        effect: AbilityDsl.effects.modifyMilitarySkill(2)
                    })
                },
                ring: {
                    mode: TargetModes.Ring,
                    activePromptTitle: 'Choose an unclaimed ring',
                    ringCondition: ring => ring.isUnclaimed(),
                    gameAction: AbilityDsl.actions.claimRing({ takeFate: true, type: 'military' })
                }
            },
            effect: 'grant +2{1} to {2} and claim the {3}',
            effectArgs: context => ['military', context.targets.character, context.rings.ring]
        });
    }
}
